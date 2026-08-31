import type { Language } from '../context/language-context';
import type { EditorialThreadId } from './editorial-threads';

export type EditorialInquiryId =
  | 'browser-as-environment'
  | 'software-production-bottleneck'
  | 'where-does-a-network-exist'
  | 'system-past';

export type EditorialInquiryState = 'active';
export type EditorialLocalized = Record<Language, string>;

export interface EditorialInquiry {
  id: EditorialInquiryId;
  anchor: string;
  sourceId: 'genesis' | 'factory' | 'experimental-computing';
  sourceLabel: EditorialLocalized;
  question: EditorialLocalized;
  summary: EditorialLocalized;
  state: EditorialInquiryState;
  threadIds: EditorialThreadId[];
  publicationSlugs: string[];
}

const local = (en: string, pt: string): EditorialLocalized => ({ en, pt });

export const editorialInquiries: EditorialInquiry[] = [
  {
    id: 'browser-as-environment',
    anchor: 'estudo-navegador-agentes',
    sourceId: 'genesis',
    sourceLabel: local('GENESIS', 'GENESIS'),
    question: local(
      'When does a browser stop being a tool?',
      'Quando um navegador deixa de ser uma ferramenta?',
    ),
    summary: local(
      'The relationship between AI agents and the browser is still changing while the system is built. This question asks what happens when software needs a real place inside the environment it uses.',
      'A relação entre agentes de IA e o navegador continua mudando enquanto o sistema é construído. Esta pergunta investiga o que acontece quando software passa a precisar de um lugar real dentro do ambiente que utiliza.',
    ),
    state: 'active',
    threadIds: ['agents-interfaces'],
    publicationSlugs: ['quando-um-navegador-deixa-de-ser-uma-ferramenta'],
  },
  {
    id: 'software-production-bottleneck',
    anchor: 'estudo-software-agentes',
    sourceId: 'factory',
    sourceLabel: local('FACTORY', 'FACTORY'),
    question: local(
      'What changes when producing software stops being the bottleneck?',
      'O que muda quando produzir software deixa de ser o gargalo?',
    ),
    summary: local(
      'When agents can implement changes quickly, the scarce work moves toward deciding what should exist, bounding the task, reviewing the result and absorbing it without turning speed into noise.',
      'Quando agentes conseguem implementar mudanças rapidamente, o trabalho escasso passa a ser decidir o que deve existir, delimitar a tarefa, revisar o resultado e absorvê-lo sem transformar velocidade em ruído.',
    ),
    state: 'active',
    threadIds: ['software-production', 'agents-interfaces'],
    publicationSlugs: [],
  },
  {
    id: 'where-does-a-network-exist',
    anchor: 'estudo-rede',
    sourceId: 'experimental-computing',
    sourceLabel: local('EXPERIMENTAL COMPUTING', 'COMPUTAÇÃO EXPERIMENTAL'),
    question: local('Where does a network exist?', 'Onde existe uma rede?'),
    summary: local(
      'A network changes shape depending on the observer: application, operating system, controller, protocol or physical medium. The inquiry remains open beyond the first essay.',
      'Uma rede muda de forma dependendo do observador: aplicação, sistema operacional, controlador, protocolo ou meio físico. A investigação continua aberta além do primeiro ensaio.',
    ),
    state: 'active',
    threadIds: ['networks'],
    publicationSlugs: ['onde-existe-uma-rede'],
  },
  {
    id: 'system-past',
    anchor: 'estudo-estado-tempo',
    sourceId: 'experimental-computing',
    sourceLabel: local('EXPERIMENTAL COMPUTING', 'COMPUTAÇÃO EXPERIMENTAL'),
    question: local("Does a system's past exist?", 'O passado de um sistema existe?'),
    summary: local(
      'Systems preserve traces, not the past itself. The inquiry explores what memory, reconstruction and continuity mean when the machine only ever exposes a present state.',
      'Sistemas preservam rastros, não o passado em si. A investigação explora o que memória, reconstrução e continuidade significam quando a máquina só expõe um estado presente.',
    ),
    state: 'active',
    threadIds: ['state-time'],
    publicationSlugs: ['o-passado-de-um-sistema-nao-existe'],
  },
];

export function getEditorialInquiry(id: EditorialInquiryId): EditorialInquiry {
  const inquiry = editorialInquiries.find((candidate) => candidate.id === id);
  if (!inquiry) throw new Error(`Unknown editorial inquiry: ${id}`);
  return inquiry;
}

export function getInquiryHref(inquiry: EditorialInquiry): string {
  const publication = inquiry.publicationSlugs[0];
  return publication ? `/editorial/${publication}/` : `/editorial/#${inquiry.anchor}`;
}

export function getInquiryPublicationState(inquiry: EditorialInquiry): EditorialLocalized {
  return inquiry.publicationSlugs.length > 0
    ? local('PUBLISHED ESSAY', 'ENSAIO PUBLICADO')
    : local('OPEN STUDY', 'ESTUDO ABERTO');
}
