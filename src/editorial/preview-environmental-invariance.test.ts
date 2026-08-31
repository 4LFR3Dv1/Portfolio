import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

interface R26Manifest {
  schemaVersion: 'editorial-preview-environmental-invariance/v0';
  contractId: 'PORTFOLIO-R2.6-2026-08-31';
  status: 'materialized';
  normative: true;
  baseline: string;
  preconditions: {
    r2_5Complete: true;
    cutoverReady: false;
    cutoverAuthorized: false;
  };
  sourceSpecimen: {
    runtime: string;
    completion: string;
    acceptedArtifactDigest: string;
    deploymentMutationAllowed: false;
  };
  previewAdapter: {
    entrypoint: string;
    container: string;
    listenHost: '0.0.0.0';
    listenPortSource: 'PORT';
    semanticRuntimeReplacementAllowed: false;
    productionOriginForbidden: 'renan.snelabs.space';
  };
  expected: {
    canonicalCount: 18;
    historicalCount: 4;
    handshakeCount: 4;
    redirectCount: 8;
    unknownStatus: 404;
    semanticDifferenceCount: 0;
    productionMutationCount: 0;
  };
  currentState: {
    previewAdapterMaterialized: true;
    providerNeutralContainerMaterialized: true;
    localPreviewBindingWitnessed: false;
    publicPreviewDeployed: false;
    publicTlsWitnessed: false;
    internetComparisonWitnessed: false;
    productionDeploymentChanged: false;
    productionDnsChanged: false;
    vercelConfigurationChanged: false;
    rootBuildScriptChanged: false;
  };
  acceptance: {
    sameCommissionedRuntimeRequired: true;
    isolatedPublicOriginRequired: true;
    httpsRequired: true;
    semanticDifferenceCountRequired: 0;
    productionMutationCountRequired: 0;
    r2_6Complete: false;
    cutoverReady: false;
    cutoverAuthorized: false;
    nextRequiredCut: 'R2.7 — Cutover Readiness';
  };
}

interface R25Completion {
  materialization: {
    shellBuild: { artifactDigest: string };
  };
  acceptance: {
    r2_5Complete: true;
    cutoverReady: false;
    cutoverAuthorized: false;
    deploymentMutationCount: 0;
  };
}

function readRepoFile(path: string): string {
  return readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
}

function readJson<T>(path: string): T {
  return JSON.parse(readRepoFile(path)) as T;
}

const manifest = readJson<R26Manifest>('docs/editorial/preview-environmental-invariance.v0.json');
const r25 = readJson<R25Completion>('docs/editorial/R2.5-completion.v0.json');
const previewRuntime = readRepoFile('editorial-shell/runtime/preview-runtime.mjs');
const commissionedRuntime = readRepoFile('editorial-shell/runtime/commissioned-runtime.mjs');
const previewVerifier = readRepoFile('editorial-shell/scripts/verify-preview-invariance.mjs');
const previewDockerfile = readRepoFile('editorial-shell/preview.Dockerfile');
const previewWorkflow = readRepoFile('.github/workflows/editorial-preview-witness.yml');
const r26Doc = readRepoFile('docs/editorial/R2.6-shadow-preview-deployment.md');
const rootPackage = readJson<{ scripts: Record<string, string> }>('package.json');
const shellPackage = readJson<{ scripts: Record<string, string> }>('editorial-shell/package.json');
const vercel = readJson<{ rewrites: Array<{ source: string; destination: string }> }>('vercel.json');

