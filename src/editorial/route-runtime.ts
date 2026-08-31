import {
  type PinnedRecordRef,
  type RecordId,
  type RecordRef,
  type RevisionId,
} from '../app/data/editorial-record-identity';
import {
  canonicalUrlForPath,
  validateRouteRegistry,
  validateRouteRegistryEvolution,
  type CurrentRecordHead,
  type LanguageTag,
  type RouteBinding,
  type RouteLanguageRevisionIndexEntry,
  type RouteRole,
} from '../app/data/editorial-route-language-identity';
import type { RegistryRecordEntry } from './record-registry';

export const ROUTE_RUNTIME_SCHEMA_VERSION = 'editorial-route-runtime/v0' as const;

export interface RouteRuntimeAssignment {
  path: string;
  targetRecordId: RecordId;
  language: LanguageTag;
  role: RouteRole;
  source: 'r0.8-migration-plan';
}

export interface RouteRuntimeManifest {
  schemaVersion: typeof ROUTE_RUNTIME_SCHEMA_VERSION;
  contractId: string;
  status: 'materialized';
  normative: true;
  baseline: string;
  preconditions: {
    r1_2Complete: true;
    r1_1Complete: true;
    r0EffectiveComplete: true;
  };
  admission: {
    bindingSource: 'docs/editorial/migration-acceptance.v0.json';
    admissionBasis: 'r1.1-generation-zero-birth';
    runtimePathInferenceAllowed: false;
    assignmentCount: number;
    targetRecordCount: number;
    aliasCount: number;
  };
  assignments: RouteRuntimeAssignment[];
  cancelledPlans: Array<{
    path: string;
    reason: 'r0-a1-retired-pre-birth-target';
  }>;
  deferred: {
    legacyCompatibilityEnacted: false;
    languageRealizationsAdmitted: false;
    disclosureRecordsAdmitted: false;
    unbirthedRepresentationRoutesAdmitted: false;
    bornSystemsWithoutRouteCount: number;
  };
  acceptance: {
    routeRuntimeMaterialized: true;
    routeBindingCount: number;
    targetRecordCount: number;
    canonicalRouteCount: number;
    aliasCount: number;
    invalidRouteCount: 0;
    duplicatePathCount: 0;
    retiredTargetRouteCount: 0;
    unbirthedTargetRouteCount: 0;
    runtimePathInferenceAllowed: false;
    languageFallbackAllowed: false;
    publicProjectionCountChanged: false;
    frameworkCutoverEnacted: false;
    publicUiChanged: false;
    runtimeSemanticsChanged: false;
    r1_3Complete: false;
  };
}

export interface ReconstructedRouteRuntime {
  state: 'ready' | 'conflict';
  bindings: RouteBinding[];
  byPath: Map<string, RouteBinding>;
  errors: string[];
}

export type RouteRuntimeResolution =
  | { state: 'unresolved'; path: string }
  | { state: 'registry-conflict'; path: string; errors: string[] }
  | { state: 'head-unavailable'; path: string; targetRef: RecordRef; language: LanguageTag }
  | { state: 'conflict'; path: string; targetRef: PinnedRecordRef; language: LanguageTag }
  | {
      state: 'resolved';
      path: string;
      targetRef: PinnedRecordRef;
      language: LanguageTag;
      canonicalPath: string;
      canonicalUrl: string;
      redirect: boolean;
    };

function unique<T>(values: readonly T[]): boolean {
  return new Set(values).size === values.length;
}

function pinned(recordId: RecordId, revisionId: RevisionId): PinnedRecordRef {
  return { type: 'pinned-record', recordId, revisionId };
}

function logical(recordId: RecordId): RecordRef {
  return { type: 'record', recordId };
}

function birthRevision(record: RegistryRecordEntry): RegistryRecordEntry['revisions'][number] | undefined {
  return record.revisions.find((entry) => entry.revision.generation === 0);
}

function admissionIndex(records: readonly RegistryRecordEntry[]): RouteLanguageRevisionIndexEntry[] {
  const index: RouteLanguageRevisionIndexEntry[] = [];
  for (const record of records) {
    for (const entry of record.revisions) {
      index.push({
        recordId: entry.revision.recordId,
        revisionId: entry.revision.revisionId,
        kind: entry.revision.kind,
        payloadDigest: entry.revision.payloadDigest,
      });
    }
  }
  return index;
}

export function materializeRouteBindings(
  manifest: RouteRuntimeManifest,
  r11BirthRecords: readonly RegistryRecordEntry[],
): RouteBinding[] {
  const byRecordId = new Map(r11BirthRecords.map((record) => [record.recordId, record]));

  return manifest.assignments.map((assignment) => {
    const record = byRecordId.get(assignment.targetRecordId);
    if (!record) throw new Error(`route-target-not-born:${assignment.targetRecordId}`);
    const birth = birthRevision(record);
    if (!birth) throw new Error(`route-target-missing-birth:${assignment.targetRecordId}`);

    return {
      schemaVersion: 'identity.route-binding/v0',
      path: assignment.path,
      targetRef: logical(assignment.targetRecordId),
      admittedAgainst: pinned(assignment.targetRecordId, birth.revision.revisionId),
      language: assignment.language,
      role: assignment.role,
    };
  });
}

