import { isRecordId, type RecordId } from './editorial-record-identity';
import { parseRecordPath } from './editorial-route-language-identity';

export type MigrationTargetKind =
  | 'knowledge.system'
  | 'representation.publication'
  | 'representation.architecture';

export type GuaranteeDisposition = 'knowledge.claim' | 'representation-text';
export type EvidenceMigrationTreatment = 'artifact-plan' | 'recapture-required';

export interface LegacySurfaceFreeze {
  freezeId: string;
  canonical: { commit: string };
  routes: string[];
  projects: Array<{
    id: string;
    visibility: 'public' | 'private' | 'case-study';
    guarantees: string[];
  }>;
  architectureViews: Array<{ id: string; guarantees: string[] }>;
  evidenceLocators: string[];
  projectEvidenceLocators: string[];
  publications: Array<{ id: string; locator: string }>;
}

export interface DisclosurePlan {
  record: 'public' | 'private';
  source: 'public' | 'partial' | 'private' | 'not-applicable' | 'unknown';
  evidence: 'public' | 'partial' | 'private' | 'none' | 'unknown';
  mode: 'full' | 'sanitized' | 'metadata-only' | 'withheld';
}

export interface ProjectMigration {
  legacyId: string;
  targetRecordId: RecordId;
  targetKind: 'knowledge.system' | 'representation.publication';
  birthStatus: 'reserved-for-r1';
  guarantees: Array<{ label: string; disposition: GuaranteeDisposition }>;
  disclosurePlan: DisclosurePlan;
  maturityPlan: 'pre-beta' | null;
  canonicalRoutes: Partial<Record<'en' | 'pt-BR', string>>;
  languagePlan: { canonical: 'en' | 'pt-BR'; translations: Array<'en' | 'pt-BR'> };
}

export interface SupportingSystemMigration {
  source: string;
  name: string;
  targetRecordId: RecordId;
  targetKind: 'knowledge.system';
  birthStatus: 'reserved-for-r1';
  reason: string;
  disclosurePlan: DisclosurePlan;
  canonicalRoutes: Partial<Record<'en' | 'pt-BR', string>>;
}

export interface ArchitectureMigration {
  legacyId: string;
  targetRecordId: RecordId;
  targetKind: 'representation.architecture';
  birthStatus: 'reserved-for-r1';
  subjectRecordIds: RecordId[];
  guaranteeDisposition: 'representation-text';
  canonicalRoutes: Partial<Record<'en' | 'pt-BR', string>>;
  disclosurePlan: DisclosurePlan;
}

export interface PublicationMigration {
  legacyId: string;
  targetRecordId: RecordId;
  targetKind: 'representation.publication';
  publicationType: 'technical-paper';
  birthStatus: 'reserved-for-r1';
  artifactLocator: string;
  canonicalRoutes: Partial<Record<'en' | 'pt-BR', string>>;
  disclosurePlan: DisclosurePlan;
}

export interface EvidenceMigration {
  locator: string;
  treatment: EvidenceMigrationTreatment;
  evidenceClass: string;
  facet: string | null;
  relatedLegacyIds: string[];
}

export interface CompatibilityRoute {
  legacyPath: string;
  mode: 'service-route' | 'language-negotiating-redirect';
  targetRecordId: RecordId | null;
  preserve: boolean;
  service?: string;
  defaultLanguage?: 'en' | 'pt-BR';
  targets?: Partial<Record<'en' | 'pt-BR', string>>;
}

export interface MigrationContract {
  status: 'materialized' | 'frozen';
  normative: boolean;
  preconditions: {
    r0_7Complete: boolean;
    legacyFreezeId: string;
    legacyCommit: string;
  };
  migrationBoundary: {
    birthOccursInR1: boolean;
    reservedIdsAreNotBornRecords: boolean;
    publicUiChanged: boolean;
    runtimeSemanticsChanged: boolean;
    legacyCompatibilityEnacted: boolean;
  };
  projectMappings: ProjectMigration[];
  supportingSystemMappings: SupportingSystemMigration[];
  architectureMappings: ArchitectureMigration[];
  publicationMappings: PublicationMigration[];
  evidenceMappings: EvidenceMigration[];
  compatibilityRoutes: CompatibilityRoute[];
  deferredRuntimeCorrections: Array<{ id: string; owner: string }>;
  laws: Array<{ id: string; title: string; rule: string }>;
  ciWitness: null | { workflow: string; runId: number; commit: string; conclusion: string };
  acceptance: {
    r0_7Preserved: boolean;
    legacyCoverageComplete: boolean;
    semanticLossCount: number;
    unresolvedMigrationCount: number;
    runtimeSemanticsChanged: boolean;
    uiChanged: boolean;
    r0Complete: boolean;
  };
}

function sorted(values: readonly string[]): string[] {
  return [...values].sort();
}

function unique(values: readonly string[]): boolean {
  return new Set(values).size === values.length;
}

