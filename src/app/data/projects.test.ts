import { describe, expect, it } from 'vitest';
import { getProject, projects } from './projects';

describe('project catalog', () => {
  it('uses unique, route-safe identifiers', () => {
    const ids = projects.map((project) => project.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.every((id) => /^[a-z0-9-]+$/.test(id))).toBe(true);
  });

  it('contains complete bilingual content', () => {
    for (const project of projects) {
      expect(project.subtitle.en).toBeTruthy();
      expect(project.subtitle.pt).toBeTruthy();
      expect(project.highlights.en.length).toBeGreaterThan(0);
      expect(project.highlights.pt.length).toBeGreaterThan(0);
      expect(project.caseStudy.architecture.en.length).toBeGreaterThan(0);
      expect(project.caseStudy.architecture.pt.length).toBeGreaterThan(0);
    }
  });

  it('resolves known projects and rejects unknown projects', () => {
    expect(getProject('vira')?.title).toBe('VIRA');
    expect(getProject('missing')).toBeUndefined();
  });
});
