import { describe, expect, it } from 'vitest';
import { metadataForRoute } from './metadata';

describe('portfolio metadata', () => {
  it('describes the architecture explorer in public language', () => {
    const route = { view: 'architecture' } as const;

    expect(metadataForRoute(route, 'en')).toEqual({
      title: 'Architecture — Renan Melo',
      description: 'A closer look at how product, services, software execution and infrastructure connect across Renan Melo’s work.',
      canonicalUrl: 'https://renan.snelabs.space/architecture',
    });
    expect(metadataForRoute(route, 'pt').description).toContain('produto, serviços');
  });

  it('describes the portfolio without internal project vocabulary', () => {
    expect(metadataForRoute({ view: 'landing' }, 'en')).toEqual({
      title: 'Renan Melo — Software, Product & Computing',
      description: 'Software, products and experiments by Renan Melo, plus essays on technology, computing and the questions that appear while building.',
      canonicalUrl: 'https://renan.snelabs.space/',
    });
  });

  it('keeps localized metadata for existing case studies', () => {
    const route = { view: 'case-study', projectId: 'transactional-support-bot' } as const;
    expect(metadataForRoute(route, 'pt').title).toBe('Bot Transacional de Suporte — Renan Melo');
  });
});
