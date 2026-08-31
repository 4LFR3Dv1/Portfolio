import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { materializeAcceptedRendererInput } from './renderer-input';

interface R21Completion {
  schemaVersion: 'editorial-astro-shell-materialization-completion/v0';
  status: 'frozen';
  normative: true;
  contractId: 'PORTFOLIO-R2.1-2026-08-30';
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
  effectiveShell: {
    astroVersion: '7.2.9';
    viteVersion: '8.2.2';
    dependencyLockMaterialized: true;
    boundedRendererInputMaterialized: true;
    rendererDirectInstitutionalReadCount: 0;
    canonicalStaticPageCount: 18;
    surfacePageCount: 12;
    publicSemanticDocumentCount: 6;
    explicit404Materialized: true;
    sanitizedSemanticLeakCount: 0;
    legacyPreservedPagesRendered: 0;
    compatibilityRedirectsEnacted: false;
    distributionArtifactsEmitted: false;
    reactIslandsMaterialized: false;
    productionStaticHtmlActivated: false;
    legacyFallbackRendererEnacted: false;
    editorialSitemapDeployed: false;
    vercelConfigurationChanged: false;
    rootBuildScriptChanged: false;
    publicUiChanged: false;
    deployedRuntimeChanged: false;
  };
  acceptance: {
    r1Complete: true;
    r2_0Complete: true;
    r2_1Complete: true;
    shellPhysicallyMaterialized: true;
    rendererAuthorityPreserved: true;
    cutoverReady: false;
    cutoverAuthorized: false;
    deploymentMutationCount: 0;
    nextRequiredCut: 'R2.2 — Distribution Emission';
  };
}

function repoUrl(path: string): URL {
  return new URL(`../../${path}`, import.meta.url);
}

function readRepoFile(path: string): string {
  return readFileSync(repoUrl(path), 'utf8');
}

function readJson<T>(path: string): T {
  return JSON.parse(readRepoFile(path)) as T;
}

function gitBlobSha(content: string): string {
  const bytes = Buffer.from(content, 'utf8');
  return createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
}

const manifestText = readRepoFile('docs/editorial/astro-shell-materialization.v0.json');
const completion = readJson<R21Completion>('docs/editorial/R2.1-completion.v0.json');
const shellPackage = readJson<{ dependencies: Record<string, string>; scripts: Record<string, string> }>('editorial-shell/package.json');
const rootPackage = readJson<{ scripts: Record<string, string> }>('package.json');
const r21Doc = readRepoFile('docs/editorial/R2.1-astro-shell-materialization.md');
const r2Readme = readRepoFile('docs/editorial/R2-README.md');
const input = materializeAcceptedRendererInput();

describe('R2.1 terminal completion seal', () => {
  it('binds the exact materialized shell manifest and both physical witnesses', () => {
    expect(completion.schemaVersion).toBe('editorial-astro-shell-materialization-completion/v0');
    expect(completion.status).toBe('frozen');
    expect(completion.normative).toBe(true);
    expect(completion.contractId).toBe('PORTFOLIO-R2.1-2026-08-30');
    expect(completion.materialization).toEqual({
      commit: 'aba73fded99f85adc0da762086a5ff16dc0271cc',
      verify: { workflow: 'Verify', runId: 33352417378, conclusion: 'success' },
      shellBuild: {
        workflow: 'Editorial Shell Build',
        runId: 33352417376,
        conclusion: 'success',
        artifactId: 9744058666,
        artifactDigest: 'sha256:c5e81ed5a434325b55d49d2e299b3d0506c7b7639346e0625b9169c434eba6ec',
      },
      manifestPath: 'docs/editorial/astro-shell-materialization.v0.json',
      manifestBlobSha: '95414c51a72b407d022d1d6af8cb4774e2a73a58',
    });
    expect(gitBlobSha(manifestText)).toBe(completion.materialization.manifestBlobSha);
  });

  it('reconstructs the same bounded public state the physical renderer consumed', () => {
    expect(input.pages).toHaveLength(completion.effectiveShell.canonicalStaticPageCount);
    expect(input.surfaces).toHaveLength(completion.effectiveShell.surfacePageCount);
    expect(input.documents).toHaveLength(completion.effectiveShell.publicSemanticDocumentCount);
    expect(input.documents.every((document) => document.disclosure.mode === 'full')).toBe(true);
    expect(completion.effectiveShell.sanitizedSemanticLeakCount).toBe(0);
    expect(completion.effectiveShell.rendererDirectInstitutionalReadCount).toBe(0);
  });

  it('closes physical shell materialization without activating production cutover', () => {
    expect(shellPackage.dependencies).toEqual({ astro: '7.2.9', vite: '8.2.2' });
    expect(shellPackage.scripts.build).toBe('npm run materialize && astro build');
    expect(rootPackage.scripts.build).toBe('vite build');
    expect(existsSync(repoUrl('editorial-shell/src/generated/accepted-publication-state.json'))).toBe(false);
    expect(existsSync(repoUrl('editorial-shell/src/lib/accepted-state.ts'))).toBe(false);
    expect(completion.acceptance.r2_1Complete).toBe(true);
    expect(completion.acceptance.nextRequiredCut).toBe('R2.2 — Distribution Emission');
    expect(completion.acceptance.cutoverReady).toBe(false);
    expect(completion.acceptance.cutoverAuthorized).toBe(false);
    expect(completion.effectiveShell.productionStaticHtmlActivated).toBe(false);
    expect(completion.effectiveShell.vercelConfigurationChanged).toBe(false);
    expect(completion.effectiveShell.deployedRuntimeChanged).toBe(false);
    expect(r21Doc).toContain('Status: **COMPLETE / DUAL CI WITNESSED**');
    expect(r2Readme).toContain('| R2.1 | Astro Shell Materialization & Editorial Renderer | **COMPLETE** |');
    expect(r2Readme).toContain('R2_1_COMPLETE=true');
  });
});
