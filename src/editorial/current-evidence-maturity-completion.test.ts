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
  candidateWitness: Record<string, unknown>;
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

describe('R1-A2.4 completion seal', () => {
  it('reconstructs the accepted Evidence + Maturity materialization without semantic drift', () => {
    const materialized = materializeCurrentEvidenceMaturity();
    expect(materialized.errors).toEqual([]);
    expect(materialized.observations).toHaveLength(48);
    expect(materialized.maturityRecords).toHaveLength(8);
    expect(materialized.maturityResolutions.filter((entry) => entry.state === 'classified')).toHaveLength(8);
    expect(materialized.maturityResolutions.filter((entry) => entry.state === 'unclassified')).toHaveLength(19);
    expect(materialized.maturityResolutions.filter((entry) => entry.state === 'conflict')).toHaveLength(0);
  });

  it('binds the seal to the successful candidate CI campaign', () => {
    expect(completion.status).toBe('complete');
    expect(completion.candidateWitness).toEqual({
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
    expect(completion.materialization).toMatchObject({
      currentSuccessorSystemCount: 27,
      currentEvidenceCandidateCount: 27,
      currentObservationCount: 48,
      maturityGovernanceBirthCount: 8,
      maturityClassifiedCount: 8,
      maturityUnclassifiedCount: 19,
      maturityConflictCount: 0,
      staleMaturityInheritanceCount: 0,
      formalEvidenceRecordBirthCount: 0,
      formalEvidenceBindingBirthCount: 0,
    });
  });

  it('advances the constitutional frontier without authorizing public projection or production mutation', () => {
    expect(manifest.status).toBe('complete');
    expect(manifest.acceptance).toMatchObject({
      r1_a2_4Complete: true,
      publicDisclosureDecisionCount: 0,
      routeMutationCount: 0,
      publicSurfaceMutationCount: 0,
      productionMutationCount: 0,
      nextRequiredAction: 'R1-A2.5 — Public Disclosure Reauthorization',
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
    expect(completion.acceptance).toMatchObject({
      r1_a2_4Complete: true,
      currentPublicationValid: false,
      cutoverReady: false,
      cutoverAuthorized: false,
      cutoverEnacted: false,
      nextRequiredCut: 'R1-A2.5 — Public Disclosure Reauthorization',
    });
  });

  it('publishes one consistent current frontier while preserving frozen R1 history', () => {
    expect(constitution.program.find((entry) => entry.cut === 'R1-A2.4')?.status).toBe('complete');
    expect(constitution.program.find((entry) => entry.cut === 'R1-A2.5')?.status).toBe('next');
    expect(constitution.currentState).toMatchObject({
      evidenceMaturityReconciliationComplete: true,
      currentEvidenceObservationCount: 48,
      currentMaturityClassifiedCount: 8,
      currentMaturityUnclassifiedCount: 19,
      currentMaturityConflictCount: 0,
      staleMaturityInheritanceCount: 0,
      currentPublicationValid: false,
      cutoverReady: false,
    });
    expect(constitution.acceptance).toMatchObject({
      r1_a2_4Complete: true,
      r1_a2Complete: false,
      nextRequiredCut: 'R1-A2.5 — Public Disclosure Reauthorization',
    });
    expect(r1A2Doc).toContain('| R1-A2.4 | Evidence + Maturity Reconciliation | **COMPLETE** |');
    expect(r1A2Doc).toContain('NEXT=R1-A2.5 — Public Disclosure Reauthorization');
    expect(r1Readme).toContain('NEXT=R2 — Editorial Publication Shell & Cutover');
    expect(r1Readme).toContain('NEXT=R1-A2.5 — Public Disclosure Reauthorization');
  });
});
