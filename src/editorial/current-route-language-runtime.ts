import { createHash } from 'node:crypto';
import currentRouteManifestJson from '../../docs/editorial/R1-A2.6-current-route-admission.v0.json';
import historicalRouteManifestJson from '../../docs/editorial/route-runtime.v0.json';
import { CURRENT_ROUTE_LANGUAGE_CANDIDATES, type CurrentRouteLanguageCandidate } from './current-route-language-candidates';
import { materializeCurrentSystemRevisions } from './current-revision-runtime';
import { materializeCurrentDisclosure } from './current-disclosure-runtime';
import {
  reconstructRouteRuntime,
  type RouteRuntimeManifest,
} from './route-runtime';
import {
  resolveRouteIdentity,
  validateLanguageRegistry,
  validateRouteRegistry,
  validateRouteRegistryEvolution,
  type CurrentRecordHead,
  type LanguageBinding,
  type LanguageTag,
  type RouteBinding,
  type RouteLanguageRevisionIndexEntry,
} from '../app/data/editorial-route-language-identity';
import {
  serializeKnowledgePayload,
  validateKnowledgePayload,
  type SystemPayload,
} from '../app/data/editorial-knowledge-ontology';
import type { PayloadDigest, RecordId } from '../app/data/editorial-record-identity';

export const CURRENT_ROUTE_ADMISSION_SCHEMA_VERSION = 'editorial-current-route-admission/v0' as const;

export interface CurrentRouteAdmissionManifest {
  schemaVersion: typeof CURRENT_ROUTE_ADMISSION_SCHEMA_VERSION;
  contractId: string;
  status: 'materialized-awaiting-ci' | 'complete';
  normative: true;
  baseline: string;
  preconditions: {
    r1_a2_5Complete: true;
    currentDisclosureReauthorizationComplete: true;
    allCurrentSuccessorsPubliclyClassified: true;
  };
  sources: {
    currentRevisions: string;
    currentDisclosure: string;
    candidates: string;
    runtime: string;
    historicalRoutes: string;
    routeLanguageContract: string;
  };
  laws: {
    routeDecisionRequiredForEveryCurrentSuccessor: true;
    bilingualCurrentRealizationRequiredForAdmittedCurrentRoute: true;
    currentEnglishRealizationBindsExactPayloadDigest: true;
    currentPortugueseTranslationIsExplicit: true;
    staleLanguageInheritanceAllowed: false;
    implicitLanguageFallbackAllowed: false;
    historicalPathMayBeDropped: false;
    historicalPathMayBeReassigned: false;
    historicalAdmissionBasisMayBeRewritten: false;
    routePathDerivedFromRepositoryName: false;
    disclosureImpliesRoute: false;
    routeImpliesSurfaceMembership: false;
  };
  materialization: {
    currentSuccessorSystemCount: number;
    currentRoutedSystemCount: number;
    currentUnroutedSystemCount: number;
    currentRouteLanguagePairCount: number;
    currentEnglishRouteCount: number;
    currentPortugueseRouteCount: number;
    currentLanguageBindingCount: number;
    currentCanonicalEnglishBindingCount: number;
    currentPortugueseTranslationBindingCount: number;
    preservedHistoricalRouteBindingCount: number;
    preservedHistoricalRouteForCurrentSystemCount: number;
    deferredHistoricalRouteBindingCount: number;
    newRouteBindingCount: number;
    totalRouteBindingCount: number;
    totalRouteTargetRecordCount: number;
  };
  acceptance: {
    allCurrentRouteLanguagePairsResolved: boolean;
    currentRouteConflictCount: number;
    currentLanguageConflictCount: number;
    staleTranslationInheritanceCount: number;
    historicalPathDropCount: number;
    historicalPathReassignmentCount: number;
    historicalAdmissionBasisRewriteCount: number;
    deferredHistoricalRouteHeadUnavailableCount: number;
    publicSurfaceMutationCount: 0;
    productionMutationCount: 0;
    r1_a2_6Complete: boolean;
    nextRequiredAction: string;
  };
}

export interface CurrentLanguageRealization {
  subjectKey: string;
  language: LanguageTag;
  binding: LanguageBinding;
  payload: SystemPayload;
}

