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
  serializeDistributionBundle,
  serializeRssXml,
  serializeSitemapXml,
  type DistributionFoundationManifest,
} from './distribution-runtime';

interface R16Completion {
  acceptance: {
    r1_5Complete: true;
    r1_6Complete: true;
    governanceExactRevisionBindingRequired: true;
    surfaceRuntimeMaterialized: true;
    surfacesConsumeDocumentsOnly: true;
    sanitizedContentLeakCount: 0;
    currentPublicProjectionCount: 10;
    currentEditorialDocumentCount: 6;
    coreSurfaceCount: 12;
    nextRequiredCut: 'R1.7 — Distribution Foundation';
  };
}

function readRepoFile(path: string): string {
  return readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
}

const manifest = JSON.parse(
  readRepoFile('docs/editorial/distribution-foundation.v0.json'),
) as DistributionFoundationManifest;
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
const r16Completion = JSON.parse(
  readRepoFile('docs/editorial/R1.6-completion.v0.json'),
) as R16Completion;

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
const runtime = reconstructDistributionRuntime(manifest, surfaces, surfaceState.documents);

function requireBundle() {
  expect(runtime.state).toBe('ready');
  expect(runtime.errors).toEqual([]);
  expect(runtime.bundle).not.toBeNull();
  if (!runtime.bundle) throw new Error('distribution-bundle-unavailable');
  return runtime.bundle;
}

