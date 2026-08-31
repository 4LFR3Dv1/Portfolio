import { describe, expect, it } from 'vitest';
import { currentCaseStudies, getPortfolioProject } from './current-case-studies';

describe('current case studies', () => {
  it('adds Genesis and Factory without replacing the historical project catalog', () => {
    expect(currentCaseStudies.map((project) => project.id)).toEqual(['genesis', 'factory']);
    expect(getPortfolioProject('genesis')?.title).toBe('Genesis');
    expect(getPortfolioProject('factory')?.title).toBe('Factory');
    expect(getPortfolioProject('vira')?.title).toBe('VIRA');
  });

  it('keeps the Factory source private while allowing a public case study', () => {
    const factory = getPortfolioProject('factory');
    expect(factory?.visibility).toBe('case-study');
    expect(factory?.links).toEqual([]);
    expect(factory?.caseStudy.evidence).toEqual([]);
  });

  it('links Genesis only to its public research surface', () => {
    const genesis = getPortfolioProject('genesis');
    expect(genesis?.links.map((link) => link.url)).toEqual([
      'https://github.com/SNE-Labs/Genesis-CP',
    ]);
  });

  it('keeps public-facing summaries readable without exposing internal object ids', () => {
    const serialized = JSON.stringify(currentCaseStudies).toLowerCase();
    for (const forbidden of ['rec_', 'rev_sha256', 'workpack', 'dispatchwave', 'factorytarget']) {
      expect(serialized).not.toContain(forbidden);
    }
  });
});
