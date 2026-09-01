import type { Language } from '../context/language-context';
import {
  getEditorialInquiry,
  getInquiryHref,
  getInquiryPublicationState,
  type EditorialInquiryId,
} from './editorial-inquiries';

type Localized = Record<Language, string>;

export interface CurrentStudyLink {
  inquiryId: EditorialInquiryId;
  title: Localized;
  state: Localized;
  href: string;
}

export interface CurrentFocusItem {
  id: string;
  name: Localized;
  state: Localized;
  description: Localized;
  inquiryIds: EditorialInquiryId[];
  studies: CurrentStudyLink[];
}

interface CurrentFocusDefinition {
  id: string;
  name: Localized;
  state: Localized;
  description: Localized;
  inquiryIds: EditorialInquiryId[];
}

const local = (en: string, pt: string): Localized => ({ en, pt });

const currentFocusDefinitions: CurrentFocusDefinition[] = [
  {
    id: 'genesis',
    name: local('Genesis', 'Genesis'),
    state: local('IN DEVELOPMENT', 'EM DESENVOLVIMENTO'),
    description: local(
      'An experimental browser exploring how AI can understand pages, act inside real software and continue work without reducing the web to automated clicks.',
      'Um navegador experimental que explora como IA pode compreender páginas, agir dentro de software real e continuar trabalho sem reduzir a web a cliques automatizados.',
    ),
    inquiryIds: ['browser-as-environment'],
  },
  {
    id: 'factory',
    name: local('Factory', 'Factory'),
    state: local('IN DEVELOPMENT', 'EM DESENVOLVIMENTO'),
    description: local(
      'A software-production environment for delegating implementation to AI agents while keeping scope, review and integration visible.',
      'Um ambiente de produção de software para delegar implementação a agentes de IA mantendo escopo, revisão e integração visíveis.',
    ),
    inquiryIds: ['software-production-bottleneck'],
  },
  {
    id: 'experimental-computing',
    name: local('Experimental computing', 'Computação experimental'),
    state: local('ACTIVE RESEARCH', 'PESQUISA ATIVA'),
    description: local(
      'Networks, state, time and abstraction investigated through concrete software and hardware experiments.',
      'Redes, estado, tempo e abstrações investigados a partir de experimentos concretos em software e hardware.',
    ),
    inquiryIds: ['where-does-a-network-exist', 'system-past'],
  },
];

export const currentFocus: CurrentFocusItem[] = currentFocusDefinitions.map((item) => ({
  ...item,
  studies: item.inquiryIds.map((inquiryId) => {
    const inquiry = getEditorialInquiry(inquiryId);
    return {
      inquiryId,
      title: inquiry.question,
      state: getInquiryPublicationState(inquiry),
      href: getInquiryHref(inquiry),
    };
  }),
}));
