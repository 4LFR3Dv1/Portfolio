import {
  isValidPinnedRecordRef,
  isValidRecordRef,
  type PinnedRecordRef,
  type RecordId,
  type RecordRef,
  type RevisionId,
} from './editorial-record-identity';

export const REPRESENTATION_KINDS = ['representation.publication', 'representation.architecture'] as const;
export type RepresentationKind = (typeof REPRESENTATION_KINDS)[number];

export const PUBLICATION_TYPES = ['essay', 'research-note', 'experiment-report', 'system-note', 'technical-paper'] as const;
export type PublicationType = (typeof PUBLICATION_TYPES)[number];

export const ARCHITECTURE_TYPES = ['system', 'flow', 'protocol', 'boundary', 'conceptual'] as const;
export type ArchitectureType = (typeof ARCHITECTURE_TYPES)[number];

export interface PublicationPayload {
  schemaVersion: 'representation.publication/v0';
  publicationType: PublicationType;
  title: string;
  summary: string;
  body: string;
  subjectRefs: RecordRef[];
  basisRefs: PinnedRecordRef[];
  claimRefs: RecordRef[];
}

export interface ArchitectureComponent {
  id: string;
  label: string;
  responsibility: string;
  subjectRef: RecordRef | null;
}

export interface ArchitectureRelation {
  from: string;
  to: string;
  label: string;
}

export interface ArchitecturePayload {
  schemaVersion: 'representation.architecture/v0';
  architectureType: ArchitectureType;
  title: string;
  summary: string;
  subjectRefs: RecordRef[];
  basisRefs: PinnedRecordRef[];
  components: ArchitectureComponent[];
  relations: ArchitectureRelation[];
  boundaries: string[];
  invariantClaimRefs: RecordRef[];
}

export type RepresentationPayload = PublicationPayload | ArchitecturePayload;

export interface RepresentationRevisionIndexEntry {
  recordId: RecordId;
  revisionId: RevisionId;
  kind: string;
}

const LOCAL_ID = /^[a-z][a-z0-9-]*$/;
const DEFERRED_FIELDS = new Set(['slug', 'route', 'language', 'visibility', 'maturity', 'publishedAt', 'canonicalUrl']);

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function hasExactFields(value: object, expected: readonly string[]): boolean {
  const actual = Object.keys(value).sort();
  const wanted = [...expected].sort();
  return actual.length === wanted.length && actual.every((field, index) => field === wanted[index]);
}

function hasDeferredField(value: object): boolean {
  return Object.keys(value).some((field) => DEFERRED_FIELDS.has(field));
}

function isExactRecordRef(value: unknown): value is RecordRef {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
    && hasExactFields(value, ['type', 'recordId'])
    && isValidRecordRef(value as RecordRef);
}

function isExactPinnedRef(value: unknown): value is PinnedRecordRef {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
    && hasExactFields(value, ['type', 'recordId', 'revisionId'])
    && isValidPinnedRecordRef(value as PinnedRecordRef);
}

function logicalRefsValid(value: unknown): value is RecordRef[] {
  return Array.isArray(value) && value.every(isExactRecordRef);
}

function pinnedRefsValid(value: unknown): value is PinnedRecordRef[] {
  return Array.isArray(value) && value.every(isExactPinnedRef);
}

function logicalRefsUnique(refs: RecordRef[]): boolean {
  return new Set(refs.map((ref) => ref.recordId)).size === refs.length;
}

function pinnedRefsUnique(refs: PinnedRecordRef[]): boolean {
  return new Set(refs.map((ref) => `${ref.recordId}:${ref.revisionId}`)).size === refs.length;
}

function basisCovers(refs: readonly RecordRef[], basis: readonly PinnedRecordRef[]): boolean {
  const ids = new Set(basis.map((ref) => ref.recordId));
  return refs.every((ref) => ids.has(ref.recordId));
}