function canonicalRoutes(mapping: { canonicalRoutes: Partial<Record<'en' | 'pt-BR', string>> }): string[] {
  return Object.values(mapping.canonicalRoutes).filter((value): value is string => Boolean(value));
}

function disclosurePlanValid(plan: DisclosurePlan): boolean {
  if (plan.record === 'private') return plan.mode === 'withheld';
  return plan.mode === 'full' || plan.mode === 'sanitized' || plan.mode === 'metadata-only';
}

export function frozenEvidenceLocatorSet(freeze: LegacySurfaceFreeze): string[] {
  return sorted([...new Set([...freeze.evidenceLocators, ...freeze.projectEvidenceLocators])]);
}

export function reservedRecordIds(contract: MigrationContract): RecordId[] {
  const raw = [
    ...contract.projectMappings.map((entry) => entry.targetRecordId),
    ...contract.supportingSystemMappings.map((entry) => entry.targetRecordId),
    ...contract.architectureMappings.map((entry) => entry.targetRecordId),
    ...contract.publicationMappings.map((entry) => entry.targetRecordId),
  ];
  return [...new Set(raw)];
}

export function validateMigrationAcceptance(
  contract: MigrationContract,
  freeze: LegacySurfaceFreeze,
): string[] {
  const errors: string[] = [];

  if (contract.preconditions.legacyFreezeId !== freeze.freezeId) errors.push('legacy-freeze-id');
  if (contract.preconditions.legacyCommit !== freeze.canonical.commit) errors.push('legacy-commit');
  if (!contract.preconditions.r0_7Complete) errors.push('r0-7-precondition');

  const projectIds = contract.projectMappings.map((entry) => entry.legacyId);
  if (!unique(projectIds)) errors.push('duplicate-project-mapping');
  if (JSON.stringify(sorted(projectIds)) !== JSON.stringify(sorted(freeze.projects.map((entry) => entry.id)))) {
    errors.push('project-coverage');
  }

  for (const legacy of freeze.projects) {
    const mapping = contract.projectMappings.find((entry) => entry.legacyId === legacy.id);
    if (!mapping) continue;
    if (mapping.birthStatus !== 'reserved-for-r1') errors.push(`${legacy.id}:birth-status`);
    if (!isRecordId(mapping.targetRecordId)) errors.push(`${legacy.id}:record-id`);
    if (!disclosurePlanValid(mapping.disclosurePlan)) errors.push(`${legacy.id}:disclosure`);
    if (JSON.stringify(mapping.guarantees.map((entry) => entry.label)) !== JSON.stringify(legacy.guarantees)) {
      errors.push(`${legacy.id}:guarantee-coverage`);
    }
    for (const guarantee of mapping.guarantees) {
      if (legacy.id === 'verify-systems' && guarantee.disposition !== 'representation-text') {
        errors.push(`${legacy.id}:guarantee-disposition`);
      }
      if (legacy.id !== 'verify-systems' && guarantee.disposition !== 'knowledge.claim') {
        errors.push(`${legacy.id}:guarantee-disposition`);
      }
    }
    for (const route of canonicalRoutes(mapping)) {
      if (!parseRecordPath(route)) errors.push(`${legacy.id}:canonical-route`);
    }
  }

  const verifyProject = contract.projectMappings.find((entry) => entry.legacyId === 'verify-systems');
  const verifyPublication = contract.publicationMappings.find((entry) => entry.legacyId === 'verify-systems');
  if (!verifyProject || !verifyPublication || verifyProject.targetRecordId !== verifyPublication.targetRecordId) {
    errors.push('verify-identity-reconciliation');
  }
  if (verifyProject?.targetKind !== 'representation.publication') errors.push('verify-target-kind');

  const maturity = contract.projectMappings.filter((entry) => entry.maturityPlan !== null);
  if (maturity.length !== 1 || maturity[0].legacyId !== 'xs-wallet' || maturity[0].maturityPlan !== 'pre-beta') {
    errors.push('maturity-overclaim');
  }

  const architectureIds = contract.architectureMappings.map((entry) => entry.legacyId);
  if (!unique(architectureIds)) errors.push('duplicate-architecture-mapping');
  if (JSON.stringify(sorted(architectureIds)) !== JSON.stringify(sorted(freeze.architectureViews.map((entry) => entry.id)))) {
    errors.push('architecture-coverage');
  }

  const systemIds = new Set<RecordId>([
    ...contract.projectMappings.filter((entry) => entry.targetKind === 'knowledge.system').map((entry) => entry.targetRecordId),
    ...contract.supportingSystemMappings.map((entry) => entry.targetRecordId),
  ]);
  for (const mapping of contract.architectureMappings) {
    if (mapping.targetKind !== 'representation.architecture') errors.push(`${mapping.legacyId}:architecture-kind`);
    if (mapping.guaranteeDisposition !== 'representation-text') errors.push(`${mapping.legacyId}:architecture-guarantees`);
    if (mapping.subjectRecordIds.length === 0 || mapping.subjectRecordIds.some((id) => !systemIds.has(id))) {
      errors.push(`${mapping.legacyId}:architecture-subject`);
    }
    if (!disclosurePlanValid(mapping.disclosurePlan)) errors.push(`${mapping.legacyId}:architecture-disclosure`);
    for (const route of canonicalRoutes(mapping)) {
      if (!parseRecordPath(route)) errors.push(`${mapping.legacyId}:architecture-route`);
    }
  }

  const publicationIds = contract.publicationMappings.map((entry) => entry.legacyId);
  if (!unique(publicationIds)) errors.push('duplicate-publication-mapping');
  if (JSON.stringify(sorted(publicationIds)) !== JSON.stringify(sorted(freeze.publications.map((entry) => entry.id)))) {
    errors.push('publication-coverage');
  }
  for (const legacy of freeze.publications) {
    const mapping = contract.publicationMappings.find((entry) => entry.legacyId === legacy.id);
    if (!mapping) continue;
    if (mapping.artifactLocator !== legacy.locator) errors.push(`${legacy.id}:publication-artifact`);
    if (!disclosurePlanValid(mapping.disclosurePlan)) errors.push(`${legacy.id}:publication-disclosure`);
    for (const route of canonicalRoutes(mapping)) {
      if (!parseRecordPath(route)) errors.push(`${legacy.id}:publication-route`);
    }
  }

  const frozenEvidence = frozenEvidenceLocatorSet(freeze);
  const migratedEvidence = sorted(contract.evidenceMappings.map((entry) => entry.locator));
  if (!unique(migratedEvidence)) errors.push('duplicate-evidence-locator');
  if (JSON.stringify(frozenEvidence) !== JSON.stringify(migratedEvidence)) errors.push('evidence-coverage');
  for (const mapping of contract.evidenceMappings) {
    if (mapping.treatment === 'recapture-required' && mapping.facet !== null) errors.push(`${mapping.locator}:recapture-facet`);
    if (mapping.treatment === 'artifact-plan' && mapping.facet === null) errors.push(`${mapping.locator}:artifact-facet`);
  }

  const legacyRoutes = sorted(contract.compatibilityRoutes.map((entry) => entry.legacyPath));
  if (!unique(legacyRoutes)) errors.push('duplicate-compatibility-route');
  if (JSON.stringify(legacyRoutes) !== JSON.stringify(sorted(freeze.routes))) errors.push('route-coverage');
  for (const route of contract.compatibilityRoutes) {
    if (!route.preserve) errors.push(`${route.legacyPath}:not-preserved`);
    if (route.legacyPath.startsWith('/work/')) {
      if (route.mode !== 'language-negotiating-redirect' || !route.targetRecordId || !route.targets) {
        errors.push(`${route.legacyPath}:work-compatibility`);
      } else {
        const legacyId = route.legacyPath.slice('/work/'.length);
        const project = contract.projectMappings.find((entry) => entry.legacyId === legacyId);
        if (!project || project.targetRecordId !== route.targetRecordId) errors.push(`${route.legacyPath}:target`);
        for (const target of Object.values(route.targets)) {
          if (target && !parseRecordPath(target)) errors.push(`${route.legacyPath}:target-route`);
        }
      }
    }
  }

  const root = contract.compatibilityRoutes.find((entry) => entry.legacyPath === '/');
  const architecture = contract.compatibilityRoutes.find((entry) => entry.legacyPath === '/architecture');
  if (root?.mode !== 'service-route' || root.targetRecordId !== null) errors.push('root-service-route');
  if (architecture?.mode !== 'service-route' || architecture.targetRecordId !== null) errors.push('architecture-service-route');

  const reservations = reservedRecordIds(contract);
  if (reservations.some((id) => !isRecordId(id))) errors.push('reserved-record-id');
  const allReservationOccurrences = [
    ...contract.projectMappings.filter((entry) => entry.legacyId !== 'verify-systems').map((entry) => entry.targetRecordId),
    ...contract.supportingSystemMappings.map((entry) => entry.targetRecordId),
    ...contract.architectureMappings.map((entry) => entry.targetRecordId),
    ...contract.publicationMappings.map((entry) => entry.targetRecordId),
  ];
  if (!unique(allReservationOccurrences)) errors.push('record-id-reuse');

  if (!contract.migrationBoundary.birthOccursInR1 || !contract.migrationBoundary.reservedIdsAreNotBornRecords) {
    errors.push('migration-birth-boundary');
  }
  if (contract.migrationBoundary.publicUiChanged || contract.migrationBoundary.runtimeSemanticsChanged) {
    errors.push('r0-runtime-boundary');
  }
  if (contract.migrationBoundary.legacyCompatibilityEnacted) errors.push('legacy-enacted-too-early');

  return [...new Set(errors)];
}
