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
      if (project.caseStudy.extended) {
        expect(project.caseStudy.extended.flow.en.length).toBe(project.caseStudy.extended.flow.pt.length);
        expect(project.caseStudy.extended.roleDescription.en).toBeTruthy();
        expect(project.caseStudy.extended.roleDescription.pt).toBeTruthy();
        expect(project.caseStudy.extended.aiRelevance.en).toBeTruthy();
        expect(project.caseStudy.extended.aiRelevance.pt).toBeTruthy();
      }
    }
  });

  it('resolves known projects and rejects unknown projects', () => {
    expect(getProject('vira')?.title).toBe('VIRA');
    expect(getProject('missing')).toBeUndefined();
  });

  it('positions the transactional support case after the strategic systems work', () => {
    const ids = projects.map((project) => project.id);
    expect(ids.indexOf('transactional-support-bot')).toBeGreaterThan(ids.indexOf('agentic-systems'));
    expect(ids.indexOf('transactional-support-bot')).toBeLessThan(ids.indexOf('sne-os'));
  });

  it('keeps the transactional support case generalized and non-generative', () => {
    const project = getProject('transactional-support-bot');
    expect(project?.visibility).toBe('case-study');
    expect(project?.links).toEqual([]);
    expect(project?.badges).not.toContain('GENERATIVE AI');
    expect(project?.badges).not.toContain('LLM');
    expect(project?.badges).not.toContain('RAG');

    const publishedContent = JSON.stringify(project).toLowerCase();
    for (const forbidden of ['telegram', 'nestjs', 'prisma', 'crm', 'http://', 'https://']) {
      expect(publishedContent).not.toContain(forbidden);
    }
  });
});
