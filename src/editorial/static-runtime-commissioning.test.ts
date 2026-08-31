import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

interface R25Manifest {
  schemaVersion: 'editorial-static-runtime-commissioning/v0';
  contractId: 'PORTFOLIO-R2.5-2026-08-31';
  status: 'materialized';
  normative: true;
  baseline: string;
  preconditions: {
    r1Complete: true;
    r2_0Complete: true;
    r2_1Complete: true;
    r2_2Complete: true;
    r2_3Complete: true;
    r2_4Complete: true;
    cutoverReady: false;
    cutoverAuthorized: false;
  };
  expected: {
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
    minimumStaticAssetCount: 1;
  };
  currentState: {
    commissionedRuntimeMaterialized: true;
    physicalRuntimeWitnessed: false;
    productionStaticRuntimeActivated: false;
    productionRedirectsActivated: false;
    legacyPublicSitemapReplaced: false;
    vercelConfigurationChanged: false;
    rootBuildScriptChanged: false;
    publicUiChanged: false;
    deployedRuntimeChanged: false;
  };
  acceptance: {
    deploymentMutationCount: 0;
    r2_5Complete: false;
    nextRequiredCut: 'R2.6 — Shadow / Preview Deployment';
  };
}

interface R24Completion {
  acceptance: {
    r2_4Complete: true;
    productionRedirectsActivated: false;
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

const manifest = readJson<R25Manifest>('docs/editorial/static-runtime-commissioning.v0.json');
const r24 = readJson<R24Completion>('docs/editorial/R2.4-completion.v0.json');
const rootPackage = readJson<{ scripts: Record<string, string> }>('package.json');
const shellPackage = readJson<{ scripts: Record<string, string> }>('editorial-shell/package.json');
const vercel = readJson<{ rewrites: Array<{ source: string; destination: string }> }>('vercel.json');
const runtimeSource = readRepoFile('editorial-shell/runtime/commissioned-runtime.mjs');
const verifierSource = readRepoFile('editorial-shell/scripts/verify-commissioned-runtime.mjs');
const workflow = readRepoFile('.github/workflows/editorial-shell-build.yml');
const r25Doc = readRepoFile('docs/editorial/R2.5-static-runtime-commissioning.md');
const r2Readme = readRepoFile('docs/editorial/R2-README.md');

describe('R2.5 static runtime commissioning materialization', () => {
  it('starts only from the closed R2.4 boundary and remains pre-cutover', () => {
    expect(r24.acceptance.r2_4Complete).toBe(true);
    expect(r24.acceptance.productionRedirectsActivated).toBe(false);
    expect(r24.acceptance.cutoverReady).toBe(false);
    expect(r24.acceptance.cutoverAuthorized).toBe(false);
    expect(r24.acceptance.deploymentMutationCount).toBe(0);

    expect(manifest.schemaVersion).toBe('editorial-static-runtime-commissioning/v0');
    expect(manifest.contractId).toBe('PORTFOLIO-R2.5-2026-08-31');
    expect(manifest.status).toBe('materialized');
    expect(manifest.normative).toBe(true);
    expect(manifest.baseline).toBe('d5f6f530effc411a718eae60dae613cc13b8a5a4');
    expect(manifest.preconditions.r2_4Complete).toBe(true);
    expect(manifest.preconditions.cutoverReady).toBe(false);
    expect(manifest.preconditions.cutoverAuthorized).toBe(false);
  });

  it('freezes one integrated HTTP campaign rather than isolated artifact counts', () => {
    expect(manifest.expected).toEqual({
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
      minimumStaticAssetCount: 1,
    });
    expect(runtimeSource).toContain('createCommissionedRuntime');
    expect(runtimeSource).toContain('X-Commissioned-Runtime');
    expect(runtimeSource).toContain('public, max-age=31536000, immutable');
    expect(runtimeSource).toContain('no-store');
    expect(runtimeSource).toContain('404.html');
    expect(runtimeSource).toContain('resolveCompatibilityRedirectRequest');
    expect(runtimeSource).toContain('application/pdf');
    expect(verifierSource).toContain('canonical_200=18');
    expect(verifierSource).toContain('redirect_302=8');
    expect(verifierSource).toContain('successor_loss_503=1');
    expect(verifierSource).toContain('random-path-that-does-not-exist');
    expect(verifierSource).toContain('application/rss+xml');
    expect(verifierSource).toContain('static_assets=');
  });

  it('wires commissioning into the isolated shell pipeline without changing production', () => {
    expect(shellPackage.scripts.commission).toBe('node runtime/commissioned-runtime.mjs');
    expect(shellPackage.scripts['verify:commissioned']).toBe('node scripts/verify-commissioned-runtime.mjs');
    expect(workflow).toContain('Commission full static runtime');
    expect(workflow).toContain('npm run verify:commissioned');

    expect(rootPackage.scripts.build).toBe('vite build');
    expect(vercel.rewrites).toEqual([{ source: '/((?!.*\\.).*)', destination: '/index.html' }]);
    expect(manifest.currentState.productionStaticRuntimeActivated).toBe(false);
    expect(manifest.currentState.productionRedirectsActivated).toBe(false);
    expect(manifest.currentState.legacyPublicSitemapReplaced).toBe(false);
    expect(manifest.currentState.vercelConfigurationChanged).toBe(false);
    expect(manifest.currentState.rootBuildScriptChanged).toBe(false);
    expect(manifest.currentState.publicUiChanged).toBe(false);
    expect(manifest.currentState.deployedRuntimeChanged).toBe(false);
    expect(manifest.acceptance.deploymentMutationCount).toBe(0);
  });

  it('keeps the program in R2.5 until the physical dual witness closes it', () => {
    expect(manifest.currentState.commissionedRuntimeMaterialized).toBe(true);
    expect(manifest.currentState.physicalRuntimeWitnessed).toBe(false);
    expect(manifest.acceptance.r2_5Complete).toBe(false);
    expect(manifest.acceptance.nextRequiredCut).toBe('R2.6 — Shadow / Preview Deployment');
    expect(r25Doc).toContain('Status: **MATERIALIZED / AWAITING DUAL CI WITNESS**');
    expect(r2Readme).toContain('| R2.5 | Static Runtime Commissioning | **MATERIALIZED / AWAITING WITNESS** |');
    expect(r2Readme).toContain('R2_5_COMPLETE=false');
  });
});
