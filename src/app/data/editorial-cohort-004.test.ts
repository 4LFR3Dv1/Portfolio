import { describe, expect, it } from 'vitest';
import { publications } from './editorial-publications-all';
import { cohort004Publications } from './editorial-publications-cohort-004';
import { getEditorialInquiry } from './editorial-inquiries';
import { getPublicationEditorialContext } from './editorial-state';

const cohort004Slugs = [
  'a-abundancia-de-inteligencia-nao-elimina-a-periferia',
  'o-custo-de-tentar-esta-tendendo-a-zero',
  'talvez-empresas-sejam-uma-tecnologia-de-coordenacao-temporaria',
];

describe('Editorial Cohort 004 — Intelligence, Experimentation & Organization', () => {
  it('adds three new essays to the accumulated corpus', () => {
    expect(cohort004Publications.map((publication) => publication.slug)).toEqual(cohort004Slugs);
    expect(publications).toHaveLength(17);
    expect(publications.slice(-3)).toEqual(cohort004Publications);
  });

  it('keeps the cohort bilingual, substantial and dated as one publication batch', () => {
    for (const publication of cohort004Publications) {
      expect(publication.kind).toBe('ESSAY');
      expect(publication.publishedAt).toBe('2026-10-01');
      expect(publication.title.pt.length).toBeGreaterThan(20);
      expect(publication.title.en.length).toBeGreaterThan(20);
      expect(publication.copy.pt.sections).toHaveLength(4);
      expect(publication.copy.en.sections).toHaveLength(4);
      for (const section of publication.copy.pt.sections) expect(section.paragraphs).toHaveLength(2);
      for (const section of publication.copy.en.sections) expect(section.paragraphs).toHaveLength(2);
    }
  });

  it('binds every essay to an explicit inquiry', () => {
    expect(getEditorialInquiry('intelligence-periphery').sourceId).toBe('factory');
    expect(getEditorialInquiry('cheap-attempts').sourceId).toBe('factory');
    expect(getEditorialInquiry('company-coordination').sourceId).toBe('factory');
  });

  it('reuses the current taxonomy while the new territory is still forming', () => {
    expect(
      getPublicationEditorialContext('a-abundancia-de-inteligencia-nao-elimina-a-periferia')?.categories.map(
        (category) => category.id,
      ),
    ).toEqual(['authority-execution', 'software-production']);
    expect(
      getPublicationEditorialContext('o-custo-de-tentar-esta-tendendo-a-zero')?.categories.map(
        (category) => category.id,
      ),
    ).toEqual(['software-production', 'authority-execution']);
    expect(
      getPublicationEditorialContext('talvez-empresas-sejam-uma-tecnologia-de-coordenacao-temporaria')?.categories.map(
        (category) => category.id,
      ),
    ).toEqual(['software-production', 'agents-interfaces', 'authority-execution']);
  });

  it('keeps slugs unique across the complete corpus', () => {
    expect(new Set(publications.map((publication) => publication.slug)).size).toBe(publications.length);
  });
});
