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

interface GenericCompletionSeal {
  status: string;
  normative: boolean;
  acceptance: Record<string, unknown>;
}

function readRepoFile(path: string): string {
  return readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
}

function readJson<T>(path: string): T {
  return JSON.parse(readRepoFile(path)) as T;
}

const manifest = readJson<FoundationAcceptanceManifest>('docs/editorial/foundation-acceptance.v0.json');
const registryManifest = readJson<RecordRegistryManifest>('docs/editorial/record-registry.v0.json');
const routeManifest = readJson<RouteRuntimeManifest>('docs/editorial/route-runtime.v0.json');
const languageManifest = readJson<LanguageRuntimeManifest>('docs/editorial/language-runtime.v0.json');
const surfaceManifest = readJson<CoreEditorialSurfaceManifest>('docs/editorial/core-editorial-surfaces.v0.json');
const distributionManifest = readJson<DistributionFoundationManifest>('docs/editorial/distribution-foundation.v0.json');
const compatibilityManifest = readJson<LegacyCompatibilityManifest>('docs/editorial/legacy-compatibility.v0.json');

const completionSeals = Array.from({ length: 9 }, (_, index) => ({
  cut: index,
  seal: readJson<GenericCompletionSeal>(`docs/editorial/R1.${index}-completion.v0.json`),
}));

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

if (!distribution.bundle) throw new Error('foundation-distribution-bundle-unavailable');
const distributedPaths = new Set(distribution.bundle.pages.map((page) => page.canonicalPath));
const compatibility = reconstructLegacyCompatibility(compatibilityManifest, distributedPaths);

function previousCutsAreSealed(): boolean {
  return completionSeals.every(({ cut, seal }) =>
    seal.status === 'frozen'
    && seal.normative === true
    && seal.acceptance[`r1_${cut}Complete`] === true);
}

function currentSnapshot(): FoundationAcceptanceSnapshot {
  return {
    completionSealCount: completionSeals.length,
    allPreviousCutsSealed: previousCutsAreSealed(),
    registryState: registry.state,
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

describe('R1.9 Foundation Acceptance', () => {
  it('requires every previous R1 cut to have a frozen terminal completion seal', () => {
    expect(completionSeals).toHaveLength(9);
    expect(previousCutsAreSealed()).toBe(true);
    for (const { cut, seal } of completionSeals) {
      expect(seal.status).toBe('frozen');
      expect(seal.normative).toBe(true);
      expect(seal.acceptance[`r1_${cut}Complete`]).toBe(true);
    }
  });

  it('reconstructs the complete editorial pipeline from canonical manifests without repair', () => {
    expect(registry.state).toBe('ready');
    expect(routeRuntime.state).toBe('ready');
    expect(languageRuntime.state).toBe('ready');
    expect(surfaceState.governance.state).toBe('ready');
    expect(surfaces.state).toBe('ready');
    expect(distribution.state).toBe('ready');
    expect(compatibility.state).toBe('ready');

    expect(records).toHaveLength(28);
    expect(surfaceState.governance.records).toHaveLength(6);
    expect(routeRuntime.bindings).toHaveLength(10);
    expect(languageRuntime.bindings).toHaveLength(33);
    expect(surfaceState.projections.filter((entry) => entry.state === 'projected')).toHaveLength(10);
    expect(surfaceState.documents.filter((entry) => entry.state === 'document')).toHaveLength(6);
    expect(surfaces.surfaces).toHaveLength(12);
    expect(distribution.bundle?.pages).toHaveLength(18);
    expect(compatibility.entries.size).toBe(8);
  });

  it('accepts the current foundation while keeping public cutover explicitly unauthorized', () => {
    const result = evaluateFoundationAcceptance(manifest, currentSnapshot());
    expect(result).toEqual({
      state: 'ready',
      foundationReady: true,
      cutoverReady: false,
      cutoverAuthorized: false,
      errors: [],
    });
    expect(manifest.acceptance.foundationReady).toBe(true);
    expect(manifest.acceptance.cutoverReady).toBe(false);
    expect(manifest.acceptance.cutoverAuthorized).toBe(false);
    expect(manifest.acceptance.r1Complete).toBe(false);
    expect(manifest.acceptance.r1_9Complete).toBe(false);
  });

  it('proves the accepted public set still has no sanitized semantic leakage', () => {
    const documents = surfaceState.documents.filter((entry) => entry.state === 'document');
    expect(documents).toHaveLength(6);
    expect(documents.every((entry) => entry.document.disclosure.mode === 'full')).toBe(true);
    expect(surfaceState.documents.filter((entry) =>
      entry.state === 'omitted' && entry.reasons.includes('sanitized-content-authority-unavailable'))).toHaveLength(4);
    expect(currentSnapshot().publicLeakCount).toBe(0);
  });

  it('proves distribution and compatibility cannot promote an unauthorized successor', () => {
    expect(distribution.bundle?.pages.some((page) => page.canonicalPath.includes('transactional-support-bot'))).toBe(false);
    expect(distribution.bundle?.pages.some((page) => page.canonicalPath.includes('foundry-pay'))).toBe(false);
    expect(compatibilityManifest.acceptance.undistributedRedirectCount).toBe(0);
    expect(compatibilityManifest.acceptance.agenticLegacyRebindingCount).toBe(0);
    expect(compatibilityManifest.entries.find((entry) => entry.path === '/work/agentic-systems')?.successors).toBeNull();
  });

  it('keeps future unknown-route semantics unresolved while the deployed SPA remains untouched', () => {
    expect(compatibilityManifest.currentState.unknownFutureResolution).toBe('unresolved');
    expect(compatibilityManifest.currentState.compatibilityRedirectsEnacted).toBe(false);
    expect(compatibilityManifest.currentState.legacyFallbackRenderingEnacted).toBe(false);
    expect(compatibilityManifest.currentState.legacyPublicSitemapReplaced).toBe(false);
    expect(compatibilityManifest.currentState.vercelConfigurationChanged).toBe(false);
    expect(compatibilityManifest.currentState.publicUiChanged).toBe(false);
    expect(compatibilityManifest.currentState.deployedRuntimeChanged).toBe(false);
  });

  it('fails closed if an accepted count drifts instead of silently repairing the foundation', () => {
    const snapshot = currentSnapshot();
    const result = evaluateFoundationAcceptance(manifest, {
      ...snapshot,
      distributionPageCount: snapshot.distributionPageCount + 1,
    });
    expect(result.state).toBe('conflict');
    expect(result.foundationReady).toBe(false);
    expect(result.errors.some((error) => error.startsWith('distribution-page-count:'))).toBe(true);
  });

  it('fails closed if deployment mutation appears inside Foundation Acceptance', () => {
    const result = evaluateFoundationAcceptance(manifest, {
      ...currentSnapshot(),
      deployedRuntimeChanged: true,
    });
    expect(result.state).toBe('conflict');
    expect(result.errors).toContain('deployed-runtime-changed');
    expect(result.cutoverAuthorized).toBe(false);
  });
});
