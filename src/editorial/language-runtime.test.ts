import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import type { CurrentRecordHead } from '../app/data/editorial-route-language-identity';
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
  currentLanguageAvailability,
  materializeLanguageRealizations,
  reconstructLanguageRuntime,
  resolveLocalizedRouteIdentity,
  type LanguageRuntimeManifest,
  type ReconstructedLanguageRuntime,
} from './language-runtime';
import { projectPublicRecord, type ProjectionTargetHead } from './projection-engine';

interface R13Completion {
  acceptance: {
    r1_2Complete: true;
    r1_3Complete: true;
    routeRuntimeReconstructs: true;
    currentPublicProjectionCount: 0;
    nextRequiredCut: 'R1.4 — Language Runtime';
  };
}

interface MigrationLanguageEntry {
  targetRecordId: string;
  targetKind: string;
  languagePlan?: {
    canonical: string;
    translations: string[];
  };
}

interface MigrationManifest {
  projectMappings: MigrationLanguageEntry[];
  supportingSystemMappings: MigrationLanguageEntry[];
}

function readRepoFile(path: string): string {
  return readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
}

const registryManifest = JSON.parse(
  readRepoFile('docs/editorial/record-registry.v0.json'),
) as RecordRegistryManifest;
const routeManifest = JSON.parse(
  readRepoFile('docs/editorial/route-runtime.v0.json'),
) as RouteRuntimeManifest;
const languageManifest = JSON.parse(
  readRepoFile('docs/editorial/language-runtime.v0.json'),
) as LanguageRuntimeManifest;
const r13Completion = JSON.parse(
  readRepoFile('docs/editorial/R1.3-completion.v0.json'),
) as R13Completion;
const migration = JSON.parse(
  readRepoFile('docs/editorial/migration-acceptance.v0.json'),
) as MigrationManifest;

const records = materializeRegistryRecords(registryManifest);
const registry = reconstructRecordRegistry(registryManifest);
const routeRuntime = reconstructRouteRuntime(routeManifest, records);
const languageRuntime = reconstructLanguageRuntime(languageManifest, records);
const currentHeads: CurrentRecordHead[] = records.map((record) => ({
  recordId: record.recordId,
  revisionId: record.revisions[0].revision.revisionId,
}));

const vira = records.find((record) => record.subjectKey === 'vira');
if (!vira) throw new Error('missing-vira');
const viraRevision = vira.revisions[0].revision;

