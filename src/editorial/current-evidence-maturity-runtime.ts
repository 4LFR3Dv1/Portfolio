import { createHash } from 'node:crypto';
import currentEvidenceMaturityManifestJson from '../../docs/editorial/R1-A2.4-current-evidence-maturity.v0.json';
import coreEditorialSurfacesJson from '../../docs/editorial/core-editorial-surfaces.v0.json';
import {
  CURRENT_EVIDENCE_MATURITY_CANDIDATES,
  type CurrentEvidenceMaturityCandidate,
} from './current-evidence-maturity-candidates';
import { materializeCurrentSystemRevisions } from './current-revision-runtime';
import {
  deriveGovernanceProjection,
  serializeGovernancePayload,
  validateGovernanceResolution,
  validateMaturityContinuity,
  type CurrentGovernanceEntry,
  type GovernanceRevisionIndexEntry,
  type MaturityPayload,
  type MaturityStage,
} from '../app/data/editorial-visibility-maturity-disclosure';
import {
  IDENTITY_SCHEMA_VERSION,
  isRecordId,
  serializeRevisionMaterial,
  validateBirth,
  validateSuccessor,
  type PayloadDigest,
  type PinnedRecordRef,
  type RecordRevision,
  type RevisionId,
} from '../app/data/editorial-record-identity';

export const CURRENT_EVIDENCE_MATURITY_SCHEMA_VERSION = 'editorial-current-evidence-maturity/v0' as const;

export interface CurrentEvidenceMaturityManifest {
  schemaVersion: typeof CURRENT_EVIDENCE_MATURITY_SCHEMA_VERSION;
  contractId: string;
  status: 'materialized-awaiting-ci' | 'complete';
  normative: true;
  baseline: string;
  preconditions: {
    r1_a2_3Complete: true;
    currentRevisionMaterializationComplete: true;
    identityContinuityPreserved: true;
  };
  sources: {
    currentRevisions: string;
    currentCensus: string;
    candidates: string;
    runtime: string;
    governanceContract: string;
    evidenceContract: string;
  };
  laws: {
    currentSystemHeadBindingRequired: true;
    observationSourceMustResolveToCurrentTemporalBasis: true;
    observationSourceMustHaveMaterialHead: true;
    maturityInferenceFromImplementationForbidden: true;
    nonCanonicalStageTranslationForbidden: true;
    productionDoesNotProveRuntimeHealth: true;
    maturityImpliesDisclosure: false;
    observationImpliesDisclosure: false;
    historicalGovernanceSilentInheritance: false;
    existingMaturityGovernanceIdentityMustContinue: true;
    formalEvidenceBindingToSystemMinted: false;
    privateEvidencePublicByDefault: false;
  };
  materialization: {
    currentSuccessorSystemCount: number;
    deferredSystemCount: number;
    deferredSubjectKeys: string[];
    evidenceCandidateCount: number;
    observationCount: number;
    supportObservationCount: number;
    qualificationObservationCount: number;
    contradictionObservationCount: number;
    maturityClassifiedCount: number;
    maturityUnclassifiedCount: number;
    maturityStageCounts: Partial<Record<MaturityStage, number>>;
    formalEvidenceRecordBirthCount: 0;
    formalEvidenceBindingBirthCount: 0;
    maturityGovernanceBirthCount: number;
    maturityGovernanceSuccessorCount: number;
  };
  acceptance: {
    allCurrentSuccessorsReconciled: boolean;
    allObservationSourcesTemporallyBound: boolean;
    staleMaturityInheritanceCount: number;
    maturityIdentityReplacementCount: number;
    maturityConflictCount: number;
    maturityClassifiedCount: number;
    maturityUnclassifiedCount: number;
    publicDisclosureDecisionCount: 0;
    routeMutationCount: 0;
    publicSurfaceMutationCount: 0;
    productionMutationCount: 0;
    r1_a2_4Complete: boolean;
    nextRequiredAction: string;
  };
}

interface LegacyGovernanceAssignment {
  governanceRecordId: string;
  kind: 'governance.disclosure' | 'governance.maturity';
  targetRecordId: string;
  basisRevisionId: string;
  stage?: MaturityStage;
  rationale: string;
}