describe('R2.6 shadow preview environmental invariance', () => {
  it('binds the exact R2.5 commissioned specimen without replacing semantic authority', () => {
    expect(manifest.schemaVersion).toBe('editorial-preview-environmental-invariance/v0');
    expect(manifest.contractId).toBe('PORTFOLIO-R2.6-2026-08-31');
    expect(manifest.status).toBe('materialized');
    expect(manifest.normative).toBe(true);
    expect(manifest.baseline).toBe('089f99298e895f299711449516efa55099f987f0');
    expect(manifest.preconditions.r2_5Complete).toBe(true);
    expect(manifest.sourceSpecimen.runtime).toBe('editorial-shell/runtime/commissioned-runtime.mjs');
    expect(manifest.sourceSpecimen.completion).toBe('docs/editorial/R2.5-completion.v0.json');
    expect(manifest.sourceSpecimen.acceptedArtifactDigest).toBe(r25.materialization.shellBuild.artifactDigest);
    expect(manifest.sourceSpecimen.deploymentMutationAllowed).toBe(false);
    expect(manifest.previewAdapter.semanticRuntimeReplacementAllowed).toBe(false);
    expect(previewRuntime).toContain("import { createCommissionedRuntime } from './commissioned-runtime.mjs'");
    expect(previewRuntime).toContain("runtime.listen(configuredPort, '0.0.0.0')");
    expect(commissionedRuntime).toContain("const listen = (port = 0, host = '127.0.0.1')");
  });

  it('materializes a provider-neutral isolated deployment and physical Internet comparator', () => {
    expect(manifest.previewAdapter.entrypoint).toBe('editorial-shell/runtime/preview-runtime.mjs');
    expect(manifest.previewAdapter.container).toBe('editorial-shell/preview.Dockerfile');
    expect(manifest.previewAdapter.listenHost).toBe('0.0.0.0');
    expect(manifest.previewAdapter.listenPortSource).toBe('PORT');
    expect(previewDockerfile).toContain('RUN cd editorial-shell && npm run build');
    expect(previewDockerfile).toContain('CMD ["node", "editorial-shell/runtime/preview-runtime.mjs"]');
    expect(shellPackage.scripts['verify:preview-entrypoint']).toBe('node scripts/verify-preview-entrypoint.mjs');
    expect(shellPackage.scripts['verify:preview']).toBe('node scripts/verify-preview-invariance.mjs');
    expect(previewVerifier).toContain('r2-6-production-origin-forbidden');
    expect(previewVerifier).toContain('rejectUnauthorized: true');
    expect(previewVerifier).toContain('semanticDifferenceCount: differences.length');
    expect(previewWorkflow).toContain('PREVIEW_ORIGIN: ${{ inputs.preview_origin }}');
    expect(previewWorkflow).toContain('npm run verify:preview');
  });

  it('keeps production authority and cutover state closed until a real public witness exists', () => {
    expect(manifest.expected).toMatchObject({
      canonicalCount: 18,
      historicalCount: 4,
      handshakeCount: 4,
      redirectCount: 8,
      unknownStatus: 404,
      semanticDifferenceCount: 0,
      productionMutationCount: 0,
    });
    expect(manifest.currentState.previewAdapterMaterialized).toBe(true);
    expect(manifest.currentState.providerNeutralContainerMaterialized).toBe(true);
    expect(manifest.currentState.localPreviewBindingWitnessed).toBe(false);
    expect(manifest.currentState.publicPreviewDeployed).toBe(false);
    expect(manifest.currentState.publicTlsWitnessed).toBe(false);
    expect(manifest.currentState.internetComparisonWitnessed).toBe(false);
    expect(manifest.currentState.productionDeploymentChanged).toBe(false);
    expect(manifest.currentState.productionDnsChanged).toBe(false);
    expect(manifest.currentState.vercelConfigurationChanged).toBe(false);
    expect(manifest.currentState.rootBuildScriptChanged).toBe(false);
    expect(manifest.acceptance.r2_6Complete).toBe(false);
    expect(manifest.acceptance.cutoverReady).toBe(false);
    expect(manifest.acceptance.cutoverAuthorized).toBe(false);
    expect(manifest.acceptance.nextRequiredCut).toBe('R2.7 — Cutover Readiness');
    expect(r25.acceptance.r2_5Complete).toBe(true);
    expect(r25.acceptance.deploymentMutationCount).toBe(0);
    expect(rootPackage.scripts.build).toBe('vite build');
    expect(vercel.rewrites).toEqual([{ source: '/((?!.*\\.).*)', destination: '/index.html' }]);
    expect(r26Doc).toContain('Status: **MATERIALIZED / AWAITING PUBLIC WITNESS**');
    expect(r26Doc).toContain('R2_6_COMPLETE=false');
  });
});
