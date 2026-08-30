import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  IDENTITY_SCHEMA_VERSION,
  isAllowedLifecycleTransition,
  isRecordId,
  isRecordKind,
  isValidPinnedRecordRef,
  isValidRecordRef,
  mayBindHistoricalLocator,
  mayReuseRecordId,
  serializeRevisionMaterial,
  validateBirth,
  validateSuccessor,
  type RecordId,
  type RecordRevision,
  type RecordRevisionMaterial,
  type RevisionId,
} from './editorial-record-identity';

interface ContractManifest {
  schemaVersion: string;
  status: string;
  normative: boolean;
  identifiers: {
    recordId: { pattern: string; reusable: boolean };
    recordKind: { pattern: string; constitutive: boolean; registryOwnedBy: string };
    payloadDigest: { pattern: string; algorithm: string };
    revisionId: { pattern: string; algorithm: string; canonicalMaterialVersion: string };
  };
  canonicalRevisionMaterial: {
    fields: string[];
    nullPreviousEncoding: string;
    generationEncoding: string;
  };
  lifecycle: {
    states: string[];
    terminal: string[];
    allowedTransitions: Record<string, string[]>;
  };
  laws: Array<{ id: string; title: string; rule: string }>;
  testVectors: Array<{
    name: string;
    material: RecordRevisionMaterial;
    expectedRevisionId: RevisionId;
  }>;
  ciWitness: {
    workflow: string;
    runId: number;
    commit: string;
    conclusion: string;
  };
  acceptance: {
    r0_1Preserved: boolean;
    r0_2PrePreserved: boolean;
    runtimeSemanticsChanged: boolean;
    uiChanged: boolean;
    r0_2Complete: boolean;
  };
}

interface GroundingManifest {
  status: string;
  normative: boolean;
  acceptance: { r0_2PreComplete: boolean };
}

interface ConstitutionManifest {
  status: string;
  acceptance: { r0_1Complete: boolean };
}

function readRepoFile(path: string): string {
  return readFileSync(new URL(`../../../${path}`, import.meta.url), 'utf8');
}

const contract = JSON.parse(
  readRepoFile('docs/editorial/record-identity.v0.json'),
) as ContractManifest;

const grounding = JSON.parse(
  readRepoFile('docs/editorial/identity-grounding.v0.json'),
) as GroundingManifest;

const constitution = JSON.parse(
  readRepoFile('docs/editorial/constitution.v0.json'),
) as ConstitutionManifest;

function computeRevisionId(material: RecordRevisionMaterial): RevisionId {
  const digest = createHash('sha256').update(serializeRevisionMaterial(material), 'utf8').digest('hex');
  return `rev_sha256_${digest}`;
}

function revisionFromVector(index: number): RecordRevision {
  const vector = contract.testVectors[index];
  return {
    ...vector.material,
    revisionId: vector.expectedRevisionId,
  };
}

