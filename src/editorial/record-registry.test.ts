import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import type { RecordRevision } from '../app/data/editorial-record-identity';
import type { SystemPayload } from '../app/data/editorial-knowledge-ontology';
import {
  KNOWLEDGE_REGISTRY_CODECS,
  computeRegistryPayloadDigest,
  computeRegistryRevisionId,
  currentRecordHead,
  isRecordIdUnavailable,
  materializeRegistryRecords,
  reconstructRecordLineage,
  reconstructRecordRegistry,
  type RecordRegistryManifest,
  type RegistryRecordEntry,
} from './record-registry';

interface CorpusAdmissionSubject {
  key: string;
  title: string;
  class: 'frontier-system' | 'historical-system';
  legacyReservation: string | null;
  birthAuthorized: false;
}

interface CorpusAdmission {
  status: 'pre-birth';
  recordBirthCount: 0;
  systemSubjectCount: 28;
  frontierSystemCount: 15;
  historicalSystemCount: 13;
  subjects: CorpusAdmissionSubject[];
  legacyReconciliation: {
    preserveReservationForBirth: string[];
    doNotBirth: Array<{
      reservedRecordId: string;
      reservationReuseForbidden: true;
    }>;
  };
}

interface R10Completion {
  acceptance: {
    r1_0Complete: true;
    recordBirthCount: 0;
    nextRequiredCut: 'R1.1 — Record Registry';
    [key: string]: unknown;
  };
}

interface R0A1Completion {
  effectiveState: {
    retiredReservation: string;
    retiredReservationWasBorn: false;
    retiredReservationReuseForbidden: true;
  };
}

function readRepoFile(path: string): string {
  return readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
}

const manifest = JSON.parse(
  readRepoFile('docs/editorial/record-registry.v0.json'),
) as RecordRegistryManifest;
const admission = JSON.parse(
  readRepoFile('docs/editorial/github-corpus-admission.v0.json'),
) as CorpusAdmission;
const runtimeCompletion = JSON.parse(
  readRepoFile('docs/editorial/R1.0-completion.v0.json'),
) as R10Completion;
const amendmentCompletion = JSON.parse(
  readRepoFile('docs/editorial/R0-A1-completion.v0.json'),
) as R0A1Completion;

const codecsByKind = new Map(KNOWLEDGE_REGISTRY_CODECS.map((codec) => [codec.kind, codec]));

function cloneManifest(): RecordRegistryManifest {
  return JSON.parse(JSON.stringify(manifest)) as RecordRegistryManifest;
}

function syntheticSuccessor(
  source: RegistryRecordEntry,
  payload: SystemPayload,
): RegistryRecordEntry['revisions'][number] {
  const current = source.revisions[0].revision;
  const codec = codecsByKind.get(source.kind);
  if (!codec) throw new Error(`missing-codec:${source.kind}`);

  const revision: RecordRevision = {
    identitySchemaVersion: current.identitySchemaVersion,
    recordId: current.recordId,
    kind: current.kind,
    generation: current.generation + 1,
    previousRevisionId: current.revisionId,
    lifecycle: 'active',
    payloadDigest: computeRegistryPayloadDigest(codec, payload),
    revisionId: `rev_sha256_${'0'.repeat(64)}`,
  };
  revision.revisionId = computeRegistryRevisionId(revision);
  return { revision, payload };
}

