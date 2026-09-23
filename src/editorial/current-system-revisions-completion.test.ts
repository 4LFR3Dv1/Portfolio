import { describe, expect, it } from 'vitest';
import completionJson from '../../docs/editorial/R1-A2.3-completion.v0.json';
import manifestJson from '../../docs/editorial/R1-A2.3-current-system-revisions.v0.json';
import { materializeCurrentSystemRevisions, type CurrentRevisionManifest } from './current-revision-runtime';

const completion = completionJson as {
  status: string;
  candidateWitness: {
    headSha: string;
    prMergeSha: string;
    verifyRunId: number;
    verifyRunNumber: number;
    conclusion: string;
    witnessedProperties: string[];
  };
  materialization: {
    bornSystemRecordCount: number;
    successorRevisionCount: number;
    deferredRevisionCount: number;
    preservedRecordIdCount: number;
    recordIdChangeCount: number;
    newRecordBirthCount: number;
    genericBirthSummarySuccessorCount: number;
  };
  productionBoundary: { productionMutationCount: number };
  acceptance: {
    r1_a2_3Complete: boolean;
    currentRevisionMaterializationComplete: boolean;
    evidenceMaturityReconciliationComplete: boolean;
    currentDisclosureReauthorized: boolean;
    currentRoutesAdmitted: boolean;
    currentEditorialSurfacesReconstructed: boolean;
    currentPublicationValid: boolean;
    cutoverReady: boolean;
    cutoverAuthorized: boolean;
    nextRequiredCut: string;
  };
};
const manifest = manifestJson as CurrentRevisionManifest;
const materialized = materializeCurrentSystemRevisions();

describe('R1-A2.3 completion seal', () => {
  it('binds the accepted materialization to the exact successful Verify candidate witness', () => {
    expect(completion.status).toBe('complete');
    expect(completion.candidateWitness).toMatchObject({
      headSha: 'a38d185184d437a71bd9de7f71b6f59267ebd5e1',
      prMergeSha: 'c2cc44cc6ef812f603fde0b3036927183f4b8dfe',
      verifyRunId: 33411967644,
      verifyRunNumber: 255,
      conclusion: 'success',
    });
    expect(completion.candidateWitness.witnessedProperties.length).toBeGreaterThanOrEqual(7);
  });

  it('reconstructs the same 27 successors and one explicit deferment from the sealed manifest', () => {
    expect(materialized.errors).toEqual([]);
    expect(materialized.records).toHaveLength(28);
    expect(materialized.successors).toHaveLength(27);
    expect(materialized.deferredRecordIds).toEqual(['rec_c5a75fd5ecae0565aaa0c96f0ad53227']);
    expect(completion.materialization).toEqual({
      bornSystemRecordCount: 28,
      successorRevisionCount: 27,
      deferredRevisionCount: 1,
      preservedRecordIdCount: 28,
      recordIdChangeCount: 0,
      newRecordBirthCount: 0,
      genericBirthSummarySuccessorCount: 0,
    });
    expect(manifest.acceptance.r1_a2_3Complete).toBe(true);
  });

  it('closes only current System revision materialization and leaves governance/publication work fail-closed', () => {
    expect(completion.productionBoundary.productionMutationCount).toBe(0);
    expect(completion.acceptance).toEqual({
      r1_a2_3Complete: true,
      currentRevisionMaterializationComplete: true,
      evidenceMaturityReconciliationComplete: false,
      currentDisclosureReauthorized: false,
      currentRoutesAdmitted: false,
      currentEditorialSurfacesReconstructed: false,
      currentPublicationValid: false,
      cutoverReady: false,
      cutoverAuthorized: false,
      nextRequiredCut: 'R1-A2.4 — Evidence + Maturity Reconciliation',
    });
  });
});
