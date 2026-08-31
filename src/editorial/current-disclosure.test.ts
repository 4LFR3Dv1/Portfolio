import { describe, expect, it } from 'vitest';
import currentDisclosureManifestJson from '../../docs/editorial/R1-A2.5-current-disclosure.v0.json';
import coreEditorialSurfacesJson from '../../docs/editorial/core-editorial-surfaces.v0.json';
import routeRuntimeJson from '../../docs/editorial/route-runtime.v0.json';
import { CURRENT_DISCLOSURE_CANDIDATES } from './current-disclosure-candidates';
import {
  materializeCurrentDisclosure,
  type CurrentDisclosureManifest,
} from './current-disclosure-runtime';
import { materializeCurrentSystemRevisions } from './current-revision-runtime';
import { materializeCurrentEvidenceMaturity } from './current-evidence-maturity-runtime';

const manifest = currentDisclosureManifestJson as CurrentDisclosureManifest;
const materialized = materializeCurrentDisclosure();
const revisions = materializeCurrentSystemRevisions();
const evidenceMaturity = materializeCurrentEvidenceMaturity();
const coreSurfaces = coreEditorialSurfacesJson as {
  governanceAssignments: Array<{
    governanceRecordId: string;
    kind: string;
    targetRecordId: string;
    basisRevisionId: string;
  }>;
  currentState: { systemsPerLanguage: number };
};
const routeRuntime = routeRuntimeJson as { admission: { targetRecordCount: number } };

function countBy<T extends string>(values: T[]): Partial<Record<T, number>> {
  return values.reduce<Partial<Record<T, number>>>((counts, value) => {
    counts[value] = (counts[value] ?? 0) + 1;
    return counts;
  }, {});
}

