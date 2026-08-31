import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  materializeRegistryRecords,
  reconstructRecordRegistry,
  type RecordRegistryManifest,
} from './record-registry';
import { reconstructRouteRuntime, type RouteRuntimeManifest } from './route-runtime';
import { reconstructLanguageRuntime, type LanguageRuntimeManifest } from './language-runtime';
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

interface PublicationShellBoundaryCompletion {
  schemaVersion: 'editorial-publication-shell-boundary-completion/v0';
  status: 'frozen';
  normative: true;
  contractId: 'PORTFOLIO-R2.0-2026-08-30';
  materialization: {
    commit: string;
    verify: { workflow: 'Verify'; runId: number; conclusion: 'success' };
    manifestPath: string;
    manifestBlobSha: string;
  };
  effectivePlan: {
    framework: 'astro-static';
    canonicalStaticPageCount: number;
    legacyPreservedPageCount: number;
    compatibilityRedirectCount: number;
    distributionArtifactCount: number;
    rssArtifactCount: number;
    unknownRouteOutcome: '404';
    rendererAuthority: 'consumer-only';
    astroDependencyMaterialized: false;
    astroBuildEnacted: false;
    staticHtmlRenderingEnacted: false;
    compatibilityRedirectsEnacted: false;
    legacyFallbackRendererEnacted: false;
    editorialSitemapDeployed: false;
    vercelCutoverEnacted: false;
    publicUiChanged: false;
    deployedRuntimeChanged: false;
  };
  acceptance: {
    r1Complete: true;
    r2_0Complete: true;
    shellBoundaryReady: true;
    cutoverReady: false;
    cutoverAuthorized: false;
    deploymentMutationCount: 0;
    nextRequiredCut: 'R2.1 — Astro Shell Materialization & Editorial Renderer';
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

const manifestText = readRepoFile('docs/editorial/publication-shell-boundary.v0.json');
const manifest = JSON.parse(manifestText) as PublicationShellBoundaryManifest;
const completion = readJson<PublicationShellBoundaryCompletion>('docs/editorial/R2.0-completion.v0.json');
const registryManifest = readJson<RecordRegistryManifest>('docs/editorial/record-registry.v0.json');
const routeManifest = readJson<RouteRuntimeManifest>('docs/editorial/route-runtime.v0.json');
const languageManifest = readJson<LanguageRuntimeManifest>('docs/editorial/language-runtime.v0.json');
const surfaceManifest = readJson<CoreEditorialSurfaceManifest>('docs/editorial/core-editorial-surfaces.v0.json');
const distributionManifest = readJson<DistributionFoundationManifest>('docs/editorial/distribution-foundation.v0.json');
const compatibilityManifest = readJson<LegacyCompatibilityManifest>('docs/editorial/legacy-compatibility.v0.json');
const r2Readme = readRepoFile('docs/editorial/R2-README.md');
const r20Doc = readRepoFile('docs/editorial/R2.0-publication-shell-boundary.md');

const records = materializeRegistryRecords(registryManifest);
const registry = reconstructRecordRegistry(registryManifest);
const routes = reconstructRouteRuntime(routeManifest, records);
const languages = reconstructLanguageRuntime(languageManifest, records);
const surfaceState = materializeSurfaceDocuments(surfaceManifest, records, registry, routes, languages);
const surfaces = reconstructCoreSurfaceRuntime(surfaceManifest, surfaceState.documents);
const distribution = reconstructDistributionRuntime(distributionManifest, surfaces, surfaceState.documents);
if (!distribution.bundle) throw new Error('r2-shell-completion-distribution-unavailable');
const shell = reconstructPublicationShellBoundary(manifest, distribution.bundle, compatibilityManifest);

describe('R2.0 terminal completion seal', () => {
  it('binds the exact witnessed shell manifest to the successful materialization run', () => {
    expect(completion.schemaVersion).toBe('editorial-publication-shell-boundary-completion/v0');
    expect(completion.status).toBe('frozen');
    expect(completion.normative).toBe(true);
    expect(completion.contractId).toBe('PORTFOLIO-R2.0-2026-08-30');
    expect(completion.materialization).toEqual({
      commit: '64f617adc9e3de6ec98ead7dc1d814f9ba1d6934',
      verify: { workflow: 'Verify', runId: 33350672725, conclusion: 'success' },
      manifestPath: 'docs/editorial/publication-shell-boundary.v0.json',
      manifestBlobSha: '6be4d50585de0fe3b62619ee6333ff9a31c5caad',
    });
    expect(gitBlobSha(manifestText)).toBe(completion.materialization.manifestBlobSha);
  });

  it('closes R2.0 only while the accepted shell plan still reconstructs exactly', () => {
    expect(shell.state).toBe('ready');
    expect(shell.errors).toEqual([]);
    expect(shell.plan?.canonicalPages).toHaveLength(completion.effectivePlan.canonicalStaticPageCount);
    expect(shell.plan?.legacyPreservedPages).toHaveLength(completion.effectivePlan.legacyPreservedPageCount);
    expect(shell.plan?.redirects).toHaveLength(completion.effectivePlan.compatibilityRedirectCount);
    expect(shell.plan?.artifacts).toHaveLength(completion.effectivePlan.distributionArtifactCount);
    expect(shell.plan?.unknownRouteOutcome).toBe('404');
  });

  it('preserves the historical next-cut decision without freezing later R2 progress', () => {
    expect(completion.acceptance).toEqual({
      r1Complete: true,
      r2_0Complete: true,
      shellBoundaryReady: true,
      cutoverReady: false,
      cutoverAuthorized: false,
      deploymentMutationCount: 0,
      nextRequiredCut: 'R2.1 — Astro Shell Materialization & Editorial Renderer',
    });
    expect(r2Readme).toContain('| R2.0 | Publication Shell Boundary | **COMPLETE** |');
    expect(r2Readme).toContain('R2_0_COMPLETE=true');
    expect(r20Doc).toContain('Status: **COMPLETE / CI WITNESSED**');
    expect(r20Doc).toContain('Materialization `Verify` run `33350672725`: **SUCCESS**.');
    expect(completion.effectivePlan.astroDependencyMaterialized).toBe(false);
    expect(completion.effectivePlan.vercelCutoverEnacted).toBe(false);
    expect(completion.effectivePlan.deployedRuntimeChanged).toBe(false);
  });
});
