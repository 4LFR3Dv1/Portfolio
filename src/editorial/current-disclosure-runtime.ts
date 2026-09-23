import { createHash } from 'node:crypto';
import currentDisclosureManifestJson from '../../docs/editorial/R1-A2.5-current-disclosure.v0.json';
import coreEditorialSurfacesJson from '../../docs/editorial/core-editorial-surfaces.v0.json';
import { CURRENT_DISCLOSURE_CANDIDATES, type CurrentDisclosureCandidate } from './current-disclosure-candidates';
import { materializeCurrentSystemRevisions } from './current-revision-runtime';
import { materializeCurrentEvidenceMaturity } from './current-evidence-maturity-runtime';
import {
  deriveGovernanceProjection,
  serializeGovernancePayload,
  validateDisclosureContinuity,
  validateGovernanceResolution,
  type CurrentGovernanceEntry,
  type DisclosureMode,
  type DisclosurePayload,
  type EvidenceAvailability,
  type GovernanceRevisionIndexEntry,
  type RecordVisibility,
  type SourceAvailability,
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

export const CURRENT_DISCLOSURE_SCHEMA_VERSION = 'editorial-current-disclosure/v0' as const;

export interface CurrentDisclosureManifest {
  schemaVersion: typeof CURRENT_DISCLOSURE_SCHEMA_VERSION;
  contractId: string;
  status: 'materialized-awaiting-ci' | 'complete';
  normative: true;
  baseline: string;
  preconditions: {
    r1_a2_3Complete: true;
    r1_a2_4Complete: true;
    currentRevisionMaterializationComplete: true;
    evidenceMaturityReconciliationComplete: true;
  };
  sources: {
    currentRevisions: string;
    currentEvidenceMaturity: string;
    currentCensus: string;
    candidates: string;
    runtime: string;
    governanceContract: string;
    historicalGovernance: string;
  };
  laws: {
    disclosureDecisionRequiredForEveryCurrentSuccessor: true;
    repositoryVisibilityDoesNotDetermineRecordVisibility: true;
    maturityDoesNotDetermineDisclosure: true;
    observationDoesNotDetermineDisclosure: true;
    sourceAvailabilityDerivedFromTemporalBasis: true;
    evidenceAvailabilityDerivedFromCurrentObservations: true;
    privateSourceMayRemainPrivateBehindPublicRecord: true;
    publicRecordDoesNotAuthorizeSourceDisclosure: true;
    existingDisclosureGovernanceIdentityMustContinue: true;
    deferredHistoricalRecordDoesNotReceiveCurrentDisclosureByInference: true;
    disclosureImpliesRoute: false;
    disclosureImpliesSurfaceMembership: false;
  };
  materialization: {
    currentSuccessorSystemCount: number;
    deferredSystemCount: number;
    deferredSubjectKeys: string[];
    disclosureCandidateCount: number;
    publicRecordCount: number;
    privateRecordCount: number;
    disclosureModeCounts: Partial<Record<DisclosureMode, number>>;
    sourceAvailabilityCounts: Partial<Record<SourceAvailability, number>>;
    evidenceAvailabilityCounts: Partial<Record<EvidenceAvailability, number>>;
    disclosureGovernanceBirthCount: number;
    disclosureGovernanceSuccessorCount: number;
    historicalDeferredDisclosureCount: number;
  };
  acceptance: {
    allCurrentSuccessorsClassified: boolean;
    disclosureConflictCount: number;
    disclosureUnclassifiedCount: number;
    disclosureIdentityReplacementCount: number;
    privateSourcePromotedToPublicCount: number;
    maturityDerivedDisclosureCount: number;
    routeMutationCount: 0;
    publicSurfaceMutationCount: 0;
    productionMutationCount: 0;
    r1_a2_5Complete: boolean;
    nextRequiredAction: string;
  };
}

interface LegacyGovernanceAssignment {
  governanceRecordId: string;
  kind: 'governance.disclosure' | 'governance.maturity';
  targetRecordId: string;
  basisRevisionId: string;
  visibility?: {
    record: RecordVisibility;
    source: SourceAvailability;
    evidence: EvidenceAvailability;
  };
  disclosure?: DisclosureMode;
  rationale: string;
}

interface CoreEditorialSurfacesManifest {
  governanceAssignments: LegacyGovernanceAssignment[];
}

export interface MaterializedCurrentDisclosureRecord {
  subjectKey: string;
  governanceRecordId: `rec_${string}`;
  targetRef: PinnedRecordRef;
  materializationKind: 'birth' | 'successor';
  previousGovernanceRevisionId: RevisionId | null;
  revision: RecordRevision;
  payload: DisclosurePayload;
}

export interface CurrentDisclosureResolution {
  subjectKey: string;
  targetRef: PinnedRecordRef;
  state: 'classified' | 'unclassified' | 'conflict';
  visibility: RecordVisibility | null;
  disclosure: DisclosureMode | null;
  source: SourceAvailability | null;
  evidence: EvidenceAvailability | null;
}

export interface CurrentDisclosureMaterialization {
  disclosureRecords: MaterializedCurrentDisclosureRecord[];
  resolutions: CurrentDisclosureResolution[];
  errors: string[];
}

function sha256(value: string): string {
  return createHash('sha256').update(value, 'utf8').digest('hex');
}

function unique(values: readonly string[]): boolean {
  return new Set(values).size === values.length;
}

function sourceAvailability(visibilities: readonly ('public' | 'private')[]): SourceAvailability {
  const uniqueValues = new Set(visibilities);
  if (uniqueValues.size === 1 && uniqueValues.has('public')) return 'public';
  if (uniqueValues.size === 1 && uniqueValues.has('private')) return 'private';
  return 'partial';
}

function evidenceAvailability(visibilities: readonly ('public' | 'private')[]): EvidenceAvailability {
  const uniqueValues = new Set(visibilities);
  if (uniqueValues.size === 0) return 'none';
  if (uniqueValues.size === 1 && uniqueValues.has('public')) return 'public';
  if (uniqueValues.size === 1 && uniqueValues.has('private')) return 'private';
  return 'partial';
}

function disclosurePayload(
  candidate: CurrentDisclosureCandidate,
  targetRef: PinnedRecordRef,
  source: SourceAvailability,
  evidence: EvidenceAvailability,
): DisclosurePayload {
  return {
    schemaVersion: 'governance.disclosure/v0',
    targetRef: { type: 'record', recordId: targetRef.recordId },
    basisRef: targetRef,
    visibility: {
      record: candidate.recordVisibility,
      source,
      evidence,
    },
    disclosure: candidate.disclosure,
    rationale: candidate.rationale,
  };
}

function historicalDisclosurePayload(legacy: LegacyGovernanceAssignment): DisclosurePayload | null {
  if (
    legacy.kind !== 'governance.disclosure'
    || !legacy.visibility
    || !legacy.disclosure
    || !isRecordId(legacy.targetRecordId)
  ) return null;

  return {
    schemaVersion: 'governance.disclosure/v0',
    targetRef: { type: 'record', recordId: legacy.targetRecordId },
    basisRef: {
      type: 'pinned-record',
      recordId: legacy.targetRecordId,
      revisionId: legacy.basisRevisionId as RevisionId,
    },
    visibility: legacy.visibility,
    disclosure: legacy.disclosure,
    rationale: legacy.rationale,
  };
}

function disclosureRevision(
  governanceRecordId: `rec_${string}`,
  payload: DisclosurePayload,
  generation: number,
  previousRevisionId: RevisionId | null,
): RecordRevision {
  const payloadDigest = `sha256_${sha256(serializeGovernancePayload('governance.disclosure', payload))}` as PayloadDigest;
  const material = {
    identitySchemaVersion: IDENTITY_SCHEMA_VERSION,
    recordId: governanceRecordId,
    kind: 'governance.disclosure' as const,
    generation,
    previousRevisionId,
    lifecycle: 'active' as const,
    payloadDigest,
  };
  const revisionId = `rev_sha256_${sha256(serializeRevisionMaterial(material))}` as RevisionId;
  return { ...material, revisionId };
}

export function materializeCurrentDisclosure(
  manifest: CurrentDisclosureManifest = currentDisclosureManifestJson as CurrentDisclosureManifest,
  candidates: readonly CurrentDisclosureCandidate[] = CURRENT_DISCLOSURE_CANDIDATES,
): CurrentDisclosureMaterialization {
  const errors: string[] = [];
  const current = materializeCurrentSystemRevisions();
  const evidenceMaturity = materializeCurrentEvidenceMaturity();
  errors.push(...current.errors.map((error) => `current-revision:${error}`));
  errors.push(...evidenceMaturity.errors.map((error) => `evidence-maturity:${error}`));

  if (manifest.schemaVersion !== CURRENT_DISCLOSURE_SCHEMA_VERSION) errors.push('manifest-schema-version');
  if (manifest.materialization.currentSuccessorSystemCount !== current.successors.length) errors.push('successor-count-contract');
  if (manifest.materialization.disclosureCandidateCount !== candidates.length) errors.push('candidate-count-contract');
  if (!unique(candidates.map((candidate) => candidate.subjectKey))) errors.push('duplicate-candidate-subject');
  if (!unique(candidates.map((candidate) => candidate.governanceRecordId))) errors.push('duplicate-governance-record-id');

  const successorBySubject = new Map(current.successors.map((entry) => [entry.subjectKey, entry]));
  const legacyGovernance = (coreEditorialSurfacesJson as CoreEditorialSurfacesManifest).governanceAssignments;
  const legacyById = new Map(legacyGovernance.map((entry) => [entry.governanceRecordId, entry]));
  const legacyDisclosureByTarget = new Map(
    legacyGovernance
      .filter((entry) => entry.kind === 'governance.disclosure')
      .map((entry) => [entry.targetRecordId, entry]),
  );

  const occupiedSystemRecordIds = new Set(current.records.map((record) => record.recordId));
  const occupiedMaturityGovernanceIds = new Set(evidenceMaturity.maturityRecords.map((record) => record.governanceRecordId));
  const usedGovernanceIds = new Set<string>();
  const revisionIndex: GovernanceRevisionIndexEntry[] = current.records.flatMap((record) =>
    record.revisions.map((entry) => ({
      recordId: entry.revision.recordId,
      revisionId: entry.revision.revisionId,
      kind: entry.revision.kind,
      lifecycle: entry.revision.lifecycle,
    })),
  );

  const observationsBySubject = new Map<string, ('public' | 'private')[]>();
  for (const observation of evidenceMaturity.observations) {
    const values = observationsBySubject.get(observation.subjectKey) ?? [];
    values.push(observation.visibility);
    observationsBySubject.set(observation.subjectKey, values);
  }

  const disclosureRecords: MaterializedCurrentDisclosureRecord[] = [];

  for (const candidate of candidates) {
    const successor = successorBySubject.get(candidate.subjectKey);
    if (!successor) {
      errors.push(`candidate-without-current-successor:${candidate.subjectKey}`);
      continue;
    }
    if (!isRecordId(candidate.governanceRecordId)) {
      errors.push(`invalid-governance-record-id:${candidate.subjectKey}`);
      continue;
    }
    if (
      occupiedSystemRecordIds.has(candidate.governanceRecordId)
      || occupiedMaturityGovernanceIds.has(candidate.governanceRecordId)
      || usedGovernanceIds.has(candidate.governanceRecordId)
    ) {
      errors.push(`governance-record-id-collision:${candidate.subjectKey}`);
      continue;
    }
    usedGovernanceIds.add(candidate.governanceRecordId);

    const historicalTargetDisclosure = legacyDisclosureByTarget.get(successor.recordId);
    if (historicalTargetDisclosure && historicalTargetDisclosure.governanceRecordId !== candidate.governanceRecordId) {
      errors.push(`disclosure-lineage-replacement:${candidate.subjectKey}`);
      continue;
    }

    const materialTemporalVisibilities = successor.temporalBasis
      .filter((entry) => entry.state === 'material')
      .map((entry) => entry.visibility);
    if (materialTemporalVisibilities.length === 0) {
      errors.push(`no-material-source-basis:${candidate.subjectKey}`);
      continue;
    }
    const observedEvidenceVisibilities = observationsBySubject.get(candidate.subjectKey) ?? [];
    if (observedEvidenceVisibilities.length === 0) {
      errors.push(`no-current-observation:${candidate.subjectKey}`);
      continue;
    }

    const targetRef: PinnedRecordRef = {
      type: 'pinned-record',
      recordId: successor.recordId as `rec_${string}`,
      revisionId: successor.revision.revisionId,
    };
    const payload = disclosurePayload(
      candidate,
      targetRef,
      sourceAvailability(materialTemporalVisibilities),
      evidenceAvailability(observedEvidenceVisibilities),
    );
    const resolutionErrors = validateGovernanceResolution('governance.disclosure', payload, revisionIndex);
    if (resolutionErrors.length > 0) {
      errors.push(...resolutionErrors.map((error) => `${candidate.subjectKey}:${error}`));
      continue;
    }

    const legacy = legacyById.get(candidate.governanceRecordId);
    if (legacy) {
      if (legacy.kind !== 'governance.disclosure') {
        errors.push(`governance-record-kind-collision:${candidate.subjectKey}`);
        continue;
      }
      if (legacy.targetRecordId !== successor.recordId) {
        errors.push(`disclosure-lineage-target-mismatch:${candidate.subjectKey}`);
        continue;
      }

      const previousPayload = historicalDisclosurePayload(legacy);
      if (!previousPayload) {
        errors.push(`historical-disclosure-payload:${candidate.subjectKey}`);
        continue;
      }
      const previousResolutionErrors = validateGovernanceResolution('governance.disclosure', previousPayload, revisionIndex);
      if (previousResolutionErrors.length > 0) {
        errors.push(...previousResolutionErrors.map((error) => `${candidate.subjectKey}:historical:${error}`));
        continue;
      }
      const previousRevision = disclosureRevision(candidate.governanceRecordId, previousPayload, 0, null);
      const previousBirthErrors = validateBirth(previousRevision);
      if (previousBirthErrors.length > 0) {
        errors.push(...previousBirthErrors.map((error) => `${candidate.subjectKey}:historical-birth:${error}`));
        continue;
      }
      const continuityErrors = validateDisclosureContinuity(previousPayload, payload);
      if (continuityErrors.length > 0) {
        errors.push(...continuityErrors.map((error) => `${candidate.subjectKey}:disclosure-continuity:${error}`));
        continue;
      }

      const revision = disclosureRevision(candidate.governanceRecordId, payload, 1, previousRevision.revisionId);
      const successorErrors = validateSuccessor(previousRevision, revision);
      if (successorErrors.length > 0) {
        errors.push(...successorErrors.map((error) => `${candidate.subjectKey}:successor:${error}`));
        continue;
      }
      disclosureRecords.push({
        subjectKey: candidate.subjectKey,
        governanceRecordId: candidate.governanceRecordId,
        targetRef,
        materializationKind: 'successor',
        previousGovernanceRevisionId: previousRevision.revisionId,
        revision,
        payload,
      });
      continue;
    }

    const revision = disclosureRevision(candidate.governanceRecordId, payload, 0, null);
    const birthErrors = validateBirth(revision);
    if (birthErrors.length > 0) {
      errors.push(...birthErrors.map((error) => `${candidate.subjectKey}:birth:${error}`));
      continue;
    }
    disclosureRecords.push({
      subjectKey: candidate.subjectKey,
      governanceRecordId: candidate.governanceRecordId,
      targetRef,
      materializationKind: 'birth',
      previousGovernanceRevisionId: null,
      revision,
      payload,
    });
  }

  for (const successor of current.successors) {
    if (!candidates.some((candidate) => candidate.subjectKey === successor.subjectKey)) {
      errors.push(`current-successor-without-disclosure-decision:${successor.subjectKey}`);
    }
  }

  const governanceEntries: CurrentGovernanceEntry<DisclosurePayload>[] = disclosureRecords.map((record) => ({
    governanceRecordId: record.governanceRecordId,
    lifecycle: 'active',
    payload: record.payload,
  }));

  const resolutions: CurrentDisclosureResolution[] = current.successors.map((successor) => {
    const targetRef: PinnedRecordRef = {
      type: 'pinned-record',
      recordId: successor.recordId as `rec_${string}`,
      revisionId: successor.revision.revisionId,
    };
    const projection = deriveGovernanceProjection(targetRef, governanceEntries);
    if (projection.state !== 'classified') {
      return {
        subjectKey: successor.subjectKey,
        targetRef,
        state: projection.state,
        visibility: null,
        disclosure: null,
        source: null,
        evidence: null,
      };
    }
    return {
      subjectKey: successor.subjectKey,
      targetRef,
      state: 'classified',
      visibility: projection.payload.visibility.record,
      disclosure: projection.payload.disclosure,
      source: projection.payload.visibility.source,
      evidence: projection.payload.visibility.evidence,
    };
  });

  if (disclosureRecords.length !== candidates.length) errors.push('materialized-disclosure-count');
  if (disclosureRecords.filter((record) => record.materializationKind === 'birth').length !== manifest.materialization.disclosureGovernanceBirthCount) {
    errors.push('disclosure-birth-count');
  }
  if (disclosureRecords.filter((record) => record.materializationKind === 'successor').length !== manifest.materialization.disclosureGovernanceSuccessorCount) {
    errors.push('disclosure-successor-count');
  }

  return { disclosureRecords, resolutions, errors: [...new Set(errors)] };
}
