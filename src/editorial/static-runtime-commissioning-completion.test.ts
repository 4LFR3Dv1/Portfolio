import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

interface R25Completion {
  schemaVersion: 'editorial-static-runtime-commissioning-completion/v0';
  status: 'frozen';
  normative: true;
  contractId: 'PORTFOLIO-R2.5-2026-08-31';
  materialization: {
    commit: string;
    verify: { workflow: 'Verify'; runId: number; conclusion: 'success' };
    shellBuild: {
      workflow: 'Editorial Shell Build';
      runId: number;
      conclusion: 'success';
      artifactId: number;
      artifactDigest: string;
    };
    manifestPath: string;
    manifestBlobSha: string;
  };
  effectiveRuntime: {
    canonical200Count: 18;
    historical200Count: 4;
    handshake200Count: 4;
    redirect302Count: 8;
    successorLoss503Count: 1;
    unknown404Count: 1;
    sitemapUrlCount: 18;
    rssFeedCount: 2;
    rssItemCount: 0;
    searchEntryCount: 6;
    staticAssetCount: number;
    canonicalHeaderMismatchCount: 0;
    historicalCanonicalLeakCount: 0;
    handshakeCanonicalLeakCount: 0;
    contentTypeMismatchCount: 0;
    cachePolicyMismatchCount: 0;
    successorLossLocationLeakCount: 0;
    productionStaticRuntimeActivated: false;
    productionRedirectsActivated: false;
    legacyPublicSitemapReplaced: false;
    vercelConfigurationChanged: false;
    rootBuildScriptChanged: false;
    publicUiChanged: false;
    deployedRuntimeChanged: false;
  };
  acceptance: {
    r1Complete: true;
    r2_0Complete: true;
    r2_1Complete: true;
    r2_2Complete: true;
    r2_3Complete: true;
    r2_4Complete: true;
    r2_5Complete: true;
    commissionedRuntimePhysicallyWitnessed: true;
    integratedHttpCampaignPassed: true;
    canonicalHeaderHtmlConsistencyPreserved: true;
    distributionArtifactsPhysicallyServed: true;
    staticAssetsPhysicallyReachable: true;
    failClosedSuccessorLossWitnessed: true;
    cutoverReady: false;
    cutoverAuthorized: false;
    deploymentMutationCount: 0;
    nextRequiredCut: 'R2.6 — Shadow / Preview Deployment';
  };
}

interface R25Manifest {
  expected: {
    minimumStaticAssetCount: number;
  };
  currentState: {
    physicalRuntimeWitnessed: false;
    productionStaticRuntimeActivated: false;
    deployedRuntimeChanged: false;
  };
  acceptance: {
    r2_5Complete: false;
    deploymentMutationCount: 0;
  };
}

function readRepoFile(path: string): string {
  return readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
}

function readJson<T>(path: string): T {
  return JSON.parse(readRepoFile(path)) as T;
}

function gitBlobSha(content: string): string {
  const bytes = Buffer.from(content, 'utf8');
  return createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
}

const manifestText = readRepoFile('docs/editorial/static-runtime-commissioning.v0.json');
const manifest = JSON.parse(manifestText) as R25Manifest;
const completion = readJson<R25Completion>('docs/editorial/R2.5-completion.v0.json');
const r25Doc = readRepoFile('docs/editorial/R2.5-static-runtime-commissioning.md');
const r2Readme = readRepoFile('docs/editorial/R2-README.md');
const rootPackage = readJson<{ scripts: Record<string, string> }>('package.json');
const vercel = readJson<{ rewrites: Array<{ source: string; destination: string }> }>('vercel.json');

