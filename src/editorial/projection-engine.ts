import {
  type PinnedRecordRef,
  type RecordId,
  type RecordKind,
  type RecordLifecycle,
  type RevisionId,
} from '../app/data/editorial-record-identity';
import {
  mayProjectPublicly,
  validateDisclosurePayload,
  type DisclosureMode,
  type DisclosurePayload,
  type EvidenceAvailability,
  type GovernanceProjection,
  type MaturityPayload,
  type MaturityStage,
  type SourceAvailability,
} from '../app/data/editorial-visibility-maturity-disclosure';
import {
  canonicalUrlForPath,
  type LanguageTag,
  type RouteIdentityResolution,
} from '../app/data/editorial-route-language-identity';

export const PROJECTION_ENGINE_SCHEMA_VERSION = 'editorial-projection-engine/v0' as const;
export const PUBLIC_PROJECTION_SCHEMA_VERSION = 'editorial-public-record-projection/v0' as const;

export interface ProjectionTargetHead {
  recordId: RecordId;
  revisionId: RevisionId;
  kind: RecordKind;
  lifecycle: RecordLifecycle;
}

export type ProjectedMaturity =
  | { state: 'not-applicable' }
  | { state: 'unclassified' }
  | { state: 'conflict' }
  | { state: 'classified'; stage: MaturityStage };

export interface PublicRecordProjectionDto {
  schemaVersion: typeof PUBLIC_PROJECTION_SCHEMA_VERSION;
  targetRef: PinnedRecordRef;
  kind: RecordKind;
  lifecycle: 'active' | 'archived';
  language: LanguageTag;
  canonicalPath: string;
  canonicalUrl: string;
  disclosure: {
    mode: Exclude<DisclosureMode, 'withheld'>;
    source: SourceAvailability;
    evidence: EvidenceAvailability;
  };
  maturity: ProjectedMaturity;
  contentPolicy: {
    mode: Exclude<DisclosureMode, 'withheld'>;
    payloadIncluded: false;
    runtimeSanitizationAllowed: false;
  };
}

export type ProjectionOmissionReason =
  | 'target-lifecycle-ineligible'
  | 'disclosure-unclassified'
  | 'disclosure-conflict'
  | 'disclosure-invalid'
  | 'disclosure-target-mismatch'
  | 'record-private'
  | 'record-withheld'
  | 'route-unresolved'
  | 'route-head-unavailable'
  | 'language-unavailable'
  | 'route-conflict'
  | 'route-target-mismatch'
  | 'route-invalid-canonical-path';

export type PublicProjectionDecision =
  | {
      state: 'omitted';
      targetRef: PinnedRecordRef;
      reasons: ProjectionOmissionReason[];
    }
  | {
      state: 'redirect';
      targetRef: PinnedRecordRef;
      language: LanguageTag;
      canonicalPath: string;
      canonicalUrl: string;
    }
  | {
      state: 'projected';
      dto: PublicRecordProjectionDto;
    };

export interface PublicProjectionInput {
  target: ProjectionTargetHead;
  disclosure: GovernanceProjection<DisclosurePayload>;
  maturity: GovernanceProjection<MaturityPayload> | null;
  route: RouteIdentityResolution;
}

function samePinnedRef(left: PinnedRecordRef, right: PinnedRecordRef): boolean {
  return left.recordId === right.recordId && left.revisionId === right.revisionId;
}

function targetRef(target: ProjectionTargetHead): PinnedRecordRef {
  return {
    type: 'pinned-record',
    recordId: target.recordId,
    revisionId: target.revisionId,
  };
}

function currentProjectableLifecycle(target: ProjectionTargetHead): 'active' | 'archived' | null {
  return target.lifecycle === 'active' || target.lifecycle === 'archived'
    ? target.lifecycle
    : null;
}

function isCurrentDisclosure(
  target: ProjectionTargetHead,
  disclosure: GovernanceProjection<DisclosurePayload>,
): disclosure is Extract<GovernanceProjection<DisclosurePayload>, { state: 'classified' }> {
  if (disclosure.state !== 'classified') return false;
  const current = targetRef(target);
  return disclosure.payload.targetRef.recordId === target.recordId
    && samePinnedRef(disclosure.payload.basisRef, current);
}

