import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import type { CurrentRecordHead } from '../app/data/editorial-route-language-identity';
import {
  materializeRegistryRecords,
  reconstructRecordRegistry,
  type RecordRegistryManifest,
} from './record-registry';
import {
  materializeRouteBindings,
  reconstructRouteRuntime,
  resolveRoutePath,
  validateRouteRuntimeEvolution,
  type RouteRuntimeManifest,
} from './route-runtime';

interface R12Completion {
  acceptance: {
    r1_1Complete: true;
    r1_2Complete: true;
    projectionEngineDeterministic: true;
    currentPublicProjectionCount: 0;
    nextRequiredCut: 'R1.3 — Route Runtime';
  };
}

interface MigrationRouteEntry {
  targetRecordId: string;
  targetKind: string;
  canonicalRoutes: Partial<Record<'en' | 'pt-BR', string>>;
}

interface MigrationManifest {
  projectMappings: MigrationRouteEntry[];
  supportingSystemMappings: MigrationRouteEntry[];
}

function readRepoFile(path: string): string {
  return readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
}

const routeManifest = JSON.parse(
  readRepoFile('docs/editorial/route-runtime.v0.json'),
) as RouteRuntimeManifest;
const registryManifest = JSON.parse(
  readRepoFile('docs/editorial/record-registry.v0.json'),
) as RecordRegistryManifest;
const migration = JSON.parse(
  readRepoFile('docs/editorial/migration-acceptance.v0.json'),
) as MigrationManifest;
const r12Completion = JSON.parse(
  readRepoFile('docs/editorial/R1.2-completion.v0.json'),
) as R12Completion;
const r1Readme = readRepoFile('docs/editorial/R1-README.md');
const amendment = readRepoFile('docs/editorial/R0-A1-legacy-agentic-migration-amendment.md');

const birthRecords = materializeRegistryRecords(registryManifest);
const registry = reconstructRecordRegistry(registryManifest);
const currentHeads: CurrentRecordHead[] = [...registry.records.values()]
  .filter((record) => record.headRevisionId !== null)
  .map((record) => ({
    recordId: record.recordId,
    revisionId: record.headRevisionId!,
  }));

function cloneManifest(): RouteRuntimeManifest {
  return JSON.parse(JSON.stringify(routeManifest)) as RouteRuntimeManifest;
}

function plannedBornSystemRoutes(): string[] {
  const bornIds = new Set(birthRecords.map((record) => record.recordId));
  const entries = [...migration.projectMappings, ...migration.supportingSystemMappings]
    .filter((entry) => entry.targetKind === 'knowledge.system' && bornIds.has(entry.targetRecordId as `rec_${string}`));

  return entries
    .flatMap((entry) => Object.values(entry.canonicalRoutes))
    .filter((path): path is string => typeof path === 'string')
    .sort();
}

