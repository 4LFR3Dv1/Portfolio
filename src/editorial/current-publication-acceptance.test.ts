import { describe, expect, it } from 'vitest';
import currentPublicationAcceptanceJson from '../../docs/editorial/R1-A2.8-current-publication-acceptance.v0.json';
import currentPublicationCompletionJson from '../../docs/editorial/R1-A2.8-completion.v0.json';
import {
  evaluateCurrentPublicationAcceptance,
  type CurrentPublicationAcceptanceManifest,
} from './current-publication-acceptance';

const manifest = currentPublicationAcceptanceJson as CurrentPublicationAcceptanceManifest;
const completion = currentPublicationCompletionJson as {
  status: string;
  candidateWitness: Record<string, string | number>;
  specimen: Record<string, string>;
  acceptedZeroes: Record<string, number>;
  productionBoundary: Record<string, string | number | boolean>;
  acceptance: Record<string, string | number | boolean>;
};
const acceptedDigest = 'sha256_f72c807283aa0f2da0a20b3ecaf1ec5f99227fedac47aa9fb988f5c924997d32';

describe('R1-A2.8 current publication acceptance', () => {
  it('reconstructs A2.1-A2.7 as one coherent current publication specimen', () => {
    const result = evaluateCurrentPublicationAcceptance();
    expect(result.errors).toEqual([]);
    expect(result.state).toBe('ready');
    expect(result.publicationValidCandidate).toBe(true);
    expect(result.snapshot).toMatchObject({
      completionSealCount: 7,
      allPriorCutsSealed: true,
      bornSystemRecordCount: 28,
      currentSuccessorSystemCount: 27,
      deferredCurrentSystemCount: 1,
      evidenceObservationCount: 48,
      maturityClassifiedCount: 8,
      maturityUnclassifiedCount: 19,
      disclosureClassifiedCount: 27,
      publicFullDisclosureCount: 27,
      currentRouteLanguagePairCount: 54,
      currentLanguageBindingCount: 54,
      totalRouteBindingCount: 56,
      publicProjectionCount: 54,
      semanticDocumentCount: 54,
      coreSurfaceCount: 12,
      systemsPerLanguage: 27,
      researchPerLanguage: 5,
      homeSystemsPerLanguage: 7,
      homeResearchPerLanguage: 5,
    });
  });

  it('proves every acceptance zero instead of inferring validity from completion flags', () => {
    const result = evaluateCurrentPublicationAcceptance();
    expect(result.snapshot).toMatchObject({
      recordIdentityReplacementCount: 0,
      maturityIdentityReplacementCount: 0,
      disclosureIdentityReplacementCount: 0,
      historicalPathDropCount: 0,
      historicalPathReassignmentCount: 0,
      historicalAdmissionBasisRewriteCount: 0,
      currentProjectionOmissionCount: 0,
      currentDocumentOmissionCount: 0,
      genericBirthSummaryEmissionCount: 0,
      crossLanguageIdentityDriftCount: 0,
      deferredCurrentSystemExposureCount: 0,
      privateSourceLocatorLeakCount: 0,
      privateEvidenceLocatorLeakCount: 0,
      rankingInferenceCount: 0,
      archiveInferenceCount: 0,
      productionMutationCount: 0,
    });
    expect(manifest.requiredZeroes).toEqual({
      recordIdentityReplacementCount: 0,
      maturityIdentityReplacementCount: 0,
      disclosureIdentityReplacementCount: 0,
      historicalPathDropCount: 0,
      historicalPathReassignmentCount: 0,
      historicalAdmissionBasisRewriteCount: 0,
      currentProjectionOmissionCount: 0,
      currentDocumentOmissionCount: 0,
      genericBirthSummaryEmissionCount: 0,
      crossLanguageIdentityDriftCount: 0,
      deferredCurrentSystemExposureCount: 0,
      privateSourceLocatorLeakCount: 0,
      privateEvidenceLocatorLeakCount: 0,
      rankingInferenceCount: 0,
      archiveInferenceCount: 0,
      productionMutationCount: 0,
    });
    expect(completion.acceptedZeroes).toEqual(manifest.requiredZeroes);
  });

  it('freezes the deterministic publication digest as the identity of the accepted current specimen', () => {
    const first = evaluateCurrentPublicationAcceptance();
    const second = evaluateCurrentPublicationAcceptance();
    expect(first.publicationDigest).toBe(acceptedDigest);
    expect(second.publicationDigest).toBe(first.publicationDigest);
    expect(manifest.status).toBe('complete');
    expect(manifest.specimen).toEqual({
      canonicalization: 'recursive-key-sorted-json-with-array-order-preserved',
      digestAlgorithm: 'sha256',
      acceptedPublicationDigest: acceptedDigest,
    });
    expect(completion.specimen).toMatchObject({
      publicationDigest: acceptedDigest,
      canonicalization: 'recursive-key-sorted-json-with-array-order-preserved',
      digestAlgorithm: 'sha256',
    });
  });

  it('closes R1-A2 semantically while keeping physical emission and cutover authority separate', () => {
    const result = evaluateCurrentPublicationAcceptance();
    expect(result.publicationValidCandidate).toBe(true);
    expect(manifest.boundary).toEqual({
      currentPublicationAcceptanceOnly: true,
      semanticRepairAllowed: false,
      newRecordBirthAllowed: false,
      governanceMutationAllowed: false,
      routeMutationAllowed: false,
      surfaceSelectionMutationAllowed: false,
      distributionEmissionIncluded: false,
      deploymentMutationAllowed: false,
      cutoverReadinessIncluded: false,
      cutoverAuthorizationIncluded: false,
    });
    expect(manifest.acceptance).toMatchObject({
      allPriorCutsSealed: true,
      endToEndReconstructionRequired: true,
      currentPublicationSpecimenDeterministic: true,
      publicationValidCandidate: true,
      r1_a2_8Complete: true,
      r1_a2Complete: true,
      currentPublicationValid: true,
      cutoverReady: false,
      cutoverAuthorized: false,
      cutoverEnacted: false,
      nextRequiredAction: 'R2-A1 — Current Publication Re-emission & Physical Revalidation',
    });
    expect(completion.status).toBe('complete');
    expect(completion.candidateWitness).toMatchObject({
      branchHead: '38267dea5d9b4bde33a787ef93dbc3ecdf9059df',
      verifyRunNumber: 335,
      verifyConclusion: 'success',
      editorialShellBuildRunNumber: 170,
      editorialShellBuildConclusion: 'success',
      cutoverReadinessRunNumber: 101,
      cutoverReadinessConclusion: 'success',
      testFileCount: 64,
      testCount: 424,
    });
    expect(completion.productionBoundary).toMatchObject({
      distributionReemitted: false,
      publicationShellRebuiltFromAcceptedDigest: false,
      staticRuntimeRecommissioned: false,
      previewRedeployed: false,
      productionDnsChanged: false,
      railwayTargetChanged: false,
      vercelConfigurationChanged: false,
      publicRuntimeChanged: false,
      productionMutationCount: 0,
    });
    expect(completion.acceptance).toMatchObject({
      r1_a2_8Complete: true,
      r1_a2Complete: true,
      currentPublicationValid: true,
      acceptedPublicationDigestFrozen: true,
      historicalR2_6WitnessReusedForCurrentSpecimen: false,
      historicalR2_7ReadinessReusedForCurrentSpecimen: false,
      cutoverReady: false,
      cutoverAuthorized: false,
      cutoverEnacted: false,
      nextRequiredProgram: 'R2-A1 — Current Publication Re-emission & Physical Revalidation',
    });
  });
});