interface CoreEditorialSurfacesManifest {
  governanceAssignments: LegacyGovernanceAssignment[];
}

export interface ResolvedCurrentEvidenceObservation {
  subjectKey: string;
  relation: 'supports' | 'qualifies' | 'contradicts';
  sourceRef: string;
  statement: string;
  repository: string;
  observedHead: string;
  observedAt: string;
  censusContractId: string;
  visibility: 'public' | 'private';
}

export interface MaterializedCurrentMaturityRecord {
  subjectKey: string;
  governanceRecordId: `rec_${string}`;
  targetRef: PinnedRecordRef;
  stage: MaturityStage;
  confidence: 'high' | 'medium' | 'low';
  materializationKind: 'birth' | 'successor';
  previousGovernanceRevisionId: RevisionId | null;
  revision: RecordRevision;
  payload: MaturityPayload;
}

export interface CurrentMaturityResolution {
  subjectKey: string;
  targetRef: PinnedRecordRef;
  state: 'classified' | 'unclassified' | 'conflict';
  stage: MaturityStage | null;
}

export interface CurrentEvidenceMaturityMaterialization {
  observations: ResolvedCurrentEvidenceObservation[];
  maturityRecords: MaterializedCurrentMaturityRecord[];
  maturityResolutions: CurrentMaturityResolution[];
  errors: string[];
}

function sha256(value: string): string {
  return createHash('sha256').update(value, 'utf8').digest('hex');
}

function unique(values: readonly string[]): boolean {
  return new Set(values).size === values.length;
}

function sourceRepository(sourceRef: string): string | null {
  const separator = sourceRef.indexOf(':');
  if (separator <= 0) return null;
  return sourceRef.slice(0, separator);
}

function maturityPayload(
  recordId: `rec_${string}`,
  revisionId: RevisionId,
  candidate: CurrentEvidenceMaturityCandidate,
): MaturityPayload {
  return {
    schemaVersion: 'governance.maturity/v0',
    targetRef: { type: 'record', recordId },
    basisRef: { type: 'pinned-record', recordId, revisionId },
    stage: candidate.maturity.stage!,
    rationale: candidate.maturity.rationale,
  };
}

function historicalMaturityPayload(legacy: LegacyGovernanceAssignment): MaturityPayload | null {
  if (legacy.kind !== 'governance.maturity' || !legacy.stage || !isRecordId(legacy.targetRecordId)) return null;
  return {
    schemaVersion: 'governance.maturity/v0',
    targetRef: { type: 'record', recordId: legacy.targetRecordId },
    basisRef: {
      type: 'pinned-record',
      recordId: legacy.targetRecordId,
      revisionId: legacy.basisRevisionId as RevisionId,
    },
    stage: legacy.stage,
    rationale: legacy.rationale,
  };
}

function maturityRevision(
  governanceRecordId: `rec_${string}`,
  payload: MaturityPayload,
  generation: number,
  previousRevisionId: RevisionId | null,
): RecordRevision {
  const payloadDigest = `sha256_${sha256(serializeGovernancePayload('governance.maturity', payload))}` as PayloadDigest;
  const material = {
    identitySchemaVersion: IDENTITY_SCHEMA_VERSION,
    recordId: governanceRecordId,
    kind: 'governance.maturity' as const,
    generation,
    previousRevisionId,
    lifecycle: 'active' as const,
    payloadDigest,
  };
  const revisionId = `rev_sha256_${sha256(serializeRevisionMaterial(material))}` as RevisionId;
  return { ...material, revisionId };
}

