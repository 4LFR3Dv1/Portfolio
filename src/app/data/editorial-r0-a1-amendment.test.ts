import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

type LegacyProjectMapping = {
  legacyId: string;
  targetRecordId: string;
  targetKind: string;
  birthStatus: string;
  guarantees: Array<{ label: string; disposition: string }>;
  canonicalRoutes: Record<string, string>;
};

type ArchitectureMapping = {
  legacyId: string;
  targetRecordId: string;
  subjectRecordIds: string[];
};

type MigrationManifest = {
  contractId: string;
  projectMappings: LegacyProjectMapping[];
  architectureMappings: ArchitectureMapping[];
};

type Amendment = {
  amendmentId: string;
  status: string;
  normative: boolean;
  authority: {
    baseContract: string;
    historicalBaseMustRemainUnmodified: boolean;
  };
  affectedMapping: {
    legacyId: string;
    historicalTitle: string;
    previousNormativeState: {
      targetRecordId: string;
      targetKind: string;
      birthStatus: string;
      plannedCanonicalRoutes: Record<string, string>;
      guaranteeDisposition: string;
    };
    replacementNormativeState: {
      targetRecordId: null;
      targetKind: null;
      birthStatus: string;
      plannedCanonicalRoutes: null;
      guaranteeDisposition: string;
      compatibilityDisposition: string;
    };
  };
  retiredReservation: {
    recordId: string;
    wasBorn: boolean;
    recordLifecycle: null;
    status: string;
    reuseForbidden: boolean;
    mayBeAssignedToFoundry: boolean;
    mayBeAssignedToFactory: boolean;
    mayBeAssignedToAgentHub: boolean;
    mayBeAssignedToAnyFutureRecord: boolean;
    tombstoneRequired: boolean;
  };
  compatibility: {
    historicalLocator: string;
    locatorClass: string;
    resolutionMode: string;
    targetRecordId: null;
    redirectTarget: null;
    recordAlias: boolean;
    languageMode: string;
    mayRebindToAnotherRecord: boolean;
    plannedCanonicalRecordRoutesCancelled: string[];
  };
  legacyRepresentation: {
    preserve: boolean;
    sourceFreezeId: string;
    sourceCommit: string;
    sourcePath: string;
    sourceBlobSha: string;
    legacyId: string;
    title: string;
    guarantees: string[];
    guaranteesRemainRepresentationOnly: boolean;
    guaranteesMayBecomeClaimsByInheritance: boolean;
  };
  architectureCompatibility: Record<
    string,
    {
      legacyArchitectureRecordId: string;
      removeSubjectRecordIds: string[];
      replacementSubjectBinding: string;
      preserveFrozenRepresentation: boolean;
    }
  >;
  effectiveLaws: {
    frozenR0_8RemainsReconstructable: boolean;
    abandonedReservationIsNotARecord: boolean;
    abandonedReservationCannotBeReused: boolean;
    historicalLocatorRemainsResolvable: boolean;
    historicalLocatorCannotBecomeAliasToDifferentRecord: boolean;
    oldRepresentationRemainsAvailable: boolean;
    oldGuaranteesDoNotAutoMintClaims: boolean;
    foundryFactoryAgentHubRequireIndependentBirths: boolean;
    runtimeSemanticsChanged: boolean;
    uiChanged: boolean;
  };
  acceptance: {
    legacyAgenticReservationRetired: boolean;
    recordBirthCountForRetiredReservation: number;
    historicalLocatorPreserved: boolean;
    recordIdReuseForbidden: boolean;
    compatibilityDispositionDefined: boolean;
    oldRepresentationPreserved: boolean;
    r0ConsistencyRestored: boolean;
    r1_0UnblockedAfterCi: boolean;
    r0A1Complete: boolean;
  };
};

type SurfaceFreeze = {
  freezeId: string;
  canonical: { commit: string };
  projects: Array<{ id: string; title: string; guarantees: string[] }>;
  sourceBlobs: Record<string, string>;
};

type GroundingCompletion = {
  legacyReconciliation: {
    abandonedPreBirthReservation: string;
    abandonedReservationReuseForbidden: boolean;
    explicitR0AmendmentRequired: boolean;
  };
  acceptance: {
    r1PreComplete: boolean;
    nextRequiredCut: string;
  };
};

