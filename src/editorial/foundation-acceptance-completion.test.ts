import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  materializeRegistryRecords,
  reconstructRecordRegistry,
  type RecordRegistryManifest,
} from './record-registry';
import {
  reconstructRouteRuntime,
  type RouteRuntimeManifest,
} from './route-runtime';
import {
  reconstructLanguageRuntime,
  type LanguageRuntimeManifest,
} from './language-runtime';
import {
  materializeSurfaceDocuments,
  reconstructCoreSurfaceRuntime,
  type CoreEditorialSurfaceManifest,
} from './surface-runtime';
import {
  reconstructDistributionRuntime,
  type DistributionFoundationManifest,
} from './distribution-runtime';
import {
  reconstructLegacyCompatibility,
  type LegacyCompatibilityManifest,
} from './legacy-compatibility';
import {
  evaluateFoundationAcceptance,
  type FoundationAcceptanceManifest,
  type FoundationAcceptanceSnapshot,
} from './foundation-acceptance';

interface FoundationCompletion {
  schemaVersion: 'editorial-foundation-acceptance-completion/v0';
  status: 'frozen';
  normative: true;
  contractId: 'PORTFOLIO-R1.9-2026-08-30';
  materialization: {
    commit: string;
    verify: {
      workflow: 'Verify';
      runId: number;
      conclusion: 'success';
    };
    manifestPath: string;
    manifestBlobSha: string;
  };
  effectiveFoundation: {
    previousCompletionSealCount: number;
    systemRecordBirthCount: number;
    governanceRecordBirthCount: number;
    routeBindingCount: number;
    languageBindingCount: number;
    publicProjectionCount: number;
    editorialDocumentCount: number;
    coreSurfaceCount: number;
    distributionPageCount: number;
    metadataEntryCount: number;
    hreflangClusterCount: number;
    sitemapEntryCount: number;
    rssFeedCount: number;
    rssItemCount: number;
    searchEntryCount: number;
    legacyRouteCount: number;
    redirectReadyLegacyCount: number;
    preservedLegacyCount: number;
    publicLeakCount: number;
    identityReassignmentCount: number;
    crossLanguageFallbackCount: number;
    undistributedRedirectCount: number;
    unknownFutureResolution: 'unresolved';
    foundationReady: true;
    cutoverReady: false;
    cutoverAuthorized: false;
    publicationShellMaterialized: false;
    staticHtmlRenderingEnacted: false;
    compatibilityRedirectsEnacted: false;
    legacyFallbackRendererEnacted: false;
    editorialSitemapDeployed: false;
    vercelCutoverEnacted: false;
    deployedRuntimeChanged: false;
  };
  acceptance: {
    r1_8Complete: true;
    r1_9Complete: true;
    r1Complete: true;
    foundationReady: true;
    cutoverReady: false;
    cutoverAuthorized: false;
    deploymentMutationCount: 0;
    nextRequiredProgram: 'R2 — Editorial Publication Shell & Cutover';
  };
}

function readRepoFile(path: string): string {
  return readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
}

function gitBlobSha(content: string): string {
  const bytes = Buffer.from(content, 'utf8');
  return createHash('sha1')
    .update(`blob ${bytes.length}\0`)
    .update(bytes)
    .digest('hex');
}

function readJson<T>(path: string): T {
  return JSON.parse(readRepoFile(path)) as T;
}

const manifestText = readRepoFile('docs/editorial/foundation-acceptance.v0.json');
const manifest = JSON.parse(manifestText) as FoundationAcceptanceManifest;
const completion = readJson<FoundationCompletion>('docs/editorial/R1.9-completion.v0.json');
const registryManifest = readJson<RecordRegistryManifest>('docs/editorial/record-registry.v0.json');
const routeManifest = readJson<RouteRuntimeManifest>('docs/editorial/route-runtime.v0.json');
const languageManifest = readJson<LanguageRuntimeManifest>('docs/editorial/language-runtime.v0.json');
const surfaceManifest = readJson<CoreEditorialSurfaceManifest>('docs/editorial/core-editorial-surfaces.v0.json');
const distributionManifest = readJson<DistributionFoundationManifest>('docs/editorial/distribution-foundation.v0.json');
const compatibilityManifest = readJson<LegacyCompatibilityManifest>('docs/editorial/legacy-compatibility.v0.json');
const r1Readme = readRepoFile('docs/editorial/R1-README.md');
const r19Doc = readRepoFile('docs/editorial/R1.9-foundation-acceptance.md');

const records = materializeRegistryRecords(registryManifest);
const registry = reconstructRecordRegistry(registryManifest);
const routeRuntime = reconstructRouteRuntime(routeManifest, records);
const languageRuntime = reconstructLanguageRuntime(languageManifest, records);
const surfaceState = materializeSurfaceDocuments(
  surfaceManifest,
  records,
  registry,
  routeRuntime,
  languageRuntime,
);
const surfaces = reconstructCoreSurfaceRuntime(surfaceManifest, surfaceState.documents);
const distribution = reconstructDistributionRuntime(
  distributionManifest,
  surfaces,
  surfaceState.documents,
);

if (!distribution.bundle) throw new Error('foundation-completion-distribution-unavailable');
const compatibility = reconstructLegacyCompatibility(
  compatibilityManifest,
  new Set(distribution.bundle.pages.map((page) => page.canonicalPath)),
);