export function materializeCurrentEvidenceMaturity(
  manifest: CurrentEvidenceMaturityManifest = currentEvidenceMaturityManifestJson as CurrentEvidenceMaturityManifest,
  candidates: readonly CurrentEvidenceMaturityCandidate[] = CURRENT_EVIDENCE_MATURITY_CANDIDATES,
): CurrentEvidenceMaturityMaterialization {
  const errors: string[] = [];
  const current = materializeCurrentSystemRevisions();
  errors.push(...current.errors.map((error) => `current-revision:${error}`));

  if (manifest.schemaVersion !== CURRENT_EVIDENCE_MATURITY_SCHEMA_VERSION) errors.push('manifest-schema-version');
  if (manifest.materialization.currentSuccessorSystemCount !== current.successors.length) errors.push('successor-count-contract');
  if (manifest.materialization.evidenceCandidateCount !== candidates.length) errors.push('candidate-count-contract');

  const successorBySubject = new Map(current.successors.map((entry) => [entry.subjectKey, entry]));
  const successorByRecordId = new Map(current.successors.map((entry) => [entry.recordId, entry]));
  const candidateSubjects = candidates.map((candidate) => candidate.subjectKey);
  if (!unique(candidateSubjects)) errors.push('duplicate-candidate-subject');

  const legacyGovernance = (coreEditorialSurfacesJson as CoreEditorialSurfacesManifest).governanceAssignments;
  const legacyGovernanceById = new Map(legacyGovernance.map((entry) => [entry.governanceRecordId, entry]));
  const occupiedSystemRecordIds = new Set(current.records.map((record) => record.recordId));

  const revisionIndex: GovernanceRevisionIndexEntry[] = current.records.flatMap((record) =>
    record.revisions.map((entry) => ({
      recordId: entry.revision.recordId,
      revisionId: entry.revision.revisionId,
      kind: entry.revision.kind,
      lifecycle: entry.revision.lifecycle,
    })),
  );

  const observations: ResolvedCurrentEvidenceObservation[] = [];
  const maturityRecords: MaterializedCurrentMaturityRecord[] = [];
  const governanceIds = new Set<string>();

  for (const candidate of candidates) {
    const successor = successorBySubject.get(candidate.subjectKey);
    if (!successor) {
      errors.push(`candidate-without-current-successor:${candidate.subjectKey}`);
      continue;
    }
    if (candidate.observations.length === 0) {
      errors.push(`candidate-without-observation:${candidate.subjectKey}`);
    }

    const temporalByRepo = new Map(successor.temporalBasis.map((entry) => [entry.repo, entry]));
    for (const observation of candidate.observations) {
      if (!['supports', 'qualifies', 'contradicts'].includes(observation.relation)) {
        errors.push(`observation-relation:${candidate.subjectKey}`);
        continue;
      }
      if (observation.statement.trim().length === 0) {
        errors.push(`observation-statement:${candidate.subjectKey}`);
        continue;
      }
      const repository = sourceRepository(observation.sourceRef);
      if (!repository) {
        errors.push(`observation-source-ref:${candidate.subjectKey}:${observation.sourceRef}`);
        continue;
      }
      const temporal = temporalByRepo.get(repository);
      if (!temporal) {
        errors.push(`observation-source-outside-temporal-basis:${candidate.subjectKey}:${repository}`);
        continue;
      }
      if (temporal.state !== 'material' || !temporal.observedHead || !/^[0-9a-f]{40}$/.test(temporal.observedHead)) {
        errors.push(`observation-source-not-material:${candidate.subjectKey}:${repository}`);
        continue;
      }
      observations.push({
        subjectKey: candidate.subjectKey,
        relation: observation.relation,
        sourceRef: observation.sourceRef,
        statement: observation.statement,
        repository,
        observedHead: temporal.observedHead,
        observedAt: temporal.observedAt,
        censusContractId: temporal.censusContractId,
        visibility: temporal.visibility,
      });
    }

    const hasStage = candidate.maturity.stage !== null;
    const hasGovernanceId = candidate.maturity.governanceRecordId !== null;
    if (hasStage !== hasGovernanceId) {
      errors.push(`maturity-stage-id-pair:${candidate.subjectKey}`);
      continue;
    }
    if (!hasStage) continue;

    const governanceRecordId = candidate.maturity.governanceRecordId!;
    if (!isRecordId(governanceRecordId)) {
      errors.push(`invalid-governance-record-id:${candidate.subjectKey}`);
      continue;
    }
    if (occupiedSystemRecordIds.has(governanceRecordId) || governanceIds.has(governanceRecordId)) {
      errors.push(`governance-record-id-collision:${candidate.subjectKey}`);
      continue;
    }
    governanceIds.add(governanceRecordId);

    const payload = maturityPayload(
      successor.recordId as `rec_${string}`,
      successor.revision.revisionId,
      candidate,
    );
    const resolutionErrors = validateGovernanceResolution('governance.maturity', payload, revisionIndex);
    if (resolutionErrors.length > 0) {
      errors.push(...resolutionErrors.map((error) => `${candidate.subjectKey}:${error}`));
      continue;
    }

    const legacy = legacyGovernanceById.get(governanceRecordId);
    if (legacy) {
      if (legacy.kind !== 'governance.maturity') {
        errors.push(`governance-record-kind-collision:${candidate.subjectKey}`);
        continue;
      }
      if (legacy.targetRecordId !== successor.recordId) {
        errors.push(`maturity-lineage-target-mismatch:${candidate.subjectKey}`);
        continue;
      }

      const previousPayload = historicalMaturityPayload(legacy);
      if (!previousPayload) {
        errors.push(`historical-maturity-payload:${candidate.subjectKey}`);
        continue;
      }
      const previousResolutionErrors = validateGovernanceResolution('governance.maturity', previousPayload, revisionIndex);
      if (previousResolutionErrors.length > 0) {
        errors.push(...previousResolutionErrors.map((error) => `${candidate.subjectKey}:historical:${error}`));
        continue;
      }
      const previousRevision = maturityRevision(governanceRecordId, previousPayload, 0, null);
      const previousBirthErrors = validateBirth(previousRevision);
      if (previousBirthErrors.length > 0) {
        errors.push(...previousBirthErrors.map((error) => `${candidate.subjectKey}:historical-birth:${error}`));
        continue;
      }
      const continuityErrors = validateMaturityContinuity(previousPayload, payload);
      if (continuityErrors.length > 0) {
        errors.push(...continuityErrors.map((error) => `${candidate.subjectKey}:maturity-continuity:${error}`));
        continue;
      }

      const revision = maturityRevision(governanceRecordId, payload, 1, previousRevision.revisionId);
      const successorErrors = validateSuccessor(previousRevision, revision);
      if (successorErrors.length > 0) {
        errors.push(...successorErrors.map((error) => `${candidate.subjectKey}:successor:${error}`));
        continue;
      }

      maturityRecords.push({
        subjectKey: candidate.subjectKey,
        governanceRecordId,
        targetRef: payload.basisRef,
        stage: payload.stage,
        confidence: candidate.maturity.confidence,
        materializationKind: 'successor',
        previousGovernanceRevisionId: previousRevision.revisionId,
        revision,
        payload,
      });
      continue;
    }

    const revision = maturityRevision(governanceRecordId, payload, 0, null);
    const birthErrors = validateBirth(revision);
    if (birthErrors.length > 0) {
      errors.push(...birthErrors.map((error) => `${candidate.subjectKey}:birth:${error}`));
      continue;
    }

    maturityRecords.push({
      subjectKey: candidate.subjectKey,
      governanceRecordId,
      targetRef: payload.basisRef,
      stage: payload.stage,
      confidence: candidate.maturity.confidence,
      materializationKind: 'birth',
      previousGovernanceRevisionId: null,
      revision,
      payload,
    });
  }

  for (const successor of current.successors) {
    if (!candidateSubjects.includes(successor.subjectKey)) {
      errors.push(`current-successor-without-candidate:${successor.subjectKey}`);
    }
  }

  const maturityEntries: CurrentGovernanceEntry<MaturityPayload>[] = maturityRecords.map((record) => ({
    governanceRecordId: record.governanceRecordId,
    lifecycle: 'active',
    payload: record.payload,
  }));

  const maturityResolutions: CurrentMaturityResolution[] = candidates.flatMap((candidate) => {
    const successor = successorBySubject.get(candidate.subjectKey);
    if (!successor) return [];
    const targetRef: PinnedRecordRef = {
      type: 'pinned-record',
      recordId: successor.recordId as `rec_${string}`,
      revisionId: successor.revision.revisionId,
    };
    const projection = deriveGovernanceProjection(targetRef, maturityEntries);
    const stage = projection.state === 'classified' ? projection.payload.stage : null;

    if (candidate.maturity.stage === null && projection.state !== 'unclassified') {
      errors.push(`unexpected-maturity-classification:${candidate.subjectKey}`);
    }
    if (candidate.maturity.stage !== null && (projection.state !== 'classified' || stage !== candidate.maturity.stage)) {
      errors.push(`maturity-classification-mismatch:${candidate.subjectKey}`);
    }

    return [{ subjectKey: candidate.subjectKey, targetRef, state: projection.state, stage }];
  });

  let staleMaturityInheritanceCount = 0;
  for (const legacy of legacyGovernance.filter((entry) => entry.kind === 'governance.maturity')) {
    const currentTarget = successorByRecordId.get(legacy.targetRecordId);
    if (currentTarget && currentTarget.revision.revisionId === legacy.basisRevisionId) {
      staleMaturityInheritanceCount += 1;
      errors.push(`legacy-maturity-silently-inherited:${legacy.targetRecordId}`);
    }
  }

  const supportCount = observations.filter((entry) => entry.relation === 'supports').length;
  const qualificationCount = observations.filter((entry) => entry.relation === 'qualifies').length;
  const contradictionCount = observations.filter((entry) => entry.relation === 'contradicts').length;
  const classifiedCount = maturityResolutions.filter((entry) => entry.state === 'classified').length;
  const unclassifiedCount = maturityResolutions.filter((entry) => entry.state === 'unclassified').length;
  const conflictCount = maturityResolutions.filter((entry) => entry.state === 'conflict').length;
  const birthCount = maturityRecords.filter((entry) => entry.materializationKind === 'birth').length;
  const successorCount = maturityRecords.filter((entry) => entry.materializationKind === 'successor').length;
  const maturityIdentityReplacementCount = maturityRecords.filter((entry) =>
    entry.materializationKind === 'successor'
    && entry.previousGovernanceRevisionId === null,
  ).length;

  if (observations.length !== manifest.materialization.observationCount) errors.push('observation-count-contract');
  if (supportCount !== manifest.materialization.supportObservationCount) errors.push('support-count-contract');
  if (qualificationCount !== manifest.materialization.qualificationObservationCount) errors.push('qualification-count-contract');
  if (contradictionCount !== manifest.materialization.contradictionObservationCount) errors.push('contradiction-count-contract');
  if (classifiedCount !== manifest.materialization.maturityClassifiedCount) errors.push('classified-count-contract');
  if (unclassifiedCount !== manifest.materialization.maturityUnclassifiedCount) errors.push('unclassified-count-contract');
  if (birthCount !== manifest.materialization.maturityGovernanceBirthCount) errors.push('governance-birth-count-contract');
  if (successorCount !== manifest.materialization.maturityGovernanceSuccessorCount) errors.push('governance-successor-count-contract');
  if (staleMaturityInheritanceCount !== manifest.acceptance.staleMaturityInheritanceCount) errors.push('stale-inheritance-count-contract');
  if (maturityIdentityReplacementCount !== manifest.acceptance.maturityIdentityReplacementCount) errors.push('maturity-identity-replacement-count-contract');
  if (conflictCount !== manifest.acceptance.maturityConflictCount) errors.push('maturity-conflict-count-contract');

  const actualStageCounts: Partial<Record<MaturityStage, number>> = {};
  for (const record of maturityRecords) {
    actualStageCounts[record.stage] = (actualStageCounts[record.stage] ?? 0) + 1;
  }
  for (const [stage, expected] of Object.entries(manifest.materialization.maturityStageCounts)) {
    if (actualStageCounts[stage as MaturityStage] !== expected) errors.push(`stage-count-contract:${stage}`);
  }

  return {
    observations,
    maturityRecords,
    maturityResolutions,
    errors: [...new Set(errors)],
  };
}
