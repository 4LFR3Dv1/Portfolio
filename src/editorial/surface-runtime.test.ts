import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  materializeRegistryRecords,
  reconstructRecordRegistry,
  type RecordRegistryManifest,
} from './record-registry';
import {
  reconstructRouteRuntime,
  type RouteRuntimeManifest,
} from './route-runtime';
import {
  reconstructLanguageRuntime,
  type LanguageRuntimeManifest,
} from './language-runtime';
import {
  materializeSurfaceDocuments,
  reconstructCoreSurfaceRuntime,
  reconstructSurfaceGovernance,
  type CoreEditorialSurfaceManifest,
} from './surface-runtime';

interface MigrationPlan {
  projectMappings: Array<{
    legacyId: string;
    targetRecordId: string;
    targetKind: string;
    disclosurePlan: {
      record: string;
      source: string;
      evidence: string;
      mode: string;
    };
    maturityPlan: string | null;
  }>;
  supportingSystemMappings: Array<{
    name: string;
    targetRecordId: string;
    targetKind: string;
    disclosurePlan: {
      record: string;
      source: string;
      evidence: string;
      mode: string;
    };
  }>;
}

interface R15Completion {
  acceptance: {
    r1_5Complete: true;
    documentRuntimeMaterialized: true;
    currentEditorialDocumentCount: 0;
    nextRequiredCut: 'R1.6 — Core Editorial Surfaces';
  };
}

function readRepoFile(path: string): string {
  return readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
}

const manifest = JSON.parse(
  readRepoFile('docs/editorial/core-editorial-surfaces.v0.json'),
) as CoreEditorialSurfaceManifest;
const registryManifest = JSON.parse(
  readRepoFile('docs/editorial/record-registry.v0.json'),
) as RecordRegistryManifest;
const routeManifest = JSON.parse(
  readRepoFile('docs/editorial/route-runtime.v0.json'),
) as RouteRuntimeManifest;
const languageManifest = JSON.parse(
  readRepoFile('docs/editorial/language-runtime.v0.json'),
) as LanguageRuntimeManifest;
const migration = JSON.parse(
  readRepoFile('docs/editorial/migration-acceptance.v0.json'),
) as MigrationPlan;
const r15Completion = JSON.parse(
  readRepoFile('docs/editorial/R1.5-completion.v0.json'),
) as R15Completion;

const records = materializeRegistryRecords(registryManifest);
const registry = reconstructRecordRegistry(registryManifest);
const routeRuntime = reconstructRouteRuntime(routeManifest, records);
const languageRuntime = reconstructLanguageRuntime(languageManifest, records);
const state = materializeSurfaceDocuments(
  manifest,
  records,
  registry,
  routeRuntime,
  languageRuntime,
);
const surfaces = reconstructCoreSurfaceRuntime(manifest, state.documents);

function migrationDisclosure(targetRecordId: string) {
  const entries = [...migration.projectMappings, ...migration.supportingSystemMappings];
  return entries.find((entry) => entry.targetRecordId === targetRecordId)?.disclosurePlan;
}

function surface(id: string, language: 'en' | 'pt-BR') {
  return surfaces.surfaces.find((entry) => entry.id === id && entry.language === language);
}

