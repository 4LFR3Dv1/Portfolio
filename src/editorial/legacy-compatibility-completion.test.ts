import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  reconstructLegacyCompatibility,
  type LegacyCompatibilityManifest,
} from './legacy-compatibility';
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

interface LegacyCompatibilityCompletion {
  schemaVersion: 'editorial-legacy-compatibility-completion/v0';
  status: 'frozen';
  normative: true;
  contractId: 'PORTFOLIO-R1.8-2026-08-30';
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
  effectiveCompatibility: {
    legacyRouteCount: 8;
    redirectReadyCount: 4;
    legacyRepresentationPreservedCount: 4;
    historicalMeaningRewriteCount: 0;
    canonicalSuccessorInferenceCount: 0;
    undistributedRedirectCount: 0;
    agenticLegacyRebindingCount: 0;
    legacyLanguageStorageKey: 'portfolio-language';
    legacyLanguageDefault: 'en';
    crossLanguageFallbackAllowed: false;
    futureUnknownPathResolution: 'unresolved';
    compatibilityRedirectsEnacted: false;
    legacyFallbackRenderingEnacted: false;
    legacyPublicSitemapReplaced: false;
    vercelConfigurationChanged: false;
    publicUiChanged: false;
    deployedRuntimeChanged: false;
  };
  acceptance: {
    r1_7Complete: true;
    r1_8Complete: true;
    allFrozenPublicRoutesCovered: true;
    redirectTargetsRequireDistribution: true;
    legacyMeaningPreserved: true;
    unknownFutureResolution: 'unresolved';
    nextRequiredCut: 'R1.9 — Foundation Acceptance';
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

const manifestText = readRepoFile('docs/editorial/legacy-compatibility.v0.json');
const manifest = JSON.parse(manifestText) as LegacyCompatibilityManifest;
const completion = JSON.parse(
  readRepoFile('docs/editorial/R1.8-completion.v0.json'),
) as LegacyCompatibilityCompletion;
const registryManifest = JSON.parse(
  readRepoFile('docs/editorial/record-registry.v0.json'),
) as RecordRegistryManifest;
const routeManifest = JSON.parse(
  readRepoFile('docs/editorial/route-runtime.v0.json'),
) as RouteRuntimeManifest;
const languageManifest = JSON.parse(
  readRepoFile('docs/editorial/language-runtime.v0.json'),
) as LanguageRuntimeManifest;
const surfaceManifest = JSON.parse(
  readRepoFile('docs/editorial/core-editorial-surfaces.v0.json'),
) as CoreEditorialSurfaceManifest;
const distributionManifest = JSON.parse(
  readRepoFile('docs/editorial/distribution-foundation.v0.json'),
) as DistributionFoundationManifest;
const r1Readme = readRepoFile('docs/editorial/R1-README.md');
const r18Doc = readRepoFile('docs/editorial/R1.8-legacy-compatibility.md');

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
const distribution = reconstructDistributionRuntime(distributionManifest, surfaces, surfaceState.documents);
if (!distribution.bundle) throw new Error('distribution-bundle-unavailable');
const distributedPaths = new Set(distribution.bundle.pages.map((page) => page.canonicalPath));
const compatibility = reconstructLegacyCompatibility(manifest, distributedPaths);

describe('R1.8 terminal completion seal', () => {
  it('binds the exact materialized compatibility manifest to its successful CI witness', () => {
    expect(completion.schemaVersion).toBe('editorial-legacy-compatibility-completion/v0');
    expect(completion.status).toBe('frozen');
    expect(completion.normative).toBe(true);
    expect(completion.contractId).toBe('PORTFOLIO-R1.8-2026-08-30');
    expect(completion.materialization).toEqual({
      commit: '148c18086b94ad9c151603ef2380e66bde694822',
      verify: {
        workflow: 'Verify',
        runId: 33348025484,
        conclusion: 'success',
      },
      manifestPath: 'docs/editorial/legacy-compatibility.v0.json',
      manifestBlobSha: 'e4ea1cb2d1aa008f3e542b402260fa78e5bbe7c5',
    });
    expect(gitBlobSha(manifestText)).toBe(completion.materialization.manifestBlobSha);
  });

  it('closes R1.8 only while the compatibility bridge reconstructs against the current authorized distribution', () => {
    expect(manifest.acceptance.r1_8Complete).toBe(false);
    expect(distribution.state).toBe('ready');
    expect(compatibility.state).toBe('ready');
    expect(compatibility.errors).toEqual([]);
    expect(compatibility.entries.size).toBe(8);
    expect(completion.effectiveCompatibility).toEqual({
      legacyRouteCount: 8,
      redirectReadyCount: 4,
      legacyRepresentationPreservedCount: 4,
      historicalMeaningRewriteCount: 0,
      canonicalSuccessorInferenceCount: 0,
      undistributedRedirectCount: 0,
      agenticLegacyRebindingCount: 0,
      legacyLanguageStorageKey: 'portfolio-language',
      legacyLanguageDefault: 'en',
      crossLanguageFallbackAllowed: false,
      futureUnknownPathResolution: 'unresolved',
      compatibilityRedirectsEnacted: false,
      legacyFallbackRenderingEnacted: false,
      legacyPublicSitemapReplaced: false,
      vercelConfigurationChanged: false,
      publicUiChanged: false,
      deployedRuntimeChanged: false,
    });
  });

  it('advances the shared R1 program to Foundation Acceptance without cutting over deployment', () => {
    expect(completion.acceptance).toEqual({
      r1_7Complete: true,
      r1_8Complete: true,
      allFrozenPublicRoutesCovered: true,
      redirectTargetsRequireDistribution: true,
      legacyMeaningPreserved: true,
      unknownFutureResolution: 'unresolved',
      nextRequiredCut: 'R1.9 — Foundation Acceptance',
    });
    expect(r1Readme).toContain('| R1.8 | Legacy Compatibility | **COMPLETE** |');
    expect(r1Readme).toContain('| R1.9 | Foundation Acceptance | **NEXT** |');
    expect(r1Readme).toContain('R1_8_COMPLETE=true');
    expect(r18Doc).toContain('Status: **COMPLETE / CI WITNESSED**');
    expect(r18Doc).toContain('Materialization `Verify` run `33348025484`: **SUCCESS**.');
    expect(r18Doc).toContain('R1_8_COMPLETE                                       true');
    expect(completion.effectiveCompatibility.compatibilityRedirectsEnacted).toBe(false);
    expect(completion.effectiveCompatibility.deployedRuntimeChanged).toBe(false);
  });
});
