import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import reemissionConstitutionJson from '../../docs/editorial/R2-A1-reemission-constitution.v0.json';
import semanticCompletionJson from '../../docs/editorial/R1-A2.8-completion.v0.json';
import historicalPreviewCompletionJson from '../../docs/editorial/R2.6-completion.v0.json';

const ACCEPTED_DIGEST = 'sha256_f72c807283aa0f2da0a20b3ecaf1ec5f99227fedac47aa9fb988f5c924997d32';

const constitution = reemissionConstitutionJson as {
  status: string;
  baseline: string;
  preconditions: Record<string, boolean | string>;
  laws: Record<string, boolean>;
  program: Array<{ cut: string; purpose: string; status: string }>;
  historicalWitnessBoundary: Record<string, boolean>;
  productionBoundary: {
    productionOrigin: string;
    productionOriginMayBeContactedForReadOnlyObservation: boolean;
    productionOriginMayBeMutated: boolean;
    rootVercelConfigBlobSha: string;
    rootVercelConfigChanged: boolean;
    productionMutationCount: number;
  };
  currentState: Record<string, boolean | number>;
  acceptance: Record<string, boolean | string>;
};
const semanticCompletion = semanticCompletionJson as {
  status: string;
  normative: boolean;
  specimen: { publicationDigest: string };
  productionBoundary: Record<string, boolean | number>;
  acceptance: Record<string, boolean | string>;
};
const historicalPreviewCompletion = historicalPreviewCompletionJson as {
  status: string;
  acceptedPreviewSpecimen: { commit: string; deploymentId: string; origin: string };
  comparison: { canonicalCount: number; semanticDifferenceCount: number };
  acceptance: Record<string, boolean | string | number>;
};
const vercelText = readFileSync(new URL('../../vercel.json', import.meta.url), 'utf8');

describe('R2-A1.0 current publication physical re-emission boundary', () => {
  it('binds the physical program to the exact A2.8 semantic specimen', () => {
    expect(semanticCompletion.status).toBe('complete');
    expect(semanticCompletion.normative).toBe(true);
    expect(semanticCompletion.specimen.publicationDigest).toBe(ACCEPTED_DIGEST);
    expect(semanticCompletion.acceptance).toMatchObject({
      r1_a2_8Complete: true,
      r1_a2Complete: true,
      currentPublicationValid: true,
      acceptedPublicationDigestFrozen: true,
      cutoverReady: false,
      cutoverAuthorized: false,
      cutoverEnacted: false,
    });
    expect(constitution.preconditions).toEqual({
      r1_a2Complete: true,
      r1_a2_8Complete: true,
      currentPublicationValid: true,
      acceptedPublicationDigestFrozen: true,
      acceptedPublicationDigest: ACCEPTED_DIGEST,
    });
  });

  it('preserves historical R2.6 as evidence without allowing it to authorize the new specimen', () => {
    expect(historicalPreviewCompletion.status).toBe('complete');
    expect(historicalPreviewCompletion.acceptance).toMatchObject({
      r2_6Complete: true,
      internetComparisonWitnessed: true,
      semanticDifferenceCount: 0,
    });
    expect(historicalPreviewCompletion.comparison.canonicalCount).toBe(18);
    expect(historicalPreviewCompletion.acceptedPreviewSpecimen.commit).not.toBe(constitution.baseline);
    expect(constitution.historicalWitnessBoundary).toEqual({
      r2_6HistoricalComplete: true,
      r2_7HistoricalComplete: true,
      historicalWitnessesRemainEvidence: true,
      historicalWitnessesBindAcceptedCurrentDigest: false,
      historicalPreviewMayBePromotedWithoutRedeploy: false,
    });
    expect(constitution.laws).toMatchObject({
      historicalRendererInputMayBeUsedAsCurrentAuthority: false,
      historicalDistributionDigestMayBeUsedAsCurrentAuthority: false,
      historicalR2_6WitnessMayAuthorizeCurrentSpecimen: false,
      historicalR2_7WitnessMayAuthorizeCurrentSpecimen: false,
    });
  });

  it('forbids semantic mutation and production enactment inside R2-A1', () => {
    expect(constitution.laws).toMatchObject({
      semanticRepairAllowed: false,
      recordMutationAllowed: false,
      governanceMutationAllowed: false,
      routeMutationAllowed: false,
      surfaceSelectionMutationAllowed: false,
      rendererMayInferMissingCurrentMeaning: false,
      productionDeploymentMutationAllowed: false,
      productionDnsMutationAllowed: false,
      vercelConfigurationMutationAllowed: false,
      incumbentPublicRuntimeMutationAllowed: false,
      cutoverAuthorizationIncluded: false,
      cutoverEnactmentIncluded: false,
    });
    expect(semanticCompletion.productionBoundary).toMatchObject({
      distributionReemitted: false,
      publicationShellRebuiltFromAcceptedDigest: false,
      staticRuntimeRecommissioned: false,
      previewRedeployed: false,
      productionMutationCount: 0,
    });
    expect(constitution.productionBoundary).toEqual({
      productionOrigin: 'https://renan.snelabs.space',
      productionOriginMayBeContactedForReadOnlyObservation: true,
      productionOriginMayBeMutated: false,
      rootVercelConfigBlobSha: '6cbd184abd237d0922e5c4fd3a8d98881d5e99a3',
      rootVercelConfigChanged: false,
      productionMutationCount: 0,
    });
    expect(JSON.parse(vercelText)).toEqual({
      rewrites: [{ source: '/((?!.*\\.).*)', destination: '/index.html' }],
    });
  });

  it('opens only the bounded physical program while leaving cutover closed', () => {
    expect(constitution.status).toBe('materialized-awaiting-ci');
    expect(constitution.program.map((entry) => [entry.cut, entry.status])).toEqual([
      ['R2-A1.0', 'materialized-awaiting-ci'],
      ['R2-A1.1', 'not-started'],
      ['R2-A1.2', 'not-started'],
      ['R2-A1.3', 'not-started'],
      ['R2-A1.4', 'not-started'],
      ['R2-A1.5', 'not-started'],
    ]);
    expect(constitution.currentState).toMatchObject({
      currentSpecimenReemitted: false,
      currentDistributionEmitted: false,
      currentStaticRuntimeRecommissioned: false,
      currentPreviewRedeployed: false,
      currentPreviewExternallyWitnessed: false,
      currentCutoverReadinessReevaluated: false,
      cutoverReady: false,
      cutoverAuthorized: false,
      cutoverEnacted: false,
      productionMutationCount: 0,
    });
    expect(constitution.acceptance).toMatchObject({
      r2_a1_0Complete: false,
      r2_a1Complete: false,
      currentPublicationValid: true,
      currentPhysicalPublicationValid: false,
      cutoverReady: false,
      cutoverAuthorized: false,
      cutoverEnacted: false,
    });
  });
});