describe('R1-A2.5 current public disclosure reauthorization', () => {
  it('classifies every generation-1 System head explicitly and without governance conflict', () => {
    expect(revisions.errors).toEqual([]);
    expect(evidenceMaturity.errors).toEqual([]);
    expect(materialized.errors).toEqual([]);
    expect(revisions.successors).toHaveLength(27);
    expect(CURRENT_DISCLOSURE_CANDIDATES).toHaveLength(27);
    expect(materialized.disclosureRecords).toHaveLength(27);
    expect(materialized.resolutions).toHaveLength(27);
    expect(materialized.resolutions.filter((entry) => entry.state === 'classified')).toHaveLength(27);
    expect(materialized.resolutions.filter((entry) => entry.state === 'unclassified')).toHaveLength(0);
    expect(materialized.resolutions.filter((entry) => entry.state === 'conflict')).toHaveLength(0);

    const revisionBySubject = new Map(revisions.successors.map((entry) => [entry.subjectKey, entry]));
    for (const record of materialized.disclosureRecords) {
      const current = revisionBySubject.get(record.subjectKey);
      expect(current).toBeDefined();
      expect(record.targetRef.recordId).toBe(current?.recordId);
      expect(record.targetRef.revisionId).toBe(current?.revision.revisionId);
      expect(record.payload.basisRef).toEqual(record.targetRef);
      expect(record.payload.targetRef.recordId).toBe(record.targetRef.recordId);
    }
  });

  it('publishes the bounded current Record payloads without converting repository visibility into publication policy', () => {
    expect(materialized.resolutions.every((entry) => entry.visibility === 'public')).toBe(true);
    expect(materialized.resolutions.every((entry) => entry.disclosure === 'full')).toBe(true);

    const bySubject = new Map(materialized.resolutions.map((entry) => [entry.subjectKey, entry]));
    expect(bySubject.get('genesis')).toMatchObject({
      state: 'classified',
      visibility: 'public',
      disclosure: 'full',
      source: 'private',
      evidence: 'private',
    });
    expect(bySubject.get('lisa')).toMatchObject({
      visibility: 'public',
      source: 'private',
      evidence: 'private',
    });
    expect(bySubject.get('sne-os')).toMatchObject({
      visibility: 'public',
      source: 'private',
      evidence: 'private',
    });
    expect(bySubject.get('sne-radar')).toMatchObject({
      visibility: 'public',
      source: 'partial',
      evidence: 'public',
    });
    expect(bySubject.get('ordm')).toMatchObject({
      visibility: 'public',
      source: 'partial',
      evidence: 'partial',
    });

    expect(manifest.laws).toMatchObject({
      repositoryVisibilityDoesNotDetermineRecordVisibility: true,
      privateSourceMayRemainPrivateBehindPublicRecord: true,
      publicRecordDoesNotAuthorizeSourceDisclosure: true,
    });
  });

  it('derives source and evidence availability from the admitted temporal observation rather than hand-authored disclosure copy', () => {
    const classified = materialized.resolutions.filter((entry) => entry.state === 'classified');
    expect(countBy(classified.map((entry) => entry.source!))).toEqual({
      public: 12,
      partial: 2,
      private: 13,
    });
    expect(countBy(classified.map((entry) => entry.evidence!))).toEqual({
      public: 13,
      partial: 1,
      private: 13,
    });
    expect(manifest.materialization.sourceAvailabilityCounts).toEqual({ public: 12, partial: 2, private: 13 });
    expect(manifest.materialization.evidenceAvailabilityCounts).toEqual({ public: 13, partial: 1, private: 13 });
  });

  it('continues all four historical disclosure governance identities that target current successor Systems', () => {
    const expected = new Map([
      ['foundry-pay', 'rec_31d32647a6fc43c1b1bc5257aefaf367'],
      ['sne-os', 'rec_2821df1a24244689ab76bb5fb697018b'],
      ['vira', 'rec_fe675b13970843099b802b2b6d03daf1'],
      ['xs-wallet', 'rec_5bc3c1113cfe4c14b79aaa63f2515d79'],
    ]);

    const successors = materialized.disclosureRecords.filter((entry) => entry.materializationKind === 'successor');
    const births = materialized.disclosureRecords.filter((entry) => entry.materializationKind === 'birth');
    expect(successors).toHaveLength(4);
    expect(births).toHaveLength(23);

    for (const record of successors) {
      expect(record.governanceRecordId).toBe(expected.get(record.subjectKey));
      expect(record.revision.generation).toBe(1);
      expect(record.revision.previousRevisionId).toBe(record.previousGovernanceRevisionId);
      expect(record.previousGovernanceRevisionId).not.toBeNull();
      const historical = coreSurfaces.governanceAssignments.find((entry) =>
        entry.kind === 'governance.disclosure'
        && entry.governanceRecordId === record.governanceRecordId,
      );
      expect(historical?.targetRecordId).toBe(record.targetRef.recordId);
      expect(historical?.basisRevisionId).not.toBe(record.targetRef.revisionId);
    }

    for (const record of births) {
      expect(record.revision.generation).toBe(0);
      expect(record.revision.previousRevisionId).toBeNull();
      expect(record.previousGovernanceRevisionId).toBeNull();
    }

    expect(manifest.materialization).toMatchObject({
      disclosureGovernanceBirthCount: 23,
      disclosureGovernanceSuccessorCount: 4,
    });
    expect(manifest.acceptance.disclosureIdentityReplacementCount).toBe(0);
  });

  it('does not silently reauthorize the deferred Transactional Support Bot or inherit its historical disclosure into current state', () => {
    const transactionalHistorical = coreSurfaces.governanceAssignments.find((entry) =>
      entry.kind === 'governance.disclosure'
      && entry.targetRecordId === 'rec_c5a75fd5ecae0565aaa0c96f0ad53227',
    );
    expect(transactionalHistorical?.governanceRecordId).toBe('rec_d69c49de2cd2457094a71f03fa189a52');
    expect(CURRENT_DISCLOSURE_CANDIDATES.some((entry) => entry.subjectKey === 'transactional-support-bot')).toBe(false);
    expect(materialized.disclosureRecords.some((entry) => entry.targetRef.recordId === transactionalHistorical?.targetRecordId)).toBe(false);
    expect(manifest.materialization.historicalDeferredDisclosureCount).toBe(1);
    expect(manifest.laws.deferredHistoricalRecordDoesNotReceiveCurrentDisclosureByInference).toBe(true);
  });

  it('keeps disclosure independent from maturity, including Systems whose maturity remains unclassified', () => {
    const maturityBySubject = new Map(evidenceMaturity.maturityResolutions.map((entry) => [entry.subjectKey, entry]));
    const disclosureBySubject = new Map(materialized.resolutions.map((entry) => [entry.subjectKey, entry]));
    for (const subject of ['genesis', 'lisa', 'agenthub', 'sne-fde', 'sne-radar', 'viewcounter']) {
      expect(maturityBySubject.get(subject)?.state).toBe('unclassified');
      expect(disclosureBySubject.get(subject)).toMatchObject({ state: 'classified', visibility: 'public', disclosure: 'full' });
    }
    expect(manifest.laws.maturityDoesNotDetermineDisclosure).toBe(true);
    expect(manifest.acceptance.maturityDerivedDisclosureCount).toBe(0);
  });

  it('does not mutate routes, semantic surfaces or production while A2.5 is awaiting CI', () => {
    expect(routeRuntime.admission.targetRecordCount).toBe(5);
    expect(coreSurfaces.currentState.systemsPerLanguage).toBe(3);
    expect(manifest.status).toBe('materialized-awaiting-ci');
    expect(manifest.acceptance).toMatchObject({
      allCurrentSuccessorsClassified: true,
      disclosureConflictCount: 0,
      disclosureUnclassifiedCount: 0,
      disclosureIdentityReplacementCount: 0,
      privateSourcePromotedToPublicCount: 0,
      maturityDerivedDisclosureCount: 0,
      routeMutationCount: 0,
      publicSurfaceMutationCount: 0,
      productionMutationCount: 0,
      r1_a2_5Complete: false,
    });
    expect(manifest.acceptance.nextRequiredAction).toContain('CI must reconstruct');
  });
});