export function reconstructRouteRuntime(
  manifest: RouteRuntimeManifest,
  r11BirthRecords: readonly RegistryRecordEntry[],
): ReconstructedRouteRuntime {
  const errors: string[] = [];

  if (manifest.schemaVersion !== ROUTE_RUNTIME_SCHEMA_VERSION) errors.push('route-runtime-schema-version');
  if (manifest.status !== 'materialized') errors.push('route-runtime-status');
  if (manifest.normative !== true) errors.push('route-runtime-normative');
  if (manifest.admission.runtimePathInferenceAllowed) errors.push('runtime-path-inference');
  if (manifest.assignments.length !== manifest.admission.assignmentCount) errors.push('assignment-count');

  const paths = manifest.assignments.map((assignment) => assignment.path);
  if (!unique(paths)) errors.push('duplicate-path');
  const assignmentTargets = [...new Set(manifest.assignments.map((assignment) => assignment.targetRecordId))];
  if (assignmentTargets.length !== manifest.admission.targetRecordCount) errors.push('target-record-count');
  if (manifest.assignments.filter((assignment) => assignment.role === 'alias').length !== manifest.admission.aliasCount) {
    errors.push('alias-count');
  }

  const cancelledPaths = manifest.cancelledPlans.map((plan) => plan.path);
  if (!unique(cancelledPaths)) errors.push('duplicate-cancelled-path');
  if (cancelledPaths.some((path) => paths.includes(path))) errors.push('cancelled-path-admitted');

  let bindings: RouteBinding[] = [];
  try {
    bindings = materializeRouteBindings(manifest, r11BirthRecords);
  } catch (error) {
    errors.push(error instanceof Error ? error.message : 'route-materialization-error');
  }

  const routeErrors = validateRouteRegistry(bindings, admissionIndex(r11BirthRecords));
  errors.push(...routeErrors);

  const byPath = new Map<string, RouteBinding>();
  for (const binding of bindings) {
    if (byPath.has(binding.path)) {
      errors.push(`duplicate-materialized-path:${binding.path}`);
      continue;
    }
    byPath.set(binding.path, binding);
  }

  if (bindings.length !== manifest.acceptance.routeBindingCount) errors.push('acceptance-route-binding-count');
  if (assignmentTargets.length !== manifest.acceptance.targetRecordCount) errors.push('acceptance-target-record-count');
  if (bindings.filter((binding) => binding.role === 'canonical').length !== manifest.acceptance.canonicalRouteCount) {
    errors.push('acceptance-canonical-route-count');
  }
  if (bindings.filter((binding) => binding.role === 'alias').length !== manifest.acceptance.aliasCount) {
    errors.push('acceptance-alias-count');
  }

  const uniqueErrors = [...new Set(errors)];
  return {
    state: uniqueErrors.length === 0 ? 'ready' : 'conflict',
    bindings,
    byPath,
    errors: uniqueErrors,
  };
}

export function validateRouteRuntimeEvolution(
  previous: ReconstructedRouteRuntime,
  next: ReconstructedRouteRuntime,
): string[] {
  if (previous.state !== 'ready') return ['previous-route-runtime-not-ready'];
  if (next.state !== 'ready') return ['next-route-runtime-not-ready'];
  return validateRouteRegistryEvolution(previous.bindings, next.bindings);
}

export function resolveRoutePath(
  path: string,
  runtime: ReconstructedRouteRuntime,
  currentHeads: readonly CurrentRecordHead[],
): RouteRuntimeResolution {
  if (runtime.state !== 'ready') {
    return { state: 'registry-conflict', path, errors: runtime.errors };
  }

  const binding = runtime.byPath.get(path);
  if (!binding) return { state: 'unresolved', path };

  const head = currentHeads.find((candidate) => candidate.recordId === binding.targetRef.recordId);
  if (!head) {
    return {
      state: 'head-unavailable',
      path,
      targetRef: binding.targetRef,
      language: binding.language,
    };
  }

  const targetRef = pinned(head.recordId, head.revisionId);
  const canonical = runtime.bindings.filter((candidate) =>
    candidate.targetRef.recordId === binding.targetRef.recordId
    && candidate.language === binding.language
    && candidate.role === 'canonical',
  );

  if (canonical.length !== 1) {
    return { state: 'conflict', path, targetRef, language: binding.language };
  }

  const canonicalPath = canonical[0].path;
  const canonicalUrl = canonicalUrlForPath(canonicalPath);
  if (canonicalUrl === null) {
    return { state: 'conflict', path, targetRef, language: binding.language };
  }

  return {
    state: 'resolved',
    path,
    targetRef,
    language: binding.language,
    canonicalPath,
    canonicalUrl,
    redirect: binding.role === 'alias',
  };
}
