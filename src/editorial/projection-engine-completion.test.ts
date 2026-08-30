import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

interface ProjectionEngineManifest {
  schemaVersion: 'editorial-projection-engine/v0';
  contractId: 'PORTFOLIO-R1.2-2026-08-30';
  status: 'materialized';
  normative: true;
  currentEditorialState: {
    bornSystemRecords: 28;
    otherBornRecordKinds: 0;
    currentPublicProjectionCount: 0;
  };
  acceptance: {
    recordBirthDoesNotImplyProjection: true;
    currentDisclosureRequired: true;
    routeLanguageResolutionRequired: true;
    exactTargetBindingRequired: true;
    privateWithheldFailClosed: true;
    withdrawnTombstonedFailClosed: true;
    metadataOnlyPayloadExcluded: true;
    runtimeSanitizationForbidden: true;
    maturityNotExposureGate: true;
    aliasDuplicateProjectionForbidden: true;
    currentPublicProjectionCount: 0;
    frameworkCutoverEnacted: false;
    publicUiChanged: false;
    runtimeSemanticsChanged: false;
    r1_2Complete: false;
  };
}

interface ProjectionEngineCompletion {
  schemaVersion: 'editorial-projection-engine-completion/v0';
  status: 'frozen';
  normative: true;
  contractId: 'PORTFOLIO-R1.2-2026-08-30';
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
  effectiveProjection: {
    bornSystemRecords: 28;
    currentPublicProjectionCount: 0;
    recordBirthImpliesProjection: false;
    currentDisclosureRequired: true;
    routeLanguageResolutionRequired: true;
    canonicalPayloadIncluded: false;
    runtimeSanitizationAllowed: false;
    maturityActsAsExposureGate: false;
    aliasMayDuplicateCanonicalDocument: false;
    frameworkCutoverEnacted: false;
    publicUiChanged: false;
    runtimeSemanticsChanged: false;
  };
  acceptance: {
    r1_1Complete: true;
    r1_2Complete: true;
    projectionEngineDeterministic: true;
    publicProjectionFailClosed: true;
    privateMaterialExcludedByConstruction: true;
    currentPublicProjectionCount: 0;
    nextRequiredCut: 'R1.3 — Route Runtime';
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

const manifestText = readRepoFile('docs/editorial/projection-engine.v0.json');
const manifest = JSON.parse(manifestText) as ProjectionEngineManifest;
const completion = JSON.parse(
  readRepoFile('docs/editorial/R1.2-completion.v0.json'),
) as ProjectionEngineCompletion;
const r1Readme = readRepoFile('docs/editorial/R1-README.md');
const r12Doc = readRepoFile('docs/editorial/R1.2-projection-engine.md');

describe('R1.2 terminal completion seal', () => {
  it('cryptographically binds the exact materialized projection manifest to the successful CI witness', () => {
    expect(completion.schemaVersion).toBe('editorial-projection-engine-completion/v0');
    expect(completion.status).toBe('frozen');
    expect(completion.normative).toBe(true);
    expect(completion.contractId).toBe('PORTFOLIO-R1.2-2026-08-30');
    expect(completion.materialization).toEqual({
      commit: '5113d3c3e6d4d15283e3b9d3ded512da05469a32',
      verify: {
        workflow: 'Verify',
        runId: 33342868125,
        conclusion: 'success',
      },
      manifestPath: 'docs/editorial/projection-engine.v0.json',
      manifestBlobSha: 'ae6af0ec2e6d3b8a961f2f9eaa0df972beb8e8b1',
    });
    expect(gitBlobSha(manifestText)).toBe(completion.materialization.manifestBlobSha);
  });

  it('closes R1.2 while preserving zero inferred public projections and no runtime cutover', () => {
    expect(manifest.status).toBe('materialized');
    expect(manifest.normative).toBe(true);
    expect(manifest.currentEditorialState).toMatchObject({
      bornSystemRecords: 28,
      otherBornRecordKinds: 0,
      currentPublicProjectionCount: 0,
    });
    expect(manifest.acceptance.r1_2Complete).toBe(false);
    expect(completion.effectiveProjection).toEqual({
      bornSystemRecords: 28,
      currentPublicProjectionCount: 0,
      recordBirthImpliesProjection: false,
      currentDisclosureRequired: true,
      routeLanguageResolutionRequired: true,
      canonicalPayloadIncluded: false,
      runtimeSanitizationAllowed: false,
      maturityActsAsExposureGate: false,
      aliasMayDuplicateCanonicalDocument: false,
      frameworkCutoverEnacted: false,
      publicUiChanged: false,
      runtimeSemanticsChanged: false,
    });
  });

  it('advances R1 to Route Runtime only after the projection boundary is CI witnessed', () => {
    expect(completion.acceptance).toEqual({
      r1_1Complete: true,
      r1_2Complete: true,
      projectionEngineDeterministic: true,
      publicProjectionFailClosed: true,
      privateMaterialExcludedByConstruction: true,
      currentPublicProjectionCount: 0,
      nextRequiredCut: 'R1.3 — Route Runtime',
    });
    expect(r1Readme).toContain('| R1.2 | Projection Engine | **COMPLETE** |');
    expect(r1Readme).toContain('| R1.3 | Route Runtime | **NEXT** |');
    expect(r1Readme).toContain('R1_2_COMPLETE=true');
    expect(r12Doc).toContain('Status: **COMPLETE / CI WITNESSED**');
    expect(r12Doc).toContain('Verify run 33342868125');
    expect(r12Doc).toContain('R1_2_COMPLETE                                true');
  });
});
