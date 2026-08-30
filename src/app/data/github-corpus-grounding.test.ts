import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

type RepoEntry = {
  repo: string;
  visibility: 'public' | 'private';
  defaultBranch: string;
  grounding: string;
};

type IdentityCluster = {
  id: string;
  label: string;
  repositories: string[];
  disposition: string;
  candidateKind: string | null;
  confidence: 'high' | 'medium' | 'low';
  birthEligible: boolean;
};

type CorpusCensus = {
  schemaVersion: string;
  status: string;
  normative: boolean;
  groundingWave: number;
  portfolioBaseline: string;
  scope: {
    repositoryCount: number;
    owners: Record<string, number>;
    completeForObservedInstallation: boolean;
    claimOfGlobalGitHubCompleteness: boolean;
  };
  laws: {
    repositoryIsSystem: boolean;
    repositoryIsRecord: boolean;
    r0_8LegacyInventoryIsFullCorpus: boolean;
    birthAllowedFromCensusAlone: boolean;
    crossRepositoryCanonicalityRequired: boolean;
    thirdPartySourceIsUserSystem: boolean;
    generatedDemoIsGeneratorIdentity: boolean;
    privateWorkspaceIsPubliclyAdmissibleByDefault: boolean;
  };
  repositories: RepoEntry[];
  identityClusters: IdentityCluster[];
  acceptance: {
    repositoryCensusComplete: boolean;
    repositoryCount: number;
    ownerCountMatches: boolean;
    repositoryGroundingDispositionComplete: boolean;
    secondWaveClustersGrounded: boolean;
    crossRepositoryCanonicalityComplete: boolean;
    recordBirthPerformed: boolean;
    r1RuntimeStarted: boolean;
  };
};

function readRepoFile(path: string): string {
  return readFileSync(new URL(`../../../${path}`, import.meta.url), 'utf8');
}

const census = JSON.parse(
  readRepoFile('docs/editorial/github-corpus-census.v0.json'),
) as CorpusCensus;

const repositoryNames = census.repositories.map((entry) => entry.repo);
const clustersById = new Map(census.identityClusters.map((cluster) => [cluster.id, cluster]));

