import { createHash } from 'node:crypto';
import {
  IDENTITY_SCHEMA_VERSION,
  isRecordId,
  serializeRevisionMaterial,
  validateBirth,
  type PayloadDigest,
  type PinnedRecordRef,
  type RecordId,
  type RecordRevision,
  type RevisionId,
} from '../app/data/editorial-record-identity';
import {
  deriveGovernanceProjection,
  serializeGovernancePayload,
  validateGovernanceResolution,
  type CurrentGovernanceEntry,
  type DisclosureMode,
  type DisclosurePayload,
  type EvidenceAvailability,
  type GovernanceKind,
  type GovernancePayload,
  type GovernanceRevisionIndexEntry,
  type MaturityPayload,
  type MaturityStage,
  type RecordVisibility,
  type SourceAvailability,
} from '../app/data/editorial-visibility-maturity-disclosure';
import type {
  CurrentRecordHead,
  LanguageTag,
} from '../app/data/editorial-route-language-identity';
import {
  materializeEditorialDocument,
  type EditorialDocumentDecision,
  type EditorialDocumentDto,
} from './document-runtime';
import {
  resolveLocalizedRouteIdentity,
  type ReconstructedLanguageRuntime,
} from './language-runtime';
import {
  projectPublicRecord,
  type ProjectionTargetHead,
  type PublicProjectionDecision,
} from './projection-engine';
import type {
  ReconstructedRecordRegistry,
  RegistryRecordEntry,
} from './record-registry';
import type { ReconstructedRouteRuntime } from './route-runtime';

export const CORE_EDITORIAL_SURFACE_SCHEMA_VERSION = 'editorial-core-surfaces/v0' as const;
export const CORE_EDITORIAL_SURFACE_DTO_VERSION = 'editorial-core-surface/v0' as const;

export const CORE_SURFACE_IDS = [
  'home',
  'systems',
  'archive',
  'research',
  'essays',
  'notes',
] as const;
export type CoreSurfaceId = (typeof CORE_SURFACE_IDS)[number];

export interface DisclosureGovernanceAssignment {
  governanceRecordId: RecordId;
  kind: 'governance.disclosure';
  targetRecordId: RecordId;
  basisRevisionId: RevisionId;
  visibility: {
    record: RecordVisibility;
    source: SourceAvailability;
    evidence: EvidenceAvailability;
  };
  disclosure: DisclosureMode;
  rationale: string;
  source: string;
}

export interface MaturityGovernanceAssignment {
  governanceRecordId: RecordId;
  kind: 'governance.maturity';
  targetRecordId: RecordId;
  basisRevisionId: RevisionId;
  stage: MaturityStage;
  rationale: string;
  source: string;
}

export type SurfaceGovernanceAssignment =
  | DisclosureGovernanceAssignment
  | MaturityGovernanceAssignment;

export interface CoreEditorialSurfaceManifest {
  schemaVersion: typeof CORE_EDITORIAL_SURFACE_SCHEMA_VERSION;
  contractId: string;
  status: 'materialized';
  normative: true;
  baseline: string;
  preconditions: {
    r1_5Complete: true;
    r1_4Complete: true;
    r1_3Complete: true;
    r1_2Complete: true;
    r1_1Complete: true;
    r0EffectiveComplete: true;
  };
  governanceAdmission: {
    source: 'r0.8-explicit-public-plans';
    policyInferenceAllowed: false;
    assignmentCount: number;
    disclosureBirthCount: number;
    maturityBirthCount: number;
  };
  governanceAssignments: SurfaceGovernanceAssignment[];
  surfaceAdmission: {
    languages: LanguageTag[];
    surfaces: CoreSurfaceId[];
    rankingInferenceAllowed: false;
    chronologyInferenceAllowed: false;
    surfacePathInferenceAllowed: false;
  };
  currentState: {
    routedSystemRecords: number;
    publicProjectionCount: number;
    editorialDocumentCount: number;
    sanitizedDocumentOmissions: number;
    coreSurfaceCount: number;
    systemsPerLanguage: number;
    frameworkCutoverEnacted: false;
    staticHtmlRenderingEnacted: false;
    publicUiChanged: false;
    deployedRuntimeChanged: false;
  };
  acceptance: {
    governanceRecordsMaterialized: true;
    governanceExactRevisionBindingRequired: true;
    surfaceRuntimeMaterialized: true;
    surfacesConsumeDocumentsOnly: true;
    crossLanguageMixingForbidden: true;
    sanitizedContentLeakCount: 0;
    currentPublicProjectionCount: number;
    currentEditorialDocumentCount: number;
    coreSurfaceCount: number;
    r1_6Complete: false;
  };
}

