import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import type {
  PinnedRecordRef,
  RecordId,
  RecordLifecycle,
  RevisionId,
} from './editorial-record-identity';
import {
  EVIDENCE_CLASSES,
  EVIDENCE_FACETS,
  EVIDENCE_KINDS,
  EVIDENCE_RELATIONS,
  deriveEvidentialDisposition,
  serializeEvidencePayload,
  validateArtifactCoreContinuity,
  validateBindingCoreContinuity,
  validateBindingResolution,
  validateEvidenceArtifact,
  validateEvidenceBinding,
  type EvidenceArtifactPayload,
  type EvidenceBindingPayload,
  type EvidenceEvaluationEntry,
  type EvidenceKind,
  type EvidencePayload,
  type EvidenceRevisionIndexEntry,
} from './editorial-evidence-contract';

interface EvidenceContractManifest {
  status: string;
  normative: boolean;
  preconditions: { r0_3Complete: boolean };
  kindRegistry: Array<{ kind: EvidenceKind; schemaVersion: string }>;
  evidenceClasses: string[];
  facets: string[];
  binding: {
    relations: string[];
    referenceMode: string;
    targetKinds: string[];
    facetMustExistOnArtifactRevision: boolean;
    constitutiveFields: string[];
  };
  currentEvaluation: {
    countedLifecycles: string[];
    excludedLifecycles: string[];
    dispositions: string[];
    automaticTruthRank: boolean;
  };
  laws: Array<{ id: string; title: string; rule: string }>;
  testVectors: Array<{
    kind: EvidenceKind;
    payload: EvidencePayload;
    expectedPayloadDigest: string;
  }>;
  acceptance: {
    r0_3Preserved: boolean;
    runtimeSemanticsChanged: boolean;
    uiChanged: boolean;
    r0_4Complete: boolean;
  };
}

interface KnowledgeManifest {
  status: string;
  acceptance: { r0_3Complete: boolean };
}

function readRepoFile(path: string): string {
  return readFileSync(new URL(`../../../${path}`, import.meta.url), 'utf8');
}

const contract = JSON.parse(
  readRepoFile('docs/editorial/evidence-contract.v0.json'),
) as EvidenceContractManifest;

const knowledge = JSON.parse(
  readRepoFile('docs/editorial/knowledge-ontology.v0.json'),
) as KnowledgeManifest;

function recordId(hex: string): RecordId {
  return `rec_${hex.padStart(32, '0')}` as RecordId;
}

function revisionId(char: string): RevisionId {
  return `rev_sha256_${char.repeat(64)}` as RevisionId;
}

function pinned(idHex: string, revChar: string): PinnedRecordRef {
  return {
    type: 'pinned-record',
    recordId: recordId(idHex),
    revisionId: revisionId(revChar),
  };
}

function payloadDigest(kind: EvidenceKind, payload: EvidencePayload): string {
  const bytes = serializeEvidencePayload(kind, payload);
  return `sha256_${createHash('sha256').update(bytes, 'utf8').digest('hex')}`;
}

const artifact: EvidenceArtifactPayload = {
  schemaVersion: 'evidence.artifact/v0',
  evidenceClass: 'test',
  title: 'Authority boundary verification',
  provenance: {
    origin: 'portfolio-test-fixture',
    locator: 'urn:portfolio:test:authority-boundary',
    observedAt: '2026-08-30T19:36:24Z',
    digest: 'sha256_1111111111111111111111111111111111111111111111111111111111111111',
  },
  facets: ['test-result'],
};

const binding: EvidenceBindingPayload = {
  schemaVersion: 'evidence.binding/v0',
  relation: 'supports',
  facet: 'test-result',
  evidenceRef: pinned('6', 'a'),
  targetRef: pinned('5', 'b'),
  scope: 'Exact Claim revision under authority-boundary verification.',
  rationale: 'The captured test result exercises the stated authority boundary.',
};

function indexEntry(
  ref: PinnedRecordRef,
  kind: string,
  lifecycle: RecordLifecycle = 'active',
  artifactPayload?: EvidenceArtifactPayload,
): EvidenceRevisionIndexEntry {
  return {
    recordId: ref.recordId,
    revisionId: ref.revisionId,
    kind,
    lifecycle,
    artifactPayload,
  };
}

