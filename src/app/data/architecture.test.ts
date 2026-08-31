import { describe, expect, it } from 'vitest';
import { architectureViews, getArchitectureView } from './architecture';

describe('architecture catalog', () => {
  it('publishes complete bilingual views with unique ids', () => {
    expect(new Set(architectureViews.map((view) => view.id)).size).toBe(architectureViews.length);

    for (const view of architectureViews) {
      expect(view.shortLabel.en.length).toBeGreaterThan(0);
      expect(view.shortLabel.pt.length).toBeGreaterThan(0);
      expect(view.title.en.length).toBeGreaterThan(0);
      expect(view.title.pt.length).toBeGreaterThan(0);
      expect(view.summary.en.length).toBeGreaterThan(0);
      expect(view.summary.pt.length).toBeGreaterThan(0);
      expect(view.steps.length).toBeGreaterThanOrEqual(5);
      expect(view.guarantees.en.length).toBe(view.guarantees.pt.length);

      for (const step of view.steps) {
        expect(step.label.en.length).toBeGreaterThan(0);
        expect(step.label.pt.length).toBeGreaterThan(0);
        expect(step.detail.en.length).toBeGreaterThan(0);
        expect(step.detail.pt.length).toBeGreaterThan(0);
      }
    }
  });

  it('falls back safely when a shared URL contains an unknown view', () => {
    expect(getArchitectureView('settlement').id).toBe('settlement');
    expect(getArchitectureView('legacy-radar').id).toBe('systems');
    expect(getArchitectureView(null).id).toBe('systems');
  });

  it('does not expose legacy topology, domains or implementation paths', () => {
    const publicCatalog = JSON.stringify(architectureViews);
    const forbidden = [
      'radar.snelabs.space',
      'api.snelabs.space',
      'SNE_Radar.exe',
      'auth_manager.py',
      'POST /api/',
      'Flask Server',
      'MetaMask',
      'Binance API',
      'Bybit API',
    ];

    for (const value of forbidden) {
      expect(publicCatalog).not.toContain(value);
    }
  });
});
