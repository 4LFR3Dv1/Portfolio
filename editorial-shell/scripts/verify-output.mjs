/* global URL, console */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = new URL('../dist/', import.meta.url);
const rootPath = root.pathname;

function walk(directory) {
  return readdirSync(directory).flatMap((name) => {
    const path = join(directory, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

if (!existsSync(rootPath)) throw new Error('editorial-shell-dist-missing');

const files = walk(rootPath);
const canonicalHtml = files.filter((path) => path.endsWith('/index.html'));
if (canonicalHtml.length !== 18) {
  throw new Error(`editorial-shell-canonical-html-count:${canonicalHtml.length}`);
}

const required = [
  'en/index.html',
  'pt-br/index.html',
  'en/systems/index.html',
  'pt-br/systems/index.html',
  'en/systems/vira/index.html',
  'pt-br/systems/vira/index.html',
  'en/systems/xs-wallet/index.html',
  'pt-br/systems/xs-wallet/index.html',
  'en/systems/sne-os/index.html',
  'pt-br/systems/sne-os/index.html',
  '404.html',
  'sitemap.xml',
  'en/rss.xml',
  'pt-br/rss.xml',
  'search-index.json',
];
for (const path of required) {
  if (!existsSync(join(rootPath, path))) throw new Error(`editorial-shell-required-output-missing:${path}`);
}

const forbidden = [
  'architecture/index.html',
  'work/agentic-systems/index.html',
  'work/transactional-support-bot/index.html',
  'work/verify-systems/index.html',
];
for (const path of forbidden) {
  if (existsSync(join(rootPath, path))) throw new Error(`editorial-shell-r2-scope-leak:${path}`);
}

const vira = readFileSync(join(rootPath, 'en/systems/vira/index.html'), 'utf8');
if (!vira.includes('VIRA')) throw new Error('editorial-shell-vira-semantic-content-missing');
if (!vira.includes('rec_c844725e35cf61830221efc597612017')) {
  throw new Error('editorial-shell-vira-record-identity-missing');
}
if (!vira.includes('rel="canonical" href="https://renan.snelabs.space/en/systems/vira"')) {
  throw new Error('editorial-shell-vira-canonical-metadata-missing');
}
if (!vira.includes('name="robots" content="index,follow"')) {
  throw new Error('editorial-shell-vira-robots-metadata-missing');
}
if (!vira.includes('hreflang="en" href="https://renan.snelabs.space/en/systems/vira"')) {
  throw new Error('editorial-shell-vira-en-hreflang-missing');
}
if (!vira.includes('hreflang="pt-BR" href="https://renan.snelabs.space/pt-br/systems/vira"')) {
  throw new Error('editorial-shell-vira-pt-hreflang-missing');
}
if (vira.includes('hreflang="x-default"')) throw new Error('editorial-shell-x-default-inferred');

const sitemap = readFileSync(join(rootPath, 'sitemap.xml'), 'utf8');
const sitemapEntries = sitemap.match(/<url>/g) ?? [];
if (sitemapEntries.length !== 18) throw new Error(`editorial-shell-sitemap-entry-count:${sitemapEntries.length}`);
if (sitemap.includes('<lastmod>')) throw new Error('editorial-shell-sitemap-lastmod-inferred');
if (sitemap.includes('<priority>')) throw new Error('editorial-shell-sitemap-priority-inferred');
if (sitemap.includes('<changefreq>')) throw new Error('editorial-shell-sitemap-changefreq-inferred');
if (sitemap.includes('hreflang="x-default"')) throw new Error('editorial-shell-sitemap-x-default-inferred');

for (const rssPath of ['en/rss.xml', 'pt-br/rss.xml']) {
  const rss = readFileSync(join(rootPath, rssPath), 'utf8');
  if (!rss.includes('<rss version="2.0">')) throw new Error(`editorial-shell-rss-envelope-missing:${rssPath}`);
  if (rss.includes('<item>')) throw new Error(`editorial-shell-rss-item-without-publication-authority:${rssPath}`);
}

const search = JSON.parse(readFileSync(join(rootPath, 'search-index.json'), 'utf8'));
if (!Array.isArray(search) || search.length !== 6) throw new Error(`editorial-shell-search-entry-count:${search.length ?? 'invalid'}`);
const searchPaths = new Set(search.map((entry) => entry.canonicalPath));
if (searchPaths.has('/en/systems/transactional-support-bot') || searchPaths.has('/pt-br/systems/transactional-support-bot')) {
  throw new Error('editorial-shell-search-sanitized-leak:transactional-support-bot');
}
if (searchPaths.has('/en/systems/foundry-pay') || searchPaths.has('/pt-br/systems/foundry-pay')) {
  throw new Error('editorial-shell-search-sanitized-leak:foundry-pay');
}

const unknown = readFileSync(join(rootPath, '404.html'), 'utf8');
if (!unknown.includes('Unresolved route')) throw new Error('editorial-shell-404-semantics-missing');

console.log('R2.2 EDITORIAL DISTRIBUTION EMISSION: PASS');
console.log(`canonical_html=${canonicalHtml.length}`);
console.log(`sitemap_entries=${sitemapEntries.length}`);
console.log(`rss_feeds=2`);
console.log(`rss_items=0`);
console.log(`search_entries=${search.length}`);
console.log(`total_files=${files.length}`);
console.log(`output_root=${rootPath}`);
console.log(`sample=${relative(rootPath, canonicalHtml[0] ?? rootPath)}`);