describe('R1.1 Record Registry', () => {
  it('begins only after R1.0 and converts the 28 grounded System subjects into explicit Births', () => {
    expect(runtimeCompletion.acceptance).toMatchObject({
      r1_0Complete: true,
      recordBirthCount: 0,
      nextRequiredCut: 'R1.1 — Record Registry',
    });
    expect(admission.status).toBe('pre-birth');
    expect(admission.recordBirthCount).toBe(0);
    expect(admission.subjects.every((subject) => subject.birthAuthorized === false)).toBe(true);

    expect(manifest.admission.mode).toBe('explicit-r1-system-birth');
    expect(manifest.admission.groundingAloneAuthorizedBirth).toBe(false);
    expect(manifest.assignments).toHaveLength(28);
    expect(manifest.acceptance.systemBirthCount).toBe(28);
    expect(manifest.acceptance.frontierSystemBirthCount).toBe(15);
    expect(manifest.acceptance.historicalSystemBirthCount).toBe(13);
  });

  it('covers exactly the grounded System subject set without turning repositories or non-System treatments into Records', () => {
    const grounded = [...admission.subjects.map((subject) => subject.key)].sort();
    const born = [...manifest.assignments.map((assignment) => assignment.subjectKey)].sort();
    expect(born).toEqual(grounded);

    const byKey = new Map(manifest.assignments.map((assignment) => [assignment.subjectKey, assignment]));
    for (const subject of admission.subjects) {
      const assignment = byKey.get(subject.key);
      expect(assignment).toBeDefined();
      expect(assignment?.subjectClass).toBe(subject.class);
      expect(assignment?.name).toBe(subject.title);
    }
  });

  it('derives every generation-zero payload digest and RevisionId deterministically', () => {
    const registry = reconstructRecordRegistry(manifest);
    const records = materializeRegistryRecords(manifest);
    expect(registry.errors).toEqual([]);
    expect(registry.records.size).toBe(28);
    expect(records).toHaveLength(28);

    for (const record of records) {
      const lineage = registry.records.get(record.recordId);
      expect(lineage?.state).toBe('ready');
      expect(lineage?.errors).toEqual([]);
      expect(currentRecordHead(registry, record.recordId)).toBe(record.revisions[0].revision.revisionId);

      const codec = codecsByKind.get(record.kind);
      expect(codec).toBeDefined();
      if (!codec) continue;
      expect(computeRegistryPayloadDigest(codec, record.revisions[0].payload)).toBe(
        record.revisions[0].revision.payloadDigest,
      );
      expect(computeRegistryRevisionId(record.revisions[0].revision)).toBe(
        record.revisions[0].revision.revisionId,
      );
      expect(record.revisions[0].revision.generation).toBe(0);
      expect(record.revisions[0].revision.previousRevisionId).toBeNull();
    }
  });

  it('preserves the five compatible R0.8 System reservations exactly at Birth', () => {
    const expectedReservations = [...admission.legacyReconciliation.preserveReservationForBirth].sort();
    expect(expectedReservations).toHaveLength(5);

    const bornFromLegacyReservations = manifest.assignments
      .filter((assignment) => assignment.legacyReservationUsed)
      .map((assignment) => assignment.recordId)
      .sort();

    expect(bornFromLegacyReservations).toEqual(expectedReservations);
  });

  it('burns the retired Agentic Systems identifier and keeps unbirthed representation reservations unavailable', () => {
    const registry = reconstructRecordRegistry(manifest);
    const retired = amendmentCompletion.effectiveState.retiredReservation as `rec_${string}`;

    expect(amendmentCompletion.effectiveState.retiredReservationWasBorn).toBe(false);
    expect(amendmentCompletion.effectiveState.retiredReservationReuseForbidden).toBe(true);
    expect(manifest.assignments.some((assignment) => assignment.recordId === retired)).toBe(false);
    expect(isRecordIdUnavailable(registry, retired)).toBe(true);

    expect(manifest.identityPool.heldReservations).toHaveLength(8);
    for (const held of manifest.identityPool.heldReservations) {
      expect(manifest.assignments.some((assignment) => assignment.recordId === held.recordId)).toBe(false);
      expect(isRecordIdUnavailable(registry, held.recordId)).toBe(true);
    }
  });

  it('fails closed when materialized payload bytes drift from their admitted revision digest', () => {
    const first = structuredClone(materializeRegistryRecords(manifest)[0]);
    const payload = first.revisions[0].payload as SystemPayload;
    first.revisions[0].payload = { ...payload, summary: `${payload.summary} changed` };

    const lineage = reconstructRecordLineage(first);
    expect(lineage.state).toBe('conflict');
    expect(lineage.errors).toContain(`${first.revisions[0].revision.revisionId}:payload-digest-mismatch`);
  });

  it('preserves competing valid successors as a conflict rather than choosing latest-wins', () => {
    const source = structuredClone(materializeRegistryRecords(manifest)[0]);
    const basePayload = source.revisions[0].payload as SystemPayload;
    const successorA = syntheticSuccessor(source, { ...basePayload, summary: 'Synthetic successor A.' });
    const successorB = syntheticSuccessor(source, { ...basePayload, summary: 'Synthetic successor B.' });
    source.revisions.push(successorA, successorB);

    const lineage = reconstructRecordLineage(source);
    expect(lineage.state).toBe('conflict');
    expect(lineage.headRevisionId).toBeNull();
    expect(lineage.errors.some((error) => error.startsWith('competing-heads:'))).toBe(true);
  });

  it('rejects attempted Birth into an unavailable retired identity', () => {
    const corrupted = cloneManifest();
    const retired = manifest.identityPool.retiredPreBirth[0].recordId;
    corrupted.assignments[0].recordId = retired;

    const registry = reconstructRecordRegistry(corrupted);
    expect(registry.errors).toContain(`unavailable-record-id:${retired}`);
  });

  it('does not perform governance, routing, language realization, projection or framework cutover in R1.1', () => {
    expect(manifest.admission.otherRecordBirthCount).toBe(0);
    expect(manifest.acceptance.frameworkCutoverEnacted).toBe(false);
    expect(manifest.acceptance.publicUiChanged).toBe(false);
    expect(manifest.acceptance.runtimeSemanticsChanged).toBe(false);
    expect(manifest.acceptance.r1_1Complete).toBe(false);
  });
});