function evaluationEntry(
  payload: EvidenceBindingPayload,
  bindingLifecycle: RecordLifecycle = 'active',
  evidenceCurrentLifecycle: RecordLifecycle = 'active',
): EvidenceEvaluationEntry {
  return { payload, bindingLifecycle, evidenceCurrentLifecycle };
}

describe('R0.4 Evidence Contract', () => {
  it('starts only after frozen R0.3', () => {
    expect(knowledge.status).toBe('frozen');
    expect(knowledge.acceptance.r0_3Complete).toBe(true);
    expect(contract.preconditions.r0_3Complete).toBe(true);
    expect(contract.acceptance.r0_3Preserved).toBe(true);
  });

  it('registers exactly artifact and binding as evidence kinds', () => {
    expect(contract.kindRegistry.map((entry) => entry.kind)).toEqual(EVIDENCE_KINDS);
    expect(contract.kindRegistry.map((entry) => entry.schemaVersion)).toEqual([
      'evidence.artifact/v0',
      'evidence.binding/v0',
    ]);
    expect(contract.evidenceClasses).toEqual(EVIDENCE_CLASSES);
    expect(contract.facets).toEqual(EVIDENCE_FACETS);
    expect(contract.binding.relations).toEqual(EVIDENCE_RELATIONS);
  });

  it('accepts the canonical Artifact and Binding payloads', () => {
    expect(validateEvidenceArtifact(artifact)).toEqual([]);
    expect(validateEvidenceBinding(binding)).toEqual([]);
  });

  it('fails closed when class and facet are incompatible', () => {
    expect(validateEvidenceArtifact({
      ...artifact,
      evidenceClass: 'source',
      facets: ['test-result'],
    })).toContain('class-facet');
  });

  it('requires a provenance anchor', () => {
    const candidate: EvidenceArtifactPayload = {
      ...artifact,
      evidenceClass: 'source',
      facets: ['source-existence'],
      provenance: {
        ...artifact.provenance,
        locator: null,
        digest: null,
        observedAt: null,
      },
    };
    expect(validateEvidenceArtifact(candidate)).toContain('provenance-anchor');
  });

  it('requires digests for content/state facets', () => {
    const candidate: EvidenceArtifactPayload = {
      ...artifact,
      provenance: { ...artifact.provenance, digest: null },
    };
    expect(validateEvidenceArtifact(candidate)).toContain('facet-requires-digest');
  });

  it('requires observedAt for occurrence facets', () => {
    const candidate: EvidenceArtifactPayload = {
      ...artifact,
      provenance: { ...artifact.provenance, observedAt: null },
    };
    expect(validateEvidenceArtifact(candidate)).toContain('facet-requires-observed-at');
  });

  it('keeps evidence class and provenance immutable across one Artifact lineage', () => {
    expect(validateArtifactCoreContinuity(artifact, {
      ...artifact,
      title: 'Reworded evidence title',
      facets: ['artifact-integrity'],
    })).toEqual([]);

    expect(validateArtifactCoreContinuity(artifact, {
      ...artifact,
      evidenceClass: 'commit',
    })).toContain('evidence-class-continuity');

    expect(validateArtifactCoreContinuity(artifact, {
      ...artifact,
      provenance: { ...artifact.provenance, locator: 'urn:other' },
    })).toContain('provenance-continuity');
  });

  it('requires exact pinned references in Evidence Bindings', () => {
    const logicalRef = { type: 'record', recordId: recordId('6') };
    expect(validateEvidenceBinding({
      ...binding,
      evidenceRef: logicalRef as unknown as PinnedRecordRef,
    })).toContain('evidence-ref');
  });

  it('resolves bindings only to exact Artifact and Claim/Experiment revisions', () => {
    const index: EvidenceRevisionIndexEntry[] = [
      indexEntry(binding.evidenceRef, 'evidence.artifact', 'active', artifact),
      indexEntry(binding.targetRef, 'knowledge.claim'),
    ];
    expect(validateBindingResolution(binding, index)).toEqual([]);

    expect(validateBindingResolution(binding, [index[0]])).toContain('target-ref-unresolved');

    expect(validateBindingResolution(binding, [
      index[0],
      indexEntry(binding.targetRef, 'knowledge.system'),
    ])).toContain('target-ref-kind');

    const mismatchBinding: EvidenceBindingPayload = { ...binding, facet: 'artifact-integrity' };
    expect(validateBindingResolution(mismatchBinding, index)).toContain('binding-facet-not-admitted');
  });

  it('keeps relation, exact refs and facet constitutive for one Binding lineage', () => {
    expect(validateBindingCoreContinuity(binding, {
      ...binding,
      scope: 'Revised scope explanation.',
      rationale: 'Revised rationale without rebinding.',
    })).toEqual([]);

    expect(validateBindingCoreContinuity(binding, {
      ...binding,
      relation: 'contradicts',
    })).toContain('relation-continuity');

    expect(validateBindingCoreContinuity(binding, {
      ...binding,
      targetRef: pinned('5', 'c'),
    })).toContain('target-ref-continuity');
  });

  it('derives evidential disposition without assigning truth rank', () => {
    const target = binding.targetRef;
    const support = binding;
    const contradiction: EvidenceBindingPayload = { ...binding, relation: 'contradicts' };
    const qualification: EvidenceBindingPayload = { ...binding, relation: 'qualifies' };

    expect(deriveEvidentialDisposition(target, [])).toBe('unassessed');
    expect(deriveEvidentialDisposition(target, [evaluationEntry(support)])).toBe('support-present');
    expect(deriveEvidentialDisposition(target, [evaluationEntry(contradiction)])).toBe('contradiction-present');
    expect(deriveEvidentialDisposition(target, [evaluationEntry(qualification)])).toBe('qualification-only');
    expect(deriveEvidentialDisposition(target, [
      evaluationEntry(support),
      evaluationEntry(contradiction),
    ])).toBe('mixed');
    expect(contract.currentEvaluation.automaticTruthRank).toBe(false);
  });

  it('excludes withdrawn or tombstoned current Evidence and Bindings from disposition', () => {
    const target = binding.targetRef;
    expect(deriveEvidentialDisposition(target, [evaluationEntry(binding, 'withdrawn', 'active')])).toBe('unassessed');
    expect(deriveEvidentialDisposition(target, [evaluationEntry(binding, 'active', 'tombstoned')])).toBe('unassessed');
    expect(contract.currentEvaluation.countedLifecycles).toEqual(['active', 'archived']);
    expect(contract.currentEvaluation.excludedLifecycles).toEqual(['withdrawn', 'tombstoned']);
  });

  it('reproduces the frozen SHA-256 payload vectors', () => {
    expect(contract.testVectors).toHaveLength(2);
    for (const vector of contract.testVectors) {
      expect(payloadDigest(vector.kind, vector.payload)).toBe(vector.expectedPayloadDigest);
    }
  });

  it('freezes exactly twenty contiguous normative Evidence laws', () => {
    const expected = Array.from({ length: 20 }, (_, index) => `EV-${String(index + 1).padStart(2, '0')}`);
    expect(contract.laws.map((law) => law.id)).toEqual(expected);
    expect(new Set(contract.laws.map((law) => law.title)).size).toBe(20);
    for (const law of contract.laws) {
      expect(law.rule.length).toBeGreaterThan(50);
      expect(law.rule).toMatch(/\b(MUST|MAY)\b/);
    }
  });

  it('keeps the materialization isolated from UI/runtime semantics until CI witness closes R0.4', () => {
    expect(contract.status).toBe('draft');
    expect(contract.normative).toBe(true);
    expect(contract.binding.referenceMode).toBe('pinned-record');
    expect(contract.binding.targetKinds).toEqual(['knowledge.claim', 'knowledge.experiment']);
    expect(contract.binding.facetMustExistOnArtifactRevision).toBe(true);
    expect(contract.binding.constitutiveFields).toEqual(['relation', 'evidenceRef', 'targetRef', 'facet']);
    expect(contract.acceptance.runtimeSemanticsChanged).toBe(false);
    expect(contract.acceptance.uiChanged).toBe(false);
    expect(contract.acceptance.r0_4Complete).toBe(false);
  });
});
