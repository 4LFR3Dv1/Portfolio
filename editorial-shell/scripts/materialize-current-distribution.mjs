/* global URL, console */
import { createHash } from 'node:crypto';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

const repoRoot = fileURLToPath(new URL('../../', import.meta.url));
const emissionRoot = fileURLToPath(new URL('../current-emission/', import.meta.url));
const witnessPath = fileURLToPath(new URL('../r2-a1-2-current-distribution-witness.json', import.meta.url));

function sha256(bytes) {
  return `sha256_${createHash('sha256').update(bytes, 'utf8').digest('hex')}`;
}

function escapeXml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function sitemapXml(bundle) {
  const rows = bundle.sitemap.map((entry) => {
    const links = entry.alternates.map((link) =>
      `    <xhtml:link rel="alternate" hreflang="${escapeXml(link.language)}" href="${escapeXml(link.href)}" />`).join('\n');
    return `  <url>\n    <loc>${escapeXml(entry.loc)}</loc>\n${links}\n  </url>`;
  });
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${rows.join('\n')}\n</urlset>\n`;
}

function rssXml(feed) {
  return `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0">\n  <channel>\n    <title>${escapeXml(feed.title)}</title>\n    <link>https://renan.snelabs.space</link>\n    <description>${escapeXml(feed.description)}</description>\n    <language>${feed.language === 'en' ? 'en' : 'pt-BR'}</language>\n  </channel>\n</rss>\n`;
}

function write(relativePath, bytes) {
  const path = `${emissionRoot}${relativePath}`;
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, bytes, 'utf8');
  return { path: `editorial-shell/current-emission/${relativePath}`, digest: sha256(bytes), bytes: Buffer.byteLength(bytes, 'utf8') };
}

const server = await createServer({ root: repoRoot, configFile: false, appType: 'custom', logLevel: 'error', server: { middlewareMode: true } });

try {
  const module = await server.ssrLoadModule('/src/editorial/current-distribution-runtime.ts');
  const bundle = module.materializeCurrentDistribution();
  const distributionDigest = module.currentDistributionDigest(bundle);

  const distributionBytes = `${JSON.stringify(bundle, null, 2)}\n`;
  const sitemapBytes = sitemapXml(bundle);
  const englishRssBytes = rssXml(bundle.rss.find((entry) => entry.language === 'en'));
  const portugueseRssBytes = rssXml(bundle.rss.find((entry) => entry.language === 'pt-BR'));
  const searchBytes = `${JSON.stringify(bundle.search, null, 2)}\n`;

  const files = [
    write('distribution.json', distributionBytes),
    write('sitemap.xml', sitemapBytes),
    write('en/rss.xml', englishRssBytes),
    write('pt-br/rss.xml', portugueseRssBytes),
    write('search-index.json', searchBytes),
  ];

  const witness = {
    schemaVersion: 'editorial-current-distribution-physical-witness/v0',
    source: bundle.source,
    materialization: {
      distributionDigest,
      surfacePageCount: bundle.pages.filter((entry) => entry.source === 'surface').length,
      documentPageCount: bundle.pages.filter((entry) => entry.source === 'document').length,
      canonicalPageCount: bundle.pages.length,
      metadataEntryCount: bundle.metadata.length,
      hreflangClusterCount: bundle.hreflang.length,
      hreflangLinkCount: bundle.hreflang.flatMap((entry) => entry.links).length,
      sitemapEntryCount: bundle.sitemap.length,
      rssFeedCount: bundle.rss.length,
      rssItemCount: bundle.rss.flatMap((entry) => entry.items).length,
      searchEntryCount: bundle.search.length,
      files,
    },
    boundary: {
      shellBuildSwitchedToCurrentDistribution: false,
      compatibilityReconciled: false,
      runtimeRecommissioned: false,
      previewRedeployed: false,
      productionMutationCount: 0,
    },
  };
  writeFileSync(witnessPath, `${JSON.stringify(witness, null, 2)}\n`, 'utf8');

  console.log('R2-A1.2 CURRENT DISTRIBUTION EMISSION: PASS');
  console.log(`accepted_publication_digest=${bundle.source.acceptedPublicationDigest}`);
  console.log(`renderer_input_digest=${bundle.source.rendererInputDigest}`);
  console.log(`distribution_digest=${distributionDigest}`);
  console.log(`canonical_pages=${bundle.pages.length}`);
  console.log(`metadata=${bundle.metadata.length}`);
  console.log(`hreflang_clusters=${bundle.hreflang.length}`);
  console.log(`sitemap_entries=${bundle.sitemap.length}`);
  console.log(`rss_feeds=${bundle.rss.length}`);
  console.log(`rss_items=${witness.materialization.rssItemCount}`);
  console.log(`search_entries=${bundle.search.length}`);
  console.log(`witness=${witnessPath}`);
} finally {
  await server.close();
}