describe('R2.5 terminal completion seal', () => {
  it('binds the exact materialization manifest and accepted dual CI witness', () => {
    expect(completion.schemaVersion).toBe('editorial-static-runtime-commissioning-completion/v0');
    expect(completion.status).toBe('frozen');
    expect(completion.normative).toBe(true);
    expect(completion.contractId).toBe('PORTFOLIO-R2.5-2026-08-31');
    expect(completion.materialization).toEqual({
      commit: 'e6953d2c6cd160fe91eac488cdb5cc020bd18ef5',
      verify: { workflow: 'Verify', runId: 33396220080, conclusion: 'success' },
      shellBuild: {
        workflow: 'Editorial Shell Build',
        runId: 33396220090,
        conclusion: 'success',
        artifactId: 9759413009,
        artifactDigest: 'sha256:e072e3fdb6f8a99dbc016633fdecaf1050edbfd2007b7bc9b566168089111c26',
      },
      manifestPath: 'docs/editorial/static-runtime-commissioning.v0.json',
      manifestBlobSha: 'd203561179865ae8a9fa900fdded24c03f53379c',
    });
    expect(gitBlobSha(manifestText)).toBe(completion.materialization.manifestBlobSha);
  });

  it('freezes the integrated physical runtime outcome rather than promoting materialization facts', () => {
    expect(manifest.currentState.physicalRuntimeWitnessed).toBe(false);
    expect(manifest.acceptance.r2_5Complete).toBe(false);
    expect(completion.effectiveRuntime).toMatchObject({
      canonical200Count: 18,
      historical200Count: 4,
      handshake200Count: 4,
      redirect302Count: 8,
      successorLoss503Count: 1,
      unknown404Count: 1,
      sitemapUrlCount: 18,
      rssFeedCount: 2,
      rssItemCount: 0,
      searchEntryCount: 6,
      staticAssetCount: 2,
      canonicalHeaderMismatchCount: 0,
      historicalCanonicalLeakCount: 0,
      handshakeCanonicalLeakCount: 0,
      contentTypeMismatchCount: 0,
      cachePolicyMismatchCount: 0,
      successorLossLocationLeakCount: 0,
    });
    expect(completion.effectiveRuntime.staticAssetCount).toBeGreaterThanOrEqual(manifest.expected.minimumStaticAssetCount);
    expect(completion.acceptance.commissionedRuntimePhysicallyWitnessed).toBe(true);
    expect(completion.acceptance.integratedHttpCampaignPassed).toBe(true);
    expect(completion.acceptance.canonicalHeaderHtmlConsistencyPreserved).toBe(true);
    expect(completion.acceptance.distributionArtifactsPhysicallyServed).toBe(true);
    expect(completion.acceptance.staticAssetsPhysicallyReachable).toBe(true);
    expect(completion.acceptance.failClosedSuccessorLossWitnessed).toBe(true);
  });

  it('closes commissioning while keeping preview, cutover and production mutation closed', () => {
    expect(completion.acceptance.r2_5Complete).toBe(true);
    expect(completion.acceptance.cutoverReady).toBe(false);
    expect(completion.acceptance.cutoverAuthorized).toBe(false);
    expect(completion.acceptance.deploymentMutationCount).toBe(0);
    expect(completion.acceptance.nextRequiredCut).toBe('R2.6 — Shadow / Preview Deployment');
    expect(completion.effectiveRuntime.productionStaticRuntimeActivated).toBe(false);
    expect(completion.effectiveRuntime.productionRedirectsActivated).toBe(false);
    expect(completion.effectiveRuntime.legacyPublicSitemapReplaced).toBe(false);
    expect(completion.effectiveRuntime.vercelConfigurationChanged).toBe(false);
    expect(completion.effectiveRuntime.rootBuildScriptChanged).toBe(false);
    expect(completion.effectiveRuntime.publicUiChanged).toBe(false);
    expect(completion.effectiveRuntime.deployedRuntimeChanged).toBe(false);
    expect(rootPackage.scripts.build).toBe('vite build');
    expect(vercel.rewrites).toEqual([{ source: '/((?!.*\\.).*)', destination: '/index.html' }]);
    expect(r25Doc).toContain('Status: **COMPLETE / DUAL CI WITNESSED**');
    expect(r25Doc).toContain('R2_5_COMPLETE=true');
    expect(r2Readme).toContain('| R2.5 | Static Runtime Commissioning | **COMPLETE** |');
    expect(r2Readme).toContain('| R2.6 | Shadow / Preview Deployment |');
    expect(r2Readme).toContain('R2_5_COMPLETE=true');
  });
});
