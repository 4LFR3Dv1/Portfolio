/* global URL, URLSearchParams, fetch, console, process, Buffer */
import { createHash } from 'node:crypto';
import { readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { connect as connectTls } from 'node:tls';
import { createCurrentCommissionedRuntime } from '../runtime/current-commissioned-runtime.mjs';

const EXPECTED_PUBLICATION_DIGEST = 'sha256_f72c807283aa0f2da0a20b3ecaf1ec5f99227fedac47aa9fb988f5c924997d32';
const EXPECTED_RENDERER_INPUT_DIGEST = 'sha256_4b2bc45e2127befd4f7be0aaf7b4a2cebe0ad7ab9da7a7fa774414af155d73e6';
const EXPECTED_DISTRIBUTION_DIGEST = 'sha256_b7813fa7400b1ad205cd82bf32ecad86d4c9790d7d03630033dcc68c6d8dc308';

const distRoot = fileURLToPath(new URL('../current-dist/', import.meta.url));
const rawPreviewOrigin = process.env.PREVIEW_ORIGIN;
if (!rawPreviewOrigin) throw new Error('r2-a1-current-preview-origin-required');

const previewUrl = new URL(rawPreviewOrigin);
if (previewUrl.protocol !== 'https:') throw new Error(`r2-a1-current-preview-origin-not-https:${previewUrl.protocol}`);
if (previewUrl.username || previewUrl.password) throw new Error('r2-a1-current-preview-origin-credentials-forbidden');
if (previewUrl.pathname !== '/' || previewUrl.search || previewUrl.hash) {
  throw new Error(`r2-a1-current-preview-origin-must-be-origin-only:${rawPreviewOrigin}`);
}
if (previewUrl.hostname === 'renan.snelabs.space' || previewUrl.hostname === 'www.renan.snelabs.space') {
  throw new Error('r2-a1-current-production-origin-forbidden');
}
const previewOrigin = previewUrl.origin;

function sha256(buffer) {
  return `sha256:${createHash('sha256').update(buffer).digest('hex')}`;
}

function walk(directory) {
  return readdirSync(directory).flatMap((name) => {
    const path = join(directory, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

function htmlFileForRoute(path) {
  return path === '/' ? 'index.html' : `${path.replace(/^\//, '')}/index.html`;
}

function normalizeContentType(value) {
  if (!value) return null;
  return value.split(';').map((part) => part.trim().toLowerCase()).join(';');
}

function cacheDirectives(value) {
  return new Set((value ?? '').split(',').map((part) => part.trim().toLowerCase()).filter(Boolean));
}

const semanticHeaderNames = [
  'content-type',
  'cache-control',
  'x-content-type-options',
  'content-language',
  'x-robots-tag',
  'link',
  'location',
  'x-commissioned-runtime',
  'x-publication-digest',
  'x-renderer-input-digest',
  'x-distribution-digest',
];

function selectedHeaders(headers) {
  return Object.fromEntries(semanticHeaderNames.map((name) => [name, headers.get(name)]));
}

function transportHeaders(headers) {
  const names = [
    'server',
    'via',
    'age',
    'date',
    'content-encoding',
    'alt-svc',
    'cf-ray',
    'x-vercel-id',
    'x-railway-request-id',
    'x-request-id',
  ];
  return Object.fromEntries(names.map((name) => [name, headers.get(name)]).filter(([, value]) => value !== null));
}

async function observe(origin, path, { compareBody = true, headers = undefined } = {}) {
  const response = await fetch(`${origin}${path}`, { redirect: 'manual', headers });
  let bodySha256 = null;
  let bodyBytes = 0;
  if (compareBody) {
    const bytes = Buffer.from(await response.arrayBuffer());
    bodyBytes = bytes.byteLength;
    bodySha256 = sha256(bytes);
  }
  return {
    path,
    status: response.status,
    headers: selectedHeaders(response.headers),
    transportHeaders: transportHeaders(response.headers),
    bodySha256,
    bodyBytes,
  };
}

function compareObservation(local, remote, context, differences) {
  if (local.status !== remote.status) differences.push(`${context}:status:${local.status}->${remote.status}`);

  const localType = normalizeContentType(local.headers['content-type']);
  const remoteType = normalizeContentType(remote.headers['content-type']);
  if (localType && localType !== remoteType) differences.push(`${context}:content-type:${localType}->${remoteType ?? 'missing'}`);

  const localCache = cacheDirectives(local.headers['cache-control']);
  const remoteCache = cacheDirectives(remote.headers['cache-control']);
  for (const directive of localCache) {
    if (!remoteCache.has(directive)) differences.push(`${context}:cache-control-missing:${directive}`);
  }

  for (const name of semanticHeaderNames.filter((name) => !['content-type', 'cache-control'].includes(name))) {
    const localValue = local.headers[name];
    const remoteValue = remote.headers[name];
    if (localValue !== remoteValue) {
      differences.push(`${context}:${name}:${localValue ?? 'missing'}->${remoteValue ?? 'missing'}`);
    }
  }

  if (local.bodySha256 !== null && local.bodySha256 !== remote.bodySha256) {
    differences.push(`${context}:body:${local.bodySha256}->${remote.bodySha256 ?? 'missing'}`);
  }
}

function tlsWitness(url) {
  const port = Number.parseInt(url.port || '443', 10);
  return new Promise((resolvePromise, reject) => {
    const socket = connectTls({
      host: url.hostname,
      port,
      servername: url.hostname,
      rejectUnauthorized: true,
    });
    socket.setTimeout(15000);
    socket.once('secureConnect', () => {
      const certificate = socket.getPeerCertificate();
      const witness = {
        authorized: socket.authorized,
        authorizationError: socket.authorizationError ?? null,
        protocol: socket.getProtocol(),
        subjectCN: certificate.subject?.CN ?? null,
        issuerCN: certificate.issuer?.CN ?? null,
        validFrom: certificate.valid_from ?? null,
        validTo: certificate.valid_to ?? null,
        fingerprint256: certificate.fingerprint256 ?? null,
      };
      socket.end();
      resolvePromise(witness);
    });
    socket.once('timeout', () => socket.destroy(new Error('r2-a1-current-tls-timeout')));
    socket.once('error', reject);
  });
}

const runtime = await createCurrentCommissionedRuntime();
const localAddress = await runtime.listen(0, '127.0.0.1');
if (!localAddress || typeof localAddress === 'string') throw new Error('r2-a1-current-local-baseline-address-unavailable');
const localOrigin = `http://127.0.0.1:${localAddress.port}`;

const differences = [];
const observations = [];
let remainingFileCount = 0;
let firstRemoteTransport = {};

async function comparePath(path, kind, options = {}) {
  const local = await observe(localOrigin, path, options);
  const remote = await observe(previewOrigin, path, options);
  compareObservation(local, remote, `${kind}:${path}`, differences);
  observations.push({ kind, local, remote });
  if (Object.keys(firstRemoteTransport).length === 0) firstRemoteTransport = remote.transportHeaders;
  return { local, remote };
}

try {
  if (runtime.source.acceptedPublicationDigest !== EXPECTED_PUBLICATION_DIGEST) differences.push('source:publication-digest');
  if (runtime.source.rendererInputDigest !== EXPECTED_RENDERER_INPUT_DIGEST) differences.push('source:renderer-input-digest');
  if (runtime.source.distributionDigest !== EXPECTED_DISTRIBUTION_DIGEST) differences.push('source:distribution-digest');

  for (const page of runtime.distribution.pages) await comparePath(page.canonicalPath, 'canonical');
  for (const entry of runtime.adapter.entries) await comparePath(entry.legacyPath, 'compatibility-handshake');

  for (const entry of runtime.adapter.entries) {
    for (const language of ['en', 'pt']) {
      const query = new URLSearchParams({ from: entry.legacyPath, lang: language }).toString();
      await comparePath(`${runtime.adapter.http.endpoint}?${query}`, 'redirect', { compareBody: false });
    }
  }

  await comparePath(`/_compat/redirect?from=${encodeURIComponent(runtime.adapter.entries[0].legacyPath)}`, 'explicit-language-required', {
    compareBody: false,
    headers: { 'Accept-Language': 'pt-BR,pt;q=0.9' },
  });
  await comparePath('/r2-a1-current-preview-unknown-route', 'unknown');
  await comparePath('/sitemap.xml', 'distribution');
  await comparePath('/en/rss.xml', 'distribution');
  await comparePath('/pt-br/rss.xml', 'distribution');
  await comparePath('/search-index.json', 'distribution');

  const semanticFiles = new Set([
    ...runtime.distribution.pages.map((page) => htmlFileForRoute(page.canonicalPath)),
    ...runtime.adapter.entries.map((entry) => htmlFileForRoute(entry.legacyPath)),
    '404.html',
    'sitemap.xml',
    'en/rss.xml',
    'pt-br/rss.xml',
    'search-index.json',
  ]);
  const remainingFiles = walk(distRoot)
    .map((path) => relative(distRoot, path).replaceAll('\\', '/'))
    .filter((path) => !semanticFiles.has(path));
  remainingFileCount = remainingFiles.length;
  for (const file of remainingFiles) await comparePath(`/${file}`, 'remaining-static');

  const repeatPath = runtime.distribution.pages[0]?.canonicalPath;
  if (!repeatPath) differences.push('warm-repeat:no-canonical-path');
  else {
    const first = await observe(previewOrigin, repeatPath);
    const second = await observe(previewOrigin, repeatPath);
    compareObservation(first, second, `warm-repeat:${repeatPath}`, differences);
    observations.push({ kind: 'warm-repeat', first, second });
  }
} finally {
  await runtime.close();
}

const tls = await tlsWitness(previewUrl);
if (!tls.authorized) differences.push(`tls:unauthorized:${tls.authorizationError ?? 'unknown'}`);

const firstCanonicalRemote = observations.find((entry) => entry.kind === 'canonical')?.remote;
if (firstCanonicalRemote?.headers['x-commissioned-runtime'] !== 'R2-A1.3') differences.push('remote-provenance:runtime');
if (firstCanonicalRemote?.headers['x-publication-digest'] !== EXPECTED_PUBLICATION_DIGEST) differences.push('remote-provenance:publication-digest');
if (firstCanonicalRemote?.headers['x-renderer-input-digest'] !== EXPECTED_RENDERER_INPUT_DIGEST) differences.push('remote-provenance:renderer-input-digest');
if (firstCanonicalRemote?.headers['x-distribution-digest'] !== EXPECTED_DISTRIBUTION_DIGEST) differences.push('remote-provenance:distribution-digest');

const witness = {
  schemaVersion: 'editorial-current-preview-environmental-witness/v0',
  contractId: 'PORTFOLIO-R2-A1.4-2026-08-31',
  generatedAt: new Date().toISOString(),
  sourceCommit: process.env.GITHUB_SHA ?? null,
  previewOrigin,
  productionOriginContacted: false,
  localBaseline: 'R2-A1.3 current commissioned runtime',
  sourceIdentity: {
    acceptedPublicationDigest: EXPECTED_PUBLICATION_DIGEST,
    rendererInputDigest: EXPECTED_RENDERER_INPUT_DIGEST,
    distributionDigest: EXPECTED_DISTRIBUTION_DIGEST,
  },
  tls,
  transportObservation: firstRemoteTransport,
  counts: {
    canonical: runtime.distribution.pages.length,
    compatibilityHandshakes: runtime.adapter.entries.length,
    redirects: runtime.adapter.entries.length * 2,
    sitemapEntries: runtime.distribution.sitemap.length,
    rssFeeds: runtime.distribution.rss.length,
    rssItems: runtime.distribution.rss.flatMap((feed) => feed.items).length,
    searchEntries: runtime.distribution.search.length,
    remainingStaticFiles: remainingFileCount,
  },
  semanticDifferenceCount: differences.length,
  differences,
  observations,
};

const witnessPath = process.env.R2_A1_CURRENT_WITNESS_PATH ?? 'r2-a1-current-preview-witness.json';
writeFileSync(witnessPath, `${JSON.stringify(witness, null, 2)}\n`, 'utf8');

console.log(`preview_origin=${previewOrigin}`);
console.log(`accepted_publication_digest=${EXPECTED_PUBLICATION_DIGEST}`);
console.log(`renderer_input_digest=${EXPECTED_RENDERER_INPUT_DIGEST}`);
console.log(`distribution_digest=${EXPECTED_DISTRIBUTION_DIGEST}`);
console.log(`tls_authorized=${tls.authorized}`);
console.log(`semantic_diff_count=${differences.length}`);
console.log(`canonical=${runtime.distribution.pages.length}`);
console.log(`search_entries=${runtime.distribution.search.length}`);
console.log(`witness=${witnessPath}`);

if (differences.length > 0) {
  for (const difference of differences) console.error(`R2-A1 CURRENT DIFF ${difference}`);
  throw new Error(`r2-a1-current-preview-semantic-differences:${differences.length}`);
}

console.log('R2-A1.4 CURRENT PREVIEW ENVIRONMENTAL INVARIANCE: PASS');
