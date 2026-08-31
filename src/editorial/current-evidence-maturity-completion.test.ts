import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import evidenceMaturityJson from '../../docs/editorial/R1-A2.4-current-evidence-maturity.v0.json';
import completionJson from '../../docs/editorial/R1-A2.4-completion.v0.json';
import constitutionJson from '../../docs/editorial/R1-A2-reconciliation-constitution.v0.json';
import { materializeCurrentEvidenceMaturity } from './current-evidence-maturity-runtime';

const manifest = evidenceMaturityJson as {
  status: string;
  materialization: Record<string, unknown>;
  acceptance: Record<string, unknown>;
};
const completion = completionJson as {
  status: string;
  supersededCandidateWitness: Record<string, unknown>;
  supersededTerminalWitness: Record<string, unknown>;
  correction: Record<string, unknown>;
  correctedCandidateWitness: Record<string, unknown>;
  materialization: Record<string, unknown>;
  productionBoundary: Record<string, unknown>;
  acceptance: Record<string, unknown>;
};
const constitution = constitutionJson as {
  program: Array<{ cut: string; status: string }>;
  currentState: Record<string, unknown>;
  acceptance: Record<string, unknown>;
};
const r1A2Doc = readFileSync(new URL('../../docs/editorial/R1-A2-current-corpus-reconciliation.md', import.meta.url), 'utf8');
const r1Readme = readFileSync(new URL('../../docs/editorial/R1-README.md', import.meta.url), 'utf8');

