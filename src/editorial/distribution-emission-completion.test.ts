import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { materializeAcceptedRendererInput } from './renderer-input';

interface R22Completion {
  schemaVersion: 'editorial-distribution-emission-completion/v0';
  status: 'frozen';
  normative: true;
  contractId: 'PORTFOLIO-R2.2-2026-08-31';
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
  effectiveEmission: {
    canonicalStaticPageCount: 18;
    canonicalMetadataCount: 18;
    robotsMetadataCount: 18;
    hreflangClusterCount: 9;
    hreflangLinkCount: 18;
    xDefaultLinkCount: 0;
    physicalArtifactCount: 4;
    sitemapEntryCount: 18;
    sitemapLastmodCount: 0;
    sitemapPriorityCount: 0;
    sitemapChangefreqCount: 0;
    rssFeedCount: 2;
    rssItemCount: 0;
    searchEntryCount: 6;
    unprojectedRecordIndexCount: 0;
    omittedDocumentIndexCount: 0;
    crossLanguageFallbackCount: 0;
    sanitizedSemanticLeakCount: 0;
    legacyPublicSitemapReplaced: false;
    productionDistributionActivated: false;
    compatibilityRedirectsEnacted: false;
    legacyFallbackRendererEnacted: false;
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
    distributionPhysicallyEmitted: true;
    distributionAuthorityPreserved: true;
    cutoverReady: false;
    cutoverAuthorized: false;
    deploymentMutationCount: 0;
    nextRequiredCut: 'R2.3 — Legacy Preservation Runtime';
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

const manifestText = readRepoFile('docs/editorial/distribution-emission.v0.json');
const completion = readJson<R22Completion>('docs/editorial/R2.2-completion.v0.json');
const r22Doc = readRepoFile('docs/editorial/R2.2-distribution-emission.md');
const r2Readme = readRepoFile('docs/editorial/R2-README.md');
const rootPackage = readJson<{ scripts: Record<string, string> }>('package.json');
const vercel = readJson<{ rewrites: Array<{ source: string; destination: string }> }>('vercel.json');
const input = materializeAcceptedRendererInput();

describe('R2.2 terminal completion seal', () => {
  it('binds the exact emission manifest and materialization witnesses', () => {
    expect(completion.schemaVersion).toBe('editorial-distribution-emission-completion/v0');
    expect(completion.status).toBe('frozen');
    expect(completion.normative).toBe(true);
    expect(completion.contractId).toBe('PORTFOLIO-R2.2-2026-08-31');
    expect(completion.materialization).toEqual({
      commit: 'a56a122af4212b44595b55ff9512465aba799285',
      verify: { workflow: 'Verify', runId: 33389707819, conclusion: 'success' },
      shellBuild: {
        workflow: 'Editorial Shell Build',
        runId: 33389707833,
        conclusion: 'success',
        artifactId: 9756960051,
        artifactDigest: 'sha256:15164960d88b3bcb18f2752f2af35b65c9e31ac38cc34e1659166fce190c5613',
      },
      manifestPath: 'docs/editorial/distribution-emission.v0.json',
      manifestBlobSha: 'd89ceaa2e9b402f501f94cf7b7b1c186ae81e6c1',
    });
    expect(gitBlobSha(manifestText)).toBe(completion.materialization.manifestBlobSha);
  });

  it('reconstructs the exact accepted physical distribution state', () => {
    expect(input.pages).toHaveLength(completion.effectiveEmission.canonicalStaticPageCount);
    expect(input.emission.metadata).toHaveLength(completion.effectiveEmission.canonicalMetadataCount);
    expect(input.emission.metadata.filter((entry) => entry.robots === 'index,follow')).toHaveLength(completion.effectiveEmission.robotsMetadataCount);
    expect(input.emission.hreflang).toHaveLength(completion.effectiveEmission.hreflangClusterCount);
    expect(input.emission.hreflang.flatMap((cluster) => cluster.links)).toHaveLength(completion.effectiveEmission.hreflangLinkCount);
    expect(input.emission.artifacts).toHaveLength(completion.effectiveEmission.physicalArtifactCount);
    expect(input.emission.search).toHaveLength(completion.effectiveEmission.searchEntryCount);
    expect(input.distribution.rss).toHaveLength(completion.effectiveEmission.rssFeedCount);
    expect(input.distribution.rss.flatMap((feed) => feed.items)).toHaveLength(completion.effectiveEmission.rssItemCount);
  });

  it('closes emission without silently activating deployment', () => {
    expect(completion.acceptance.r2_2Complete).toBe(true);
    expect(completion.acceptance.distributionPhysicallyEmitted).toBe(true);
    expect(completion.acceptance.distributionAuthorityPreserved).toBe(true);
    expect(completion.acceptance.cutoverReady).toBe(false);
    expect(completion.acceptance.cutoverAuthorized).toBe(false);
    expect(completion.acceptance.deploymentMutationCount).toBe(0);
    expect(completion.effectiveEmission.legacyPublicSitemapReplaced).toBe(false);
    expect(completion.effectiveEmission.productionDistributionActivated).toBe(false);
    expect(completion.effectiveEmission.vercelConfigurationChanged).toBe(false);
    expect(completion.effectiveEmission.deployedRuntimeChanged).toBe(false);
    expect(rootPackage.scripts.build).toBe('vite build');
    expect(vercel.rewrites).toEqual([{ source: '/((?!.*\\.).*)', destination: '/index.html' }]);
    expect(r22Doc).toContain('Status: **COMPLETE / DUAL CI WITNESSED**');
    expect(r2Readme).toContain('| R2.2 | Distribution Emission | **COMPLETE** |');
    expect(r2Readme).toContain('| R2.3 | Legacy Preservation Runtime | **NEXT** |');
    expect(r2Readme).toContain('R2_2_COMPLETE=true');
  });
});
