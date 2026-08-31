import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

interface ReconciliationConstitution {
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
  laws: {
    existingRecordIdentityMustBePreserved: boolean;
    currentChangeProducesRevisionByDefault: boolean;
    repositoryIdentityIsSystemIdentity: boolean;
    repositoryMutationMayMintSystemAutomatically: boolean;
    temporalRepositoryHeadBindingRequired: boolean;
    groundingImpliesDisclosure: boolean;
    birthImpliesRoute: boolean;
    historicalMigrationPlanIsPerpetualPublicAuthority: boolean;
    genericBirthSummaryAllowedAsCurrentPublicSummary: boolean;
    privateEvidencePublicByDefault: boolean;
    currentPublicationValidityGatesCutover: boolean;
  };
  currentState: {
    currentCorpusCensusComplete: boolean;
    currentRepositoryCount: number;
    materialHeadCount: number;
    emptyRepositoryCount: number;
    identityReconciliationComplete: boolean;
    currentPublicationValid: boolean;
    cutoverReady: boolean;
    cutoverAuthorized: boolean;
    cutoverEnacted: boolean;
    productionMutationCount: number;
  };
  acceptance: {
    r1_a2_0Materialized: boolean;
    r1_a2_1Complete: boolean;
    r1_a2Complete: boolean;
    currentPublicationValid: boolean;
    cutoverReady: boolean;
    cutoverAuthorized: boolean;
    nextRequiredCut: string;
  };
}

interface CensusRepository {
  repo: string;
  visibility: 'public' | 'private';
  defaultBranch: string;
  observedHead: string | null;
  state: 'material' | 'empty';
}

interface CurrentCensus {
  observedAt: string;
  observationMode: string;
  sourceInstallations: Array<{ installationId: number; account: string; repositoryCount: number }>;
  comparisonToR1Pre: {
    previousRepositoryCount: number;
    currentRepositoryCount: number;
    repositoryInventoryDrift: boolean;
    previousCensusHadCurrentHeadBinding: boolean;
  };
  scope: {
    repositoryCount: number;
    materialHeadCount: number;
    emptyRepositoryCount: number;
    owners: Record<string, number>;
    completeForObservedInstallation: boolean;
    claimOfGlobalGitHubCompleteness: boolean;
  };
  repositories: CensusRepository[];
  acceptance: {
    currentCorpusCensusComplete: boolean;
    r1_a2_1Complete: boolean;
    identityReconciliationPerformed: boolean;
    recordRevisionPerformed: boolean;
    publicDisclosureChanged: boolean;
    routeRuntimeChanged: boolean;
    publicSurfaceChanged: boolean;
    nextRequiredCut: string;
  };
}

interface RegistryManifest {
  birthProfile: { summary: string; thesis: string | null };
  admission: { systemBirthCount: number };
}

interface RouteManifest {
  admission: { targetRecordCount: number };
  deferred: { bornSystemsWithoutRouteCount: number };
}

interface SurfaceManifest {
  currentState: { systemsPerLanguage: number };
}

interface R27Completion {
  status: string;
  acceptance: {
    r2_7Complete: boolean;
    cutoverReady: boolean;
    cutoverAuthorized: boolean;
    cutoverEnacted: boolean;
  };
}

interface R1A21Completion {
  status: string;
  observation: {
    repositoryCount: number;
    materialHeadCount: number;
    emptyRepositoryCount: number;
    emptyRepositories: string[];
    repositorySizeUsedAsHeadAuthority: boolean;
  };
  productionBoundary: { productionMutationCount: number };
  acceptance: {
    r1_a2_1Complete: boolean;
    currentPublicationValid: boolean;
    cutoverReady: boolean;
    nextRequiredCut: string;
  };
}

function readRepoFile(path: string): string {
  return readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
}

function readJson<T>(path: string): T {
  return JSON.parse(readRepoFile(path)) as T;
}

const constitution = readJson<ReconciliationConstitution>('docs/editorial/R1-A2-reconciliation-constitution.v0.json');
const census = readJson<CurrentCensus>('docs/editorial/R1-A2.1-current-github-census.v0.json');
const completion = readJson<R1A21Completion>('docs/editorial/R1-A2.1-completion.v0.json');
const registry = readJson<RegistryManifest>('docs/editorial/record-registry.v0.json');
const routes = readJson<RouteManifest>('docs/editorial/route-runtime.v0.json');
const surfaces = readJson<SurfaceManifest>('docs/editorial/core-editorial-surfaces.v0.json');
const r27 = readJson<R27Completion>('docs/editorial/R2.7-completion.v0.json');
const r1A2Doc = readRepoFile('docs/editorial/R1-A2-current-corpus-reconciliation.md');
const r2Readme = readRepoFile('docs/editorial/R2-README.md');

