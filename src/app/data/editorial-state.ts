import {
  editorialInquiries,
  getEditorialInquiry,
  type EditorialInquiry,
  type EditorialInquiryId,
} from './editorial-inquiries';
import {
  editorialThreads,
  getEditorialThread,
  type EditorialThread,
  type EditorialThreadId,
} from './editorial-threads';

export interface EditorialState {
  primaryInquiryId: EditorialInquiryId;
  activeInquiryIds: EditorialInquiryId[];
  featuredPublicationSlugs: string[];
  activeThreadIds: EditorialThreadId[];
}

export interface PublicationEditorialContext {
  inquiry: EditorialInquiry;
  threads: EditorialThread[];
}

export const editorialState: EditorialState = {
  primaryInquiryId: 'software-production-bottleneck',
  activeInquiryIds: [
    'software-production-bottleneck',
    'browser-as-environment',
    'where-does-a-network-exist',
    'system-past',
  ],
  featuredPublicationSlugs: [
    'quando-um-navegador-deixa-de-ser-uma-ferramenta',
    'onde-existe-uma-rede',
    'o-passado-de-um-sistema-nao-existe',
  ],
  activeThreadIds: ['software-production', 'agents-interfaces', 'networks', 'state-time'],
};

export function getPrimaryInquiry(): EditorialInquiry {
  return getEditorialInquiry(editorialState.primaryInquiryId);
}

export function getActiveInquiries(): EditorialInquiry[] {
  return editorialState.activeInquiryIds.map(getEditorialInquiry);
}

export function getActiveThreads(): EditorialThread[] {
  return editorialState.activeThreadIds.map(getEditorialThread);
}

export function getThreadInquiries(threadId: EditorialThreadId): EditorialInquiry[] {
  return editorialInquiries.filter((inquiry) => inquiry.threadIds.includes(threadId));
}

export function getPublicationEditorialContext(slug: string): PublicationEditorialContext | null {
  const inquiry = editorialInquiries.find((candidate) => candidate.publicationSlugs.includes(slug));
  if (!inquiry) return null;
  return {
    inquiry,
    threads: inquiry.threadIds.map(getEditorialThread),
  };
}

export function assertEditorialStateIntegrity(publicationSlugs: string[]): void {
  const inquiryIds = new Set(editorialInquiries.map((inquiry) => inquiry.id));
  const threadIds = new Set(editorialThreads.map((thread) => thread.id));
  const knownPublications = new Set(publicationSlugs);

  if (!inquiryIds.has(editorialState.primaryInquiryId)) {
    throw new Error(`Unknown primary inquiry: ${editorialState.primaryInquiryId}`);
  }

  for (const id of editorialState.activeInquiryIds) {
    if (!inquiryIds.has(id)) throw new Error(`Unknown active inquiry: ${id}`);
  }

  for (const id of editorialState.activeThreadIds) {
    if (!threadIds.has(id)) throw new Error(`Unknown active thread: ${id}`);
  }

  for (const inquiry of editorialInquiries) {
    for (const threadId of inquiry.threadIds) {
      if (!threadIds.has(threadId)) throw new Error(`Unknown thread ${threadId} on inquiry ${inquiry.id}`);
    }
    for (const slug of inquiry.publicationSlugs) {
      if (!knownPublications.has(slug)) throw new Error(`Unknown publication ${slug} on inquiry ${inquiry.id}`);
    }
  }

  for (const slug of editorialState.featuredPublicationSlugs) {
    if (!knownPublications.has(slug)) throw new Error(`Unknown featured publication: ${slug}`);
  }
}
