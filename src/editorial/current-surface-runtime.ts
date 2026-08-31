import currentSurfaceManifestJson from '../../docs/editorial/R1-A2.7-current-editorial-surfaces.v0.json';
import { CURRENT_SURFACE_SELECTION, type CurrentSurfaceSelection } from './current-surface-candidates';
import { materializeCurrentSystemRevisions } from './current-revision-runtime';
import { materializeCurrentEvidenceMaturity } from './current-evidence-maturity-runtime';
import { materializeCurrentDisclosure } from './current-disclosure-runtime';
import {
  materializeCurrentRouteAdmission,
  type CurrentLanguageRealization,
} from './current-route-language-runtime';
import {
  deriveGovernanceProjection,
  type CurrentGovernanceEntry,
  type DisclosurePayload,
  type MaturityPayload,
} from '../app/data/editorial-visibility-maturity-disclosure';
import {
  resolveRouteIdentity,
  type LanguageTag,
} from '../app/data/editorial-route-language-identity';
import type {
  PinnedRecordRef,
  RecordId,
} from '../app/data/editorial-record-identity';
import {
  projectPublicRecord,
  type ProjectedMaturity,
  type ProjectionTargetHead,
  type PublicProjectionDecision,
} from './projection-engine';
import type {
  EditorialDocumentDecision,
  EditorialDocumentDto,
} from './document-runtime';

export const CURRENT_EDITORIAL_SURFACE_SCHEMA_VERSION = 'editorial-current-surfaces/v0' as const;
export const CURRENT_EDITORIAL_SURFACE_DTO_VERSION = 'editorial-current-core-surface/v0' as const;

export const CURRENT_CORE_SURFACE_IDS = [
  'home',
  'systems',
  'archive',
  'research',
  'essays',
  'notes',
] as const;
export type CurrentCoreSurfaceId = (typeof CURRENT_CORE_SURFACE_IDS)[number];
export type CurrentSectionId = Exclude<CurrentCoreSurfaceId, 'home'>;

export interface CurrentEditorialSurfaceManifest {
  schemaVersion: typeof CURRENT_EDITORIAL_SURFACE_SCHEMA_VERSION;
  contractId: string;
  status: 'materialized-awaiting-ci' | 'complete';
  normative: true;
  baseline: string;
  preconditions: {
    r1_a2_6Complete: true;
    currentRouteAdmissionComplete: true;
    allCurrentRouteLanguagePairsResolved: true;
    currentDisclosureReauthorizationComplete: true;
  };
  sources: Record<string, string>;
  laws: {
    allCurrentSystemsBelongToSystemsSurface: true;
    homeMembershipRequiresExplicitSelection: true;
    researchMembershipRequiresExplicitSelection: true;
    archiveMembershipRequiresExplicitArchivedLifecycleOrSeparateArchivalAuthority: true;
    a2_7MayRewriteRecordLifecycle: false;
    maturityMayDetermineSurfaceMembershipAutomatically: false;
    repositoryOrderMayDetermineRanking: false;
    repositoryRecencyMayDetermineRanking: false;
    rendererMayDetermineRanking: false;
    crossLanguageSelectionDriftAllowed: false;
    surfaceConsumesCurrentEditorialDocumentsOnly: true;
    genericBirthSummaryMayBeEmitted: false;
    surfaceMembershipChangesDisclosure: false;
    surfaceMembershipChangesRouteIdentity: false;
    surfaceMembershipChangesMaturity: false;
    surfaceReconstructionChangesProduction: false;
  };
  selection: {
    systemsSubjectCount: number;
    researchSubjectCount: number;
    archiveSubjectCount: number;
    essaySubjectCount: number;
    noteSubjectCount: number;
    homeSystemSubjectCount: number;
    homeResearchSubjectCount: number;
    homeUniqueSubjectCount: number;
  };
  materialization: {
    currentSuccessorSystemCount: number;
    currentPublicProjectionCount: number;
    currentProjectionOmissionCount: number;
    currentEditorialDocumentCount: number;
    currentSemanticDocumentCount: number;
    currentDocumentOmissionCount: number;
    coreSurfaceCount: number;
    systemsPerLanguage: number;
    researchPerLanguage: number;
    archivePerLanguage: number;
    essaysPerLanguage: number;
    notesPerLanguage: number;
    homeSystemsPerLanguage: number;
    homeResearchPerLanguage: number;
    classifiedMaturityDocumentsPerLanguage: number;
    unclassifiedMaturityDocumentsPerLanguage: number;
  };
  acceptance: {
    allCurrentSystemsProjectedBilingually: boolean;
    allCurrentSystemsMaterializeSemanticDocumentsBilingually: boolean;
    allSystemsSurfaceSubjectsExplicit: boolean;
    homeSelectionExplicit: boolean;
    researchSelectionExplicit: boolean;
    archiveInferenceCount: number;
    rankingInferenceCount: number;
    crossLanguageIdentityDriftCount: number;
    genericBirthSummaryEmissionCount: number;
    surfaceDisclosureMutationCount: number;
    surfaceRouteIdentityMutationCount: number;
    deployedPublicSurfaceMutationCount: number;
    productionMutationCount: number;
    r1_a2_7Complete: boolean;
    currentPublicationValid: boolean;
    cutoverReady: boolean;
    nextRequiredAction: string;
  };
}

