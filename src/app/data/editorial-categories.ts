import type { Language } from '../context/language-context';

export type EditorialCategoryId =
  | 'agents-interfaces'
  | 'software-production'
  | 'networks'
  | 'state-time'
  | 'authority-execution'
  | 'payments';

export type EditorialLocalized = Record<Language, string>;

export interface EditorialCategory {
  id: EditorialCategoryId;
  title: EditorialLocalized;
  description: EditorialLocalized;
}

const local = (en: string, pt: string): EditorialLocalized => ({ en, pt });

export const editorialCategories: EditorialCategory[] = [
  {
    id: 'agents-interfaces',
    title: local('Agents and interfaces', 'Agentes e interfaces'),
    description: local(
      'Software, agents and the interfaces through which people and systems meet.',
      'Software, agentes e as interfaces pelas quais pessoas e sistemas se encontram.',
    ),
  },
  {
    id: 'software-production',
    title: local('Software production', 'Produção de software'),
    description: local(
      'How software is specified, produced, reviewed and accepted when implementation gets cheaper.',
      'Como software é especificado, produzido, revisado e aceito quando implementar fica mais barato.',
    ),
  },
  {
    id: 'networks',
    title: local('Networks', 'Redes'),
    description: local(
      'Networks as physical, protocol and observational structures across different layers.',
      'Redes como estruturas físicas, protocolares e observacionais através de diferentes camadas.',
    ),
  },
  {
    id: 'state-time',
    title: local('State and time', 'Estado e tempo'),
    description: local(
      'State, memory, reconstruction, continuity and the abstractions used to describe change.',
      'Estado, memória, reconstrução, continuidade e as abstrações usadas para descrever mudança.',
    ),
  },
  {
    id: 'authority-execution',
    title: local('Authority and execution', 'Autoridade e execução'),
    description: local(
      'The difference between being able to perform an action, being allowed to perform it and knowing what effect actually occurred.',
      'A diferença entre conseguir executar uma ação, estar autorizado a executá-la e saber qual efeito realmente aconteceu.',
    ),
  },
  {
    id: 'payments',
    title: local('Payments', 'Pagamentos'),
    description: local(
      'Obligations, transfers, settlement and the systems that connect economic intent to network effects.',
      'Obrigações, transferências, liquidação e os sistemas que conectam intenção econômica a efeitos de rede.',
    ),
  },
];

export function getEditorialCategory(id: EditorialCategoryId): EditorialCategory {
  const category = editorialCategories.find((candidate) => candidate.id === id);
  if (!category) throw new Error(`Unknown editorial category: ${id}`);
  return category;
}