export interface MaterializedSurfaceGovernanceRecord {
  recordId: RecordId;
  kind: GovernanceKind;
  lifecycle: 'active';
  revision: RecordRevision;
  payload: GovernancePayload;
  source: string;
}

export interface ReconstructedSurfaceGovernance {
  state: 'ready' | 'conflict';
  records: MaterializedSurfaceGovernanceRecord[];
  errors: string[];
}

export interface SurfaceMaterializationState {
  governance: ReconstructedSurfaceGovernance;
  projections: PublicProjectionDecision[];
  documents: EditorialDocumentDecision[];
}

export interface CoreSurfaceItem {
  targetRef: PinnedRecordRef;
  kind: string;
  canonicalPath: string;
  canonicalUrl: string;
  title: string | null;
  summary: string | null;
  maturity: EditorialDocumentDto['maturity'];
  semanticContentAvailable: boolean;
}

export interface CoreSurfaceSection {
  id: Exclude<CoreSurfaceId, 'home'>;
  href: string;
  count: number;
  items: CoreSurfaceItem[];
}

export interface CoreSurfaceDto {
  schemaVersion: typeof CORE_EDITORIAL_SURFACE_DTO_VERSION;
  id: CoreSurfaceId;
  language: LanguageTag;
  path: string;
  sections: CoreSurfaceSection[];
}

export interface ReconstructedCoreSurfaceRuntime {
  state: 'ready' | 'conflict';
  surfaces: CoreSurfaceDto[];
  errors: string[];
}

function sha256(value: string): string {
  return createHash('sha256').update(value, 'utf8').digest('hex');
}

function unique<T>(values: readonly T[]): boolean {
  return new Set(values).size === values.length;
}

function targetIndex(records: readonly RegistryRecordEntry[]): GovernanceRevisionIndexEntry[] {
  return records.flatMap((record) => record.revisions.map((entry) => ({
    recordId: entry.revision.recordId,
    revisionId: entry.revision.revisionId,
    kind: entry.revision.kind,
    lifecycle: entry.revision.lifecycle,
  })));
}

function currentHeads(registry: ReconstructedRecordRegistry): CurrentRecordHead[] {
  return [...registry.records.values()]
    .filter((record) => record.state === 'ready' && record.headRevisionId !== null)
    .map((record) => ({
      recordId: record.recordId,
      revisionId: record.headRevisionId!,
    }));
}

function governancePayload(assignment: SurfaceGovernanceAssignment): GovernancePayload {
  const targetRef = { type: 'record' as const, recordId: assignment.targetRecordId };
  const basisRef = {
    type: 'pinned-record' as const,
    recordId: assignment.targetRecordId,
    revisionId: assignment.basisRevisionId,
  };

  if (assignment.kind === 'governance.disclosure') {
    return {
      schemaVersion: 'governance.disclosure/v0',
      targetRef,
      basisRef,
      visibility: assignment.visibility,
      disclosure: assignment.disclosure,
      rationale: assignment.rationale,
    };
  }

  return {
    schemaVersion: 'governance.maturity/v0',
    targetRef,
    basisRef,
    stage: assignment.stage,
    rationale: assignment.rationale,
  };
}

