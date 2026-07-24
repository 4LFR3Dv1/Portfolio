import { describe, expect, it } from 'vitest';
import { metadataForRoute } from './metadata';

describe('portfolio metadata', () => {
  it('returns localized metadata for the transactional support case', () => {
    const route = { view: 'case-study', projectId: 'transactional-support-bot' } as const;

    expect(metadataForRoute(route, 'en')).toEqual({
      title: 'Transactional Support Bot — Renan Melo',
      description: 'A session-based conversational support system with persistent state, identity binding, idempotent confirmation, secure handoff and operational traceability.',
      canonicalUrl: 'https://renan.snelabs.space/work/transactional-support-bot',
    });
    expect(metadataForRoute(route, 'pt').title).toBe('Bot Transacional de Suporte — Renan Melo');
  });
});