function validatePublication(payload: unknown): string[] {
  const errors: string[] = [];
  if (typeof payload !== 'object' || payload === null || Array.isArray(payload)) return ['payload-object'];
  if (!hasExactFields(payload, ['schemaVersion', 'publicationType', 'title', 'summary', 'body', 'subjectRefs', 'basisRefs', 'claimRefs'])) errors.push('payload-fields');
  if (hasDeferredField(payload)) errors.push('deferred-field');
  const candidate = payload as Record<string, unknown>;
  if (candidate.schemaVersion !== 'representation.publication/v0') errors.push('schema-version');
  if (!(PUBLICATION_TYPES as readonly unknown[]).includes(candidate.publicationType)) errors.push('publication-type');
  if (!isNonEmptyString(candidate.title)) errors.push('title');
  if (!isNonEmptyString(candidate.summary)) errors.push('summary');
  if (!isNonEmptyString(candidate.body)) errors.push('body');
  if (!logicalRefsValid(candidate.subjectRefs) || candidate.subjectRefs.length === 0) errors.push('subject-refs');
  else if (!logicalRefsUnique(candidate.subjectRefs)) errors.push('duplicate-subject-ref');
  if (!pinnedRefsValid(candidate.basisRefs) || candidate.basisRefs.length === 0) errors.push('basis-refs');
  else if (!pinnedRefsUnique(candidate.basisRefs)) errors.push('duplicate-basis-ref');
  if (!logicalRefsValid(candidate.claimRefs)) errors.push('claim-refs');
  else if (!logicalRefsUnique(candidate.claimRefs)) errors.push('duplicate-claim-ref');
  if (logicalRefsValid(candidate.subjectRefs) && pinnedRefsValid(candidate.basisRefs) && !basisCovers(candidate.subjectRefs, candidate.basisRefs)) errors.push('subject-basis-missing');
  if (logicalRefsValid(candidate.claimRefs) && pinnedRefsValid(candidate.basisRefs) && !basisCovers(candidate.claimRefs, candidate.basisRefs)) errors.push('claim-basis-missing');
  return [...new Set(errors)];
}

