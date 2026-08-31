import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  materializeRegistryRecords,
  type RecordRegistryManifest,
} from './record-registry';
import {
  reconstructRouteRuntime,
  type RouteRuntimeManifest,
} from './route-runtime';

interface RouteRuntimeCompletion {
  schemaVersion: 'editorial-route-runtime-completion/v0';
  status: 'frozen';
  normative: true;
  contractId: 'PORTFOLIO-R1.3-2026-08-30';
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
  effectiveRouteRuntime: {
    bornSystemRecords: 28;
    routedSystemRecords: 5;
    bornSystemsWithoutRoute: 23;
    canonicalRouteBindings: 10;
    aliasRouteBindings: 0;
    cancelledAgenticPlans: 2;
    unbirthedRepresentationRoutesAdmitted: false;
    runtimePathInferenceAllowed: false;
    languageRealizationsAdmitted: false;
    languageFallbackAllowed: false;
    legacyCompatibilityEnacted: false;
    publicProjectionCountChanged: false;
    frameworkCutoverEnacted: false;
    publicUiChanged: false;
    runtimeSemanticsChanged: false;
  };
  acceptance: {
    r1_2Complete: true;
    r1_3Complete: true;
    routeRuntimeReconstructs: true;
    routeAdmissionExplicit: true;
    historicalPathReassignmentForbidden: true;
    unknownPathRemainsUnresolved: true;
    currentPublicProjectionCount: 0;
    nextRequiredCut: 'R1.4 — Language Runtime';
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

const routeManifestText = readRepoFile('docs/editorial/route-runtime.v0.json');
const routeManifest = JSON.parse(routeManifestText) as RouteRuntimeManifest;
const registryManifest = JSON.parse(
  readRepoFile('docs/editorial/record-registry.v0.json'),
) as RecordRegistryManifest;
const completion = JSON.parse(
  readRepoFile('docs/editorial/R1.3-completion.v0.json'),
) as RouteRuntimeCompletion;
const r1Readme = readRepoFile('docs/editorial/R1-README.md');
const r13Doc = readRepoFile('docs/editorial/R1.3-route-runtime.md');

describe('R1.3 terminal completion seal', () => {
  it('binds the exact materialized Route Runtime manifest to its successful CI witness', () => {
    expect(completion.schemaVersion).toBe('editorial-route-runtime-completion/v0');
    expect(completion.status).toBe('frozen');
    expect(completion.normative).toBe(true);
    expect(completion.contractId).toBe('PORTFOLIO-R1.3-2026-08-30');
    expect(completion.materialization).toEqual({
      commit: '99943c68be9b800a2242d13adb498cbadb0c42ff',
      verify: {
        workflow: 'Verify',
        runId: 33343235212,
        conclusion: 'success',
      },
      manifestPath: 'docs/editorial/route-runtime.v0.json',
      manifestBlobSha: '3f19d88dc369a5bd5276c3d35b833fd352120419',
    });
    expect(gitBlobSha(routeManifestText)).toBe(completion.materialization.manifestBlobSha);
  });

  it('closes R1.3 only while the exact admitted route registry still reconstructs fail-closed', () => {
    const birthRecords = materializeRegistryRecords(registryManifest);
    const runtime = reconstructRouteRuntime(routeManifest, birthRecords);
    expect(runtime.state).toBe('ready');
    expect(runtime.errors).toEqual([]);
    expect(runtime.bindings).toHaveLength(10);
    expect(routeManifest.acceptance.r1_3Complete).toBe(false);
    expect(completion.effectiveRouteRuntime).toEqual({
      bornSystemRecords: 28,
      routedSystemRecords: 5,
      bornSystemsWithoutRoute: 23,
      canonicalRouteBindings: 10,
      aliasRouteBindings: 0,
      cancelledAgenticPlans: 2,
      unbirthedRepresentationRoutesAdmitted: false,
      runtimePathInferenceAllowed: false,
      languageRealizationsAdmitted: false,
      languageFallbackAllowed: false,
      legacyCompatibilityEnacted: false,
      publicProjectionCountChanged: false,
      frameworkCutoverEnacted: false,
      publicUiChanged: false,
      runtimeSemanticsChanged: false,
    });
  });

  it('advances R1 to Language Runtime without weakening route or projection boundaries', () => {
    expect(completion.acceptance).toEqual({
      r1_2Complete: true,
      r1_3Complete: true,
      routeRuntimeReconstructs: true,
      routeAdmissionExplicit: true,
      historicalPathReassignmentForbidden: true,
      unknownPathRemainsUnresolved: true,
      currentPublicProjectionCount: 0,
      nextRequiredCut: 'R1.4 — Language Runtime',
    });
    expect(r1Readme).toContain('| R1.3 | Route Runtime | **COMPLETE** |');
    expect(r1Readme).toContain('| R1.4 | Language Runtime | **NEXT** |');
    expect(r1Readme).toContain('R1_3_COMPLETE=true');
    expect(r13Doc).toContain('Status: **COMPLETE / CI WITNESSED**');
    expect(r13Doc).toContain('Verify run 33343235212');
    expect(r13Doc).toContain('R1_3_COMPLETE                                true');
  });
});
