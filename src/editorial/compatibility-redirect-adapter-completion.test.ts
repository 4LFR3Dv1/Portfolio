import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { materializeAcceptedRendererInput } from './renderer-input';

interface R24Completion {
  schemaVersion: 'editorial-compatibility-redirect-adapter-completion/v0';
  status: 'frozen';
  normative: true;
  contractId: 'PORTFOLIO-R2.4-2026-08-31';
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
  effectiveRedirect: {
    canonicalStaticPageCount: 18;
    legacyPreservedPageCount: 4;
    redirectHandshakePageCount: 4;
    totalStaticPageCount: 26;
    redirectRouteCount: 4;
    distributedTargetCount: 8;
    physicallyWitnessed302Count: 8;
    redirectStatus: 302;
    failClosedStatus: 503;
    invalidRequestStatus: 400;
    unknownPathStatus: 404;
    acceptLanguageInferenceCount: 0;
    navigatorLanguageInferenceCount: 0;
    directServerLocalStorageReadCount: 0;
    successorAbsenceRedirectCount: 0;
    preservedLegacyRedirectCount: 0;
    redirectCanonicalMetadataCount: 0;
    redirectHreflangLinkCount: 0;
    redirectSitemapEntryCount: 0;
    redirectRssItemCount: 0;
    redirectSearchEntryCount: 0;
    productionAdapterActivated: false;
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
    redirectAdapterPhysicallyMaterialized: true;
    http302PhysicallyWitnessed: true;
    distributedSuccessorsRevalidated: true;
    failClosedSuccessorLossWitnessed: true;
    productionRedirectsActivated: false;
    cutoverReady: false;
    cutoverAuthorized: false;
    deploymentMutationCount: 0;
    nextRequiredCut: 'R2.5 — Static Runtime Commissioning';
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

const manifestText = readRepoFile('docs/editorial/compatibility-redirect-adapter.v0.json');
const completion = readJson<R24Completion>('docs/editorial/R2.4-completion.v0.json');
const r24Doc = readRepoFile('docs/editorial/R2.4-compatibility-redirect-adapter.md');
const r2Readme = readRepoFile('docs/editorial/R2-README.md');
const rootPackage = readJson<{ scripts: Record<string, string> }>('package.json');
const vercel = readJson<{ rewrites: Array<{ source: string; destination: string }> }>('vercel.json');
const input = materializeAcceptedRendererInput();

describe('R2.4 terminal completion seal', () => {
  it('binds the exact redirect manifest and dual materialization witnesses', () => {
    expect(completion.schemaVersion).toBe('editorial-compatibility-redirect-adapter-completion/v0');
    expect(completion.status).toBe('frozen');
    expect(completion.normative).toBe(true);
    expect(completion.contractId).toBe('PORTFOLIO-R2.4-2026-08-31');
    expect(completion.materialization).toEqual({
      commit: 'e14f79ab82bc12d5f34e62b6d0c7d9043a77322c',
      verify: { workflow: 'Verify', runId: 33394177204, conclusion: 'success' },
      shellBuild: {
        workflow: 'Editorial Shell Build',
        runId: 33394177239,
        conclusion: 'success',
        artifactId: 9758646215,
        artifactDigest: 'sha256:2db9c5da6f046c96605ac6a84e107f6eb6c63f6f2e20e43e631de78912bd4089',
      },
      manifestPath: 'docs/editorial/compatibility-redirect-adapter.v0.json',
      manifestBlobSha: 'ec087ff3797dfbf8f150cc711280d754c551b2cf',
    });
    expect(gitBlobSha(manifestText)).toBe(completion.materialization.manifestBlobSha);
  });

  it('reconstructs the exact four redirect routes and all eight distributed successors', () => {
    expect(input.pages).toHaveLength(completion.effectiveRedirect.canonicalStaticPageCount);
    expect(input.legacy.pages).toHaveLength(completion.effectiveRedirect.legacyPreservedPageCount);
    expect(input.redirects.entries).toHaveLength(completion.effectiveRedirect.redirectRouteCount);
    const targets = input.redirects.entries.flatMap((entry) => Object.values(entry.successors));
    const distributed = new Set(input.pages.map((page) => page.canonicalPath));
    expect(targets).toHaveLength(completion.effectiveRedirect.distributedTargetCount);
    expect(new Set(targets).size).toBe(completion.effectiveRedirect.distributedTargetCount);
    expect(targets.every((target) => distributed.has(target))).toBe(true);
    expect(completion.effectiveRedirect.redirectHandshakePageCount).toBe(4);
    expect(completion.effectiveRedirect.totalStaticPageCount).toBe(26);
    expect(completion.effectiveRedirect.physicallyWitnessed302Count).toBe(8);
    expect(input.redirects.http.redirectStatus).toBe(302);
    expect(input.redirects.http.blockedStatus).toBe(503);
    expect(input.redirects.http.cacheControl).toBe('no-store');
  });

  it('closes R2.4 without activating production routing or allowing language inference', () => {
    expect(completion.acceptance.r2_4Complete).toBe(true);
    expect(completion.acceptance.redirectAdapterPhysicallyMaterialized).toBe(true);
    expect(completion.acceptance.http302PhysicallyWitnessed).toBe(true);
    expect(completion.acceptance.distributedSuccessorsRevalidated).toBe(true);
    expect(completion.acceptance.failClosedSuccessorLossWitnessed).toBe(true);
    expect(completion.acceptance.productionRedirectsActivated).toBe(false);
    expect(completion.acceptance.cutoverReady).toBe(false);
    expect(completion.acceptance.cutoverAuthorized).toBe(false);
    expect(completion.acceptance.deploymentMutationCount).toBe(0);
    expect(completion.acceptance.nextRequiredCut).toBe('R2.5 — Static Runtime Commissioning');
    expect(completion.effectiveRedirect.acceptLanguageInferenceCount).toBe(0);
    expect(completion.effectiveRedirect.navigatorLanguageInferenceCount).toBe(0);
    expect(completion.effectiveRedirect.directServerLocalStorageReadCount).toBe(0);
    expect(completion.effectiveRedirect.successorAbsenceRedirectCount).toBe(0);
    expect(completion.effectiveRedirect.preservedLegacyRedirectCount).toBe(0);
    expect(completion.effectiveRedirect.productionAdapterActivated).toBe(false);
    expect(completion.effectiveRedirect.vercelConfigurationChanged).toBe(false);
    expect(completion.effectiveRedirect.rootBuildScriptChanged).toBe(false);
    expect(completion.effectiveRedirect.deployedRuntimeChanged).toBe(false);
    expect(rootPackage.scripts.build).toBe('vite build');
    expect(vercel.rewrites).toEqual([{ source: '/((?!.*\\.).*)', destination: '/index.html' }]);
    expect(r24Doc).toContain('Status: **COMPLETE / DUAL CI WITNESSED**');
    expect(r2Readme).toContain('| R2.4 | Compatibility Redirect Adapter | **COMPLETE** |');
    expect(r2Readme).toContain('| R2.5 | Static Runtime Commissioning |');
    expect(r2Readme).toContain('R2_4_COMPLETE=true');
  });
});
