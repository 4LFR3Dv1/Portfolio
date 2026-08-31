import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { materializeAcceptedRendererInput } from './renderer-input';

interface R23Completion {
  schemaVersion: 'editorial-legacy-preservation-runtime-completion/v0';
  status: 'frozen';
  normative: true;
  contractId: 'PORTFOLIO-R2.3-2026-08-31';
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
  effectivePreservation: {
    canonicalStaticPageCount: 18;
    legacyPreservedPageCount: 4;
    totalStaticPageCount: 22;
    architecturePageCount: 1;
    caseStudyPageCount: 3;
    languageRealizationCount: 8;
    architectureViewCount: 5;
    legacyRobotsNoindexCount: 4;
    legacyCanonicalMetadataCount: 0;
    legacyHreflangLinkCount: 0;
    legacySitemapEntryCount: 0;
    legacyRssItemCount: 0;
    legacySearchEntryCount: 0;
    sourceDriftCount: 0;
    historicalMeaningRewriteCount: 0;
    agenticSystemRebindingCount: 0;
    transactionalSupportPrematureSuccessorCount: 0;
    verifySystemsPrematurePublicationBindingCount: 0;
    architecturePrematureRepresentationBirthCount: 0;
    compatibilityRedirectsEnacted: false;
    productionStaticHtmlActivated: false;
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
    legacyPreservationPhysicallyMaterialized: true;
    historicalMeaningPreserved: true;
    frozenSourceIntegrityPreserved: true;
    distributionQuarantinePreserved: true;
    cutoverReady: false;
    cutoverAuthorized: false;
    deploymentMutationCount: 0;
    nextRequiredCut: 'R2.4 — Compatibility Redirect Adapter';
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

const manifestText = readRepoFile('docs/editorial/legacy-preservation-runtime.v0.json');
const completion = readJson<R23Completion>('docs/editorial/R2.3-completion.v0.json');
const r23Doc = readRepoFile('docs/editorial/R2.3-legacy-preservation-runtime.md');
const r2Readme = readRepoFile('docs/editorial/R2-README.md');
const rootPackage = readJson<{ scripts: Record<string, string> }>('package.json');
const vercel = readJson<{ rewrites: Array<{ source: string; destination: string }> }>('vercel.json');
const input = materializeAcceptedRendererInput();

describe('R2.3 terminal completion seal', () => {
  it('binds the exact legacy preservation manifest and materialization witnesses', () => {
    expect(completion.schemaVersion).toBe('editorial-legacy-preservation-runtime-completion/v0');
    expect(completion.status).toBe('frozen');
    expect(completion.normative).toBe(true);
    expect(completion.contractId).toBe('PORTFOLIO-R2.3-2026-08-31');
    expect(completion.materialization).toEqual({
      commit: 'f97c502f518a0b080c8530a2e767ac8f353d93f7',
      verify: { workflow: 'Verify', runId: 33392175519, conclusion: 'success' },
      shellBuild: {
        workflow: 'Editorial Shell Build',
        runId: 33392175504,
        conclusion: 'success',
        artifactId: 9757884599,
        artifactDigest: 'sha256:4571f9239fe0d51f1a0de9d6415928d8f16eef3cf648ab3c0514204bc4cca8ba',
      },
      manifestPath: 'docs/editorial/legacy-preservation-runtime.v0.json',
      manifestBlobSha: '6d468178b25656f8913132aea9556dadb347caa3',
    });
    expect(gitBlobSha(manifestText)).toBe(completion.materialization.manifestBlobSha);
  });

  it('reconstructs the same historical state that the accepted physical shell consumed', () => {
    expect(input.pages).toHaveLength(completion.effectivePreservation.canonicalStaticPageCount);
    expect(input.legacy.pages).toHaveLength(completion.effectivePreservation.legacyPreservedPageCount);
    expect(input.legacy.pages.filter((page) => page.kind === 'legacy-architecture')).toHaveLength(completion.effectivePreservation.architecturePageCount);
    expect(input.legacy.pages.filter((page) => page.kind === 'legacy-case-study')).toHaveLength(completion.effectivePreservation.caseStudyPageCount);
    expect(input.legacy.source.projectsBlobSha).toBe('df6fe680cd96ede69b3ff7e1f0a6b3b498b16c9f');
    expect(input.legacy.source.architectureBlobSha).toBe('377fd24faab1be39ba135b8d1cd62379e97f403a');
    expect(input.legacy.indexing).toEqual({
      robots: 'noindex,follow',
      sitemapEligible: false,
      rssEligible: false,
      searchEligible: false,
      canonicalRecordBindingAllowed: false,
    });
    expect(completion.effectivePreservation.totalStaticPageCount).toBe(22);
    expect(completion.effectivePreservation.sourceDriftCount).toBe(0);
    expect(completion.effectivePreservation.historicalMeaningRewriteCount).toBe(0);
    expect(completion.effectivePreservation.agenticSystemRebindingCount).toBe(0);
  });

  it('closes preservation without activating redirects or production cutover', () => {
    expect(completion.acceptance.r2_3Complete).toBe(true);
    expect(completion.acceptance.legacyPreservationPhysicallyMaterialized).toBe(true);
    expect(completion.acceptance.historicalMeaningPreserved).toBe(true);
    expect(completion.acceptance.frozenSourceIntegrityPreserved).toBe(true);
    expect(completion.acceptance.distributionQuarantinePreserved).toBe(true);
    expect(completion.acceptance.cutoverReady).toBe(false);
    expect(completion.acceptance.cutoverAuthorized).toBe(false);
    expect(completion.acceptance.deploymentMutationCount).toBe(0);
    expect(completion.acceptance.nextRequiredCut).toBe('R2.4 — Compatibility Redirect Adapter');
    expect(completion.effectivePreservation.compatibilityRedirectsEnacted).toBe(false);
    expect(completion.effectivePreservation.productionStaticHtmlActivated).toBe(false);
    expect(completion.effectivePreservation.vercelConfigurationChanged).toBe(false);
    expect(completion.effectivePreservation.rootBuildScriptChanged).toBe(false);
    expect(completion.effectivePreservation.deployedRuntimeChanged).toBe(false);
    expect(rootPackage.scripts.build).toBe('vite build');
    expect(vercel.rewrites).toEqual([{ source: '/((?!.*\\.).*)', destination: '/index.html' }]);
    expect(r23Doc).toContain('Status: **COMPLETE / DUAL CI WITNESSED**');
    expect(r2Readme).toContain('| R2.3 | Legacy Preservation Runtime | **COMPLETE** |');
    expect(r2Readme).toContain('| R2.4 | Compatibility Redirect Adapter | **NEXT** |');
    expect(r2Readme).toContain('R2_3_COMPLETE=true');
  });
});