function governanceRevision(
  assignment: SurfaceGovernanceAssignment,
  payload: GovernancePayload,
): RecordRevision {
  const payloadDigest = `sha256_${sha256(serializeGovernancePayload(assignment.kind, payload))}` as PayloadDigest;
  const material = {
    identitySchemaVersion: IDENTITY_SCHEMA_VERSION,
    recordId: assignment.governanceRecordId,
    kind: assignment.kind,
    generation: 0,
    previousRevisionId: null,
    lifecycle: 'active' as const,
    payloadDigest,
  };
  const revisionId = `rev_sha256_${sha256(serializeRevisionMaterial(material))}` as RevisionId;
  return { ...material, revisionId };
}

export function reconstructSurfaceGovernance(
  manifest: CoreEditorialSurfaceManifest,
  records: readonly RegistryRecordEntry[],
  registry: ReconstructedRecordRegistry,
): ReconstructedSurfaceGovernance {
  const errors: string[] = [];

  if (manifest.schemaVersion !== CORE_EDITORIAL_SURFACE_SCHEMA_VERSION) errors.push('surface-schema-version');
  if (manifest.status !== 'materialized') errors.push('surface-status');
  if (manifest.normative !== true) errors.push('surface-normative');
  if (manifest.governanceAdmission.policyInferenceAllowed) errors.push('governance-policy-inference-enabled');

  const assignments = manifest.governanceAssignments;
  if (assignments.length !== manifest.governanceAdmission.assignmentCount) errors.push('governance-assignment-count');
  if (assignments.filter((entry) => entry.kind === 'governance.disclosure').length
    !== manifest.governanceAdmission.disclosureBirthCount) errors.push('disclosure-birth-count');
  if (assignments.filter((entry) => entry.kind === 'governance.maturity').length
    !== manifest.governanceAdmission.maturityBirthCount) errors.push('maturity-birth-count');

  const governanceIds = assignments.map((entry) => entry.governanceRecordId);
  if (!unique(governanceIds)) errors.push('duplicate-governance-record-id');

  const existingIds = new Set(records.map((record) => record.recordId));
  const unavailableIds = registry.unavailableRecordIds;
  const heads = new Map(currentHeads(registry).map((head) => [head.recordId, head.revisionId]));
  const index = targetIndex(records);
  const materialized: MaterializedSurfaceGovernanceRecord[] = [];

  for (const assignment of assignments) {
    if (!isRecordId(assignment.governanceRecordId)) {
      errors.push(`invalid-governance-record-id:${assignment.governanceRecordId}`);
      continue;
    }
    if (existingIds.has(assignment.governanceRecordId) || unavailableIds.has(assignment.governanceRecordId)) {
      errors.push(`governance-record-id-collision:${assignment.governanceRecordId}`);
      continue;
    }

    const head = heads.get(assignment.targetRecordId);
    if (!head) {
      errors.push(`governance-target-unavailable:${assignment.targetRecordId}`);
      continue;
    }
    if (head !== assignment.basisRevisionId) {
      errors.push(`governance-basis-not-current:${assignment.targetRecordId}`);
      continue;
    }

    const payload = governancePayload(assignment);
    const resolutionErrors = validateGovernanceResolution(assignment.kind, payload, index);
    if (resolutionErrors.length > 0) {
      errors.push(...resolutionErrors.map((error) => `${assignment.governanceRecordId}:${error}`));
      continue;
    }

    const revision = governanceRevision(assignment, payload);
    const birthErrors = validateBirth(revision);
    if (birthErrors.length > 0) {
      errors.push(...birthErrors.map((error) => `${assignment.governanceRecordId}:birth:${error}`));
      continue;
    }

    materialized.push({
      recordId: assignment.governanceRecordId,
      kind: assignment.kind,
      lifecycle: 'active',
      revision,
      payload,
      source: assignment.source,
    });
  }

  const uniqueErrors = [...new Set(errors)];
  return {
    state: uniqueErrors.length === 0 ? 'ready' : 'conflict',
    records: materialized,
    errors: uniqueErrors,
  };
}

function currentGovernanceEntries<T extends GovernancePayload>(
  governance: ReconstructedSurfaceGovernance,
  kind: GovernanceKind,
): CurrentGovernanceEntry<T>[] {
  return governance.records
    .filter((record) => record.kind === kind)
    .map((record) => ({
      governanceRecordId: record.recordId,
      lifecycle: record.lifecycle,
      payload: record.payload as T,
    }));
}

