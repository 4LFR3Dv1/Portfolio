/* global URL, console, fetch */
import http from 'node:http';
import { fileURLToPath } from 'node:url';
import { createServer as createViteServer } from 'vite';

const repoRoot = fileURLToPath(new URL('../../', import.meta.url));
const vite = await createViteServer({
  root: repoRoot,
  configFile: false,
  appType: 'custom',
  logLevel: 'error',
  server: { middlewareMode: true },
});

try {
  const inputModule = await vite.ssrLoadModule('/src/editorial/renderer-input.ts');
  const adapterModule = await vite.ssrLoadModule('/src/editorial/compatibility-redirect-adapter.ts');
  const input = inputModule.materializeAcceptedRendererInput();
  const adapter = input.redirects;
  const distributed = new Set(input.pages.map((page) => page.canonicalPath));

  const serveWith = (paths) => http.createServer((request, response) => {
    const url = new URL(request.url ?? '/', 'http://127.0.0.1');
    if (url.pathname !== adapter.http.endpoint) {
      response.writeHead(404, { 'Cache-Control': 'no-store' });
      response.end('unresolved');
      return;
    }

    const decision = adapterModule.resolveCompatibilityRedirectRequest(
      adapter,
      url.searchParams.get(adapter.http.requestSourceParameter) ?? '',
      url.searchParams.get(adapter.http.requestLanguageParameter),
      paths,
    );
    const headers = { 'Cache-Control': adapter.http.cacheControl };
    if (decision.state === 'redirect') headers.Location = decision.location;
    response.writeHead(decision.status, headers);
    response.end(decision.state);
  });

  const listen = (server) => new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => resolve(server.address()));
  });

  const request = async (port, path, headers = {}) => fetch(`http://127.0.0.1:${port}${path}`, {
    redirect: 'manual',
    headers,
  });

  const server = serveWith(distributed);
  const address = await listen(server);
  if (!address || typeof address === 'string') throw new Error('redirect-adapter-address-unavailable');
  try {
    const en = await request(address.port, '/_compat/redirect?from=%2Fwork%2Fvira&lang=en');
    if (en.status !== 302) throw new Error(`redirect-adapter-en-status:${en.status}`);
    if (en.headers.get('location') !== '/en/systems/vira') throw new Error(`redirect-adapter-en-location:${en.headers.get('location')}`);

    const pt = await request(address.port, '/_compat/redirect?from=%2Fwork%2Fvira&lang=pt');
    if (pt.status !== 302) throw new Error(`redirect-adapter-pt-status:${pt.status}`);
    if (pt.headers.get('location') !== '/pt-br/systems/vira') throw new Error(`redirect-adapter-pt-location:${pt.headers.get('location')}`);

    const acceptLanguage = await request(
      address.port,
      '/_compat/redirect?from=%2Fwork%2Fvira',
      { 'Accept-Language': 'pt-BR,pt;q=0.9' },
    );
    if (acceptLanguage.status !== 400) throw new Error(`redirect-adapter-accept-language-inferred:${acceptLanguage.status}`);

    const preserved = await request(address.port, '/_compat/redirect?from=%2Fwork%2Fagentic-systems&lang=en');
    if (preserved.status !== 404) throw new Error(`redirect-adapter-preserved-route-absorbed:${preserved.status}`);
  } finally {
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  }

  const missingTargetPaths = new Set(distributed);
  missingTargetPaths.delete('/pt-br/systems/vira');
  const failClosedServer = serveWith(missingTargetPaths);
  const failClosedAddress = await listen(failClosedServer);
  if (!failClosedAddress || typeof failClosedAddress === 'string') throw new Error('redirect-adapter-fail-closed-address-unavailable');
  try {
    const blocked = await request(failClosedAddress.port, '/_compat/redirect?from=%2Fwork%2Fvira&lang=pt');
    if (blocked.status !== 503) throw new Error(`redirect-adapter-successor-absence-not-blocked:${blocked.status}`);
    if (blocked.headers.has('location')) throw new Error('redirect-adapter-successor-absence-location-leak');
  } finally {
    await new Promise((resolve, reject) => failClosedServer.close((error) => error ? reject(error) : resolve()));
  }

  console.log('R2.4 COMPATIBILITY REDIRECT HTTP ADAPTER: PASS');
  console.log(`redirect_routes=${adapter.entries.length}`);
  console.log('redirect_status=302');
  console.log('language_source=portfolio-language');
  console.log('accept_language_inference=0');
  console.log('successor_absence_redirects=0');
  console.log('fail_closed_status=503');
} finally {
  await vite.close();
}
