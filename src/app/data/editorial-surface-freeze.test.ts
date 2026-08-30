import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { architectureViews } from './architecture';
import { projects } from './projects';

interface FrozenProject {
  id: string;
  title: string;
  visibility: string;
  guarantees: string[];
}

interface FrozenArchitectureView {
  id: string;
  principle: string;
  guarantees: string[];
}

interface FrozenPublication {
  id: string;
  title: string;
  locator: string;
}

interface FreezeManifest {
  schemaVersion: string;
  freezeId: string;
  capturedAt: string;
  canonical: {
    repository: string;
    branch: string;
    commit: string;
    origin: string;
  };
  routes: string[];
  identityClaims: {
    name: string;
    role: string;
    author: string;
    siteName: string;
  };
  projects: FrozenProject[];
  architectureViews: FrozenArchitectureView[];
  evidenceLocators: string[];
  projectEvidenceLocators: string[];
  publications: FrozenPublication[];
  sourceBlobs: Record<string, string>;
  acceptance: {
    runtimeSemanticsChanged: boolean;
    uiChanged: boolean;
    r0_0Complete: boolean;
  };
}

function readRepoFile(path: string): string {
  return readFileSync(new URL(`../../../${path}`, import.meta.url), 'utf8');
}

const manifest = JSON.parse(
  readRepoFile('docs/editorial/legacy/portfolio-surface.v0.json'),
) as FreezeManifest;

describe('R0.0 current surface freeze', () => {
  it('pins the canonical pre-editorial baseline', () => {
    expect(manifest.schemaVersion).toBe('portfolio-surface-freeze/v0');
    expect(manifest.freezeId).toBe('PORTFOLIO-R0.0-2026-08-30');
    expect(manifest.canonical).toEqual({
      repository: '4LFR3Dv1/Portfolio',
      branch: 'main',
      commit: 'bff5519fd2b4986dd0c176bc96974b3233d97525',
      origin: 'https://renan.snelabs.space',
    });
    expect(manifest.acceptance.runtimeSemanticsChanged).toBe(false);
    expect(manifest.acceptance.uiChanged).toBe(false);
  });

  it('reconciles every current public route with the legacy sitemap', () => {
    const sitemap = readRepoFile('public/sitemap.xml');
    const sitemapRoutes = [...sitemap.matchAll(/<loc>https:\/\/renan\.snelabs\.space([^<]*)<\/loc>/g)]
      .map((match) => match[1] || '/')
      .sort();

    expect(sitemapRoutes).toEqual([...manifest.routes].sort());
  });

  it('freezes project identity, legacy visibility and published guarantee labels', () => {
    const current = projects.map((project) => ({
      id: project.id,
      title: project.title,
      visibility: project.visibility,
      guarantees: project.caseStudy.guarantees,
    }));

    expect(current).toEqual(manifest.projects);
  });

  it('freezes architecture identities, governing principles and guarantee labels', () => {
    const current = architectureViews.map((view) => ({
      id: view.id,
      principle: view.principle.en,
      guarantees: view.guarantees.en,
    }));

    expect(current).toEqual(manifest.architectureViews);
  });

  it('keeps every frozen Evidence Room locator present in the legacy evidence surface', () => {
    const source = readRepoFile('src/app/components/evidence-room.tsx');

    for (const locator of manifest.evidenceLocators) {
      expect(source).toContain(locator);
    }
  });

  it('keeps every frozen project evidence locator present in the legacy project catalog', () => {
    const serializedProjects = JSON.stringify(projects);

    for (const locator of manifest.projectEvidenceLocators) {
      expect(serializedProjects).toContain(locator);
    }
  });

  it('keeps the three legacy publication artifacts wired into the publication surface', () => {
    const source = readRepoFile('src/app/components/publications-section.tsx');

    for (const publication of manifest.publications) {
      expect(source).toContain(publication.locator);
    }
  });

  it('freezes the current public identity claims without making them future constitutional claims', () => {
    const hero = readRepoFile('src/app/components/hero-section.tsx');
    const index = readRepoFile('index.html');

    expect(hero).toContain(manifest.identityClaims.name);
    expect(hero).toContain(manifest.identityClaims.role);
    expect(hero).toContain(manifest.identityClaims.author);
    expect(index).toContain(manifest.identityClaims.siteName);
  });

  it('records source blob witnesses for the principal legacy public-surface files', () => {
    expect(Object.keys(manifest.sourceBlobs).sort()).toEqual([
      'README.md',
      'package.json',
      'public/sitemap.xml',
      'src/app/App.tsx',
      'src/app/components/evidence-room.tsx',
      'src/app/components/hero-section.tsx',
      'src/app/components/publications-section.tsx',
      'src/app/context/language-context.tsx',
      'src/app/data/architecture.ts',
      'src/app/data/projects.ts',
      'src/app/metadata.ts',
      'src/app/routing.ts',
    ]);
  });
});
