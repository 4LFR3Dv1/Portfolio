/* global URL, URLSearchParams, fetch, console */
import { createCommissionedRuntime } from '../runtime/commissioned-runtime.mjs';

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

const runtime = await createCommissionedRuntime();
const address = await runtime.listen(0);
const port = addressPort(address);

let assetReferenceCount = 0;
try {
  if (runtime.input.pages.length !== 18) throw new Error(`commissioned-runtime-canonical-count:${runtime.input.pages.length}`);
  if (runtime.input.legacy.pages.length !== 4) throw new Error(`commissioned-runtime-legacy-count:${runtime.input.legacy.pages.length}`);
  if (runtime.adapter.entries.length !== 4) throw new Error(`commissioned-runtime-redirect-count:${runtime.adapter.entries.length}`);

  const assetPaths = new Set();
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
    for (const match of html.matchAll(/(?:src|href)="(\/_astro\/[^"?#]+)(?:[?#][^"]*)?"/g)) {
      assetPaths.add(match[1]);
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

  assetReferenceCount = assetPaths.size;
  if (assetReferenceCount < 1) throw new Error('commissioned-runtime-no-rendered-assets');
  for (const assetPath of assetPaths) {
    const asset = await fetchFrom(port, assetPath);
    if (asset.status !== 200) throw new Error(`commissioned-runtime-asset-status:${assetPath}:${asset.status}`);
    requireHeader(asset, 'cache-control', 'public, max-age=31536000, immutable', `commissioned-runtime-asset-cache:${assetPath}`);
    requireHeader(asset, 'x-content-type-options', 'nosniff', `commissioned-runtime-asset-nosniff:${assetPath}`);
    const contentType = asset.headers.get('content-type') ?? '';
    if (!(contentType.startsWith('text/css') || contentType.startsWith('text/javascript') || contentType.startsWith('image/') || contentType.startsWith('font/'))) {
      throw new Error(`commissioned-runtime-asset-content-type:${assetPath}:${contentType}`);
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
console.log(`rendered_asset_references=${assetReferenceCount}`);
console.log('semantic_cache=no-store');
console.log('asset_cache=public,max-age=31536000,immutable');
