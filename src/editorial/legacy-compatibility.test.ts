import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  reconstructLegacyCompatibility,
  resolveLegacyCompatibility,
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

interface SurfaceFreeze {
  freezeId: string;
  routes: string[];
  sourceBlobs: Record<string, string>;
}

interface R17Completion {
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

const manifest = JSON.parse(
  readRepoFile('docs/editorial/legacy-compatibility.v0.json'),
) as LegacyCompatibilityManifest;
const freeze = JSON.parse(
  readRepoFile('docs/editorial/legacy/portfolio-surface.v0.json'),
) as SurfaceFreeze;
const r17Completion = JSON.parse(
  readRepoFile('docs/editorial/R1.7-completion.v0.json'),
) as R17Completion;
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
if (!distribution.bundle) throw new Error('distribution-bundle-unavailable');
const distributedPaths = new Set(distribution.bundle.pages.map((page) => page.canonicalPath));
const compatibility = reconstructLegacyCompatibility(manifest, distributedPaths);

describe('R1.8 Legacy Compatibility', () => {
  it('starts only from the terminally sealed R1.7 distribution boundary', () => {
    expect(r17Completion.acceptance).toMatchObject({
      r1_7Complete: true,
      distributionRuntimeMaterialized: true,
      distributionConsumesAuthorizedOutputsOnly: true,
      nextRequiredCut: 'R1.8 — Legacy Compatibility',
    });
    expect(manifest.baseline).toBe('67cf446ca1482ed7b8fae77e8aa5a7b8182fe10a');
    expect(distribution.state).toBe('ready');
  });

  it('covers exactly the eight frozen R0.0 public paths and no invented legacy path', () => {
    expect(freeze.freezeId).toBe('PORTFOLIO-R0.0-2026-08-30');
    expect(manifest.entries.map((entry) => entry.path).sort()).toEqual([...freeze.routes].sort());
    expect(manifest.entries).toHaveLength(8);
    expect(manifest.currentState.legacyRouteCount).toBe(8);
    expect(manifest.acceptance.allFrozenPublicRoutesCovered).toBe(true);
  });

  it('reconstructs a conflict-free bridge only when every redirect successor already exists in R1.7 distribution', () => {
    expect(compatibility.state).toBe('ready');
    expect(compatibility.errors).toEqual([]);
    expect(manifest.admission.canonicalSuccessorInferenceAllowed).toBe(false);
    expect(manifest.admission.undistributedSuccessorRedirectAllowed).toBe(false);

    const redirects = manifest.entries.filter((entry) => entry.disposition === 'language-negotiated-redirect');
    expect(redirects).toHaveLength(4);
    for (const entry of redirects) {
      expect(entry.successors).not.toBeNull();
      expect(distributedPaths.has(entry.successors!.en)).toBe(true);
      expect(distributedPaths.has(entry.successors!['pt-BR'])).toBe(true);
    }
  });

  it('preserves the legacy client language state exactly and defaults to English as the deployed site does', () => {
    const legacyLanguageSource = readRepoFile('src/app/context/language-context.tsx');
    expect(legacyLanguageSource).toContain("localStorage.getItem('portfolio-language')");
    expect(legacyLanguageSource).toContain("return 'en'; // Default to English");
    expect(manifest.languageNegotiation.storageKey).toBe('portfolio-language');
    expect(manifest.languageNegotiation.mapping).toEqual({ en: 'en', pt: 'pt-BR' });
    expect(manifest.languageNegotiation.defaultWhenMissing).toBe('en');
    expect(manifest.languageNegotiation.acceptLanguageInferenceAllowed).toBe(false);

    expect(resolveLegacyCompatibility('/work/vira', 'pt', manifest, compatibility, distributedPaths)).toMatchObject({
      state: 'redirect',
      language: 'pt-BR',
      targetPath: '/pt-br/systems/vira',
      status: 302,
    });
    expect(resolveLegacyCompatibility('/work/vira', null, manifest, compatibility, distributedPaths)).toMatchObject({
      state: 'redirect',
      language: 'en',
      targetPath: '/en/systems/vira',
    });
  });

  it('redirects only root, VIRA, XS Wallet and SNE-OS and never redirects to an undistributed semantic page', () => {
    const redirectPaths = manifest.entries
      .filter((entry) => entry.disposition === 'language-negotiated-redirect')
      .map((entry) => entry.path)
      .sort();
    expect(redirectPaths).toEqual([
      '/',
      '/work/sne-os',
      '/work/vira',
      '/work/xs-wallet',
    ]);
    expect(manifest.currentState.redirectReadyCount).toBe(4);
    expect(manifest.acceptance.undistributedRedirectCount).toBe(0);
  });

  it('keeps Transactional Support Bot on its frozen sanitized representation until safe semantic content exists', () => {
    const entry = manifest.entries.find((candidate) => candidate.path === '/work/transactional-support-bot');
    expect(entry).toMatchObject({
      disposition: 'preserve-legacy-representation',
      blocker: 'sanitized-content-authority-unavailable',
    });
    expect(distributedPaths.has('/en/systems/transactional-support-bot')).toBe(false);
    expect(distributedPaths.has('/pt-br/systems/transactional-support-bot')).toBe(false);
    expect(resolveLegacyCompatibility(entry!.path, 'en', manifest, compatibility, distributedPaths)).toMatchObject({
      state: 'legacy-preserved',
      blocker: 'sanitized-content-authority-unavailable',
    });
  });

  it('preserves Agentic Systems as historical representation and never rebinds its locator to a modern System', () => {
    const entry = manifest.entries.find((candidate) => candidate.path === '/work/agentic-systems');
    expect(entry).toMatchObject({
      disposition: 'preserve-legacy-representation',
      successors: null,
      blocker: 'no-canonical-system-successor',
    });
    expect(manifest.acceptance.agenticLegacyRebindingCount).toBe(0);
    expect(entry?.historicalMeaning).toContain('Foundry, Factory or AgentHub');
  });

  it('preserves Architecture and VERIFY until their representation Records exist instead of manufacturing successors', () => {
    expect(manifest.entries.find((entry) => entry.path === '/architecture')).toMatchObject({
      disposition: 'preserve-legacy-representation',
      successors: null,
      blocker: 'architecture-representations-not-born',
    });
    expect(manifest.entries.find((entry) => entry.path === '/work/verify-systems')).toMatchObject({
      disposition: 'preserve-legacy-representation',
      blocker: 'publication-record-not-born',
    });
    expect(manifest.currentState.legacyRepresentationPreservedCount).toBe(4);
  });

  it('turns unknown paths into unresolved future identity instead of preserving the current SPA landing fallback', () => {
    const currentRouter = readRepoFile('src/app/routing.ts');
    expect(currentRouter).toContain("return { view: 'landing' };");
    expect(manifest.legacyRuntime.spaUnknownPathBehavior).toBe('landing-fallback');
    expect(manifest.currentState.unknownFutureResolution).toBe('unresolved');
    expect(manifest.admission.unknownPathFallbackAllowedAfterCutover).toBe(false);
    expect(resolveLegacyCompatibility('/not-a-real-route', 'en', manifest, compatibility, distributedPaths)).toEqual({
      state: 'unresolved',
      legacyPath: '/not-a-real-route',
    });
  });

  it('grounds the physical deployed SPA and sitemap without changing either during R1.8', () => {
    const vercel = JSON.parse(readRepoFile('docs/editorial/historical-production-vercel.v0.json')) as { rewrites: Array<{ source: string; destination: string }> };
    const sitemap = readRepoFile('public/sitemap.xml');
    expect(vercel.rewrites).toContainEqual({
      source: '/((?!.*\\.).*)',
      destination: '/index.html',
    });
    for (const path of freeze.routes) {
      const url = `https://renan.snelabs.space${path === '/' ? '/' : path}`;
      expect(sitemap).toContain(url);
    }
    expect(manifest.currentState.compatibilityRedirectsEnacted).toBe(false);
    expect(manifest.currentState.legacyFallbackRenderingEnacted).toBe(false);
    expect(manifest.currentState.legacyPublicSitemapReplaced).toBe(false);
    expect(manifest.currentState.vercelConfigurationChanged).toBe(false);
    expect(manifest.currentState.publicUiChanged).toBe(false);
    expect(manifest.currentState.deployedRuntimeChanged).toBe(false);
    expect(manifest.acceptance.r1_8Complete).toBe(false);
  });
});
