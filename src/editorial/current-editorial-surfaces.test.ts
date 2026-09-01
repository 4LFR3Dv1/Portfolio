import { describe, expect, it } from 'vitest';
import currentSurfaceManifestJson from '../../docs/editorial/R1-A2.7-current-editorial-surfaces.v0.json';
import currentSurfaceCompletionJson from '../../docs/editorial/R1-A2.7-completion.v0.json';
import { CURRENT_SURFACE_SELECTION } from './current-surface-candidates';
import {
  materializeCurrentEditorialSurfaces,
  type CurrentEditorialSurfaceManifest,
} from './current-surface-runtime';
import { materializeCurrentSystemRevisions } from './current-revision-runtime';
import { materializeCurrentEvidenceMaturity } from './current-evidence-maturity-runtime';

const manifest = currentSurfaceManifestJson as CurrentEditorialSurfaceManifest;
const completion = currentSurfaceCompletionJson as {
  status: string;
  candidateWitness: Record<string, string | number>;
  materialization: Record<string, string | number | boolean>;
  productionBoundary: Record<string, string | number | boolean>;
  acceptance: Record<string, string | number | boolean>;
};
const materialized = materializeCurrentEditorialSurfaces();
const revisions = materializeCurrentSystemRevisions();
const maturity = materializeCurrentEvidenceMaturity();
const genericBirthSummary = 'Durable System subject admitted from the connected GitHub corpus grounding.';

function surface(id: 'home' | 'systems' | 'archive' | 'research' | 'essays' | 'notes', language: 'en' | 'pt-BR') {
  return materialized.surfaces.find((entry) => entry.id === id && entry.language === language);
}

