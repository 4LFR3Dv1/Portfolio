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
const indexHtml = files.filter((path) => path.endsWith('/index.html'));
const canonicalHtml = indexHtml.filter((path) => {
  const normalized = relative(rootPath, path).replaceAll('\\', '/');
  return normalized.startsWith('en/') || normalized.startsWith('pt-br/');
});
const legacyPaths = [
  'architecture/index.html',
  'work/agentic-systems/index.html',
  'work/transactional-support-bot/index.html',
  'work/verify-systems/index.html',
];
const legacyHtml = legacyPaths.filter((path) => existsSync(join(rootPath, path)));

if (canonicalHtml.length !== 18) {
  throw new Error(`editorial-shell-canonical-html-count:${canonicalHtml.length}`);
}
if (legacyHtml.length !== 4) {
  throw new Error(`editorial-shell-legacy-html-count:${legacyHtml.length}`);
}
if (indexHtml.length !== 22) {
  throw new Error(`editorial-shell-index-html-count:${indexHtml.length}`);
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
  ...legacyPaths,
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
  'index.html',
  'work/vira/index.html',
  'work/xs-wallet/index.html',
  'work/sne-os/index.html',
];
for (const path of forbidden) {
  if (existsSync(join(rootPath, path))) throw new Error(`editorial-shell-r2-redirect-premature:${path}`);
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

const legacyBodies = new Map(legacyPaths.map((path) => [path, readFileSync(join(rootPath, path), 'utf8')]));
for (const [path, body] of legacyBodies) {
  if (!body.includes('name="robots" content="noindex,follow"')) {
    throw new Error(`editorial-shell-legacy-robots-missing:${path}`);
  }
  if (body.includes('rel="canonical"')) throw new Error(`editorial-shell-legacy-canonical-invented:${path}`);
  if (body.includes('hreflang=')) throw new Error(`editorial-shell-legacy-hreflang-invented:${path}`);
  if (!body.includes('portfolio-language')) throw new Error(`editorial-shell-legacy-language-state-missing:${path}`);
}

const architecture = legacyBodies.get('architecture/index.html') ?? '';
if (!architecture.includes('ARCHITECTURE EXPLORER')) throw new Error('editorial-shell-legacy-architecture-title-missing');
if (!architecture.includes('Intelligence can propose. Deterministic boundaries authorize, execute and verify.')) {
  throw new Error('editorial-shell-legacy-architecture-principle-missing');
}
if (!architecture.includes('data-legacy-view-button="settlement"')) {
  throw new Error('editorial-shell-legacy-architecture-view-runtime-missing');
}

const agentic = legacyBodies.get('work/agentic-systems/index.html') ?? '';
if (!agentic.includes('Agentic Systems')) throw new Error('editorial-shell-legacy-agentic-title-missing');
if (!agentic.includes('BOUNDED EXECUTION')) throw new Error('editorial-shell-legacy-agentic-guarantee-missing');
if (agentic.includes('href="/en/systems/foundry"') || agentic.includes('href="/pt-br/systems/foundry"')) {
  throw new Error('editorial-shell-legacy-agentic-rebound');
}

const transactional = legacyBodies.get('work/transactional-support-bot/index.html') ?? '';
if (!transactional.includes('Transactional Support Bot')) throw new Error('editorial-shell-legacy-transactional-title-missing');
if (!transactional.includes('Generalized professional case study. Source code, infrastructure, provider details and operational data remain confidential.')) {
  throw new Error('editorial-shell-legacy-transactional-disclosure-missing');
}
if (transactional.includes('href="/en/systems/transactional-support-bot"')) {
  throw new Error('editorial-shell-legacy-transactional-premature-redirect');
}

const verify = legacyBodies.get('work/verify-systems/index.html') ?? '';
if (!verify.includes('VERIFY SYSTEMS')) throw new Error('editorial-shell-legacy-verify-title-missing');
if (!verify.includes('/docs/Verify_By_Renan_Melo.pdf')) throw new Error('editorial-shell-legacy-verify-publication-link-missing');

const sitemap = readFileSync(join(rootPath, 'sitemap.xml'), 'utf8');
const sitemapEntries = sitemap.match(/<url>/g) ?? [];
if (sitemapEntries.length !== 18) throw new Error(`editorial-shell-sitemap-entry-count:${sitemapEntries.length}`);
if (sitemap.includes('<lastmod>')) throw new Error('editorial-shell-sitemap-lastmod-inferred');
if (sitemap.includes('<priority>')) throw new Error('editorial-shell-sitemap-priority-inferred');
if (sitemap.includes('<changefreq>')) throw new Error('editorial-shell-sitemap-changefreq-inferred');
if (sitemap.includes('hreflang="x-default"')) throw new Error('editorial-shell-sitemap-x-default-inferred');
for (const legacyPath of ['/architecture', '/work/agentic-systems', '/work/transactional-support-bot', '/work/verify-systems']) {
  if (sitemap.includes(legacyPath)) throw new Error(`editorial-shell-sitemap-legacy-leak:${legacyPath}`);
}

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
for (const legacyPath of ['/architecture', '/work/agentic-systems', '/work/transactional-support-bot', '/work/verify-systems']) {
  if (searchPaths.has(legacyPath)) throw new Error(`editorial-shell-search-legacy-leak:${legacyPath}`);
}

const unknown = readFileSync(join(rootPath, '404.html'), 'utf8');
if (!unknown.includes('Unresolved route')) throw new Error('editorial-shell-404-semantics-missing');

console.log('R2.3 LEGACY PRESERVATION RUNTIME: PASS');
console.log(`canonical_html=${canonicalHtml.length}`);
console.log(`legacy_html=${legacyHtml.length}`);
console.log(`sitemap_entries=${sitemapEntries.length}`);
console.log('rss_feeds=2');
console.log('rss_items=0');
console.log(`search_entries=${search.length}`);
console.log(`total_files=${files.length}`);
console.log(`output_root=${rootPath}`);
console.log(`sample=${relative(rootPath, canonicalHtml[0] ?? rootPath)}`);
