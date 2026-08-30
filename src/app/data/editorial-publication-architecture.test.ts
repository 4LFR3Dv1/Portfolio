import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  REPRESENTATION_KINDS,
  serializeRepresentationPayload,
  validateRepresentationPayload,
  validateRepresentationResolution,
  type ArchitecturePayload,
  type PublicationPayload,
  type RepresentationKind,
  type RepresentationPayload,
  type RepresentationRevisionIndexEntry,
} from './editorial-publication-architecture';

interface ContractManifest {
  status: string;
  normative: boolean;
  kindRegistry: Array<{ kind: RepresentationKind; schemaVersion: string }>;
  laws: Array<{ id: string; title: string; rule: string }>;
  testVectors: Array<{ kind: RepresentationKind; payload: RepresentationPayload; expectedPayloadDigest: string }>;
  ciWitness: { workflow: string; runId: number; commit: string; conclusion: string };
  acceptance: { r0_4Preserved: boolean; runtimeSemanticsChanged: boolean; uiChanged: boolean; r0_5Complete: boolean };
}
interface EvidenceManifest { status: string; acceptance: { r0_4Complete: boolean } }

function readRepoFile(path: string): string {
  return readFileSync(new URL(`../../../${path}`, import.meta.url), 'utf8');
}

const contract = JSON.parse(readRepoFile('docs/editorial/publication-architecture.v0.json')) as ContractManifest;
const evidence = JSON.parse(readRepoFile('docs/editorial/evidence-contract.v0.json')) as EvidenceManifest;
const publication = contract.testVectors.find((vector) => vector.kind === 'representation.publication')?.payload as PublicationPayload;
const architecture = contract.testVectors.find((vector) => vector.kind === 'representation.architecture')?.payload as ArchitecturePayload;

const index: RepresentationRevisionIndexEntry[] = [
  { recordId: 'rec_00000000000000000000000000000001', revisionId: 'rev_sha256_aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', kind: 'knowledge.system' },
  { recordId: 'rec_00000000000000000000000000000002', revisionId: 'rev_sha256_bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb', kind: 'knowledge.claim' },
  { recordId: 'rec_00000000000000000000000000000004', revisionId: 'rev_sha256_cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc', kind: 'evidence.binding' },
];

function digest(kind: RepresentationKind, payload: RepresentationPayload): string {
  return `sha256_${createHash('sha256').update(serializeRepresentationPayload(kind, payload), 'utf8').digest('hex')}`;
}

describe('R0.5 Publication & Architecture Contract', () => {
  it('starts from frozen R0.4 and freezes exactly two representation kinds', () => {
    expect(evidence.status).toBe('frozen');
    expect(evidence.acceptance.r0_4Complete).toBe(true);
    expect(contract.kindRegistry.map((entry) => entry.kind)).toEqual(REPRESENTATION_KINDS);
    expect(contract.acceptance.r0_4Preserved).toBe(true);
  });

  it('freezes exactly twenty contiguous PA laws', () => {
    const expected = Array.from({ length: 20 }, (_, index) => `PA-${String(index + 1).padStart(2, '0')}`);
    expect(contract.laws.map((law) => law.id)).toEqual(expected);
    expect(new Set(contract.laws.map((law) => law.title)).size).toBe(20);
    for (const law of contract.laws) expect(law.rule).toMatch(/\b(MUST|MAY)\b/);
  });

  it('requires logical Publication subjects and pinned historical basis for subjects and Claims', () => {
    expect(validateRepresentationPayload('representation.publication', publication)).toEqual([]);
    expect(validateRepresentationPayload('representation.publication', {
      ...publication,
      basisRefs: publication.basisRefs.filter((ref) => ref.recordId !== publication.subjectRefs[0].recordId),
    })).toContain('subject-basis-missing');
    expect(validateRepresentationPayload('representation.publication', {
      ...publication,
      basisRefs: publication.basisRefs.filter((ref) => ref.recordId !== publication.claimRefs[0].recordId),
    })).toContain('claim-basis-missing');
  });

  it('keeps Architecture components local and relation endpoints closed over the local component set', () => {
    expect(validateRepresentationPayload('representation.architecture', architecture)).toEqual([]);
    expect(validateRepresentationPayload('representation.architecture', {
      ...architecture,
      relations: [{ from: 'proposal', to: 'missing', label: 'invalid edge' }],
    })).toContain('relation-to');
    expect(validateRepresentationPayload('representation.architecture', {
      ...architecture,
      components: [architecture.components[0], { ...architecture.components[0] }],
      relations: [],
    })).toContain('duplicate-component-id');
  });

  it('enforces target-kind boundaries and exact pinned basis resolution', () => {
    expect(validateRepresentationResolution('representation.publication', publication, index)).toEqual([]);
    expect(validateRepresentationResolution('representation.architecture', architecture, index)).toEqual([]);
    const wrong = index.map((entry) => entry.recordId === 'rec_00000000000000000000000000000001' ? { ...entry, kind: 'evidence.artifact' } : entry);
    expect(validateRepresentationResolution('representation.architecture', architecture, wrong).some((error) => error.includes('target-kind'))).toBe(true);
  });

  it('does not let Publication metadata manufacture evidence or later exposure semantics', () => {
    const fields = Object.keys(publication);
    for (const forbidden of ['supports', 'established', 'evidenceDisposition', 'visibility', 'maturity', 'slug', 'route', 'language', 'publishedAt']) {
      expect(fields).not.toContain(forbidden);
    }
    expect(contract.laws.find((law) => law.id === 'PA-10')?.rule).toContain('MUST NOT create a supports');
    expect(contract.laws.find((law) => law.id === 'PA-20')?.rule).toContain('MUST NOT define visibility');
  });

  it('reproduces both canonical SHA-256 payload vectors', () => {
    expect(contract.testVectors).toHaveLength(2);
    for (const vector of contract.testVectors) {
      expect(digest(vector.kind, vector.payload)).toBe(vector.expectedPayloadDigest);
      expect(serializeRepresentationPayload(vector.kind, vector.payload).endsWith('\n')).toBe(true);
    }
  });

  it('closes only with the successful materialization witness and no UI/runtime change', () => {
    expect(contract.status).toBe('frozen');
    expect(contract.normative).toBe(true);
    expect(contract.ciWitness).toEqual({
      workflow: 'Verify',
      runId: 33334053429,
      commit: 'dad19fd77eff3eb42149aa3e103d1081fac334d1',
      conclusion: 'success',
    });
    expect(contract.acceptance.runtimeSemanticsChanged).toBe(false);
    expect(contract.acceptance.uiChanged).toBe(false);
    expect(contract.acceptance.r0_5Complete).toBe(true);
  });
});
