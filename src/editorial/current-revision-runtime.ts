import currentRevisionManifestJson from '../../docs/editorial/R1-A2.3-current-system-revisions.v0.json';
import registryManifestJson from '../../docs/editorial/record-registry.v0.json';
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

export interface CurrentRevisionAssignment {
  subjectKey: string;
  recordId: `rec_${string}`;
  lifecycle: RecordLifecycle;
  payload: SystemPayload;
  temporalBasis: {
    observedAt: string;
    repositories: Array<{
      repo: string;
      visibility: 'public' | 'private';
      defaultBranch: string;
      observedHead: string | null;
      state: 'material' | 'empty';
    }>;
  };
  grounding: {
    summaryBasis: string[];
    thesisBasis: string[];
    privateEvidenceMayBePublished: false;
  };
}

export interface CurrentRevisionManifest {
  schemaVersion: typeof CURRENT_REVISION_MANIFEST_SCHEMA_VERSION;
  contractId: string;
  status: 'materialized';
  normative: true;
  baseline: string;
  preconditions: {
    r1_a2_1Complete: true;
    r1_a2_2Complete: true;
    identityContinuityPreserved: true;
  };
  laws: {
    replaceBirthRevisionAllowed: false;
    successorGeneration: 1;
    payloadSchemaVersion: 'knowledge.system/v0';
    evidenceFieldsAllowedInsidePayload: false;
    disclosureDecisionImplied: false;
    routeDecisionImplied: false;
  };
  assignments: CurrentRevisionAssignment[];
  deferred: Array<{
    subjectKey: string;
    recordId: `rec_${string}`;
    reason: string;
  }>;
  acceptance: {
    successorRevisionCount: number;
    deferredRevisionCount: number;
    genericBirthSummarySuccessorCount: 0;
    recordIdChangeCount: 0;
    publicDisclosureDecisionCount: 0;
    routeMutationCount: 0;
    publicSurfaceMutationCount: 0;
    r1_a2_3Complete: boolean;
  };
}

export interface CurrentRevisionMaterialization {
  records: RegistryRecordEntry[];
  successorRevisionIds: string[];
  deferredRecordIds: string[];
  errors: string[];
}

export function materializeCurrentSystemRevisions(
  manifest: CurrentRevisionManifest = currentRevisionManifestJson as CurrentRevisionManifest,
  registryManifest: RecordRegistryManifest = registryManifestJson as RecordRegistryManifest,
): CurrentRevisionMaterialization {
  const errors: string[] = [];
  const records = materializeRegistryRecords(registryManifest).map((record) => ({
    ...record,
    revisions: [...record.revisions],
  }));
  const byRecordId = new Map(records.map((record) => [record.recordId, record]));
  const bySubjectKey = new Map(records.map((record) => [record.subjectKey, record]));
  const codec = codecMap(KNOWLEDGE_REGISTRY_CODECS).get('knowledge.system');
  if (!codec) throw new Error('current-revision-system-codec-missing');

  const assignedRecordIds = new Set<string>();
  const assignedSubjectKeys = new Set<string>();
  const successorRevisionIds: string[] = [];

  for (const assignment of manifest.assignments) {
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
    successorRevisionIds.push(successor.revisionId);
  }

  const deferredRecordIds = manifest.deferred.map((entry) => entry.recordId);
  for (const deferred of manifest.deferred) {
    const record = byRecordId.get(deferred.recordId);
    if (!record || record.subjectKey !== deferred.subjectKey) {
      errors.push(`invalid-deferred-record:${deferred.subjectKey}`);
    }
    if (assignedRecordIds.has(deferred.recordId)) {
      errors.push(`assigned-and-deferred:${deferred.recordId}`);
    }
  }

  if (manifest.assignments.length !== manifest.acceptance.successorRevisionCount) {
    errors.push('successor-count-contract');
  }
  if (manifest.deferred.length !== manifest.acceptance.deferredRevisionCount) {
    errors.push('deferred-count-contract');
  }

  return {
    records,
    successorRevisionIds,
    deferredRecordIds,
    errors,
  };
}
