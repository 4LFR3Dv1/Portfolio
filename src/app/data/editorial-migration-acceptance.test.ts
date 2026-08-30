import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  frozenEvidenceLocatorSet,
  reservedRecordIds,
  validateMigrationAcceptance,
  type LegacySurfaceFreeze,
  type MigrationContract,
} from './editorial-migration-acceptance';

function readRepoFile(path: string): string {
  return readFileSync(new URL(`../../../${path}`, import.meta.url), 'utf8');
}

const contract = JSON.parse(
  readRepoFile('docs/editorial/migration-acceptance.v0.json'),
) as MigrationContract;

const freeze = JSON.parse(
  readRepoFile('docs/editorial/legacy/portfolio-surface.v0.json'),
) as LegacySurfaceFreeze;

const routeLanguage = JSON.parse(
  readRepoFile('docs/editorial/route-language-identity.v0.json'),
) as { status: string; acceptance: { r0_7Complete: boolean } };

describe('R0.8 Migration & Acceptance', () => {
  it('starts only from the frozen R0.0 inventory after R0.7', () => {
    expect(routeLanguage.status).toBe('frozen');
    expect(routeLanguage.acceptance.r0_7Complete).toBe(true);
    expect(contract.preconditions.r0_7Complete).toBe(true);
    expect(contract.preconditions.legacyFreezeId).toBe(freeze.freezeId);
    expect(contract.preconditions.legacyCommit).toBe(freeze.canonical.commit);
  });

  it('reconciles the complete frozen surface with zero validator findings', () => {
    expect(validateMigrationAcceptance(contract, freeze)).toEqual([]);
  });

  it('maps every legacy Project exactly once without preserving Project as ontology root', () => {
    expect(contract.projectMappings.map((entry) => entry.legacyId).sort()).toEqual(
      freeze.projects.map((entry) => entry.id).sort(),
    );
    expect(contract.projectMappings.every((entry) =>
      entry.targetKind === 'knowledge.system' || entry.targetKind === 'representation.publication',
    )).toBe(true);
  });

  it('preserves every frozen guarantee label without manufacturing evidential rank', () => {
    for (const project of freeze.projects) {
      const mapping = contract.projectMappings.find((entry) => entry.legacyId === project.id);
      expect(mapping).toBeDefined();
      expect(mapping?.guarantees.map((entry) => entry.label)).toEqual(project.guarantees);
      expect(mapping?.guarantees.every((entry) =>
        entry.disposition === 'knowledge.claim' || entry.disposition === 'representation-text',
      )).toBe(true);
    }
  });

  it('reconciles VERIFY SYSTEMS as one Publication identity across legacy project and publication surfaces', () => {
    const project = contract.projectMappings.find((entry) => entry.legacyId === 'verify-systems');
    const publication = contract.publicationMappings.find((entry) => entry.legacyId === 'verify-systems');
    expect(project?.targetKind).toBe('representation.publication');
    expect(project?.targetRecordId).toBe(publication?.targetRecordId);
    expect(project?.guarantees.every((entry) => entry.disposition === 'representation-text')).toBe(true);
  });

  it('decomposes private and case-study legacy surfaces as sanitized public-safe records', () => {
    const agentic = contract.projectMappings.find((entry) => entry.legacyId === 'agentic-systems');
    const support = contract.projectMappings.find((entry) => entry.legacyId === 'transactional-support-bot');
    expect(agentic?.disclosurePlan).toEqual({
      record: 'public', source: 'private', evidence: 'none', mode: 'sanitized',
    });
    expect(support?.disclosurePlan).toEqual({
      record: 'public', source: 'private', evidence: 'private', mode: 'sanitized',
    });
  });

  it('does not invent maturity beyond the explicit pre-beta legacy fact', () => {
    const classified = contract.projectMappings.filter((entry) => entry.maturityPlan !== null);
    expect(classified).toHaveLength(1);
    expect(classified[0].legacyId).toBe('xs-wallet');
    expect(classified[0].maturityPlan).toBe('pre-beta');
  });

  it('maps all five frozen Architecture views to representation records with resolved System subjects', () => {
    expect(contract.architectureMappings.map((entry) => entry.legacyId).sort()).toEqual(
      freeze.architectureViews.map((entry) => entry.id).sort(),
    );
    expect(contract.architectureMappings.every((entry) => entry.targetKind === 'representation.architecture')).toBe(true);
    expect(contract.architectureMappings.every((entry) => entry.subjectRecordIds.length > 0)).toBe(true);
    expect(contract.architectureMappings.every((entry) => entry.guaranteeDisposition === 'representation-text')).toBe(true);
  });

  it('introduces only one supporting System, grounded by the frozen settlement architecture', () => {
    expect(contract.supportingSystemMappings).toHaveLength(1);
    expect(contract.supportingSystemMappings[0].name).toBe('Foundry Pay');
    expect(contract.supportingSystemMappings[0].source).toBe('architecture:settlement');
    expect(contract.supportingSystemMappings[0].targetKind).toBe('knowledge.system');
  });

  it('maps every frozen Publication and preserves its artifact locator', () => {
    expect(contract.publicationMappings.map((entry) => entry.legacyId).sort()).toEqual(
      freeze.publications.map((entry) => entry.id).sort(),
    );
    for (const publication of freeze.publications) {
      expect(contract.publicationMappings.find((entry) => entry.legacyId === publication.id)?.artifactLocator)
        .toBe(publication.locator);
    }
  });

  it('reconciles duplicate legacy evidence catalogs into one locator treatment each', () => {
    const frozen = frozenEvidenceLocatorSet(freeze);
    expect(contract.evidenceMappings.map((entry) => entry.locator).sort()).toEqual(frozen);
    expect(new Set(contract.evidenceMappings.map((entry) => entry.locator)).size).toBe(frozen.length);
  });

  it('requires fresh capture for occurrence-style evidence whose freeze contains only a locator', () => {
    const recapture = contract.evidenceMappings
      .filter((entry) => entry.treatment === 'recapture-required')
      .map((entry) => entry.locator)
      .sort();
    expect(recapture).toEqual([
      'https://vira.snelabs.space/public/playback',
      'https://vira.snelabs.space/ready',
      'https://www.youtube.com/watch?v=LnOd2kWTiGA',
    ].sort());
    expect(contract.evidenceMappings
      .filter((entry) => entry.treatment === 'recapture-required')
      .every((entry) => entry.facet === null)).toBe(true);
  });

  it('covers every frozen public route without pretending unprefixed legacy paths are R0.7 aliases', () => {
    expect(contract.compatibilityRoutes.map((entry) => entry.legacyPath).sort()).toEqual(
      freeze.routes.sort(),
    );
    expect(contract.compatibilityRoutes
      .filter((entry) => entry.legacyPath.startsWith('/work/'))
      .every((entry) => entry.mode === 'language-negotiating-redirect')).toBe(true);
    expect(contract.compatibilityRoutes.find((entry) => entry.legacyPath === '/')?.mode).toBe('service-route');
    expect(contract.compatibilityRoutes.find((entry) => entry.legacyPath === '/architecture')?.mode).toBe('service-route');
  });

  it('reserves opaque unique top-level RecordIds without performing Birth in R0', () => {
    const reservations = reservedRecordIds(contract);
    expect(reservations.length).toBeGreaterThan(10);
    expect(new Set(reservations).size).toBe(reservations.length);
    expect(contract.migrationBoundary.birthOccursInR1).toBe(true);
    expect(contract.migrationBoundary.reservedIdsAreNotBornRecords).toBe(true);
  });

  it('keeps known runtime mismatches explicit for R1 rather than claiming them fixed', () => {
    expect(contract.deferredRuntimeCorrections.map((entry) => entry.id).sort()).toEqual([
      'generated-indexes', 'locale-routing', 'runtime-404',
    ]);
    expect(contract.deferredRuntimeCorrections.every((entry) => entry.owner === 'R1')).toBe(true);
    expect(contract.migrationBoundary.runtimeSemanticsChanged).toBe(false);
    expect(contract.migrationBoundary.publicUiChanged).toBe(false);
    expect(contract.migrationBoundary.legacyCompatibilityEnacted).toBe(false);
  });

  it('freezes exactly twenty contiguous migration laws', () => {
    const expected = Array.from({ length: 20 }, (_, index) => `RMA-${String(index + 1).padStart(2, '0')}`);
    expect(contract.laws.map((law) => law.id)).toEqual(expected);
    expect(new Set(contract.laws.map((law) => law.title)).size).toBe(20);
    for (const law of contract.laws) {
      expect(law.rule.length).toBeGreaterThan(50);
      expect(law.rule).toMatch(/\b(MUST|MAY)\b/);
    }
  });

  it('materializes with zero semantic loss but waits for the CI witness before R0_COMPLETE', () => {
    expect(contract.status).toBe('materialized');
    expect(contract.normative).toBe(true);
    expect(contract.ciWitness).toBeNull();
    expect(contract.acceptance.r0_7Preserved).toBe(true);
    expect(contract.acceptance.legacyCoverageComplete).toBe(true);
    expect(contract.acceptance.semanticLossCount).toBe(0);
    expect(contract.acceptance.unresolvedMigrationCount).toBe(0);
    expect(contract.acceptance.runtimeSemanticsChanged).toBe(false);
    expect(contract.acceptance.uiChanged).toBe(false);
    expect(contract.acceptance.r0Complete).toBe(false);
  });
});
