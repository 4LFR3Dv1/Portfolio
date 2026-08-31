import { describe, expect, it } from 'vitest';
import { editorialInquiries, getEditorialInquiry } from './editorial-inquiries';
import { editorialState, assertEditorialStateIntegrity, getPublicationEditorialContext } from './editorial-state';
import { editorialThreads } from './editorial-threads';
import { publications } from './editorial-publications';

describe('editorial investigation domain', () => {
  it('keeps Inquiry, Thread and Publication identities independent', () => {
    const inquiryIds = editorialInquiries.map((inquiry) => inquiry.id);
    const anchors = editorialInquiries.map((inquiry) => inquiry.anchor);
    const threadIds = editorialThreads.map((thread) => thread.id);

    expect(new Set(inquiryIds).size).toBe(inquiryIds.length);
    expect(new Set(anchors).size).toBe(anchors.length);
    expect(new Set(threadIds).size).toBe(threadIds.length);
    expect(inquiryIds).not.toContain(expect.stringMatching(/^quando-|^onde-|^o-passado/));
  });

  it('accepts the current editorial graph against real publication slugs', () => {
    const slugs = publications.map((publication) => publication.slug);
    expect(() => assertEditorialStateIntegrity(slugs)).not.toThrow();
  });

  it('proves that an Inquiry can remain active after producing a Publication', () => {
    const browser = getEditorialInquiry('browser-as-environment');
    const factory = getEditorialInquiry('software-production-bottleneck');

    expect(browser.state).toBe('active');
    expect(browser.publicationSlugs).toEqual(['quando-um-navegador-deixa-de-ser-uma-ferramenta']);
    expect(factory.state).toBe('active');
    expect(factory.publicationSlugs).toEqual([]);
  });

  it('derives article relationships from the Inquiry graph', () => {
    const network = getPublicationEditorialContext('onde-existe-uma-rede');
    expect(network?.inquiry.id).toBe('where-does-a-network-exist');
    expect(network?.threads.map((thread) => thread.id)).toEqual(['networks']);

    const browser = getPublicationEditorialContext('quando-um-navegador-deixa-de-ser-uma-ferramenta');
    expect(browser?.inquiry.id).toBe('browser-as-environment');
    expect(browser?.threads.map((thread) => thread.id)).toEqual(['agents-interfaces']);
  });

  it('keeps the editorial present explicit rather than inferred from chronology', () => {
    expect(editorialState.primaryInquiryId).toBe('software-production-bottleneck');
    expect(editorialState.activeInquiryIds).toContain(editorialState.primaryInquiryId);
    expect(editorialState.featuredPublicationSlugs).toEqual([
      'quando-um-navegador-deixa-de-ser-uma-ferramenta',
      'onde-existe-uma-rede',
      'o-passado-de-um-sistema-nao-existe',
    ]);
  });
});
