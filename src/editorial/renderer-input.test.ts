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
const shellPackage = readJson<{
  scripts: Record<string, string>;
  dependencies: Record<string, string>;
}>('editorial-shell/package.json');
const shellLock = readJson<{
  packages: Record<string, { dependencies?: Record<string, string> }>;
}>('editorial-shell/package-lock.json');
const rootPackage = readJson<{ scripts: Record<string, string> }>('package.json');
const vercel = readJson<{ rewrites: Array<{ source: string; destination: string }> }>('vercel.json');
const rendererSource = readRepoFile('editorial-shell/src/pages/[...path].astro');
const publicationStateSource = readRepoFile('editorial-shell/src/lib/publication-state.ts');
const materializerSource = readRepoFile('editorial-shell/scripts/materialize-input.mjs');

const forbiddenRendererAuthorityTerms = [
  'record-registry',
  'editorial-evidence-contract',
  'visibility-maturity-disclosure',
  'governanceAssignments',
  'reconstructRecordRegistry',
  'materializeSurfaceDocuments',
];

describe('R2.1 bounded renderer input', () => {
  it('materializes exactly the accepted public publication state', () => {
    expect(input.schemaVersion).toBe('editorial-renderer-input/v0');
    expect(input.source.r1CompletionContractId).toBe('PORTFOLIO-R1.9-2026-08-30');
    expect(input.source.r20CompletionContractId).toBe('PORTFOLIO-R2.0-2026-08-30');
    expect(input.source.distributionDigest).toMatch(/^sha256_[0-9a-f]{64}$/);
    expect(input.pages).toHaveLength(18);
    expect(input.surfaces).toHaveLength(12);
    expect(input.documents).toHaveLength(6);
    expect(input.shellPlan.canonicalPages).toHaveLength(18);
    expect(input.shellPlan.legacyPreservedPages).toHaveLength(4);
    expect(input.shellPlan.redirects).toHaveLength(4);
    expect(input.shellPlan.artifacts).toHaveLength(4);
    expect(input.shellPlan.unknownRouteOutcome).toBe('404');
  });

  it('passes only full public semantic documents to the renderer', () => {
    expect(input.documents.every((document) => document.disclosure.mode === 'full')).toBe(true);
    const paths = new Set(input.pages.map((page) => page.canonicalPath));
    expect(paths.has('/en/systems/transactional-support-bot')).toBe(false);
    expect(paths.has('/pt-br/systems/transactional-support-bot')).toBe(false);
    expect(paths.has('/en/systems/foundry-pay')).toBe(false);
    expect(paths.has('/pt-br/systems/foundry-pay')).toBe(false);
  });

  it('keeps institutional reconstruction outside the Astro renderer', () => {
    for (const term of forbiddenRendererAuthorityTerms) {
      expect(rendererSource).not.toContain(term);
      expect(publicationStateSource).not.toContain(term);
    }
    expect(rendererSource).toContain("publicationState.pages.map");
    expect(publicationStateSource).toContain("../generated/accepted-publication-state.json");
    expect(materializerSource).toContain("/src/editorial/renderer-input.ts");
  });

  it('pins the isolated physical build graph without replacing the deployed root runtime', () => {
    expect(shellPackage.dependencies).toEqual({
      astro: '7.2.9',
      vite: '8.2.2',
    });
    expect(shellPackage.scripts.materialize).toBe('node scripts/materialize-input.mjs');
    expect(shellPackage.scripts.build).toBe('npm run materialize && astro build');
    expect(shellLock.packages['']?.dependencies).toEqual(shellPackage.dependencies);
    expect(rootPackage.scripts.build).toBe('vite build');
    expect(vercel.rewrites).toEqual([
      { source: '/((?!.*\\.).*)', destination: '/index.html' },
    ]);
  });
});
