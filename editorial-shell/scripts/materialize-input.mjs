/* global URL, console */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

const repoRoot = fileURLToPath(new URL('../../', import.meta.url));
const output = fileURLToPath(new URL('../src/generated/accepted-publication-state.json', import.meta.url));

const server = await createServer({
  root: repoRoot,
  appType: 'custom',
  logLevel: 'error',
  server: { middlewareMode: true },
});

try {
  const module = await server.ssrLoadModule('/src/editorial/renderer-input.ts');
  const input = module.materializeAcceptedRendererInput();
  mkdirSync(dirname(output), { recursive: true });
  writeFileSync(output, `${JSON.stringify(input, null, 2)}\n`, 'utf8');
  console.log('R2.1 RENDERER INPUT MATERIALIZATION: PASS');
  console.log(`pages=${input.pages.length}`);
  console.log(`surfaces=${input.surfaces.length}`);
  console.log(`documents=${input.documents.length}`);
  console.log(`distribution_digest=${input.source.distributionDigest}`);
} finally {
  await server.close();
}
