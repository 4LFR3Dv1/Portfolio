import {
  isRecordId,
  isValidRecordRef,
  type RecordId,
  type RecordRef,
} from './editorial-record-identity';

export const KNOWLEDGE_KINDS = [
  'knowledge.system',
  'knowledge.question',
  'knowledge.investigation',
  'knowledge.experiment',
  'knowledge.claim',
] as const;

export type KnowledgeKind = (typeof KNOWLEDGE_KINDS)[number];

export const QUESTION_STATES = [
  'open',
  'investigating',
  'partially-answered',
  'answered',
  'superseded',
] as const;
export type QuestionState = (typeof QUESTION_STATES)[number];

export const INVESTIGATION_STATES = [
  'planned',
  'active',
  'paused',
  'completed',
  'abandoned',
] as const;
export type InvestigationState = (typeof INVESTIGATION_STATES)[number];

export const EXPERIMENT_DECLARED_OUTCOMES = [
  'not-run',
  'pass',
  'fail',
  'inconclusive',
] as const;
export type ExperimentDeclaredOutcome = (typeof EXPERIMENT_DECLARED_OUTCOMES)[number];

export interface SystemPayload {
  schemaVersion: 'knowledge.system/v0';
  name: string;
  summary: string;
  thesis: string | null;
}

export interface QuestionPayload {
  schemaVersion: 'knowledge.question/v0';
  prompt: string;
  state: QuestionState;
  aboutSystemRefs: RecordRef[];
  parentQuestionRef: RecordRef | null;
}

export interface InvestigationPayload {
  schemaVersion: 'knowledge.investigation/v0';
  title: string;
  scope: string;
  state: InvestigationState;
  questionRefs: RecordRef[];
}

export interface ExperimentPayload {
  schemaVersion: 'knowledge.experiment/v0';
  title: string;
  protocol: string;
  declaredOutcome: ExperimentDeclaredOutcome;
  investigationRefs: RecordRef[];
}

export interface ClaimPayload {
  schemaVersion: 'knowledge.claim/v0';
  statement: string;
  scope: string;
  aboutRefs: RecordRef[];
}

export type KnowledgePayload =
  | SystemPayload
  | QuestionPayload
  | InvestigationPayload
  | ExperimentPayload
  | ClaimPayload;

export interface KnowledgeRecordCandidate {
  recordId: RecordId;
  kind: KnowledgeKind;
  payload: KnowledgePayload;
}

const EXACT_FIELDS: Record<KnowledgeKind, readonly string[]> = {
  'knowledge.system': ['schemaVersion', 'name', 'summary', 'thesis'],
  'knowledge.question': ['schemaVersion', 'prompt', 'state', 'aboutSystemRefs', 'parentQuestionRef'],
  'knowledge.investigation': ['schemaVersion', 'title', 'scope', 'state', 'questionRefs'],
  'knowledge.experiment': ['schemaVersion', 'title', 'protocol', 'declaredOutcome', 'investigationRefs'],
  'knowledge.claim': ['schemaVersion', 'statement', 'scope', 'aboutRefs'],
};

const DEFERRED_FIELDS = new Set([
  'evidence',
  'evidenceRefs',
  'supportRefs',
  'counterEvidenceRefs',
  'maturity',
  'visibility',
  'slug',
  'route',
  'language',
  'publicationRefs',
]);

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function hasExactFields(value: object, expected: readonly string[]): boolean {
  const actual = Object.keys(value).sort();
  const sortedExpected = [...expected].sort();
  return actual.length === sortedExpected.length && actual.every((field, index) => field === sortedExpected[index]);
}

function hasDeferredField(value: object): boolean {
  return Object.keys(value).some((field) => DEFERRED_FIELDS.has(field));
}

function isExactRecordRef(value: unknown): value is RecordRef {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }
  if (!hasExactFields(value, ['type', 'recordId'])) {
    return false;
  }
  return isValidRecordRef(value as RecordRef);
}

function refsAreValid(refs: unknown): refs is RecordRef[] {
  return Array.isArray(refs) && refs.every((ref) => isExactRecordRef(ref));
}

function refsAreUnique(refs: RecordRef[]): boolean {
  return new Set(refs.map((ref) => ref.recordId)).size === refs.length;
}

function normalizeRefs(refs: RecordRef[]): RecordRef[] {
  return [...refs].sort((left, right) => {
    if (left.recordId < right.recordId) return -1;
    if (left.recordId > right.recordId) return 1;
    return 0;
  });
}

export function isKnowledgeKind(value: string): value is KnowledgeKind {
  return (KNOWLEDGE_KINDS as readonly string[]).includes(value);
}

