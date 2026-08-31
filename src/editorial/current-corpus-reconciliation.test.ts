import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

function readRepoFile(path: string): string {
  return readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
}

function readJson<T>(path: string): T {
  return JSON.parse(readRepoFile(path)) as T;
}

interface Constitution {
  baseline: string;
  discovery: {
    acceptedPreviewWasStructurallyCoherent: boolean;
    acceptedPreviewWasCurrentPublicationCorrect: boolean;
    genericBirthSummary: string;
    bornSystemCount: number;
    routedSystemCount: number;
    bornSystemsWithoutRouteCount: number;
    systemsPerLanguageOnAcceptedSurface: number;
  };
  historicalState: {
    r1Complete: boolean;
    r1HistoryRewritten: boolean;
    r2_6HistoricalComplete: boolean;
    r2_7HistoricalComplete: boolean;
    r2_7InfrastructureWitnessPreserved: boolean;
  };
  laws: Record<string, boolean>;
  currentState: Record<string, boolean | number>;
  acceptance: Record<string, boolean | string>;
}

interface Census {
  observationMode: string;
  sourceInstallations: Array<{ installationId: number; account: string; repositoryCount: number }>;
  comparisonToR1Pre: { repositoryInventoryDrift: boolean };
  scope: {
    repositoryCount: number;
    materialHeadCount: number;
    emptyRepositoryCount: number;
    owners: Record<string, number>;
    completeForObservedInstallation: boolean;
    claimOfGlobalGitHubCompleteness: boolean;
  };
  repositories: Array<{
    repo: string;
    visibility: 'public' | 'private';
    defaultBranch: string;
    observedHead: string | null;
    state: 'material' | 'empty';
  }>;
}

interface PreviousCensus {
  repositories: Array<{ repo: string }>;
}

interface Registry {
  birthProfile: { summary: string; thesis: string | null };
  admission: { systemBirthCount: number };
  assignments: Array<{ subjectKey: string; recordId: string }>;
}

interface IdentityReconciliation {
  status: string;
  records: Array<{
    subjectKey: string;
    recordId: string;
    repositoryRealizations: string[];
    newRecordRequired: boolean;
    currentRevisionCandidate: boolean;
  }>;
  unresolvedButNonBlockingIdentityRelations: string[];
  currentState: Record<string, number>;
}

interface Completion {
  status: string;
  materialization?: Record<string, number | string[] | boolean>;
  acceptance: Record<string, boolean | number | string>;
  productionBoundary?: { productionMutationCount: number };
}

const constitution = readJson<Constitution>('docs/editorial/R1-A2-reconciliation-constitution.v0.json');
const census = readJson<Census>('docs/editorial/R1-A2.1-current-github-census.v0.json');
const previousCensus = readJson<PreviousCensus>('docs/editorial/github-corpus-census.v0.json');
const identity = readJson<IdentityReconciliation>('docs/editorial/R1-A2.2-identity-reconciliation.v0.json');
const registry = readJson<Registry>('docs/editorial/record-registry.v0.json');
const routes = readJson<{ admission: { targetRecordCount: number }; deferred: { bornSystemsWithoutRouteCount: number } }>('docs/editorial/route-runtime.v0.json');
const surfaces = readJson<{ currentState: { systemsPerLanguage: number } }>('docs/editorial/core-editorial-surfaces.v0.json');
const r27 = readJson<{ status: string; acceptance: Record<string, boolean> }>('docs/editorial/R2.7-completion.v0.json');
const a21 = readJson<Completion>('docs/editorial/R1-A2.1-completion.v0.json');
const a22 = readJson<Completion>('docs/editorial/R1-A2.2-completion.v0.json');
const a23 = readJson<Completion>('docs/editorial/R1-A2.3-completion.v0.json');
const a24 = readJson<Completion>('docs/editorial/R1-A2.4-completion.v0.json');
const a25 = readJson<Completion>('docs/editorial/R1-A2.5-completion.v0.json');
const a26 = readJson<Completion>('docs/editorial/R1-A2.6-completion.v0.json');
const r1A2Doc = readRepoFile('docs/editorial/R1-A2-current-corpus-reconciliation.md');
const r2Readme = readRepoFile('docs/editorial/R2-README.md');

