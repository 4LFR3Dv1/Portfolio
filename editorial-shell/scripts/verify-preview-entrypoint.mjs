/* global URLSearchParams, fetch, console */
import { createCommissionedRuntime } from '../runtime/commissioned-runtime.mjs';

function addressPort(address) {
  if (!address || typeof address === 'string') throw new Error('r2-6-preview-address-unavailable');
  if (address.address !== '0.0.0.0') throw new Error(`r2-6-preview-bind-address:${address.address}`);
  return address.port;
}

function requireHeader(response, name, expected, context) {
  const actual = response.headers.get(name);
  if (actual !== expected) throw new Error(`${context}:${name}:${actual ?? 'missing'}`);
}

const runtime = await createCommissionedRuntime();
const address = await runtime.listen(0, '0.0.0.0');
const port = addressPort(address);
const origin = `http://127.0.0.1:${port}`;

try {
  const canonicalPage = runtime.input.pages[0];
  const canonical = await fetch(`${origin}${canonicalPage.canonicalPath}`, { redirect: 'manual' });
  if (canonical.status !== 200) throw new Error(`r2-6-preview-canonical-status:${canonical.status}`);
  requireHeader(canonical, 'cache-control', 'no-store', 'r2-6-preview-canonical-cache');
  requireHeader(canonical, 'content-language', canonicalPage.language, 'r2-6-preview-canonical-language');
  requireHeader(canonical, 'x-robots-tag', 'index,follow', 'r2-6-preview-canonical-robots');
  requireHeader(canonical, 'link', `<${canonicalPage.canonicalUrl}>; rel="canonical"`, 'r2-6-preview-canonical-link');
  const canonicalHtml = await canonical.text();
  if (!canonicalHtml.includes(`rel="canonical" href="${canonicalPage.canonicalUrl}"`)) {
    throw new Error('r2-6-preview-canonical-body');
  }

  const redirectEntry = runtime.adapter.entries[0];
  const params = new URLSearchParams({ from: redirectEntry.legacyPath, lang: 'en' });
  const redirect = await fetch(`${origin}${runtime.adapter.http.endpoint}?${params.toString()}`, { redirect: 'manual' });
  if (redirect.status !== 302) throw new Error(`r2-6-preview-redirect-status:${redirect.status}`);
  requireHeader(redirect, 'location', redirectEntry.successors.en, 'r2-6-preview-redirect-location');
  requireHeader(redirect, 'cache-control', 'no-store', 'r2-6-preview-redirect-cache');

  const unknown = await fetch(`${origin}/r2-6-preview-unknown-route`, { redirect: 'manual' });
  if (unknown.status !== 404) throw new Error(`r2-6-preview-404-status:${unknown.status}`);
  requireHeader(unknown, 'x-robots-tag', 'noindex,follow', 'r2-6-preview-404-robots');
  requireHeader(unknown, 'cache-control', 'no-store', 'r2-6-preview-404-cache');
} finally {
  await runtime.close();
}

console.log('R2.6 PREVIEW ENTRYPOINT: PASS');
console.log('bind_address=0.0.0.0');
console.log('semantic_runtime=R2.5-commissioned-runtime');
console.log('production_mutation=0');
