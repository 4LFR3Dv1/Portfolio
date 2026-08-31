import { createHash } from 'node:crypto';
import type { PayloadDigest, RecordId } from '../app/data/editorial-record-identity';
import {
  deriveLanguageAvailability,
  resolveRouteIdentity,
  validateLanguageRegistry,
  type CurrentRecordHead,
  type LanguageBinding,
  type LanguageTag,
  type RouteIdentityResolution,
  type RouteLanguageRevisionIndexEntry,
} from '../app/data/editorial-route-language-identity';
import {
  serializeKnowledgePayload,
  validateKnowledgePayload,
  type SystemPayload,
} from '../app/data/editorial-knowledge-ontology';
import type { RegistryRecordEntry } from './record-registry';
import type { ReconstructedRouteRuntime } from './route-runtime';

export const LANGUAGE_RUNTIME_SCHEMA_VERSION = 'editorial-language-runtime/v0' as const;

export interface CanonicalLanguageAssignment {
  targetRecordId: RecordId;
  language: 'en';
  source: 'r1.1-canonical-payload';
}

export interface TranslationLanguageAssignment {
  targetRecordId: RecordId;
  language: 'pt-BR';
  translatedFrom: 'en';
  source: 'r0.8-explicit-language-plan';
  summary: string;
}

export interface LanguageRuntimeManifest {
  schemaVersion: typeof LANGUAGE_RUNTIME_SCHEMA_VERSION;
  contractId: string;
  status: 'materialized';
  normative: true;
  baseline: string;
  preconditions: {
    r1_3Complete: true;
    r1_2Complete: true;
    r1_1Complete: true;
    r0EffectiveComplete: true;
  };
  admission: {
    canonicalSource: 'r1.1-exact-birth-payload';
    translationAuthority: 'r0.8-explicit-language-plan';
    translationInferenceAllowed: false;
    implicitFallbackAllowed: false;
    canonicalAssignmentCount: number;
    translationAssignmentCount: number;
    languageBindingCount: number;
  };
  canonicalAssignments: CanonicalLanguageAssignment[];
  translationAssignments: TranslationLanguageAssignment[];
  deferred: {
    documentRenderingEnacted: false;
    disclosureRecordsAdmitted: false;
    legacyClientLanguageNegotiationEnacted: false;
    frameworkCutoverEnacted: false;
  };
  acceptance: {
    languageRuntimeMaterialized: true;
    exactRevisionBindingRequired: true;
    canonicalLanguageCount: number;
    translationCount: number;
    languageBindingCount: number;
    routedLanguagePairCount: number;
    missingTranslationPreserved: true;
    staleTranslationInheritanceAllowed: false;
    implicitFallbackAllowed: false;
    publicProjectionCountChanged: false;
    publicUiChanged: false;
    runtimeSemanticsChanged: false;
    r1_4Complete: false;
  };
}

export interface LanguageRealization {
  binding: LanguageBinding;
  payload: SystemPayload;
  source: CanonicalLanguageAssignment['source'] | TranslationLanguageAssignment['source'];
}

export interface ReconstructedLanguageRuntime {
  state: 'ready' | 'conflict';
  bindings: LanguageBinding[];
  realizations: LanguageRealization[];
  errors: string[];
}

function sha256(value: string): PayloadDigest {
  return `sha256_${createHash('sha256').update(value, 'utf8').digest('hex')}` as PayloadDigest;
}

function birthEntry(record: RegistryRecordEntry): RegistryRecordEntry['revisions'][number] | undefined {
  return record.revisions.find((entry) => entry.revision.generation === 0);
}

function languageIndex(records: readonly RegistryRecordEntry[]): RouteLanguageRevisionIndexEntry[] {
  return records.flatMap((record) => record.revisions.map((entry) => ({
    recordId: entry.revision.recordId,
    revisionId: entry.revision.revisionId,
    kind: entry.revision.kind,
    payloadDigest: entry.revision.payloadDigest,
  })));
}