describe('R1.6 Core Editorial Surfaces', () => {
  it('starts only from the terminally sealed R1.5 document boundary', () => {
    expect(r15Completion.acceptance).toMatchObject({
      r1_5Complete: true,
      documentRuntimeMaterialized: true,
      currentEditorialDocumentCount: 0,
      nextRequiredCut: 'R1.6 — Core Editorial Surfaces',
    });
    expect(registry.errors).toEqual([]);
    expect(routeRuntime.state).toBe('ready');
    expect(languageRuntime.state).toBe('ready');
    expect(manifest.baseline).toBe('89d279400a497b794310543a074462ef10b9d65b');
  });

  it('admits only the five still-valid explicit R0.8 System disclosure plans and the one explicit maturity plan', () => {
    const disclosures = manifest.governanceAssignments.filter((entry) => entry.kind === 'governance.disclosure');
    const maturity = manifest.governanceAssignments.filter((entry) => entry.kind === 'governance.maturity');

    expect(disclosures).toHaveLength(5);
    expect(maturity).toHaveLength(1);
    expect(manifest.governanceAdmission.policyInferenceAllowed).toBe(false);
    expect(new Set(disclosures.map((entry) => entry.targetRecordId))).toEqual(new Set(routeManifest.assignments.map((entry) => entry.targetRecordId)));

    for (const assignment of disclosures) {
      if (assignment.kind !== 'governance.disclosure') continue;
      const plan = migrationDisclosure(assignment.targetRecordId);
      expect(plan).toBeDefined();
      expect(assignment.visibility).toEqual({
        record: plan?.record,
        source: plan?.source,
        evidence: plan?.evidence,
      });
      expect(assignment.disclosure).toBe(plan?.mode);
    }

    expect(maturity[0]).toMatchObject({
      kind: 'governance.maturity',
      targetRecordId: 'rec_724d518ee338e32eb06e79077ad01f3d',
      stage: 'pre-beta',
    });
    expect(migration.projectMappings.find((entry) => entry.legacyId === 'xs-wallet')?.maturityPlan).toBe('pre-beta');
  });

  it('materializes six generation-zero governance Records against exact current target revisions', () => {
    const governance = reconstructSurfaceGovernance(manifest, records, registry);
    expect(governance.state).toBe('ready');
    expect(governance.errors).toEqual([]);
    expect(governance.records).toHaveLength(6);
    expect(new Set(governance.records.map((entry) => entry.recordId)).size).toBe(6);

    const registryIds = new Set(records.map((record) => record.recordId));
    for (const record of governance.records) {
      expect(registryIds.has(record.recordId)).toBe(false);
      expect(record.revision.recordId).toBe(record.recordId);
      expect(record.revision.kind).toBe(record.kind);
      expect(record.revision.generation).toBe(0);
      expect(record.revision.previousRevisionId).toBeNull();
      expect(record.revision.lifecycle).toBe('active');
      expect(record.payload.basisRef.revisionId).toBe(
        registry.records.get(record.payload.targetRef.recordId)?.headRevisionId,
      );
    }
  });

  it('turns the ten routed language pairs into ten public projections without treating sanitized content as renderable', () => {
    expect(state.governance.state).toBe('ready');
    expect(state.projections).toHaveLength(10);
    expect(state.projections.filter((entry) => entry.state === 'projected')).toHaveLength(10);
    expect(state.documents).toHaveLength(10);
    expect(state.documents.filter((entry) => entry.state === 'document')).toHaveLength(6);

    const sanitizedOmissions = state.documents.filter((entry) =>
      entry.state === 'omitted' && entry.reasons.includes('sanitized-content-authority-unavailable'));
    expect(sanitizedOmissions).toHaveLength(4);
    expect(manifest.currentState.publicProjectionCount).toBe(10);
    expect(manifest.currentState.editorialDocumentCount).toBe(6);
    expect(manifest.currentState.sanitizedDocumentOmissions).toBe(4);
  });

  it('preserves the explicit XS Wallet maturity classification without upgrading it into evidence', () => {
    const xs = state.projections.find((entry) =>
      entry.state === 'projected'
      && entry.dto.targetRef.recordId === 'rec_724d518ee338e32eb06e79077ad01f3d'
      && entry.dto.language === 'en');
    expect(xs?.state).toBe('projected');
    if (!xs || xs.state !== 'projected') return;
    expect(xs.dto.maturity).toEqual({ state: 'classified', stage: 'pre-beta' });
    expect(xs.dto.disclosure.evidence).toBe('public');
  });

  it('materializes twelve deterministic language-specific surface DTOs from documents only', () => {
    expect(surfaces.state).toBe('ready');
    expect(surfaces.errors).toEqual([]);
    expect(surfaces.surfaces).toHaveLength(12);
    expect(new Set(surfaces.surfaces.map((entry) => entry.path)).size).toBe(12);
    expect(manifest.surfaceAdmission.rankingInferenceAllowed).toBe(false);
    expect(manifest.surfaceAdmission.chronologyInferenceAllowed).toBe(false);
    expect(manifest.surfaceAdmission.surfacePathInferenceAllowed).toBe(false);

    const expectedPaths = [
      '/en', '/en/systems', '/en/archive', '/en/research', '/en/essays', '/en/notes',
      '/pt-br', '/pt-br/systems', '/pt-br/archive', '/pt-br/research', '/pt-br/essays', '/pt-br/notes',
    ];
    expect(surfaces.surfaces.map((entry) => entry.path).sort()).toEqual(expectedPaths.sort());
  });

  it('publishes only the three full-disclosure System documents into each Systems surface', () => {
    for (const language of ['en', 'pt-BR'] as const) {
      const systems = surface('systems', language);
      expect(systems).toBeDefined();
      expect(systems?.sections).toHaveLength(1);
      expect(systems?.sections[0].count).toBe(3);
      expect(systems?.sections[0].items.map((item) => item.title)).toEqual([
        'SNE-OS',
        'VIRA',
        'XS Wallet / Domini',
      ]);
      expect(systems?.sections[0].items.every((item) => item.semanticContentAvailable)).toBe(true);
      expect(systems?.sections[0].items.some((item) => item.title === 'Foundry Pay')).toBe(false);
      expect(systems?.sections[0].items.some((item) => item.title === 'Transactional Support Bot')).toBe(false);
    }
  });

  it('keeps Home and Archive deterministic while leaving unborn editorial families empty', () => {
    for (const language of ['en', 'pt-BR'] as const) {
      const home = surface('home', language);
      const systemsSection = home?.sections.find((section) => section.id === 'systems');
      const archiveSection = home?.sections.find((section) => section.id === 'archive');
      expect(systemsSection?.count).toBe(3);
      expect(archiveSection?.count).toBe(3);

      expect(surface('archive', language)?.sections[0].count).toBe(3);
      expect(surface('research', language)?.sections[0].count).toBe(0);
      expect(surface('essays', language)?.sections[0].count).toBe(0);
      expect(surface('notes', language)?.sections[0].count).toBe(0);
    }
  });

  it('never mixes EN and PT-BR documents inside a localized surface', () => {
    for (const surfaceDto of surfaces.surfaces) {
      const localeSegment = surfaceDto.language === 'pt-BR' ? '/pt-br/' : '/en/';
      for (const section of surfaceDto.sections) {
        for (const item of section.items) {
          expect(`${item.canonicalPath}/`).toContain(localeSegment);
        }
      }
    }
    expect(manifest.acceptance.crossLanguageMixingForbidden).toBe(true);
  });

  it('does not convert surface materialization into a public framework cutover', () => {
    expect(manifest.currentState.frameworkCutoverEnacted).toBe(false);
    expect(manifest.currentState.staticHtmlRenderingEnacted).toBe(false);
    expect(manifest.currentState.publicUiChanged).toBe(false);
    expect(manifest.currentState.deployedRuntimeChanged).toBe(false);
    expect(manifest.acceptance.sanitizedContentLeakCount).toBe(0);
    expect(manifest.acceptance.r1_6Complete).toBe(false);
  });
});
