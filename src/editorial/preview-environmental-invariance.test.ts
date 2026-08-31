import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

interface R26Manifest {
  schemaVersion: 'editorial-preview-environmental-invariance/v0';
  contractId: 'PORTFOLIO-R2.6-2026-08-31';
  status: 'accepted';
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
  acceptedDeployment: {
    provider: 'Railway';
    origin: string;
    repository: '4LFR3Dv1/Portfolio';
    branch: 'r2/shadow-preview-deployment';
    commit: string;
    deploymentId: string;
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
    localPreviewBindingWitnessed: true;
    publicPreviewDeployed: true;
    publicTlsWitnessed: true;
    internetComparisonWitnessed: true;
    semanticDifferenceCount: 0;
    productionDeploymentChanged: false;
    productionDnsChanged: false;
    vercelConfigurationChanged: false;
    rootBuildScriptChanged: false;
  };
  physicalWitness: {
    githubRunId: number;
    githubJobId: number;
    artifactId: number;
    artifactZipSha256: string;
    tlsAuthorized: true;
    tlsProtocol: 'TLSv1.3';
    staticAssetCount: 2;
    semanticDifferenceCount: 0;
  };
  acceptance: {
    sameCommissionedRuntimeRequired: true;
    isolatedPublicOriginRequired: true;
    httpsRequired: true;
    semanticDifferenceCountRequired: 0;
    productionMutationCountRequired: 0;
    r2_6Complete: true;
    cutoverReady: false;
    cutoverAuthorized: false;
    nextRequiredCut: 'R2.7 — Cutover Readiness';
  };
}

