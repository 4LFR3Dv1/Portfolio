import { createHash } from 'node:crypto';
import {
  IDENTITY_SCHEMA_VERSION,
  isRecordId,
  isRecordKind,
  isRevisionId,
  serializeRevisionMaterial,
  validateBirth,
  validateRevisionMaterial,
  validateSuccessor,
  type PayloadDigest,
  type RecordId,
  type RecordKind,
  type RecordLifecycle,
  type RecordLineageState,
  type RecordRevision,
  type RevisionId,
} from '../app/data/editorial-record-identity';
import {
  KNOWLEDGE_KINDS,
  serializeKnowledgePayload,
  validateKnowledgePayload,
  type KnowledgeKind,
  type KnowledgePayload,
  type SystemPayload,
} from '../app/data/editorial-knowledge-ontology';

export const RECORD_REGISTRY_SCHEMA_VERSION = 'editorial-record-registry/v0' as const;

export interface RegistryPayloadCodec {
  kind: RecordKind;
  validate(payload: unknown): string[];
  serialize(payload: unknown): string;
}

export interface RegistryRevisionEntry {
  revision: RecordRevision;
  payload: unknown;
}

export interface RegistryRecordEntry {
  subjectKey: string;
  subjectClass: string;
  recordId: RecordId;
  kind: RecordKind;
  provenance: {
    groundingCluster: string | null;
    identityDecision: string;
    legacyReservationUsed: boolean;
  };
  revisions: RegistryRevisionEntry[];
}

export interface RegistryBirthAssignment {
  subjectKey: string;
  name: string;
  subjectClass: 'frontier-system' | 'historical-system';
  recordId: RecordId;
  groundingCluster: string | null;
  identityDecision: string;
  legacyReservationUsed: boolean;
}

export interface RetiredPreBirthIdentity {
  recordId: RecordId;
  source: string;
  status: 'retired-pre-birth';
  reuseForbidden: true;
  reason: string;
}

export interface HeldReservation {
  recordId: RecordId;
  kind: RecordKind;
  source: string;
  reason: string;
}

export interface RecordRegistryManifest {
  schemaVersion: typeof RECORD_REGISTRY_SCHEMA_VERSION;
  contractId: string;
  status: 'materialized';
  normative: true;
  baseline: string;
  preconditions: {
    r1_0Complete: true;
    r0EffectiveComplete: true;
    r1PreComplete: true;
  };
  admission: {
    source: string;
    mode: 'explicit-r1-system-birth';
    groundingAloneAuthorizedBirth: false;
    systemSubjectsExpected: number;
    systemBirthCount: number;
    otherRecordBirthCount: number;
  };
  birthProfile: {
    kind: 'knowledge.system';
    payloadSchemaVersion: 'knowledge.system/v0';
    summary: string;
    thesis: null;
    lifecycle: 'active';
  };
  identityPool: {
    retiredPreBirth: RetiredPreBirthIdentity[];
    heldReservations: HeldReservation[];
  };
  assignments: RegistryBirthAssignment[];
  acceptance: {
    recordRegistryMaterialized: true;
    systemSubjectCoverage: number;
    systemBirthCount: number;
    frontierSystemBirthCount: number;
    historicalSystemBirthCount: number;
    legacySystemReservationsPreserved: number;
    retiredAgenticIdRejected: true;
    heldReservationCount: number;
    duplicateRecordIds: 0;
    invalidBirths: 0;
    frameworkCutoverEnacted: false;
    publicUiChanged: false;
    runtimeSemanticsChanged: false;
    r1_1Complete: false;
  };
}

export interface ReconstructedRecordLineage {
  recordId: RecordId;
  kind: RecordKind;
  state: RecordLineageState;
  headRevisionId: RevisionId | null;
  revisionIds: RevisionId[];
  errors: string[];
}

export interface ReconstructedRecordRegistry {
  records: Map<RecordId, ReconstructedRecordLineage>;
  unavailableRecordIds: Set<RecordId>;
  errors: string[];
}