export interface CurrentSurfaceItem {
  subjectKey: string;
  targetRef: PinnedRecordRef;
  canonicalPath: string;
  canonicalUrl: string;
  title: string;
  summary: string;
  thesis: string | null;
  maturity: ProjectedMaturity;
  disclosure: EditorialDocumentDto['disclosure'];
}

export interface CurrentSurfaceSection {
  id: CurrentSectionId;
  href: string;
  count: number;
  items: CurrentSurfaceItem[];
}

export interface CurrentSurfaceDto {
  schemaVersion: typeof CURRENT_EDITORIAL_SURFACE_DTO_VERSION;
  id: CurrentCoreSurfaceId;
  language: LanguageTag;
  path: string;
  sections: CurrentSurfaceSection[];
}

export interface CurrentEditorialSurfaceMaterialization {
  projections: PublicProjectionDecision[];
  documents: EditorialDocumentDecision[];
  surfaces: CurrentSurfaceDto[];
  errors: string[];
}

function unique(values: readonly string[]): boolean {
  return new Set(values).size === values.length;
}

function samePinnedRef(left: PinnedRecordRef, right: PinnedRecordRef): boolean {
  return left.recordId === right.recordId && left.revisionId === right.revisionId;
}

function surfacePath(language: LanguageTag, surface: CurrentCoreSurfaceId): string {
  const locale = language === 'pt-BR' ? 'pt-br' : 'en';
  return surface === 'home' ? `/${locale}` : `/${locale}/${surface}`;
}

function targetRef(recordId: RecordId, revisionId: PinnedRecordRef['revisionId']): PinnedRecordRef {
  return { type: 'pinned-record', recordId, revisionId };
}

