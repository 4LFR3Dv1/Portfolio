import {
  isValidPinnedRecordRef,
  isValidRecordRef,
  type PinnedRecordRef,
  type RecordId,
  type RecordLifecycle,
  type RecordRef,
  type RevisionId,
} from './editorial-record-identity';
import { EVIDENCE_KINDS } from './editorial-evidence-contract';
import { KNOWLEDGE_KINDS } from './editorial-knowledge-ontology';
import { REPRESENTATION_KINDS } from './editorial-publication-architecture';

export const GOVERNANCE_KINDS = ['governance.disclosure', 'governance.maturity'] as const;
export type GovernanceKind = (typeof GOVERNANCE_KINDS)[number];

export const RECORD_VISIBILITY = ['public', 'private'] as const;
export type RecordVisibility = (typeof RECORD_VISIBILITY)[number];

export const SOURCE_AVAILABILITY = ['public', 'partial', 'private', 'not-applicable', 'unknown'] as const;
export type SourceAvailability = (typeof SOURCE_AVAILABILITY)[number];

export const EVIDENCE_AVAILABILITY = ['public', 'partial', 'private', 'none', 'unknown'] as const;
export type EvidenceAvailability = (typeof EVIDENCE_AVAILABILITY)[number];

export const DISCLOSURE_MODES = ['full', 'sanitized', 'metadata-only', 'withheld'] as const;
export type DisclosureMode = (typeof DISCLOSURE_MODES)[number];

export const MATURITY_STAGES = [
  'concept',
  'research',
  'prototype',
  'pre-beta',
  'beta',
  'production',
  'completed',
] as const;
export type MaturityStage = (typeof MATURITY_STAGES)[number];

export interface VisibilityAxes {
  record: RecordVisibility;
  source: SourceAvailability;
  evidence: EvidenceAvailability;
}

export interface DisclosurePayload {
  schemaVersion: 'governance.disclosure/v0';
  targetRef: RecordRef;
  basisRef: PinnedRecordRef;
  visibility: VisibilityAxes;
  disclosure: DisclosureMode;
  rationale: string;
}

export interface MaturityPayload {
  schemaVersion: 'governance.maturity/v0';
  targetRef: RecordRef;
  basisRef: PinnedRecordRef;
  stage: MaturityStage;
  rationale: string;
}

export type GovernancePayload = DisclosurePayload | MaturityPayload;

export interface GovernanceRevisionIndexEntry {
  recordId: RecordId;
  revisionId: RevisionId;
  kind: string;
  lifecycle: RecordLifecycle;
}

export interface CurrentGovernanceEntry<T extends GovernancePayload = GovernancePayload> {
  governanceRecordId: RecordId;
  lifecycle: RecordLifecycle;
  payload: T;
}

export type GovernanceProjection<T extends GovernancePayload> =
  | { state: 'unclassified' }
  | { state: 'classified'; payload: T; governanceRecordId: RecordId }
  | { state: 'conflict' };

export const GOVERNABLE_KINDS = [
  ...KNOWLEDGE_KINDS,
  ...EVIDENCE_KINDS,
  ...REPRESENTATION_KINDS,
] as const;

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function hasExactFields(value: object, expected: readonly string[]): boolean {
  const actual = Object.keys(value).sort();
  const wanted = [...expected].sort();
  return actual.length === wanted.length && actual.every((field, index) => field === wanted[index]);
}

function isExactRecordRef(value: unknown): value is RecordRef {
  return typeof value === 'object'
    && value !== null
    && !Array.isArray(value)
    && hasExactFields(value, ['type', 'recordId'])
    && isValidRecordRef(value as RecordRef);
}

function isExactPinnedRef(value: unknown): value is PinnedRecordRef {
  return typeof value === 'object'
    && value !== null
    && !Array.isArray(value)
    && hasExactFields(value, ['type', 'recordId', 'revisionId'])
    && isValidPinnedRecordRef(value as PinnedRecordRef);
}