interface R26Completion {
  status: 'complete';
  acceptedPreviewSpecimen: {
    branch: 'r2/shadow-preview-deployment';
    commit: string;
    deploymentId: string;
    origin: string;
  };
  githubWitness: {
    runId: number;
    jobId: number;
    artifactId: number;
  };
  tls: {
    authorized: true;
    protocol: 'TLSv1.3';
  };
  comparison: {
    semanticDifferenceCount: 0;
    warmRepeatWitnessed: true;
  };
  productionBoundary: {
    productionOriginContacted: false;
    productionMutationCount: 0;
  };
  acceptance: {
    r2_6Complete: true;
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
const completion = readJson<R26Completion>('docs/editorial/R2.6-completion.v0.json');
const r25 = readJson<R25Completion>('docs/editorial/R2.5-completion.v0.json');
const previewRuntime = readRepoFile('editorial-shell/runtime/preview-runtime.mjs');
const commissionedRuntime = readRepoFile('editorial-shell/runtime/commissioned-runtime.mjs');
const previewVerifier = readRepoFile('editorial-shell/scripts/verify-preview-invariance.mjs');
const previewDockerfile = readRepoFile('editorial-shell/preview.Dockerfile');
const shellWorkflow = readRepoFile('.github/workflows/editorial-shell-build.yml');
const previewWorkflow = readRepoFile('.github/workflows/editorial-preview-witness.yml');
const r26Doc = readRepoFile('docs/editorial/R2.6-shadow-preview-deployment.md');
const provenanceDoc = readRepoFile('docs/editorial/R2.6-deployment-provenance.md');
const r2Readme = readRepoFile('docs/editorial/R2-README.md');
const rootPackage = readJson<{ scripts: Record<string, string> }>('package.json');
const shellPackage = readJson<{ scripts: Record<string, string> }>('editorial-shell/package.json');
const vercel = readJson<{ rewrites: Array<{ source: string; destination: string }> }>('vercel.json');

describe('R2.6 shadow preview environmental invariance', () => {
  it('binds the exact R2.5 commissioned specimen without replacing semantic authority', () => {
    expect(manifest.schemaVersion).toBe('editorial-preview-environmental-invariance/v0');
    expect(manifest.contractId).toBe('PORTFOLIO-R2.6-2026-08-31');
    expect(manifest.status).toBe('accepted');
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

  it('binds an exact isolated provider snapshot and preserves a reproducible Internet comparator', () => {
    expect(manifest.acceptedDeployment).toMatchObject({
      provider: 'Railway',
      repository: '4LFR3Dv1/Portfolio',
      branch: 'r2/shadow-preview-deployment',
      commit: '17f3f01f06876811e6ca2f8a48c2de8da9b0efbf',
      deploymentId: '52b5b9ef-a80a-4ee2-8c54-20aa25975553',
      origin: 'https://r2-6-preview-production.up.railway.app',
    });
    expect(previewDockerfile).toContain('RUN cd editorial-shell && npm run build');
    expect(previewDockerfile).toContain('CMD ["node", "editorial-shell/runtime/preview-runtime.mjs"]');
    expect(shellPackage.scripts['verify:preview-entrypoint']).toBe('node scripts/verify-preview-entrypoint.mjs');
    expect(shellPackage.scripts['verify:preview']).toBe('node scripts/verify-preview-invariance.mjs');
    expect(previewVerifier).toContain('r2-6-production-origin-forbidden');
    expect(previewVerifier).toContain('rejectUnauthorized: true');
    expect(previewVerifier).toContain('semanticDifferenceCount: differences.length');
    expect(shellWorkflow).toContain('Witness real Internet TLS hosting invariance');
    expect(shellWorkflow).toContain('https://r2-6-preview-production.up.railway.app');
    expect(previewWorkflow).toContain('npm run verify:preview');
    expect(provenanceDoc).toContain('configured source branch');
    expect(provenanceDoc).toContain('deployed snapshot provenance');
  });

  it('accepts the physical public witness while keeping cutover and production closed', () => {
    expect(manifest.expected).toMatchObject({
      canonicalCount: 18,
      historicalCount: 4,
      handshakeCount: 4,
      redirectCount: 8,
      unknownStatus: 404,
      semanticDifferenceCount: 0,
      productionMutationCount: 0,
    });
    expect(manifest.currentState).toMatchObject({
      previewAdapterMaterialized: true,
      providerNeutralContainerMaterialized: true,
      localPreviewBindingWitnessed: true,
      publicPreviewDeployed: true,
      publicTlsWitnessed: true,
      internetComparisonWitnessed: true,
      semanticDifferenceCount: 0,
      productionDeploymentChanged: false,
      productionDnsChanged: false,
      vercelConfigurationChanged: false,
      rootBuildScriptChanged: false,
    });
    expect(manifest.physicalWitness).toMatchObject({
      githubRunId: 33399572149,
      githubJobId: 99512283933,
      artifactId: 9760687747,
      tlsAuthorized: true,
      tlsProtocol: 'TLSv1.3',
      staticAssetCount: 2,
      semanticDifferenceCount: 0,
    });
    expect(completion.status).toBe('complete');
    expect(completion.acceptedPreviewSpecimen.commit).toBe(manifest.acceptedDeployment.commit);
    expect(completion.acceptedPreviewSpecimen.deploymentId).toBe(manifest.acceptedDeployment.deploymentId);
    expect(completion.acceptedPreviewSpecimen.origin).toBe(manifest.acceptedDeployment.origin);
    expect(completion.githubWitness.runId).toBe(manifest.physicalWitness.githubRunId);
    expect(completion.githubWitness.jobId).toBe(manifest.physicalWitness.githubJobId);
    expect(completion.githubWitness.artifactId).toBe(manifest.physicalWitness.artifactId);
    expect(completion.tls.authorized).toBe(true);
    expect(completion.tls.protocol).toBe('TLSv1.3');
    expect(completion.comparison.semanticDifferenceCount).toBe(0);
    expect(completion.comparison.warmRepeatWitnessed).toBe(true);
    expect(completion.productionBoundary.productionOriginContacted).toBe(false);
    expect(completion.productionBoundary.productionMutationCount).toBe(0);
    expect(manifest.acceptance.r2_6Complete).toBe(true);
    expect(manifest.acceptance.cutoverReady).toBe(false);
    expect(manifest.acceptance.cutoverAuthorized).toBe(false);
    expect(manifest.acceptance.nextRequiredCut).toBe('R2.7 — Cutover Readiness');
    expect(completion.acceptance.r2_6Complete).toBe(true);
    expect(r25.acceptance.r2_5Complete).toBe(true);
    expect(r25.acceptance.deploymentMutationCount).toBe(0);
    expect(rootPackage.scripts.build).toBe('vite build');
    expect(vercel.rewrites).toEqual([{ source: '/((?!.*\\.).*)', destination: '/index.html' }]);
    expect(r26Doc).toContain('Status: **COMPLETE / PUBLIC INTERNET WITNESSED**');
    expect(r26Doc).toContain('R2_6_COMPLETE=true');
    expect(r2Readme).toContain('| R2.6 | Shadow / Preview Deployment | **COMPLETE** |');
    expect(r2Readme).toContain('NEXT=R2.7 — Cutover Readiness');
  });
});
