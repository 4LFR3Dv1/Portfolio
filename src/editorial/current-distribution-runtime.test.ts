import { describe, expect, it } from 'vitest';
import distributionManifestJson from '../../docs/editorial/R2-A1.2-current-distribution.v0.json';
import {
  ACCEPTED_CURRENT_RENDERER_INPUT_DIGEST,
  currentDistributionDigest,
  materializeCurrentDistribution,
  serializeCurrentDistribution,
} from './current-distribution-runtime';
import { ACCEPTED_CURRENT_PUBLICATION_DIGEST } from './current-renderer-input';

const manifest = distributionManifestJson as {
  status: string;
  preconditions: Record<string, boolean | string>;
  laws: Record<string, boolean>;
  expectedMaterialization: Record<string, number | string | null>;
  physicalOutput: Record<string, boolean | string>;
  acceptance: Record<string, boolean | number | string>;
};

describe('R2-A1.2 current distribution emission', () => {
  it('derives the exact 66-page current canonical publication from the accepted renderer input', () => {
    const bundle = materializeCurrentDistribution();
    expect(bundle.source).toEqual({
      acceptedPublicationDigest: ACCEPTED_CURRENT_PUBLICATION_DIGEST,
      rendererInputDigest: ACCEPTED_CURRENT_RENDERER_INPUT_DIGEST,
    });
    expect(bundle.pages).toHaveLength(66);
    expect(bundle.pages.filter((entry) => entry.source === 'surface')).toHaveLength(12);
    expect(bundle.pages.filter((entry) => entry.source === 'document')).toHaveLength(54);
    expect(new Set(bundle.pages.map((entry) => entry.canonicalPath)).size).toBe(66);
    expect(bundle.pages.every((entry) => entry.canonicalUrl === `https://renan.snelabs.space${entry.canonicalPath}`)).toBe(true);
  });

  it('emits complete bilingual metadata and hreflang without x-default or fallback inference', () => {
    const bundle = materializeCurrentDistribution();
    expect(bundle.metadata).toHaveLength(66);
    expect(bundle.hreflang).toHaveLength(33);
    expect(bundle.hreflang.flatMap((entry) => entry.links)).toHaveLength(66);
    expect(bundle.hreflang.every((entry) => entry.links.length === 2)).toBe(true);
    expect(bundle.hreflang.every((entry) => new Set(entry.links.map((link) => link.language)).size === 2)).toBe(true);
    expect(bundle.metadata.every((entry) => entry.robots === 'index,follow')).toBe(true);
    expect(bundle.metadata.every((entry) => entry.alternates.length === 2)).toBe(true);
  });

  it('emits sitemap, empty bounded RSS and exact semantic search without chronology inference', () => {
    const bundle = materializeCurrentDistribution();
    expect(bundle.sitemap).toHaveLength(66);
    expect(bundle.rss).toHaveLength(2);
    expect(bundle.rss.map((entry) => entry.language).sort()).toEqual(['en', 'pt-BR']);
    expect(bundle.rss.flatMap((entry) => entry.items)).toEqual([]);
    expect(bundle.search).toHaveLength(54);
    expect(bundle.search.filter((entry) => entry.language === 'en')).toHaveLength(27);
    expect(bundle.search.filter((entry) => entry.language === 'pt-BR')).toHaveLength(27);
    expect(new Set(bundle.search.map((entry) => entry.id)).size).toBe(54);
  });

  it('produces a deterministic current distribution digest while historical distribution remains non-authoritative', () => {
    const first = materializeCurrentDistribution();
    const second = materializeCurrentDistribution();
    const digest = currentDistributionDigest(first);
    expect(currentDistributionDigest(second)).toBe(digest);
    expect(serializeCurrentDistribution(second)).toBe(serializeCurrentDistribution(first));
    expect(digest).toMatch(/^sha256_[0-9a-f]{64}$/);
    expect(manifest.laws).toEqual({
      distributionConsumesAcceptedRendererInputOnly: true,
      manualPageRegistryAllowed: false,
      crossLanguageFallbackAllowed: false,
      lastModifiedInferenceAllowed: false,
      priorityInferenceAllowed: false,
      publicationChronologyInferenceAllowed: false,
      xDefaultInferenceAllowed: false,
      surfaceAndDocumentOrderMayBeReinterpreted: false,
      historicalDistributionManifestIsAuthority: false,
      semanticMutationAllowed: false,
      productionMutationAllowed: false,
    });
    process.stdout.write(`R2_A1_2_CURRENT_DISTRIBUTION_DIGEST=${digest}\n`);
  });

  it('keeps A1.2 pre-runtime and pre-preview until the physical emission is witnessed', () => {
    expect(manifest.status).toBe('materialized-awaiting-ci');
    expect(manifest.preconditions).toEqual({
      r2_a1_0Complete: true,
      r2_a1_1Complete: true,
      currentPublicationValid: true,
      acceptedPublicationDigest: ACCEPTED_CURRENT_PUBLICATION_DIGEST,
      rendererInputDigest: ACCEPTED_CURRENT_RENDERER_INPUT_DIGEST,
    });
    expect(manifest.expectedMaterialization).toEqual({
      surfacePageCount: 12,
      documentPageCount: 54,
      canonicalPageCount: 66,
      metadataEntryCount: 66,
      hreflangClusterCount: 33,
      hreflangLinkCount: 66,
      sitemapEntryCount: 66,
      rssFeedCount: 2,
      rssItemCount: 0,
      searchEntryCount: 54,
      distributionDigest: null,
    });
    expect(manifest.acceptance).toMatchObject({
      r2_a1_2Complete: false,
      currentSpecimenReemitted: true,
      currentDistributionEmitted: false,
      currentStaticRuntimeRecommissioned: false,
      currentPhysicalPublicationValid: false,
      cutoverReady: false,
      cutoverAuthorized: false,
      cutoverEnacted: false,
      productionMutationCount: 0,
    });
  });
});
