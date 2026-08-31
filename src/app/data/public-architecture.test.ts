import { describe, expect, it } from 'vitest';
import { getPublicArchitectureView, publicArchitectureViews } from './public-architecture';

describe('current public architecture', () => {
  it('publishes complete bilingual views with stable route ids', () => {
    expect(new Set(publicArchitectureViews.map((view) => view.id)).size).toBe(publicArchitectureViews.length);
    expect(publicArchitectureViews.map((view) => view.id)).toEqual(['systems', 'settlement', 'agents', 'realtime', 'handoff']);

    for (const view of publicArchitectureViews) {
      expect(view.shortLabel.en.length).toBeGreaterThan(0);
      expect(view.shortLabel.pt.length).toBeGreaterThan(0);
      expect(view.summary.en.length).toBeGreaterThan(0);
      expect(view.summary.pt.length).toBeGreaterThan(0);
      expect(view.steps.length).toBeGreaterThanOrEqual(5);
      expect(view.guarantees.en.length).toBe(view.guarantees.pt.length);
    }
  });

  it('keeps shared architecture links recoverable', () => {
    expect(getPublicArchitectureView('settlement').id).toBe('settlement');
    expect(getPublicArchitectureView('legacy-radar').id).toBe('systems');
    expect(getPublicArchitectureView(null).id).toBe('systems');
  });

  it('does not reintroduce private work or proof-first presentation language', () => {
    const catalog = JSON.stringify(publicArchitectureViews).toLowerCase();
    const forbidden = [
      'brineos',
      'deterministic first',
      'sanitized public view',
      'governing principle',
      'system guarantees',
      'trust boundaries',
      'evidence bundle',
    ];

    for (const value of forbidden) {
      expect(catalog, `current public architecture contains: ${value}`).not.toContain(value);
    }
  });

  it('frames architecture as understandable questions instead of credentials', () => {
    for (const view of publicArchitectureViews) {
      expect(view.title.en.endsWith('?')).toBe(true);
      expect(view.title.pt.endsWith('?')).toBe(true);
    }
  });
});
