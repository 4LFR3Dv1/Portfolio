import { createHash } from 'node:crypto';
import currentPublicationAcceptanceJson from '../../docs/editorial/R1-A2.8-current-publication-acceptance.v0.json';
import reconciliationConstitutionJson from '../../docs/editorial/R1-A2-reconciliation-constitution.v0.json';
import a21CompletionJson from '../../docs/editorial/R1-A2.1-completion.v0.json';
import a22CompletionJson from '../../docs/editorial/R1-A2.2-completion.v0.json';
import a23CompletionJson from '../../docs/editorial/R1-A2.3-completion.v0.json';
import a24CompletionJson from '../../docs/editorial/R1-A2.4-completion.v0.json';
import a25CompletionJson from '../../docs/editorial/R1-A2.5-completion.v0.json';
import a26CompletionJson from '../../docs/editorial/R1-A2.6-completion.v0.json';
import a27CompletionJson from '../../docs/editorial/R1-A2.7-completion.v0.json';
import { materializeCurrentSystemRevisions } from './current-revision-runtime';
import { materializeCurrentEvidenceMaturity } from './current-evidence-maturity-runtime';
import { materializeCurrentDisclosure } from './current-disclosure-runtime';
import { materializeCurrentRouteAdmission } from './current-route-language-runtime';
import { materializeCurrentEditorialSurfaces } from './current-surface-runtime';

export const CURRENT_PUBLICATION_ACCEPTANCE_SCHEMA_VERSION = 'editorial-current-publication-acceptance/v0' as const;

type JsonValue = null | boolean | number | string | JsonValue[] | { [key: string]: JsonValue };

interface CompletionSeal {
  status: string;
  acceptance?: Record<string, unknown>;
  productionBoundary?: Record<string, unknown>;
}

interface ReconciliationConstitution {
  currentState: Record<string, boolean | number>;
  acceptance: Record<string, boolean | string>;
}

export interface CurrentPublicationAcceptanceManifest {
  schemaVersion: typeof CURRENT_PUBLICATION_ACCEPTANCE_SCHEMA_VERSION;
  contractId: string;
  status: 'materialized-awaiting-ci' | 'complete';
  normative: true;
  baseline: string;
  preconditions: {
    r1_a2_1Complete: true;
    r1_a2_2Complete: true;
    r1_a2_3Complete: true;
    r1_a2_4Complete: true;
    r1_a2_5Complete: true;
    r1_a2_6Complete: true;
    r1_a2_7Complete: true;
    currentPublicationValidBeforeAcceptance: false;
  };
  boundary: {
    currentPublicationAcceptanceOnly: true;
    semanticRepairAllowed: false;
    newRecordBirthAllowed: false;
    governanceMutationAllowed: false;
    routeMutationAllowed: false;
    surfaceSelectionMutationAllowed: false;
    distributionEmissionIncluded: false;
    deploymentMutationAllowed: false;
    cutoverReadinessIncluded: false;
    cutoverAuthorizationIncluded: false;
  };
  sources: Record<string, string>;
  expectedState: {
    completionSealCount: number;
    bornSystemRecordCount: number;
    currentSuccessorSystemCount: number;
    deferredCurrentSystemCount: number;
    evidenceObservationCount: number;
    maturityClassifiedCount: number;
    maturityUnclassifiedCount: number;
    disclosureClassifiedCount: number;
    publicFullDisclosureCount: number;
    currentRouteLanguagePairCount: number;
    currentLanguageBindingCount: number;
    totalRouteBindingCount: number;
    publicProjectionCount: number;
    semanticDocumentCount: number;
    coreSurfaceCount: number;
    systemsPerLanguage: number;
    researchPerLanguage: number;
    homeSystemsPerLanguage: number;
    homeResearchPerLanguage: number;
  };
  requiredZeroes: {
    recordIdentityReplacementCount: 0;
    maturityIdentityReplacementCount: 0;
    disclosureIdentityReplacementCount: 0;
    historicalPathDropCount: 0;
    historicalPathReassignmentCount: 0;
    historicalAdmissionBasisRewriteCount: 0;
    currentProjectionOmissionCount: 0;
    currentDocumentOmissionCount: 0;
    genericBirthSummaryEmissionCount: 0;
    crossLanguageIdentityDriftCount: 0;
    deferredCurrentSystemExposureCount: 0;
    privateSourceLocatorLeakCount: 0;
    privateEvidenceLocatorLeakCount: 0;
    rankingInferenceCount: 0;
    archiveInferenceCount: 0;
    productionMutationCount: 0;
  };
  specimen: {
    canonicalization: 'recursive-key-sorted-json-with-array-order-preserved';
    digestAlgorithm: 'sha256';
    acceptedPublicationDigest: string | null;
  };
  acceptance: {
    allPriorCutsSealed: boolean;
    endToEndReconstructionRequired: true;
    currentPublicationSpecimenDeterministic: true;
    publicationValidCandidate: boolean;
    r1_a2_8Complete: boolean;
    r1_a2Complete: boolean;
    currentPublicationValid: boolean;
    cutoverReady: false;
    cutoverAuthorized: false;
    cutoverEnacted: false;
    nextRequiredAction: string;
  };
}