describe('R0.2 Record Identity Contract', () => {
  it('starts only after frozen R0.1 and completed non-normative R0.2-PRE', () => {
    expect(constitution.status).toBe('frozen');
    expect(constitution.acceptance.r0_1Complete).toBe(true);
    expect(grounding.status).toBe('grounded');
    expect(grounding.normative).toBe(false);
    expect(grounding.acceptance.r0_2PreComplete).toBe(true);
    expect(contract.acceptance.r0_1Preserved).toBe(true);
    expect(contract.acceptance.r0_2PrePreserved).toBe(true);
  });

  it('freezes exactly twenty contiguous normative identity laws', () => {
    const expected = Array.from({ length: 20 }, (_, index) => `RI-${String(index + 1).padStart(2, '0')}`);
    expect(contract.laws.map((law) => law.id)).toEqual(expected);
    expect(new Set(contract.laws.map((law) => law.id)).size).toBe(20);
    expect(new Set(contract.laws.map((law) => law.title)).size).toBe(20);
    for (const law of contract.laws) {
      expect(law.rule.length).toBeGreaterThan(40);
      expect(law.rule).toMatch(/\b(MUST|MAY)\b/);
    }
  });

  it('uses opaque non-reusable RecordIds and constitutive namespaced kinds', () => {
    expect(isRecordId('rec_00000000000000000000000000000001')).toBe(true);
    expect(isRecordId('rec_1')).toBe(false);
    expect(isRecordKind('example.record')).toBe(true);
    expect(isRecordKind('System')).toBe(false);
    expect(contract.identifiers.recordId.reusable).toBe(false);
    expect(contract.identifiers.recordKind.constitutive).toBe(true);
    expect(contract.identifiers.recordKind.registryOwnedBy).toBe('R0.3');
  });

  it('serializes revision material exactly and reproduces both SHA-256 vectors', () => {
    expect(contract.identifiers.revisionId.algorithm).toBe('sha256');
    expect(contract.identifiers.revisionId.canonicalMaterialVersion).toBe('editorial-revision-material/v0');
    expect(contract.canonicalRevisionMaterial.fields).toEqual([
      'identitySchemaVersion',
      'recordId',
      'kind',
      'generation',
      'previousRevisionId',
      'lifecycle',
      'payloadDigest',
    ]);

    for (const vector of contract.testVectors) {
      expect(vector.material.identitySchemaVersion).toBe(IDENTITY_SCHEMA_VERSION);
      expect(computeRevisionId(vector.material)).toBe(vector.expectedRevisionId);
      expect(serializeRevisionMaterial(vector.material).endsWith('\n')).toBe(true);
      expect(serializeRevisionMaterial(vector.material)).not.toContain('\r');
    }
  });

  it('admits birth only at generation zero with no predecessor', () => {
    const birth = revisionFromVector(0);
    expect(validateBirth(birth)).toEqual([]);

    expect(validateBirth({ ...birth, generation: 1 })).toContain('birth-generation');
    expect(validateBirth({ ...birth, previousRevisionId: birth.revisionId })).toContain('birth-predecessor');
    expect(validateBirth({ ...birth, lifecycle: 'tombstoned' })).toContain('birth-tombstone');
  });

  it('admits successors only through exact identity, kind, generation and predecessor continuity', () => {
    const birth = revisionFromVector(0);
    const successor = revisionFromVector(1);
    expect(validateSuccessor(birth, successor)).toEqual([]);

    expect(validateSuccessor(birth, { ...successor, recordId: 'rec_00000000000000000000000000000002' })).toContain(
      'record-id-continuity',
    );
    expect(validateSuccessor(birth, { ...successor, kind: 'example.other' })).toContain(
      'record-kind-continuity',
    );
    expect(validateSuccessor(birth, { ...successor, generation: 3 })).toContain('generation-continuity');
    expect(validateSuccessor(birth, { ...successor, previousRevisionId: null })).toContain(
      'predecessor-continuity',
    );
  });

  it('keeps tombstone terminal while allowing non-terminal lifecycle revisions', () => {
    expect(isAllowedLifecycleTransition('active', 'archived')).toBe(true);
    expect(isAllowedLifecycleTransition('withdrawn', 'active')).toBe(true);
    expect(isAllowedLifecycleTransition('archived', 'tombstoned')).toBe(true);
    expect(isAllowedLifecycleTransition('tombstoned', 'active')).toBe(false);

    const current: RecordRevision = {
      ...revisionFromVector(1),
      lifecycle: 'tombstoned',
    };
    const next: RecordRevision = {
      ...revisionFromVector(1),
      generation: current.generation + 1,
      previousRevisionId: current.revisionId,
      revisionId: 'rev_sha256_aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      lifecycle: 'active',
    };
    expect(validateSuccessor(current, next)).toContain('successor-after-tombstone');
  });

  it('never reuses an admitted RecordId, including a tombstoned one', () => {
    const admitted = new Set<string>(['rec_00000000000000000000000000000001']);
    expect(mayReuseRecordId(admitted, 'rec_00000000000000000000000000000001')).toBe(false);
    expect(mayReuseRecordId(admitted, 'rec_00000000000000000000000000000002')).toBe(true);
  });

  it('forbids historical locator reassignment to another Record', () => {
    const first = 'rec_00000000000000000000000000000001' as RecordId;
    const second = 'rec_00000000000000000000000000000002' as RecordId;
    const binding = { locator: '/legacy/example', recordId: first, mode: 'alias' as const };

    expect(mayBindHistoricalLocator(undefined, first)).toBe(true);
    expect(mayBindHistoricalLocator(binding, first)).toBe(true);
    expect(mayBindHistoricalLocator(binding, second)).toBe(false);
  });

  it('keeps logical and pinned references mechanically distinct', () => {
    const birth = revisionFromVector(0);
    expect(isValidRecordRef({ type: 'record', recordId: birth.recordId })).toBe(true);
    expect(
      isValidPinnedRecordRef({
        type: 'pinned-record',
        recordId: birth.recordId,
        revisionId: birth.revisionId,
      }),
    ).toBe(true);
  });

  it('freezes only after the materialization CI witness succeeds', () => {
    expect(contract.status).toBe('frozen');
    expect(contract.ciWitness.workflow).toBe('Verify');
    expect(contract.ciWitness.runId).toBe(33330694121);
    expect(contract.ciWitness.commit).toBe('32932438363b5500211c18307dce2e0ee8ffb2b1');
    expect(contract.ciWitness.conclusion).toBe('success');
    expect(contract.acceptance.r0_2Complete).toBe(true);
  });

  it('keeps R0.2 identity work isolated from runtime and UI semantics', () => {
    expect(contract.normative).toBe(true);
    expect(contract.acceptance.runtimeSemanticsChanged).toBe(false);
    expect(contract.acceptance.uiChanged).toBe(false);
  });
});