describe('R1.3 Route Runtime', () => {
  it('starts only after the Projection Engine is terminally sealed', () => {
    expect(r12Completion.acceptance).toMatchObject({
      r1_1Complete: true,
      r1_2Complete: true,
      projectionEngineDeterministic: true,
      currentPublicProjectionCount: 0,
      nextRequiredCut: 'R1.3 — Route Runtime',
    });
    expect(registry.errors).toEqual([]);
    expect(r1Readme).toMatch(/\| R1\.3 \| Route Runtime \| \*\*(?:NEXT|COMPLETE)\*\* \|/);
  });

  it('admits exactly the still-valid R0.8 canonical route plans whose System targets are actually born', () => {
    const expected = plannedBornSystemRoutes();
    const admitted = routeManifest.assignments.map((assignment) => assignment.path).sort();

    expect(expected).toHaveLength(10);
    expect(admitted).toEqual(expected);
    expect(routeManifest.assignments).toHaveLength(10);
    expect(new Set(routeManifest.assignments.map((assignment) => assignment.targetRecordId)).size).toBe(5);
    expect(routeManifest.assignments.every((assignment) => assignment.role === 'canonical')).toBe(true);
  });

  it('does not invent routes for the other 23 born Systems merely because Record identity exists', () => {
    const routedIds = new Set(routeManifest.assignments.map((assignment) => assignment.targetRecordId));
    const unrouted = birthRecords.filter((record) => !routedIds.has(record.recordId));

    expect(birthRecords).toHaveLength(28);
    expect(unrouted).toHaveLength(23);
    expect(routeManifest.deferred.bornSystemsWithoutRouteCount).toBe(23);
    expect(routeManifest.admission.runtimePathInferenceAllowed).toBe(false);
    expect(unrouted.some((record) => record.subjectKey === 'genesis')).toBe(true);
    expect(unrouted.some((record) => record.subjectKey === 'brineos')).toBe(true);
    expect(unrouted.some((record) => record.subjectKey === 'lisa')).toBe(true);
  });

  it('cancels the never-enacted Agentic canonical plans and never binds the retired pre-Birth identity', () => {
    const retiredId = registryManifest.identityPool.retiredPreBirth[0].recordId;
    const admittedPaths = new Set(routeManifest.assignments.map((assignment) => assignment.path));

    expect(amendment).toContain('/en/systems/agentic-systems');
    expect(amendment).toContain('/pt-br/systems/agentic-systems');
    expect(amendment).toContain('are cancelled');
    expect(routeManifest.cancelledPlans.map((entry) => entry.path).sort()).toEqual([
      '/en/systems/agentic-systems',
      '/pt-br/systems/agentic-systems',
    ]);
    expect(admittedPaths.has('/en/systems/agentic-systems')).toBe(false);
    expect(admittedPaths.has('/pt-br/systems/agentic-systems')).toBe(false);
    expect(routeManifest.assignments.some((assignment) => assignment.targetRecordId === retiredId)).toBe(false);
  });

  it('does not admit routes for held Publication or Architecture reservations before those Records are born', () => {
    const heldIds = new Set(registryManifest.identityPool.heldReservations.map((entry) => entry.recordId));
    expect(heldIds.size).toBe(8);
    expect(routeManifest.assignments.some((assignment) => heldIds.has(assignment.targetRecordId))).toBe(false);
    expect(routeManifest.deferred.unbirthedRepresentationRoutesAdmitted).toBe(false);
  });

  it('materializes each binding against the exact frozen R1.1 generation-zero Birth', () => {
    const bindings = materializeRouteBindings(routeManifest, birthRecords);
    const byRecordId = new Map(birthRecords.map((record) => [record.recordId, record]));

    expect(bindings).toHaveLength(10);
    for (const binding of bindings) {
      const record = byRecordId.get(binding.targetRef.recordId);
      const birth = record?.revisions.find((entry) => entry.revision.generation === 0);
      expect(birth).toBeDefined();
      expect(binding.admittedAgainst).toEqual({
        type: 'pinned-record',
        recordId: binding.targetRef.recordId,
        revisionId: birth?.revision.revisionId,
      });
    }
  });

  it('reconstructs a ready route registry with unique paths and one canonical path per admitted Record/language pair', () => {
    const runtime = reconstructRouteRuntime(routeManifest, birthRecords);
    expect(runtime.state).toBe('ready');
    expect(runtime.errors).toEqual([]);
    expect(runtime.bindings).toHaveLength(10);
    expect(runtime.byPath.size).toBe(10);
    expect(routeManifest.acceptance.duplicatePathCount).toBe(0);
    expect(routeManifest.acceptance.invalidRouteCount).toBe(0);
  });

  it('resolves a bound path to the current logical Record head without treating admissionAgainst as a permanent revision pin', () => {
    const runtime = reconstructRouteRuntime(routeManifest, birthRecords);
    const initial = resolveRoutePath('/en/systems/vira', runtime, currentHeads);
    expect(initial.state).toBe('resolved');
    if (initial.state !== 'resolved') return;

    expect(initial.canonicalPath).toBe('/en/systems/vira');
    expect(initial.canonicalUrl).toBe('https://renan.snelabs.space/en/systems/vira');
    expect(initial.redirect).toBe(false);

    const hypotheticalHeads = currentHeads.map((head) =>
      head.recordId === initial.targetRef.recordId
        ? { ...head, revisionId: `rev_sha256_${'f'.repeat(64)}` as const }
        : head,
    );
    const advanced = resolveRoutePath('/en/systems/vira', runtime, hypotheticalHeads);
    expect(advanced.state).toBe('resolved');
    if (advanced.state === 'resolved') {
      expect(advanced.targetRef.recordId).toBe(initial.targetRef.recordId);
      expect(advanced.targetRef.revisionId).toBe(`rev_sha256_${'f'.repeat(64)}`);
    }
  });

  it('keeps unknown and legacy compatibility paths unresolved rather than falling back to home', () => {
    const runtime = reconstructRouteRuntime(routeManifest, birthRecords);
    expect(resolveRoutePath('/en/systems/not-a-record', runtime, currentHeads)).toEqual({
      state: 'unresolved',
      path: '/en/systems/not-a-record',
    });
    expect(resolveRoutePath('/work/vira', runtime, currentHeads)).toEqual({
      state: 'unresolved',
      path: '/work/vira',
    });
    expect(resolveRoutePath('/', runtime, currentHeads)).toEqual({ state: 'unresolved', path: '/' });
    expect(routeManifest.deferred.legacyCompatibilityEnacted).toBe(false);
  });

  it('does not perform language realization or implicit language fallback in the route cut', () => {
    expect(routeManifest.deferred.languageRealizationsAdmitted).toBe(false);
    expect(routeManifest.acceptance.languageFallbackAllowed).toBe(false);

    const runtime = reconstructRouteRuntime(routeManifest, birthRecords);
    const routeOnly = resolveRoutePath('/pt-br/systems/vira', runtime, currentHeads);
    expect(routeOnly.state).toBe('resolved');
    if (routeOnly.state === 'resolved') {
      expect(routeOnly.language).toBe('pt-BR');
    }
  });

  it('fails the route registry closed on duplicate path authority', () => {
    const corrupted = cloneManifest();
    corrupted.assignments[1].path = corrupted.assignments[0].path;
    const runtime = reconstructRouteRuntime(corrupted, birthRecords);

    expect(runtime.state).toBe('conflict');
    expect(runtime.errors.some((error) => error.includes('duplicate-path'))).toBe(true);
    const resolution = resolveRoutePath('/en/systems/vira', runtime, currentHeads);
    expect(resolution.state).toBe('registry-conflict');
  });

  it('forbids historical path reassignment during route-registry evolution', () => {
    const previous = reconstructRouteRuntime(routeManifest, birthRecords);
    const changed = cloneManifest();
    const viraEn = changed.assignments.find((entry) => entry.path === '/en/systems/vira');
    const xsEn = changed.assignments.find((entry) => entry.path === '/en/systems/xs-wallet');
    if (!viraEn || !xsEn) throw new Error('missing-route-fixture');
    const originalVira = viraEn.targetRecordId;
    viraEn.targetRecordId = xsEn.targetRecordId;
    xsEn.targetRecordId = originalVira;

    const next = reconstructRouteRuntime(changed, birthRecords);
    expect(next.state).toBe('ready');
    const errors = validateRouteRuntimeEvolution(previous, next);
    expect(errors).toContain('/en/systems/vira:historical-path-reassigned');
    expect(errors).toContain('/en/systems/xs-wallet:historical-path-reassigned');
  });

  it('does not change public projection, disclosure, framework or deployed runtime state', () => {
    expect(routeManifest.deferred.disclosureRecordsAdmitted).toBe(false);
    expect(routeManifest.acceptance.publicProjectionCountChanged).toBe(false);
    expect(routeManifest.acceptance.frameworkCutoverEnacted).toBe(false);
    expect(routeManifest.acceptance.publicUiChanged).toBe(false);
    expect(routeManifest.acceptance.runtimeSemanticsChanged).toBe(false);
    expect(routeManifest.acceptance.r1_3Complete).toBe(false);
  });
});
