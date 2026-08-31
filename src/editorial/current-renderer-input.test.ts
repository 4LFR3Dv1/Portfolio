import { describe, expect, it } from 'vitest';
import rendererInputManifestJson from '../../docs/editorial/R2-A1.1-current-renderer-input.v0.json';
import {
  ACCEPTED_CURRENT_PUBLICATION_DIGEST,
  currentRendererInputDigest,
  materializeCurrentRendererInput,
  serializeCurrentRendererInput,
} from './current-renderer-input';

const manifest = rendererInputManifestJson as {
  status: string;
  preconditions: Record<string, boolean | string>;
  laws: Record<string, boolean>;
  expectedMaterialization: Record<string, number | string | null>;
  physicalOutput: Record<string, boolean | string>;
  acceptance: Record<string, boolean | number | string>;
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

  it('produces deterministic physical input bytes without historical renderer/distribution authority', () => {
    const first = materializeCurrentRendererInput();
    const second = materializeCurrentRendererInput();
    const firstDigest = currentRendererInputDigest(first);
    const secondDigest = currentRendererInputDigest(second);

    expect(secondDigest).toBe(firstDigest);
    expect(firstDigest).toMatch(/^sha256_[0-9a-f]{64}$/);
    expect(serializeCurrentRendererInput(second)).toBe(serializeCurrentRendererInput(first));
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
    process.stdout.write(`R2_A1_1_RENDERER_INPUT_DIGEST=${firstDigest}\n`);
  });

  it('keeps A1.1 bounded before distribution, runtime, preview or cutover', () => {
    expect(manifest.status).toBe('materialized-awaiting-ci');
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
      rendererInputDigest: null,
    });
    expect(manifest.physicalOutput).toEqual({
      generatedPath: 'editorial-shell/src/generated/current-publication-state.json',
      witnessPath: 'editorial-shell/r2-a1-1-current-renderer-input-witness.json',
      generatedPathCommitted: false,
      witnessProducedByCi: false,
    });
    expect(manifest.acceptance).toMatchObject({
      exactAcceptedPublicationDigestEmbedded: true,
      allCurrentSurfacesMaterialized: true,
      allCurrentSemanticDocumentsMaterialized: true,
      historicalRendererInputAuthorityCount: 0,
      historicalDistributionAuthorityCount: 0,
      semanticMutationCount: 0,
      productionMutationCount: 0,
      r2_a1_1Complete: false,
      currentSpecimenReemitted: false,
      currentDistributionEmitted: false,
      currentPhysicalPublicationValid: false,
      cutoverReady: false,
      cutoverAuthorized: false,
      cutoverEnacted: false,
    });
  });
});
