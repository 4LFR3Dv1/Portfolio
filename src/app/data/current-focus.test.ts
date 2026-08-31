import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { currentFocus } from './current-focus';

const heroSource = readFileSync(new URL('../components/hero-section.tsx', import.meta.url), 'utf8');
const editorialIndex = readFileSync(
  new URL('../../../editorial-shell/publication-src/pages/index.astro', import.meta.url),
  'utf8',
);

describe('current work and study surface', () => {
  it('publishes concrete current work instead of generic now copy', () => {
    expect(currentFocus.map((item) => item.id)).toEqual([
      'genesis',
      'factory',
      'experimental-computing',
    ]);

    expect(heroSource).toContain("import { currentFocus } from '../data/current-focus';");
    expect(heroSource).not.toContain('nowItems');
  });

  it('sends every current study into the Editorial surface', () => {
    for (const item of currentFocus) {
      expect(item.studies.length).toBeGreaterThan(0);
      for (const study of item.studies) {
        expect(study.href).toMatch(/^\/editorial\//);
      }
    }

    expect(currentFocus.find((item) => item.id === 'factory')?.studies[0]?.href).toBe(
      '/editorial/#estudo-software-agentes',
    );
  });

  it('materializes current studies and open-study anchors on /editorial', () => {
    expect(editorialIndex).toContain('id="estudos-atuais"');
    expect(editorialIndex).toContain("id: 'estudo-software-agentes'");
    expect(editorialIndex).toContain('ESTUDO ABERTO');
    expect(editorialIndex).toContain('ENSAIO PUBLICADO');
    expect(editorialIndex).toContain('Perguntas que ainda estão em movimento.');
  });

  it('keeps the current SNE Labs destination canonical', () => {
    expect(heroSource).toContain('https://home.snelabs.space/');
    expect(heroSource).not.toContain('url="https://snelabs.space"');
  });
});