function sha256Hex(value: string): string {
  return createHash('sha256').update(value, 'utf8').digest('hex');
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function unique<T>(values: readonly T[]): boolean {
  return new Set(values).size === values.length;
}

function revisionMaterial(revision: RecordRevision) {
  return {
    identitySchemaVersion: revision.identitySchemaVersion,
    recordId: revision.recordId,
    kind: revision.kind,
    generation: revision.generation,
    previousRevisionId: revision.previousRevisionId,
    lifecycle: revision.lifecycle,
    payloadDigest: revision.payloadDigest,
  };
}

export const KNOWLEDGE_REGISTRY_CODECS: readonly RegistryPayloadCodec[] = KNOWLEDGE_KINDS.map(
  (kind: KnowledgeKind) => ({
    kind,
    validate: (payload: unknown) => validateKnowledgePayload(kind, payload),
    serialize: (payload: unknown) => serializeKnowledgePayload(kind, payload as KnowledgePayload),
  }),
);

export function codecMap(codecs: readonly RegistryPayloadCodec[]): Map<RecordKind, RegistryPayloadCodec> {
  const result = new Map<RecordKind, RegistryPayloadCodec>();
  for (const codec of codecs) {
    if (result.has(codec.kind)) {
      throw new Error(`duplicate-registry-codec:${codec.kind}`);
    }
    result.set(codec.kind, codec);
  }
  return result;
}

export function computeRegistryPayloadDigest(codec: RegistryPayloadCodec, payload: unknown): PayloadDigest {
  const errors = codec.validate(payload);
  if (errors.length > 0) {
    throw new Error(`invalid-registry-payload:${codec.kind}:${errors.join(',')}`);
  }
  return `sha256_${sha256Hex(codec.serialize(payload))}` as PayloadDigest;
}

export function computeRegistryRevisionId(revision: RecordRevision): RevisionId {
  const material = revisionMaterial(revision);
  const errors = validateRevisionMaterial(material);
  if (errors.length > 0) {
    throw new Error(`invalid-revision-material:${errors.join(',')}`);
  }
  return `rev_sha256_${sha256Hex(serializeRevisionMaterial(material))}` as RevisionId;
}

export function materializeBirthRecord(
  manifest: RecordRegistryManifest,
  assignment: RegistryBirthAssignment,
  codecs: readonly RegistryPayloadCodec[] = KNOWLEDGE_REGISTRY_CODECS,
): RegistryRecordEntry {
  const codec = codecMap(codecs).get(manifest.birthProfile.kind);
  if (!codec) throw new Error(`unsupported-birth-kind:${manifest.birthProfile.kind}`);

  const payload: SystemPayload = {
    schemaVersion: manifest.birthProfile.payloadSchemaVersion,
    name: assignment.name,
    summary: manifest.birthProfile.summary,
    thesis: manifest.birthProfile.thesis,
  };

  const revision: RecordRevision = {
    identitySchemaVersion: IDENTITY_SCHEMA_VERSION,
    recordId: assignment.recordId,
    kind: manifest.birthProfile.kind,
    generation: 0,
    previousRevisionId: null,
    lifecycle: manifest.birthProfile.lifecycle as RecordLifecycle,
    payloadDigest: computeRegistryPayloadDigest(codec, payload),
    revisionId: `rev_sha256_${'0'.repeat(64)}`,
  };
  revision.revisionId = computeRegistryRevisionId(revision);

  return {
    subjectKey: assignment.subjectKey,
    subjectClass: assignment.subjectClass,
    recordId: assignment.recordId,
    kind: manifest.birthProfile.kind,
    provenance: {
      groundingCluster: assignment.groundingCluster,
      identityDecision: assignment.identityDecision,
      legacyReservationUsed: assignment.legacyReservationUsed,
    },
    revisions: [{ revision, payload }],
  };
}

export function materializeRegistryRecords(
  manifest: RecordRegistryManifest,
  codecs: readonly RegistryPayloadCodec[] = KNOWLEDGE_REGISTRY_CODECS,
): RegistryRecordEntry[] {
  return manifest.assignments.map((assignment) => materializeBirthRecord(manifest, assignment, codecs));
}

export function reconstructRecordLineage(
  record: RegistryRecordEntry,
  codecs: readonly RegistryPayloadCodec[] = KNOWLEDGE_REGISTRY_CODECS,
): ReconstructedRecordLineage {
  const errors: string[] = [];
  const codecsByKind = codecMap(codecs);
  const codec = codecsByKind.get(record.kind);

  if (!isNonEmptyString(record.subjectKey)) errors.push('subject-key');
  if (!isNonEmptyString(record.subjectClass)) errors.push('subject-class');
  if (!isRecordId(record.recordId)) errors.push('record-id');
  if (!isRecordKind(record.kind)) errors.push('record-kind');
  if (!isNonEmptyString(record.provenance.identityDecision)) errors.push('identity-decision');
  if (record.provenance.groundingCluster !== null && !isNonEmptyString(record.provenance.groundingCluster)) {
    errors.push('grounding-cluster');
  }
  if (!codec) errors.push(`unsupported-kind:${record.kind}`);
  if (record.revisions.length === 0) errors.push('missing-revision');

  const byRevisionId = new Map<RevisionId, RegistryRevisionEntry>();
  const births: RegistryRevisionEntry[] = [];

  for (const entry of record.revisions) {
    const revision = entry.revision;

    if (!isRevisionId(revision.revisionId)) {
      errors.push(`invalid-revision-id:${revision.revisionId}`);
      continue;
    }
    if (byRevisionId.has(revision.revisionId)) {
      errors.push(`duplicate-revision-id:${revision.revisionId}`);
      continue;
    }
    byRevisionId.set(revision.revisionId, entry);

    for (const materialError of validateRevisionMaterial(revisionMaterial(revision))) {
      errors.push(`${revision.revisionId}:${materialError}`);
    }
    if (revision.recordId !== record.recordId) errors.push(`${revision.revisionId}:record-id-continuity`);
    if (revision.kind !== record.kind) errors.push(`${revision.revisionId}:record-kind-continuity`);

    if (codec) {
      for (const payloadError of codec.validate(entry.payload)) {
        errors.push(`${revision.revisionId}:payload:${payloadError}`);
      }
      try {
        if (computeRegistryPayloadDigest(codec, entry.payload) !== revision.payloadDigest) {
          errors.push(`${revision.revisionId}:payload-digest-mismatch`);
        }
      } catch {
        errors.push(`${revision.revisionId}:payload-invalid`);
      }
    }

    try {
      if (computeRegistryRevisionId(revision) !== revision.revisionId) {
        errors.push(`${revision.revisionId}:revision-id-mismatch`);
      }
    } catch {
      errors.push(`${revision.revisionId}:revision-material-invalid`);
    }

    if (revision.generation === 0) births.push(entry);
  }

  if (births.length !== 1) {
    errors.push(`birth-count:${births.length}`);
  } else {
    for (const birthError of validateBirth(births[0].revision)) {
      errors.push(`${births[0].revision.revisionId}:birth:${birthError}`);
    }
  }

  const childCounts = new Map<RevisionId, number>();
  for (const entry of record.revisions) {
    const revision = entry.revision;
    if (revision.generation === 0) continue;
    if (revision.previousRevisionId === null) {
      errors.push(`${revision.revisionId}:missing-predecessor`);
      continue;
    }
    const predecessor = byRevisionId.get(revision.previousRevisionId);
    if (!predecessor) {
      errors.push(`${revision.revisionId}:unresolved-predecessor:${revision.previousRevisionId}`);
      continue;
    }
    childCounts.set(revision.previousRevisionId, (childCounts.get(revision.previousRevisionId) ?? 0) + 1);
    for (const successorError of validateSuccessor(predecessor.revision, revision)) {
      errors.push(`${revision.revisionId}:successor:${successorError}`);
    }
  }

  if (births.length === 1) {
    const birthId = births[0].revision.revisionId;
    for (const entry of record.revisions) {
      let cursor: RegistryRevisionEntry | undefined = entry;
      const seen = new Set<RevisionId>();
      let reachedBirth = false;

      while (cursor) {
        const cursorId = cursor.revision.revisionId;
        if (seen.has(cursorId)) {
          errors.push(`${entry.revision.revisionId}:lineage-cycle`);
          break;
        }
        seen.add(cursorId);
        if (cursorId === birthId) {
          reachedBirth = true;
          break;
        }
        const previous: RevisionId | null = cursor.revision.previousRevisionId;
        cursor = previous === null ? undefined : byRevisionId.get(previous);
      }
      if (!reachedBirth) errors.push(`${entry.revision.revisionId}:disconnected-lineage`);
    }
  }

  const heads = record.revisions.filter((entry) => (childCounts.get(entry.revision.revisionId) ?? 0) === 0);
  let state: RecordLineageState = 'conflict';
  let headRevisionId: RevisionId | null = null;

  if (heads.length === 1 && errors.length === 0) {
    headRevisionId = heads[0].revision.revisionId;
    state = heads[0].revision.lifecycle === 'tombstoned' ? 'tombstoned' : 'ready';
  } else if (heads.length > 1) {
    errors.push(`competing-heads:${heads.map((head) => head.revision.revisionId).sort().join(',')}`);
  } else if (heads.length === 0 && record.revisions.length > 0) {
    errors.push('no-head');
  }

  return {
    recordId: record.recordId,
    kind: record.kind,
    state,
    headRevisionId,
    revisionIds: [...byRevisionId.keys()].sort(),
    errors: [...new Set(errors)],
  };
}

export function reconstructRecordRegistry(
  manifest: RecordRegistryManifest,
  codecs: readonly RegistryPayloadCodec[] = KNOWLEDGE_REGISTRY_CODECS,
): ReconstructedRecordRegistry {
  const errors: string[] = [];
  const records = new Map<RecordId, ReconstructedRecordLineage>();
  const unavailableRecordIds = new Set<RecordId>();

  if (manifest.schemaVersion !== RECORD_REGISTRY_SCHEMA_VERSION) errors.push('registry-schema-version');
  if (manifest.status !== 'materialized') errors.push('registry-status');
  if (manifest.normative !== true) errors.push('registry-normative');
  if (!isNonEmptyString(manifest.contractId)) errors.push('registry-contract-id');
  if (!isNonEmptyString(manifest.baseline)) errors.push('registry-baseline');
  if (manifest.birthProfile.kind !== 'knowledge.system') errors.push('birth-kind');
  if (manifest.birthProfile.payloadSchemaVersion !== 'knowledge.system/v0') errors.push('birth-payload-schema');
  if (manifest.birthProfile.lifecycle !== 'active') errors.push('birth-lifecycle');

  const retiredIds = manifest.identityPool.retiredPreBirth.map((entry) => entry.recordId);
  const heldIds = manifest.identityPool.heldReservations.map((entry) => entry.recordId);

  if (!unique(retiredIds)) errors.push('duplicate-retired-id');
  if (!unique(heldIds)) errors.push('duplicate-held-id');
  if (retiredIds.some((recordId) => heldIds.includes(recordId))) errors.push('retired-held-overlap');

  for (const retired of manifest.identityPool.retiredPreBirth) {
    if (!isRecordId(retired.recordId)) errors.push(`retired-invalid-id:${retired.recordId}`);
    if (retired.status !== 'retired-pre-birth' || retired.reuseForbidden !== true) {
      errors.push(`retired-invalid-state:${retired.recordId}`);
    }
    unavailableRecordIds.add(retired.recordId);
  }

  for (const held of manifest.identityPool.heldReservations) {
    if (!isRecordId(held.recordId)) errors.push(`held-invalid-id:${held.recordId}`);
    if (!isRecordKind(held.kind)) errors.push(`held-invalid-kind:${held.recordId}`);
    unavailableRecordIds.add(held.recordId);
  }

  const subjectKeys = new Set<string>();
  const materializedRecords: RegistryRecordEntry[] = [];

  for (const assignment of manifest.assignments) {
    if (subjectKeys.has(assignment.subjectKey)) errors.push(`duplicate-subject-key:${assignment.subjectKey}`);
    subjectKeys.add(assignment.subjectKey);
    if (!isNonEmptyString(assignment.name)) errors.push(`assignment-name:${assignment.subjectKey}`);
    if (!isNonEmptyString(assignment.identityDecision)) errors.push(`assignment-decision:${assignment.subjectKey}`);
    if (!isRecordId(assignment.recordId)) {
      errors.push(`assignment-record-id:${assignment.subjectKey}`);
      continue;
    }

    let record: RegistryRecordEntry;
    try {
      record = materializeBirthRecord(manifest, assignment, codecs);
      materializedRecords.push(record);
    } catch (error) {
      errors.push(`materialize-birth:${assignment.subjectKey}:${error instanceof Error ? error.message : 'unknown'}`);
      continue;
    }

    if (records.has(record.recordId)) {
      errors.push(`duplicate-record-id:${record.recordId}`);
      continue;
    }
    if (unavailableRecordIds.has(record.recordId)) {
      errors.push(`unavailable-record-id:${record.recordId}`);
    }

    const lineage = reconstructRecordLineage(record, codecs);
    records.set(record.recordId, lineage);
    for (const lineageError of lineage.errors) {
      errors.push(`${record.recordId}:${lineageError}`);
    }
    unavailableRecordIds.add(record.recordId);
  }

  if (manifest.admission.systemBirthCount !== manifest.assignments.length) errors.push('system-birth-count');
  if (manifest.admission.otherRecordBirthCount !== 0) errors.push('other-record-birth-count');
  if (manifest.acceptance.systemBirthCount !== manifest.assignments.length) errors.push('acceptance-system-birth-count');
  if (manifest.acceptance.systemSubjectCoverage !== manifest.admission.systemSubjectsExpected) {
    errors.push('system-subject-coverage');
  }
  if (manifest.acceptance.heldReservationCount !== manifest.identityPool.heldReservations.length) {
    errors.push('held-reservation-count');
  }
  if (materializedRecords.length !== manifest.assignments.length) errors.push('materialized-birth-count');

  return { records, unavailableRecordIds, errors: [...new Set(errors)] };
}

export function currentRecordHead(
  registry: ReconstructedRecordRegistry,
  recordId: RecordId,
): RevisionId | null {
  const record = registry.records.get(recordId);
  return record?.state === 'ready' || record?.state === 'tombstoned' ? record.headRevisionId : null;
}

export function isRecordIdUnavailable(registry: ReconstructedRecordRegistry, recordId: RecordId): boolean {
  return registry.unavailableRecordIds.has(recordId);
}

export function isIdentitySchemaVersion(value: string): value is typeof IDENTITY_SCHEMA_VERSION {
  return value === IDENTITY_SCHEMA_VERSION;
}
