import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  GOVERNABLE_KINDS,
  MATURITY_STAGES,
  deriveGovernanceProjection,
  mayProjectPublicly,
  serializeGovernancePayload,
  validateDisclosureContinuity,
  validateDisclosurePayload,
  validateGovernanceResolution,
  validateMaturityContinuity,
  validateMaturityPayload,
  type CurrentGovernanceEntry,
  type DisclosurePayload,
  type GovernanceKind,
  type GovernancePayload,
  type GovernanceRevisionIndexEntry,
  type MaturityPayload,
} from './editorial-visibility-maturity-disclosure';
import type {
  PinnedRecordRef,
  RecordId,
  RevisionId,
} from './editorial-record-identity';

interface ContractManifest {
  status: string;
  normative: boolean;
  preconditions: { r0_5Complete: boolean };
  kindRegistry: Array<{ kind: string; schemaVersion: string }>;
  visibility: {
    record: string[];
    source: string[];
    evidence: string[];
    disclosure: string[];
  };
  maturity: {
    stages: string[];
    targetKinds: string[];
    monotonic: boolean;
  };
  projection: {
    countedGovernanceLifecycles: string[];
    failClosedOnMissingCurrentClassification: boolean;
    failClosedOnMultipleCurrentAuthorities: boolean;
    targetRevisionMustMatchBasis: boolean;
  };
  laws: Array<{ id: string; title: string; rule: string }>;
  testVectors: Array<{
    kind: GovernanceKind;
    payload: GovernancePayload;
    expectedPayloadDigest: string;
  }>;
  ciWitness: null | {
    workflow: string;
    runId: number;
    commit: string;
    conclusion: string;
  };
  acceptance: {
    r0_5Preserved: boolean;
    runtimeSemanticsChanged: boolean;
    uiChanged: boolean;
    r0_6Complete: boolean;
  };
}

interface PriorManifest {
  status: string;
  acceptance: { r0_5Complete: boolean };
}

function readRepoFile(path: string): string {
  return readFileSync(new URL(`../../../${path}`, import.meta.url), 'utf8');
}

const contract = JSON.parse(
  readRepoFile('docs/editorial/visibility-maturity-disclosure.v0.json'),
) as ContractManifest;

const prior = JSON.parse(
  readRepoFile('docs/editorial/publication-architecture.v0.json'),
) as PriorManifest;

function recordId(suffix: string): RecordId {
  return `rec_${suffix.padStart(32, '0')}` as RecordId;
}

function revisionId(char: string): RevisionId {
  return `rev_sha256_${char.repeat(64)}` as RevisionId;
}

function logical(suffix: string) {
  return { type: 'record' as const, recordId: recordId(suffix) };
}

function pinned(suffix: string, char: string): PinnedRecordRef {
  return {
    type: 'pinned-record',
    recordId: recordId(suffix),
    revisionId: revisionId(char),
  };
}

const disclosure: DisclosurePayload = {
  schemaVersion: 'governance.disclosure/v0',
  targetRef: logical('1'),
  basisRef: pinned('1', 'a'),
  visibility: {
    record: 'public',
    source: 'private',
    evidence: 'partial',
  },
  disclosure: 'sanitized',
  rationale: 'Public-safe representation with private source and partially public evidence.',
};

const maturity: MaturityPayload = {
  schemaVersion: 'governance.maturity/v0',
  targetRef: logical('1'),
  basisRef: pinned('1', 'a'),
  stage: 'research',
  rationale: 'The system is under active investigation and is not represented as production.',
};

function payloadDigest(kind: GovernanceKind, payload: GovernancePayload): string {
  const bytes = serializeGovernancePayload(kind, payload);
  return `sha256_${createHash('sha256').update(bytes, 'utf8').digest('hex')}`;
}

function indexEntry(
  ref: PinnedRecordRef,
  kind: string,
  lifecycle: 'active' | 'archived' | 'withdrawn' | 'tombstoned' = 'active',
): GovernanceRevisionIndexEntry {
  return {
    recordId: ref.recordId,
    revisionId: ref.revisionId,
    kind,
    lifecycle,
  };
}

function disclosureEntry(
  governanceSuffix: string,
  payload: DisclosurePayload = disclosure,
  lifecycle: 'active' | 'archived' | 'withdrawn' | 'tombstoned' = 'active',
): CurrentGovernanceEntry<DisclosurePayload> {
  return {
    governanceRecordId: recordId(governanceSuffix),
    lifecycle,
    payload,
  };
}