function validateArchitecture(payload: unknown): string[] {
  const errors: string[] = [];
  if (typeof payload !== 'object' || payload === null || Array.isArray(payload)) return ['payload-object'];
  if (!hasExactFields(payload, ['schemaVersion', 'architectureType', 'title', 'summary', 'subjectRefs', 'basisRefs', 'components', 'relations', 'boundaries', 'invariantClaimRefs'])) errors.push('payload-fields');
  if (hasDeferredField(payload)) errors.push('deferred-field');
  const candidate = payload as Record<string, unknown>;
  if (candidate.schemaVersion !== 'representation.architecture/v0') errors.push('schema-version');
  if (!(ARCHITECTURE_TYPES as readonly unknown[]).includes(candidate.architectureType)) errors.push('architecture-type');
  if (!isNonEmptyString(candidate.title)) errors.push('title');
  if (!isNonEmptyString(candidate.summary)) errors.push('summary');
  if (!logicalRefsValid(candidate.subjectRefs) || candidate.subjectRefs.length === 0) errors.push('subject-refs');
  else if (!logicalRefsUnique(candidate.subjectRefs)) errors.push('duplicate-subject-ref');
  if (!pinnedRefsValid(candidate.basisRefs) || candidate.basisRefs.length === 0) errors.push('basis-refs');
  else if (!pinnedRefsUnique(candidate.basisRefs)) errors.push('duplicate-basis-ref');
  if (!logicalRefsValid(candidate.invariantClaimRefs)) errors.push('invariant-claim-refs');
  else if (!logicalRefsUnique(candidate.invariantClaimRefs)) errors.push('duplicate-invariant-claim-ref');
  if (logicalRefsValid(candidate.subjectRefs) && pinnedRefsValid(candidate.basisRefs) && !basisCovers(candidate.subjectRefs, candidate.basisRefs)) errors.push('subject-basis-missing');
  if (logicalRefsValid(candidate.invariantClaimRefs) && pinnedRefsValid(candidate.basisRefs) && !basisCovers(candidate.invariantClaimRefs, candidate.basisRefs)) errors.push('claim-basis-missing');

  const componentIds = new Set<string>();
  if (!Array.isArray(candidate.components) || candidate.components.length === 0) errors.push('components');
  else for (const raw of candidate.components) {
    if (typeof raw !== 'object' || raw === null || Array.isArray(raw) || !hasExactFields(raw, ['id', 'label', 'responsibility', 'subjectRef'])) { errors.push('component-fields'); continue; }
    const component = raw as Record<string, unknown>;
    if (typeof component.id !== 'string' || !LOCAL_ID.test(component.id)) errors.push('component-id');
    else if (componentIds.has(component.id)) errors.push('duplicate-component-id'); else componentIds.add(component.id);
    if (!isNonEmptyString(component.label)) errors.push('component-label');
    if (!isNonEmptyString(component.responsibility)) errors.push('component-responsibility');
    if (!(component.subjectRef === null || isExactRecordRef(component.subjectRef))) errors.push('component-subject-ref');
    if (isExactRecordRef(component.subjectRef) && pinnedRefsValid(candidate.basisRefs) && !basisCovers([component.subjectRef], candidate.basisRefs)) errors.push('component-basis-missing');
  }

  if (!Array.isArray(candidate.relations)) errors.push('relations');
  else {
    const seen = new Set<string>();
    for (const raw of candidate.relations) {
      if (typeof raw !== 'object' || raw === null || Array.isArray(raw) || !hasExactFields(raw, ['from', 'to', 'label'])) { errors.push('relation-fields'); continue; }
      const relation = raw as Record<string, unknown>;
      if (typeof relation.from !== 'string' || !componentIds.has(relation.from)) errors.push('relation-from');
      if (typeof relation.to !== 'string' || !componentIds.has(relation.to)) errors.push('relation-to');
      if (!isNonEmptyString(relation.label)) errors.push('relation-label');
      const key = `${String(relation.from)}\u0000${String(relation.to)}\u0000${String(relation.label)}`;
      if (seen.has(key)) errors.push('duplicate-relation'); else seen.add(key);
    }
  }

  if (!Array.isArray(candidate.boundaries) || !candidate.boundaries.every(isNonEmptyString)) errors.push('boundaries');
  return [...new Set(errors)];
}

export function validateRepresentationPayload(kind: RepresentationKind, payload: unknown): string[] {
  return kind === 'representation.publication' ? validatePublication(payload) : validateArchitecture(payload);
}

function sortLogical(refs: RecordRef[]): RecordRef[] {
  return [...refs].sort((a, b) => a.recordId.localeCompare(b.recordId));
}

function sortPinned(refs: PinnedRecordRef[]): PinnedRecordRef[] {
  return [...refs].sort((a, b) => `${a.recordId}:${a.revisionId}`.localeCompare(`${b.recordId}:${b.revisionId}`));
}

function normalize(kind: RepresentationKind, payload: RepresentationPayload): RepresentationPayload {
  if (kind === 'representation.publication') {
    const value = payload as PublicationPayload;
    return { ...value, subjectRefs: sortLogical(value.subjectRefs), basisRefs: sortPinned(value.basisRefs), claimRefs: sortLogical(value.claimRefs) };
  }
  const value = payload as ArchitecturePayload;
  return { ...value, subjectRefs: sortLogical(value.subjectRefs), basisRefs: sortPinned(value.basisRefs), invariantClaimRefs: sortLogical(value.invariantClaimRefs) };
}

