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
import type { LegacyCompatibilityManifest } from './legacy-compatibility';
import {
  reconstructPublicationShellBoundary,
  type PublicationShellBoundaryManifest,
} from './publication-shell-boundary';

function readJson<T>(path: string): T {
  return JSON.parse(readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8')) as T;
}

const shellManifest = readJson<PublicationShellBoundaryManifest>('docs/editorial/publication-shell-boundary.v0.json');
const registryManifest = readJson<RecordRegistryManifest>('docs/editorial/record-registry.v0.json');
const routeManifest = readJson<RouteRuntimeManifest>('docs/editorial/route-runtime.v0.json');
const languageManifest = readJson<LanguageRuntimeManifest>('docs/editorial/language-runtime.v0.json');
const surfaceManifest = readJson<CoreEditorialSurfaceManifest>('docs/editorial/core-editorial-surfaces.v0.json');
const distributionManifest = readJson<DistributionFoundationManifest>('docs/editorial/distribution-foundation.v0.json');
const compatibilityManifest = readJson<LegacyCompatibilityManifest>('docs/editorial/legacy-compatibility.v0.json');

const records = materializeRegistryRecords(registryManifest);
const registry = reconstructRecordRegistry(registryManifest);
const routes = reconstructRouteRuntime(routeManifest, records);
const languages = reconstructLanguageRuntime(languageManifest, records);
const surfaceState = materializeSurfaceDocuments(
  surfaceManifest,
  records,
  registry,
  routes,
  languages,
);
const surfaces = reconstructCoreSurfaceRuntime(surfaceManifest, surfaceState.documents);
const distribution = reconstructDistributionRuntime(distributionManifest, surfaces, surfaceState.documents);
if (!distribution.bundle) throw new Error('r2-shell-distribution-unavailable');

function cloneManifest(): PublicationShellBoundaryManifest {
  return JSON.parse(JSON.stringify(shellManifest)) as PublicationShellBoundaryManifest;
}

function cloneCompatibility(): LegacyCompatibilityManifest {
  return JSON.parse(JSON.stringify(compatibilityManifest)) as LegacyCompatibilityManifest;
}

describe('R2.0 Publication Shell Boundary', () => {
  it('derives the physical shell plan only from accepted distribution and compatibility outputs', () => {
    const result = reconstructPublicationShellBoundary(shellManifest, distribution.bundle!, compatibilityManifest);
    expect(result.state).toBe('ready');
    expect(result.errors).toEqual([]);
    expect(result.plan?.framework).toBe('astro-static');
    expect(result.plan?.canonicalPages).toHaveLength(18);
    expect(result.plan?.legacyPreservedPages).toHaveLength(4);
    expect(result.plan?.redirects).toHaveLength(4);
    expect(result.plan?.artifacts).toHaveLength(4);
    expect(result.plan?.unknownRouteOutcome).toBe('404');
  });

  it('keeps canonical pages exactly equal to the R1.7 distributed page set', () => {
    const result = reconstructPublicationShellBoundary(shellManifest, distribution.bundle!, compatibilityManifest);
    const planned = result.plan?.canonicalPages.map((page) => page.path).sort();
    const distributed = distribution.bundle!.pages.map((page) => page.canonicalPath).sort();
    expect(planned).toEqual(distributed);
  });

  it('preserves the four legacy representations instead of manufacturing canonical replacements', () => {
    const result = reconstructPublicationShellBoundary(shellManifest, distribution.bundle!, compatibilityManifest);
    expect(result.plan?.legacyPreservedPages.map((page) => page.path).sort()).toEqual([
      '/architecture',
      '/work/agentic-systems',
      '/work/transactional-support-bot',
      '/work/verify-systems',
    ]);
  });

  it('keeps redirect targets subordinate to the authorized distribution', () => {
    const result = reconstructPublicationShellBoundary(shellManifest, distribution.bundle!, compatibilityManifest);
    const redirects = result.plan?.redirects ?? [];
    expect(redirects.map((entry) => entry.path).sort()).toEqual([
      '/',
      '/work/sne-os',
      '/work/vira',
      '/work/xs-wallet',
    ]);
    expect(redirects.every((entry) => entry.status === 302)).toBe(true);
  });

  it('fails closed if a compatibility redirect points outside the distributed page set', () => {
    const compatibility = cloneCompatibility();
    const vira = compatibility.entries.find((entry) => entry.path === '/work/vira');
    if (!vira?.successors) throw new Error('vira-redirect-missing');
    vira.successors.en = '/en/systems/not-distributed';

    const result = reconstructPublicationShellBoundary(shellManifest, distribution.bundle!, compatibility);
    expect(result.state).toBe('conflict');
    expect(result.plan).toBeNull();
    expect(result.errors).toContain('redirect-target-not-distributed:/work/vira:/en/systems/not-distributed');
  });

  it('fails closed if the renderer is granted direct semantic authority', () => {
    const manifest = cloneManifest();
    manifest.admission.directRegistryReadAllowedByRenderer = true;
    manifest.admission.runtimeSemanticRepairAllowed = true;

    const result = reconstructPublicationShellBoundary(manifest, distribution.bundle!, compatibilityManifest);
    expect(result.state).toBe('conflict');
    expect(result.errors).toContain('renderer-registry-read-enabled');
    expect(result.errors).toContain('runtime-semantic-repair-enabled');
  });

  it('does not claim Astro installation, static rendering, redirects or deployment cutover at R2.0', () => {
    expect(shellManifest.currentState.astroDependencyMaterialized).toBe(false);
    expect(shellManifest.currentState.astroBuildEnacted).toBe(false);
    expect(shellManifest.currentState.staticHtmlRenderingEnacted).toBe(false);
    expect(shellManifest.currentState.compatibilityRedirectsEnacted).toBe(false);
    expect(shellManifest.currentState.legacyFallbackRendererEnacted).toBe(false);
    expect(shellManifest.currentState.editorialSitemapDeployed).toBe(false);
    expect(shellManifest.currentState.vercelCutoverEnacted).toBe(false);
    expect(shellManifest.currentState.publicUiChanged).toBe(false);
    expect(shellManifest.currentState.deployedRuntimeChanged).toBe(false);
  });
});
