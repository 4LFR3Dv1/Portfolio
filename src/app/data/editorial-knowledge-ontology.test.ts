import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import type { RecordId, RecordRef } from './editorial-record-identity';
import {
  EXPERIMENT_DECLARED_OUTCOMES,
  INVESTIGATION_STATES,
  KNOWLEDGE_KINDS,
  QUESTION_STATES,
  kindForPayload,
  serializeKnowledgePayload,
  validateKnowledgeGraph,
  validateKnowledgePayload,
  type ClaimPayload,
  type ExperimentPayload,
  type InvestigationPayload,
  type KnowledgeKind,
  type KnowledgePayload,
  type KnowledgeRecordCandidate,
  type QuestionPayload,
  type SystemPayload,
} from './editorial-knowledge-ontology';

interface OntologyManifest {
  status: string;
  normative: boolean;
  preconditions: { r0_2Complete: boolean };
  kindRegistry: Array<{ kind: KnowledgeKind; schemaVersion: string; fields: string[] }>;
  questionStates: string[];
  investigationStates: string[];
  experimentDeclaredOutcomes: string[];
  canonicalPayload: {
    unknownFieldsAllowed: boolean;
    setLikeReferenceOrder: string;
    duplicateReferencesAllowed: boolean;
    payloadDigestAlgorithm: string;
  };
  deferredFields: string[];
  laws: Array<{ id: string; title: string; rule: string }>;
  testVectors: Array<{
    kind: KnowledgeKind;
    payload: KnowledgePayload;
    expectedPayloadDigest: string;
  }>;
  ciWitness: {
    workflow: string;
    runId: number;
    commit: string;
    conclusion: string;
  };
  acceptance: {
    r0_2Preserved: boolean;
    runtimeSemanticsChanged: boolean;
    uiChanged: boolean;
    r0_3Complete: boolean;
  };
}

interface IdentityManifest {
  status: string;
  acceptance: { r0_2Complete: boolean };
}

function readRepoFile(path: string): string {
  return readFileSync(new URL(`../../../${path}`, import.meta.url), 'utf8');
}

const ontology = JSON.parse(
  readRepoFile('docs/editorial/knowledge-ontology.v0.json'),
) as OntologyManifest;

const identity = JSON.parse(
  readRepoFile('docs/editorial/record-identity.v0.json'),
) as IdentityManifest;

function ref(hex: string): RecordRef {
  return { type: 'record', recordId: `rec_${hex.padStart(32, '0')}` as RecordId };
}

function payloadDigest(kind: KnowledgeKind, payload: KnowledgePayload): string {
  return `sha256_${createHash('sha256').update(serializeKnowledgePayload(kind, payload), 'utf8').digest('hex')}`;
}

const system: KnowledgeRecordCandidate = {
  recordId: ref('1').recordId,
  kind: 'knowledge.system',
  payload: {
    schemaVersion: 'knowledge.system/v0',
    name: 'Genesis',
    summary: 'Governed agentic web runtime.',
    thesis: 'The web can be governed as an operational environment.',
  } satisfies SystemPayload,
};

const question: KnowledgeRecordCandidate = {
  recordId: ref('2').recordId,
  kind: 'knowledge.question',
  payload: {
    schemaVersion: 'knowledge.question/v0',
    prompt: 'When does a browser stop being merely an application?',
    state: 'open',
    aboutSystemRefs: [ref('1')],
    parentQuestionRef: null,
  } satisfies QuestionPayload,
};

const investigation: KnowledgeRecordCandidate = {
  recordId: ref('3').recordId,
  kind: 'knowledge.investigation',
  payload: {
    schemaVersion: 'knowledge.investigation/v0',
    title: 'Browser authority boundary',
    scope: 'Separate observation, authorization, action and effect.',
    state: 'active',
    questionRefs: [ref('2')],
  } satisfies InvestigationPayload,
};

const experiment: KnowledgeRecordCandidate = {
  recordId: ref('4').recordId,
  kind: 'knowledge.experiment',
  payload: {
    schemaVersion: 'knowledge.experiment/v0',
    title: 'Authority boundary campaign',
    protocol: 'Execute one bounded action and verify proposal, authorization, action, observation and effect remain distinct.',
    declaredOutcome: 'inconclusive',
    investigationRefs: [ref('3')],
  } satisfies ExperimentPayload,
};

const claim: KnowledgeRecordCandidate = {
  recordId: ref('5').recordId,
  kind: 'knowledge.claim',
  payload: {
    schemaVersion: 'knowledge.claim/v0',
    statement: 'Observation does not imply authorization.',
    scope: 'Governed web runtime actions.',
    aboutRefs: [ref('1'), ref('4')],
  } satisfies ClaimPayload,
};

const validGraph = [system, question, investigation, experiment, claim];