type CanonicalJson = null | boolean | number | string | CanonicalJson[] | { [key: string]: CanonicalJson };
function canonicalJson(value: CanonicalJson): string {
  if (value === null || typeof value === 'boolean' || typeof value === 'number' || typeof value === 'string') {
    if (typeof value === 'number' && !Number.isFinite(value)) throw new Error('non-finite-number');
    return JSON.stringify(value) as string;
  }
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(',')}]`;
  const keys = Object.keys(value).sort();
  return `{${keys.map((key) => `${JSON.stringify(key)}:${canonicalJson(value[key])}`).join(',')}}`;
}

export function serializeRepresentationPayload(kind: RepresentationKind, payload: RepresentationPayload): string {
  const errors = validateRepresentationPayload(kind, payload);
  if (errors.length > 0) throw new Error(`invalid-representation-payload:${errors.join(',')}`);
  return `${canonicalJson(normalize(kind, payload) as unknown as CanonicalJson)}\n`;
}

const PUBLICATION_SUBJECT_KINDS = ['knowledge.system', 'knowledge.question', 'knowledge.investigation', 'knowledge.experiment', 'knowledge.claim'];
const PUBLICATION_BASIS_KINDS = [...PUBLICATION_SUBJECT_KINDS, 'evidence.artifact', 'evidence.binding'];
const ARCHITECTURE_SUBJECT_KINDS = ['knowledge.system', 'knowledge.investigation', 'knowledge.experiment'];
const ARCHITECTURE_BASIS_KINDS = [...ARCHITECTURE_SUBJECT_KINDS, 'knowledge.claim'];

export function validateRepresentationResolution(
  kind: RepresentationKind,
  payload: RepresentationPayload,
  index: readonly RepresentationRevisionIndexEntry[],
): string[] {
  const errors = validateRepresentationPayload(kind, payload);
  if (errors.length > 0) return errors;

  const kindsForRecord = (recordId: RecordId) => [...new Set(index.filter((entry) => entry.recordId === recordId).map((entry) => entry.kind))];
  const exact = (ref: PinnedRecordRef) => index.find((entry) => entry.recordId === ref.recordId && entry.revisionId === ref.revisionId);
  const checkLogical = (ref: RecordRef, allowed: readonly string[], label: string) => {
    const kinds = kindsForRecord(ref.recordId);
    if (kinds.length === 0) errors.push(`${label}:unresolved:${ref.recordId}`);
    else if (kinds.some((targetKind) => !allowed.includes(targetKind))) errors.push(`${label}:target-kind:${kinds.join(',')}`);
  };
  const checkPinned = (ref: PinnedRecordRef, allowed: readonly string[], label: string) => {
    const target = exact(ref);
    if (!target) errors.push(`${label}:unresolved:${ref.recordId}:${ref.revisionId}`);
    else if (!allowed.includes(target.kind)) errors.push(`${label}:target-kind:${target.kind}`);
  };

  if (kind === 'representation.publication') {
    const value = payload as PublicationPayload;
    value.subjectRefs.forEach((ref) => checkLogical(ref, PUBLICATION_SUBJECT_KINDS, 'subjectRefs'));
    value.basisRefs.forEach((ref) => checkPinned(ref, PUBLICATION_BASIS_KINDS, 'basisRefs'));
    value.claimRefs.forEach((ref) => checkLogical(ref, ['knowledge.claim'], 'claimRefs'));
  } else {
    const value = payload as ArchitecturePayload;
    value.subjectRefs.forEach((ref) => checkLogical(ref, ARCHITECTURE_SUBJECT_KINDS, 'subjectRefs'));
    value.basisRefs.forEach((ref) => checkPinned(ref, ARCHITECTURE_BASIS_KINDS, 'basisRefs'));
    value.invariantClaimRefs.forEach((ref) => checkLogical(ref, ['knowledge.claim'], 'invariantClaimRefs'));
    value.components.forEach((component) => {
      if (component.subjectRef) checkLogical(component.subjectRef, ['knowledge.system'], 'component.subjectRef');
    });
  }

  return errors;
}