type CorpusAdmission = {
  legacyReconciliation: {
    preserveReservationForBirth: string[];
    doNotBirth: Array<{
      legacyId: string;
      reservedRecordId: string;
      reservationReuseForbidden: boolean;
      r0AmendmentRequired: boolean;
    }>;
  };
};

function readRepoFile(path: string): string {
  return readFileSync(new URL(`../../../${path}`, import.meta.url), 'utf8');
}

const migration = JSON.parse(
  readRepoFile('docs/editorial/migration-acceptance.v0.json'),
) as MigrationManifest;
const amendment = JSON.parse(
  readRepoFile('docs/editorial/R0-A1-legacy-agentic-migration-amendment.v0.json'),
) as Amendment;
const freeze = JSON.parse(
  readRepoFile('docs/editorial/legacy/portfolio-surface.v0.json'),
) as SurfaceFreeze;
const groundingCompletion = JSON.parse(
  readRepoFile('docs/editorial/R1-PRE-completion.v0.json'),
) as GroundingCompletion;
const corpusAdmission = JSON.parse(
  readRepoFile('docs/editorial/github-corpus-admission.v0.json'),
) as CorpusAdmission;

const retiredId = 'rec_d5549271c541d17165c0ad8512dcdcc1';
const oldProject = migration.projectMappings.find(
  (mapping) => mapping.legacyId === 'agentic-systems',
);
const frozenProject = freeze.projects.find((project) => project.id === 'agentic-systems');

