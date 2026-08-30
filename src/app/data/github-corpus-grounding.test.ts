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
  };
  repositories: RepoEntry[];
  identityClusters: IdentityCluster[];
  acceptance: {
    repositoryCensusComplete: boolean;
    repositoryCount: number;
    ownerCountMatches: boolean;
    firstWaveClustersGrounded: boolean;
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
  it('starts after the frozen R0 completion baseline without claiming R1 runtime work', () => {
    expect(census.portfolioBaseline).toBe('ed586439e7809f60c56d7ee057db9655f7404105');
    expect(census.status).toBe('in-progress');
    expect(census.normative).toBe(false);
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
  });

  it('forbids repository identity from silently becoming Record or System identity', () => {
    expect(census.laws.repositoryIsSystem).toBe(false);
    expect(census.laws.repositoryIsRecord).toBe(false);
    expect(census.laws.r0_8LegacyInventoryIsFullCorpus).toBe(false);
    expect(census.laws.birthAllowedFromCensusAlone).toBe(false);
    expect(census.laws.crossRepositoryCanonicalityRequired).toBe(true);
  });

  it('keeps Lisa as one candidate System across three explicit repository realizations', () => {
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

  it('distinguishes current SNE-FDE authority from historical Public-Surface research', () => {
    expect(clustersById.get('GCG-012')).toMatchObject({
      repositories: ['SNE-Labs/SNE-FDE', 'SNE-Labs/Public-Surface'],
      disposition: 'current-authority-with-historical-predecessor',
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

  it('does not pretend the Radar cluster is canonically solved', () => {
    expect(clustersById.get('GCG-016')).toMatchObject({
      label: 'SNE Radar',
      disposition: 'cross-repository-canonicality-unresolved',
      confidence: 'low',
      birthEligible: false,
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

  it('keeps every first-wave cluster pre-Birth until cross-repository canonicality closes', () => {
    expect(census.identityClusters.length).toBeGreaterThanOrEqual(19);
    expect(census.identityClusters.every((cluster) => cluster.birthEligible === false)).toBe(true);
    expect(census.acceptance.firstWaveClustersGrounded).toBe(true);
    expect(census.acceptance.crossRepositoryCanonicalityComplete).toBe(false);
  });
});
