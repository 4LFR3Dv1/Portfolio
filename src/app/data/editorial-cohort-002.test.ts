import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { cohort002Publications } from './editorial-publications-cohort-002';
import { publications } from './editorial-publications-all';
import { getEditorialInquiry } from './editorial-inquiries';
import { getPublicationEditorialContext } from './editorial-state';

const editorialIndex = readFileSync(
  new URL('../../../editorial-shell/publication-src/pages/index.astro', import.meta.url),
  'utf8',
);

describe('Editorial Cohort 002 — essays derived from selected work', () => {
  it('adds five project-derived essays without replacing Cohort 001', () => {
    expect(cohort002Publications.map((publication) => publication.slug)).toEqual([
      'quando-produzir-software-deixa-de-ser-o-gargalo',
      'o-que-faz-uma-presenca-digital-continuar-sendo-a-mesma',
      'o-que-significa-duas-pessoas-estarem-no-mesmo-agora',
      'pagar-e-executar-uma-transacao-ou-cumprir-uma-obrigacao',
      'quando-o-resultado-e-desconhecido-repetir-e-uma-nova-acao',
    ]);
    expect(publications).toHaveLength(8);
  });

  it('keeps every essay bilingual and substantial', () => {
    for (const publication of cohort002Publications) {
      expect(publication.kind).toBe('ESSAY');
      expect(publication.title.pt.length).toBeGreaterThan(20);
      expect(publication.title.en.length).toBeGreaterThan(20);
      expect(publication.copy.pt.sections).toHaveLength(4);
      expect(publication.copy.en.sections).toHaveLength(4);
      for (const section of publication.copy.pt.sections) expect(section.paragraphs).toHaveLength(2);
      for (const section of publication.copy.en.sections) expect(section.paragraphs).toHaveLength(2);
    }
  });

  it('binds the five essays to project-derived inquiries', () => {
    expect(getEditorialInquiry('software-production-bottleneck').publicationSlugs).toEqual([
      'quando-produzir-software-deixa-de-ser-o-gargalo',
    ]);
    expect(getEditorialInquiry('digital-presence-continuity').sourceId).toBe('lisa');
    expect(getEditorialInquiry('shared-now').sourceId).toBe('vira');
    expect(getEditorialInquiry('payment-obligation').sourceId).toBe('foundry-pay-channels');
    expect(getEditorialInquiry('unknown-outcome-repetition').sourceId).toBe('solana-agent');
  });

  it('derives category context for the new essays from their inquiries', () => {
    expect(
      getPublicationEditorialContext('o-que-faz-uma-presenca-digital-continuar-sendo-a-mesma')?.categories.map(
        (category) => category.id,
      ),
    ).toEqual(['agents-interfaces', 'state-time']);
    expect(
      getPublicationEditorialContext('pagar-e-executar-uma-transacao-ou-cumprir-uma-obrigacao')?.categories.map(
        (category) => category.id,
      ),
    ).toEqual(['payments', 'authority-execution']);
  });

  it('makes the new essays directly discoverable on the Editorial index', () => {
    expect(editorialIndex).toContain('const additionalEssays = publications.filter');
    expect(editorialIndex).toContain('MAIS ENSAIOS');
    expect(editorialIndex).toContain('additionalEssays.map((publication, index) =>');
    expect(editorialIndex).toContain('{publications.length}</strong><span>ENSAIOS</span>');
  });
});
