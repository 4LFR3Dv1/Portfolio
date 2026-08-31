import { describe, expect, it } from 'vitest';
import { publications } from './editorial-publications';

const INTERNAL_EXPLANATION_TERMS = [
  'agent-native',
  'ai-native',
  'institutional identity',
  'governed authority',
  'causal continuity',
  'materialization',
  'reconciliation',
  'substrate',
  'rec_',
  'rev_sha256',
  'disclosure=',
  'realization=',
];

const PROJECT_TITLES = ['Genesis', 'BrineOS', 'WER-ESK', 'Foundry', 'SNE-FDE', 'Lisa'];

describe('public surface policy', () => {
  it('publishes essays and notes rather than project documentation', () => {
    expect(publications.length).toBeGreaterThan(0);
    expect(publications.every((publication) => publication.kind === 'ESSAY' || publication.kind === 'NOTE')).toBe(true);
    expect(publications.some((publication) => publication.slug.startsWith('systems/'))).toBe(false);

    const titles = publications.flatMap((publication) => [publication.title.en, publication.title.pt]);
    for (const projectTitle of PROJECT_TITLES) expect(titles).not.toContain(projectTitle);
  });

  it('keeps BrineOS outside every public editorial locator', () => {
    expect(publications.some((publication) => publication.slug.toLowerCase().includes('brine'))).toBe(false);
    expect(JSON.stringify(publications).toLowerCase()).not.toContain('brineos');
  });

  it('does not explain public ideas using internal repository language', () => {
    const publicCopy = publications.flatMap((publication) => [
      publication.title.en,
      publication.title.pt,
      publication.copy.en.dek,
      publication.copy.pt.dek,
      ...publication.copy.en.sections.flatMap((section) => [section.heading, ...section.paragraphs]),
      ...publication.copy.pt.sections.flatMap((section) => [section.heading, ...section.paragraphs]),
    ]).join('\n').toLowerCase();

    for (const term of INTERNAL_EXPLANATION_TERMS) {
      expect(publicCopy, `public copy contains internal term: ${term}`).not.toContain(term);
    }
  });
});
