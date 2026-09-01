import {
  editorialInquiries,
  getEditorialInquiry,
  type EditorialInquiry,
  type EditorialInquiryId,
} from './editorial-inquiries';
import {
  editorialCategories,
  getEditorialCategory,
  type EditorialCategory,
  type EditorialCategoryId,
} from './editorial-categories';

export interface EditorialState {
  primaryInquiryId: EditorialInquiryId;
  activeInquiryIds: EditorialInquiryId[];
  featuredPublicationSlugs: string[];
  activeCategoryIds: EditorialCategoryId[];
}

export interface PublicationEditorialContext {
  inquiry: EditorialInquiry;
  categories: EditorialCategory[];
}

export const editorialState: EditorialState = {
  primaryInquiryId: 'software-production-bottleneck',
  activeInquiryIds: [
    'software-production-bottleneck',
    'browser-as-environment',
    'digital-presence-continuity',
    'shared-now',
    'payment-obligation',
    'unknown-outcome-repetition',
    'where-does-a-network-exist',
    'system-past',
  ],
  featuredPublicationSlugs: [
    'quando-um-navegador-deixa-de-ser-uma-ferramenta',
    'onde-existe-uma-rede',
    'o-passado-de-um-sistema-nao-existe',
  ],
  activeCategoryIds: [
    'software-production',
    'agents-interfaces',
    'authority-execution',
    'payments',
    'networks',
    'state-time',
  ],
};

export function getPrimaryInquiry(): EditorialInquiry {
  return getEditorialInquiry(editorialState.primaryInquiryId);
}

export function getActiveInquiries(): EditorialInquiry[] {
  return editorialState.activeInquiryIds.map(getEditorialInquiry);
}

export function getActiveCategories(): EditorialCategory[] {
  return editorialState.activeCategoryIds.map(getEditorialCategory);
}

export function getCategoryInquiries(categoryId: EditorialCategoryId): EditorialInquiry[] {
  return editorialInquiries.filter((inquiry) => inquiry.categoryIds.includes(categoryId));
}

export function getPublicationEditorialContext(slug: string): PublicationEditorialContext | null {
  const inquiry = editorialInquiries.find((candidate) => candidate.publicationSlugs.includes(slug));
  if (!inquiry) return null;
  return {
    inquiry,
    categories: inquiry.categoryIds.map(getEditorialCategory),
  };
}

export function assertEditorialStateIntegrity(publicationSlugs: string[]): void {
  const inquiryIds = new Set(editorialInquiries.map((inquiry) => inquiry.id));
  const categoryIds = new Set(editorialCategories.map((category) => category.id));
  const knownPublications = new Set(publicationSlugs);

  if (!inquiryIds.has(editorialState.primaryInquiryId)) {
    throw new Error(`Unknown primary inquiry: ${editorialState.primaryInquiryId}`);
  }

  for (const id of editorialState.activeInquiryIds) {
    if (!inquiryIds.has(id)) throw new Error(`Unknown active inquiry: ${id}`);
  }

  for (const id of editorialState.activeCategoryIds) {
    if (!categoryIds.has(id)) throw new Error(`Unknown active category: ${id}`);
  }

  for (const inquiry of editorialInquiries) {
    for (const categoryId of inquiry.categoryIds) {
      if (!categoryIds.has(categoryId)) throw new Error(`Unknown category ${categoryId} on inquiry ${inquiry.id}`);
    }
    for (const slug of inquiry.publicationSlugs) {
      if (!knownPublications.has(slug)) throw new Error(`Unknown publication ${slug} on inquiry ${inquiry.id}`);
    }
  }

  for (const slug of editorialState.featuredPublicationSlugs) {
    if (!knownPublications.has(slug)) throw new Error(`Unknown featured publication: ${slug}`);
  }
}