function materializeCurrentDocument(
  projection: PublicProjectionDecision,
  realizations: readonly CurrentLanguageRealization[],
): EditorialDocumentDecision {
  if (projection.state === 'omitted') {
    return {
      state: 'omitted',
      targetRef: projection.targetRef,
      reasons: [...projection.reasons],
    };
  }
  if (projection.state === 'redirect') {
    return {
      state: 'redirect',
      targetRef: projection.targetRef,
      language: projection.language,
      canonicalPath: projection.canonicalPath,
      canonicalUrl: projection.canonicalUrl,
    };
  }

  const dto = projection.dto;
  if (dto.disclosure.mode === 'sanitized') {
    return {
      state: 'omitted',
      targetRef: dto.targetRef,
      reasons: ['sanitized-content-authority-unavailable'],
    };
  }
  if (dto.disclosure.mode === 'metadata-only') {
    return {
      state: 'document',
      document: {
        schemaVersion: 'editorial-document/v0',
        targetRef: dto.targetRef,
        kind: dto.kind,
        lifecycle: dto.lifecycle,
        language: dto.language,
        canonicalPath: dto.canonicalPath,
        canonicalUrl: dto.canonicalUrl,
        disclosure: {
          mode: 'metadata-only',
          source: dto.disclosure.source,
          evidence: dto.disclosure.evidence,
        },
        maturity: dto.maturity,
        realization: null,
        content: { type: 'metadata-only' },
      },
    };
  }
  if (dto.kind !== 'knowledge.system') {
    return {
      state: 'omitted',
      targetRef: dto.targetRef,
      reasons: ['unsupported-document-kind'],
    };
  }

  const matching = realizations.filter((realization) =>
    realization.binding.targetRef.recordId === dto.targetRef.recordId
    && samePinnedRef(realization.binding.basisRef, dto.targetRef)
    && realization.binding.language === dto.language);

  if (matching.length === 0) {
    return {
      state: 'omitted',
      targetRef: dto.targetRef,
      reasons: ['content-realization-unavailable'],
    };
  }
  if (matching.length !== 1) {
    return {
      state: 'omitted',
      targetRef: dto.targetRef,
      reasons: ['content-realization-conflict'],
    };
  }

  const realization = matching[0];
  return {
    state: 'document',
    document: {
      schemaVersion: 'editorial-document/v0',
      targetRef: dto.targetRef,
      kind: dto.kind,
      lifecycle: dto.lifecycle,
      language: dto.language,
      canonicalPath: dto.canonicalPath,
      canonicalUrl: dto.canonicalUrl,
      disclosure: {
        mode: 'full',
        source: dto.disclosure.source,
        evidence: dto.disclosure.evidence,
      },
      maturity: dto.maturity,
      realization: {
        role: realization.binding.role,
        digest: realization.binding.realizationDigest,
        translatedFrom: realization.binding.translatedFrom,
      },
      content: {
        type: 'knowledge.system',
        name: realization.payload.name,
        summary: realization.payload.summary,
        thesis: realization.payload.thesis,
      },
    },
  };
}

function itemFromDocument(subjectKey: string, document: EditorialDocumentDto): CurrentSurfaceItem | null {
  if (document.content.type !== 'knowledge.system') return null;
  return {
    subjectKey,
    targetRef: document.targetRef,
    canonicalPath: document.canonicalPath,
    canonicalUrl: document.canonicalUrl,
    title: document.content.name,
    summary: document.content.summary,
    thesis: document.content.thesis,
    maturity: document.maturity,
    disclosure: document.disclosure,
  };
}

function selectionSubjects(
  selection: CurrentSurfaceSelection,
  surface: CurrentSectionId,
): string[] {
  if (surface === 'systems') return selection.systems;
  if (surface === 'research') return selection.research;
  if (surface === 'archive') return selection.archive;
  if (surface === 'essays') return selection.essays;
  return selection.notes;
}

function homeSelectionSubjects(
  selection: CurrentSurfaceSelection,
  section: CurrentSectionId,
): string[] {
  if (section === 'systems') return selection.home.systems;
  if (section === 'research') return selection.home.research;
  if (section === 'archive') return selection.home.archive;
  if (section === 'essays') return selection.home.essays;
  return selection.home.notes;
}

function materializeSelectedItems(
  subjectKeys: readonly string[],
  language: LanguageTag,
  documentsBySubjectLanguage: ReadonlyMap<string, EditorialDocumentDto>,
  errors: string[],
  context: string,
): CurrentSurfaceItem[] {
  const items: CurrentSurfaceItem[] = [];
  for (const subjectKey of subjectKeys) {
    const document = documentsBySubjectLanguage.get(`${subjectKey}:${language}`);
    if (!document) {
      errors.push(`${context}:document-missing:${subjectKey}:${language}`);
      continue;
    }
    const item = itemFromDocument(subjectKey, document);
    if (!item) {
      errors.push(`${context}:semantic-document-missing:${subjectKey}:${language}`);
      continue;
    }
    items.push(item);
  }
  return items;
}