export interface CurrentPublicationAcceptanceSnapshot {
  completionSealCount: number;
  allPriorCutsSealed: boolean;
  bornSystemRecordCount: number;
  currentSuccessorSystemCount: number;
  deferredCurrentSystemCount: number;
  evidenceObservationCount: number;
  maturityClassifiedCount: number;
  maturityUnclassifiedCount: number;
  disclosureClassifiedCount: number;
  publicFullDisclosureCount: number;
  currentRouteLanguagePairCount: number;
  currentLanguageBindingCount: number;
  totalRouteBindingCount: number;
  publicProjectionCount: number;
  semanticDocumentCount: number;
  coreSurfaceCount: number;
  systemsPerLanguage: number;
  researchPerLanguage: number;
  homeSystemsPerLanguage: number;
  homeResearchPerLanguage: number;
  recordIdentityReplacementCount: number;
  maturityIdentityReplacementCount: number;
  disclosureIdentityReplacementCount: number;
  historicalPathDropCount: number;
  historicalPathReassignmentCount: number;
  historicalAdmissionBasisRewriteCount: number;
  currentProjectionOmissionCount: number;
  currentDocumentOmissionCount: number;
  genericBirthSummaryEmissionCount: number;
  crossLanguageIdentityDriftCount: number;
  deferredCurrentSystemExposureCount: number;
  privateSourceLocatorLeakCount: number;
  privateEvidenceLocatorLeakCount: number;
  rankingInferenceCount: number;
  archiveInferenceCount: number;
  productionMutationCount: number;
}

export interface CurrentPublicationAcceptanceResult {
  state: 'ready' | 'conflict';
  publicationValidCandidate: boolean;
  publicationDigest: string;
  snapshot: CurrentPublicationAcceptanceSnapshot;
  errors: string[];
}

const priorCompletionSeals: CompletionSeal[] = [
  a21CompletionJson,
  a22CompletionJson,
  a23CompletionJson,
  a24CompletionJson,
  a25CompletionJson,
  a26CompletionJson,
  a27CompletionJson,
] as CompletionSeal[];

function canonicalJson(value: JsonValue): string {
  if (
    value === null
    || typeof value === 'boolean'
    || typeof value === 'number'
    || typeof value === 'string'
  ) {
    if (typeof value === 'number' && !Number.isFinite(value)) throw new Error('non-finite-number');
    return JSON.stringify(value) as string;
  }
  if (Array.isArray(value)) return `[${value.map((entry) => canonicalJson(entry)).join(',')}]`;
  const keys = Object.keys(value).sort();
  return `{${keys.map((key) => `${JSON.stringify(key)}:${canonicalJson(value[key])}`).join(',')}}`;
}

function sha256(value: string): string {
  return `sha256_${createHash('sha256').update(value, 'utf8').digest('hex')}`;
}

function compareCount(errors: string[], label: string, actual: number, expected: number): void {
  if (actual !== expected) errors.push(`${label}:${actual}:${expected}`);
}

function countCurrentSurfaceItems(
  surfaces: ReturnType<typeof materializeCurrentEditorialSurfaces>['surfaces'],
  id: 'systems' | 'research',
  language: 'en' | 'pt-BR',
): number {
  const surface = surfaces.find((entry) => entry.id === id && entry.language === language);
  return surface?.sections[0]?.items.length ?? -1;
}