describe('R1-PRE GitHub Corpus Grounding', () => {
  it('starts after frozen R0 without claiming Record Birth or R1 runtime work', () => {
    expect(census.portfolioBaseline).toBe('ed586439e7809f60c56d7ee057db9655f7404105');
    expect(census.status).toBe('in-progress');
    expect(census.normative).toBe(false);
    expect(census.groundingWave).toBe(2);
    expect(census.acceptance.recordBirthPerformed).toBe(false);
    expect(census.acceptance.r1RuntimeStarted).toBe(false);
  });

  it('freezes all 54 repositories returned by the observed connected installation exactly once', () => {
    expect(census.scope.repositoryCount).toBe(54);
    expect(census.repositories).toHaveLength(54);
    expect(new Set(repositoryNames).size).toBe(54);
    expect(census.scope.owners).toEqual({ '4LFR3Dv1': 39, 'SNE-Labs': 15 });
    expect(census.repositories.filter((entry) => entry.repo.startsWith('4LFR3Dv1/'))).toHaveLength(39);
    expect(census.repositories.filter((entry) => entry.repo.startsWith('SNE-Labs/'))).toHaveLength(15);
    expect(census.scope.completeForObservedInstallation).toBe(true);
    expect(census.scope.claimOfGlobalGitHubCompleteness).toBe(false);
    expect(census.acceptance.repositoryGroundingDispositionComplete).toBe(true);
    expect(census.repositories.every((entry) => entry.grounding.length > 0)).toBe(true);
  });

  it('forbids repository, third-party and generated-demo shortcuts from minting user Systems', () => {
    expect(census.laws.repositoryIsSystem).toBe(false);
    expect(census.laws.repositoryIsRecord).toBe(false);
    expect(census.laws.r0_8LegacyInventoryIsFullCorpus).toBe(false);
    expect(census.laws.birthAllowedFromCensusAlone).toBe(false);
    expect(census.laws.crossRepositoryCanonicalityRequired).toBe(true);
    expect(census.laws.thirdPartySourceIsUserSystem).toBe(false);
    expect(census.laws.generatedDemoIsGeneratorIdentity).toBe(false);
    expect(census.laws.privateWorkspaceIsPubliclyAdmissibleByDefault).toBe(false);
  });

  it('keeps Lisa as one candidate System across its three explicit repository realizations', () => {
    expect(clustersById.get('GCG-004')).toMatchObject({
      label: 'Lisa',
      repositories: ['4LFR3Dv1/lisa-web', '4LFR3Dv1/lisa-app', '4LFR3Dv1/lisa-runtime'],
      disposition: 'single-system-multi-repository-realization',
      candidateKind: 'knowledge.system',
      confidence: 'high',
      birthEligible: false,
    });
  });

  it('keeps Personal Identity Runtime separate until an explicit Lisa lineage is proved', () => {
    expect(clustersById.get('GCG-005')).toMatchObject({
      label: 'Personal Identity Runtime',
      disposition: 'independent-system-candidate-relation-to-lisa-unresolved',
      birthEligible: false,
    });
  });

  it('corrects the first-wave Factory/Brine conflation', () => {
    expect(clustersById.get('GCG-006')).toMatchObject({
      label: 'Factory',
      repositories: ['4LFR3Dv1/brine-factory'],
      disposition: 'independent-external-production-infrastructure-system',
    });
    expect(clustersById.get('GCG-020')).toMatchObject({
      label: 'Brine',
      repositories: ['4LFR3Dv1/BrineT'],
      disposition: 'independent-local-first-agent-runtime-candidate',
    });
  });

  it('distinguishes Foundry runtime from its presentation repository', () => {
    expect(clustersById.get('GCG-007')).toMatchObject({
      label: 'Foundry',
      repositories: ['SNE-Labs/Foundry', '4LFR3Dv1/FoundryLandingPage'],
      disposition: 'system-with-separate-public-presentation-surface',
    });
  });

  it('distinguishes current SNE-FDE authority from historical Public-Surface research', () => {
    expect(clustersById.get('GCG-012')).toMatchObject({
      repositories: ['SNE-Labs/SNE-FDE', 'SNE-Labs/Public-Surface'],
      disposition: 'current-authority-with-historical-presentation-predecessor',
      confidence: 'high',
      birthEligible: false,
    });
  });

  it('keeps Foundry Pay, Foundry Channels and Solana-Agent as separate authority-bearing candidates', () => {
    expect(clustersById.get('GCG-009')?.label).toBe('Foundry Pay');
    expect(clustersById.get('GCG-010')?.label).toBe('Foundry Channels');
    expect(clustersById.get('GCG-011')?.label).toBe('Solana-Agent');
    expect(new Set([
      clustersById.get('GCG-009')?.repositories[0],
      clustersById.get('GCG-010')?.repositories[0],
      clustersById.get('GCG-011')?.repositories[0],
    ]).size).toBe(3);
  });

  it('reconstructs one SNE Radar repository lineage without collapsing SNE-OS into it', () => {
    expect(clustersById.get('GCG-016')).toMatchObject({
      label: 'SNE Radar',
      disposition: 'one-radar-lineage-with-primary-backup-generations-distribution-and-snapshot',
      confidence: 'high',
      birthEligible: false,
    });
    expect(clustersById.get('GCG-016')?.repositories).toContain('SNE-Labs/SNE-Radar');
    expect(clustersById.get('GCG-016')?.repositories).toContain('SNE-Labs/ADMIN-API');
    expect(clustersById.get('GCG-016')?.repositories).not.toContain('SNE-Labs/SNE-OS');
    expect(clustersById.get('GCG-015')?.label).toBe('SNE-OS');
  });

  it('preserves SNE Vault as historical identity material rather than silently equating it to SNE-OS', () => {
    expect(clustersById.get('GCG-023')).toMatchObject({
      label: 'SNE Vault / earlier SNE web3 hub',
      disposition: 'historical-system-surface-with-explicit-material-migration-into-sne-os-identity-continuity-unresolved',
      confidence: 'medium',
      birthEligible: false,
    });
  });

  it('recognizes SNE Trading as an independent tribunal/execution plane rather than a Radar repository', () => {
    expect(clustersById.get('GCG-021')).toMatchObject({
      label: 'SNE Trading',
      repositories: ['4LFR3Dv1/SNE-Trading'],
      disposition: 'independent-research-replay-risk-and-execution-system',
      candidateKind: 'knowledge.system',
      confidence: 'high',
    });
  });

  it('preserves XS Wallet as a candidate while canonical product naming remains unresolved', () => {
    expect(clustersById.get('GCG-018')).toMatchObject({
      label: 'XS Wallet / Domini',
      disposition: 'system-candidate-canonical-name-unresolved',
      confidence: 'high',
      birthEligible: false,
    });
  });

  it('does not promote proposals, blueprints, third-party source or generated demos into Systems', () => {
    for (const id of ['GCG-028', 'GCG-029', 'GCG-030', 'GCG-031', 'GCG-032', 'GCG-036']) {
      expect(clustersById.get(id)?.candidateKind).toBeNull();
      expect(clustersById.get(id)?.birthEligible).toBe(false);
    }
  });

  it('keeps private Alfred and Dominipay workspaces outside public admission by default', () => {
    expect(clustersById.get('GCG-033')?.candidateKind).toBeNull();
    expect(clustersById.get('GCG-034')?.candidateKind).toBeNull();
    expect(clustersById.get('GCG-033')?.disposition).toContain('public-admission-and-ownership-boundary-unresolved');
    expect(clustersById.get('GCG-034')?.disposition).toContain('public-admission-and-ownership-boundary-unresolved');
  });

  it('keeps every current cluster pre-Birth until remaining canonicality questions close', () => {
    expect(census.identityClusters.length).toBeGreaterThanOrEqual(36);
    expect(census.identityClusters.every((cluster) => cluster.birthEligible === false)).toBe(true);
    expect(census.acceptance.secondWaveClustersGrounded).toBe(true);
    expect(census.acceptance.crossRepositoryCanonicalityComplete).toBe(false);
  });
});
