import { describe, expect, it } from 'vitest';
import { editorialCategories } from './editorial-categories';
import { editorialInquiries, getEditorialInquiry } from './editorial-inquiries';
import { editorialState, assertEditorialStateIntegrity, getPublicationEditorialContext } from './editorial-state';
import { publications } from './editorial-publications-all';

describe('editorial investigation domain', () => {
  it('keeps Inquiry, Category and Publication identities independent', () => {
    const inquiryIds = editorialInquiries.map((inquiry) => inquiry.id);
    const anchors = editorialInquiries.map((inquiry) => inquiry.anchor);
    const categoryIds = editorialCategories.map((category) => category.id);

    expect(new Set(inquiryIds).size).toBe(inquiryIds.length);
    expect(new Set(anchors).size).toBe(anchors.length);
    expect(new Set(categoryIds).size).toBe(categoryIds.length);
    for (const inquiryId of inquiryIds) {
      expect(inquiryId).not.toMatch(/^quando-|^onde-|^o-passado/);
    }
  });

  it('accepts the current editorial taxonomy against every publication slug', () => {
    const slugs = publications.map((publication) => publication.slug);
    expect(slugs).toHaveLength(8);
    expect(() => assertEditorialStateIntegrity(slugs)).not.toThrow();
  });

  it('proves that an Inquiry can remain active after producing a Publication', () => {
    const browser = getEditorialInquiry('browser-as-environment');
    const factory = getEditorialInquiry('software-production-bottleneck');

    expect(browser.state).toBe('active');
    expect(browser.publicationSlugs).toEqual(['quando-um-navegador-deixa-de-ser-uma-ferramenta']);
    expect(factory.state).toBe('active');
    expect(factory.publicationSlugs).toEqual(['quando-produzir-software-deixa-de-ser-o-gargalo']);
  });

  it('derives article categories from the Inquiry taxonomy', () => {
    const network = getPublicationEditorialContext('onde-existe-uma-rede');
    expect(network?.inquiry.id).toBe('where-does-a-network-exist');
    expect(network?.categories.map((category) => category.id)).toEqual(['networks']);

    const browser = getPublicationEditorialContext('quando-um-navegador-deixa-de-ser-uma-ferramenta');
    expect(browser?.inquiry.id).toBe('browser-as-environment');
    expect(browser?.categories.map((category) => category.id)).toEqual(['agents-interfaces']);

    const payment = getPublicationEditorialContext('pagar-e-executar-uma-transacao-ou-cumprir-uma-obrigacao');
    expect(payment?.inquiry.id).toBe('payment-obligation');
    expect(payment?.categories.map((category) => category.id)).toEqual(['payments', 'authority-execution']);
  });

  it('keeps the editorial present explicit rather than inferred from chronology', () => {
    expect(editorialState.primaryInquiryId).toBe('software-production-bottleneck');
    expect(editorialState.activeInquiryIds).toContain(editorialState.primaryInquiryId);
    expect(editorialState.activeInquiryIds).toHaveLength(8);
    expect(editorialState.activeCategoryIds).toEqual([
      'software-production',
      'agents-interfaces',
      'authority-execution',
      'payments',
      'networks',
      'state-time',
    ]);
    expect(editorialState.featuredPublicationSlugs).toEqual([
      'quando-um-navegador-deixa-de-ser-uma-ferramenta',
      'onde-existe-uma-rede',
      'o-passado-de-um-sistema-nao-existe',
    ]);
  });
});