describe('R0.6 Visibility / Maturity / Disclosure', () => {
  it('starts only after frozen R0.5', () => {
    expect(prior.status).toBe('frozen');
    expect(prior.acceptance.r0_5Complete).toBe(true);
    expect(contract.preconditions.r0_5Complete).toBe(true);
    expect(contract.acceptance.r0_5Preserved).toBe(true);
  });

  it('adds exactly two governance kinds without modifying prior kind registries', () => {
    expect(contract.kindRegistry).toEqual([
      { kind: 'governance.disclosure', schemaVersion: 'governance.disclosure/v0' },
      { kind: 'governance.maturity', schemaVersion: 'governance.maturity/v0' },
    ]);
    expect(GOVERNABLE_KINDS).toEqual([
      'knowledge.system',
      'knowledge.question',
      'knowledge.investigation',
      'knowledge.experiment',
      'knowledge.claim',
      'evidence.artifact',
      'evidence.binding',
      'representation.publication',
      'representation.architecture',
    ]);
  });

  it('validates independent record, source and evidence visibility axes', () => {
    expect(validateDisclosurePayload(disclosure)).toEqual([]);
    expect(contract.visibility.record).toEqual(['public', 'private']);
    expect(contract.visibility.source).toEqual(['public', 'partial', 'private', 'not-applicable', 'unknown']);
    expect(contract.visibility.evidence).toEqual(['public', 'partial', 'private', 'none', 'unknown']);

    expect(validateDisclosurePayload({
      ...disclosure,
      visibility: { ...disclosure.visibility, source: 'unknown' },
    })).toEqual([]);

    expect(validateDisclosurePayload({
      ...disclosure,
      visibility: { ...disclosure.visibility, evidence: 'unknown' },
    })).toEqual([]);
  });

  it('separates public visibility from disclosure form', () => {
    expect(validateDisclosurePayload({
      ...disclosure,
      visibility: { ...disclosure.visibility, record: 'private' },
      disclosure: 'full',
    })).toContain('private-requires-withheld');

    expect(validateDisclosurePayload({
      ...disclosure,
      disclosure: 'withheld',
    })).toContain('public-cannot-be-withheld');

    expect(validateDisclosurePayload({
      ...disclosure,
      visibility: { ...disclosure.visibility, record: 'private' },
      disclosure: 'withheld',
    })).toEqual([]);
  });

  it('requires logical target and pinned basis to identify the same Record', () => {
    expect(validateDisclosurePayload({
      ...disclosure,
      basisRef: pinned('2', 'a'),
    })).toContain('basis-target-mismatch');

    expect(validateMaturityPayload({
      ...maturity,
      basisRef: pinned('2', 'a'),
    })).toContain('basis-target-mismatch');
  });

  it('allows governance revision while preserving target logical identity', () => {
    expect(validateDisclosureContinuity(disclosure, {
      ...disclosure,
      basisRef: pinned('1', 'b'),
      disclosure: 'full',
      visibility: { record: 'public', source: 'public', evidence: 'public' },
    })).toEqual([]);

    expect(validateDisclosureContinuity(disclosure, {
      ...disclosure,
      targetRef: logical('2'),
      basisRef: pinned('2', 'b'),
    })).toContain('target-ref-continuity');

    expect(validateMaturityContinuity(maturity, {
      ...maturity,
      basisRef: pinned('1', 'b'),
      stage: 'prototype',
    })).toEqual([]);

    expect(validateMaturityContinuity(maturity, {
      ...maturity,
      targetRef: logical('2'),
      basisRef: pinned('2', 'b'),
    })).toContain('target-ref-continuity');
  });

  it('permits disclosure governance only over pre-R0.6 subject kinds', () => {
    expect(validateGovernanceResolution(
      'governance.disclosure',
      disclosure,
      [indexEntry(disclosure.basisRef, 'knowledge.claim')],
    )).toEqual([]);

    expect(validateGovernanceResolution(
      'governance.disclosure',
      disclosure,
      [indexEntry(disclosure.basisRef, 'governance.disclosure')],
    )).toContain('target-kind:governance.disclosure');
  });

  it('restricts maturity governance to knowledge.system', () => {
    expect(validateMaturityPayload(maturity)).toEqual([]);
    expect(MATURITY_STAGES).toEqual([
      'concept',
      'research',
      'prototype',
      'pre-beta',
      'beta',
      'production',
      'completed',
    ]);

    expect(validateGovernanceResolution(
      'governance.maturity',
      maturity,
      [indexEntry(maturity.basisRef, 'knowledge.system')],
    )).toEqual([]);

    expect(validateGovernanceResolution(
      'governance.maturity',
      maturity,
      [indexEntry(maturity.basisRef, 'knowledge.experiment')],
    )).toContain('maturity-target-kind:knowledge.experiment');

    expect(contract.maturity.monotonic).toBe(false);
  });

  it('fails closed when the current target head has no matching disclosure decision', () => {
    const nextHead = pinned('1', 'b');
    const projection = deriveGovernanceProjection(nextHead, [disclosureEntry('20')]);
    expect(projection).toEqual({ state: 'unclassified' });
    expect(contract.projection.failClosedOnMissingCurrentClassification).toBe(true);
    expect(contract.projection.targetRevisionMustMatchBasis).toBe(true);
  });

  it('fails closed on multiple current disclosure authorities for one exact target head', () => {
    const projection = deriveGovernanceProjection(disclosure.basisRef, [
      disclosureEntry('20'),
      disclosureEntry('21', {
        ...disclosure,
        disclosure: 'metadata-only',
      }),
    ]);
    expect(projection).toEqual({ state: 'conflict' });
    expect(contract.projection.failClosedOnMultipleCurrentAuthorities).toBe(true);
  });

  it('ignores withdrawn or tombstoned governance Records in current classification', () => {
    expect(deriveGovernanceProjection(disclosure.basisRef, [
      disclosureEntry('20', disclosure, 'withdrawn'),
    ])).toEqual({ state: 'unclassified' });

    expect(deriveGovernanceProjection(disclosure.basisRef, [
      disclosureEntry('20', disclosure, 'tombstoned'),
    ])).toEqual({ state: 'unclassified' });

    expect(deriveGovernanceProjection(disclosure.basisRef, [
      disclosureEntry('20', disclosure, 'archived'),
    ]).state).toBe('classified');
  });

  it('projects publicly only with one current public disclosure and a non-withdrawn target', () => {
    const classified = deriveGovernanceProjection(disclosure.basisRef, [disclosureEntry('20')]);
    expect(mayProjectPublicly('active', classified)).toBe(true);
    expect(mayProjectPublicly('archived', classified)).toBe(true);
    expect(mayProjectPublicly('withdrawn', classified)).toBe(false);
    expect(mayProjectPublicly('tombstoned', classified)).toBe(false);

    const privatePayload: DisclosurePayload = {
      ...disclosure,
      visibility: { ...disclosure.visibility, record: 'private' },
      disclosure: 'withheld',
    };
    const privateProjection = deriveGovernanceProjection(
      privatePayload.basisRef,
      [disclosureEntry('20', privatePayload)],
    );
    expect(mayProjectPublicly('active', privateProjection)).toBe(false);
  });

  it('reproduces both frozen canonical payload vectors', () => {
    expect(contract.testVectors).toHaveLength(2);
    for (const vector of contract.testVectors) {
      expect(payloadDigest(vector.kind, vector.payload)).toBe(vector.expectedPayloadDigest);
    }
  });

  it('freezes exactly twenty contiguous VMD laws', () => {
    const expected = Array.from({ length: 20 }, (_, index) => `VMD-${String(index + 1).padStart(2, '0')}`);
    expect(contract.laws.map((law) => law.id)).toEqual(expected);
    expect(new Set(contract.laws.map((law) => law.title)).size).toBe(20);
    for (const law of contract.laws) {
      expect(law.rule.length).toBeGreaterThan(50);
      expect(law.rule).toMatch(/\b(MUST|MAY)\b/);
    }
  });

  it('keeps R0.6 isolated from route, language, migration and UI semantics', () => {
    expect(contract.normative).toBe(true);
    expect(contract.acceptance.runtimeSemanticsChanged).toBe(false);
    expect(contract.acceptance.uiChanged).toBe(false);
    expect(contract.status).toBe('draft');
    expect(contract.ciWitness).toBeNull();
    expect(contract.acceptance.r0_6Complete).toBe(false);
  });
});
