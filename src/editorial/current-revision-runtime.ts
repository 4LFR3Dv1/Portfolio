import currentRevisionManifestJson from '../../docs/editorial/R1-A2.3-current-system-revisions.v0.json';
import currentCensusJson from '../../docs/editorial/R1-A2.1-current-github-census.v0.json';
import registryManifestJson from '../../docs/editorial/record-registry.v0.json';
import {
  CURRENT_SYSTEM_REVISION_ASSIGNMENTS,
  CURRENT_SYSTEM_REVISION_DEFERRED,
} from './current-system-revision-candidates';
import {
  KNOWLEDGE_REGISTRY_CODECS,
  codecMap,
  computeRegistryPayloadDigest,
  computeRegistryRevisionId,
  materializeRegistryRecords,
  type RecordRegistryManifest,
  type RegistryRecordEntry,
} from './record-registry';
import {
  IDENTITY_SCHEMA_VERSION,
  validateSuccessor,
  type RecordLifecycle,
  type RecordRevision,
} from '../app/data/editorial-record-identity';
import type { SystemPayload } from '../app/data/editorial-knowledge-ontology';

export const CURRENT_REVISION_MANIFEST_SCHEMA_VERSION = 'editorial-current-system-revisions/v0' as const;

export interface CurrentCensusRepository {
  repo: string;
  visibility: 'public' | 'private';
  defaultBranch: string;
  observedHead: string | null;
  state: 'material' | 'empty';
}

export interface CurrentCensusManifest {
  contractId: string;
  observedAt: string;
  repositories: CurrentCensusRepository[];
}

export interface CurrentRevisionAssignment {
  subjectKey: string;
  recordId: `rec_${string}`;
  lifecycle: RecordLifecycle;
  payload: SystemPayload;
  temporalBasis: {
    censusContractId: string;
    repositoryRefs: string[];
  };
  grounding: {
    summaryBasis: string[];
    thesisBasis: string[];
    privateEvidenceMayBePublished: false;
  };
}

export interface DeferredCurrentRevision {
  subjectKey: string;
  recordId: `rec_${string}`;
  reason: string;
}

export interface CurrentRevisionManifest {
  schemaVersion: typeof CURRENT_REVISION_MANIFEST_SCHEMA_VERSION;
  contractId: string;
  status: 'materialized-awaiting-ci' | 'complete';
  normative: true;
  baseline: string;
  preconditions: {
    r1_a2_1Complete: true;
    r1_a2_2Complete: true;
    identityContinuityPreserved: true;
  };
  sources: {
    registry: string;
    census: string;
    assignments: string;
    runtime: string;
  };
  laws: {
    replaceBirthRevisionAllowed: false;
    successorGeneration: 1;
    payloadSchemaVersion: 'knowledge.system/v0';
    repositoryReferenceMustResolveInCurrentCensus: true;
    temporalObservationInheritedFromCensus: true;
    evidenceFieldsAllowedInsidePayload: false;
    genericBirthSummaryAllowedAsSuccessor: false;
    disclosureDecisionImplied: false;
    routeDecisionImplied: false;
    publicSurfaceDecisionImplied: false;
  };
  materialization: {
    bornSystemRecordCount: number;
    successorRevisionCount: number;
    deferredRevisionCount: number;
    deferredSubjectKeys: string[];
    recordIdChangeCount: 0;
    newRecordBirthCount: 0;
    genericBirthSummarySuccessorCount: 0;
  };
  acceptance: {
    successorRevisionCount: number;
    deferredRevisionCount: number;
    genericBirthSummarySuccessorCount: 0;
    recordIdChangeCount: 0;
    newRecordBirthCount: 0;
    publicDisclosureDecisionCount: 0;
    routeMutationCount: 0;
    publicSurfaceMutationCount: 0;
    productionMutationCount: 0;
    r1_a2_3Complete: boolean;
    nextRequiredAction: string;
  };
}

export interface ResolvedTemporalRepository extends CurrentCensusRepository {
  observedAt: string;
  censusContractId: string;
}

export interface MaterializedCurrentRevision {
  subjectKey: string;
  recordId: string;
  revision: RecordRevision;
  payload: SystemPayload;
  temporalBasis: ResolvedTemporalRepository[];
}

export interface CurrentRevisionMaterialization {
  records: RegistryRecordEntry[];
  successors: MaterializedCurrentRevision[];
  deferredRecordIds: string[];
  errors: string[];
}

