import { describe, expect, it } from 'vitest';
import { parseRoute, routePath } from './routing';

describe('portfolio routing', () => {
  it('parses public routes', () => {
    expect(parseRoute('/')).toEqual({ view: 'landing' });
    expect(parseRoute('/architecture/')).toEqual({ view: 'architecture' });
    expect(parseRoute('/work/vira')).toEqual({ view: 'case-study', projectId: 'vira' });
    expect(parseRoute('/work/transactional-support-bot')).toEqual({
      view: 'case-study',
      projectId: 'transactional-support-bot',
    });
  });

  it('falls back to the landing view for unknown paths', () => {
    expect(parseRoute('/unknown/path')).toEqual({ view: 'landing' });
  });

  it('serializes routes to shareable paths', () => {
    expect(routePath({ view: 'landing' })).toBe('/');
    expect(routePath({ view: 'architecture' })).toBe('/architecture');
    expect(routePath({ view: 'case-study', projectId: 'xs-wallet' })).toBe('/work/xs-wallet');
  });
});