function projectionTarget(
  record: RegistryRecordEntry,
  revisionId: RevisionId,
): ProjectionTargetHead | null {
  const entry = record.revisions.find((candidate) => candidate.revision.revisionId === revisionId);
  if (!entry) return null;
  return {
    recordId: record.recordId,
    revisionId,
    kind: record.kind,
    lifecycle: entry.revision.lifecycle,
  };
}

export function materializeSurfaceDocuments(
  manifest: CoreEditorialSurfaceManifest,
  records: readonly RegistryRecordEntry[],
  registry: ReconstructedRecordRegistry,
  routeRuntime: ReconstructedRouteRuntime,
  languageRuntime: ReconstructedLanguageRuntime,
): SurfaceMaterializationState {
  if (registry.errors.length > 0) throw new Error('record-registry-conflict');
  if (routeRuntime.state !== 'ready') throw new Error('route-runtime-conflict');
  if (languageRuntime.state !== 'ready') throw new Error('language-runtime-conflict');

  const governance = reconstructSurfaceGovernance(manifest, records, registry);
  if (governance.state !== 'ready') return { governance, projections: [], documents: [] };

  const heads = currentHeads(registry);
  const byRecordId = new Map(records.map((record) => [record.recordId, record]));
  const disclosureEntries = currentGovernanceEntries<DisclosurePayload>(governance, 'governance.disclosure');
  const maturityEntries = currentGovernanceEntries<MaturityPayload>(governance, 'governance.maturity');
  const projections: PublicProjectionDecision[] = [];
  const documents: EditorialDocumentDecision[] = [];

  const paths = [...routeRuntime.bindings]
    .filter((binding) => binding.role === 'canonical')
    .map((binding) => binding.path)
    .sort();

  for (const path of paths) {
    const route = resolveLocalizedRouteIdentity(path, routeRuntime, languageRuntime, heads);
    if (route.state !== 'resolved') continue;

    const record = byRecordId.get(route.targetRef.recordId);
    if (!record) continue;
    const target = projectionTarget(record, route.targetRef.revisionId);
    if (!target) continue;

    const disclosure = deriveGovernanceProjection<DisclosurePayload>(targetRef(target), disclosureEntries);
    const maturity = target.kind === 'knowledge.system'
      ? deriveGovernanceProjection<MaturityPayload>(targetRef(target), maturityEntries)
      : null;

    const projection = projectPublicRecord({ target, disclosure, maturity, route });
    projections.push(projection);
    documents.push(materializeEditorialDocument(projection, languageRuntime));
  }

  return { governance, projections, documents };
}

function targetRef(target: ProjectionTargetHead): PinnedRecordRef {
  return {
    type: 'pinned-record',
    recordId: target.recordId,
    revisionId: target.revisionId,
  };
}

function surfacePath(language: LanguageTag, surface: CoreSurfaceId): string {
  const locale = language === 'pt-BR' ? 'pt-br' : 'en';
  if (surface === 'home') return `/${locale}`;
  return `/${locale}/${surface}`;
}

function itemFromDocument(document: EditorialDocumentDto): CoreSurfaceItem {
  if (document.content.type === 'knowledge.system') {
    return {
      targetRef: document.targetRef,
      kind: document.kind,
      canonicalPath: document.canonicalPath,
      canonicalUrl: document.canonicalUrl,
      title: document.content.name,
      summary: document.content.summary,
      maturity: document.maturity,
      semanticContentAvailable: true,
    };
  }

  return {
    targetRef: document.targetRef,
    kind: document.kind,
    canonicalPath: document.canonicalPath,
    canonicalUrl: document.canonicalUrl,
    title: null,
    summary: null,
    maturity: document.maturity,
    semanticContentAvailable: false,
  };
}

function documentsForSurface(
  documents: readonly EditorialDocumentDto[],
  surface: Exclude<CoreSurfaceId, 'home'>,
): EditorialDocumentDto[] {
  if (surface === 'archive') return [...documents];
  if (surface === 'systems') return documents.filter((document) => document.kind === 'knowledge.system');
  return documents.filter((document) => document.canonicalPath.split('/')[2] === surface);
}