describe('R0-A1 Legacy Agentic Migration Amendment', () => {
  it('preserves the accepted R0.8 contract as reconstructable history', () => {
    expect(migration.contractId).toBe('PORTFOLIO-R0.8-2026-08-30');
    expect(amendment.authority.baseContract).toBe(migration.contractId);
    expect(amendment.authority.historicalBaseMustRemainUnmodified).toBe(true);
    expect(oldProject).toMatchObject({
      legacyId: 'agentic-systems',
      targetRecordId: retiredId,
      targetKind: 'knowledge.system',
      birthStatus: 'reserved-for-r1',
    });
  });

  it('records the exact old normative state before replacing only its effective migration meaning', () => {
    expect(amendment.affectedMapping.previousNormativeState).toMatchObject({
      targetRecordId: retiredId,
      targetKind: oldProject?.targetKind,
      birthStatus: oldProject?.birthStatus,
      plannedCanonicalRoutes: oldProject?.canonicalRoutes,
      guaranteeDisposition: 'knowledge.claim',
    });
    expect(amendment.affectedMapping.replacementNormativeState).toEqual({
      targetRecordId: null,
      targetKind: null,
      birthStatus: 'retired-pre-birth-reservation',
      plannedCanonicalRoutes: null,
      guaranteeDisposition: 'legacy-representation-text',
      compatibilityDisposition: 'frozen-legacy-representation',
    });
  });

  it('retires the provisioned identifier without manufacturing a tombstoned Record', () => {
    expect(amendment.retiredReservation).toMatchObject({
      recordId: retiredId,
      wasBorn: false,
      recordLifecycle: null,
      status: 'retired-pre-birth',
      reuseForbidden: true,
      tombstoneRequired: false,
    });
    expect(amendment.acceptance.recordBirthCountForRetiredReservation).toBe(0);
  });

  it('forbids the abandoned RecordId from becoming Foundry, Factory, AgentHub or anything else', () => {
    expect(amendment.retiredReservation.mayBeAssignedToFoundry).toBe(false);
    expect(amendment.retiredReservation.mayBeAssignedToFactory).toBe(false);
    expect(amendment.retiredReservation.mayBeAssignedToAgentHub).toBe(false);
    expect(amendment.retiredReservation.mayBeAssignedToAnyFutureRecord).toBe(false);
    expect(amendment.effectiveLaws.foundryFactoryAgentHubRequireIndependentBirths).toBe(true);
  });

  it('preserves /work/agentic-systems as a legacy representation endpoint, never a rebound Record alias', () => {
    expect(amendment.compatibility).toMatchObject({
      historicalLocator: '/work/agentic-systems',
      locatorClass: 'legacy-compatibility-entry',
      resolutionMode: 'render-frozen-legacy-representation',
      targetRecordId: null,
      redirectTarget: null,
      recordAlias: false,
      languageMode: 'legacy-negotiated-entry',
      mayRebindToAnotherRecord: false,
    });
    expect(amendment.effectiveLaws.historicalLocatorRemainsResolvable).toBe(true);
    expect(amendment.effectiveLaws.historicalLocatorCannotBecomeAliasToDifferentRecord).toBe(true);
  });

  it('cancels only never-enacted agentic canonical Record routes', () => {
    expect(new Set(amendment.compatibility.plannedCanonicalRecordRoutesCancelled)).toEqual(
      new Set(['/en/systems/agentic-systems', '/pt-br/systems/agentic-systems']),
    );
    expect(amendment.compatibility.plannedCanonicalRecordRoutesCancelled).toEqual(
      expect.arrayContaining(Object.values(oldProject?.canonicalRoutes ?? {})),
    );
  });

  it('binds compatibility to the exact frozen legacy representation', () => {
    expect(frozenProject).toBeDefined();
    expect(amendment.legacyRepresentation).toMatchObject({
      preserve: true,
      sourceFreezeId: freeze.freezeId,
      sourceCommit: freeze.canonical.commit,
      sourcePath: 'src/app/data/projects.ts',
      sourceBlobSha: freeze.sourceBlobs['src/app/data/projects.ts'],
      legacyId: frozenProject?.id,
      title: frozenProject?.title,
      guarantees: frozenProject?.guarantees,
      guaranteesRemainRepresentationOnly: true,
      guaranteesMayBecomeClaimsByInheritance: false,
    });
  });

  it('preserves every old guarantee label while revoking automatic Claim migration', () => {
    const oldGuarantees = oldProject?.guarantees.map((guarantee) => guarantee.label) ?? [];
    expect(amendment.legacyRepresentation.guarantees).toEqual(oldGuarantees);
    expect(amendment.effectiveLaws.oldGuaranteesDoNotAutoMintClaims).toBe(true);
  });

  it('removes the abandoned identity from effective architecture subject binding without rewriting diagrams', () => {
    for (const legacyId of ['systems', 'agents']) {
      const base = migration.architectureMappings.find((mapping) => mapping.legacyId === legacyId);
      const overlay = amendment.architectureCompatibility[legacyId];
      expect(base?.subjectRecordIds).toContain(retiredId);
      expect(overlay.legacyArchitectureRecordId).toBe(base?.targetRecordId);
      expect(overlay.removeSubjectRecordIds).toEqual([retiredId]);
      expect(overlay.replacementSubjectBinding).toBe('deferred-until-concrete-systems-are-born');
      expect(overlay.preserveFrozenRepresentation).toBe(true);
    }
  });

  it('is exactly the amendment demanded by completed corpus grounding', () => {
    expect(groundingCompletion.acceptance.r1PreComplete).toBe(true);
    expect(groundingCompletion.legacyReconciliation).toMatchObject({
      abandonedPreBirthReservation: retiredId,
      abandonedReservationReuseForbidden: true,
      explicitR0AmendmentRequired: true,
    });
    const doNotBirth = corpusAdmission.legacyReconciliation.doNotBirth.find(
      (entry) => entry.legacyId === 'agentic-systems',
    );
    expect(doNotBirth).toMatchObject({
      reservedRecordId: retiredId,
      reservationReuseForbidden: true,
      r0AmendmentRequired: true,
    });
    expect(corpusAdmission.legacyReconciliation.preserveReservationForBirth).not.toContain(retiredId);
  });

  it('restores effective R0 consistency without changing UI or runtime semantics', () => {
    expect(amendment.normative).toBe(true);
    expect(amendment.status).toBe('materialized');
    expect(amendment.effectiveLaws.frozenR0_8RemainsReconstructable).toBe(true);
    expect(amendment.effectiveLaws.abandonedReservationIsNotARecord).toBe(true);
    expect(amendment.effectiveLaws.abandonedReservationCannotBeReused).toBe(true);
    expect(amendment.effectiveLaws.oldRepresentationRemainsAvailable).toBe(true);
    expect(amendment.effectiveLaws.runtimeSemanticsChanged).toBe(false);
    expect(amendment.effectiveLaws.uiChanged).toBe(false);
    expect(amendment.acceptance.r0ConsistencyRestored).toBe(true);
    expect(amendment.acceptance.r0A1Complete).toBe(false);
    expect(amendment.acceptance.r1_0UnblockedAfterCi).toBe(false);
  });
});
