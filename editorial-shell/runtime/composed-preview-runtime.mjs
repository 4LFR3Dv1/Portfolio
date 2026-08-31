/* global URL, process, console */

import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const runtimeDir = fileURLToPath(new URL('.', import.meta.url));
const distDir = resolve(runtimeDir, '../../dist');
const distPrefix = `${distDir}/`;
const port = Number(process.env.PORT || 8080);

const mimeTypes = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.html', 'text/html; charset=utf-8'],
  ['.ico', 'image/x-icon'],
  ['.jpeg', 'image/jpeg'],
  ['.jpg', 'image/jpeg'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.map', 'application/json; charset=utf-8'],
  ['.png', 'image/png'],
  ['.svg', 'image/svg+xml; charset=utf-8'],
  ['.txt', 'text/plain; charset=utf-8'],
  ['.webmanifest', 'application/manifest+json; charset=utf-8'],
  ['.xml', 'application/xml; charset=utf-8'],
]);

function safeCandidate(pathname) {
  let decoded;
  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    return null;
  }

  const normalized = normalize(decoded).replace(/^([/\\])+/, '');
  const candidate = resolve(distDir, normalized);
  return candidate === distDir || candidate.startsWith(distPrefix) ? candidate : null;
}

function resolveStatic(pathname) {
  const candidate = safeCandidate(pathname);
  if (!candidate) return null;
  if (existsSync(candidate) && statSync(candidate).isFile()) return candidate;
  if (existsSync(candidate) && statSync(candidate).isDirectory()) {
    const index = join(candidate, 'index.html');
    if (existsSync(index)) return index;
  }
  return null;
}

function sendFile(request, response, filePath) {
  const stat = statSync(filePath);
  response.statusCode = 200;
  response.setHeader('content-type', mimeTypes.get(extname(filePath).toLowerCase()) || 'application/octet-stream');
  response.setHeader('content-length', stat.size);
  response.setHeader('cache-control', extname(filePath) === '.html' ? 'no-cache' : 'public, max-age=3600');
  if (request.method === 'HEAD') {
    response.end();
    return;
  }
  createReadStream(filePath).pipe(response);
}

const server = createServer((request, response) => {
  if (!request.url || !['GET', 'HEAD'].includes(request.method || '')) {
    response.statusCode = 405;
    response.end('Method Not Allowed');
    return;
  }

  const url = new URL(request.url, 'http://localhost');
  const pathname = url.pathname;
  const staticFile = resolveStatic(pathname);

  if (staticFile) {
    sendFile(request, response, staticFile);
    return;
  }

  if (pathname === '/editorial') {
    response.statusCode = 308;
    response.setHeader('location', '/editorial/');
    response.end();
    return;
  }

  if (pathname.startsWith('/editorial/') || extname(pathname)) {
    response.statusCode = 404;
    response.setHeader('content-type', 'text/plain; charset=utf-8');
    response.end('Not Found');
    return;
  }

  sendFile(request, response, join(distDir, 'index.html'));
});

server.listen(port, '0.0.0.0', () => {
  console.log(`portfolio_composed_preview_listening=${port}`);
  console.log(`portfolio_composed_preview_dist=${distDir}`);
});