function countHomeSectionItems(
  surfaces: ReturnType<typeof materializeCurrentEditorialSurfaces>['surfaces'],
  sectionId: 'systems' | 'research',
  language: 'en' | 'pt-BR',
): number {
  const home = surfaces.find((entry) => entry.id === 'home' && entry.language === language);
  return home?.sections.find((section) => section.id === sectionId)?.items.length ?? -1;
}

function countCrossLanguageIdentityDrift(
  surfaces: ReturnType<typeof materializeCurrentEditorialSurfaces>['surfaces'],
): number {
  const en = surfaces.find((entry) => entry.id === 'systems' && entry.language === 'en');
  const pt = surfaces.find((entry) => entry.id === 'systems' && entry.language === 'pt-BR');
  if (!en || !pt) return 1;
  const enItems = en.sections[0]?.items ?? [];
  const ptItems = pt.sections[0]?.items ?? [];
  if (enItems.length !== ptItems.length) return Math.abs(enItems.length - ptItems.length) + 1;
  let drift = 0;
  for (let index = 0; index < enItems.length; index += 1) {
    const left = enItems[index];
    const right = ptItems[index];
    if (
      left.subjectKey !== right.subjectKey
      || left.targetRef.recordId !== right.targetRef.recordId
      || left.targetRef.revisionId !== right.targetRef.revisionId
    ) drift += 1;
  }
  return drift;
}

function currentSurfaceSerialization(
  surfaces: ReturnType<typeof materializeCurrentEditorialSurfaces>,
): string {
  return canonicalJson(surfaces.surfaces as unknown as JsonValue);
}