function freezeSurface(surface: CoreSurfaceDto): CoreSurfaceDto {
  for (const section of surface.sections) {
    for (const item of section.items) {
      Object.freeze(item.targetRef);
      Object.freeze(item.maturity);
      Object.freeze(item);
    }
    Object.freeze(section.items);
    Object.freeze(section);
  }
  Object.freeze(surface.sections);
  return Object.freeze(surface);
}

export function reconstructCoreSurfaceRuntime(
  manifest: CoreEditorialSurfaceManifest,
  decisions: readonly EditorialDocumentDecision[],
): ReconstructedCoreSurfaceRuntime {
  const errors: string[] = [];
  if (manifest.surfaceAdmission.rankingInferenceAllowed) errors.push('surface-ranking-inference-enabled');
  if (manifest.surfaceAdmission.chronologyInferenceAllowed) errors.push('surface-chronology-inference-enabled');
  if (manifest.surfaceAdmission.surfacePathInferenceAllowed) errors.push('surface-path-inference-enabled');

  const languages = manifest.surfaceAdmission.languages;
  const surfaces = manifest.surfaceAdmission.surfaces;
  if (!unique(languages)) errors.push('duplicate-surface-language');
  if (!unique(surfaces)) errors.push('duplicate-surface-id');
  if (languages.some((language) => language !== 'en' && language !== 'pt-BR')) errors.push('unsupported-surface-language');
  if (surfaces.some((surface) => !(CORE_SURFACE_IDS as readonly string[]).includes(surface))) errors.push('unsupported-surface-id');

  const docs = decisions
    .filter((decision): decision is Extract<EditorialDocumentDecision, { state: 'document' }> => decision.state === 'document')
    .map((decision) => decision.document);

  const duplicateDocumentPaths = docs.map((document) => document.canonicalPath);
  if (!unique(duplicateDocumentPaths)) errors.push('duplicate-document-path');

  const result: CoreSurfaceDto[] = [];
  for (const language of languages) {
    const localized = docs
      .filter((document) => document.language === language)
      .sort((left, right) => left.canonicalPath.localeCompare(right.canonicalPath));

    for (const surface of surfaces) {
      if (surface === 'home') {
        const sectionIds: Exclude<CoreSurfaceId, 'home'>[] = ['systems', 'research', 'essays', 'notes', 'archive'];
        const sections = sectionIds.map((sectionId) => {
          const sectionDocs = documentsForSurface(localized, sectionId);
          return {
            id: sectionId,
            href: surfacePath(language, sectionId),
            count: sectionDocs.length,
            items: sectionDocs.map(itemFromDocument),
          } satisfies CoreSurfaceSection;
        });
        result.push(freezeSurface({
          schemaVersion: CORE_EDITORIAL_SURFACE_DTO_VERSION,
          id: 'home',
          language,
          path: surfacePath(language, 'home'),
          sections,
        }));
        continue;
      }

      const sectionDocs = documentsForSurface(localized, surface);
      result.push(freezeSurface({
        schemaVersion: CORE_EDITORIAL_SURFACE_DTO_VERSION,
        id: surface,
        language,
        path: surfacePath(language, surface),
        sections: [{
          id: surface,
          href: surfacePath(language, surface),
          count: sectionDocs.length,
          items: sectionDocs.map(itemFromDocument),
        }],
      }));
    }
  }

  const paths = result.map((surface) => surface.path);
  if (!unique(paths)) errors.push('duplicate-surface-path');

  const expectedCount = languages.length * surfaces.length;
  if (result.length !== expectedCount) errors.push('surface-count');
  if (result.length !== manifest.currentState.coreSurfaceCount) errors.push('manifest-surface-count');

  const uniqueErrors = [...new Set(errors)];
  return {
    state: uniqueErrors.length === 0 ? 'ready' : 'conflict',
    surfaces: result,
    errors: uniqueErrors,
  };
}
