/* global URL, console, process */
import http from 'node:http';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { extname, join, normalize, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer as createViteServer } from 'vite';

const ACCEPTED_PUBLICATION_DIGEST = 'sha256_f72c807283aa0f2da0a20b3ecaf1ec5f99227fedac47aa9fb988f5c924997d32';
const ACCEPTED_RENDERER_INPUT_DIGEST = 'sha256_4b2bc45e2127befd4f7be0aaf7b4a2cebe0ad7ab9da7a7fa774414af155d73e6';
const ACCEPTED_DISTRIBUTION_DIGEST = 'sha256_b7813fa7400b1ad205cd82bf32ecad86d4c9790d7d03630033dcc68c6d8dc308';

const shellRoot = fileURLToPath(new URL('../', import.meta.url));
const repoRoot = fileURLToPath(new URL('../../', import.meta.url));
const distRoot = resolve(shellRoot, 'current-dist');

const MIME = new Map([
  ['.html', 'text/html; charset=utf-8'],
  ['.xml', 'application/xml; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.css', 'text/css; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.mjs', 'text/javascript; charset=utf-8'],
  ['.svg', 'image/svg+xml'],
  ['.png', 'image/png'],
  ['.jpg', 'image/jpeg'],
  ['.jpeg', 'image/jpeg'],
  ['.webp', 'image/webp'],
  ['.ico', 'image/x-icon'],
  ['.woff2', 'font/woff2'],
  ['.pdf', 'application/pdf'],
]);

function normalizedRequestPath(pathname) {
  let decoded;
  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    return null;
  }
  if (decoded.includes('\0')) return null;
  const path = normalize(decoded.replaceAll('\\', '/')).replaceAll('\\', '/');
  if (!path.startsWith('/')) return null;
  if (path.includes('/../') || path.endsWith('/..')) return null;
  return path.replace(/\/+$/, '') || '/';
}

function safeDistCandidate(relativePath) {
  const candidate = resolve(distRoot, relativePath);
  const rel = relative(distRoot, candidate).replaceAll('\\', '/');
  if (rel.startsWith('../') || rel === '..') return null;
  return candidate;
}

function resolveStaticFile(pathname) {
  const normalized = normalizedRequestPath(pathname);
  if (!normalized) return null;
  const relativePath = normalized.replace(/^\/+/, '');
  const exact = safeDistCandidate(relativePath);
  if (exact && existsSync(exact) && statSync(exact).isFile()) return exact;
  const index = safeDistCandidate(join(relativePath, 'index.html'));
  if (index && existsSync(index) && statSync(index).isFile()) return index;
  return null;
}

function contentTypeFor(pathname, filePath) {
  if (pathname.endsWith('/rss.xml')) return 'application/rss+xml; charset=utf-8';
  return MIME.get(extname(filePath).toLowerCase()) ?? 'application/octet-stream';
}

function provenanceHeaders() {
  return {
    'X-Commissioned-Runtime': 'R2-A1.3',
    'X-Publication-Digest': ACCEPTED_PUBLICATION_DIGEST,
    'X-Renderer-Input-Digest': ACCEPTED_RENDERER_INPUT_DIGEST,
    'X-Distribution-Digest': ACCEPTED_DISTRIBUTION_DIGEST,
  };
}

function responseHeaders({ pathname, filePath, canonicalMetadata, legacyPaths, handshakePaths, status }) {
  const headers = {
    'Content-Type': contentTypeFor(pathname, filePath),
    'Cache-Control': pathname.startsWith('/_astro/')
      ? 'public, max-age=31536000, immutable'
      : 'no-store',
    'X-Content-Type-Options': 'nosniff',
    ...provenanceHeaders(),
  };

  const metadata = canonicalMetadata.get(pathname);
  if (metadata && status === 200) {
    headers.Link = `<${metadata.canonicalUrl}>; rel="canonical"`;
    headers['Content-Language'] = metadata.language;
    headers['X-Robots-Tag'] = metadata.robots;
  } else if (legacyPaths.has(pathname) || handshakePaths.has(pathname) || status === 404) {
    headers['X-Robots-Tag'] = 'noindex,follow';
  }

  return headers;
}

function sendBuffer(response, method, status, headers, body) {
  response.writeHead(status, { ...headers, 'Content-Length': body.byteLength });
  if (method === 'HEAD') response.end();
  else response.end(body);
}

