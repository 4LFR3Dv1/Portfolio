import { describe, expect, it } from 'vitest';
import currentEvidenceMaturityManifestJson from '../../docs/editorial/R1-A2.4-current-evidence-maturity.v0.json';
import coreEditorialSurfacesJson from '../../docs/editorial/core-editorial-surfaces.v0.json';
import { CURRENT_EVIDENCE_MATURITY_CANDIDATES } from './current-evidence-maturity-candidates';
import {
  materializeCurrentEvidenceMaturity,
  type CurrentEvidenceMaturityManifest,
} from './current-evidence-maturity-runtime';
import { materializeCurrentSystemRevisions } from './current-revision-runtime';

const manifest = currentEvidenceMaturityManifestJson as CurrentEvidenceMaturityManifest;
const materialized = materializeCurrentEvidenceMaturity();
const revisions = materializeCurrentSystemRevisions();
const coreSurfaces = coreEditorialSurfacesJson as {
  governanceAssignments: Array<{
    governanceRecordId: string;
    kind: string;
    targetRecordId: string;
    basisRevisionId: string;
    stage?: string;
  }>;
};

describe('R1-A2.4 current Evidence + Maturity reconciliation', () => {
  it('covers every generation-1 System with current-head observations and no invented formal Evidence binding', () => {
    expect(materialized.errors).toEqual([]);
    expect(revisions.errors).toEqual([]);
    expect(revisions.successors).toHaveLength(27);
    expect(CURRENT_EVIDENCE_MATURITY_CANDIDATES).toHaveLength(27);
    expect(materialized.observations).toHaveLength(48);

    const successorBySubject = new Map(revisions.successors.map((entry) => [entry.subjectKey, entry]));
    const observedSubjects = new Set(materialized.observations.map((entry) => entry.subjectKey));
    expect(observedSubjects.size).toBe(27);

    for (const observation of materialized.observations) {
      const successor = successorBySubject.get(observation.subjectKey);
      expect(successor).toBeDefined();
      const temporal = successor?.temporalBasis.find((entry) => entry.repo === observation.repository);
      expect(temporal).toBeDefined();
      expect(observation.observedHead).toBe(temporal?.observedHead);
      expect(observation.observedAt).toBe(temporal?.observedAt);
      expect(observation.censusContractId).toBe(temporal?.censusContractId);
      expect(observation.visibility).toBe(temporal?.visibility);
      expect(observation.observedHead).toMatch(/^[0-9a-f]{40}$/);
    }

    expect(manifest.materialization).toMatchObject({
      formalEvidenceRecordBirthCount: 0,
      formalEvidenceBindingBirthCount: 0,
      currentSuccessorSystemCount: 27,
      deferredSystemCount: 1,
      deferredSubjectKeys: ['transactional-support-bot'],
    });
    expect(manifest.laws.formalEvidenceBindingToSystemMinted).toBe(false);
  });

  it('preserves support, qualification and contradiction instead of flattening current evidence into a positive status', () => {
    expect(materialized.observations.filter((entry) => entry.relation === 'supports')).toHaveLength(29);
    expect(materialized.observations.filter((entry) => entry.relation === 'qualifies')).toHaveLength(16);
    expect(materialized.observations.filter((entry) => entry.relation === 'contradicts')).toHaveLength(3);

    const contradictions = materialized.observations
      .filter((entry) => entry.relation === 'contradicts')
      .map((entry) => entry.subjectKey)
      .sort();
    expect(contradictions).toEqual(['sne-fde', 'sne-radar', 'viewcounter']);

    expect(manifest.laws).toMatchObject({
      observationSourceMustResolveToCurrentTemporalBasis: true,
      observationSourceMustHaveMaterialHead: true,
      observationImpliesDisclosure: false,
      privateEvidencePublicByDefault: false,
    });
  });

  it('materializes seven new maturity births plus one successor while classifying exactly eight current heads', () => {
    expect(materialized.maturityRecords).toHaveLength(8);
    expect(new Set(materialized.maturityRecords.map((entry) => entry.governanceRecordId)).size).toBe(8);
    expect(materialized.maturityRecords.filter((entry) => entry.materializationKind === 'birth')).toHaveLength(7);
    expect(materialized.maturityRecords.filter((entry) => entry.materializationKind === 'successor')).toHaveLength(1);

    const expected = new Map([
      ['brineos', 'research'],
      ['factory', 'production'],
      ['foundry-channels', 'beta'],
      ['sne-trading', 'research'],
      ['vira', 'production'],
      ['xs-wallet', 'pre-beta'],
      ['ordm', 'research'],
      ['sne-observatorio', 'research'],
    ]);
    const successorBySubject = new Map(revisions.successors.map((entry) => [entry.subjectKey, entry]));

    for (const record of materialized.maturityRecords) {
      const successor = successorBySubject.get(record.subjectKey);
      expect(successor).toBeDefined();
      expect(record.stage).toBe(expected.get(record.subjectKey));
      expect(record.targetRef.recordId).toBe(successor?.recordId);
      expect(record.targetRef.revisionId).toBe(successor?.revision.revisionId);
      expect(record.payload.basisRef).toEqual(record.targetRef);
      expect(record.payload.targetRef.recordId).toBe(record.targetRef.recordId);
      expect(record.revision.kind).toBe('governance.maturity');
      expect(record.revision.lifecycle).toBe('active');

      if (record.subjectKey === 'xs-wallet') {
        expect(record.materializationKind).toBe('successor');
        expect(record.governanceRecordId).toBe('rec_3a926254f23e4a0c89102c3fbfe636d6');
        expect(record.revision.generation).toBe(1);
        expect(record.revision.previousRevisionId).toBe(record.previousGovernanceRevisionId);
        expect(record.previousGovernanceRevisionId).toMatch(/^rev_sha256_[0-9a-f]{64}$/);
      } else {
        expect(record.materializationKind).toBe('birth');
        expect(record.revision.generation).toBe(0);
        expect(record.revision.previousRevisionId).toBeNull();
        expect(record.previousGovernanceRevisionId).toBeNull();
      }
    }

    expect(manifest.materialization).toMatchObject({
      maturityGovernanceBirthCount: 7,
      maturityGovernanceSuccessorCount: 1,
      maturityStageCounts: {
        research: 4,
        'pre-beta': 1,
        beta: 1,
        production: 2,
      },
    });
  });

  it('leaves nineteen current Systems unclassified instead of translating implementation language into governance maturity', () => {
    const classified = materialized.maturityResolutions.filter((entry) => entry.state === 'classified');
    const unclassified = materialized.maturityResolutions.filter((entry) => entry.state === 'unclassified');
    const conflicts = materialized.maturityResolutions.filter((entry) => entry.state === 'conflict');

    expect(classified).toHaveLength(8);
    expect(unclassified).toHaveLength(19);
    expect(conflicts).toHaveLength(0);

    const bySubject = new Map(materialized.maturityResolutions.map((entry) => [entry.subjectKey, entry]));
    for (const subject of ['genesis', 'lisa', 'agenthub', 'foundry-pay', 'solana-agent', 'sne-fde', 'sne-radar', 'viewcounter']) {
      expect(bySubject.get(subject)?.state).toBe('unclassified');
      expect(bySubject.get(subject)?.stage).toBeNull();
    }

    expect(manifest.laws).toMatchObject({
      maturityInferenceFromImplementationForbidden: true,
      nonCanonicalStageTranslationForbidden: true,
      productionDoesNotProveRuntimeHealth: true,
      maturityImpliesDisclosure: false,
    });
  });

  it('continues the historical XS Wallet maturity governance identity instead of replacing it or silently inheriting its old basis', () => {
    const xs = revisions.successors.find((entry) => entry.subjectKey === 'xs-wallet');
    expect(xs).toBeDefined();

    const historicalXs = coreSurfaces.governanceAssignments.find((entry) =>
      entry.kind === 'governance.maturity' && entry.targetRecordId === xs?.recordId,
    );
    expect(historicalXs).toBeDefined();
    expect(historicalXs?.governanceRecordId).toBe('rec_3a926254f23e4a0c89102c3fbfe636d6');
    expect(historicalXs?.basisRevisionId).not.toBe(xs?.revision.revisionId);
    expect(historicalXs?.stage).toBe('pre-beta');

    const currentXs = materialized.maturityRecords.find((entry) => entry.subjectKey === 'xs-wallet');
    expect(currentXs?.governanceRecordId).toBe(historicalXs?.governanceRecordId);
    expect(currentXs?.materializationKind).toBe('successor');
    expect(currentXs?.stage).toBe('pre-beta');
    expect(currentXs?.targetRef.revisionId).toBe(xs?.revision.revisionId);
    expect(currentXs?.revision.generation).toBe(1);
    expect(currentXs?.revision.previousRevisionId).toBe(currentXs?.previousGovernanceRevisionId);
    expect(manifest.acceptance.staleMaturityInheritanceCount).toBe(0);
    expect(manifest.acceptance.maturityIdentityReplacementCount).toBe(0);
    expect(manifest.laws.historicalGovernanceSilentInheritance).toBe(false);
    expect(manifest.laws.existingMaturityGovernanceIdentityMustContinue).toBe(true);
  });

  it('accepts corrected A2.4 without changing disclosure, routes, public surfaces or production', () => {
    expect(manifest.status).toBe('complete');
    expect(manifest.acceptance).toMatchObject({
      allCurrentSuccessorsReconciled: true,
      allObservationSourcesTemporallyBound: true,
      staleMaturityInheritanceCount: 0,
      maturityIdentityReplacementCount: 0,
      maturityConflictCount: 0,
      maturityClassifiedCount: 8,
      maturityUnclassifiedCount: 19,
      publicDisclosureDecisionCount: 0,
      routeMutationCount: 0,
      publicSurfaceMutationCount: 0,
      productionMutationCount: 0,
      r1_a2_4Complete: true,
      nextRequiredAction: 'R1-A2.5 — Public Disclosure Reauthorization',
    });
  });
});
