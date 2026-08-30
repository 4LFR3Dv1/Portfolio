import {
  isValidPinnedRecordRef,
  type PinnedRecordRef,
  type RecordId,
  type RecordLifecycle,
  type RevisionId,
} from './editorial-record-identity';

export const EVIDENCE_KINDS = ['evidence.artifact', 'evidence.binding'] as const;
export type EvidenceKind = (typeof EVIDENCE_KINDS)[number];

export const EVIDENCE_CLASSES = [
  'source',
  'commit',
  'test',
  'deployment',
  'endpoint',
  'document',
  'physical-witness',
  'video',
  'dataset',
  'artifact',
] as const;
export type EvidenceClass = (typeof EVIDENCE_CLASSES)[number];

export const EVIDENCE_FACETS = [
  'source-existence',
  'source-state',
  'test-result',
  'deployment-existence',
  'runtime-observation',
  'endpoint-observation',
  'document-existence',
  'physical-observation',
  'visual-observation',
  'dataset-observation',
  'artifact-integrity',
] as const;
export type EvidenceFacet = (typeof EVIDENCE_FACETS)[number];

export const EVIDENCE_RELATIONS = ['supports', 'contradicts', 'qualifies'] as const;
export type EvidenceRelation = (typeof EVIDENCE_RELATIONS)[number];

export type EvidentialDisposition =
  | 'unassessed'
  | 'support-present'
  | 'contradiction-present'
  | 'mixed'
  | 'qualification-only';

export interface EvidenceProvenance {
  origin: string;
  locator: string | null;
  observedAt: string | null;
  digest: `sha256_${string}` | null;
}

export interface EvidenceArtifactPayload {
  schemaVersion: 'evidence.artifact/v0';
  evidenceClass: EvidenceClass;
  title: string;
  provenance: EvidenceProvenance;
  facets: EvidenceFacet[];
}

export interface EvidenceBindingPayload {
  schemaVersion: 'evidence.binding/v0';
  relation: EvidenceRelation;
  facet: EvidenceFacet;
  evidenceRef: PinnedRecordRef;
  targetRef: PinnedRecordRef;
  scope: string;
  rationale: string;
}

export type EvidencePayload = EvidenceArtifactPayload | EvidenceBindingPayload;

export interface EvidenceRevisionIndexEntry {
  recordId: RecordId;
  revisionId: RevisionId;
  kind: string;
  lifecycle: RecordLifecycle;
  artifactPayload?: EvidenceArtifactPayload;
}

export interface EvidenceEvaluationEntry {
  payload: EvidenceBindingPayload;
  bindingLifecycle: RecordLifecycle;
  evidenceCurrentLifecycle: RecordLifecycle;
}

const CLASS_FACETS: Record<EvidenceClass, readonly EvidenceFacet[]> = {
  source: ['source-existence', 'source-state'],
  commit: ['source-state', 'artifact-integrity'],
  test: ['test-result', 'artifact-integrity'],
  deployment: ['deployment-existence', 'runtime-observation'],
  endpoint: ['endpoint-observation', 'runtime-observation'],
  document: ['document-existence', 'artifact-integrity'],
  'physical-witness': ['physical-observation', 'runtime-observation', 'artifact-integrity'],
  video: ['visual-observation', 'artifact-integrity'],
  dataset: ['dataset-observation', 'artifact-integrity'],
  artifact: ['artifact-integrity'],
};

const DIGEST_REQUIRED = new Set<EvidenceFacet>([
  'source-state',
  'test-result',
  'runtime-observation',
  'endpoint-observation',
  'physical-observation',
  'visual-observation',
  'dataset-observation',
  'artifact-integrity',
]);

const OBSERVED_AT_REQUIRED = new Set<EvidenceFacet>([
  'test-result',
  'runtime-observation',
  'endpoint-observation',
  'physical-observation',
  'visual-observation',
  'dataset-observation',
]);

const DIGEST_PATTERN = /^sha256_[0-9a-f]{64}$/;
const OBSERVED_AT_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function hasExactFields(value: object, expected: readonly string[]): boolean {
  const actual = Object.keys(value).sort();
  const sortedExpected = [...expected].sort();
  return actual.length === sortedExpected.length && actual.every((field, index) => field === sortedExpected[index]);
}

function isExactPinnedRef(value: unknown): value is PinnedRecordRef {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return false;
  if (!hasExactFields(value, ['type', 'recordId', 'revisionId'])) return false;
  return isValidPinnedRecordRef(value as PinnedRecordRef);
}

function isEvidenceClass(value: unknown): value is EvidenceClass {
  return (EVIDENCE_CLASSES as readonly unknown[]).includes(value);
}