function unique(values: readonly string[]): boolean {
  return new Set(values).size === values.length;
}

export function materializeCurrentSystemRevisions(
  manifest: CurrentRevisionManifest = currentRevisionManifestJson as CurrentRevisionManifest,
  registryManifest: RecordRegistryManifest = registryManifestJson as RecordRegistryManifest,
  assignments: readonly CurrentRevisionAssignment[] = CURRENT_SYSTEM_REVISION_ASSIGNMENTS,
  deferred: readonly DeferredCurrentRevision[] = CURRENT_SYSTEM_REVISION_DEFERRED,
  census: CurrentCensusManifest = currentCensusJson as CurrentCensusManifest,
): CurrentRevisionMaterialization {
  const errors: string[] = [];
  const records = materializeRegistryRecords(registryManifest).map((record) => ({
    ...record,
    revisions: [...record.revisions],
  }));
  const byRecordId = new Map(records.map((record) => [record.recordId, record]));
  const bySubjectKey = new Map(records.map((record) => [record.subjectKey, record]));
  const censusByRepo = new Map(census.repositories.map((entry) => [entry.repo, entry]));
  const codec = codecMap(KNOWLEDGE_REGISTRY_CODECS).get('knowledge.system');
  if (!codec) throw new Error('current-revision-system-codec-missing');

  if (manifest.schemaVersion !== CURRENT_REVISION_MANIFEST_SCHEMA_VERSION) {
    errors.push('manifest-schema-version');
  }
  if (manifest.materialization.bornSystemRecordCount !== records.length) {
    errors.push('born-system-count-contract');
  }
  if (manifest.laws.successorGeneration !== 1) {
    errors.push('successor-generation-contract');
  }
  if (manifest.laws.payloadSchemaVersion !== 'knowledge.system/v0') {
    errors.push('payload-schema-contract');
  }

  const assignedRecordIds = new Set<string>();
  const assignedSubjectKeys = new Set<string>();
  const successors: MaterializedCurrentRevision[] = [];

  for (const assignment of assignments) {
    if (assignedRecordIds.has(assignment.recordId)) {
      errors.push(`duplicate-record:${assignment.recordId}`);
      continue;
    }
    if (assignedSubjectKeys.has(assignment.subjectKey)) {
      errors.push(`duplicate-subject:${assignment.subjectKey}`);
      continue;
    }
    assignedRecordIds.add(assignment.recordId);
    assignedSubjectKeys.add(assignment.subjectKey);

    const record = byRecordId.get(assignment.recordId);
    const subjectRecord = bySubjectKey.get(assignment.subjectKey);
    if (!record) {
      errors.push(`unknown-record:${assignment.recordId}`);
      continue;
    }
    if (subjectRecord?.recordId !== record.recordId) {
      errors.push(`subject-record-mismatch:${assignment.subjectKey}`);
      continue;
    }
    if (record.kind !== 'knowledge.system') {
      errors.push(`kind-mismatch:${assignment.recordId}`);
      continue;
    }
    if (record.revisions.length !== 1) {
      errors.push(`unexpected-birth-lineage:${assignment.recordId}`);
      continue;
    }
    if (assignment.payload.summary === registryManifest.birthProfile.summary) {
      errors.push(`generic-birth-summary:${assignment.recordId}`);
      continue;
    }
    if (assignment.payload.schemaVersion !== manifest.laws.payloadSchemaVersion) {
      errors.push(`payload-schema:${assignment.recordId}`);
      continue;
    }
    if (assignment.temporalBasis.censusContractId !== census.contractId) {
      errors.push(`census-contract:${assignment.recordId}`);
      continue;
    }
    if (assignment.temporalBasis.repositoryRefs.length === 0 || !unique(assignment.temporalBasis.repositoryRefs)) {
      errors.push(`repository-refs:${assignment.recordId}`);
      continue;
    }
    if (assignment.grounding.summaryBasis.length === 0) {
      errors.push(`summary-grounding:${assignment.recordId}`);
      continue;
    }
    if (assignment.payload.thesis !== null && assignment.grounding.thesisBasis.length === 0) {
      errors.push(`thesis-grounding:${assignment.recordId}`);
      continue;
    }
    if (assignment.grounding.privateEvidenceMayBePublished !== false) {
      errors.push(`private-evidence-publication:${assignment.recordId}`);
      continue;
    }

    const resolvedTemporalBasis: ResolvedTemporalRepository[] = [];
    let temporalResolutionFailed = false;
    for (const repositoryRef of assignment.temporalBasis.repositoryRefs) {
      const observed = censusByRepo.get(repositoryRef);
      if (!observed) {
        errors.push(`repository-not-in-census:${assignment.recordId}:${repositoryRef}`);
        temporalResolutionFailed = true;
        continue;
      }
      if (observed.state === 'material' && !/^[0-9a-f]{40}$/.test(observed.observedHead ?? '')) {
        errors.push(`invalid-observed-head:${assignment.recordId}:${repositoryRef}`);
        temporalResolutionFailed = true;
        continue;
      }
      if (observed.state === 'empty' && observed.observedHead !== null) {
        errors.push(`empty-repository-with-head:${assignment.recordId}:${repositoryRef}`);
        temporalResolutionFailed = true;
        continue;
      }
      resolvedTemporalBasis.push({
        ...observed,
        observedAt: census.observedAt,
        censusContractId: census.contractId,
      });
    }
    if (temporalResolutionFailed) continue;

    const current = record.revisions[0].revision;
    const payloadDigest = computeRegistryPayloadDigest(codec, assignment.payload);
    const successor: RecordRevision = {
      identitySchemaVersion: IDENTITY_SCHEMA_VERSION,
      recordId: record.recordId,
      kind: record.kind,
      generation: 1,
      previousRevisionId: current.revisionId,
      lifecycle: assignment.lifecycle,
      payloadDigest,
      revisionId: `rev_sha256_${'0'.repeat(64)}`,
    };
    successor.revisionId = computeRegistryRevisionId(successor);

    const successorErrors = validateSuccessor(current, successor);
    if (successorErrors.length > 0) {
      errors.push(...successorErrors.map((error) => `${assignment.recordId}:${error}`));
      continue;
    }

    record.revisions.push({ revision: successor, payload: assignment.payload });
    successors.push({
      subjectKey: assignment.subjectKey,
      recordId: assignment.recordId,
      revision: successor,
      payload: assignment.payload,
      temporalBasis: resolvedTemporalBasis,
    });
  }

  const deferredRecordIds: string[] = [];
  const deferredSubjectKeys = new Set<string>();
  for (const entry of deferred) {
    if (deferredRecordIds.includes(entry.recordId) || deferredSubjectKeys.has(entry.subjectKey)) {
      errors.push(`duplicate-deferred:${entry.recordId}`);
      continue;
    }
    deferredRecordIds.push(entry.recordId);
    deferredSubjectKeys.add(entry.subjectKey);

    const record = byRecordId.get(entry.recordId);
    if (!record || record.subjectKey !== entry.subjectKey) {
      errors.push(`invalid-deferred-record:${entry.subjectKey}`);
    }
    if (assignedRecordIds.has(entry.recordId) || assignedSubjectKeys.has(entry.subjectKey)) {
      errors.push(`assigned-and-deferred:${entry.recordId}`);
    }
  }

  const coveredRecordIds = new Set([...assignedRecordIds, ...deferredRecordIds]);
  const coveredSubjectKeys = new Set([...assignedSubjectKeys, ...deferredSubjectKeys]);
  for (const record of records) {
    if (!coveredRecordIds.has(record.recordId)) errors.push(`uncovered-record:${record.recordId}`);
    if (!coveredSubjectKeys.has(record.subjectKey)) errors.push(`uncovered-subject:${record.subjectKey}`);
  }

  if (assignments.length !== manifest.materialization.successorRevisionCount) {
    errors.push('successor-count-materialization');
  }
  if (assignments.length !== manifest.acceptance.successorRevisionCount) {
    errors.push('successor-count-acceptance');
  }
  if (deferred.length !== manifest.materialization.deferredRevisionCount) {
    errors.push('deferred-count-materialization');
  }
  if (deferred.length !== manifest.acceptance.deferredRevisionCount) {
    errors.push('deferred-count-acceptance');
  }
  if (!unique(assignments.map((assignment) => assignment.recordId))) {
    errors.push('duplicate-assignment-record-id');
  }
  if (!unique(assignments.map((assignment) => assignment.subjectKey))) {
    errors.push('duplicate-assignment-subject-key');
  }
  if (coveredRecordIds.size !== records.length) {
    errors.push('record-coverage-count');
  }
  if (coveredSubjectKeys.size !== records.length) {
    errors.push('subject-coverage-count');
  }

  return {
    records,
    successors,
    deferredRecordIds,
    errors,
  };
}
