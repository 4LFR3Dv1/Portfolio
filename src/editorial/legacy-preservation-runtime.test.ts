import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { materializeAcceptedRendererInput } from './renderer-input';

function readRepoFile(path: string): string {
  return readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
}

function readJson<T>(path: string): T {
  return JSON.parse(readRepoFile(path)) as T;
}

const input = materializeAcceptedRendererInput();
const legacy = input.legacy;
const paths: string[] = legacy.pages.map((page) => page.path).sort();
const legacyPathSet = new Set<string>(paths);

describe('R2.3 legacy preservation runtime', () => {
  it('materializes exactly the four R1.8 preservation exceptions from frozen R0.0 sources', () => {
    expect(legacy.schemaVersion).toBe('editorial-legacy-preservation-state/v0');
    expect(legacy.source.freezeId).toBe('PORTFOLIO-R0.0-2026-08-30');
    expect(legacy.source.freezeCommit).toBe('bff5519fd2b4986dd0c176bc96974b3233d97525');
    expect(legacy.source.compatibilityContractId).toBe('PORTFOLIO-R1.8-2026-08-30');
    expect(legacy.source.projectsBlobSha).toBe('df6fe680cd96ede69b3ff7e1f0a6b3b498b16c9f');
    expect(legacy.source.architectureBlobSha).toBe('377fd24faab1be39ba135b8d1cd62379e97f403a');
    expect(paths).toEqual([
      '/architecture',
      '/work/agentic-systems',
      '/work/transactional-support-bot',
      '/work/verify-systems',
    ]);
    expect(input.shellPlan.legacyPreservedPages.map((page) => page.path).sort()).toEqual(paths);
  });

  it('preserves the shared-path legacy language contract without Accept-Language inference', () => {
    expect(legacy.language).toEqual({
      storageKey: 'portfolio-language',
      defaultLanguage: 'en',
      acceptedValues: ['en', 'pt'],
      acceptLanguageInferenceAllowed: false,
    });
    const layout = readRepoFile('editorial-shell/src/layouts/LegacyLayout.astro');
    expect(layout).toContain("const storageKey = 'portfolio-language'");
    expect(layout).toContain("stored === 'pt' ? 'pt' : 'en'");
    expect(layout).not.toContain('navigator.language');
    expect(layout).not.toContain('Accept-Language');
  });

  it('preserves Agentic Systems & Foundry as its old generalized representation, not a new System binding', () => {
    const agentic = legacy.pages.find((page) => page.path === '/work/agentic-systems');
    expect(agentic?.kind).toBe('legacy-case-study');
    if (!agentic || agentic.kind !== 'legacy-case-study') throw new Error('agentic legacy page missing');
    expect(agentic.projectId).toBe('agentic-systems');
    expect(agentic.languages.en.title).toBe('Agentic Systems & Foundry');
    expect(agentic.languages.en.visibility).toBe('private');
    expect(agentic.languages.en.guarantees).toEqual([
      'EXPLICIT STATE',
      'HUMAN REVIEW',
      'TRACEABLE OUTPUTS',
      'BOUNDED EXECUTION',
    ]);
    expect(JSON.stringify(agentic.languages)).not.toContain('AgentHub');
    expect(JSON.stringify(agentic.languages)).not.toContain('Factory');
    expect(JSON.stringify(agentic.languages)).not.toContain('/systems/foundry');
    expect(Object.prototype.hasOwnProperty.call(agentic, 'successors')).toBe(false);
  });

  it('keeps the sanitized Transactional Support Bot case study instead of fabricating its unavailable canonical document', () => {
    const page = legacy.pages.find((entry) => entry.path === '/work/transactional-support-bot');
    expect(page?.kind).toBe('legacy-case-study');
    if (!page || page.kind !== 'legacy-case-study') throw new Error('transactional support legacy page missing');
    expect(page.languages.en.extended?.disclosure).toBe(
      'Generalized professional case study. Source code, infrastructure, provider details and operational data remain confidential.',
    );
    expect(page.languages.en.extended?.stateModel.primary).toEqual(['pending', 'opened', 'confirmed']);
    expect(page.languages.en.evidence).toEqual([]);
    expect(input.pages.some((entry) => entry.canonicalPath.includes('transactional-support-bot'))).toBe(false);
  });

  it('preserves VERIFY SYSTEMS and the legacy Architecture Explorer without promoting either into canonical distribution', () => {
    const verify = legacy.pages.find((entry) => entry.path === '/work/verify-systems');
    expect(verify?.kind).toBe('legacy-case-study');
    if (!verify || verify.kind !== 'legacy-case-study') throw new Error('verify legacy page missing');
    expect(verify.languages.en.evidence).toContainEqual({
      label: 'Read VERIFY SYSTEMS',
      url: '/docs/Verify_By_Renan_Melo.pdf',
    });

    const architecture = legacy.pages.find((entry) => entry.path === '/architecture');
    expect(architecture?.kind).toBe('legacy-architecture');
    if (!architecture || architecture.kind !== 'legacy-architecture') throw new Error('architecture legacy page missing');
    expect(architecture.languages.en.views).toHaveLength(5);
    expect(architecture.languages.en.views[0]?.id).toBe('systems');
    expect(architecture.languages.en.views[0]?.principle).toBe(
      'Intelligence can propose. Deterministic boundaries authorize, execute and verify.',
    );
    expect(architecture.languages.pt.views[0]?.principle).toBe(
      'A inteligência pode propor. Fronteiras determinísticas autorizam, executam e verificam.',
    );
  });

  it('keeps legacy pages outside canonical metadata, sitemap, RSS and search authority', () => {
    expect(legacy.indexing).toEqual({
      robots: 'noindex,follow',
      sitemapEligible: false,
      rssEligible: false,
      searchEligible: false,
      canonicalRecordBindingAllowed: false,
    });
    expect(input.pages.some((page) => legacyPathSet.has(page.canonicalPath))).toBe(false);
    expect(input.emission.metadata.some((entry) => legacyPathSet.has(entry.canonicalPath))).toBe(false);
    expect(input.emission.search.some((entry) => legacyPathSet.has(entry.canonicalPath))).toBe(false);
    const emittedBodies = input.emission.artifacts.map((artifact) => artifact.body).join('\n');
    for (const path of paths) expect(emittedBodies).not.toContain(path);

    const layout = readRepoFile('editorial-shell/src/layouts/LegacyLayout.astro');
    expect(layout).toContain('name="robots" content="noindex,follow"');
    expect(layout).not.toContain('rel="canonical"');
    expect(layout).not.toContain('hreflang=');
  });

  it('does not mutate the deployed React/Vite runtime while materializing legacy compatibility HTML', () => {
    const rootPackage = readJson<{ scripts: Record<string, string> }>('package.json');
    const vercel = readJson<{ rewrites: Array<{ source: string; destination: string }> }>('vercel.json');
    expect(rootPackage.scripts.build).toBe('vite build');
    expect(vercel.rewrites).toEqual([{ source: '/((?!.*\\.).*)', destination: '/index.html' }]);
  });
});