describe('R1.7 Distribution Foundation', () => {
  it('starts only from the terminally sealed R1.6 surface boundary', () => {
    expect(r16Completion.acceptance).toMatchObject({
      r1_6Complete: true,
      surfaceRuntimeMaterialized: true,
      surfacesConsumeDocumentsOnly: true,
      sanitizedContentLeakCount: 0,
      currentPublicProjectionCount: 10,
      currentEditorialDocumentCount: 6,
      coreSurfaceCount: 12,
      nextRequiredCut: 'R1.7 — Distribution Foundation',
    });
    expect(manifest.baseline).toBe('6b18ee91981ca6b8f9c8f1d55115eb5f266a45d6');
    expect(surfaces.state).toBe('ready');
  });

  it('derives all indexable pages from R1.6 surfaces and full R1.5 documents instead of a second page registry', () => {
    const bundle = requireBundle();
    expect(manifest.admission.manualPageRegistryAllowed).toBe(false);
    expect(bundle.pages.filter((page) => page.source === 'surface')).toHaveLength(12);
    expect(bundle.pages.filter((page) => page.source === 'document')).toHaveLength(6);
    expect(bundle.pages).toHaveLength(18);
    expect(bundle.metadata).toHaveLength(18);
    expect(bundle.sitemap).toHaveLength(18);
    expect(manifest.currentState.indexablePageCount).toBe(18);
  });

  it('never distributes omitted sanitized documents or merely born/unrouted Records', () => {
    const bundle = requireBundle();
    const distributedRecordIds = bundle.pages
      .filter((page) => page.targetRef !== null)
      .map((page) => page.targetRef!.recordId);

    expect(distributedRecordIds).not.toContain('rec_c5a75fd5ecae0565aaa0c96f0ad53227');
    expect(distributedRecordIds).not.toContain('rec_0e6beb6a5f17831616af328fe8f2afb2');
    expect(distributedRecordIds).not.toContain('rec_5eeb93bd8811b6c0fbecf3cc733cbd2e');
    expect(bundle.pages.some((page) => page.canonicalPath.includes('transactional-support-bot'))).toBe(false);
    expect(bundle.pages.some((page) => page.canonicalPath.includes('foundry-pay'))).toBe(false);
    expect(bundle.pages.some((page) => page.canonicalPath.includes('genesis'))).toBe(false);
    expect(manifest.acceptance.unprojectedRecordIndexCount).toBe(0);
    expect(manifest.acceptance.omittedDocumentIndexCount).toBe(0);
  });

  it('builds hreflang only from actually present equivalent pages and never invents x-default', () => {
    const bundle = requireBundle();
    expect(bundle.hreflang).toHaveLength(9);
    expect(bundle.hreflang.flatMap((cluster) => cluster.links)).toHaveLength(18);
    expect(bundle.hreflang.every((cluster) => cluster.links.length === 2)).toBe(true);
    expect(bundle.hreflang.every((cluster) =>
      new Set(cluster.links.map((link) => link.language)).size === 2)).toBe(true);
    expect(serializeDistributionBundle(bundle)).not.toContain('x-default');
    expect(manifest.admission.xDefaultInferenceAllowed).toBe(false);
    expect(manifest.admission.crossLanguageFallbackAllowed).toBe(false);
  });

  it('produces a sitemap from the same authorized page set without inferred freshness or importance metadata', () => {
    const bundle = requireBundle();
    const xml = serializeSitemapXml(bundle);
    expect(bundle.sitemap).toHaveLength(18);
    expect(xml).toContain('https://renan.snelabs.space/en/systems/vira');
    expect(xml).toContain('https://renan.snelabs.space/pt-br/systems/vira');
    expect(xml).not.toContain('/work/');
    expect(xml).not.toContain('<lastmod>');
    expect(xml).not.toContain('<priority>');
    expect(xml).not.toContain('<changefreq>');
    expect(manifest.admission.lastModifiedInferenceAllowed).toBe(false);
    expect(manifest.admission.priorityInferenceAllowed).toBe(false);
  });

  it('materializes language-specific RSS envelopes but keeps them empty until publication chronology exists', () => {
    const bundle = requireBundle();
    expect(bundle.rss).toHaveLength(2);
    expect(bundle.rss.map((feed) => feed.path).sort()).toEqual(['/en/rss.xml', '/pt-br/rss.xml']);
    expect(bundle.rss.every((feed) => feed.items.length === 0)).toBe(true);
    expect(serializeRssXml(bundle.rss[0])).not.toContain('<item>');
    expect(manifest.admission.publicationChronologyInferenceAllowed).toBe(false);
    expect(manifest.currentState.rssItemCount).toBe(0);
  });

  it('indexes only semantic public documents and never collection copy or sanitized placeholders', () => {
    const bundle = requireBundle();
    expect(bundle.search).toHaveLength(6);
    expect(bundle.search.every((entry) => entry.kind === 'knowledge.system')).toBe(true);
    expect(bundle.search.map((entry) => entry.language).sort()).toEqual([
      'en', 'en', 'en', 'pt-BR', 'pt-BR', 'pt-BR',
    ]);
    expect(bundle.search.every((entry) => entry.text.trim().length > 0)).toBe(true);
    expect(bundle.search.every((entry) => entry.text.includes(entry.title.replace(' — Renan Melo', '')))).toBe(true);
    expect(bundle.search.some((entry) => entry.title.includes('Foundry Pay'))).toBe(false);
    expect(bundle.search.some((entry) => entry.title.includes('Transactional Support Bot'))).toBe(false);
  });

  it('keeps canonical metadata synchronized with every distributed canonical URL', () => {
    const bundle = requireBundle();
    const pageUrls = bundle.pages.map((page) => page.canonicalUrl).sort();
    expect(bundle.metadata.map((entry) => entry.canonicalUrl).sort()).toEqual(pageUrls);
    expect(bundle.sitemap.map((entry) => entry.loc).sort()).toEqual(pageUrls);
    expect(bundle.metadata.every((entry) => entry.robots === 'index,follow')).toBe(true);
    expect(bundle.metadata.every((entry) => entry.canonicalUrl.endsWith(entry.canonicalPath))).toBe(true);
  });

  it('is deterministic under input ordering and emits one canonical structured bundle digest', () => {
    const bundle = requireBundle();
    expect(runtime.digest).toMatch(/^sha256_[0-9a-f]{64}$/);

    const reorderedSurfaces = {
      ...surfaces,
      surfaces: [...surfaces.surfaces].reverse(),
    };
    const reordered = reconstructDistributionRuntime(
      manifest,
      reorderedSurfaces,
      [...surfaceState.documents].reverse(),
    );
    expect(reordered.state).toBe('ready');
    expect(reordered.digest).toBe(runtime.digest);
    expect(reordered.bundle ? serializeDistributionBundle(reordered.bundle) : null)
      .toBe(serializeDistributionBundle(bundle));
  });

  it('proves there is no hidden manual page authority by reacting to authorized input removal', () => {
    const bundle = requireBundle();
    const removedViraEn = surfaceState.documents.filter((decision) =>
      decision.state !== 'document'
      || decision.document.canonicalPath !== '/en/systems/vira');
    const reduced = reconstructDistributionRuntime(manifest, surfaces, removedViraEn);
    expect(reduced.state).toBe('ready');
    expect(reduced.bundle?.pages).toHaveLength(bundle.pages.length - 1);
    expect(reduced.bundle?.search).toHaveLength(bundle.search.length - 1);
    const viraCluster = reduced.bundle?.hreflang.find((cluster) => cluster.identityKey.includes('rec_c844725e35cf61830221efc597612017'));
    expect(viraCluster).toBeUndefined();
  });

  it('does not replace the deployed legacy distribution artifacts or enact framework cutover', () => {
    expect(manifest.currentState.legacyPublicSitemapReplaced).toBe(false);
    expect(manifest.currentState.staticHtmlRenderingEnacted).toBe(false);
    expect(manifest.currentState.frameworkCutoverEnacted).toBe(false);
    expect(manifest.currentState.vercelConfigurationChanged).toBe(false);
    expect(manifest.currentState.publicUiChanged).toBe(false);
    expect(manifest.currentState.deployedRuntimeChanged).toBe(false);
    expect(manifest.acceptance.r1_7Complete).toBe(false);
  });
});
