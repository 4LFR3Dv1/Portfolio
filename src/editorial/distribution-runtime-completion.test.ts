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

interface DistributionCompletion {
  schemaVersion: 'editorial-distribution-foundation-completion/v0';
  status: 'frozen';
  normative: true;
  contractId: 'PORTFOLIO-R1.7-2026-08-30';
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
  effectiveDistribution: {
    surfacePageCount: 12;
    documentPageCount: 6;
    indexablePageCount: 18;
    metadataEntryCount: 18;
    hreflangClusterCount: 9;
    hreflangLinkCount: 18;
    sitemapEntryCount: 18;
    rssFeedCount: 2;
    rssItemCount: 0;
    searchEntryCount: 6;
    unprojectedRecordIndexCount: 0;
    omittedDocumentIndexCount: 0;
    crossLanguageFallbackCount: 0;
    manualPageRegistryAllowed: false;
    lastModifiedInferenceAllowed: false;
    priorityInferenceAllowed: false;
    publicationChronologyInferenceAllowed: false;
    xDefaultInferenceAllowed: false;
    legacyPublicSitemapReplaced: false;
    staticHtmlRenderingEnacted: false;
    frameworkCutoverEnacted: false;
    vercelConfigurationChanged: false;
    publicUiChanged: false;
    deployedRuntimeChanged: false;
  };
  acceptance: {
    r1_6Complete: true;
    r1_7Complete: true;
    distributionRuntimeMaterialized: true;
    distributionConsumesAuthorizedOutputsOnly: true;
    metadataEntryCount: 18;
    sitemapEntryCount: 18;
    searchEntryCount: 6;
    rssFeedCount: 2;
    rssItemCount: 0;
    nextRequiredCut: 'R1.8 — Legacy Compatibility';
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

const manifestText = readRepoFile('docs/editorial/distribution-foundation.v0.json');
const manifest = JSON.parse(manifestText) as DistributionFoundationManifest;
const completion = JSON.parse(
  readRepoFile('docs/editorial/R1.7-completion.v0.json'),
) as DistributionCompletion;
const surfaceManifest = JSON.parse(
  readRepoFile('docs/editorial/core-editorial-surfaces.v0.json'),
) as CoreEditorialSurfaceManifest;
const registryManifest = JSON.parse(
  readRepoFile('docs/editorial/record-registry.v0.json'),
) as RecordRegistryManifest;
const routeManifest = JSON.parse(
  readRepoFile('docs/editorial/route-runtime.v0.json'),
) as RouteRuntimeManifest;
const languageManifest = JSON.parse(
  readRepoFile('docs/editorial/language-runtime.v0.json'),
) as LanguageRuntimeManifest;
const r1Readme = readRepoFile('docs/editorial/R1-README.md');
const r17Doc = readRepoFile('docs/editorial/R1.7-distribution-foundation.md');
const legacySitemap = readRepoFile('public/sitemap.xml');

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
const distribution = reconstructDistributionRuntime(manifest, surfaces, surfaceState.documents);

describe('R1.7 terminal completion seal', () => {
  it('binds the exact materialized distribution manifest to its successful CI witness', () => {
    expect(completion.schemaVersion).toBe('editorial-distribution-foundation-completion/v0');
    expect(completion.status).toBe('frozen');
    expect(completion.normative).toBe(true);
    expect(completion.contractId).toBe('PORTFOLIO-R1.7-2026-08-30');
    expect(completion.materialization).toEqual({
      commit: '4da7771915225a46484bf1ce7d983061ecd396fd',
      verify: {
        workflow: 'Verify',
        runId: 33347509760,
        conclusion: 'success',
      },
      manifestPath: 'docs/editorial/distribution-foundation.v0.json',
      manifestBlobSha: 'b81c71811490e59834ac361ca383be68071b4b3a',
    });
    expect(gitBlobSha(manifestText)).toBe(completion.materialization.manifestBlobSha);
  });

  it('closes R1.7 only while the authorized distribution bundle still reconstructs exactly', () => {
    expect(manifest.acceptance.r1_7Complete).toBe(false);
    expect(distribution.state).toBe('ready');
    expect(distribution.errors).toEqual([]);
    expect(distribution.bundle).not.toBeNull();
    expect(distribution.bundle?.pages).toHaveLength(18);
    expect(distribution.bundle?.metadata).toHaveLength(18);
    expect(distribution.bundle?.hreflang).toHaveLength(9);
    expect(distribution.bundle?.sitemap).toHaveLength(18);
    expect(distribution.bundle?.rss).toHaveLength(2);
    expect(distribution.bundle?.rss.flatMap((feed) => feed.items)).toHaveLength(0);
    expect(distribution.bundle?.search).toHaveLength(6);
    expect(distribution.digest).toMatch(/^sha256_[0-9a-f]{64}$/);
    expect(completion.effectiveDistribution).toEqual({
      surfacePageCount: 12,
      documentPageCount: 6,
      indexablePageCount: 18,
      metadataEntryCount: 18,
      hreflangClusterCount: 9,
      hreflangLinkCount: 18,
      sitemapEntryCount: 18,
      rssFeedCount: 2,
      rssItemCount: 0,
      searchEntryCount: 6,
      unprojectedRecordIndexCount: 0,
      omittedDocumentIndexCount: 0,
      crossLanguageFallbackCount: 0,
      manualPageRegistryAllowed: false,
      lastModifiedInferenceAllowed: false,
      priorityInferenceAllowed: false,
      publicationChronologyInferenceAllowed: false,
      xDefaultInferenceAllowed: false,
      legacyPublicSitemapReplaced: false,
      staticHtmlRenderingEnacted: false,
      frameworkCutoverEnacted: false,
      vercelConfigurationChanged: false,
      publicUiChanged: false,
      deployedRuntimeChanged: false,
    });
  });

  it('seals the R1.7 boundary without constraining later R1 program status', () => {
    expect(completion.acceptance).toEqual({
      r1_6Complete: true,
      r1_7Complete: true,
      distributionRuntimeMaterialized: true,
      distributionConsumesAuthorizedOutputsOnly: true,
      metadataEntryCount: 18,
      sitemapEntryCount: 18,
      searchEntryCount: 6,
      rssFeedCount: 2,
      rssItemCount: 0,
      nextRequiredCut: 'R1.8 — Legacy Compatibility',
    });
    expect(r1Readme).toContain('| R1.7 | Distribution Foundation | **COMPLETE** |');
    expect(r1Readme).toContain('R1_7_COMPLETE=true');
    expect(r17Doc).toContain('Status: **COMPLETE / CI WITNESSED**');
    expect(r17Doc).toContain('Materialization `Verify` run `33347509760`: **SUCCESS**.');
    expect(r17Doc).toContain('R1_7_COMPLETE                                       true');
    expect(legacySitemap).toContain('/work/vira');
    expect(legacySitemap).not.toContain('/en/systems/vira');
    expect(completion.effectiveDistribution.legacyPublicSitemapReplaced).toBe(false);
    expect(completion.effectiveDistribution.deployedRuntimeChanged).toBe(false);
  });
});