function projectMaturity(
  target: ProjectionTargetHead,
  maturity: GovernanceProjection<MaturityPayload> | null,
): ProjectedMaturity {
  if (target.kind !== 'knowledge.system') return { state: 'not-applicable' };
  if (!maturity || maturity.state === 'unclassified') return { state: 'unclassified' };
  if (maturity.state === 'conflict') return { state: 'conflict' };

  const current = targetRef(target);
  if (
    maturity.payload.targetRef.recordId !== target.recordId
    || !samePinnedRef(maturity.payload.basisRef, current)
  ) {
    return { state: 'unclassified' };
  }

  return { state: 'classified', stage: maturity.payload.stage };
}

function routeFailureReason(route: Exclude<RouteIdentityResolution, { state: 'resolved' }>): ProjectionOmissionReason {
  if (route.state === 'unresolved') return 'route-unresolved';
  if (route.state === 'head-unavailable') return 'route-head-unavailable';
  if (route.state === 'language-unavailable') return 'language-unavailable';
  return 'route-conflict';
}

function uniqueReasons(reasons: readonly ProjectionOmissionReason[]): ProjectionOmissionReason[] {
  return [...new Set(reasons)];
}

export function projectPublicRecord(input: PublicProjectionInput): PublicProjectionDecision {
  const current = targetRef(input.target);
  const lifecycle = currentProjectableLifecycle(input.target);
  const reasons: ProjectionOmissionReason[] = [];

  if (lifecycle === null) reasons.push('target-lifecycle-ineligible');

  if (input.disclosure.state === 'unclassified') {
    reasons.push('disclosure-unclassified');
  } else if (input.disclosure.state === 'conflict') {
    reasons.push('disclosure-conflict');
  } else {
    const disclosureErrors = validateDisclosurePayload(input.disclosure.payload);
    if (disclosureErrors.length > 0) reasons.push('disclosure-invalid');
    if (!isCurrentDisclosure(input.target, input.disclosure)) {
      reasons.push('disclosure-target-mismatch');
    } else {
      if (input.disclosure.payload.visibility.record === 'private') reasons.push('record-private');
      if (input.disclosure.payload.disclosure === 'withheld') reasons.push('record-withheld');
      if (!mayProjectPublicly(input.target.lifecycle, input.disclosure)) {
        if (lifecycle !== null
          && input.disclosure.payload.visibility.record !== 'private'
          && input.disclosure.payload.disclosure !== 'withheld') {
          reasons.push('disclosure-invalid');
        }
      }
    }
  }

  if (input.route.state !== 'resolved') {
    reasons.push(routeFailureReason(input.route));
  } else {
    if (!samePinnedRef(input.route.targetRef, current)) reasons.push('route-target-mismatch');
    if (canonicalUrlForPath(input.route.canonicalPath) === null) reasons.push('route-invalid-canonical-path');
  }

  const omissionReasons = uniqueReasons(reasons);
  if (omissionReasons.length > 0) {
    return { state: 'omitted', targetRef: current, reasons: omissionReasons };
  }

  if (input.disclosure.state !== 'classified' || input.route.state !== 'resolved' || lifecycle === null) {
    return { state: 'omitted', targetRef: current, reasons: ['disclosure-invalid'] };
  }

  const canonicalUrl = canonicalUrlForPath(input.route.canonicalPath);
  if (canonicalUrl === null) {
    return { state: 'omitted', targetRef: current, reasons: ['route-invalid-canonical-path'] };
  }

  if (input.route.redirect) {
    return {
      state: 'redirect',
      targetRef: current,
      language: input.route.language,
      canonicalPath: input.route.canonicalPath,
      canonicalUrl,
    };
  }

  const mode = input.disclosure.payload.disclosure;
  if (mode === 'withheld') {
    return { state: 'omitted', targetRef: current, reasons: ['record-withheld'] };
  }

  return {
    state: 'projected',
    dto: {
      schemaVersion: PUBLIC_PROJECTION_SCHEMA_VERSION,
      targetRef: current,
      kind: input.target.kind,
      lifecycle,
      language: input.route.language,
      canonicalPath: input.route.canonicalPath,
      canonicalUrl,
      disclosure: {
        mode,
        source: input.disclosure.payload.visibility.source,
        evidence: input.disclosure.payload.visibility.evidence,
      },
      maturity: projectMaturity(input.target, input.maturity),
      contentPolicy: {
        mode,
        payloadIncluded: false,
        runtimeSanitizationAllowed: false,
      },
    },
  };
}

export function projectionContainsCanonicalPayload(decision: PublicProjectionDecision): boolean {
  if (decision.state !== 'projected') return false;
  return decision.dto.contentPolicy.payloadIncluded;
}