describe('R0.3 Knowledge Ontology', () => {
  it('starts only after the frozen R0.2 identity contract', () => {
    expect(identity.status).toBe('frozen');
    expect(identity.acceptance.r0_2Complete).toBe(true);
    expect(ontology.preconditions.r0_2Complete).toBe(true);
    expect(ontology.acceptance.r0_2Preserved).toBe(true);
  });

  it('registers exactly the five initial knowledge kinds', () => {
    expect(ontology.kindRegistry.map((entry) => entry.kind)).toEqual(KNOWLEDGE_KINDS);
    expect(new Set(ontology.kindRegistry.map((entry) => entry.kind)).size).toBe(5);
    expect(ontology.kindRegistry.map((entry) => entry.schemaVersion)).toEqual([
      'knowledge.system/v0',
      'knowledge.question/v0',
      'knowledge.investigation/v0',
      'knowledge.experiment/v0',
      'knowledge.claim/v0',
    ]);
  });

  it('freezes the research-state vocabularies without introducing maturity', () => {
    expect(ontology.questionStates).toEqual(QUESTION_STATES);
    expect(ontology.investigationStates).toEqual(INVESTIGATION_STATES);
    expect(ontology.experimentDeclaredOutcomes).toEqual(EXPERIMENT_DECLARED_OUTCOMES);
    expect(ontology.deferredFields).toContain('maturity');
    expect(ontology.deferredFields).toContain('visibility');
  });

  it('validates all five canonical payloads and their kind binding', () => {
    for (const record of validGraph) {
      expect(kindForPayload(record.payload)).toBe(record.kind);
      expect(validateKnowledgePayload(record.kind, record.payload)).toEqual([]);
    }
  });

  it('fails closed on unknown or deferred payload fields', () => {
    const withUnknown = { ...(system.payload as SystemPayload), extra: 'not ontology' };
    expect(validateKnowledgePayload('knowledge.system', withUnknown)).toContain('payload-fields');

    const withEvidence = { ...(claim.payload as ClaimPayload), evidenceRefs: [ref('1')] };
    const errors = validateKnowledgePayload('knowledge.claim', withEvidence);
    expect(errors).toContain('payload-fields');
    expect(errors).toContain('deferred-field');
  });

  it('rejects duplicate set-like references before canonicalization', () => {
    const duplicate: InvestigationPayload = {
      ...(investigation.payload as InvestigationPayload),
      questionRefs: [ref('2'), ref('2')],
    };
    expect(validateKnowledgePayload('knowledge.investigation', duplicate)).toContain('duplicate-ref');
  });

  it('canonicalizes set-like references by RecordId', () => {
    const ordered = claim.payload as ClaimPayload;
    const reversed: ClaimPayload = { ...ordered, aboutRefs: [...ordered.aboutRefs].reverse() };
    expect(serializeKnowledgePayload('knowledge.claim', reversed)).toBe(
      serializeKnowledgePayload('knowledge.claim', ordered),
    );
  });

  it('reproduces one SHA-256 payload vector for every knowledge kind', () => {
    expect(ontology.canonicalPayload.payloadDigestAlgorithm).toBe('sha256');
    expect(ontology.canonicalPayload.unknownFieldsAllowed).toBe(false);
    expect(ontology.canonicalPayload.duplicateReferencesAllowed).toBe(false);
    expect(ontology.canonicalPayload.setLikeReferenceOrder).toBe('recordId-ascending');
    expect(ontology.testVectors).toHaveLength(5);

    for (const vector of ontology.testVectors) {
      expect(validateKnowledgePayload(vector.kind, vector.payload)).toEqual([]);
      expect(payloadDigest(vector.kind, vector.payload)).toBe(vector.expectedPayloadDigest);
    }
  });

  it('accepts the canonical forward research graph', () => {
    expect(validateKnowledgeGraph(validGraph)).toEqual([]);
  });

  it('rejects unresolved references and wrong target kinds', () => {
    const unresolvedInvestigation: KnowledgeRecordCandidate = {
      ...investigation,
      payload: {
        ...(investigation.payload as InvestigationPayload),
        questionRefs: [ref('99')],
      },
    };
    expect(validateKnowledgeGraph([system, question, unresolvedInvestigation])).toContain(
      `${investigation.recordId}:questionRefs:unresolved:${ref('99').recordId}`,
    );

    const wrongTarget: KnowledgeRecordCandidate = {
      ...investigation,
      payload: {
        ...(investigation.payload as InvestigationPayload),
        questionRefs: [ref('1')],
      },
    };
    expect(validateKnowledgeGraph([system, wrongTarget])).toContain(
      `${investigation.recordId}:questionRefs:target-kind:knowledge.system`,
    );
  });

  it('rejects a Question that names itself as its parent', () => {
    const selfParent: KnowledgeRecordCandidate = {
      ...question,
      payload: {
        ...(question.payload as QuestionPayload),
        parentQuestionRef: { type: 'record', recordId: question.recordId },
      },
    };
    expect(validateKnowledgeGraph([system, selfParent])).toContain(
      `${question.recordId}:parentQuestionRef:self`,
    );
  });

  it('freezes exactly eighteen contiguous normative knowledge laws', () => {
    const expected = Array.from({ length: 18 }, (_, index) => `KO-${String(index + 1).padStart(2, '0')}`);
    expect(ontology.laws.map((law) => law.id)).toEqual(expected);
    expect(new Set(ontology.laws.map((law) => law.title)).size).toBe(18);
    for (const law of ontology.laws) {
      expect(law.rule.length).toBeGreaterThan(50);
      expect(law.rule).toMatch(/\b(MUST|MAY)\b/);
    }
  });

  it('closes only with a successful materialization witness and no UI/runtime changes', () => {
    for (const deferred of ['evidence', 'evidenceRefs', 'supportRefs', 'maturity', 'visibility', 'route', 'language']) {
      expect(ontology.deferredFields).toContain(deferred);
    }
    expect(ontology.status).toBe('frozen');
    expect(ontology.normative).toBe(true);
    expect(ontology.ciWitness).toEqual({
      workflow: 'Verify',
      runId: 33331171871,
      commit: '1d293b87668949f2227e24be2d15cf9ffb7f82ed',
      conclusion: 'success',
    });
    expect(ontology.acceptance.runtimeSemanticsChanged).toBe(false);
    expect(ontology.acceptance.uiChanged).toBe(false);
    expect(ontology.acceptance.r0_3Complete).toBe(true);
  });
});