function isEvidenceFacet(value: unknown): value is EvidenceFacet {
  return (EVIDENCE_FACETS as readonly unknown[]).includes(value);
}

function isEvidenceRelation(value: unknown): value is EvidenceRelation {
  return (EVIDENCE_RELATIONS as readonly unknown[]).includes(value);
}

function isValidObservedAt(value: string): boolean {
  return OBSERVED_AT_PATTERN.test(value) && !Number.isNaN(Date.parse(value));
}

function provenanceEquals(left: EvidenceProvenance, right: EvidenceProvenance): boolean {
  return left.origin === right.origin
    && left.locator === right.locator
    && left.observedAt === right.observedAt
    && left.digest === right.digest;
}

function pinnedRefEquals(left: PinnedRecordRef, right: PinnedRecordRef): boolean {
  return left.recordId === right.recordId && left.revisionId === right.revisionId;
}

export function validateEvidenceArtifact(payload: unknown): string[] {
  const errors: string[] = [];
  if (typeof payload !== 'object' || payload === null || Array.isArray(payload)) return ['payload-object'];
  if (!hasExactFields(payload, ['schemaVersion', 'evidenceClass', 'title', 'provenance', 'facets'])) {
    errors.push('payload-fields');
  }

  const candidate = payload as Record<string, unknown>;
  if (candidate.schemaVersion !== 'evidence.artifact/v0') errors.push('schema-version');
  if (!isEvidenceClass(candidate.evidenceClass)) errors.push('evidence-class');
  if (!isNonEmptyString(candidate.title)) errors.push('title');

  if (typeof candidate.provenance !== 'object' || candidate.provenance === null || Array.isArray(candidate.provenance)) {
    errors.push('provenance');
  } else {
    const provenance = candidate.provenance as Record<string, unknown>;
    if (!hasExactFields(provenance, ['origin', 'locator', 'observedAt', 'digest'])) errors.push('provenance-fields');
    if (!isNonEmptyString(provenance.origin)) errors.push('provenance-origin');
    if (!(provenance.locator === null || isNonEmptyString(provenance.locator))) errors.push('provenance-locator');
    if (!(provenance.digest === null || (typeof provenance.digest === 'string' && DIGEST_PATTERN.test(provenance.digest)))) {
      errors.push('provenance-digest');
    }
    if (!(provenance.observedAt === null || (typeof provenance.observedAt === 'string' && isValidObservedAt(provenance.observedAt)))) {
      errors.push('provenance-observed-at');
    }
    if (provenance.locator === null && provenance.digest === null) errors.push('provenance-anchor');
  }

  if (!Array.isArray(candidate.facets) || candidate.facets.length === 0 || !candidate.facets.every(isEvidenceFacet)) {
    errors.push('facets');
  } else {
    const facets = candidate.facets as EvidenceFacet[];
    if (new Set(facets).size !== facets.length) errors.push('duplicate-facet');
    if (isEvidenceClass(candidate.evidenceClass)) {
      const allowed = CLASS_FACETS[candidate.evidenceClass];
      if (facets.some((facet) => !allowed.includes(facet))) errors.push('class-facet');
    }

    if (typeof candidate.provenance === 'object' && candidate.provenance !== null && !Array.isArray(candidate.provenance)) {
      const provenance = candidate.provenance as Record<string, unknown>;
      if (facets.some((facet) => DIGEST_REQUIRED.has(facet)) && provenance.digest === null) errors.push('facet-requires-digest');
      if (facets.some((facet) => OBSERVED_AT_REQUIRED.has(facet)) && provenance.observedAt === null) {
        errors.push('facet-requires-observed-at');
      }
    }
  }

  return [...new Set(errors)];
}

export function validateEvidenceBinding(payload: unknown): string[] {
  const errors: string[] = [];
  if (typeof payload !== 'object' || payload === null || Array.isArray(payload)) return ['payload-object'];
  if (!hasExactFields(payload, ['schemaVersion', 'relation', 'facet', 'evidenceRef', 'targetRef', 'scope', 'rationale'])) {
    errors.push('payload-fields');
  }
  const candidate = payload as Record<string, unknown>;
  if (candidate.schemaVersion !== 'evidence.binding/v0') errors.push('schema-version');
  if (!isEvidenceRelation(candidate.relation)) errors.push('relation');
  if (!isEvidenceFacet(candidate.facet)) errors.push('facet');
  if (!isExactPinnedRef(candidate.evidenceRef)) errors.push('evidence-ref');
  if (!isExactPinnedRef(candidate.targetRef)) errors.push('target-ref');
  if (!isNonEmptyString(candidate.scope)) errors.push('scope');
  if (!isNonEmptyString(candidate.rationale)) errors.push('rationale');
  return [...new Set(errors)];
}

