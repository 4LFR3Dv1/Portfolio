import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

interface ConstitutionalPrinciple {
  id: string;
  title: string;
  rule: string;
  protects: string[];
}

interface ConstitutionManifest {
  schemaVersion: string;
  constitutionId: string;
  status: string;
  principles: ConstitutionalPrinciple[];
  priorityRule: string;
  amendmentRule: {
    required: boolean;
    mustRecord: string[];
    historyMustRemainReconstructable: boolean;
  };
  implementationNeutrality: {
    forbiddenConstitutionalDependencies: string[];
  };
  acceptance: {
    r0_0Preserved: boolean;
    runtimeSemanticsChanged: boolean;
    uiChanged: boolean;
    r0_1Complete: boolean;
  };
}

interface SurfaceFreezeManifest {
  acceptance: {
    r0_0Complete: boolean;
  };
}

function readRepoFile(path: string): string {
  return readFileSync(new URL(`../../../${path}`, import.meta.url), 'utf8');
}

const constitution = JSON.parse(
  readRepoFile('docs/editorial/constitution.v0.json'),
) as ConstitutionManifest;

const surfaceFreeze = JSON.parse(
  readRepoFile('docs/editorial/legacy/portfolio-surface.v0.json'),
) as SurfaceFreezeManifest;

describe('R0.1 editorial constitution', () => {
  it('is frozen only after preserving the completed R0.0 baseline', () => {
    expect(constitution.status).toBe('frozen');
    expect(surfaceFreeze.acceptance.r0_0Complete).toBe(true);
    expect(constitution.acceptance.r0_0Preserved).toBe(true);
    expect(constitution.acceptance.r0_1Complete).toBe(true);
    expect(constitution.acceptance.runtimeSemanticsChanged).toBe(false);
    expect(constitution.acceptance.uiChanged).toBe(false);
  });

  it('defines exactly fifteen contiguous constitutional principles', () => {
    const expectedIds = Array.from({ length: 15 }, (_, index) => `EC-${String(index + 1).padStart(2, '0')}`);
    const actualIds = constitution.principles.map((principle) => principle.id);

    expect(actualIds).toEqual(expectedIds);
    expect(new Set(actualIds).size).toBe(15);
    expect(new Set(constitution.principles.map((principle) => principle.title)).size).toBe(15);
  });

  it('keeps every principle normative and non-empty', () => {
    for (const principle of constitution.principles) {
      expect(principle.title.length).toBeGreaterThan(0);
      expect(principle.rule.length).toBeGreaterThan(20);
      expect(principle.protects.length).toBeGreaterThan(0);
      expect(principle.rule).toMatch(/\b(MUST|MAY)\b/);
    }
  });

  it('keeps the constitution independent from framework and deployment choices', () => {
    const normativeText = [
      ...constitution.principles.map((principle) => principle.rule),
      constitution.priorityRule,
    ].join('\n');

    for (const dependency of constitution.implementationNeutrality.forbiddenConstitutionalDependencies) {
      expect(normativeText).not.toContain(dependency);
    }
  });

  it('requires explicit amendments with reconstructable history', () => {
    expect(constitution.amendmentRule.required).toBe(true);
    expect(constitution.amendmentRule.historyMustRemainReconstructable).toBe(true);
    expect(constitution.amendmentRule.mustRecord).toEqual([
      'affected-principle-ids',
      'previous-normative-text',
      'replacement-normative-text',
      'reason-for-change',
      'migration-impact',
    ]);
  });

  it('keeps truth, evidence, identity, privacy and representation in constitutional scope', () => {
    const protections = new Set(constitution.principles.flatMap((principle) => principle.protects));

    for (const required of ['truth', 'evidence', 'system-identity', 'privacy', 'architecture', 'ontology']) {
      expect(protections.has(required)).toBe(true);
    }
  });
});