function canonicalPayload(record: RegistryRecordEntry): SystemPayload {
  const birth = birthEntry(record);
  if (!birth) throw new Error(`language-target-missing-birth:${record.recordId}`);
  if (record.kind !== 'knowledge.system') throw new Error(`language-target-kind:${record.kind}`);
  const errors = validateKnowledgePayload('knowledge.system', birth.payload);
  if (errors.length > 0) throw new Error(`language-target-payload:${record.recordId}:${errors.join(',')}`);
  return birth.payload as SystemPayload;
}

function translationPayload(record: RegistryRecordEntry, assignment: TranslationLanguageAssignment): SystemPayload {
  const canonical = canonicalPayload(record);
  return {
    schemaVersion: 'knowledge.system/v0',
    name: canonical.name,
    summary: assignment.summary,
    thesis: canonical.thesis,
  };
}

function exactRealizationDigest(payload: SystemPayload): PayloadDigest {
  const errors = validateKnowledgePayload('knowledge.system', payload);
  if (errors.length > 0) throw new Error(`invalid-language-realization:${errors.join(',')}`);
  return sha256(serializeKnowledgePayload('knowledge.system', payload));
}

function unique<T>(values: readonly T[]): boolean {
  return new Set(values).size === values.length;
}

export function materializeLanguageRealizations(
  manifest: LanguageRuntimeManifest,
  records: readonly RegistryRecordEntry[],
): LanguageRealization[] {
  const byRecordId = new Map(records.map((record) => [record.recordId, record]));
  const result: LanguageRealization[] = [];

  for (const assignment of manifest.canonicalAssignments) {
    const record = byRecordId.get(assignment.targetRecordId);
    if (!record) throw new Error(`canonical-language-target-not-born:${assignment.targetRecordId}`);
    const birth = birthEntry(record);
    if (!birth) throw new Error(`canonical-language-target-missing-birth:${assignment.targetRecordId}`);
    const payload = canonicalPayload(record);
    const digest = exactRealizationDigest(payload);
    if (digest !== birth.revision.payloadDigest) {
      throw new Error(`canonical-language-digest-mismatch:${assignment.targetRecordId}`);
    }

    result.push({
      binding: {
        schemaVersion: 'identity.language-binding/v0',
        targetRef: { type: 'record', recordId: assignment.targetRecordId },
        basisRef: {
          type: 'pinned-record',
          recordId: assignment.targetRecordId,
          revisionId: birth.revision.revisionId,
        },
        language: assignment.language,
        role: 'canonical',
        translatedFrom: null,
        realizationDigest: birth.revision.payloadDigest,
      },
      payload,
      source: assignment.source,
    });
  }

  for (const assignment of manifest.translationAssignments) {
    const record = byRecordId.get(assignment.targetRecordId);
    if (!record) throw new Error(`translation-target-not-born:${assignment.targetRecordId}`);
    const birth = birthEntry(record);
    if (!birth) throw new Error(`translation-target-missing-birth:${assignment.targetRecordId}`);
    const payload = translationPayload(record, assignment);

    result.push({
      binding: {
        schemaVersion: 'identity.language-binding/v0',
        targetRef: { type: 'record', recordId: assignment.targetRecordId },
        basisRef: {
          type: 'pinned-record',
          recordId: assignment.targetRecordId,
          revisionId: birth.revision.revisionId,
        },
        language: assignment.language,
        role: 'translation',
        translatedFrom: assignment.translatedFrom,
        realizationDigest: exactRealizationDigest(payload),
      },
      payload,
      source: assignment.source,
    });
  }

  return result;
}

