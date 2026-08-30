import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

interface IdentityLaw {
  id: string;
  title: string;
  rule: string;
}

interface GroundingManifest {
  schemaVersion: string;
  groundingId: string;
  status: string;
  normative: boolean;
  sourceBoundary: {
    sourceSystem: string;
    sourceVisibility: string;
    publicSourceLocatorsIncluded: boolean;
    privateImplementationDetailsPromoted: boolean;
    derivationOnly: boolean;
  };
  constitutionalBasis: string[];
  researchBoundaries: Array<{ id: string; topic: string; transfer: string }>;
  candidateLaws: IdentityLaw[];
  requiredR02Concepts: string[];
  ciWitness: {
    workflow: string;
    runId: number;
    commit: string;
    conclusion: string;
  };
  acceptance: {
    r0_1Preserved: boolean;
    privateBoundaryPreserved: boolean;
    runtimeSemanticsChanged: boolean;
    uiChanged: boolean;
    r0_2PreComplete: boolean;
    r0_2Complete: boolean;
  };
}

interface ConstitutionManifest {
  status: string;
  principles: Array<{ id: string }>;
  acceptance: {
    r0_1Complete: boolean;
  };
}

function readRepoFile(path: string): string {
  return readFileSync(new URL(`../../../${path}`, import.meta.url), 'utf8');
}

const grounding = JSON.parse(
  readRepoFile('docs/editorial/identity-grounding.v0.json'),
) as GroundingManifest;

const constitution = JSON.parse(
  readRepoFile('docs/editorial/constitution.v0.json'),
) as ConstitutionManifest;

describe('R0.2-PRE Brine identity grounding', () => {
  it('is complete as research while remaining non-normative', () => {
    expect(grounding.status).toBe('grounded');
    expect(grounding.normative).toBe(false);
    expect(grounding.acceptance.r0_2PreComplete).toBe(true);
    expect(grounding.acceptance.r0_2Complete).toBe(false);
  });

  it('preserves the frozen R0.1 constitution', () => {
    expect(constitution.status).toBe('frozen');
    expect(constitution.acceptance.r0_1Complete).toBe(true);
    expect(grounding.acceptance.r0_1Preserved).toBe(true);
  });

  it('keeps private Brine source details behind the public derivation boundary', () => {
    expect(grounding.sourceBoundary.sourceVisibility).toBe('private');
    expect(grounding.sourceBoundary.publicSourceLocatorsIncluded).toBe(false);
    expect(grounding.sourceBoundary.privateImplementationDetailsPromoted).toBe(false);
    expect(grounding.sourceBoundary.derivationOnly).toBe(true);
    expect(grounding.acceptance.privateBoundaryPreserved).toBe(true);
  });

  it('grounds all nine intended Brine identity boundaries', () => {
    expect(grounding.researchBoundaries.map((boundary) => boundary.id)).toEqual([
      'A2',
      'A3',
      'GENESIS-ID',
      'GVR0',
      'STORE',
      'WORK',
      'N1',
      'N2',
      'N3-N4',
    ]);
    for (const boundary of grounding.researchBoundaries) {
      expect(boundary.topic.length).toBeGreaterThan(0);
      expect(boundary.transfer.length).toBeGreaterThan(20);
    }
  });

  it('derives exactly fifteen contiguous candidate identity laws', () => {
    const expectedIds = Array.from(
      { length: 15 },
      (_, index) => `IG-${String(index + 1).padStart(2, '0')}`,
    );
    const actualIds = grounding.candidateLaws.map((law) => law.id);

    expect(actualIds).toEqual(expectedIds);
    expect(new Set(actualIds).size).toBe(15);
    expect(new Set(grounding.candidateLaws.map((law) => law.title)).size).toBe(15);
    for (const law of grounding.candidateLaws) {
      expect(law.rule.length).toBeGreaterThan(40);
    }
  });

  it('derives the complete identity vocabulary required before R0.3', () => {
    expect(grounding.requiredR02Concepts).toEqual([
      'RecordId',
      'RecordKind',
      'RecordLineage',
      'RecordGeneration',
      'RecordRevision',
      'RevisionId',
      'RecordRef',
      'PinnedRecordRef',
      'RecordLocator',
      'RecordAlias',
      'RecordTombstone',
      'RecordConflict',
      'RecordBirth',
    ]);
  });

  it('grounds itself in the identity/privacy constitutional subset only', () => {
    const constitutionalIds = new Set(constitution.principles.map((principle) => principle.id));
    expect(grounding.constitutionalBasis).toEqual(['EC-07', 'EC-11', 'EC-12', 'EC-13', 'EC-14']);
    for (const id of grounding.constitutionalBasis) {
      expect(constitutionalIds.has(id)).toBe(true);
    }
  });

  it('records the successful materialization witness without promoting R0.2', () => {
    expect(grounding.ciWitness.workflow).toBe('Verify');
    expect(grounding.ciWitness.runId).toBe(33330326597);
    expect(grounding.ciWitness.commit).toBe('d4e8d96a26daf058308613084fc12f653f271dfe');
    expect(grounding.ciWitness.conclusion).toBe('success');
  });

  it('changes neither runtime semantics nor the public UI', () => {
    expect(grounding.acceptance.runtimeSemanticsChanged).toBe(false);
    expect(grounding.acceptance.uiChanged).toBe(false);
  });
});