export function kindForPayload(payload: KnowledgePayload): KnowledgeKind {
  switch (payload.schemaVersion) {
    case 'knowledge.system/v0':
      return 'knowledge.system';
    case 'knowledge.question/v0':
      return 'knowledge.question';
    case 'knowledge.investigation/v0':
      return 'knowledge.investigation';
    case 'knowledge.experiment/v0':
      return 'knowledge.experiment';
    case 'knowledge.claim/v0':
      return 'knowledge.claim';
  }
}

export function validateKnowledgePayload(kind: KnowledgeKind, payload: unknown): string[] {
  const errors: string[] = [];
  if (typeof payload !== 'object' || payload === null || Array.isArray(payload)) {
    return ['payload-object'];
  }

  if (!hasExactFields(payload, EXACT_FIELDS[kind])) {
    errors.push('payload-fields');
  }
  if (hasDeferredField(payload)) {
    errors.push('deferred-field');
  }

  const candidate = payload as Record<string, unknown>;

  if (kind === 'knowledge.system') {
    if (candidate.schemaVersion !== 'knowledge.system/v0') errors.push('schema-version');
    if (!isNonEmptyString(candidate.name)) errors.push('name');
    if (!isNonEmptyString(candidate.summary)) errors.push('summary');
    if (!(candidate.thesis === null || isNonEmptyString(candidate.thesis))) errors.push('thesis');
  }

  if (kind === 'knowledge.question') {
    if (candidate.schemaVersion !== 'knowledge.question/v0') errors.push('schema-version');
    if (!isNonEmptyString(candidate.prompt)) errors.push('prompt');
    if (!(QUESTION_STATES as readonly unknown[]).includes(candidate.state)) errors.push('question-state');
    if (!refsAreValid(candidate.aboutSystemRefs)) {
      errors.push('about-system-refs');
    } else if (!refsAreUnique(candidate.aboutSystemRefs)) {
      errors.push('duplicate-ref');
    }
    if (candidate.parentQuestionRef !== null && !isExactRecordRef(candidate.parentQuestionRef)) {
      errors.push('parent-question-ref');
    }
  }

  if (kind === 'knowledge.investigation') {
    if (candidate.schemaVersion !== 'knowledge.investigation/v0') errors.push('schema-version');
    if (!isNonEmptyString(candidate.title)) errors.push('title');
    if (!isNonEmptyString(candidate.scope)) errors.push('scope');
    if (!(INVESTIGATION_STATES as readonly unknown[]).includes(candidate.state)) errors.push('investigation-state');
    if (!refsAreValid(candidate.questionRefs) || candidate.questionRefs.length === 0) {
      errors.push('question-refs');
    } else if (!refsAreUnique(candidate.questionRefs)) {
      errors.push('duplicate-ref');
    }
  }

  if (kind === 'knowledge.experiment') {
    if (candidate.schemaVersion !== 'knowledge.experiment/v0') errors.push('schema-version');
    if (!isNonEmptyString(candidate.title)) errors.push('title');
    if (!isNonEmptyString(candidate.protocol)) errors.push('protocol');
    if (!(EXPERIMENT_DECLARED_OUTCOMES as readonly unknown[]).includes(candidate.declaredOutcome)) {
      errors.push('declared-outcome');
    }
    if (!refsAreValid(candidate.investigationRefs) || candidate.investigationRefs.length === 0) {
      errors.push('investigation-refs');
    } else if (!refsAreUnique(candidate.investigationRefs)) {
      errors.push('duplicate-ref');
    }
  }

  if (kind === 'knowledge.claim') {
    if (candidate.schemaVersion !== 'knowledge.claim/v0') errors.push('schema-version');
    if (!isNonEmptyString(candidate.statement)) errors.push('statement');
    if (!isNonEmptyString(candidate.scope)) errors.push('scope');
    if (!refsAreValid(candidate.aboutRefs) || candidate.aboutRefs.length === 0) {
      errors.push('about-refs');
    } else if (!refsAreUnique(candidate.aboutRefs)) {
      errors.push('duplicate-ref');
    }
  }

  return [...new Set(errors)];
}

function normalizePayload(kind: KnowledgeKind, payload: KnowledgePayload): KnowledgePayload {
  if (kind === 'knowledge.question') {
    const value = payload as QuestionPayload;
    return { ...value, aboutSystemRefs: normalizeRefs(value.aboutSystemRefs) };
  }
  if (kind === 'knowledge.investigation') {
    const value = payload as InvestigationPayload;
    return { ...value, questionRefs: normalizeRefs(value.questionRefs) };
  }
  if (kind === 'knowledge.experiment') {
    const value = payload as ExperimentPayload;
    return { ...value, investigationRefs: normalizeRefs(value.investigationRefs) };
  }
  if (kind === 'knowledge.claim') {
    const value = payload as ClaimPayload;
    return { ...value, aboutRefs: normalizeRefs(value.aboutRefs) };
  }
  return payload;
}