export function materializeCurrentEditorialSurfaces(
  manifest: CurrentEditorialSurfaceManifest = currentSurfaceManifestJson as CurrentEditorialSurfaceManifest,
  selection: CurrentSurfaceSelection = CURRENT_SURFACE_SELECTION,
): CurrentEditorialSurfaceMaterialization {
  const errors: string[] = [];
  const current = materializeCurrentSystemRevisions();
  const evidenceMaturity = materializeCurrentEvidenceMaturity();
  const disclosure = materializeCurrentDisclosure();
  const routeAdmission = materializeCurrentRouteAdmission();

  errors.push(...current.errors.map((error) => `current-revision:${error}`));
  errors.push(...evidenceMaturity.errors.map((error) => `current-evidence-maturity:${error}`));
  errors.push(...disclosure.errors.map((error) => `current-disclosure:${error}`));
  errors.push(...routeAdmission.errors.map((error) => `current-route:${error}`));

  if (manifest.schemaVersion !== CURRENT_EDITORIAL_SURFACE_SCHEMA_VERSION) errors.push('manifest-schema-version');
  if (manifest.status !== 'materialized-awaiting-ci' && manifest.status !== 'complete') errors.push('manifest-status');
  if (!unique(selection.systems)) errors.push('systems-selection-duplicate');
  if (!unique(selection.research)) errors.push('research-selection-duplicate');
  if (!unique(selection.home.systems)) errors.push('home-systems-selection-duplicate');
  if (!unique(selection.home.research)) errors.push('home-research-selection-duplicate');

  const successorBySubject = new Map(current.successors.map((entry) => [entry.subjectKey, entry]));
  const successorByRecordId = new Map(current.successors.map((entry) => [entry.recordId, entry]));
  const currentSubjects = current.successors.map((entry) => entry.subjectKey);
  if (selection.systems.length !== currentSubjects.length) errors.push('systems-selection-count');
  if (new Set(selection.systems).size !== currentSubjects.length) errors.push('systems-selection-coverage');
  for (const subjectKey of currentSubjects) {
    if (!selection.systems.includes(subjectKey)) errors.push(`systems-selection-missing:${subjectKey}`);
  }
  for (const subjectKey of [
    ...selection.research,
    ...selection.home.systems,
    ...selection.home.research,
    ...selection.archive,
    ...selection.essays,
    ...selection.notes,
  ]) {
    if (!successorBySubject.has(subjectKey)) errors.push(`surface-selection-unknown-subject:${subjectKey}`);
  }

  if (selection.archive.length > 0) {
    for (const subjectKey of selection.archive) {
      const successor = successorBySubject.get(subjectKey);
      if (successor?.revision.lifecycle !== 'archived') errors.push(`archive-non-archived:${subjectKey}`);
    }
  }

  const disclosureEntries: CurrentGovernanceEntry<DisclosurePayload>[] = disclosure.disclosureRecords.map((record) => ({
    governanceRecordId: record.governanceRecordId,
    lifecycle: 'active',
    payload: record.payload,
  }));
  const maturityEntries: CurrentGovernanceEntry<MaturityPayload>[] = evidenceMaturity.maturityRecords.map((record) => ({
    governanceRecordId: record.governanceRecordId,
    lifecycle: 'active',
    payload: record.payload,
  }));
  const languageBindings = routeAdmission.currentLanguageRealizations.map((entry) => entry.binding);

  const projections: PublicProjectionDecision[] = [];
  const documents: EditorialDocumentDecision[] = [];
  const subjectByRecordId = new Map(current.successors.map((entry) => [entry.recordId, entry.subjectKey]));

  for (const binding of routeAdmission.currentRouteBindings) {
    const route = resolveRouteIdentity(
      binding.path,
      routeAdmission.allRouteBindings,
      routeAdmission.currentHeads,
      languageBindings,
    );
    if (route.state !== 'resolved') {
      errors.push(`projection-route-unresolved:${binding.path}:${route.state}`);
      continue;
    }

    const successor = successorByRecordId.get(route.targetRef.recordId);
    if (!successor) {
      errors.push(`projection-successor-missing:${binding.path}`);
      continue;
    }
    const target: ProjectionTargetHead = {
      recordId: successor.recordId as RecordId,
      revisionId: successor.revision.revisionId,
      kind: 'knowledge.system',
      lifecycle: successor.revision.lifecycle,
    };
    const currentRef = targetRef(target.recordId, target.revisionId);
    const disclosureProjection = deriveGovernanceProjection<DisclosurePayload>(currentRef, disclosureEntries);
    const maturityProjection = deriveGovernanceProjection<MaturityPayload>(currentRef, maturityEntries);
    const projection = projectPublicRecord({
      target,
      disclosure: disclosureProjection,
      maturity: maturityProjection,
      route,
    });
    projections.push(projection);
    documents.push(materializeCurrentDocument(projection, routeAdmission.currentLanguageRealizations));
  }

  const omittedProjections = projections.filter((entry) => entry.state === 'omitted');
  const semanticDocuments = documents.filter((entry): entry is Extract<EditorialDocumentDecision, { state: 'document' }> =>
    entry.state === 'document' && entry.document.content.type === 'knowledge.system');
  const omittedDocuments = documents.filter((entry) => entry.state === 'omitted');

  const documentsBySubjectLanguage = new Map<string, EditorialDocumentDto>();
  for (const decision of semanticDocuments) {
    const subjectKey = subjectByRecordId.get(decision.document.targetRef.recordId);
    if (!subjectKey) {
      errors.push(`document-subject-missing:${decision.document.targetRef.recordId}`);
      continue;
    }
    const key = `${subjectKey}:${decision.document.language}`;
    if (documentsBySubjectLanguage.has(key)) errors.push(`duplicate-current-document:${key}`);
    documentsBySubjectLanguage.set(key, decision.document);
  }

  const surfaces: CurrentSurfaceDto[] = [];
  const sectionOrder: CurrentSectionId[] = ['systems', 'research', 'essays', 'notes', 'archive'];
  for (const language of ['en', 'pt-BR'] as const) {
    for (const surface of CURRENT_CORE_SURFACE_IDS) {
      if (surface === 'home') {
        const sections = sectionOrder.map((sectionId) => {
          const items = materializeSelectedItems(
            homeSelectionSubjects(selection, sectionId),
            language,
            documentsBySubjectLanguage,
            errors,
            `home:${sectionId}`,
          );
          return {
            id: sectionId,
            href: surfacePath(language, sectionId),
            count: items.length,
            items,
          } satisfies CurrentSurfaceSection;
        });
        surfaces.push({
          schemaVersion: CURRENT_EDITORIAL_SURFACE_DTO_VERSION,
          id: 'home',
          language,
          path: surfacePath(language, 'home'),
          sections,
        });
        continue;
      }

      const items = materializeSelectedItems(
        selectionSubjects(selection, surface),
        language,
        documentsBySubjectLanguage,
        errors,
        surface,
      );
      surfaces.push({
        schemaVersion: CURRENT_EDITORIAL_SURFACE_DTO_VERSION,
        id: surface,
        language,
        path: surfacePath(language, surface),
        sections: [{
          id: surface,
          href: surfacePath(language, surface),
          count: items.length,
          items,
        }],
      });
    }
  }

  if (projections.length !== manifest.materialization.currentPublicProjectionCount) errors.push('projection-count-contract');
  if (omittedProjections.length !== manifest.materialization.currentProjectionOmissionCount) errors.push('projection-omission-contract');
  if (documents.length !== manifest.materialization.currentEditorialDocumentCount) errors.push('document-count-contract');
  if (semanticDocuments.length !== manifest.materialization.currentSemanticDocumentCount) errors.push('semantic-document-count-contract');
  if (omittedDocuments.length !== manifest.materialization.currentDocumentOmissionCount) errors.push('document-omission-contract');
  if (surfaces.length !== manifest.materialization.coreSurfaceCount) errors.push('surface-count-contract');

  return {
    projections,
    documents,
    surfaces,
    errors: [...new Set(errors)],
  };
}
