import { describe, expect, it } from 'vitest';
import { metadataForRoute } from './metadata';

describe('portfolio metadata', () => {
  it('describes the current architecture explorer in both languages', () => {
    const route = { view: 'architecture' } as const;

    expect(metadataForRoute(route, 'en')).toEqual({
      title: 'Architecture — Renan Melo',
      description: 'Explore system architecture across governed settlement, agent operations, real-time products, transactional workflows and verifiable evidence.',
      canonicalUrl: 'https://renan.snelabs.space/architecture',
    });
    expect(metadataForRoute(route, 'pt').description).toContain('settlement governado');
  });

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
