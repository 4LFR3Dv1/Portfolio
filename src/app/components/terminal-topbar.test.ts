import { describe, expect, it } from 'vitest';
import { resolveActiveNavigation } from './terminal-topbar';

describe('header navigation state', () => {
  it('uses the visible section on the landing route', () => {
    expect(resolveActiveNavigation({ view: 'landing' }, 'evidence')).toBe('evidence');
    expect(resolveActiveNavigation({ view: 'landing' }, 'about')).toBe('about');
  });

  it('maps dedicated routes to their primary navigation area', () => {
    expect(resolveActiveNavigation({ view: 'architecture' }, 'home')).toBe('architecture');
    expect(resolveActiveNavigation({ view: 'case-study', projectId: 'vira' }, 'home')).toBe('work');
  });
});