describe('R1-A2 current corpus reconciliation', () => {
  it('preserves historical R1/R2 completion while revoking current cutover eligibility', () => {
    expect(constitution.baseline).toBe('1ad9128328ed702d0c160be5acca5a4874674d25');
    expect(constitution.historicalState).toEqual({
      r1Complete: true,
      r1HistoryRewritten: false,
      r2_6HistoricalComplete: true,
      r2_7HistoricalComplete: true,
      r2_7InfrastructureWitnessPreserved: true,
    });
    expect(r27.status).toBe('complete');
    expect(r27.acceptance).toMatchObject({
      r2_7Complete: true,
      cutoverReady: true,
      cutoverAuthorized: false,
      cutoverEnacted: false,
    });
    expect(constitution.currentState).toMatchObject({
      currentPublicationValid: false,
      cutoverReady: false,
      cutoverAuthorized: false,
      cutoverEnacted: false,
      productionMutationCount: 0,
    });
    expect(r2Readme).toContain('CURRENT_PUBLICATION_VALID=false');
    expect(r2Readme).toContain('CUTOVER_READY=false');
  });

  it('freezes the exact connected installation census and material HEAD state', () => {
    expect(census.observationMode).toBe('connected-github-installation-default-branch-ref');
    expect(census.sourceInstallations).toEqual([
      { installationId: 153974730, account: '4LFR3Dv1', repositoryCount: 39 },
      { installationId: 153840788, account: 'SNE-Labs', repositoryCount: 15 },
    ]);
    expect(census.scope).toEqual({
      repositoryCount: 54,
      materialHeadCount: 52,
      emptyRepositoryCount: 2,
      owners: { '4LFR3Dv1': 39, 'SNE-Labs': 15 },
      completeForObservedInstallation: true,
      claimOfGlobalGitHubCompleteness: false,
    });
    expect(census.repositories).toHaveLength(54);
    expect(census.repositories.filter((entry) => entry.state === 'material')).toHaveLength(52);
    expect(census.repositories.filter((entry) => entry.state === 'empty')).toHaveLength(2);
    expect(census.repositories.filter((entry) => entry.state === 'material').every((entry) => /^[0-9a-f]{40}$/.test(entry.observedHead ?? ''))).toBe(true);
    expect(census.repositories.filter((entry) => entry.state === 'empty').every((entry) => entry.observedHead === null)).toBe(true);
    expect(census.comparisonToR1Pre.repositoryInventoryDrift).toBe(false);

    const previousNames = previousCensus.repositories.map((entry) => entry.repo).sort();
    const currentNames = census.repositories.map((entry) => entry.repo).sort();
    expect(currentNames).toEqual(previousNames);

    const byRepo = new Map(census.repositories.map((entry) => [entry.repo, entry]));
    expect(byRepo.get('4LFR3Dv1/Genesis')?.observedHead).toBe('ffbba53257a0b8e9c147977cc63aa05bacd1161b');
    expect(byRepo.get('4LFR3Dv1/BrineOS')?.observedHead).toBe('54be6e6512c47fc0e99e85a850bd0b44f9dc54c5');
    expect(byRepo.get('4LFR3Dv1/wer-esk')?.observedHead).toBe('30989ea6c990888ccf4ebb290614633cc7d2f415');
    expect(byRepo.get('SNE-Labs/SNE-FDE')?.observedHead).toBe('a9105528ce64b18b419cc0f9a91197cbbc4cad18');
  });

  it('keeps the stale-publication diagnosis reconstructable as historical evidence', () => {
    expect(registry.admission.systemBirthCount).toBe(28);
    expect(registry.birthProfile.summary).toBe(constitution.discovery.genericBirthSummary);
    expect(registry.birthProfile.thesis).toBeNull();
    expect(routes.admission.targetRecordCount).toBe(5);
    expect(routes.deferred.bornSystemsWithoutRouteCount).toBe(23);
    expect(surfaces.currentState.systemsPerLanguage).toBe(3);
    expect(constitution.discovery).toMatchObject({
      acceptedPreviewWasStructurallyCoherent: true,
      acceptedPreviewWasCurrentPublicationCorrect: false,
      bornSystemCount: 28,
      routedSystemCount: 5,
      bornSystemsWithoutRouteCount: 23,
      systemsPerLanguageOnAcceptedSurface: 3,
    });
  });

  it('preserves all 28 System identities without repository-derived Birth', () => {
    expect(identity.status).toBe('reconciled');
    expect(identity.records).toHaveLength(28);
    expect(registry.assignments).toHaveLength(28);
    expect(new Set(identity.records.map((entry) => entry.recordId)).size).toBe(28);
    expect(identity.records.map((entry) => entry.recordId).sort()).toEqual(registry.assignments.map((entry) => entry.recordId).sort());
    expect(identity.records.every((entry) => entry.newRecordRequired === false)).toBe(true);
    expect(identity.currentState).toMatchObject({
      existingBirthRecordCount: 28,
      reconciledRecordCount: 28,
      preservedRecordIdCount: 28,
      recordIdChangeCount: 0,
      newRecordBirthCount: 0,
      productionMutationCount: 0,
    });
    expect(identity.unresolvedButNonBlockingIdentityRelations).toEqual([
      'XS Wallet / Domini canonical public name',
      'ORDM internal PoC/testnet exact continuity',
      'SNE Vault material migration relationship to SNE-OS',
      'SNE Observatorio relationship to SNE Radar',
    ]);
  });

  it('treats every earlier completion seal as monotonic history rather than global NEXT authority', () => {
    expect(a21.status).toBe('complete');
    expect(a21.acceptance).toMatchObject({ r1_a2_1Complete: true, nextRequiredCut: 'R1-A2.2 — Existing Identity Reconciliation' });
    expect(a22.status).toBe('complete');
    expect(a22.acceptance).toMatchObject({ r1_a2_2Complete: true, nextRequiredCut: 'R1-A2.3 — Current Revision Materialization' });
    expect(a23.status).toBe('complete');
    expect(a23.acceptance).toMatchObject({ r1_a2_3Complete: true, nextRequiredCut: 'R1-A2.4 — Evidence + Maturity Reconciliation' });
    expect(a24.status).toBe('complete');
    expect(a24.acceptance).toMatchObject({ r1_a2_4Complete: true, nextRequiredCut: 'R1-A2.5 — Public Disclosure Reauthorization' });
    expect(a25.status).toBe('complete');
    expect(a25.acceptance).toMatchObject({ r1_a2_5Complete: true, nextRequiredCut: 'R1-A2.6 — Current Route Admission' });
    expect(a26.status).toBe('complete');
    expect(a26.acceptance).toMatchObject({ r1_a2_6Complete: true, nextRequiredCut: 'R1-A2.7 — Current Editorial Surface Reconstruction' });
  });

  it('advances the current constitution through A2.6 while leaving publication validity closed', () => {
    expect(constitution.currentState).toMatchObject({
      currentCorpusCensusComplete: true,
      currentRepositoryCount: 54,
      identityReconciliationComplete: true,
      reconciledSystemRecordCount: 28,
      currentRevisionMaterializationComplete: true,
      evidenceMaturityReconciliationComplete: true,
      currentEvidenceObservationCount: 48,
      currentMaturityClassifiedCount: 8,
      currentMaturityUnclassifiedCount: 19,
      maturityIdentityReplacementCount: 0,
      currentDisclosureReauthorizationComplete: true,
      currentDisclosureClassifiedCount: 27,
      currentPublicRecordCount: 27,
      currentPrivateRecordCount: 0,
      currentDisclosureConflictCount: 0,
      currentDisclosureUnclassifiedCount: 0,
      currentDisclosureGovernanceBirthCount: 23,
      currentDisclosureGovernanceSuccessorCount: 4,
      disclosureIdentityReplacementCount: 0,
      currentRouteAdmissionComplete: true,
      currentRoutedSystemCount: 27,
      currentUnroutedSystemCount: 0,
      currentRouteLanguagePairCount: 54,
      currentLanguageBindingCount: 54,
      currentEnglishRouteCount: 27,
      currentPortugueseRouteCount: 27,
      newRouteBindingCount: 46,
      preservedHistoricalRouteBindingCount: 10,
      deferredHistoricalRouteBindingCount: 2,
      historicalPathDropCount: 0,
      historicalPathReassignmentCount: 0,
      historicalAdmissionBasisRewriteCount: 0,
      currentPublicationValid: false,
      cutoverReady: false,
      productionMutationCount: 0,
    });
    expect(constitution.acceptance).toMatchObject({
      r1_a2_1Complete: true,
      r1_a2_2Complete: true,
      r1_a2_3Complete: true,
      r1_a2_4Complete: true,
      r1_a2_5Complete: true,
      r1_a2_6Complete: true,
      r1_a2Complete: false,
      currentPublicationValid: false,
      cutoverReady: false,
      cutoverAuthorized: false,
      nextRequiredCut: 'R1-A2.7 — Current Editorial Surface Reconstruction',
    });
    expect(constitution.laws).toMatchObject({
      existingRecordIdentityMustBePreserved: true,
      currentChangeProducesRevisionByDefault: true,
      repositoryIdentityIsSystemIdentity: false,
      repositoryMutationMayMintSystemAutomatically: false,
      temporalRepositoryHeadBindingRequired: true,
      groundingImpliesDisclosure: false,
      birthImpliesRoute: false,
      historicalMigrationPlanIsPerpetualPublicAuthority: false,
      genericBirthSummaryAllowedAsCurrentPublicSummary: false,
      privateEvidencePublicByDefault: false,
      existingGovernanceIdentityMustBePreserved: true,
      historicalRouteIdentityMustBePreserved: true,
      currentPublicationValidityGatesCutover: true,
    });
    expect(r1A2Doc).toContain('R1_A2_6_COMPLETE=true');
    expect(r1A2Doc).toContain('NEXT=R1-A2.7 — Current Editorial Surface Reconstruction');
  });
});
