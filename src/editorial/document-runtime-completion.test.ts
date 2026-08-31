import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

interface DocumentRuntimeCompletion {
  schemaVersion: 'editorial-document-runtime-completion/v0';
  status: 'frozen';
  normative: true;
  contractId: 'PORTFOLIO-R1.5-2026-08-30';
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
  effectiveDocumentRuntime: {
    publicProjectionCount: 0;
    editorialDocumentCount: 0;
    systemContentAdapterMaterialized: true;
    exactLanguageRealizationRequiredForFullContent: true;
    metadataOnlyIncludesSemanticPayload: false;
    sanitizedRuntimeTransformationAllowed: false;
    redirectBecomesDocument: false;
    documentIsRecordAuthority: false;
    documentIsLanguageAuthority: false;
    rendererMayInferSemanticContent: false;
    markdownAuthorityIntroduced: false;
    staticHtmlRenderingEnacted: false;
    frameworkCutoverEnacted: false;
    publicUiChanged: false;
    runtimeSemanticsChanged: false;
  };
  acceptance: {
    r1_4Complete: true;
    r1_5Complete: true;
    documentRuntimeMaterialized: true;
    projectionBoundaryPreserved: true;
    exactRevisionLanguageBindingPreserved: true;
    runtimeSanitizationForbidden: true;
    currentEditorialDocumentCount: 0;
    nextRequiredCut: 'R1.6 — Core Editorial Surfaces';
  };
}

interface DocumentRuntimeManifest {
  acceptance: {
    documentRuntimeMaterialized: true;
    projectionRequired: true;
    exactLanguageRealizationRequiredForFullContent: true;
    metadataOnlySemanticPayloadForbidden: true;
    sanitizedRuntimeTransformationForbidden: true;
    redirectDoesNotBecomeDocument: true;
    currentEditorialDocumentCount: 0;
    publicUiChanged: false;
    runtimeSemanticsChanged: false;
    r1_5Complete: false;
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

const manifestText = readRepoFile('docs/editorial/editorial-document-runtime.v0.json');
const manifest = JSON.parse(manifestText) as DocumentRuntimeManifest;
const completion = JSON.parse(
  readRepoFile('docs/editorial/R1.5-completion.v0.json'),
) as DocumentRuntimeCompletion;
const r1Readme = readRepoFile('docs/editorial/R1-README.md');
const r15Doc = readRepoFile('docs/editorial/R1.5-editorial-document-runtime.md');

describe('R1.5 terminal completion seal', () => {
  it('binds the exact materialized document runtime manifest to its successful CI witness', () => {
    expect(completion.schemaVersion).toBe('editorial-document-runtime-completion/v0');
    expect(completion.status).toBe('frozen');
    expect(completion.normative).toBe(true);
    expect(completion.contractId).toBe('PORTFOLIO-R1.5-2026-08-30');
    expect(completion.materialization).toEqual({
      commit: 'b8ed8e96adbca6672dbe25143249cee2fa560763',
      verify: {
        workflow: 'Verify',
        runId: 33346253580,
        conclusion: 'success',
      },
      manifestPath: 'docs/editorial/editorial-document-runtime.v0.json',
      manifestBlobSha: '6927ef5abc7f391bb34a25cd12af92bbd06783d0',
    });
    expect(gitBlobSha(manifestText)).toBe(completion.materialization.manifestBlobSha);
  });

  it('closes R1.5 without rewriting the materialization manifest or publishing content prematurely', () => {
    expect(manifest.acceptance.r1_5Complete).toBe(false);
    expect(manifest.acceptance.currentEditorialDocumentCount).toBe(0);
    expect(completion.effectiveDocumentRuntime).toEqual({
      publicProjectionCount: 0,
      editorialDocumentCount: 0,
      systemContentAdapterMaterialized: true,
      exactLanguageRealizationRequiredForFullContent: true,
      metadataOnlyIncludesSemanticPayload: false,
      sanitizedRuntimeTransformationAllowed: false,
      redirectBecomesDocument: false,
      documentIsRecordAuthority: false,
      documentIsLanguageAuthority: false,
      rendererMayInferSemanticContent: false,
      markdownAuthorityIntroduced: false,
      staticHtmlRenderingEnacted: false,
      frameworkCutoverEnacted: false,
      publicUiChanged: false,
      runtimeSemanticsChanged: false,
    });
  });

  it('advances the shared R1 program to Core Editorial Surfaces', () => {
    expect(completion.acceptance).toEqual({
      r1_4Complete: true,
      r1_5Complete: true,
      documentRuntimeMaterialized: true,
      projectionBoundaryPreserved: true,
      exactRevisionLanguageBindingPreserved: true,
      runtimeSanitizationForbidden: true,
      currentEditorialDocumentCount: 0,
      nextRequiredCut: 'R1.6 — Core Editorial Surfaces',
    });
    expect(r1Readme).toContain('| R1.5 | Editorial Document Runtime | **COMPLETE** |');
    expect(r1Readme).toContain('| R1.6 | Core Editorial Surfaces | **NEXT** |');
    expect(r1Readme).toContain('R1_5_COMPLETE=true');
    expect(r15Doc).toContain('Status: **COMPLETE / CI WITNESSED**');
    expect(r15Doc).toContain('Verify run 33346253580');
    expect(r15Doc).toContain('R1_5_COMPLETE                                       true');
  });
});