describe('R1-A2.4 corrected completion seal', () => {
  it('reconstructs the corrected Evidence + Maturity materialization without identity replacement', () => {
    const materialized = materializeCurrentEvidenceMaturity();
    expect(materialized.errors).toEqual([]);
    expect(materialized.observations).toHaveLength(48);
    expect(materialized.maturityRecords).toHaveLength(8);
    expect(materialized.maturityRecords.filter((entry) => entry.materializationKind === 'birth')).toHaveLength(7);
    expect(materialized.maturityRecords.filter((entry) => entry.materializationKind === 'successor')).toHaveLength(1);
    expect(materialized.maturityResolutions.filter((entry) => entry.state === 'classified')).toHaveLength(8);
    expect(materialized.maturityResolutions.filter((entry) => entry.state === 'unclassified')).toHaveLength(19);
    expect(materialized.maturityResolutions.filter((entry) => entry.state === 'conflict')).toHaveLength(0);

    const xs = materialized.maturityRecords.find((entry) => entry.subjectKey === 'xs-wallet');
    expect(xs?.governanceRecordId).toBe('rec_3a926254f23e4a0c89102c3fbfe636d6');
    expect(xs?.materializationKind).toBe('successor');
    expect(xs?.revision.generation).toBe(1);
    expect(xs?.revision.previousRevisionId).toBe(xs?.previousGovernanceRevisionId);
  });

  it('preserves prior green witnesses as historical evidence while binding acceptance to the corrected candidate', () => {
    expect(completion.status).toBe('complete');
    expect(completion.supersededCandidateWitness).toEqual({
      branchHead: 'f0d3f13f0e92b3188a2dd122a30da5ea72b162bc',
      verifyRunId: 33414303736,
      verifyRunNumber: 268,
      verifyConclusion: 'success',
      editorialShellBuildRunId: 33414303712,
      editorialShellBuildRunNumber: 103,
      editorialShellBuildConclusion: 'success',
      cutoverReadinessRunId: 33414303710,
      cutoverReadinessRunNumber: 34,
      cutoverReadinessConclusion: 'success',
    });
    expect(completion.supersededTerminalWitness).toEqual({
      branchHead: '302dda873dc763270df16ca1875b5a924983ce11',
      verifyRunId: 33414805276,
      verifyRunNumber: 276,
      verifyConclusion: 'success',
      editorialShellBuildRunId: 33414805334,
      editorialShellBuildRunNumber: 111,
      editorialShellBuildConclusion: 'success',
      cutoverReadinessRunId: 33414805308,
      cutoverReadinessRunNumber: 42,
      cutoverReadinessConclusion: 'success',
    });
    expect(completion.correction).toMatchObject({
      requiredIdentity: 'rec_3a926254f23e4a0c89102c3fbfe636d6',
      requiredMaterialization: 'generation-1 successor of the existing maturity governance Record',
      priorWitnessesRemainHistorical: true,
      priorWitnessesAuthorizeCorrectedSpecimen: false,
    });
    expect(completion.correctedCandidateWitness).toEqual({
      branchHead: '13cbb9855c102f823b59c83433a275730c414412',
      verifyRunId: 33415885676,
      verifyRunNumber: 286,
      verifyConclusion: 'success',
      editorialShellBuildRunId: 33415885657,
      editorialShellBuildRunNumber: 121,
      editorialShellBuildConclusion: 'success',
      cutoverReadinessRunId: 33415885909,
      cutoverReadinessRunNumber: 52,
      cutoverReadinessConclusion: 'success',
    });
  });

  it('freezes seven births plus one governance successor while production remains untouched', () => {
    expect(manifest.status).toBe('complete');
    expect(manifest.materialization).toMatchObject({
      currentSuccessorSystemCount: 27,
      observationCount: 48,
      maturityGovernanceBirthCount: 7,
      maturityGovernanceSuccessorCount: 1,
      maturityClassifiedCount: 8,
      maturityUnclassifiedCount: 19,
    });
    expect(manifest.acceptance).toMatchObject({
      staleMaturityInheritanceCount: 0,
      maturityIdentityReplacementCount: 0,
      maturityConflictCount: 0,
      publicDisclosureDecisionCount: 0,
      routeMutationCount: 0,
      publicSurfaceMutationCount: 0,
      productionMutationCount: 0,
      r1_a2_4Complete: true,
      nextRequiredAction: 'R1-A2.5 — Public Disclosure Reauthorization',
    });
    expect(completion.materialization).toMatchObject({
      maturityGovernanceBirthCount: 7,
      maturityGovernanceSuccessorCount: 1,
      maturityIdentityReplacementCount: 0,
      maturityClassifiedCount: 8,
      maturityUnclassifiedCount: 19,
      maturityConflictCount: 0,
      staleMaturityInheritanceCount: 0,
      formalEvidenceRecordBirthCount: 0,
      formalEvidenceBindingBirthCount: 0,
    });
    expect(completion.productionBoundary).toMatchObject({
      publicRuntimeChanged: false,
      productionDnsChanged: false,
      railwayTargetChanged: false,
      vercelConfigurationChanged: false,
      publicDisclosureChanged: false,
      routeRuntimeChanged: false,
      publicSurfaceChanged: false,
      productionMutationCount: 0,
    });
  });

  it('advances to A2.5 only after the corrected lineage is accepted', () => {
    expect(constitution.program.find((entry) => entry.cut === 'R1-A2.4')?.status).toBe('complete');
    expect(constitution.program.find((entry) => entry.cut === 'R1-A2.5')?.status).toBe('next');
    expect(constitution.currentState).toMatchObject({
      evidenceMaturityReconciliationComplete: true,
      evidenceMaturityCorrectionActive: false,
      currentEvidenceObservationCount: 48,
      currentMaturityClassifiedCount: 8,
      currentMaturityUnclassifiedCount: 19,
      currentMaturityConflictCount: 0,
      currentMaturityGovernanceBirthCount: 7,
      currentMaturityGovernanceSuccessorCount: 1,
      maturityIdentityReplacementCount: 0,
      staleMaturityInheritanceCount: 0,
      currentPublicationValid: false,
      cutoverReady: false,
    });
    expect(constitution.acceptance).toMatchObject({
      r1_a2_4Complete: true,
      r1_a2Complete: false,
      nextRequiredCut: 'R1-A2.5 — Public Disclosure Reauthorization',
    });
    expect(completion.acceptance).toMatchObject({
      existingMaturityGovernanceIdentityPreserved: true,
      maturityIdentityReplacementCount: 0,
      r1_a2_4Complete: true,
      currentPublicationValid: false,
      cutoverReady: false,
      nextRequiredCut: 'R1-A2.5 — Public Disclosure Reauthorization',
    });
    expect(r1A2Doc).toContain('R1_A2_4_COMPLETE=true');
    expect(r1A2Doc).toContain('NEXT=R1-A2.5 — Public Disclosure Reauthorization');
    expect(r1Readme).toContain('NEXT=R2 — Editorial Publication Shell & Cutover');
    expect(r1Readme).toContain('NEXT=R1-A2.5 — Public Disclosure Reauthorization');
  });
});
