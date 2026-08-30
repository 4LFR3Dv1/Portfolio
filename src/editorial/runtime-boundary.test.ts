import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  EDITORIAL_RUNTIME_BOUNDARY_SCHEMA_VERSION,
  runtimeBoundaryV0,
  validateRuntimeBoundary,
} from './runtime-boundary';

interface R0A1Completion {
  acceptance: {
    r0A1Complete: true;
    r0EffectiveComplete: true;
    r0ConsistencyRestored: true;
    r1PreComplete: true;
    r1_0Unblocked: true;
  };
}

interface R1PreCompletion {
  acceptance: {
    r1PreComplete: true;
    recordBirthAuthorizedByGroundingAlone: false;
    r1RuntimeMayStart: false;
  };
}

interface RuntimeBoundaryManifest {
  schemaVersion: typeof EDITORIAL_RUNTIME_BOUNDARY_SCHEMA_VERSION;
  status: 'materialized';
  normative: true;
  preconditions: {
    r0EffectiveComplete: true;
    r1PreComplete: true;
    recordBirthCount: 0;
  };
  targetRuntime: {
    publicationShell: 'astro-static';
    interactiveLayer: 'react-islands';
    outputMode: 'static';
  };
  migration: {
    frameworkCutoverEnacted: false;
    publicUiChanged: false;
    runtimeSemanticsChanged: false;
  };
  acceptance: {
    runtimeBoundaryFrozen: true;
    targetShellSelected: true;
    semanticAuthoritySeparatedFromRenderer: true;
    staticFirst: true;
    reactIslandBoundaryExplicit: true;
    failClosedBuildBoundaryExplicit: true;
    recordBirthCount: 0;
    r1_0Complete: false;
  };
}

function readRepoFile(path: string): string {
  return readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
}

const manifest = JSON.parse(
  readRepoFile('docs/editorial/editorial-runtime-boundary.v0.json'),
) as RuntimeBoundaryManifest;

const amendmentCompletion = JSON.parse(
  readRepoFile('docs/editorial/R0-A1-completion.v0.json'),
) as R0A1Completion;

const groundingCompletion = JSON.parse(
  readRepoFile('docs/editorial/R1-PRE-completion.v0.json'),
) as R1PreCompletion;

const r1Readme = readRepoFile('docs/editorial/R1-README.md');
const r10Doc = readRepoFile('docs/editorial/R1.0-editorial-runtime-boundary.md');

describe('R1.0 editorial runtime boundary', () => {
  it('starts only after the effective R0 amendment and corpus grounding are complete', () => {
    expect(amendmentCompletion.acceptance).toMatchObject({
      r0A1Complete: true,
      r0EffectiveComplete: true,
      r0ConsistencyRestored: true,
      r1PreComplete: true,
      r1_0Unblocked: true,
    });
    expect(groundingCompletion.acceptance.r1PreComplete).toBe(true);
    expect(groundingCompletion.acceptance.recordBirthAuthorizedByGroundingAlone).toBe(false);
  });

  it('selects a static Astro shell with React islands without transferring authority to the renderer', () => {
    expect(runtimeBoundaryV0.schemaVersion).toBe(EDITORIAL_RUNTIME_BOUNDARY_SCHEMA_VERSION);
    expect(runtimeBoundaryV0.targetRuntime).toEqual({
      publicationShell: 'astro-static',
      interactiveLayer: 'react-islands',
      outputMode: 'static',
      canonicalReadingRequiresServer: false,
    });
    expect(runtimeBoundaryV0.authority.semanticAuthority).toBe('editorial-registry');
    expect(runtimeBoundaryV0.authority.rendererIsAuthority).toBe(false);
    expect(runtimeBoundaryV0.authority.clientStateIsAuthority).toBe(false);
    expect(runtimeBoundaryV0.projectionBoundary.renderersConsumeProjectionDtos).toBe(true);
  });

  it('freezes the deterministic resolution pipeline before rendering', () => {
    expect(runtimeBoundaryV0.pipeline).toEqual([
      'load',
      'validate-contracts',
      'reconstruct-lineage',
      'apply-amendments',
      'resolve-governance',
      'resolve-language',
      'resolve-route',
      'project',
      'render',
    ]);
    expect(validateRuntimeBoundary(runtimeBoundaryV0)).toEqual([]);
  });

  it('keeps route and language identity fail-closed', () => {
    expect(runtimeBoundaryV0.routing.recordRoutesGeneratedFromBindings).toBe(true);
    expect(runtimeBoundaryV0.routing.unknownPathOutcome).toBe('404-unresolved');
    expect(runtimeBoundaryV0.routing.unknownPathMayRenderHome).toBe(false);
    expect(runtimeBoundaryV0.language.canonicalRecordRoutesAreLocalePrefixed).toBe(true);
    expect(runtimeBoundaryV0.language.implicitFallbackAllowed).toBe(false);
    expect(runtimeBoundaryV0.language.missingRealizationOutcome).toBe('language-unavailable');
  });

  it('does not perform Record Birth or framework cutover in R1.0', () => {
    expect(runtimeBoundaryV0.migration).toEqual({
      frameworkCutoverEnacted: false,
      publicUiChanged: false,
      runtimeSemanticsChanged: false,
      recordBirthCount: 0,
    });
    expect(manifest.preconditions.recordBirthCount).toBe(0);
    expect(manifest.migration.frameworkCutoverEnacted).toBe(false);
    expect(manifest.migration.publicUiChanged).toBe(false);
    expect(manifest.migration.runtimeSemanticsChanged).toBe(false);
  });

  it('keeps the machine-readable and narrative contracts aligned', () => {
    expect(manifest.schemaVersion).toBe(EDITORIAL_RUNTIME_BOUNDARY_SCHEMA_VERSION);
    expect(manifest.status).toBe('materialized');
    expect(manifest.normative).toBe(true);
    expect(manifest.targetRuntime).toMatchObject({
      publicationShell: 'astro-static',
      interactiveLayer: 'react-islands',
      outputMode: 'static',
    });
    expect(manifest.acceptance.runtimeBoundaryFrozen).toBe(true);
    expect(manifest.acceptance.r1_0Complete).toBe(false);
    expect(r1Readme).toContain('| R1.0 | Editorial Runtime Boundary | **MATERIALIZING** |');
    expect(r10Doc).toContain('Astro static output');
    expect(r10Doc).toContain('React islands');
    expect(r10Doc).toContain('R1.1 — Record Registry');
  });
});