describe('R1-A2.7 current editorial surface reconstruction', () => {
  it('projects and materializes all 27 current Systems in both admitted languages', () => {
    expect(materialized.errors).toEqual([]);
    expect(revisions.errors).toEqual([]);
    expect(materialized.projections).toHaveLength(54);
    expect(materialized.projections.every((entry) => entry.state === 'projected')).toBe(true);
    expect(materialized.documents).toHaveLength(54);
    expect(materialized.documents.every((entry) => entry.state === 'document')).toBe(true);

    const semantic = materialized.documents.filter((entry) =>
      entry.state === 'document' && entry.document.content.type === 'knowledge.system');
    expect(semantic).toHaveLength(54);
    expect(semantic.filter((entry) => entry.state === 'document' && entry.document.language === 'en')).toHaveLength(27);
    expect(semantic.filter((entry) => entry.state === 'document' && entry.document.language === 'pt-BR')).toHaveLength(27);
    expect(semantic.every((entry) =>
      entry.state === 'document'
      && entry.document.content.type === 'knowledge.system'
      && entry.document.content.summary !== genericBirthSummary)).toBe(true);
  });

  it('makes Systems the complete explicit current corpus without inventing a current Transactional Support Bot', () => {
    expect(CURRENT_SURFACE_SELECTION.systems).toHaveLength(27);
    expect(new Set(CURRENT_SURFACE_SELECTION.systems).size).toBe(27);
    expect(new Set(CURRENT_SURFACE_SELECTION.systems)).toEqual(new Set(revisions.successors.map((entry) => entry.subjectKey)));
    expect(CURRENT_SURFACE_SELECTION.systems).not.toContain('transactional-support-bot');

    const en = surface('systems', 'en');
    const pt = surface('systems', 'pt-BR');
    expect(en?.sections[0].count).toBe(27);
    expect(pt?.sections[0].count).toBe(27);
    expect(en?.sections[0].items.map((item) => item.subjectKey)).toEqual(CURRENT_SURFACE_SELECTION.systems);
    expect(pt?.sections[0].items.map((item) => item.subjectKey)).toEqual(CURRENT_SURFACE_SELECTION.systems);
    expect(en?.sections[0].items.map((item) => item.targetRef.recordId)).toEqual(
      pt?.sections[0].items.map((item) => item.targetRef.recordId),
    );
  });

  it('freezes Home as an explicit editorial selection rather than a maturity or repository ranking', () => {
    const en = surface('home', 'en');
    const pt = surface('home', 'pt-BR');
    expect(en?.sections.map((section) => section.id)).toEqual(['systems', 'research', 'essays', 'notes', 'archive']);
    expect(pt?.sections.map((section) => section.id)).toEqual(['systems', 'research', 'essays', 'notes', 'archive']);

    const enSystems = en?.sections.find((section) => section.id === 'systems');
    const enResearch = en?.sections.find((section) => section.id === 'research');
    const ptSystems = pt?.sections.find((section) => section.id === 'systems');
    const ptResearch = pt?.sections.find((section) => section.id === 'research');

    expect(enSystems?.items.map((item) => item.subjectKey)).toEqual([
      'genesis',
      'brine',
      'lisa',
      'factory',
      'foundry',
      'sne-fde',
      'agenthub',
    ]);
    expect(enResearch?.items.map((item) => item.subjectKey)).toEqual([
      'brineos',
      'wer-esk',
      'sne-trading',
      'ordm',
      'sne-observatorio',
    ]);
    expect(ptSystems?.items.map((item) => item.targetRef.recordId)).toEqual(
      enSystems?.items.map((item) => item.targetRef.recordId),
    );
    expect(ptResearch?.items.map((item) => item.targetRef.recordId)).toEqual(
      enResearch?.items.map((item) => item.targetRef.recordId),
    );
    expect(new Set([
      ...(enSystems?.items.map((item) => item.subjectKey) ?? []),
      ...(enResearch?.items.map((item) => item.subjectKey) ?? []),
    ]).size).toBe(12);
  });

  it('keeps research membership explicit and proves it is not a maturity shortcut', () => {
    const research = surface('research', 'en');
    expect(research?.sections[0].items.map((item) => item.subjectKey)).toEqual(CURRENT_SURFACE_SELECTION.research);
    expect(research?.sections[0].count).toBe(5);

    const maturityBySubject = new Map(maturity.maturityResolutions.map((entry) => [entry.subjectKey, entry]));
    expect(maturityBySubject.get('brineos')).toMatchObject({ state: 'classified', stage: 'research' });
    expect(maturityBySubject.get('sne-trading')).toMatchObject({ state: 'classified', stage: 'research' });
    expect(maturityBySubject.get('ordm')).toMatchObject({ state: 'classified', stage: 'research' });
    expect(maturityBySubject.get('sne-observatorio')).toMatchObject({ state: 'classified', stage: 'research' });
    expect(maturityBySubject.get('wer-esk')).toMatchObject({ state: 'unclassified', stage: null });
    expect(CURRENT_SURFACE_SELECTION.research).toContain('wer-esk');
  });

  it('does not fabricate archive, essay or note membership from historical prose or System records', () => {
    for (const language of ['en', 'pt-BR'] as const) {
      expect(surface('archive', language)?.sections[0].count).toBe(0);
      expect(surface('essays', language)?.sections[0].count).toBe(0);
      expect(surface('notes', language)?.sections[0].count).toBe(0);
    }
    expect(CURRENT_SURFACE_SELECTION.archive).toEqual([]);
    expect(CURRENT_SURFACE_SELECTION.essays).toEqual([]);
    expect(CURRENT_SURFACE_SELECTION.notes).toEqual([]);
    expect(revisions.successors.filter((entry) => entry.revision.lifecycle === 'archived')).toHaveLength(0);
  });

  it('preserves disclosure and maturity semantics while translating only content realization', () => {
    const enGenesis = surface('systems', 'en')?.sections[0].items.find((item) => item.subjectKey === 'genesis');
    const ptGenesis = surface('systems', 'pt-BR')?.sections[0].items.find((item) => item.subjectKey === 'genesis');
    expect(enGenesis?.disclosure).toMatchObject({ mode: 'full', source: 'private', evidence: 'private' });
    expect(ptGenesis?.disclosure).toEqual(enGenesis?.disclosure);
    expect(ptGenesis?.targetRef).toEqual(enGenesis?.targetRef);
    expect(ptGenesis?.canonicalPath).toBe('/pt-br/systems/genesis');
    expect(enGenesis?.canonicalPath).toBe('/en/systems/genesis');
    expect(ptGenesis?.summary).not.toBe(enGenesis?.summary);

    const enSystems = surface('systems', 'en')?.sections[0].items ?? [];
    expect(enSystems.filter((item) => item.maturity.state === 'classified')).toHaveLength(8);
    expect(enSystems.filter((item) => item.maturity.state === 'unclassified')).toHaveLength(19);
  });

  it('seals exactly twelve current semantic surfaces while production remains untouched', () => {
    expect(manifest.status).toBe('complete');
    expect(materialized.surfaces).toHaveLength(12);
    expect(new Set(materialized.surfaces.map((entry) => entry.path)).size).toBe(12);
    expect(manifest.selection).toMatchObject({
      systemsSubjectCount: 27,
      researchSubjectCount: 5,
      archiveSubjectCount: 0,
      essaySubjectCount: 0,
      noteSubjectCount: 0,
      homeSystemSubjectCount: 7,
      homeResearchSubjectCount: 5,
      homeUniqueSubjectCount: 12,
    });
    expect(manifest.materialization).toMatchObject({
      currentSuccessorSystemCount: 27,
      currentPublicProjectionCount: 54,
      currentProjectionOmissionCount: 0,
      currentEditorialDocumentCount: 54,
      currentSemanticDocumentCount: 54,
      currentDocumentOmissionCount: 0,
      coreSurfaceCount: 12,
      systemsPerLanguage: 27,
      researchPerLanguage: 5,
      archivePerLanguage: 0,
      essaysPerLanguage: 0,
      notesPerLanguage: 0,
      homeSystemsPerLanguage: 7,
      homeResearchPerLanguage: 5,
      classifiedMaturityDocumentsPerLanguage: 8,
      unclassifiedMaturityDocumentsPerLanguage: 19,
    });
    expect(manifest.acceptance).toMatchObject({
      rankingInferenceCount: 0,
      crossLanguageIdentityDriftCount: 0,
      genericBirthSummaryEmissionCount: 0,
      surfaceDisclosureMutationCount: 0,
      surfaceRouteIdentityMutationCount: 0,
      deployedPublicSurfaceMutationCount: 0,
      productionMutationCount: 0,
      r1_a2_7Complete: true,
      currentPublicationValid: false,
      cutoverReady: false,
      nextRequiredAction: 'R1-A2.8 — Current Publication Acceptance',
    });
    expect(completion.status).toBe('complete');
    expect(completion.candidateWitness).toMatchObject({
      branchHead: 'd764c401e2d624f67f3eb5ef955781c591670e2b',
      verifyRunNumber: 325,
      verifyConclusion: 'success',
      editorialShellBuildRunNumber: 160,
      editorialShellBuildConclusion: 'success',
      cutoverReadinessRunNumber: 91,
      cutoverReadinessConclusion: 'success',
    });
    expect(completion.productionBoundary).toMatchObject({
      publicRuntimeChanged: false,
      productionDnsChanged: false,
      railwayTargetChanged: false,
      vercelConfigurationChanged: false,
      deployedPublicSurfaceMutationCount: 0,
      productionMutationCount: 0,
    });
    expect(completion.acceptance).toMatchObject({
      r1_a2_7Complete: true,
      currentPublicationValid: false,
      cutoverReady: false,
      cutoverAuthorized: false,
      cutoverEnacted: false,
      nextRequiredCut: 'R1-A2.8 — Current Publication Acceptance',
    });
  });
});