function currentSnapshot(): FoundationAcceptanceSnapshot {
  const lineagesReady = [...registry.records.values()].every((lineage) =>
    lineage.state === 'ready' || lineage.state === 'tombstoned');
  return {
    completionSealCount: 9,
    allPreviousCutsSealed: true,
    registryState: registry.errors.length === 0 && lineagesReady ? 'ready' : 'conflict',
    routeState: routeRuntime.state,
    languageState: languageRuntime.state,
    surfaceState: surfaces.state,
    distributionState: distribution.state,
    compatibilityState: compatibility.state,
    systemRecordBirthCount: records.length,
    governanceRecordBirthCount: surfaceState.governance.records.length,
    routeBindingCount: routeRuntime.bindings.length,
    languageBindingCount: languageRuntime.bindings.length,
    publicProjectionCount: surfaceState.projections.filter((entry) => entry.state === 'projected').length,
    editorialDocumentCount: surfaceState.documents.filter((entry) => entry.state === 'document').length,
    coreSurfaceCount: surfaces.surfaces.length,
    distributionPageCount: distribution.bundle!.pages.length,
    metadataEntryCount: distribution.bundle!.metadata.length,
    hreflangClusterCount: distribution.bundle!.hreflang.length,
    sitemapEntryCount: distribution.bundle!.sitemap.length,
    rssFeedCount: distribution.bundle!.rss.length,
    rssItemCount: distribution.bundle!.rss.flatMap((feed) => feed.items).length,
    searchEntryCount: distribution.bundle!.search.length,
    legacyRouteCount: compatibility.entries.size,
    redirectReadyLegacyCount: compatibilityManifest.entries.filter((entry) => entry.disposition === 'language-negotiated-redirect').length,
    preservedLegacyCount: compatibilityManifest.entries.filter((entry) => entry.disposition === 'preserve-legacy-representation').length,
    publicLeakCount: surfaceState.documents.filter((entry) =>
      entry.state === 'document' && entry.document.disclosure.mode !== 'full').length,
    identityReassignmentCount: compatibilityManifest.acceptance.agenticLegacyRebindingCount,
    crossLanguageFallbackCount: distributionManifest.acceptance.crossLanguageFallbackCount,
    undistributedRedirectCount: compatibilityManifest.acceptance.undistributedRedirectCount,
    unknownFutureResolution: compatibilityManifest.currentState.unknownFutureResolution,
    deployedRuntimeChanged: compatibilityManifest.currentState.deployedRuntimeChanged,
  };
}

describe('R1.9 terminal completion seal', () => {
  it('binds the exact witnessed foundation manifest to the successful materialization run', () => {
    expect(completion.schemaVersion).toBe('editorial-foundation-acceptance-completion/v0');
    expect(completion.status).toBe('frozen');
    expect(completion.normative).toBe(true);
    expect(completion.contractId).toBe('PORTFOLIO-R1.9-2026-08-30');
    expect(completion.materialization).toEqual({
      commit: 'fd2da5a10d3b39c5fc5fcbaaec15acce700ee719',
      verify: {
        workflow: 'Verify',
        runId: 33349903022,
        conclusion: 'success',
      },
      manifestPath: 'docs/editorial/foundation-acceptance.v0.json',
      manifestBlobSha: 'b58ff4458e2488dda1637872c2ef1600fcad469c',
    });
    expect(gitBlobSha(manifestText)).toBe(completion.materialization.manifestBlobSha);
  });

  it('closes R1 only while the complete foundation still reconstructs as ready', () => {
    const result = evaluateFoundationAcceptance(manifest, currentSnapshot());
    expect(result.state).toBe('ready');
    expect(result.errors).toEqual([]);
    expect(result.foundationReady).toBe(true);
    expect(result.cutoverReady).toBe(false);
    expect(result.cutoverAuthorized).toBe(false);
    expect(completion.effectiveFoundation).toMatchObject({
      previousCompletionSealCount: 9,
      systemRecordBirthCount: 28,
      governanceRecordBirthCount: 6,
      routeBindingCount: 10,
      languageBindingCount: 33,
      publicProjectionCount: 10,
      editorialDocumentCount: 6,
      coreSurfaceCount: 12,
      distributionPageCount: 18,
      legacyRouteCount: 8,
      publicLeakCount: 0,
      identityReassignmentCount: 0,
      crossLanguageFallbackCount: 0,
      undistributedRedirectCount: 0,
      unknownFutureResolution: 'unresolved',
      foundationReady: true,
      cutoverReady: false,
      cutoverAuthorized: false,
      deployedRuntimeChanged: false,
    });
  });

  it('marks the Editorial Foundation complete without claiming or enacting public cutover', () => {
    expect(completion.acceptance).toEqual({
      r1_8Complete: true,
      r1_9Complete: true,
      r1Complete: true,
      foundationReady: true,
      cutoverReady: false,
      cutoverAuthorized: false,
      deploymentMutationCount: 0,
      nextRequiredProgram: 'R2 — Editorial Publication Shell & Cutover',
    });
    expect(r1Readme).toContain('Status: **COMPLETE / FROZEN**');
    expect(r1Readme).toContain('| R1.9 | Foundation Acceptance | **COMPLETE** |');
    expect(r1Readme).toContain('R1_COMPLETE=true');
    expect(r1Readme).toContain('NEXT=R2 — Editorial Publication Shell & Cutover');
    expect(r19Doc).toContain('Status: **COMPLETE / CI WITNESSED**');
    expect(r19Doc).toContain('passed `Verify` run `33349903022`: **SUCCESS**');
    expect(r19Doc).toContain('R1_COMPLETE                                       true');
    expect(completion.effectiveFoundation.publicationShellMaterialized).toBe(false);
    expect(completion.effectiveFoundation.vercelCutoverEnacted).toBe(false);
    expect(completion.effectiveFoundation.deployedRuntimeChanged).toBe(false);
  });
});