export function validateArtifactCoreContinuity(
  current: EvidenceArtifactPayload,
  next: EvidenceArtifactPayload,
): string[] {
  const errors: string[] = [];
  if (current.evidenceClass !== next.evidenceClass) errors.push('evidence-class-continuity');
  if (!provenanceEquals(current.provenance, next.provenance)) errors.push('provenance-continuity');
  return errors;
}

export function validateBindingCoreContinuity(
  current: EvidenceBindingPayload,
  next: EvidenceBindingPayload,
): string[] {
  const errors: string[] = [];
  if (current.relation !== next.relation) errors.push('relation-continuity');
  if (current.facet !== next.facet) errors.push('facet-continuity');
  if (!pinnedRefEquals(current.evidenceRef, next.evidenceRef)) errors.push('evidence-ref-continuity');
  if (!pinnedRefEquals(current.targetRef, next.targetRef)) errors.push('target-ref-continuity');
  return errors;
}

export function validateBindingResolution(
  binding: EvidenceBindingPayload,
  index: readonly EvidenceRevisionIndexEntry[],
): string[] {
  const errors = validateEvidenceBinding(binding);
  if (errors.length > 0) return errors;

  const exact = (ref: PinnedRecordRef) => index.find(
    (entry) => entry.recordId === ref.recordId && entry.revisionId === ref.revisionId,
  );

  const evidence = exact(binding.evidenceRef);
  if (!evidence) {
    errors.push('evidence-ref-unresolved');
  } else if (evidence.kind !== 'evidence.artifact') {
    errors.push('evidence-ref-kind');
  } else if (!evidence.artifactPayload) {
    errors.push('evidence-payload-missing');
  } else if (!evidence.artifactPayload.facets.includes(binding.facet)) {
    errors.push('binding-facet-not-admitted');
  }

  const target = exact(binding.targetRef);
  if (!target) {
    errors.push('target-ref-unresolved');
  } else if (!['knowledge.claim', 'knowledge.experiment'].includes(target.kind)) {
    errors.push('target-ref-kind');
  }

  return errors;
}

function isCountedLifecycle(lifecycle: RecordLifecycle): boolean {
  return lifecycle === 'active' || lifecycle === 'archived';
}

function samePinnedRef(left: PinnedRecordRef, right: PinnedRecordRef): boolean {
  return left.recordId === right.recordId && left.revisionId === right.revisionId;
}

export function deriveEvidentialDisposition(
  targetRef: PinnedRecordRef,
  entries: readonly EvidenceEvaluationEntry[],
): EvidentialDisposition {
  const current = entries.filter((entry) =>
    samePinnedRef(entry.payload.targetRef, targetRef)
    && isCountedLifecycle(entry.bindingLifecycle)
    && isCountedLifecycle(entry.evidenceCurrentLifecycle),
  );

  const hasSupport = current.some((entry) => entry.payload.relation === 'supports');
  const hasContradiction = current.some((entry) => entry.payload.relation === 'contradicts');
  const hasQualification = current.some((entry) => entry.payload.relation === 'qualifies');

  if (hasSupport && hasContradiction) return 'mixed';
  if (hasSupport) return 'support-present';
  if (hasContradiction) return 'contradiction-present';
  if (hasQualification) return 'qualification-only';
  return 'unassessed';
}

function normalizeArtifact(payload: EvidenceArtifactPayload): EvidenceArtifactPayload {
  return { ...payload, facets: [...payload.facets].sort() };
}

type CanonicalJson = null | boolean | number | string | CanonicalJson[] | { [key: string]: CanonicalJson };

function canonicalJson(value: CanonicalJson): string {
  if (value === null || typeof value === 'boolean' || typeof value === 'number' || typeof value === 'string') {
    if (typeof value === 'number' && !Number.isFinite(value)) throw new Error('non-finite-number');
    return JSON.stringify(value) as string;
  }
  if (Array.isArray(value)) return `[${value.map((item) => canonicalJson(item)).join(',')}]`;
  const keys = Object.keys(value).sort();
  return `{${keys.map((key) => `${JSON.stringify(key)}:${canonicalJson(value[key])}`).join(',')}}`;
}

export function serializeEvidencePayload(kind: EvidenceKind, payload: EvidencePayload): string {
  const errors = kind === 'evidence.artifact'
    ? validateEvidenceArtifact(payload)
    : validateEvidenceBinding(payload);
  if (errors.length > 0) throw new Error(`invalid-evidence-payload:${errors.join(',')}`);
  const normalized = kind === 'evidence.artifact'
    ? normalizeArtifact(payload as EvidenceArtifactPayload)
    : payload;
  return `${canonicalJson(normalized as unknown as CanonicalJson)}\n`;
}
