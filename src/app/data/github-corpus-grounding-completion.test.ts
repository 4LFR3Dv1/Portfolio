import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

type Completion = {
  schemaVersion: string;
  status: string;
  normative: boolean;
  materialization: {
    commit: string;
    verify: { workflow: string; runId: number; conclusion: string };
    censusPath: string;
    admissionPath: string;
  };
  grounding: {
    connectedRepositoryCount: number;
    repositoryDispositionCount: number;
    systemSubjectCount: number;
    frontierSystemCount: number;
    historicalSystemCount: number;
    repositoryEqualsSystem: boolean;
    repositoryEqualsRecord: boolean;
    allSystemSubjectsRemainPreBirth: boolean;
    recordBirthCount: number;
    r1RuntimeStarted: boolean;
  };
  closedIdentityDecisions: string[];
  legacyReconciliation: {
    preservedReservations: string[];
    abandonedPreBirthReservation: string;
    abandonedReservationReuseForbidden: boolean;
    explicitR0AmendmentRequired: boolean;
  };
  deferredWithoutBlockingGroundingCompletion: string[];
  acceptance: {
    r1PreComplete: boolean;
    recordBirthAuthorizedByGroundingAlone: boolean;
    r1RuntimeMayStart: boolean;
    nextRequiredCut: string;
  };
};

function readRepoFile(path: string): string {
  return readFileSync(new URL(`../../../${path}`, import.meta.url), 'utf8');
}

const completion = JSON.parse(
  readRepoFile('docs/editorial/R1-PRE-completion.v0.json'),
) as Completion;

describe('R1-PRE GitHub Corpus Grounding completion', () => {
  it('binds the successful materialization witness', () => {
    expect(completion.materialization).toMatchObject({
      commit: '6fd001c91da4918f5c99ab53b12de2e57ba4ae77',
      verify: {
        workflow: 'Verify',
        runId: 33338027991,
        conclusion: 'success',
      },
      censusPath: 'docs/editorial/github-corpus-census.v0.json',
      admissionPath: 'docs/editorial/github-corpus-admission.v0.json',
    });
  });

  it('closes corpus grounding without authorizing Record Birth', () => {
    expect(completion.status).toBe('frozen');
    expect(completion.normative).toBe(false);
    expect(completion.grounding.connectedRepositoryCount).toBe(54);
    expect(completion.grounding.repositoryDispositionCount).toBe(54);
    expect(completion.grounding.systemSubjectCount).toBe(28);
    expect(completion.grounding.frontierSystemCount).toBe(15);
    expect(completion.grounding.historicalSystemCount).toBe(13);
    expect(completion.grounding.repositoryEqualsSystem).toBe(false);
    expect(completion.grounding.repositoryEqualsRecord).toBe(false);
    expect(completion.grounding.allSystemSubjectsRemainPreBirth).toBe(true);
    expect(completion.grounding.recordBirthCount).toBe(0);
    expect(completion.grounding.r1RuntimeStarted).toBe(false);
    expect(completion.acceptance.r1PreComplete).toBe(true);
    expect(completion.acceptance.recordBirthAuthorizedByGroundingAlone).toBe(false);
  });

  it('records enough explicit identity decisions to prevent repository-card flattening', () => {
    expect(completion.closedIdentityDecisions.length).toBeGreaterThanOrEqual(15);
    expect(completion.closedIdentityDecisions.join('\n')).toContain('Lisa is one System');
    expect(completion.closedIdentityDecisions.join('\n')).toContain('Brine and BrineOS are distinct');
    expect(completion.closedIdentityDecisions.join('\n')).toContain('SNE Radar is one repository lineage');
    expect(completion.closedIdentityDecisions.join('\n')).toContain('ORDM is one historical research lineage');
  });

  it('requires an explicit amendment instead of silently birthing the legacy Agentic reservation', () => {
    expect(completion.legacyReconciliation.abandonedPreBirthReservation)
      .toBe('rec_d5549271c541d17165c0ad8512dcdcc1');
    expect(completion.legacyReconciliation.abandonedReservationReuseForbidden).toBe(true);
    expect(completion.legacyReconciliation.explicitR0AmendmentRequired).toBe(true);
    expect(completion.acceptance.r1RuntimeMayStart).toBe(false);
    expect(completion.acceptance.nextRequiredCut)
      .toBe('R0-A1 — Legacy Agentic Migration Amendment');
  });

  it('keeps deferred naming, private disclosure and extraction decisions out of identity authority', () => {
    expect(completion.deferredWithoutBlockingGroundingCompletion).toHaveLength(4);
    expect(completion.deferredWithoutBlockingGroundingCompletion.join('\n')).toContain('XS-NAME-01');
    expect(completion.deferredWithoutBlockingGroundingCompletion.join('\n')).toContain('PRIVATE-WORK-01');
    expect(completion.deferredWithoutBlockingGroundingCompletion.join('\n')).toContain('PUBLICATION-SELECTION-01');
    expect(completion.deferredWithoutBlockingGroundingCompletion.join('\n')).toContain('RESEARCH-EXTRACTION-01');
  });
});
