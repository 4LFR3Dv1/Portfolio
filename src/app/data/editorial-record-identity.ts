export const IDENTITY_SCHEMA_VERSION = 'editorial-record-identity/v0' as const;

export const RECORD_ID_PATTERN = /^rec_[0-9a-f]{32}$/;
export const RECORD_KIND_PATTERN = /^[a-z][a-z0-9]*(?:\.[a-z][a-z0-9-]*)+$/;
export const PAYLOAD_DIGEST_PATTERN = /^sha256_[0-9a-f]{64}$/;
export const REVISION_ID_PATTERN = /^rev_sha256_[0-9a-f]{64}$/;

export type RecordId = `rec_${string}`;
export type RecordKind = string;
export type PayloadDigest = `sha256_${string}`;
export type RevisionId = `rev_sha256_${string}`;

export type RecordLifecycle = 'active' | 'archived' | 'withdrawn' | 'tombstoned';
export type RecordLineageState = 'ready' | 'conflict' | 'tombstoned';

export interface RecordRevisionMaterial {
  identitySchemaVersion: typeof IDENTITY_SCHEMA_VERSION;
  recordId: RecordId;
  kind: RecordKind;
  generation: number;
  previousRevisionId: RevisionId | null;
  lifecycle: RecordLifecycle;
  payloadDigest: PayloadDigest;
}

export interface RecordRevision extends RecordRevisionMaterial {
  revisionId: RevisionId;
}

export interface RecordRef {
  type: 'record';
  recordId: RecordId;
}

export interface PinnedRecordRef {
  type: 'pinned-record';
  recordId: RecordId;
  revisionId: RevisionId;
}

export interface RecordLocatorBinding {
  locator: string;
  recordId: RecordId;
  mode: 'canonical' | 'alias' | 'retired';
}

export interface RecordConflict {
  recordId: RecordId;
  baseRevisionId: RevisionId;
  candidateRevisionIds: RevisionId[];
}

export const RECORD_LIFECYCLES: readonly RecordLifecycle[] = [
  'active',
  'archived',
  'withdrawn',
  'tombstoned',
];

const NON_TERMINAL_LIFECYCLES = new Set<RecordLifecycle>([
  'active',
  'archived',
  'withdrawn',
]);

export function isRecordId(value: string): value is RecordId {
  return RECORD_ID_PATTERN.test(value);
}

export function isRecordKind(value: string): boolean {
  return RECORD_KIND_PATTERN.test(value);
}

export function isPayloadDigest(value: string): value is PayloadDigest {
  return PAYLOAD_DIGEST_PATTERN.test(value);
}

export function isRevisionId(value: string): value is RevisionId {
  return REVISION_ID_PATTERN.test(value);
}

export function isRecordLifecycle(value: string): value is RecordLifecycle {
  return (RECORD_LIFECYCLES as readonly string[]).includes(value);
}

export function serializeRevisionMaterial(material: RecordRevisionMaterial): string {
  return [
    `identitySchemaVersion=${material.identitySchemaVersion}`,
    `recordId=${material.recordId}`,
    `kind=${material.kind}`,
    `generation=${material.generation}`,
    `previousRevisionId=${material.previousRevisionId ?? '-'}`,
    `lifecycle=${material.lifecycle}`,
    `payloadDigest=${material.payloadDigest}`,
    '',
  ].join('\n');
}

export function validateRevisionMaterial(material: RecordRevisionMaterial): string[] {
  const errors: string[] = [];

  if (material.identitySchemaVersion !== IDENTITY_SCHEMA_VERSION) {
    errors.push('identity-schema-version');
  }
  if (!isRecordId(material.recordId)) {
    errors.push('record-id');
  }
  if (!isRecordKind(material.kind)) {
    errors.push('record-kind');
  }
  if (!Number.isSafeInteger(material.generation) || material.generation < 0) {
    errors.push('generation');
  }
  if (material.previousRevisionId !== null && !isRevisionId(material.previousRevisionId)) {
    errors.push('previous-revision-id');
  }
  if (!isRecordLifecycle(material.lifecycle)) {
    errors.push('lifecycle');
  }
  if (!isPayloadDigest(material.payloadDigest)) {
    errors.push('payload-digest');
  }

  return errors;
}

export function validateBirth(revision: RecordRevision): string[] {
  const errors = validateRevisionMaterial(revision);

  if (!isRevisionId(revision.revisionId)) {
    errors.push('revision-id');
  }
  if (revision.generation !== 0) {
    errors.push('birth-generation');
  }
  if (revision.previousRevisionId !== null) {
    errors.push('birth-predecessor');
  }
  if (revision.lifecycle === 'tombstoned') {
    errors.push('birth-tombstone');
  }

  return errors;
}

export function isAllowedLifecycleTransition(
  from: RecordLifecycle,
  to: RecordLifecycle,
): boolean {
  if (from === 'tombstoned') {
    return false;
  }
  return NON_TERMINAL_LIFECYCLES.has(from) && RECORD_LIFECYCLES.includes(to);
}

export function validateSuccessor(current: RecordRevision, next: RecordRevision): string[] {
  const errors = validateRevisionMaterial(next);

  if (!isRevisionId(next.revisionId)) {
    errors.push('revision-id');
  }
  if (current.lifecycle === 'tombstoned') {
    errors.push('successor-after-tombstone');
  }
  if (next.recordId !== current.recordId) {
    errors.push('record-id-continuity');
  }
  if (next.kind !== current.kind) {
    errors.push('record-kind-continuity');
  }
  if (next.generation !== current.generation + 1) {
    errors.push('generation-continuity');
  }
  if (next.previousRevisionId !== current.revisionId) {
    errors.push('predecessor-continuity');
  }
  if (!isAllowedLifecycleTransition(current.lifecycle, next.lifecycle)) {
    errors.push('lifecycle-transition');
  }

  return errors;
}

export function mayReuseRecordId(admittedRecordIds: ReadonlySet<string>, candidate: string): boolean {
  return isRecordId(candidate) && !admittedRecordIds.has(candidate);
}

export function mayBindHistoricalLocator(
  existing: RecordLocatorBinding | undefined,
  requestedRecordId: RecordId,
): boolean {
  return existing === undefined || existing.recordId === requestedRecordId;
}

export function isValidRecordRef(ref: RecordRef): boolean {
  return ref.type === 'record' && isRecordId(ref.recordId);
}

export function isValidPinnedRecordRef(ref: PinnedRecordRef): boolean {
  return ref.type === 'pinned-record' && isRecordId(ref.recordId) && isRevisionId(ref.revisionId);
}
