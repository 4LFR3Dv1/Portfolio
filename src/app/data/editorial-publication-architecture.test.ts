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
  acceptance: {
    r0_4Preserved: boolean;
    runtimeSemanticsChanged: boolean;
    uiChanged: boolean;
    r0_5Complete: boolean;
  };
}

interface EvidenceManifest {
  status: string;
  acceptance: { r0_4Complete: boolean };
}

function readRepoFile(path: string): string {
  return readFileSync(new URL(`../../../${path}`, import.meta.url), 'utf8');
}

const contract = JSON.parse(
  readRepoFile('docs/editorial/publication-architecture.v0.json'),
) as ContractManifest;

const evidence = JSON.parse(
  readRepoFile('docs/editorial/evidence-contract.v0.json'),
) as EvidenceManifest;

function digest(kind: RepresentationKind, payload: RepresentationPayload): string {
  return `sha256_${createHash('sha256').update(serializeRepresentationPayload(kind, payload), 'utf8').digest('hex')}`;
}

const publication = contract.testVectors.find((vector) => vector.kind === 'representation.publication')?.payload as PublicationPayload;
const architecture = contract.testVectors.find((vector) => vector.kind === 'representation.architecture')?.payload as ArchitecturePayload;

const index: RepresentationRevisionIndexEntry[] = [
  { recordId: 'rec_00000000000000000000000000000001', revisionId: 'rev_sha256_aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', kind: 'knowledge.system' },
  { recordId: 'rec_00000000000000000000000000000002', revisionId: 'rev_sha256_bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb', kind: 'knowledge.claim' },
  { recordId: 'rec_00000000000000000000000000000004', revisionId: 'rev_sha256_cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc', kind: 'evidence.binding' },
];

describe('R0.5 Publication & Architecture Contract', () => {
  it('starts only after the frozen R0.4 Evidence Contract', () => {
    expect(evidence.status).toBe('frozen');
    expect(evidence.acceptance.r0_4Complete).toBe(true);
    expect(contract.acceptance.r0_4Preserved).toBe(true);
  });

  it('registers exactly two representation RecordKinds and twenty contiguous laws', () => {
    expect(contract.kindRegistry.map((entry) => entry.kind)).toEqual(REPRESENTATION_KINDS);
    const expected = Array.from({ length: 20 }, (_, index) => `PA-${String(index + 1).padStart(2, '0')}`);
    expect(contract.laws.map((law) => law.id)).toEqual(expected);
    expect(new Set(contract.laws.map((law) => law.title)).size).toBe(20);
    for (const law of contract.laws) expect(law.rule).toMatch(/\b(MUST|MAY)\b/);
  });

  it('requires logical subjects and exact pinned basis coverage for Publications', () => {
    expect(validateRepresentationPayload('representation.publication', publication)).toEqual([]);
    const missingBasis: PublicationPayload = { ...publication, basisRefs: publication.basisRefs.filter((ref) => ref.recordId !== publication.subjectRefs[0].recordId) };
    expect(validateRepresentationPayload('representation.publication', missingBasis)).toContain('subject-basis-missing');
    const missingClaimBasis: PublicationPayload = { ...publication, basisRefs: publication.basisRefs.filter((ref) => ref.recordId !== publication.claimRefs[0].recordId) };
    expect(validateRepresentationPayload('representation.publication', missingClaimBasis)).toContain('claim-basis-missing');
  });

  it('does not admit route, language, visibility, maturity or publishedAt into Publication', () => {
    const invalid = { ...publication, visibility: 'public' };
    expect(validateRepresentationPayload('representation.publication', invalid)).toContain('payload-fields');
    const manifestText = readRepoFile('docs/editorial/publication-architecture.v0.json');
    expect(manifestText).toContain('Later exposure semantics remain separate');
  });

  it('keeps Architecture component IDs local and relation endpoints internally resolvable', () => {
    expect(validateRepresentationPayload('representation.architecture', architecture)).toEqual([]);
    const broken: ArchitecturePayload = {
      ...architecture,
      relations: [{ from: 'proposal', to: 'missing', label: 'invalid edge' }],
    };
    expect(validateRepresentationPayload('representation.architecture', broken)).toContain('relation-to');

    const duplicate: ArchitecturePayload = {
      ...architecture,
      components: [architecture.components[0], { ...architecture.components[0] }],
      relations: [],
    };
    expect(validateRepresentationPayload('representation.architecture', duplicate)).toContain('duplicate-component-id');
  });

  it('requires pinned basis for represented System components and invariant Claims', () => {
    const withoutSystemBasis: ArchitecturePayload = {
      ...architecture,
      basisRefs: architecture.basisRefs.filter((ref) => ref.recordId !== 'rec_00000000000000000000000000000001'),
    };
    const errors = validateRepresentationPayload('representation.architecture', withoutSystemBasis);
    expect(errors).toContain('subject-basis-missing');
    expect(errors).toContain('component-basis-missing');

    const withoutClaimBasis: ArchitecturePayload = {
      ...architecture,
      basisRefs: architecture.basisRefs.filter((ref) => ref.recordId !== 'rec_00000000000000000000000000000002'),
    };
    expect(validateRepresentationPayload('representation.architecture', withoutClaimBasis)).toContain('claim-basis-missing');
  });

  it('resolves Publication and Architecture references only to their admitted target kinds', () => {
    expect(validateRepresentationResolution('representation.publication', publication, index)).toEqual([]);
    expect(validateRepresentationResolution('representation.architecture', architecture, index)).toEqual([]);

    const wrongIndex = index.map((entry) => entry.recordId === 'rec_00000000000000000000000000000001'
      ? { ...entry, kind: 'evidence.artifact' }
      : entry);
    expect(validateRepresentationResolution('representation.architecture', architecture, wrongIndex).some((error) => error.includes('target-kind'))).toBe(true);
  });

  it('does not let evidence basis create support semantics', () => {
    const publicationFields = Object.keys(publication);
    expect(publicationFields).not.toContain('supports');
    expect(publicationFields).not.toContain('evidenceDisposition');
    expect(publicationFields).not.toContain('established');
    const law = contract.laws.find((candidate) => candidate.id === 'PA-10');
    expect(law?.rule).toContain('MUST NOT create a supports');
  });

  it('reproduces both canonical SHA-256 payload vectors', () => {
    for (const vector of contract.testVectors) {
      expect(digest(vector.kind, vector.payload)).toBe(vector.expectedPayloadDigest);
      const serialized = serializeRepresentationPayload(vector.kind, vector.payload);
      expect(serialized.endsWith('\n')).toBe(true);
      expect(serialized).not.toContain('\r');
    }
  });

  it('keeps R0.5 isolated from runtime and UI semantics until completion witness', () => {
    expect(contract.normative).toBe(true);
    expect(contract.acceptance.runtimeSemanticsChanged).toBe(false);
    expect(contract.acceptance.uiChanged).toBe(false);
    expect(contract.acceptance.r0_5Complete).toBe(false);
  });
});