describe('R1-A2 current corpus reconciliation', () => {
  it('reopens publication validity without rewriting historical R1/R2 evidence', () => {
    expect(constitution.baseline).toBe('1ad9128328ed702d0c160be5acca5a4874674d25');
    expect(constitution.historicalState).toMatchObject({
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
    expect(constitution.currentState.currentPublicationValid).toBe(false);
    expect(constitution.currentState.cutoverReady).toBe(false);
    expect(constitution.currentState.cutoverAuthorized).toBe(false);
    expect(r2Readme).toContain('CURRENT_PUBLICATION_VALID=false');
    expect(r2Readme).toContain('CUTOVER_READY=false');
  });

  it('freezes the exact connected installation census and every default branch ref or explicit empty state', () => {
    expect(census.observationMode).toBe('connected-github-installation-default-branch-ref');
    expect(census.sourceInstallations).toEqual([
      { installationId: 153974730, account: '4LFR3Dv1', repositoryCount: 39 },
      { installationId: 153840788, account: 'SNE-Labs', repositoryCount: 15 },
    ]);
    expect(census.scope).toMatchObject({
      repositoryCount: 54,
      materialHeadCount: 52,
      emptyRepositoryCount: 2,
      owners: { '4LFR3Dv1': 39, 'SNE-Labs': 15 },
      completeForObservedInstallation: true,
      claimOfGlobalGitHubCompleteness: false,
    });
    expect(census.repositories).toHaveLength(54);
    expect(new Set(census.repositories.map((entry) => entry.repo)).size).toBe(54);
    expect(census.repositories.filter((entry) => entry.state === 'material')).toHaveLength(52);
    expect(census.repositories.filter((entry) => entry.state === 'empty')).toHaveLength(2);
    expect(census.repositories.every((entry) => entry.defaultBranch.length > 0)).toBe(true);
    expect(census.repositories
      .filter((entry) => entry.state === 'material')
      .every((entry) => /^[0-9a-f]{40}$/.test(entry.observedHead ?? ''))).toBe(true);
    expect(census.repositories
      .filter((entry) => entry.state === 'empty')
      .every((entry) => entry.observedHead === null)).toBe(true);
  });

  it('pins the current frontier realization heads instead of relying on the August 30 census', () => {
    const byRepo = new Map(census.repositories.map((entry) => [entry.repo, entry]));
    expect(byRepo.get('4LFR3Dv1/Genesis')?.observedHead).toBe('ffbba53257a0b8e9c147977cc63aa05bacd1161b');
    expect(byRepo.get('4LFR3Dv1/BrineOS')?.observedHead).toBe('54be6e6512c47fc0e99e85a850bd0b44f9dc54c5');
    expect(byRepo.get('4LFR3Dv1/wer-esk')?.observedHead).toBe('30989ea6c990888ccf4ebb290614633cc7d2f415');
    expect(byRepo.get('4LFR3Dv1/lisa-runtime')?.observedHead).toBe('7afaf95edad66531298195320439d4d7cd1fa37e');
    expect(byRepo.get('4LFR3Dv1/lisa-app')?.observedHead).toBe('edf671a5323eb23cad26f3e2ae869311f5dd5e44');
    expect(byRepo.get('SNE-Labs/SNE-FDE')?.observedHead).toBe('a9105528ce64b18b419cc0f9a91197cbbc4cad18');
    expect(byRepo.get('SNE-Labs/AgentHub')?.observedHead).toBe('70eb7d6f2a491c45f9e9a84eec10433fcfddf5d8');
    expect(byRepo.get('4LFR3Dv1/GitHub-Flow')?.observedHead).toBe('47ab582c8960525300cf348f50a8cdc5c48eed73');
  });

  it('makes the stale publication diagnosis executable rather than editorial opinion', () => {
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

  it('closes only census observation and keeps every semantic/publication mutation ahead', () => {
    expect(completion.status).toBe('complete');
    expect(completion.observation).toMatchObject({
      repositoryCount: 54,
      materialHeadCount: 52,
      emptyRepositoryCount: 2,
      emptyRepositories: ['4LFR3Dv1/SNE-RADAR-v1.0', '4LFR3Dv1/factory-control'],
      repositorySizeUsedAsHeadAuthority: false,
    });
    expect(completion.productionBoundary.productionMutationCount).toBe(0);
    expect(census.acceptance).toMatchObject({
      currentCorpusCensusComplete: true,
      r1_a2_1Complete: true,
      identityReconciliationPerformed: false,
      recordRevisionPerformed: false,
      publicDisclosureChanged: false,
      routeRuntimeChanged: false,
      publicSurfaceChanged: false,
      nextRequiredCut: 'R1-A2.2 — Existing Identity Reconciliation',
    });
    expect(completion.acceptance).toMatchObject({
      r1_a2_1Complete: true,
      currentPublicationValid: false,
      cutoverReady: false,
      nextRequiredCut: 'R1-A2.2 — Existing Identity Reconciliation',
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
      currentPublicationValidityGatesCutover: true,
    });
    expect(r1A2Doc).toContain('R1_A2_1_COMPLETE=true');
  });
});
