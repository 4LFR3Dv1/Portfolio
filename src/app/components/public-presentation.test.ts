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

  it('presents architecture as one readable page instead of an explorer UI', () => {
    const source = readComponent('architecture-explorer.tsx');

    expect(source).toContain("from '../data/architecture-page'");
    expect(source).toContain('architecturePage.model.steps.map');
    expect(source).toContain('architecturePage.separations.items.map');
    expect(source).toContain('architecturePage.contexts.items.map');
    expect(source).toContain('architecturePage.projects.items.map');
    expect(source).not.toContain('publicArchitectureViews.map');
    expect(source).not.toContain('<ArchitectureMap');
    expect(source).not.toContain('role="tab"');
    expect(source).not.toContain('role="tablist"');
    expect(source).not.toContain('role="tabpanel"');
    expect(source).not.toContain('NEXT QUESTION');
    expect(source).not.toContain('PRÓXIMA PERGUNTA');
    expect(source).not.toContain('SANITIZED PUBLIC VIEW');
    expect(source).not.toContain('TRUST BOUNDARIES');
  });

  it('keeps About present-focused and photo-free', () => {
    const source = readComponent('about-section.tsx');

    expect(source).toContain('I BUILD SOFTWARE TO UNDERSTAND SYSTEMS.');
    expect(source).toContain('CONSTRUO SOFTWARE PARA ENTENDER SISTEMAS.');
    expect(source).not.toContain('<img');
    expect(source).not.toContain('I started in design');
    expect(source).not.toContain('Comecei no design');
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