export function evaluateCurrentPublicationAcceptance(
  manifest: CurrentPublicationAcceptanceManifest = currentPublicationAcceptanceJson as CurrentPublicationAcceptanceManifest,
): CurrentPublicationAcceptanceResult {
  const errors: string[] = [];
  const constitution = reconciliationConstitutionJson as ReconciliationConstitution;
  const current = materializeCurrentSystemRevisions();
  const evidenceMaturity = materializeCurrentEvidenceMaturity();
  const disclosure = materializeCurrentDisclosure();
  const routeAdmission = materializeCurrentRouteAdmission();
  const surfaces = materializeCurrentEditorialSurfaces();

  errors.push(...current.errors.map((error) => `current-revision:${error}`));
  errors.push(...evidenceMaturity.errors.map((error) => `current-evidence-maturity:${error}`));
  errors.push(...disclosure.errors.map((error) => `current-disclosure:${error}`));
  errors.push(...routeAdmission.errors.map((error) => `current-route:${error}`));
  errors.push(...surfaces.errors.map((error) => `current-surface:${error}`));

  if (manifest.schemaVersion !== CURRENT_PUBLICATION_ACCEPTANCE_SCHEMA_VERSION) errors.push('manifest-schema-version');
  if (manifest.status !== 'materialized-awaiting-ci' && manifest.status !== 'complete') errors.push('manifest-status');
  if (manifest.normative !== true) errors.push('manifest-normative');
  if (!manifest.boundary.currentPublicationAcceptanceOnly) errors.push('acceptance-boundary');
  if (manifest.boundary.semanticRepairAllowed) errors.push('semantic-repair-allowed');
  if (manifest.boundary.newRecordBirthAllowed) errors.push('new-record-birth-allowed');
  if (manifest.boundary.governanceMutationAllowed) errors.push('governance-mutation-allowed');
  if (manifest.boundary.routeMutationAllowed) errors.push('route-mutation-allowed');
  if (manifest.boundary.surfaceSelectionMutationAllowed) errors.push('surface-selection-mutation-allowed');
  if (manifest.boundary.distributionEmissionIncluded) errors.push('distribution-emission-included');
  if (manifest.boundary.deploymentMutationAllowed) errors.push('deployment-mutation-allowed');
  if (manifest.boundary.cutoverReadinessIncluded) errors.push('cutover-readiness-included');
  if (manifest.boundary.cutoverAuthorizationIncluded) errors.push('cutover-authorization-included');

  const allPriorCutsSealed = priorCompletionSeals.length === 7
    && priorCompletionSeals.every((seal) => seal.status === 'complete');

  const disclosureClassified = disclosure.resolutions.filter((entry) => entry.state === 'classified');
  const publicFullDisclosureCount = disclosureClassified.filter((entry) =>
    entry.visibility === 'public' && entry.disclosure === 'full').length;
  const semanticDocuments = surfaces.documents.filter((entry) =>
    entry.state === 'document' && entry.document.content.type === 'knowledge.system');
  const projectionOmissions = surfaces.projections.filter((entry) => entry.state === 'omitted').length;
  const documentOmissions = surfaces.documents.filter((entry) => entry.state === 'omitted').length;
  const genericBirthSummary = (reconciliationConstitutionJson as { discovery: { genericBirthSummary: string } }).discovery.genericBirthSummary;
  const genericBirthSummaryEmissionCount = semanticDocuments.filter((entry) =>
    entry.state === 'document'
    && entry.document.content.type === 'knowledge.system'
    && entry.document.content.summary === genericBirthSummary).length;

  const exposedCurrentRecordIds = new Set<string>();
  for (const projection of surfaces.projections) {
    if (projection.state === 'projected') exposedCurrentRecordIds.add(projection.dto.targetRef.recordId);
  }
  for (const surface of surfaces.surfaces) {
    for (const section of surface.sections) {
      for (const item of section.items) exposedCurrentRecordIds.add(item.targetRef.recordId);
    }
  }
  const deferredCurrentSystemExposureCount = current.deferredRecordIds.filter((recordId) =>
    exposedCurrentRecordIds.has(recordId)).length;

  const serializedPublicSurfaces = currentSurfaceSerialization(surfaces);
  const privateSourceLocators = new Set(
    current.successors.flatMap((successor) => successor.temporalBasis
      .filter((basis) => basis.visibility === 'private')
      .map((basis) => basis.repo)),
  );
  const privateEvidenceLocators = new Set(
    evidenceMaturity.observations
      .filter((observation) => observation.visibility === 'private')
      .map((observation) => observation.sourceRef),
  );
  const privateSourceLocatorLeakCount = [...privateSourceLocators].filter((locator) =>
    serializedPublicSurfaces.includes(locator)).length;
  const privateEvidenceLocatorLeakCount = [...privateEvidenceLocators].filter((locator) =>
    serializedPublicSurfaces.includes(locator)).length;

  const recordIdentityReplacementCount = current.successors.filter((successor) =>
    !current.records.some((record) => record.recordId === successor.recordId)).length;

  const snapshot: CurrentPublicationAcceptanceSnapshot = {
    completionSealCount: priorCompletionSeals.length,
    allPriorCutsSealed,
    bornSystemRecordCount: current.records.length,
    currentSuccessorSystemCount: current.successors.length,
    deferredCurrentSystemCount: current.deferredRecordIds.length,
    evidenceObservationCount: evidenceMaturity.observations.length,
    maturityClassifiedCount: evidenceMaturity.maturityResolutions.filter((entry) => entry.state === 'classified').length,
    maturityUnclassifiedCount: evidenceMaturity.maturityResolutions.filter((entry) => entry.state === 'unclassified').length,
    disclosureClassifiedCount: disclosureClassified.length,
    publicFullDisclosureCount,
    currentRouteLanguagePairCount: routeAdmission.currentRouteBindings.length,
    currentLanguageBindingCount: routeAdmission.currentLanguageRealizations.length,
    totalRouteBindingCount: routeAdmission.allRouteBindings.length,
    publicProjectionCount: surfaces.projections.filter((entry) => entry.state === 'projected').length,
    semanticDocumentCount: semanticDocuments.length,
    coreSurfaceCount: surfaces.surfaces.length,
    systemsPerLanguage: countCurrentSurfaceItems(surfaces.surfaces, 'systems', 'en'),
    researchPerLanguage: countCurrentSurfaceItems(surfaces.surfaces, 'research', 'en'),
    homeSystemsPerLanguage: countHomeSectionItems(surfaces.surfaces, 'systems', 'en'),
    homeResearchPerLanguage: countHomeSectionItems(surfaces.surfaces, 'research', 'en'),
    recordIdentityReplacementCount,
    maturityIdentityReplacementCount: Number(constitution.currentState.maturityIdentityReplacementCount ?? -1),
    disclosureIdentityReplacementCount: Number(constitution.currentState.disclosureIdentityReplacementCount ?? -1),
    historicalPathDropCount: Number(constitution.currentState.historicalPathDropCount ?? -1),
    historicalPathReassignmentCount: Number(constitution.currentState.historicalPathReassignmentCount ?? -1),
    historicalAdmissionBasisRewriteCount: Number(constitution.currentState.historicalAdmissionBasisRewriteCount ?? -1),
    currentProjectionOmissionCount: projectionOmissions,
    currentDocumentOmissionCount: documentOmissions,
    genericBirthSummaryEmissionCount,
    crossLanguageIdentityDriftCount: countCrossLanguageIdentityDrift(surfaces.surfaces),
    deferredCurrentSystemExposureCount,
    privateSourceLocatorLeakCount,
    privateEvidenceLocatorLeakCount,
    rankingInferenceCount: Number(constitution.currentState.currentRankingInferenceCount ?? -1),
    archiveInferenceCount: 0,
    productionMutationCount: Number(constitution.currentState.productionMutationCount ?? -1),
  };

  if (!snapshot.allPriorCutsSealed) errors.push('prior-cuts-not-sealed');

  for (const [label, expected] of Object.entries(manifest.expectedState)) {
    compareCount(errors, label, snapshot[label as keyof CurrentPublicationAcceptanceSnapshot] as number, expected);
  }
  for (const [label, expected] of Object.entries(manifest.requiredZeroes)) {
    compareCount(errors, label, snapshot[label as keyof CurrentPublicationAcceptanceSnapshot] as number, expected);
  }

  const specimen: JsonValue = {
    systemRevisions: current.successors.map((successor) => ({
      subjectKey: successor.subjectKey,
      recordId: successor.recordId,
      revisionId: successor.revision.revisionId,
      lifecycle: successor.revision.lifecycle,
      payloadDigest: successor.revision.payloadDigest,
      payload: successor.payload as unknown as JsonValue,
    })),
    deferredRecordIds: [...current.deferredRecordIds],
    evidenceObservations: evidenceMaturity.observations as unknown as JsonValue,
    maturityGovernance: evidenceMaturity.maturityRecords.map((record) => ({
      subjectKey: record.subjectKey,
      governanceRecordId: record.governanceRecordId,
      governanceRevisionId: record.revision.revisionId,
      targetRef: record.targetRef as unknown as JsonValue,
      stage: record.stage,
    })),
    maturityResolutions: evidenceMaturity.maturityResolutions as unknown as JsonValue,
    disclosureGovernance: disclosure.disclosureRecords.map((record) => ({
      subjectKey: record.subjectKey,
      governanceRecordId: record.governanceRecordId,
      governanceRevisionId: record.revision.revisionId,
      targetRef: record.targetRef as unknown as JsonValue,
      payload: record.payload as unknown as JsonValue,
    })),
    disclosureResolutions: disclosure.resolutions as unknown as JsonValue,
    languageRealizations: routeAdmission.currentLanguageRealizations.map((realization) => ({
      subjectKey: realization.subjectKey,
      language: realization.language,
      binding: realization.binding as unknown as JsonValue,
      payload: realization.payload as unknown as JsonValue,
    })),
    routeBindings: routeAdmission.allRouteBindings as unknown as JsonValue,
    currentSurfaces: surfaces.surfaces as unknown as JsonValue,
  };
  const publicationDigest = sha256(canonicalJson(specimen));
  if (
    manifest.specimen.acceptedPublicationDigest !== null
    && manifest.specimen.acceptedPublicationDigest !== publicationDigest
  ) errors.push('accepted-publication-digest-mismatch');

  const uniqueErrors = [...new Set(errors)];
  return {
    state: uniqueErrors.length === 0 ? 'ready' : 'conflict',
    publicationValidCandidate: uniqueErrors.length === 0,
    publicationDigest,
    snapshot,
    errors: uniqueErrors,
  };
}
