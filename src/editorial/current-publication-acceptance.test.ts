import { describe, expect, it } from 'vitest';
import currentPublicationAcceptanceJson from '../../docs/editorial/R1-A2.8-current-publication-acceptance.v0.json';
import {
  evaluateCurrentPublicationAcceptance,
  type CurrentPublicationAcceptanceManifest,
} from './current-publication-acceptance';

const manifest = currentPublicationAcceptanceJson as CurrentPublicationAcceptanceManifest;

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
  });

  it('produces a deterministic publication digest over the exact current semantic specimen', () => {
    const first = evaluateCurrentPublicationAcceptance();
    const second = evaluateCurrentPublicationAcceptance();
    expect(first.publicationDigest).toMatch(/^sha256_[0-9a-f]{64}$/);
    expect(second.publicationDigest).toBe(first.publicationDigest);
    expect(manifest.specimen).toMatchObject({
      canonicalization: 'recursive-key-sorted-json-with-array-order-preserved',
      digestAlgorithm: 'sha256',
      acceptedPublicationDigest: null,
    });
    process.stdout.write(`A2.8_CURRENT_PUBLICATION_DIGEST=${first.publicationDigest}\n`);
  });

  it('keeps semantic acceptance separate from physical emission and cutover authority', () => {
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
      r1_a2_8Complete: false,
      r1_a2Complete: false,
      currentPublicationValid: false,
      cutoverReady: false,
      cutoverAuthorized: false,
      cutoverEnacted: false,
    });
    expect(manifest.acceptance.nextRequiredAction).toContain('CI must reconstruct');
  });
});
