/* global URL, URLSearchParams, fetch, console */
import { readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createCommissionedRuntime } from '../runtime/commissioned-runtime.mjs';

const distRoot = fileURLToPath(new URL('../dist/', import.meta.url));

function requireHeader(response, name, expected, context) {
  const actual = response.headers.get(name);
  if (actual !== expected) throw new Error(`${context}:${name}:${actual ?? 'missing'}`);
}

async function fetchFrom(port, path, init = {}) {
  return fetch(`http://127.0.0.1:${port}${path}`, { redirect: 'manual', ...init });
}

function addressPort(address) {
  if (!address || typeof address === 'string') throw new Error('commissioned-runtime-address-unavailable');
  return address.port;
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

const runtime = await createCommissionedRuntime();
const address = await runtime.listen(0);
const port = addressPort(address);

let staticAssetCount = 0;
try {
  if (runtime.input.pages.length !== 18) throw new Error(`commissioned-runtime-canonical-count:${runtime.input.pages.length}`);
  if (runtime.input.legacy.pages.length !== 4) throw new Error(`commissioned-runtime-legacy-count:${runtime.input.legacy.pages.length}`);
  if (runtime.adapter.entries.length !== 4) throw new Error(`commissioned-runtime-redirect-count:${runtime.adapter.entries.length}`);

  for (const page of runtime.input.pages) {
    const response = await fetchFrom(port, page.canonicalPath);
    if (response.status !== 200) throw new Error(`commissioned-runtime-canonical-status:${page.canonicalPath}:${response.status}`);
    if (!response.headers.get('content-type')?.startsWith('text/html')) {
      throw new Error(`commissioned-runtime-canonical-content-type:${page.canonicalPath}:${response.headers.get('content-type')}`);
    }
    requireHeader(response, 'cache-control', 'no-store', `commissioned-runtime-canonical-cache:${page.canonicalPath}`);
    requireHeader(response, 'content-language', page.language, `commissioned-runtime-language:${page.canonicalPath}`);
    requireHeader(response, 'x-robots-tag', 'index,follow', `commissioned-runtime-robots:${page.canonicalPath}`);
    requireHeader(response, 'link', `<${page.canonicalUrl}>; rel="canonical"`, `commissioned-runtime-link:${page.canonicalPath}`);
    requireHeader(response, 'x-content-type-options', 'nosniff', `commissioned-runtime-nosniff:${page.canonicalPath}`);

    const html = await response.text();
    if (!html.includes(`rel="canonical" href="${page.canonicalUrl}"`)) {
      throw new Error(`commissioned-runtime-html-canonical:${page.canonicalPath}`);
    }
    if (!html.includes('name="robots" content="index,follow"')) {
      throw new Error(`commissioned-runtime-html-robots:${page.canonicalPath}`);
    }
  }

  const legacyPaths = runtime.input.legacy.pages.map((page) => page.path);
  for (const path of legacyPaths) {
    const response = await fetchFrom(port, path);
    if (response.status !== 200) throw new Error(`commissioned-runtime-legacy-status:${path}:${response.status}`);
    requireHeader(response, 'cache-control', 'no-store', `commissioned-runtime-legacy-cache:${path}`);
    requireHeader(response, 'x-robots-tag', 'noindex,follow', `commissioned-runtime-legacy-robots:${path}`);
    if (response.headers.has('link')) throw new Error(`commissioned-runtime-legacy-canonical-header:${path}`);
    const html = await response.text();
    if (!html.includes('name="robots" content="noindex,follow"')) throw new Error(`commissioned-runtime-legacy-html-robots:${path}`);
    if (html.includes('rel="canonical"')) throw new Error(`commissioned-runtime-legacy-html-canonical:${path}`);
  }

  for (const entry of runtime.adapter.entries) {
    const handshake = await fetchFrom(port, entry.legacyPath);
    if (handshake.status !== 200) throw new Error(`commissioned-runtime-handshake-status:${entry.legacyPath}:${handshake.status}`);
    requireHeader(handshake, 'cache-control', 'no-store', `commissioned-runtime-handshake-cache:${entry.legacyPath}`);
    requireHeader(handshake, 'x-robots-tag', 'noindex,follow', `commissioned-runtime-handshake-robots:${entry.legacyPath}`);
    if (handshake.headers.has('link')) throw new Error(`commissioned-runtime-handshake-canonical-header:${entry.legacyPath}`);
    const html = await handshake.text();
    if (!html.includes('portfolio-language')) throw new Error(`commissioned-runtime-handshake-language-state:${entry.legacyPath}`);
    if (!html.includes('/_compat/redirect')) throw new Error(`commissioned-runtime-handshake-endpoint:${entry.legacyPath}`);

    for (const [legacyLanguage, canonicalLanguage] of [['en', 'en'], ['pt', 'pt-BR']]) {
      const params = new URLSearchParams({ from: entry.legacyPath, lang: legacyLanguage });
      const redirect = await fetchFrom(port, `${runtime.adapter.http.endpoint}?${params.toString()}`);
      const expected = entry.successors[canonicalLanguage];
      if (redirect.status !== 302) throw new Error(`commissioned-runtime-redirect-status:${entry.legacyPath}:${legacyLanguage}:${redirect.status}`);
      requireHeader(redirect, 'cache-control', 'no-store', `commissioned-runtime-redirect-cache:${entry.legacyPath}:${legacyLanguage}`);
      requireHeader(redirect, 'location', expected, `commissioned-runtime-redirect-location:${entry.legacyPath}:${legacyLanguage}`);

      const successor = await fetchFrom(port, expected);
      if (successor.status !== 200) throw new Error(`commissioned-runtime-redirect-successor:${expected}:${successor.status}`);
      requireHeader(successor, 'x-robots-tag', 'index,follow', `commissioned-runtime-redirect-successor-robots:${expected}`);
    }
  }

  const noLanguage = await fetchFrom(port, '/_compat/redirect?from=%2Fwork%2Fvira', {
    headers: { 'Accept-Language': 'pt-BR,pt;q=0.9' },
  });
  if (noLanguage.status !== 400) throw new Error(`commissioned-runtime-accept-language-inference:${noLanguage.status}`);

  const unknown = await fetchFrom(port, '/random-path-that-does-not-exist');
  if (unknown.status !== 404) throw new Error(`commissioned-runtime-unknown-status:${unknown.status}`);
  if (!unknown.headers.get('content-type')?.startsWith('text/html')) throw new Error('commissioned-runtime-404-content-type');
  requireHeader(unknown, 'cache-control', 'no-store', 'commissioned-runtime-404-cache');
  requireHeader(unknown, 'x-robots-tag', 'noindex,follow', 'commissioned-runtime-404-robots');
  const unknownHtml = await unknown.text();
  if (!unknownHtml.includes('Unresolved route')) throw new Error('commissioned-runtime-404-body');

  const sitemap = await fetchFrom(port, '/sitemap.xml');
  if (sitemap.status !== 200) throw new Error(`commissioned-runtime-sitemap-status:${sitemap.status}`);
  if (!sitemap.headers.get('content-type')?.startsWith('application/xml')) throw new Error(`commissioned-runtime-sitemap-content-type:${sitemap.headers.get('content-type')}`);
  requireHeader(sitemap, 'cache-control', 'no-store', 'commissioned-runtime-sitemap-cache');
  const sitemapXml = await sitemap.text();
  if ((sitemapXml.match(/<url>/g) ?? []).length !== 18) throw new Error('commissioned-runtime-sitemap-count');
  for (const legacyPath of legacyPaths) {
    if (sitemapXml.includes(legacyPath)) throw new Error(`commissioned-runtime-sitemap-legacy-leak:${legacyPath}`);
  }

  for (const rssPath of ['/en/rss.xml', '/pt-br/rss.xml']) {
    const rss = await fetchFrom(port, rssPath);
    if (rss.status !== 200) throw new Error(`commissioned-runtime-rss-status:${rssPath}:${rss.status}`);
    if (!rss.headers.get('content-type')?.startsWith('application/rss+xml')) throw new Error(`commissioned-runtime-rss-content-type:${rssPath}:${rss.headers.get('content-type')}`);
    requireHeader(rss, 'cache-control', 'no-store', `commissioned-runtime-rss-cache:${rssPath}`);
    const xml = await rss.text();
    if (!xml.includes('<rss version="2.0">')) throw new Error(`commissioned-runtime-rss-envelope:${rssPath}`);
    if (xml.includes('<item>')) throw new Error(`commissioned-runtime-rss-unadmitted-item:${rssPath}`);
  }

  const search = await fetchFrom(port, '/search-index.json');
  if (search.status !== 200) throw new Error(`commissioned-runtime-search-status:${search.status}`);
  if (!search.headers.get('content-type')?.startsWith('application/json')) throw new Error(`commissioned-runtime-search-content-type:${search.headers.get('content-type')}`);
  requireHeader(search, 'cache-control', 'no-store', 'commissioned-runtime-search-cache');
  const searchEntries = await search.json();
  if (!Array.isArray(searchEntries) || searchEntries.length !== 6) throw new Error(`commissioned-runtime-search-count:${searchEntries?.length ?? 'invalid'}`);

  const semanticFiles = new Set([
    ...runtime.input.pages.map((page) => htmlFileForRoute(page.canonicalPath)),
    ...runtime.input.legacy.pages.map((page) => htmlFileForRoute(page.path)),
    ...runtime.adapter.entries.map((entry) => htmlFileForRoute(entry.legacyPath)),
    '404.html',
    'sitemap.xml',
    'en/rss.xml',
    'pt-br/rss.xml',
    'search-index.json',
  ]);
  const assetFiles = walk(distRoot)
    .map((path) => relative(distRoot, path).replaceAll('\\', '/'))
    .filter((path) => !semanticFiles.has(path));
  staticAssetCount = assetFiles.length;
  if (staticAssetCount < 1) throw new Error('commissioned-runtime-no-static-assets');

  for (const assetFile of assetFiles) {
    const assetPath = `/${assetFile}`;
    const asset = await fetchFrom(port, assetPath);
    if (asset.status !== 200) throw new Error(`commissioned-runtime-asset-status:${assetPath}:${asset.status}`);
    requireHeader(asset, 'x-content-type-options', 'nosniff', `commissioned-runtime-asset-nosniff:${assetPath}`);
    if (!asset.headers.get('content-type')) throw new Error(`commissioned-runtime-asset-content-type-missing:${assetPath}`);
    const expectedCache = assetPath.startsWith('/_astro/')
      ? 'public, max-age=31536000, immutable'
      : 'no-store';
    requireHeader(asset, 'cache-control', expectedCache, `commissioned-runtime-asset-cache:${assetPath}`);
    if (assetPath.endsWith('.pdf') && asset.headers.get('content-type') !== 'application/pdf') {
      throw new Error(`commissioned-runtime-pdf-content-type:${assetPath}:${asset.headers.get('content-type')}`);
    }
  }
} finally {
  await runtime.close();
}

const faultRuntime = await createCommissionedRuntime({
  commissioningFaults: { unavailableCanonicalPaths: ['/pt-br/systems/vira'] },
});
const faultAddress = await faultRuntime.listen(0);
const faultPort = addressPort(faultAddress);
try {
  const blocked = await fetchFrom(faultPort, '/_compat/redirect?from=%2Fwork%2Fvira&lang=pt');
  if (blocked.status !== 503) throw new Error(`commissioned-runtime-successor-loss-status:${blocked.status}`);
  if (blocked.headers.has('location')) throw new Error('commissioned-runtime-successor-loss-location');
  requireHeader(blocked, 'cache-control', 'no-store', 'commissioned-runtime-successor-loss-cache');
} finally {
  await faultRuntime.close();
}

console.log('R2.5 STATIC RUNTIME COMMISSIONING: PASS');
console.log('canonical_200=18');
console.log('historical_200=4');
console.log('handshake_200=4');
console.log('redirect_302=8');
console.log('successor_loss_503=1');
console.log('unknown_404=1');
console.log('sitemap_urls=18');
console.log('rss_feeds=2');
console.log('search_entries=6');
console.log(`static_assets=${staticAssetCount}`);
console.log('semantic_cache=no-store');
console.log('fingerprinted_asset_cache=public,max-age=31536000,immutable');
