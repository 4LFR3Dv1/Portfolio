import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

type Subject = {
  key: string;
  title: string;
  class: 'frontier-system' | 'historical-system';
  cluster: string | null;
  legacyReservation: string | null;
  identityDecision: string;
  disclosureDecision: string;
  birthAuthorized: boolean;
};

type Admission = {
  schemaVersion: string;
  status: string;
  normative: boolean;
  recordBirthCount: number;
  frontierSystemCount: number;
  historicalSystemCount: number;
  systemSubjectCount: number;
  subjects: Subject[];
  nonSystemTreatments: Array<{ key: string; cluster: string | null; treatment: string; reason: string }>;
  legacyReconciliation: {
    preserveReservationForBirth: string[];
    doNotBirth: Array<{
      legacyId: string;
      reservedRecordId: string;
      reason: string;
      reservationReuseForbidden: boolean;
      r0AmendmentRequired: boolean;
    }>;
  };
  remainingBlockers: string[];
  acceptance: {
    systemSubjectsClassified: boolean;
    systemSubjectCount: number;
    frontierSystemCount: number;
    historicalSystemCount: number;
    legacyReservationsReconciled: boolean;
    agenticLegacyReservationBirthForbidden: boolean;
    allBirthAuthorizedFalse: boolean;
    recordBirthCount: number;
    r1RuntimeStarted: boolean;
    r1PreComplete: boolean;
  };
};

function readRepoFile(path: string): string {
  return readFileSync(new URL(`../../../${path}`, import.meta.url), 'utf8');
}

const admission = JSON.parse(
  readRepoFile('docs/editorial/github-corpus-admission.v0.json'),
) as Admission;

const byKey = new Map(admission.subjects.map((subject) => [subject.key, subject]));

describe('R1-PRE.2 Corpus Admission Frontier', () => {
  it('remains non-normative and performs no Birth', () => {
    expect(admission.status).toBe('pre-birth');
    expect(admission.normative).toBe(false);
    expect(admission.recordBirthCount).toBe(0);
    expect(admission.subjects.every((subject) => subject.birthAuthorized === false)).toBe(true);
    expect(admission.acceptance.allBirthAuthorizedFalse).toBe(true);
    expect(admission.acceptance.r1RuntimeStarted).toBe(false);
    expect(admission.acceptance.r1PreComplete).toBe(false);
  });

  it('classifies exactly 28 durable System subjects into frontier and historical sets', () => {
    expect(admission.systemSubjectCount).toBe(28);
    expect(admission.subjects).toHaveLength(28);
    expect(new Set(admission.subjects.map((subject) => subject.key)).size).toBe(28);
    expect(admission.subjects.filter((subject) => subject.class === 'frontier-system')).toHaveLength(15);
    expect(admission.subjects.filter((subject) => subject.class === 'historical-system')).toHaveLength(13);
    expect(admission.frontierSystemCount).toBe(15);
    expect(admission.historicalSystemCount).toBe(13);
  });

  it('keeps Personal Identity Runtime and Lisa as separate logical subjects', () => {
    expect(byKey.get('lisa')?.identityDecision).toBe('one-system-three-repository-realizations');
    expect(byKey.get('personal-identity-runtime')?.identityDecision)
      .toBe('distinct-from-lisa-no-positive-continuity-evidence');
  });

  it('keeps Brine and BrineOS as separate logical subjects', () => {
    expect(byKey.get('brineos')?.identityDecision).toBe('distinct-from-brine');
    expect(byKey.get('brine')?.identityDecision).toBe('distinct-from-brineos');
  });

  it('keeps SNE Vault historical and distinct from SNE-OS while preserving migration provenance', () => {
    expect(byKey.get('sne-vault')?.identityDecision)
      .toBe('distinct-predecessor-system-with-material-migration-into-sne-os');
    expect(byKey.get('sne-os')?.identityDecision)
      .toBe('same-subject-as-r0-8-sne-os-reservation-distinct-from-sne-vault');
  });

  it('collapses ORDM PoC and testnet repositories into one durable historical research subject', () => {
    expect(byKey.get('ordm')).toMatchObject({
      class: 'historical-system',
      cluster: 'GCG-019',
      identityDecision: 'one-research-lineage-across-poc-and-testnet-realizations',
      birthAuthorized: false,
    });
  });

  it('preserves R0.8 reservations only where corpus grounding confirms the same subject', () => {
    const preserved = new Set(admission.legacyReconciliation.preserveReservationForBirth);
    for (const key of ['vira', 'xs-wallet', 'transactional-support-bot', 'sne-os', 'foundry-pay']) {
      const reservation = byKey.get(key)?.legacyReservation;
      expect(reservation).not.toBeNull();
      expect(preserved.has(reservation as string)).toBe(true);
    }
  });

  it('forbids Birth and reuse of the broad legacy Agentic Systems reservation', () => {
    expect(admission.legacyReconciliation.doNotBirth).toEqual([
      expect.objectContaining({
        legacyId: 'agentic-systems',
        reservedRecordId: 'rec_d5549271c541d17165c0ad8512dcdcc1',
        reservationReuseForbidden: true,
        r0AmendmentRequired: true,
      }),
    ]);
    expect(admission.acceptance.agenticLegacyReservationBirthForbidden).toBe(true);
  });

  it('does not silently turn non-System corpus into System subjects', () => {
    const nonSystemKeys = new Set(admission.nonSystemTreatments.map((entry) => entry.key));
    for (const key of [
      'genesis-cp',
      'agentic-engineering',
      'agenthub-blueprints',
      'profile',
      'solana-demos',
      'hive',
      'alfred',
      'dominipay',
      'estampai-chatbot',
      'portfolio-runtime',
    ]) {
      expect(nonSystemKeys.has(key)).toBe(true);
      expect(byKey.has(key)).toBe(false);
    }
  });

  it('keeps the remaining pre-R1 blockers explicit', () => {
    expect(admission.remainingBlockers).toEqual([
      'XS-NAME-01',
      'PRIVATE-WORK-01',
      'LEGACY-AGENTIC-AMENDMENT',
      'PUBLICATION-SELECTION-01',
      'RESEARCH-EXTRACTION-01',
    ]);
    expect(admission.acceptance.r1PreComplete).toBe(false);
  });
});
