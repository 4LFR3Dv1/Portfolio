import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { materializeAcceptedRendererInput } from './renderer-input';

interface R23Manifest {
  schemaVersion: 'editorial-legacy-preservation-runtime/v0';
  contractId: 'PORTFOLIO-R2.3-2026-08-31';
  status: 'materialized';
  normative: true;
  baseline: string;
  authority: {
    projectsBlobSha: string;
    architectureBlobSha: string;
    legacyMeaningRewriteAllowed: false;
    canonicalRecordBindingAllowed: false;
    successorInferenceAllowed: false;
    runtimeSanitizationAllowed: false;
  };
  preservation: {
    pageCount: 4;
    architecturePageCount: 1;
    caseStudyPageCount: 3;
    languageRealizationCount: 8;
    architectureViewCount: 5;
    paths: string[];
    languageStorageKey: 'portfolio-language';
    languageDefault: 'en';
    legacyLanguageValues: ['en', 'pt'];
    acceptLanguageInferenceAllowed: false;
    architectureQueryViewPreserved: true;
  };
  indexing: {
    robots: 'noindex,follow';
    canonicalMetadataCount: 0;
    hreflangLinkCount: 0;
    sitemapEntryCount: 0;
    rssItemCount: 0;
    searchEntryCount: 0;
  };
  currentState: {
    legacyPreservationRuntimeMaterialized: true;
    boundedLegacyStateIncludedInRendererInput: true;
    legacyPagesImplementedInAstro: true;
    physicalLegacyPagesWitnessed: false;
    compatibilityRedirectsEnacted: false;
    productionStaticHtmlActivated: false;
    legacyPublicSitemapReplaced: false;
    vercelConfigurationChanged: false;
    rootBuildScriptChanged: false;
    publicUiChanged: false;
    deployedRuntimeChanged: false;
  };
  acceptance: {
    allPreservedRoutesMaterialized: true;
    frozenLegacySourceIntegrityEnforced: true;
    historicalMeaningRewriteCount: 0;
    canonicalRebindingCount: 0;
    legacyDistributionLeakCount: 0;
    deploymentMutationCount: 0;
    r2_3Complete: false;
    nextRequiredCut: 'R2.4 — Compatibility Redirect Adapter';
  };
}

function readRepoFile(path: string): string {
  return readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
}

function readJson<T>(path: string): T {
  return JSON.parse(readRepoFile(path)) as T;
}

const manifest = readJson<R23Manifest>('docs/editorial/legacy-preservation-runtime.v0.json');
const input = materializeAcceptedRendererInput();

describe('R2.3 materialization contract', () => {
  it('binds the manifest to the exact bounded legacy state', () => {
    expect(manifest.schemaVersion).toBe('editorial-legacy-preservation-runtime/v0');
    expect(manifest.status).toBe('materialized');
    expect(manifest.normative).toBe(true);
    expect(manifest.contractId).toBe('PORTFOLIO-R2.3-2026-08-31');
    expect(manifest.baseline).toBe('ab9564a065d5bbd721e242a3b98e47a31fa2f80f');
    expect(input.legacy.pages).toHaveLength(manifest.preservation.pageCount);
    expect(input.legacy.pages.filter((page) => page.kind === 'legacy-architecture')).toHaveLength(manifest.preservation.architecturePageCount);
    expect(input.legacy.pages.filter((page) => page.kind === 'legacy-case-study')).toHaveLength(manifest.preservation.caseStudyPageCount);
    expect(input.legacy.pages.map((page) => page.path).sort()).toEqual([...manifest.preservation.paths].sort());
    expect(input.legacy.source.projectsBlobSha).toBe(manifest.authority.projectsBlobSha);
    expect(input.legacy.source.architectureBlobSha).toBe(manifest.authority.architectureBlobSha);
  });

  it('keeps historical availability separate from canonical distribution authority', () => {
    expect(manifest.authority.legacyMeaningRewriteAllowed).toBe(false);
    expect(manifest.authority.canonicalRecordBindingAllowed).toBe(false);
    expect(manifest.authority.successorInferenceAllowed).toBe(false);
    expect(manifest.authority.runtimeSanitizationAllowed).toBe(false);
    expect(input.legacy.indexing.robots).toBe(manifest.indexing.robots);
    expect(manifest.indexing.canonicalMetadataCount).toBe(0);
    expect(manifest.indexing.hreflangLinkCount).toBe(0);
    expect(manifest.indexing.sitemapEntryCount).toBe(0);
    expect(manifest.indexing.rssItemCount).toBe(0);
    expect(manifest.indexing.searchEntryCount).toBe(0);
  });

  it('materializes R2.3 without crossing the deployment or redirect boundary', () => {
    expect(manifest.currentState.legacyPreservationRuntimeMaterialized).toBe(true);
    expect(manifest.currentState.boundedLegacyStateIncludedInRendererInput).toBe(true);
    expect(manifest.currentState.legacyPagesImplementedInAstro).toBe(true);
    expect(manifest.currentState.physicalLegacyPagesWitnessed).toBe(false);
    expect(manifest.currentState.compatibilityRedirectsEnacted).toBe(false);
    expect(manifest.currentState.productionStaticHtmlActivated).toBe(false);
    expect(manifest.currentState.vercelConfigurationChanged).toBe(false);
    expect(manifest.currentState.rootBuildScriptChanged).toBe(false);
    expect(manifest.currentState.deployedRuntimeChanged).toBe(false);
    expect(manifest.acceptance.r2_3Complete).toBe(false);
    expect(manifest.acceptance.nextRequiredCut).toBe('R2.4 — Compatibility Redirect Adapter');
  });
});
