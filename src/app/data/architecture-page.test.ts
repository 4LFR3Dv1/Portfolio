import { describe, expect, it } from 'vitest';
import { architectureLegacyViewAnchors, architecturePage } from './architecture-page';

describe('current architecture reading surface', () => {
  it('publishes one model, five separations and four contexts', () => {
    expect(architecturePage.model.steps).toHaveLength(5);
    expect(architecturePage.separations.items).toHaveLength(5);
    expect(architecturePage.contexts.items).toHaveLength(4);
  });

  it('keeps legacy architecture locators recoverable without restoring explorer state', () => {
    expect(architectureLegacyViewAnchors.systems).toBe('architecture-model');
    expect(architectureLegacyViewAnchors.settlement).toBe('architecture-context-payments');
    expect(architectureLegacyViewAnchors.agents).toBe('architecture-context-agents');
    expect(architectureLegacyViewAnchors.realtime).toBe('architecture-context-realtime');
    expect(architectureLegacyViewAnchors.handoff).toBe('architecture-context-people');
  });

  it('keeps the public architecture curated and free of private/internal language', () => {
    const surface = JSON.stringify(architecturePage).toLowerCase();
    const forbidden = [
      'brineos',
      'recordid',
      'rev_sha256',
      'governed authority',
      'institutional identity',
      'materialization',
      'reconciliation',
      'trust boundaries',
      'system guarantees',
    ];

    for (const term of forbidden) {
      expect(surface, `public architecture contains: ${term}`).not.toContain(term);
    }
  });

  it('links the current projects to their intended public destinations', () => {
    const projects = new Map(architecturePage.projects.items.map((project) => [project.name, project]));

    expect(projects.get('Genesis')?.links.some((link) => link.href === 'https://genesis.snelabs.space/#genesis')).toBe(true);
    expect(projects.get('Factory')?.links.some((link) => link.href === '/work/factory')).toBe(true);
    expect(projects.get('Lisa')?.links.some((link) => link.href === 'https://assistentelisa.online/')).toBe(true);
    expect(projects.get('Foundry Pay / Channels')?.links).toHaveLength(2);
  });
});
