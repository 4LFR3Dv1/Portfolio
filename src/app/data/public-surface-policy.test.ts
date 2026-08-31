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

describe('public surface policy', () => {
  it('publishes only explicitly selected editorial entries', () => {
    expect(publications.some((publication) => publication.title === 'BrineOS')).toBe(false);
    expect(publications.some((publication) => publication.slug.includes('brine'))).toBe(false);
  });

  it('does not explain public projects using internal repository language', () => {
    const publicCopy = publications
      .flatMap((publication) => [
        publication.copy.en.summary,
        publication.copy.en.thesis ?? '',
        publication.copy.pt.summary,
        publication.copy.pt.thesis ?? '',
      ])
      .join('\n')
      .toLowerCase();

    for (const term of INTERNAL_EXPLANATION_TERMS) {
      expect(publicCopy, `public copy contains internal term: ${term}`).not.toContain(term);
    }
  });
});