export interface CurrentRouteAdmissionMaterialization {
  currentLanguageRealizations: CurrentLanguageRealization[];
  currentRouteBindings: RouteBinding[];
  allRouteBindings: RouteBinding[];
  currentHeads: CurrentRecordHead[];
  currentResolutionStates: Array<{ path: string; state: string }>;
  deferredHistoricalResolutionStates: Array<{ path: string; state: string }>;
  errors: string[];
}

function sha256(value: string): PayloadDigest {
  return `sha256_${createHash('sha256').update(value, 'utf8').digest('hex')}` as PayloadDigest;
}

function payloadDigest(payload: SystemPayload): PayloadDigest {
  const errors = validateKnowledgePayload('knowledge.system', payload);
  if (errors.length > 0) throw new Error(`invalid-current-language-payload:${errors.join(',')}`);
  return sha256(serializeKnowledgePayload('knowledge.system', payload));
}

function routeLanguageIndex(records: ReturnType<typeof materializeCurrentSystemRevisions>['records']): RouteLanguageRevisionIndexEntry[] {
  return records.flatMap((record) => record.revisions.map((entry) => ({
    recordId: entry.revision.recordId,
    revisionId: entry.revision.revisionId,
    kind: entry.revision.kind,
    payloadDigest: entry.revision.payloadDigest,
  })));
}

function unique(values: readonly string[]): boolean {
  return new Set(values).size === values.length;
}