describe('R1.4 Language Runtime', () => {
  it('starts only after the Route Runtime is terminally sealed', () => {
    expect(r13Completion.acceptance).toMatchObject({
      r1_2Complete: true,
      r1_3Complete: true,
      routeRuntimeReconstructs: true,
      currentPublicProjectionCount: 0,
      nextRequiredCut: 'R1.4 — Language Runtime',
    });
    expect(registry.errors).toEqual([]);
    expect(routeRuntime.state).toBe('ready');
    expect(routeRuntime.errors).toEqual([]);
  });

  it('reconstructs 28 exact canonical EN realizations and only five explicitly admitted PT-BR translations', () => {
    expect(languageRuntime.state).toBe('ready');
    expect(languageRuntime.errors).toEqual([]);
    expect(languageRuntime.bindings).toHaveLength(33);
    expect(languageRuntime.bindings.filter((binding) => binding.role === 'canonical')).toHaveLength(28);
    expect(languageRuntime.bindings.filter((binding) => binding.role === 'translation')).toHaveLength(5);
    expect(languageManifest.admission.translationInferenceAllowed).toBe(false);
    expect(languageManifest.admission.implicitFallbackAllowed).toBe(false);
  });

  it('binds every canonical EN realization to the exact R1.1 payload digest and birth revision', () => {
    const realizations = materializeLanguageRealizations(languageManifest, records);
    const canonical = realizations.filter((realization) => realization.binding.role === 'canonical');

    for (const realization of canonical) {
      const record = records.find((candidate) => candidate.recordId === realization.binding.targetRef.recordId);
      expect(record).toBeDefined();
      if (!record) continue;
      const birth = record.revisions[0].revision;
      expect(realization.binding.language).toBe('en');
      expect(realization.binding.basisRef.revisionId).toBe(birth.revisionId);
      expect(realization.binding.realizationDigest).toBe(birth.payloadDigest);
      expect(realization.payload).toEqual(record.revisions[0].payload);
    }
  });

  it('admits PT-BR only where the effective R0.8 plan explicitly carried a PT-BR System translation and the target actually exists', () => {
    const bornIds = new Set(records.map((record) => record.recordId));
    const planned = [
      ...migration.projectMappings,
      ...migration.supportingSystemMappings,
    ]
      .filter((entry) => entry.targetKind === 'knowledge.system')
      .filter((entry) => entry.languagePlan?.translations.includes('pt-BR'))
      .map((entry) => entry.targetRecordId)
      .filter((recordId) => bornIds.has(recordId as never))
      .sort();

    const admitted = languageManifest.translationAssignments
      .map((assignment) => assignment.targetRecordId)
      .sort();

    expect(admitted).toEqual(planned);
    expect(admitted).toHaveLength(5);
  });

  it('proves that a PT-BR route does not imply PT-BR content', () => {
    const withoutViraPt: ReconstructedLanguageRuntime = {
      state: 'ready',
      errors: [],
      bindings: languageRuntime.bindings.filter((binding) => !(
        binding.targetRef.recordId === vira.recordId
        && binding.language === 'pt-BR'
      )),
      realizations: languageRuntime.realizations.filter((realization) => !(
        realization.binding.targetRef.recordId === vira.recordId
        && realization.binding.language === 'pt-BR'
      )),
    };

    const pt = resolveLocalizedRouteIdentity(
      '/pt-br/systems/vira',
      routeRuntime,
      withoutViraPt,
      currentHeads,
    );
    expect(pt.state).toBe('language-unavailable');
    if (pt.state === 'language-unavailable') {
      expect(pt.language).toBe('pt-BR');
      expect(pt.targetRef.recordId).toBe(vira.recordId);
    }

    const en = resolveLocalizedRouteIdentity(
      '/en/systems/vira',
      routeRuntime,
      withoutViraPt,
      currentHeads,
    );
    expect(en.state).toBe('resolved');
    if (en.state === 'resolved') expect(en.language).toBe('en');
  });

  it('does not inherit stale language realization after the Record advances to a new exact head', () => {
    const advancedHeads = currentHeads.map((head) => head.recordId === vira.recordId
      ? { ...head, revisionId: `rev_sha256_${'f'.repeat(64)}` as typeof head.revisionId }
      : head);

    expect(currentLanguageAvailability(vira.recordId, advancedHeads, 'en', languageRuntime)).toBe('unavailable');
    expect(currentLanguageAvailability(vira.recordId, advancedHeads, 'pt-BR', languageRuntime)).toBe('unavailable');

    const en = resolveLocalizedRouteIdentity(
      '/en/systems/vira',
      routeRuntime,
      languageRuntime,
      advancedHeads,
    );
    const pt = resolveLocalizedRouteIdentity(
      '/pt-br/systems/vira',
      routeRuntime,
      languageRuntime,
      advancedHeads,
    );
    expect(en.state).toBe('language-unavailable');
    expect(pt.state).toBe('language-unavailable');
  });

  it('resolves all ten currently admitted routed language pairs only because each exact realization is present', () => {
    const resolutions = routeManifest.assignments.map((assignment) =>
      resolveLocalizedRouteIdentity(assignment.path, routeRuntime, languageRuntime, currentHeads));
    expect(resolutions).toHaveLength(10);
    expect(resolutions.every((resolution) => resolution.state === 'resolved')).toBe(true);
  });

  it('keeps language authority separate from disclosure and public projection authority', () => {
    const route = resolveLocalizedRouteIdentity(
      '/en/systems/vira',
      routeRuntime,
      languageRuntime,
      currentHeads,
    );
    expect(route.state).toBe('resolved');

    const target: ProjectionTargetHead = {
      recordId: viraRevision.recordId,
      revisionId: viraRevision.revisionId,
      kind: viraRevision.kind,
      lifecycle: viraRevision.lifecycle,
    };
    const decision = projectPublicRecord({
      target,
      disclosure: { state: 'unclassified' },
      maturity: null,
      route,
    });
    expect(decision.state).toBe('omitted');
    if (decision.state === 'omitted') {
      expect(decision.reasons).toContain('disclosure-unclassified');
    }
  });

  it('fails build-time composition rather than repairing a conflicted route or language registry', () => {
    expect(() => resolveLocalizedRouteIdentity(
      '/en/systems/vira',
      { ...routeRuntime, state: 'conflict', errors: ['synthetic-route-conflict'] },
      languageRuntime,
      currentHeads,
    )).toThrow('route-runtime-conflict');

    expect(() => resolveLocalizedRouteIdentity(
      '/en/systems/vira',
      routeRuntime,
      { ...languageRuntime, state: 'conflict', errors: ['synthetic-language-conflict'] },
      currentHeads,
    )).toThrow('language-runtime-conflict');
  });
});
