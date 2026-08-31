import { describe, expect, it } from 'vitest';
import currentRevisionManifestJson from '../../docs/editorial/R1-A2.3-current-system-revisions.v0.json';
import currentCensusJson from '../../docs/editorial/R1-A2.1-current-github-census.v0.json';
import registryManifestJson from '../../docs/editorial/record-registry.v0.json';
import {
  CURRENT_SYSTEM_REVISION_ASSIGNMENTS,
  CURRENT_SYSTEM_REVISION_DEFERRED,
} from './current-system-revision-candidates';
import {
  materializeCurrentSystemRevisions,
  type CurrentRevisionManifest,
} from './current-revision-runtime';
import type { RecordRegistryManifest } from './record-registry';

const manifest = currentRevisionManifestJson as CurrentRevisionManifest;
const registry = registryManifestJson as RecordRegistryManifest;
const census = currentCensusJson as {
  contractId: string;
  observedAt: string;
  repositories: Array<{
    repo: string;
    visibility: 'public' | 'private';
    defaultBranch: string;
    observedHead: string | null;
    state: 'material' | 'empty';
  }>;
};

const materialized = materializeCurrentSystemRevisions();
const genericBirthSummary = registry.birthProfile.summary;

describe('R1-A2.3 current System revisions', () => {
  it('materializes 27 generation-1 successors while preserving all 28 Record identities', () => {
    expect(materialized.errors).toEqual([]);
    expect(materialized.records).toHaveLength(28);
    expect(materialized.successors).toHaveLength(27);
    expect(materialized.deferredRecordIds).toEqual(['rec_c5a75fd5ecae0565aaa0c96f0ad53227']);
    expect(CURRENT_SYSTEM_REVISION_ASSIGNMENTS).toHaveLength(27);
    expect(CURRENT_SYSTEM_REVISION_DEFERRED).toHaveLength(1);

    const successorRecordIds = new Set(materialized.successors.map((entry) => entry.recordId));
    expect(successorRecordIds.size).toBe(27);

    for (const record of materialized.records) {
      if (successorRecordIds.has(record.recordId)) {
        expect(record.revisions).toHaveLength(2);
        const birth = record.revisions[0].revision;
        const successor = record.revisions[1].revision;
        expect(successor.recordId).toBe(birth.recordId);
        expect(successor.kind).toBe(birth.kind);
        expect(successor.generation).toBe(1);
        expect(successor.previousRevisionId).toBe(birth.revisionId);
        expect(successor.revisionId).not.toBe(birth.revisionId);
      } else {
        expect(record.recordId).toBe('rec_c5a75fd5ecae0565aaa0c96f0ad53227');
        expect(record.revisions).toHaveLength(1);
      }
    }
  });

  it('removes the generation-zero placeholder from every current successor payload', () => {
    expect(manifest.materialization.genericBirthSummarySuccessorCount).toBe(0);
    expect(manifest.acceptance.genericBirthSummarySuccessorCount).toBe(0);
    for (const successor of materialized.successors) {
      expect(successor.payload.summary).not.toBe(genericBirthSummary);
      expect(successor.payload.summary.trim().length).toBeGreaterThan(24);
      expect(successor.payload.schemaVersion).toBe('knowledge.system/v0');
    }
  });

  it('binds every revision to the exact A2.1 census observation instead of repository names alone', () => {
    expect(census.contractId).toBe('PORTFOLIO-R1-A2.1-2026-08-31');
    expect(census.observedAt).toBe('2026-08-31T15:11:00Z');

    const censusByRepo = new Map(census.repositories.map((entry) => [entry.repo, entry]));
    const assignmentByRecordId = new Map(
      CURRENT_SYSTEM_REVISION_ASSIGNMENTS.map((assignment) => [assignment.recordId, assignment]),
    );

    for (const successor of materialized.successors) {
      const assignment = assignmentByRecordId.get(successor.recordId);
      expect(assignment).toBeDefined();
      expect(successor.temporalBasis).toHaveLength(assignment?.temporalBasis.repositoryRefs.length ?? 0);

      for (const observed of successor.temporalBasis) {
        const censusEntry = censusByRepo.get(observed.repo);
        expect(censusEntry).toBeDefined();
        expect(observed.censusContractId).toBe(census.contractId);
        expect(observed.observedAt).toBe(census.observedAt);
        expect(observed.defaultBranch).toBe(censusEntry?.defaultBranch);
        expect(observed.observedHead).toBe(censusEntry?.observedHead);
        expect(observed.visibility).toBe(censusEntry?.visibility);
        expect(observed.state).toBe(censusEntry?.state);
        if (observed.state === 'material') {
          expect(observed.observedHead).toMatch(/^[0-9a-f]{40}$/);
        } else {
          expect(observed.observedHead).toBeNull();
        }
      }
    }
  });

  it('keeps evidence provenance outside the System payload and does not imply disclosure or routing', () => {
    for (const assignment of CURRENT_SYSTEM_REVISION_ASSIGNMENTS) {
      expect(assignment.grounding.summaryBasis.length).toBeGreaterThan(0);
      if (assignment.payload.thesis !== null) {
        expect(assignment.grounding.thesisBasis.length).toBeGreaterThan(0);
      }
      expect(assignment.grounding.privateEvidenceMayBePublished).toBe(false);
      expect(Object.keys(assignment.payload).sort()).toEqual(['name', 'schemaVersion', 'summary', 'thesis']);
    }

    expect(manifest.laws).toMatchObject({
      evidenceFieldsAllowedInsidePayload: false,
      disclosureDecisionImplied: false,
      routeDecisionImplied: false,
      publicSurfaceDecisionImplied: false,
      repositoryReferenceMustResolveInCurrentCensus: true,
      temporalObservationInheritedFromCensus: true,
    });
    expect(manifest.acceptance).toMatchObject({
      publicDisclosureDecisionCount: 0,
      routeMutationCount: 0,
      publicSurfaceMutationCount: 0,
      productionMutationCount: 0,
    });
  });

  it('preserves explicit uncertainty instead of inventing thesis claims', () => {
    const bySubject = new Map(
      CURRENT_SYSTEM_REVISION_ASSIGNMENTS.map((assignment) => [assignment.subjectKey, assignment]),
    );
    expect(bySubject.get('sne-radar')?.payload.thesis).toBeNull();
    expect(bySubject.get('sne-vault')?.payload.thesis).toBeNull();
    expect(bySubject.get('edital-sales')?.payload.thesis).toBeNull();
    expect(bySubject.get('estampai')?.payload.thesis).toBeNull();
    expect(CURRENT_SYSTEM_REVISION_DEFERRED).toEqual([
      {
        subjectKey: 'transactional-support-bot',
        recordId: 'rec_c5a75fd5ecae0565aaa0c96f0ad53227',
        reason: 'no-current-repository-successor-and-no-new-current-semantic-evidence',
      },
    ]);
  });

  it('keeps A2.3 unaccepted until CI witnesses this exact candidate', () => {
    expect(manifest.status).toBe('materialized-awaiting-ci');
    expect(manifest.acceptance.r1_a2_3Complete).toBe(false);
    expect(manifest.acceptance.nextRequiredAction).toContain('CI must recompute');
  });
});
