/* global console */
import { createCurrentCommissionedRuntime } from '../runtime/current-commissioned-runtime.mjs';

const EXPECTED_PUBLICATION_DIGEST = 'sha256_f72c807283aa0f2da0a20b3ecaf1ec5f99227fedac47aa9fb988f5c924997d32';
const EXPECTED_RENDERER_INPUT_DIGEST = 'sha256_4b2bc45e2127befd4f7be0aaf7b4a2cebe0ad7ab9da7a7fa774414af155d73e6';
const EXPECTED_DISTRIBUTION_DIGEST = 'sha256_b7813fa7400b1ad205cd82bf32ecad86d4c9790d7d03630033dcc68c6d8dc308';

function invariant(condition, message) {
  if (!condition) throw new Error(message);
}

async function request(origin, path, options = {}) {
  return fetch(`${origin}${path}`, { redirect: 'manual', ...options });
}

const runtime = await createCurrentCommissionedRuntime();
let origin;

try {
  const address = await runtime.listen();
  invariant(address && typeof address !== 'string', 'current-runtime-address');
  origin = `http://127.0.0.1:${address.port}`;

  invariant(runtime.source.acceptedPublicationDigest === EXPECTED_PUBLICATION_DIGEST, 'publication-digest');
  invariant(runtime.source.rendererInputDigest === EXPECTED_RENDERER_INPUT_DIGEST, 'renderer-input-digest');
  invariant(runtime.source.distributionDigest === EXPECTED_DISTRIBUTION_DIGEST, 'distribution-digest');
  invariant(runtime.distribution.pages.length === 66, `canonical-count:${runtime.distribution.pages.length}`);
  invariant(runtime.distribution.metadata.length === 66, `metadata-count:${runtime.distribution.metadata.length}`);
  invariant(runtime.distribution.sitemap.length === 66, `sitemap-count:${runtime.distribution.sitemap.length}`);
  invariant(runtime.distribution.rss.length === 2, `rss-feed-count:${runtime.distribution.rss.length}`);
  invariant(runtime.distribution.rss.flatMap((feed) => feed.items).length === 0, 'rss-items-inferred');
  invariant(runtime.distribution.search.length === 54, `search-count:${runtime.distribution.search.length}`);

  for (const page of runtime.distribution.pages) {
    const response = await request(origin, page.canonicalPath);
    invariant(response.status === 200, `canonical-status:${page.canonicalPath}:${response.status}`);
    invariant(response.headers.get('x-commissioned-runtime') === 'R2-A1.3', `runtime-header:${page.canonicalPath}`);
    invariant(response.headers.get('x-publication-digest') === EXPECTED_PUBLICATION_DIGEST, `publication-header:${page.canonicalPath}`);
    invariant(response.headers.get('x-renderer-input-digest') === EXPECTED_RENDERER_INPUT_DIGEST, `renderer-header:${page.canonicalPath}`);
    invariant(response.headers.get('x-distribution-digest') === EXPECTED_DISTRIBUTION_DIGEST, `distribution-header:${page.canonicalPath}`);
    invariant(response.headers.get('content-language') === page.language, `language-header:${page.canonicalPath}`);
    invariant(response.headers.get('link') === `<${page.canonicalUrl}>; rel="canonical"`, `canonical-link:${page.canonicalPath}`);
    invariant(response.headers.get('x-robots-tag') === 'index,follow', `robots-header:${page.canonicalPath}`);
  }

  let redirectCount = 0;
  for (const entry of runtime.adapter.entries) {
    const handshake = await request(origin, entry.legacyPath);
    invariant(handshake.status === 200, `handshake-status:${entry.legacyPath}:${handshake.status}`);
    invariant(handshake.headers.get('x-robots-tag') === 'noindex,follow', `handshake-robots:${entry.legacyPath}`);

    for (const [legacyLanguage, expectedLocation] of [['en', entry.successors.en], ['pt', entry.successors['pt-BR']]]) {
      const params = new URLSearchParams({ from: entry.legacyPath, lang: legacyLanguage });
      const redirected = await request(origin, `${runtime.adapter.http.endpoint}?${params.toString()}`);
      invariant(redirected.status === 302, `redirect-status:${entry.legacyPath}:${legacyLanguage}:${redirected.status}`);
      invariant(redirected.headers.get('location') === expectedLocation, `redirect-location:${entry.legacyPath}:${legacyLanguage}`);
      redirectCount += 1;
    }
  }

  const explicitLanguageRequired = await request(origin, `${runtime.adapter.http.endpoint}?from=${encodeURIComponent(runtime.adapter.entries[0].legacyPath)}`);
  invariant(explicitLanguageRequired.status === 400, `explicit-language-status:${explicitLanguageRequired.status}`);

  const sitemap = await request(origin, '/sitemap.xml');
  const sitemapBody = await sitemap.text();
  invariant(sitemap.status === 200, `sitemap-status:${sitemap.status}`);
  invariant((sitemapBody.match(/<loc>/g) ?? []).length === 66, 'sitemap-physical-count');

  for (const path of ['/en/rss.xml', '/pt-br/rss.xml']) {
    const rss = await request(origin, path);
    invariant(rss.status === 200, `rss-status:${path}:${rss.status}`);
    invariant(rss.headers.get('content-type') === 'application/rss+xml; charset=utf-8', `rss-content-type:${path}`);
  }

  const search = await request(origin, '/search-index.json');
  invariant(search.status === 200, `search-status:${search.status}`);
  const searchEntries = await search.json();
  invariant(Array.isArray(searchEntries) && searchEntries.length === 54, `search-physical-count:${searchEntries.length}`);

  const unknown = await request(origin, '/__r2_a1_3_unknown__');
  invariant(unknown.status === 404, `unknown-status:${unknown.status}`);
  invariant(unknown.headers.get('x-robots-tag') === 'noindex,follow', 'unknown-robots');

  const head = await request(origin, runtime.distribution.pages[0].canonicalPath, { method: 'HEAD' });
  invariant(head.status === 200, `head-status:${head.status}`);
  invariant((await head.text()) === '', 'head-body-present');

  console.log('R2-A1.3 CURRENT STATIC RUNTIME COMMISSIONING: PASS');
  console.log(`accepted_publication_digest=${EXPECTED_PUBLICATION_DIGEST}`);
  console.log(`renderer_input_digest=${EXPECTED_RENDERER_INPUT_DIGEST}`);
  console.log(`distribution_digest=${EXPECTED_DISTRIBUTION_DIGEST}`);
  console.log('canonical_200=66');
  console.log(`handshake_200=${runtime.adapter.entries.length}`);
  console.log(`redirect_302=${redirectCount}`);
  console.log('explicit_language_required_400=1');
  console.log('unknown_404=1');
  console.log('sitemap_urls=66');
  console.log('rss_feeds=2');
  console.log('rss_items=0');
  console.log('search_entries=54');
  console.log('production_mutation=0');
} finally {
  await runtime.close();
}