function sameLogicalTarget(targetRef: RecordRef, basisRef: PinnedRecordRef): boolean {
  return targetRef.recordId === basisRef.recordId;
}

function isCountedLifecycle(lifecycle: RecordLifecycle): boolean {
  return lifecycle === 'active' || lifecycle === 'archived';
}

export function validateDisclosurePayload(payload: unknown): string[] {
  const errors: string[] = [];
  if (typeof payload !== 'object' || payload === null || Array.isArray(payload)) return ['payload-object'];

  if (!hasExactFields(payload, [
    'schemaVersion',
    'targetRef',
    'basisRef',
    'visibility',
    'disclosure',
    'rationale',
  ])) {
    errors.push('payload-fields');
  }

  const candidate = payload as Record<string, unknown>;
  if (candidate.schemaVersion !== 'governance.disclosure/v0') errors.push('schema-version');
  if (!isExactRecordRef(candidate.targetRef)) errors.push('target-ref');
  if (!isExactPinnedRef(candidate.basisRef)) errors.push('basis-ref');
  if (
    isExactRecordRef(candidate.targetRef)
    && isExactPinnedRef(candidate.basisRef)
    && !sameLogicalTarget(candidate.targetRef, candidate.basisRef)
  ) {
    errors.push('basis-target-mismatch');
  }

  if (typeof candidate.visibility !== 'object' || candidate.visibility === null || Array.isArray(candidate.visibility)) {
    errors.push('visibility');
  } else {
    const visibility = candidate.visibility as Record<string, unknown>;
    if (!hasExactFields(visibility, ['record', 'source', 'evidence'])) errors.push('visibility-fields');
    if (!(RECORD_VISIBILITY as readonly unknown[]).includes(visibility.record)) errors.push('record-visibility');
    if (!(SOURCE_AVAILABILITY as readonly unknown[]).includes(visibility.source)) errors.push('source-availability');
    if (!(EVIDENCE_AVAILABILITY as readonly unknown[]).includes(visibility.evidence)) errors.push('evidence-availability');
  }

  if (!(DISCLOSURE_MODES as readonly unknown[]).includes(candidate.disclosure)) errors.push('disclosure-mode');
  if (!isNonEmptyString(candidate.rationale)) errors.push('rationale');

  if (
    typeof candidate.visibility === 'object'
    && candidate.visibility !== null
    && !Array.isArray(candidate.visibility)
    && (RECORD_VISIBILITY as readonly unknown[]).includes((candidate.visibility as Record<string, unknown>).record)
    && (DISCLOSURE_MODES as readonly unknown[]).includes(candidate.disclosure)
  ) {
    const visibility = candidate.visibility as VisibilityAxes;
    const disclosure = candidate.disclosure as DisclosureMode;
    if (visibility.record === 'private' && disclosure !== 'withheld') errors.push('private-requires-withheld');
    if (visibility.record === 'public' && disclosure === 'withheld') errors.push('public-cannot-be-withheld');
  }

  return [...new Set(errors)];
}

export function validateMaturityPayload(payload: unknown): string[] {
  const errors: string[] = [];
  if (typeof payload !== 'object' || payload === null || Array.isArray(payload)) return ['payload-object'];

  if (!hasExactFields(payload, ['schemaVersion', 'targetRef', 'basisRef', 'stage', 'rationale'])) {
    errors.push('payload-fields');
  }

  const candidate = payload as Record<string, unknown>;
  if (candidate.schemaVersion !== 'governance.maturity/v0') errors.push('schema-version');
  if (!isExactRecordRef(candidate.targetRef)) errors.push('target-ref');
  if (!isExactPinnedRef(candidate.basisRef)) errors.push('basis-ref');
  if (
    isExactRecordRef(candidate.targetRef)
    && isExactPinnedRef(candidate.basisRef)
    && !sameLogicalTarget(candidate.targetRef, candidate.basisRef)
  ) {
    errors.push('basis-target-mismatch');
  }
  if (!(MATURITY_STAGES as readonly unknown[]).includes(candidate.stage)) errors.push('maturity-stage');
  if (!isNonEmptyString(candidate.rationale)) errors.push('rationale');

  return [...new Set(errors)];
}