export async function createCurrentCommissionedRuntime(options = {}) {
  if (!existsSync(distRoot)) throw new Error('current-commissioned-runtime-dist-missing');

  const vite = await createViteServer({
    root: repoRoot,
    configFile: false,
    appType: 'custom',
    logLevel: 'error',
    server: { middlewareMode: true },
  });

  const currentInputModule = await vite.ssrLoadModule('/src/editorial/current-renderer-input.ts');
  const currentDistributionModule = await vite.ssrLoadModule('/src/editorial/current-distribution-runtime.ts');
  const historicalInputModule = await vite.ssrLoadModule('/src/editorial/renderer-input.ts');
  const adapterModule = await vite.ssrLoadModule('/src/editorial/compatibility-redirect-adapter.ts');

  const currentInput = currentInputModule.materializeCurrentRendererInput();
  const rendererInputDigest = currentInputModule.currentRendererInputDigest(currentInput);
  const distribution = currentDistributionModule.materializeCurrentDistribution();
  const distributionDigest = currentDistributionModule.currentDistributionDigest(distribution);
  const historicalTransport = historicalInputModule.materializeAcceptedRendererInput();
  const adapter = historicalTransport.redirects;

  if (currentInput.source.acceptedPublicationDigest !== ACCEPTED_PUBLICATION_DIGEST) {
    await vite.close();
    throw new Error(`current-runtime-publication-digest:${currentInput.source.acceptedPublicationDigest}`);
  }
  if (rendererInputDigest !== ACCEPTED_RENDERER_INPUT_DIGEST) {
    await vite.close();
    throw new Error(`current-runtime-renderer-input-digest:${rendererInputDigest}`);
  }
  if (distributionDigest !== ACCEPTED_DISTRIBUTION_DIGEST) {
    await vite.close();
    throw new Error(`current-runtime-distribution-digest:${distributionDigest}`);
  }

  const unavailable = new Set(options.commissioningFaults?.unavailableCanonicalPaths ?? []);
  const distributedPaths = new Set(
    distribution.pages.map((page) => page.canonicalPath).filter((path) => !unavailable.has(path)),
  );
  const canonicalMetadata = new Map(distribution.metadata.map((entry) => [entry.canonicalPath, entry]));
  const legacyPaths = new Set(historicalTransport.legacy.pages.map((page) => page.path));
  const handshakePaths = new Set(adapter.entries.map((entry) => entry.legacyPath));

  for (const entry of adapter.entries) {
    for (const target of [entry.successors.en, entry.successors['pt-BR']]) {
      if (!distributedPaths.has(target) && !unavailable.has(target)) {
        await vite.close();
        throw new Error(`current-runtime-compatibility-target-missing:${entry.legacyPath}:${target}`);
      }
    }
  }

  const server = http.createServer((request, response) => {
    const method = request.method ?? 'GET';
    if (method !== 'GET' && method !== 'HEAD') {
      response.writeHead(405, {
        Allow: 'GET, HEAD',
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
        ...provenanceHeaders(),
      });
      response.end();
      return;
    }

    const url = new URL(request.url ?? '/', 'http://127.0.0.1');
    const pathname = normalizedRequestPath(url.pathname);
    if (!pathname) {
      response.writeHead(400, { 'Cache-Control': 'no-store', ...provenanceHeaders() });
      response.end('invalid-path');
      return;
    }

    if (pathname === adapter.http.endpoint) {
      const decision = adapterModule.resolveCompatibilityRedirectRequest(
        adapter,
        url.searchParams.get(adapter.http.requestSourceParameter) ?? '',
        url.searchParams.get(adapter.http.requestLanguageParameter),
        distributedPaths,
      );
      const headers = {
        'Cache-Control': adapter.http.cacheControl,
        'X-Content-Type-Options': 'nosniff',
        ...provenanceHeaders(),
      };
      if (decision.state === 'redirect') headers.Location = decision.location;
      response.writeHead(decision.status, headers);
      response.end(method === 'HEAD' ? undefined : decision.state);
      return;
    }

    const filePath = resolveStaticFile(pathname);
    if (filePath) {
      const body = readFileSync(filePath);
      sendBuffer(
        response,
        method,
        200,
        responseHeaders({ pathname, filePath, canonicalMetadata, legacyPaths, handshakePaths, status: 200 }),
        body,
      );
      return;
    }

    const notFound = join(distRoot, '404.html');
    if (!existsSync(notFound)) {
      response.writeHead(500, { 'Cache-Control': 'no-store', ...provenanceHeaders() });
      response.end('404-artifact-missing');
      return;
    }
    const body = readFileSync(notFound);
    sendBuffer(
      response,
      method,
      404,
      responseHeaders({ pathname, filePath: notFound, canonicalMetadata, legacyPaths, handshakePaths, status: 404 }),
      body,
    );
  });

  const listen = (port = 0, host = '127.0.0.1') => new Promise((resolvePromise, reject) => {
    server.once('error', reject);
    server.listen(port, host, () => {
      server.off('error', reject);
      resolvePromise(server.address());
    });
  });

  const close = async () => {
    if (server.listening) {
      await new Promise((resolvePromise, reject) => server.close((error) => error ? reject(error) : resolvePromise()));
    }
    await vite.close();
  };

  return {
    schemaVersion: 'editorial-current-commissioned-runtime/v0',
    source: {
      acceptedPublicationDigest: ACCEPTED_PUBLICATION_DIGEST,
      rendererInputDigest: ACCEPTED_RENDERER_INPUT_DIGEST,
      distributionDigest: ACCEPTED_DISTRIBUTION_DIGEST,
    },
    currentInput,
    distribution,
    adapter,
    distributedPaths,
    server,
    listen,
    close,
  };
}

const invokedDirectly = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (invokedDirectly) {
  const runtime = await createCurrentCommissionedRuntime();
  const configuredPort = Number.parseInt(process.env.PORT ?? '4322', 10);
  const address = await runtime.listen(Number.isFinite(configuredPort) ? configuredPort : 4322);
  if (!address || typeof address === 'string') throw new Error('current-commissioned-runtime-address-unavailable');
  console.log(`R2-A1.3 current commissioned runtime listening at http://127.0.0.1:${address.port}`);

  const shutdown = async () => {
    await runtime.close();
    process.exit(0);
  };
  process.once('SIGINT', shutdown);
  process.once('SIGTERM', shutdown);
}
