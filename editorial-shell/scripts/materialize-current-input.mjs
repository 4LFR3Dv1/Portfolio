/* global URL, console, process */
import { createHash } from 'node:crypto';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

const repoRoot = fileURLToPath(new URL('../../', import.meta.url));
const output = fileURLToPath(new URL('../src/generated/current-publication-state.json', import.meta.url));
const witnessPath = fileURLToPath(new URL('../r2-a1-1-current-renderer-input-witness.json', import.meta.url));

const server = await createServer({
  root: repoRoot,
  configFile: false,
  appType: 'custom',
  logLevel: 'error',
  server: { middlewareMode: true },
});

try {
  const module = await server.ssrLoadModule('/src/editorial/current-renderer-input.ts');
  const input = module.materializeCurrentRendererInput();
  const rendererInputDigest = module.currentRendererInputDigest(input);
  const bytes = `${JSON.stringify(input, null, 2)}\n`;
  const generatedByteDigest = `sha256_${createHash('sha256').update(bytes, 'utf8').digest('hex')}`;

  mkdirSync(dirname(output), { recursive: true });
  writeFileSync(output, bytes, 'utf8');

  const witness = {
    schemaVersion: 'editorial-current-renderer-input-physical-witness/v0',
    source: {
      acceptedPublicationDigest: input.source.acceptedPublicationDigest,
      semanticCompletionContractId: input.source.semanticCompletionContractId,
      physicalBoundaryCompletionContractId: input.source.physicalBoundaryCompletionContractId,
    },
    materialization: {
      rendererInputDigest,
      generatedByteDigest,
      surfaceCount: input.surfaces.length,
      documentCount: input.documents.length,
      englishDocumentCount: input.documents.filter((entry) => entry.language === 'en').length,
      portugueseDocumentCount: input.documents.filter((entry) => entry.language === 'pt-BR').length,
      generatedPath: 'editorial-shell/src/generated/current-publication-state.json',
    },
    boundary: {
      distributionEmitted: false,
      shellBuildSwitchedToCurrentInput: false,
      runtimeRecommissioned: false,
      previewRedeployed: false,
      productionMutationCount: 0,
    },
  };
  writeFileSync(witnessPath, `${JSON.stringify(witness, null, 2)}\n`, 'utf8');

  console.log('R2-A1.1 CURRENT RENDERER INPUT MATERIALIZATION: PASS');
  console.log(`accepted_publication_digest=${input.source.acceptedPublicationDigest}`);
  console.log(`renderer_input_digest=${rendererInputDigest}`);
  console.log(`generated_byte_digest=${generatedByteDigest}`);
  console.log(`surfaces=${input.surfaces.length}`);
  console.log(`documents=${input.documents.length}`);
  console.log(`english_documents=${witness.materialization.englishDocumentCount}`);
  console.log(`portuguese_documents=${witness.materialization.portugueseDocumentCount}`);
  console.log(`witness=${witnessPath}`);
} finally {
  await server.close();
}