export function reconstructLanguageRuntime(
  manifest: LanguageRuntimeManifest,
  records: readonly RegistryRecordEntry[],
): ReconstructedLanguageRuntime {
  const errors: string[] = [];

  if (manifest.schemaVersion !== LANGUAGE_RUNTIME_SCHEMA_VERSION) errors.push('language-runtime-schema-version');
  if (manifest.status !== 'materialized') errors.push('language-runtime-status');
  if (manifest.normative !== true) errors.push('language-runtime-normative');
  if (manifest.admission.translationInferenceAllowed) errors.push('translation-inference-enabled');
  if (manifest.admission.implicitFallbackAllowed) errors.push('implicit-fallback-enabled');

  const canonicalIds = manifest.canonicalAssignments.map((assignment) => assignment.targetRecordId);
  const translatedIds = manifest.translationAssignments.map((assignment) => assignment.targetRecordId);
  if (!unique(canonicalIds)) errors.push('duplicate-canonical-target');
  if (!unique(translatedIds)) errors.push('duplicate-translation-target');
  if (manifest.canonicalAssignments.length !== manifest.admission.canonicalAssignmentCount) {
    errors.push('canonical-assignment-count');
  }
  if (manifest.translationAssignments.length !== manifest.admission.translationAssignmentCount) {
    errors.push('translation-assignment-count');
  }

  let realizations: LanguageRealization[] = [];
  try {
    realizations = materializeLanguageRealizations(manifest, records);
  } catch (error) {
    errors.push(error instanceof Error ? error.message : 'language-materialization-error');
  }

  const bindings = realizations.map((realization) => realization.binding);
  errors.push(...validateLanguageRegistry(bindings, languageIndex(records)));

  for (const realization of realizations) {
    if (realization.binding.role === 'translation') {
      const canonical = realizations.find((candidate) =>
        candidate.binding.role === 'canonical'
        && candidate.binding.targetRef.recordId === realization.binding.targetRef.recordId
        && candidate.binding.basisRef.revisionId === realization.binding.basisRef.revisionId,
      );
      if (!canonical) {
        errors.push(`${realization.binding.targetRef.recordId}:translation-canonical-missing`);
        continue;
      }
      if (realization.payload.name !== canonical.payload.name) {
        errors.push(`${realization.binding.targetRef.recordId}:translation-name-drift`);
      }
      if (realization.payload.thesis !== canonical.payload.thesis) {
        errors.push(`${realization.binding.targetRef.recordId}:translation-thesis-drift`);
      }
      if (realization.payload.summary.trim().length === 0) {
        errors.push(`${realization.binding.targetRef.recordId}:translation-summary-empty`);
      }
    }
  }

  if (bindings.length !== manifest.admission.languageBindingCount) errors.push('language-binding-count');
  if (bindings.length !== manifest.acceptance.languageBindingCount) errors.push('acceptance-language-binding-count');
  if (bindings.filter((binding) => binding.role === 'canonical').length !== manifest.acceptance.canonicalLanguageCount) {
    errors.push('acceptance-canonical-language-count');
  }
  if (bindings.filter((binding) => binding.role === 'translation').length !== manifest.acceptance.translationCount) {
    errors.push('acceptance-translation-count');
  }

  const uniqueErrors = [...new Set(errors)];
  return {
    state: uniqueErrors.length === 0 ? 'ready' : 'conflict',
    bindings,
    realizations,
    errors: uniqueErrors,
  };
}

export function currentLanguageAvailability(
  targetRecordId: RecordId,
  currentHeads: readonly CurrentRecordHead[],
  language: LanguageTag,
  runtime: ReconstructedLanguageRuntime,
): 'unavailable' | 'canonical' | 'translation' | 'conflict' {
  if (runtime.state !== 'ready') return 'conflict';
  const head = currentHeads.find((candidate) => candidate.recordId === targetRecordId);
  if (!head) return 'unavailable';
  return deriveLanguageAvailability(
    {
      type: 'pinned-record',
      recordId: head.recordId,
      revisionId: head.revisionId,
    },
    language,
    runtime.bindings,
  );
}

export function resolveLocalizedRouteIdentity(
  path: string,
  routeRuntime: ReconstructedRouteRuntime,
  languageRuntime: ReconstructedLanguageRuntime,
  currentHeads: readonly CurrentRecordHead[],
): RouteIdentityResolution {
  if (routeRuntime.state !== 'ready') throw new Error('route-runtime-conflict');
  if (languageRuntime.state !== 'ready') throw new Error('language-runtime-conflict');
  return resolveRouteIdentity(path, routeRuntime.bindings, currentHeads, languageRuntime.bindings);
}