export function materializeCurrentRouteAdmission(
  manifest: CurrentRouteAdmissionManifest = currentRouteManifestJson as CurrentRouteAdmissionManifest,
  candidates: readonly CurrentRouteLanguageCandidate[] = CURRENT_ROUTE_LANGUAGE_CANDIDATES,
): CurrentRouteAdmissionMaterialization {
  const errors: string[] = [];
  const current = materializeCurrentSystemRevisions();
  const disclosure = materializeCurrentDisclosure();
  errors.push(...current.errors.map((error) => `current-revision:${error}`));
  errors.push(...disclosure.errors.map((error) => `current-disclosure:${error}`));

  if (manifest.schemaVersion !== CURRENT_ROUTE_ADMISSION_SCHEMA_VERSION) errors.push('manifest-schema-version');
  if (candidates.length !== manifest.materialization.currentSuccessorSystemCount) errors.push('candidate-count-contract');
  if (!unique(candidates.map((entry) => entry.subjectKey))) errors.push('duplicate-candidate-subject');
  if (!unique(candidates.map((entry) => entry.recordId))) errors.push('duplicate-candidate-record');
  if (!unique(candidates.flatMap((entry) => [entry.routes.en, entry.routes.ptBR]))) errors.push('duplicate-current-route-path');

  const currentBySubject = new Map(current.successors.map((entry) => [entry.subjectKey, entry]));
  const disclosureBySubject = new Map(disclosure.resolutions.map((entry) => [entry.subjectKey, entry]));
  const index = routeLanguageIndex(current.records);
  const currentHeads: CurrentRecordHead[] = current.successors.map((entry) => ({
    recordId: entry.recordId as RecordId,
    revisionId: entry.revision.revisionId,
  }));

  const currentLanguageRealizations: CurrentLanguageRealization[] = [];
  for (const candidate of candidates) {
    const successor = currentBySubject.get(candidate.subjectKey);
    if (!successor || successor.recordId !== candidate.recordId) {
      errors.push(`candidate-current-revision-mismatch:${candidate.subjectKey}`);
      continue;
    }
    const currentDisclosure = disclosureBySubject.get(candidate.subjectKey);
    if (
      currentDisclosure?.state !== 'classified'
      || currentDisclosure.visibility !== 'public'
      || currentDisclosure.disclosure === 'withheld'
    ) {
      errors.push(`candidate-not-current-public:${candidate.subjectKey}`);
      continue;
    }
    if (candidate.ptBR.name !== successor.payload.name) {
      errors.push(`translation-name-drift:${candidate.subjectKey}`);
      continue;
    }
    if (candidate.ptBR.summary.trim().length === 0) {
      errors.push(`translation-summary-empty:${candidate.subjectKey}`);
      continue;
    }
    if ((successor.payload.thesis === null) !== (candidate.ptBR.thesis === null)) {
      errors.push(`translation-thesis-nullability-drift:${candidate.subjectKey}`);
      continue;
    }

    currentLanguageRealizations.push({
      subjectKey: candidate.subjectKey,
      language: 'en',
      binding: {
        schemaVersion: 'identity.language-binding/v0',
        targetRef: { type: 'record', recordId: successor.recordId as RecordId },
        basisRef: {
          type: 'pinned-record',
          recordId: successor.recordId as RecordId,
          revisionId: successor.revision.revisionId,
        },
        language: 'en',
        role: 'canonical',
        translatedFrom: null,
        realizationDigest: successor.revision.payloadDigest,
      },
      payload: successor.payload,
    });

    currentLanguageRealizations.push({
      subjectKey: candidate.subjectKey,
      language: 'pt-BR',
      binding: {
        schemaVersion: 'identity.language-binding/v0',
        targetRef: { type: 'record', recordId: successor.recordId as RecordId },
        basisRef: {
          type: 'pinned-record',
          recordId: successor.recordId as RecordId,
          revisionId: successor.revision.revisionId,
        },
        language: 'pt-BR',
        role: 'translation',
        translatedFrom: 'en',
        realizationDigest: payloadDigest(candidate.ptBR),
      },
      payload: candidate.ptBR,
    });
  }

  const languageBindings = currentLanguageRealizations.map((entry) => entry.binding);
  errors.push(...validateLanguageRegistry(languageBindings, index).map((error) => `current-language:${error}`));

  const historical = reconstructRouteRuntime(
    historicalRouteManifestJson as RouteRuntimeManifest,
    current.records,
  );
  errors.push(...historical.errors.map((error) => `historical-route:${error}`));
  const historicalByPath = new Map(historical.bindings.map((binding) => [binding.path, binding]));

  const currentRouteBindings: RouteBinding[] = [];
  const currentPathSet = new Set<string>();
  for (const candidate of candidates) {
    const successor = currentBySubject.get(candidate.subjectKey);
    if (!successor) continue;

    const decisions: Array<{ path: string; language: LanguageTag }> = [
      { path: candidate.routes.en, language: 'en' },
      { path: candidate.routes.ptBR, language: 'pt-BR' },
    ];
    for (const decision of decisions) {
      currentPathSet.add(decision.path);
      const existing = historicalByPath.get(decision.path);
      if (existing) {
        if (existing.targetRef.recordId !== successor.recordId || existing.language !== decision.language) {
          errors.push(`historical-route-reassignment:${decision.path}`);
          continue;
        }
        currentRouteBindings.push(existing);
        continue;
      }

      currentRouteBindings.push({
        schemaVersion: 'identity.route-binding/v0',
        path: decision.path,
        targetRef: { type: 'record', recordId: successor.recordId as RecordId },
        admittedAgainst: {
          type: 'pinned-record',
          recordId: successor.recordId as RecordId,
          revisionId: successor.revision.revisionId,
        },
        language: decision.language,
        role: 'canonical',
      });
    }
  }

  const deferredHistoricalBindings = historical.bindings.filter((binding) => !currentPathSet.has(binding.path));
  const allRouteBindings = [...currentRouteBindings, ...deferredHistoricalBindings];
  errors.push(...validateRouteRegistry(allRouteBindings, index).map((error) => `current-route:${error}`));
  errors.push(...validateRouteRegistryEvolution(historical.bindings, allRouteBindings).map((error) => `route-evolution:${error}`));

  const currentResolutionStates = currentRouteBindings.map((binding) => ({
    path: binding.path,
    state: resolveRouteIdentity(binding.path, allRouteBindings, currentHeads, languageBindings).state,
  }));
  const deferredHistoricalResolutionStates = deferredHistoricalBindings.map((binding) => ({
    path: binding.path,
    state: resolveRouteIdentity(binding.path, allRouteBindings, currentHeads, languageBindings).state,
  }));

  if (currentRouteBindings.length !== manifest.materialization.currentRouteLanguagePairCount) errors.push('current-route-pair-count');
  if (languageBindings.length !== manifest.materialization.currentLanguageBindingCount) errors.push('current-language-binding-count');
  if (allRouteBindings.length !== manifest.materialization.totalRouteBindingCount) errors.push('total-route-binding-count');
  if (deferredHistoricalBindings.length !== manifest.materialization.deferredHistoricalRouteBindingCount) errors.push('deferred-historical-route-count');
  if (currentResolutionStates.some((entry) => entry.state !== 'resolved')) errors.push('current-route-language-unresolved');

  return {
    currentLanguageRealizations,
    currentRouteBindings,
    allRouteBindings,
    currentHeads,
    currentResolutionStates,
    deferredHistoricalResolutionStates,
    errors: [...new Set(errors)],
  };
}
