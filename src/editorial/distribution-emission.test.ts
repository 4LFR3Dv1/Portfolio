import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { materializeAcceptedRendererInput } from './renderer-input';
import { reconstructDistributionEmission } from './distribution-emission';

function readRepoFile(path: string): string {
  return readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
}

const input = materializeAcceptedRendererInput();
const layoutSource = readRepoFile('editorial-shell/src/layouts/EditorialLayout.astro');
const verifierSource = readRepoFile('editorial-shell/scripts/verify-output.mjs');

function artifact(path: string) {
  const match = input.emission.artifacts.find((entry) => entry.path === path);
  if (!match) throw new Error(`distribution-emission-test-artifact-missing:${path}`);
  return match;
}

describe('R2.2 distribution emission', () => {
  it('derives physical emission only from the accepted R1.7 distribution bundle', () => {
    expect(input.distribution.pages).toEqual(input.pages);
    const reconstructed = reconstructDistributionEmission(input.distribution, input.source.distributionDigest);
    expect(reconstructed.state).toBe('ready');
    expect(reconstructed.errors).toEqual([]);
    expect(reconstructed.emission).toEqual(input.emission);
    expect(input.emission.sourceBundleDigest).toBe(input.source.distributionDigest);
  });

  it('emits the exact accepted metadata and hreflang state without fallback invention', () => {
    expect(input.emission.metadata).toHaveLength(18);
    expect(input.emission.hreflang).toHaveLength(9);
    expect(input.emission.hreflang.flatMap((cluster) => cluster.links)).toHaveLength(18);
    expect(input.emission.metadata.every((entry) => entry.robots === 'index,follow')).toBe(true);
    expect(input.emission.hreflang.flatMap((cluster) => cluster.links).some((link) => link.language === ('x-default' as never))).toBe(false);
    expect(layoutSource).toContain('rel="canonical"');
    expect(layoutSource).toContain('name="robots"');
    expect(layoutSource).toContain('rel="alternate"');
    expect(layoutSource).not.toContain('x-default');
  });

  it('emits one sitemap, two empty RSS feeds and one six-entry search index', () => {
    expect(input.emission.artifacts.map((entry) => entry.path)).toEqual([
      '/en/rss.xml',
      '/pt-br/rss.xml',
      '/search-index.json',
      '/sitemap.xml',
    ]);

    const sitemap = artifact('/sitemap.xml').body;
    expect(sitemap.match(/<url>/g)).toHaveLength(18);
    expect(sitemap).not.toContain('<lastmod>');
    expect(sitemap).not.toContain('<priority>');
    expect(sitemap).not.toContain('<changefreq>');
    expect(sitemap).not.toContain('x-default');

    expect(artifact('/en/rss.xml').body).not.toContain('<item>');
    expect(artifact('/pt-br/rss.xml').body).not.toContain('<item>');

    const search = JSON.parse(artifact('/search-index.json').body) as Array<{ canonicalPath: string }>;
    expect(search).toHaveLength(6);
    const paths = new Set(search.map((entry) => entry.canonicalPath));
    expect(paths.has('/en/systems/transactional-support-bot')).toBe(false);
    expect(paths.has('/pt-br/systems/transactional-support-bot')).toBe(false);
    expect(paths.has('/en/systems/foundry-pay')).toBe(false);
    expect(paths.has('/pt-br/systems/foundry-pay')).toBe(false);
  });

  it('keeps R2.2 physical verification fail-closed over the expected distribution surface', () => {
    expect(verifierSource).toContain("'sitemap.xml'");
    expect(verifierSource).toContain("'en/rss.xml'");
    expect(verifierSource).toContain("'pt-br/rss.xml'");
    expect(verifierSource).toContain("'search-index.json'");
    expect(verifierSource).toContain('editorial-shell-search-sanitized-leak');
    expect(verifierSource).toContain('editorial-shell-sitemap-lastmod-inferred');
  });
});
