import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  getEditorialInquiry,
  getInquiryHref,
  getInquiryPublicationState,
} from './editorial-inquiries';
import { currentFocus } from './current-focus';

const heroSource = readFileSync(new URL('../components/hero-section.tsx', import.meta.url), 'utf8');
const focusSource = readFileSync(new URL('./current-focus.ts', import.meta.url), 'utf8');
const editorialIndex = readFileSync(
  new URL('../../../editorial-shell/publication-src/pages/index.astro', import.meta.url),
  'utf8',
);

describe('current work and editorial projection', () => {
  it('publishes concrete current work instead of generic now copy', () => {
    expect(currentFocus.map((item) => item.id)).toEqual([
      'genesis',
      'factory',
      'experimental-computing',
    ]);

    expect(heroSource).toContain("import { currentFocus } from '../data/current-focus';");
    expect(heroSource).not.toContain('nowItems');
  });

  it('derives every Home study from the canonical Inquiry objects', () => {
    for (const item of currentFocus) {
      expect(item.studies.length).toBe(item.inquiryIds.length);
      for (const study of item.studies) {
        const inquiry = getEditorialInquiry(study.inquiryId);
        expect(study.title).toEqual(inquiry.question);
        expect(study.state).toEqual(getInquiryPublicationState(inquiry));
        expect(study.href).toBe(getInquiryHref(inquiry));
        expect(study.href).toMatch(/^\/editorial\//);
      }
    }

    expect(currentFocus.find((item) => item.id === 'factory')?.studies[0]?.href).toBe(
      '/editorial/quando-produzir-software-deixa-de-ser-o-gargalo/',
    );
  });

  it('does not duplicate editorial question copy inside current-focus.ts', () => {
    expect(focusSource).not.toContain('When does a browser stop being a tool?');
    expect(focusSource).not.toContain('O que muda quando produzir software deixa de ser o gargalo?');
    expect(focusSource).not.toContain('Where does a network exist?');
  });

  it('preserves historical study anchors while exposing the new investigation section', () => {
    expect(editorialIndex).toContain('id="em-investigacao"');
    expect(editorialIndex).toContain('id="estudos-atuais"');
    expect(editorialIndex).toContain('getActiveInquiries');
    expect(editorialIndex).not.toContain('const currentStudies =');
    expect(editorialIndex).not.toContain('study-grid');
  });

  it('keeps the current SNE Labs destination canonical', () => {
    expect(heroSource).toContain('https://home.snelabs.space/');
    expect(heroSource).not.toContain('url="https://snelabs.space"');
  });
});
