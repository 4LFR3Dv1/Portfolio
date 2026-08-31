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

interface CoreSurfacesCompletion {
  schemaVersion: 'editorial-core-surfaces-completion/v0';
  status: 'frozen';
  normative: true;
  contractId: 'PORTFOLIO-R1.6-2026-08-30';
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
  effectiveCoreSurfaces: {
    governanceRecordBirths: 6;
    disclosureRecordBirths: 5;
    maturityRecordBirths: 1;
    routedSystemRecords: 5;
    publicProjectionCount: 10;
    editorialDocumentCount: 6;
    sanitizedDocumentOmissions: 4;
    sanitizedContentLeakCount: 0;
    coreSurfaceCount: 12;
    systemsPerLanguage: 3;
    researchItemsPerLanguage: 0;
    essayItemsPerLanguage: 0;
    noteItemsPerLanguage: 0;
    rankingInferenceAllowed: false;
    chronologyInferenceAllowed: false;
    crossLanguageFallbackAllowed: false;
    staticHtmlRenderingEnacted: false;
    frameworkCutoverEnacted: false;
    publicUiChanged: false;
    deployedRuntimeChanged: false;
  };
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

function gitBlobSha(content: string): string {
  const bytes = Buffer.from(content, 'utf8');
  return createHash('sha1')
    .update(`blob ${bytes.length}\0`)
    .update(bytes)
    .digest('hex');
}

const manifestText = readRepoFile('docs/editorial/core-editorial-surfaces.v0.json');
const manifest = JSON.parse(manifestText) as CoreEditorialSurfaceManifest;
const completion = JSON.parse(
  readRepoFile('docs/editorial/R1.6-completion.v0.json'),
) as CoreSurfacesCompletion;
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
const r16Doc = readRepoFile('docs/editorial/R1.6-core-editorial-surfaces.md');

const records = materializeRegistryRecords(registryManifest);
const registry = reconstructRecordRegistry(registryManifest);
const routeRuntime = reconstructRouteRuntime(routeManifest, records);
const languageRuntime = reconstructLanguageRuntime(languageManifest, records);
const state = materializeSurfaceDocuments(
  manifest,
  records,
  registry,
  routeRuntime,
  languageRuntime,
);
const surfaces = reconstructCoreSurfaceRuntime(manifest, state.documents);

describe('R1.6 terminal completion seal', () => {
  it('binds the exact materialized surface manifest to its successful CI witness', () => {
    expect(completion.schemaVersion).toBe('editorial-core-surfaces-completion/v0');
    expect(completion.status).toBe('frozen');
    expect(completion.normative).toBe(true);
    expect(completion.contractId).toBe('PORTFOLIO-R1.6-2026-08-30');
    expect(completion.materialization).toEqual({
      commit: 'fba289bec802518e3af2f6520ad8a5cb39708db4',
      verify: {
        workflow: 'Verify',
        runId: 33346924011,
        conclusion: 'success',
      },
      manifestPath: 'docs/editorial/core-editorial-surfaces.v0.json',
      manifestBlobSha: '9924202c22191aa92c1dad9598073950aa860e5a',
    });
    expect(gitBlobSha(manifestText)).toBe(completion.materialization.manifestBlobSha);
  });

  it('closes R1.6 only while governance, documents and core surfaces still reconstruct exactly', () => {
    expect(manifest.acceptance.r1_6Complete).toBe(false);
    expect(state.governance.state).toBe('ready');
    expect(state.governance.errors).toEqual([]);
    expect(state.governance.records).toHaveLength(6);
    expect(state.projections.filter((entry) => entry.state === 'projected')).toHaveLength(10);
    expect(state.documents.filter((entry) => entry.state === 'document')).toHaveLength(6);
    expect(state.documents.filter((entry) =>
      entry.state === 'omitted' && entry.reasons.includes('sanitized-content-authority-unavailable'))).toHaveLength(4);
    expect(surfaces.state).toBe('ready');
    expect(surfaces.errors).toEqual([]);
    expect(surfaces.surfaces).toHaveLength(12);
    expect(completion.effectiveCoreSurfaces).toEqual({
      governanceRecordBirths: 6,
      disclosureRecordBirths: 5,
      maturityRecordBirths: 1,
      routedSystemRecords: 5,
      publicProjectionCount: 10,
      editorialDocumentCount: 6,
      sanitizedDocumentOmissions: 4,
      sanitizedContentLeakCount: 0,
      coreSurfaceCount: 12,
      systemsPerLanguage: 3,
      researchItemsPerLanguage: 0,
      essayItemsPerLanguage: 0,
      noteItemsPerLanguage: 0,
      rankingInferenceAllowed: false,
      chronologyInferenceAllowed: false,
      crossLanguageFallbackAllowed: false,
      staticHtmlRenderingEnacted: false,
      frameworkCutoverEnacted: false,
      publicUiChanged: false,
      deployedRuntimeChanged: false,
    });
  });

  it('advances the shared R1 program to Distribution Foundation without cutting over deployment', () => {
    expect(completion.acceptance).toEqual({
      r1_5Complete: true,
      r1_6Complete: true,
      governanceExactRevisionBindingRequired: true,
      surfaceRuntimeMaterialized: true,
      surfacesConsumeDocumentsOnly: true,
      sanitizedContentLeakCount: 0,
      currentPublicProjectionCount: 10,
      currentEditorialDocumentCount: 6,
      coreSurfaceCount: 12,
      nextRequiredCut: 'R1.7 — Distribution Foundation',
    });
    expect(r1Readme).toContain('| R1.6 | Core Editorial Surfaces | **COMPLETE** |');
    expect(r1Readme).toContain('| R1.7 | Distribution Foundation | **NEXT** |');
    expect(r1Readme).toContain('R1_6_COMPLETE=true');
    expect(r16Doc).toContain('Status: **COMPLETE / CI WITNESSED**');
    expect(r16Doc).toContain('Materialization `Verify` run `33346924011`: **SUCCESS**.');
    expect(r16Doc).toContain('R1_6_COMPLETE                                       true');
    expect(completion.effectiveCoreSurfaces.frameworkCutoverEnacted).toBe(false);
    expect(completion.effectiveCoreSurfaces.deployedRuntimeChanged).toBe(false);
  });
});
