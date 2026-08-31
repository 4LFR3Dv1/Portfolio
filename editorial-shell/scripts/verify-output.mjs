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
  if (existsSync(join(rootPath, path))) throw new Error(`editorial-shell-r2-1-scope-leak:${path}`);
}

const vira = readFileSync(join(rootPath, 'en/systems/vira/index.html'), 'utf8');
if (!vira.includes('VIRA')) throw new Error('editorial-shell-vira-semantic-content-missing');
if (!vira.includes('rec_c844725e35cf61830221efc597612017')) {
  throw new Error('editorial-shell-vira-record-identity-missing');
}

const unknown = readFileSync(join(rootPath, '404.html'), 'utf8');
if (!unknown.includes('Unresolved route')) throw new Error('editorial-shell-404-semantics-missing');

console.log('R2.1 EDITORIAL SHELL STATIC OUTPUT: PASS');
console.log(`canonical_html=${canonicalHtml.length}`);
console.log(`total_files=${files.length}`);
console.log(`output_root=${rootPath}`);
console.log(`sample=${relative(rootPath, canonicalHtml[0] ?? rootPath)}`);
