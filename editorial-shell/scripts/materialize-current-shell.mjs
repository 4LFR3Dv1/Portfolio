/* global URL, console */
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

const ACCEPTED_PUBLICATION_DIGEST = 'sha256_f72c807283aa0f2da0a20b3ecaf1ec5f99227fedac47aa9fb988f5c924997d32';
const ACCEPTED_RENDERER_INPUT_DIGEST = 'sha256_4b2bc45e2127befd4f7be0aaf7b4a2cebe0ad7ab9da7a7fa774414af155d73e6';
const ACCEPTED_DISTRIBUTION_DIGEST = 'sha256_b7813fa7400b1ad205cd82bf32ecad86d4c9790d7d03630033dcc68c6d8dc308';

const repoRoot = fileURLToPath(new URL('../../', import.meta.url));
const output = fileURLToPath(new URL('../src/generated/accepted-publication-state.json', import.meta.url));
const witnessPath = fileURLToPath(new URL('../r2-a1-3-current-shell-input-witness.json', import.meta.url));

const vite = await createServer({
  root: repoRoot,
  configFile: false,
  appType: 'custom',
  logLevel: 'error',
  server: { middlewareMode: true },
});

try {
  const currentInputModule = await vite.ssrLoadModule('/src/editorial/current-renderer-input.ts');
  const currentDistributionModule = await vite.ssrLoadModule('/src/editorial/current-distribution-runtime.ts');
  const emissionModule = await vite.ssrLoadModule('/src/editorial/distribution-emission.ts');
  const historicalInputModule = await vite.ssrLoadModule('/src/editorial/renderer-input.ts');

  const currentInput = currentInputModule.materializeCurrentRendererInput();
  const rendererInputDigest = currentInputModule.currentRendererInputDigest(currentInput);
  const distribution = currentDistributionModule.materializeCurrentDistribution();
  const distributionDigest = currentDistributionModule.currentDistributionDigest(distribution);
  const reconstructedEmission = emissionModule.reconstructDistributionEmission(distribution, distributionDigest);
  const historicalTransport = historicalInputModule.materializeAcceptedRendererInput();

  if (currentInput.source.acceptedPublicationDigest !== ACCEPTED_PUBLICATION_DIGEST) {
    throw new Error(`current-shell-publication-digest:${currentInput.source.acceptedPublicationDigest}`);
  }
  if (rendererInputDigest !== ACCEPTED_RENDERER_INPUT_DIGEST) {
    throw new Error(`current-shell-renderer-input-digest:${rendererInputDigest}`);
  }
  if (distributionDigest !== ACCEPTED_DISTRIBUTION_DIGEST) {
    throw new Error(`current-shell-distribution-digest:${distributionDigest}`);
  }
  if (reconstructedEmission.state !== 'ready' || !reconstructedEmission.emission) {
    throw new Error(`current-shell-emission-conflict:${reconstructedEmission.errors.join(',')}`);
  }

  const distributedPaths = new Set(distribution.pages.map((page) => page.canonicalPath));
  const missingRedirectTargets = historicalTransport.redirects.entries
    .flatMap((entry) => [entry.successors.en, entry.successors['pt-BR']])
    .filter((path) => !distributedPaths.has(path));
  if (missingRedirectTargets.length > 0) {
    throw new Error(`current-shell-compatibility-target-missing:${missingRedirectTargets.join(',')}`);
  }

  const state = {
    schemaVersion: 'editorial-current-publication-state/v0',
    source: {
      semanticCompletionContractId: currentInput.source.semanticCompletionContractId,
      physicalBoundaryCompletionContractId: currentInput.source.physicalBoundaryCompletionContractId,
      acceptedPublicationDigest: ACCEPTED_PUBLICATION_DIGEST,
      rendererInputDigest: ACCEPTED_RENDERER_INPUT_DIGEST,
      distributionDigest: ACCEPTED_DISTRIBUTION_DIGEST,
      compatibilitySourceContractId: historicalTransport.redirects.sourceContractId,
      historicalTransportUsedAsSemanticAuthority: false,
    },
    pages: distribution.pages,
    distribution,
    emission: reconstructedEmission.emission,
    surfaces: currentInput.surfaces,
    documents: currentInput.documents,
    shellPlan: historicalTransport.shellPlan,
    legacy: historicalTransport.legacy,
    redirects: historicalTransport.redirects,
  };

  writeFileSync(output, `${JSON.stringify(state, null, 2)}\n`, 'utf8');
  writeFileSync(witnessPath, `${JSON.stringify({
    schemaVersion: 'editorial-current-shell-input-physical-witness/v0',
    source: state.source,
    materialization: {
      canonicalPageCount: distribution.pages.length,
      surfacePageCount: distribution.pages.filter((page) => page.source === 'surface').length,
      documentPageCount: distribution.pages.filter((page) => page.source === 'document').length,
      metadataEntryCount: distribution.metadata.length,
      sitemapEntryCount: distribution.sitemap.length,
      rssFeedCount: distribution.rss.length,
      rssItemCount: distribution.rss.flatMap((feed) => feed.items).length,
      searchEntryCount: distribution.search.length,
      compatibilityRedirectCount: historicalTransport.redirects.entries.length,
      compatibilityTargetCount: historicalTransport.redirects.entries.length * 2,
      compatibilityMissingTargetCount: 0,
    },
    boundary: {
      historicalRendererInputUsedAsSemanticAuthority: false,
      currentStaticRuntimeRecommissioned: false,
      currentPreviewRedeployed: false,
      productionMutationCount: 0,
    },
  }, null, 2)}\n`, 'utf8');

  console.log('R2-A1.3 CURRENT SHELL INPUT MATERIALIZATION: PASS');
  console.log(`accepted_publication_digest=${ACCEPTED_PUBLICATION_DIGEST}`);
  console.log(`renderer_input_digest=${rendererInputDigest}`);
  console.log(`distribution_digest=${distributionDigest}`);
  console.log(`canonical_pages=${distribution.pages.length}`);
  console.log(`compatibility_redirects=${historicalTransport.redirects.entries.length}`);
  console.log('compatibility_missing_targets=0');
} finally {
  await vite.close();
}
