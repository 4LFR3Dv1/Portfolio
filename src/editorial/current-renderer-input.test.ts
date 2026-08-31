import { describe, expect, it } from 'vitest';
import rendererInputManifestJson from '../../docs/editorial/R2-A1.1-current-renderer-input.v0.json';
import rendererInputCompletionJson from '../../docs/editorial/R2-A1.1-completion.v0.json';
import {
  ACCEPTED_CURRENT_PUBLICATION_DIGEST,
  currentRendererInputDigest,
  materializeCurrentRendererInput,
  serializeCurrentRendererInput,
} from './current-renderer-input';

const RENDERER_INPUT_DIGEST = 'sha256_4b2bc45e2127befd4f7be0aaf7b4a2cebe0ad7ab9da7a7fa774414af155d73e6';

const manifest = rendererInputManifestJson as {
  status: string;
  preconditions: Record<string, boolean | string>;
  laws: Record<string, boolean>;
  expectedMaterialization: Record<string, number | string | null>;
  physicalOutput: Record<string, boolean | string>;
  acceptance: Record<string, boolean | number | string>;
};
const completion = rendererInputCompletionJson as {
  status: string;
  sourceIdentity: Record<string, string>;
  candidateWitness: Record<string, string | number>;
  physicalWitness: Record<string, string | number | boolean>;
  productionBoundary: Record<string, boolean | number>;
  acceptance: Record<string, boolean | string>;
};

function surface(id: string, language: 'en' | 'pt-BR') {
  return materializeCurrentRendererInput().surfaces.find((entry) => entry.id === id && entry.language === language);
}

describe('R2-A1.1 current renderer input re-emission', () => {
  it('materializes only the exact A2.8-bound current semantic specimen', () => {
    const input = materializeCurrentRendererInput();
    expect(input.source).toEqual({
      semanticCompletionContractId: 'PORTFOLIO-R1-A2.8-COMPLETION-2026-08-31',
      physicalBoundaryCompletionContractId: 'PORTFOLIO-R2-A1.0-COMPLETION-2026-08-31',
      acceptedPublicationDigest: ACCEPTED_CURRENT_PUBLICATION_DIGEST,
    });
    expect(input.surfaces).toHaveLength(12);
    expect(input.documents).toHaveLength(54);
    expect(input.documents.filter((entry) => entry.language === 'en')).toHaveLength(27);
    expect(input.documents.filter((entry) => entry.language === 'pt-BR')).toHaveLength(27);
    expect(input.documents.every((entry) => entry.content.type === 'knowledge.system')).toBe(true);
    expect(input.documents.every((entry) => entry.disclosure.mode === 'full')).toBe(true);
  });

  it('preserves the exact current surface membership and cross-language identity order', () => {
    const enSystems = surface('systems', 'en')?.sections[0].items ?? [];
    const ptSystems = surface('systems', 'pt-BR')?.sections[0].items ?? [];
    const enResearch = surface('research', 'en')?.sections[0].items ?? [];
    const enHome = surface('home', 'en');

    expect(enSystems).toHaveLength(27);
    expect(ptSystems).toHaveLength(27);
    expect(enSystems.map((entry) => entry.targetRef.recordId)).toEqual(ptSystems.map((entry) => entry.targetRef.recordId));
    expect(enResearch).toHaveLength(5);
    expect(enHome?.sections.find((entry) => entry.id === 'systems')?.items).toHaveLength(7);
    expect(enHome?.sections.find((entry) => entry.id === 'research')?.items).toHaveLength(5);
  });

  it('freezes deterministic physical input bytes without historical renderer/distribution authority', () => {
    const first = materializeCurrentRendererInput();
    const second = materializeCurrentRendererInput();
    const firstDigest = currentRendererInputDigest(first);

    expect(currentRendererInputDigest(second)).toBe(firstDigest);
    expect(firstDigest).toBe(RENDERER_INPUT_DIGEST);
    expect(serializeCurrentRendererInput(second)).toBe(serializeCurrentRendererInput(first));
    expect(manifest.expectedMaterialization.rendererInputDigest).toBe(RENDERER_INPUT_DIGEST);
    expect(manifest.laws).toMatchObject({
      rendererInputConsumesCurrentSemanticSpecimenOnly: true,
      acceptedPublicationDigestMustBeEmbedded: true,
      rendererInputDigestMustBeDeterministic: true,
      historicalRendererInputConsumed: false,
      historicalDistributionConsumed: false,
      semanticMutationAllowed: false,
      rendererInferenceAllowed: false,
      productionMutationAllowed: false,
    });
    expect(completion.sourceIdentity).toMatchObject({
      acceptedPublicationDigest: ACCEPTED_CURRENT_PUBLICATION_DIGEST,
      rendererInputDigest: RENDERER_INPUT_DIGEST,
      generatedByteDigest: 'sha256_43021b2d7007c3452ec7bbc8654fc0b3e9fdc8b9efc15e97f02eb88a627a3c36',
    });
  });

  it('seals A1.1 while distribution, runtime, preview and cutover remain closed', () => {
    expect(manifest.status).toBe('complete');
    expect(manifest.preconditions).toEqual({
      r2_a1_0Complete: true,
      r1_a2Complete: true,
      currentPublicationValid: true,
      acceptedPublicationDigest: ACCEPTED_CURRENT_PUBLICATION_DIGEST,
    });
    expect(manifest.expectedMaterialization).toEqual({
      surfaceCount: 12,
      documentCount: 54,
      englishDocumentCount: 27,
      portugueseDocumentCount: 27,
      systemsPerLanguage: 27,
      researchPerLanguage: 5,
      homeSystemsPerLanguage: 7,
      homeResearchPerLanguage: 5,
      rendererInputDigest: RENDERER_INPUT_DIGEST,
    });
    expect(manifest.physicalOutput).toEqual({
      generatedPath: 'editorial-shell/src/generated/current-publication-state.json',
      witnessPath: 'editorial-shell/r2-a1-1-current-renderer-input-witness.json',
      generatedPathCommitted: false,
      witnessProducedByCi: true,
    });
    expect(manifest.acceptance).toMatchObject({
      r2_a1_1Complete: true,
      currentSpecimenReemitted: true,
      currentDistributionEmitted: false,
      currentPhysicalPublicationValid: false,
      cutoverReady: false,
      cutoverAuthorized: false,
      cutoverEnacted: false,
      nextRequiredAction: 'R2-A1.2 — Current Distribution Emission',
    });
    expect(completion.status).toBe('complete');
    expect(completion.candidateWitness).toMatchObject({
      branchHead: 'c1ada26b0391ec65fde78de9c8e930dd60211499',
      verifyRunNumber: 359,
      verifyConclusion: 'success',
      editorialShellBuildRunNumber: 194,
      editorialShellBuildConclusion: 'success',
      cutoverReadinessRunNumber: 125,
      cutoverReadinessConclusion: 'success',
    });
    expect(completion.physicalWitness).toMatchObject({
      surfaceCount: 12,
      documentCount: 54,
      artifactId: 9772638124,
      artifactZipSha256: '9ae2f952c4d2d45a874b5ae92946baccb5866be61252c6013153e42af89c9211',
    });
    expect(completion.productionBoundary).toMatchObject({
      distributionSwitchedToCurrentInput: false,
      staticRuntimeRecommissionedForCurrentInput: false,
      previewRedeployedForCurrentInput: false,
      productionMutationCount: 0,
    });
  });
});
