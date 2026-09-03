import { describe, expect, it } from 'vitest';
import { publications } from './editorial-publications-all';
import { cohort003Publications } from './editorial-publications-cohort-003';
import { getEditorialInquiry } from './editorial-inquiries';
import { getPublicationEditorialContext } from './editorial-state';

const cohort003Slugs = [
  'onde-um-agente-existe',
  'autonomia-e-uma-propriedade-do-agente-ou-do-sistema',
  'quando-software-deixa-de-ser-aplicacao-e-vira-infraestrutura',
  'como-um-sistema-sabe-que-alguma-coisa-aconteceu',
  'o-estado-e-uma-coisa-ou-uma-afirmacao-sobre-uma-coisa',
  'o-usuario-final-de-um-computador-precisa-ser-humano',
];

describe('Editorial Cohort 003 — Infrastructure, Agency & Reality', () => {
  it('adds six new essays to the accumulated corpus', () => {
    expect(cohort003Publications.map((publication) => publication.slug)).toEqual(cohort003Slugs);
    expect(publications).toHaveLength(14);
    expect(publications.slice(-6)).toEqual(cohort003Publications);
  });

  it('keeps the cohort bilingual, substantial and dated as one publication batch', () => {
    for (const publication of cohort003Publications) {
      expect(publication.kind).toBe('ESSAY');
      expect(publication.publishedAt).toBe('2026-09-03');
      expect(publication.title.pt.length).toBeGreaterThan(15);
      expect(publication.title.en.length).toBeGreaterThan(15);
      expect(publication.copy.pt.sections).toHaveLength(4);
      expect(publication.copy.en.sections).toHaveLength(4);
      for (const section of publication.copy.pt.sections) expect(section.paragraphs).toHaveLength(2);
      for (const section of publication.copy.en.sections) expect(section.paragraphs).toHaveLength(2);
    }
  });

  it('binds every essay to a concrete project-derived inquiry', () => {
    expect(getEditorialInquiry('agent-location').sourceId).toBe('genesis');
    expect(getEditorialInquiry('agent-autonomy').sourceId).toBe('factory');
    expect(getEditorialInquiry('software-infrastructure').sourceId).toBe('factory');
    expect(getEditorialInquiry('system-knowledge').sourceId).toBe('fde-lastro');
    expect(getEditorialInquiry('state-as-claim').sourceId).toBe('causal-substrate');
    expect(getEditorialInquiry('human-end-user').sourceId).toBe('genesis-brineos');
  });

  it('derives existing category context instead of inventing a premature taxonomy', () => {
    expect(
      getPublicationEditorialContext('onde-um-agente-existe')?.categories.map((category) => category.id),
    ).toEqual(['agents-interfaces', 'state-time', 'networks']);
    expect(
      getPublicationEditorialContext('como-um-sistema-sabe-que-alguma-coisa-aconteceu')?.categories.map(
        (category) => category.id,
      ),
    ).toEqual(['state-time', 'authority-execution']);
    expect(
      getPublicationEditorialContext('o-usuario-final-de-um-computador-precisa-ser-humano')?.categories.map(
        (category) => category.id,
      ),
    ).toEqual(['agents-interfaces', 'software-production']);
  });

  it('keeps slugs unique across the complete corpus', () => {
    expect(new Set(publications.map((publication) => publication.slug)).size).toBe(publications.length);
  });
});