type CanonicalJson = null | boolean | number | string | CanonicalJson[] | { [key: string]: CanonicalJson };

function canonicalJson(value: CanonicalJson): string {
  if (value === null || typeof value === 'boolean' || typeof value === 'number' || typeof value === 'string') {
    if (typeof value === 'number' && !Number.isFinite(value)) {
      throw new Error('non-finite-number');
    }
    return JSON.stringify(value) as string;
  }
  if (Array.isArray(value)) {
    return `[${value.map((item) => canonicalJson(item)).join(',')}]`;
  }
  const keys = Object.keys(value).sort();
  return `{${keys.map((key) => `${JSON.stringify(key)}:${canonicalJson(value[key])}`).join(',')}}`;
}

export function serializeKnowledgePayload(kind: KnowledgeKind, payload: KnowledgePayload): string {
  const errors = validateKnowledgePayload(kind, payload);
  if (errors.length > 0) {
    throw new Error(`invalid-knowledge-payload:${errors.join(',')}`);
  }
  const normalized = normalizePayload(kind, payload);
  return `${canonicalJson(normalized as unknown as CanonicalJson)}\n`;
}

export function validateKnowledgeGraph(records: readonly KnowledgeRecordCandidate[]): string[] {
  const errors: string[] = [];
  const byId = new Map<RecordId, KnowledgeRecordCandidate>();
  const structurallyValid = new Set<RecordId>();

  for (const record of records) {
    if (!isRecordId(record.recordId)) {
      errors.push(`invalid-record-id:${record.recordId}`);
      continue;
    }
    if (byId.has(record.recordId)) {
      errors.push(`duplicate-record-id:${record.recordId}`);
      continue;
    }
    byId.set(record.recordId, record);

    const payloadKindMatches = kindForPayload(record.payload) === record.kind;
    if (!payloadKindMatches) {
      errors.push(`kind-payload-mismatch:${record.recordId}`);
    }
    const payloadErrors = validateKnowledgePayload(record.kind, record.payload);
    for (const payloadError of payloadErrors) {
      errors.push(`${record.recordId}:${payloadError}`);
    }
    if (payloadKindMatches && payloadErrors.length === 0) {
      structurallyValid.add(record.recordId);
    }
  }

  const expectTarget = (source: RecordId, ref: RecordRef, allowed: readonly KnowledgeKind[], field: string) => {
    const target = byId.get(ref.recordId);
    if (!target) {
      errors.push(`${source}:${field}:unresolved:${ref.recordId}`);
      return;
    }
    if (!allowed.includes(target.kind)) {
      errors.push(`${source}:${field}:target-kind:${target.kind}`);
    }
  };

  for (const record of records) {
    if (!structurallyValid.has(record.recordId)) {
      continue;
    }
    if (record.kind === 'knowledge.question') {
      const payload = record.payload as QuestionPayload;
      for (const ref of payload.aboutSystemRefs) {
        expectTarget(record.recordId, ref, ['knowledge.system'], 'aboutSystemRefs');
      }
      if (payload.parentQuestionRef) {
        if (payload.parentQuestionRef.recordId === record.recordId) {
          errors.push(`${record.recordId}:parentQuestionRef:self`);
        } else {
          expectTarget(record.recordId, payload.parentQuestionRef, ['knowledge.question'], 'parentQuestionRef');
        }
      }
    }
    if (record.kind === 'knowledge.investigation') {
      for (const ref of (record.payload as InvestigationPayload).questionRefs) {
        expectTarget(record.recordId, ref, ['knowledge.question'], 'questionRefs');
      }
    }
    if (record.kind === 'knowledge.experiment') {
      for (const ref of (record.payload as ExperimentPayload).investigationRefs) {
        expectTarget(record.recordId, ref, ['knowledge.investigation'], 'investigationRefs');
      }
    }
    if (record.kind === 'knowledge.claim') {
      for (const ref of (record.payload as ClaimPayload).aboutRefs) {
        expectTarget(
          record.recordId,
          ref,
          ['knowledge.system', 'knowledge.question', 'knowledge.investigation', 'knowledge.experiment'],
          'aboutRefs',
        );
      }
    }
  }

  return errors;
}
