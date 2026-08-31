import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

function readComponent(name: string): string {
  return readFileSync(new URL(`./${name}`, import.meta.url), 'utf8');
}

describe('current public presentation posture', () => {
  it('keeps case studies narrative-first and technical proof secondary', () => {
    const source = readComponent('case-study-template.tsx');

    expect(source).toContain("what: 'WHAT I BUILT'");
    expect(source).toContain("problem: 'THE PROBLEM'");
    expect(source).toContain("choices: 'WHAT I CHOSE TO DO'");
    expect(source).toContain("learned: 'WHAT I LEARNED'");
    expect(source).toContain("details: 'TECHNICAL NOTES'");
    expect(source).not.toContain('PUBLIC EVIDENCE');
    expect(source).not.toContain('SYSTEM GUARANTEES');
  });

  it('binds the explorer to the current public architecture instead of the frozen legacy catalog', () => {
    const source = readComponent('architecture-explorer.tsx');

    expect(source).toContain("from '../data/public-architecture'");
    expect(source).toContain('ARCHITECTURE, WITHOUT THE CEREMONY');
    expect(source).toContain('WHERE I DRAW THE LINE');
    expect(source).not.toContain('SANITIZED PUBLIC VIEW');
    expect(source).not.toContain('TRUST BOUNDARIES');
  });

  it('presents contact as one conversation instead of recruitment routing', () => {
    const source = readComponent('contact-section.tsx');

    expect(source).toContain('IF SOMETHING HERE CONNECTS WITH WHAT YOU ARE BUILDING, WRITE TO ME.');
    expect(source).toContain('SE ALGO DAQUI CONVERSA COM O QUE VOCÊ ESTÁ CONSTRUINDO, ME ESCREVA.');
    expect(source).not.toContain('HIRING');
    expect(source).not.toContain('PILOTS');
    expect(source).not.toContain('CONSULTING');
  });
});
