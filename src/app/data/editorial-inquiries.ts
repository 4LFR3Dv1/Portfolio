import type { Language } from '../context/language-context';
import type { EditorialCategoryId } from './editorial-categories';

export type EditorialInquiryId =
  | 'browser-as-environment'
  | 'software-production-bottleneck'
  | 'where-does-a-network-exist'
  | 'system-past'
  | 'digital-presence-continuity'
  | 'shared-now'
  | 'payment-obligation'
  | 'unknown-outcome-repetition';

export type EditorialInquiryState = 'active';
export type EditorialLocalized = Record<Language, string>;

export interface EditorialInquiry {
  id: EditorialInquiryId;
  anchor: string;
  sourceId:
    | 'genesis'
    | 'factory'
    | 'experimental-computing'
    | 'lisa'
    | 'vira'
    | 'foundry-pay-channels'
    | 'solana-agent';
  sourceLabel: EditorialLocalized;
  question: EditorialLocalized;
  summary: EditorialLocalized;
  state: EditorialInquiryState;
  categoryIds: EditorialCategoryId[];
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
    categoryIds: ['agents-interfaces'],
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
    categoryIds: ['software-production', 'agents-interfaces', 'authority-execution'],
    publicationSlugs: ['quando-produzir-software-deixa-de-ser-o-gargalo'],
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
    categoryIds: ['networks'],
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
    categoryIds: ['state-time'],
    publicationSlugs: ['o-passado-de-um-sistema-nao-existe'],
  },
  {
    id: 'digital-presence-continuity',
    anchor: 'estudo-lisa-continuidade',
    sourceId: 'lisa',
    sourceLabel: local('LISA', 'LISA'),
    question: local(
      'What makes a digital presence continue being the same one?',
      'O que faz uma presença digital continuar sendo a mesma?',
    ),
    summary: local(
      'A useful digital presence needs more than good responses. Identity, memory, action, handoff and responsibility have to remain coherent across time and changing contexts.',
      'Uma presença digital útil precisa de mais do que boas respostas. Identidade, memória, ação, handoff e responsabilidade precisam continuar coerentes através do tempo e de contextos diferentes.',
    ),
    state: 'active',
    categoryIds: ['agents-interfaces', 'state-time'],
    publicationSlugs: ['o-que-faz-uma-presenca-digital-continuar-sendo-a-mesma'],
  },
  {
    id: 'shared-now',
    anchor: 'estudo-vira-agora-compartilhado',
    sourceId: 'vira',
    sourceLabel: local('VIRA', 'VIRA'),
    question: local(
      'What does it mean for two people to be in the same now?',
      'O que significa duas pessoas estarem no mesmo agora?',
    ),
    summary: local(
      'Real-time participation requires more than low latency. Different participants need a common event, temporal boundary and resolution while preserving the right local differences.',
      'Participação em tempo real exige mais do que baixa latência. Participantes diferentes precisam de um evento, uma fronteira temporal e uma resolução comuns sem apagar as diferenças locais que devem permanecer privadas.',
    ),
    state: 'active',
    categoryIds: ['state-time', 'networks'],
    publicationSlugs: ['o-que-significa-duas-pessoas-estarem-no-mesmo-agora'],
  },
  {
    id: 'payment-obligation',
    anchor: 'estudo-foundry-obrigacao',
    sourceId: 'foundry-pay-channels',
    sourceLabel: local('FOUNDRY PAY / CHANNELS', 'FOUNDRY PAY / CHANNELS'),
    question: local(
      'Is paying executing a transaction or fulfilling an obligation?',
      'Pagar é executar uma transação ou cumprir uma obrigação?',
    ),
    summary: local(
      'A network transaction is only one piece of a payment. Economic intent, authorization, execution, reconciliation and persistent payment relationships are different states of the same obligation.',
      'Uma transação de rede é apenas uma parte de um pagamento. Intenção econômica, autorização, execução, reconciliação e relações persistentes de pagamento são estados diferentes da mesma obrigação.',
    ),
    state: 'active',
    categoryIds: ['payments', 'authority-execution'],
    publicationSlugs: ['pagar-e-executar-uma-transacao-ou-cumprir-uma-obrigacao'],
  },
  {
    id: 'unknown-outcome-repetition',
    anchor: 'estudo-solana-agent-recovery',
    sourceId: 'solana-agent',
    sourceLabel: local('SOLANA-AGENT', 'SOLANA-AGENT'),
    question: local(
      'When the result is unknown, is repeating a new action?',
      'Quando o resultado é desconhecido, repetir é uma nova ação?',
    ),
    summary: local(
      'A missing response does not prove that an effect did not happen. Agentic execution needs to distinguish retry from recovery and preserve enough identity to investigate the original attempt.',
      'Uma resposta ausente não prova que um efeito não aconteceu. Execução agêntica precisa distinguir retry de recovery e preservar identidade suficiente para investigar a tentativa original.',
    ),
    state: 'active',
    categoryIds: ['authority-execution', 'state-time'],
    publicationSlugs: ['quando-o-resultado-e-desconhecido-repetir-e-uma-nova-acao'],
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