export function validateGovernancePayload(kind: GovernanceKind, payload: unknown): string[] {
  return kind === 'governance.disclosure'
    ? validateDisclosurePayload(payload)
    : validateMaturityPayload(payload);
}

export function validateDisclosureContinuity(current: DisclosurePayload, next: DisclosurePayload): string[] {
  return current.targetRef.recordId === next.targetRef.recordId ? [] : ['target-ref-continuity'];
}

export function validateMaturityContinuity(current: MaturityPayload, next: MaturityPayload): string[] {
  return current.targetRef.recordId === next.targetRef.recordId ? [] : ['target-ref-continuity'];
}

export function validateGovernanceResolution(
  kind: GovernanceKind,
  payload: GovernancePayload,
  index: readonly GovernanceRevisionIndexEntry[],
): string[] {
  const errors = validateGovernancePayload(kind, payload);
  if (errors.length > 0) return errors;

  const basis = index.find(
    (entry) => entry.recordId === payload.basisRef.recordId && entry.revisionId === payload.basisRef.revisionId,
  );

  if (!basis) {
    errors.push('basis-ref-unresolved');
    return errors;
  }

  if (kind === 'governance.disclosure') {
    if (!(GOVERNABLE_KINDS as readonly string[]).includes(basis.kind)) {
      errors.push(`target-kind:${basis.kind}`);
    }
  } else if (basis.kind !== 'knowledge.system') {
    errors.push(`maturity-target-kind:${basis.kind}`);
  }

  return errors;
}

function samePinnedRef(left: PinnedRecordRef, right: PinnedRecordRef): boolean {
  return left.recordId === right.recordId && left.revisionId === right.revisionId;
}

export function deriveGovernanceProjection<T extends GovernancePayload>(
  targetHeadRef: PinnedRecordRef,
  entries: readonly CurrentGovernanceEntry<T>[],
): GovernanceProjection<T> {
  const matching = entries.filter((entry) =>
    isCountedLifecycle(entry.lifecycle)
    && entry.payload.targetRef.recordId === targetHeadRef.recordId
    && samePinnedRef(entry.payload.basisRef, targetHeadRef),
  );

  if (matching.length === 0) return { state: 'unclassified' };
  if (matching.length > 1) return { state: 'conflict' };

  return {
    state: 'classified',
    payload: matching[0].payload,
    governanceRecordId: matching[0].governanceRecordId,
  };
}

export function mayProjectPublicly(
  targetLifecycle: RecordLifecycle,
  disclosure: GovernanceProjection<DisclosurePayload>,
): boolean {
  if (!isCountedLifecycle(targetLifecycle)) return false;
  if (disclosure.state !== 'classified') return false;
  return disclosure.payload.visibility.record === 'public'
    && disclosure.payload.disclosure !== 'withheld';
}

type CanonicalJson = null | boolean | number | string | CanonicalJson[] | { [key: string]: CanonicalJson };

function canonicalJson(value: CanonicalJson): string {
  if (
    value === null
    || typeof value === 'boolean'
    || typeof value === 'number'
    || typeof value === 'string'
  ) {
    if (typeof value === 'number' && !Number.isFinite(value)) throw new Error('non-finite-number');
    return JSON.stringify(value) as string;
  }
  if (Array.isArray(value)) return `[${value.map((item) => canonicalJson(item)).join(',')}]`;
  const keys = Object.keys(value).sort();
  return `{${keys.map((key) => `${JSON.stringify(key)}:${canonicalJson(value[key])}`).join(',')}}`;
}

export function serializeGovernancePayload(kind: GovernanceKind, payload: GovernancePayload): string {
  const errors = validateGovernancePayload(kind, payload);
  if (errors.length > 0) throw new Error(`invalid-governance-payload:${errors.join(',')}`);
  return `${canonicalJson(payload as unknown as CanonicalJson)}\n`;
}
