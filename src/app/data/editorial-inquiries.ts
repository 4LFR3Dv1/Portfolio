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
  | 'unknown-outcome-repetition'
  | 'agent-location'
  | 'agent-autonomy'
  | 'software-infrastructure'
  | 'system-knowledge'
  | 'state-as-claim'
  | 'human-end-user';

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
    | 'solana-agent'
    | 'fde-lastro'
    | 'causal-substrate'
    | 'genesis-brineos';
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
  {
    id: 'agent-location',
    anchor: 'estudo-onde-agente-existe',
    sourceId: 'genesis',
    sourceLabel: local('GENESIS', 'GENESIS'),
    question: local('Where does an agent exist?', 'Onde um agente existe?'),
    summary: local(
      'A model call, durable state, tools, sandboxes and external effects may all live in different places. This inquiry treats an agent as an operational identity distributed across those boundaries.',
      'Uma chamada de modelo, estado durável, ferramentas, sandboxes e efeitos externos podem existir em lugares diferentes. Esta investigação trata o agente como uma identidade operacional distribuída entre essas fronteiras.',
    ),
    state: 'active',
    categoryIds: ['agents-interfaces', 'state-time', 'networks'],
    publicationSlugs: ['onde-um-agente-existe'],
  },
  {
    id: 'agent-autonomy',
    anchor: 'estudo-autonomia-agente-sistema',
    sourceId: 'factory',
    sourceLabel: local('FACTORY', 'FACTORY'),
    question: local(
      'Is autonomy a property of the agent or of the system around it?',
      'Autonomia é uma propriedade do agente ou do sistema ao redor dele?',
    ),
    summary: local(
      'Model capability does not create authority. The amount of independent action a system can safely sustain depends on permissions, transition rules, evidence and acceptance outside the model itself.',
      'Capacidade do modelo não cria autoridade. A quantidade de ação independente que um sistema consegue sustentar com segurança depende de permissões, regras de transição, evidência e aceitação fora do próprio modelo.',
    ),
    state: 'active',
    categoryIds: ['authority-execution', 'agents-interfaces'],
    publicationSlugs: ['autonomia-e-uma-propriedade-do-agente-ou-do-sistema'],
  },
  {
    id: 'software-infrastructure',
    anchor: 'estudo-software-infraestrutura',
    sourceId: 'factory',
    sourceLabel: local('FACTORY', 'FACTORY'),
    question: local(
      'When does software stop being an application and become infrastructure?',
      'Quando software deixa de ser aplicação e vira infraestrutura?',
    ),
    summary: local(
      'Software becomes infrastructural when other systems begin depending on its contracts, state models and execution rules as conditions for their own existence.',
      'Software se torna infraestrutura quando outros sistemas passam a depender de seus contratos, modelos de estado e regras de execução como condições para a própria existência.',
    ),
    state: 'active',
    categoryIds: ['software-production', 'authority-execution'],
    publicationSlugs: ['quando-software-deixa-de-ser-aplicacao-e-vira-infraestrutura'],
  },
  {
    id: 'system-knowledge',
    anchor: 'estudo-sistema-sabe-aconteceu',
    sourceId: 'fde-lastro',
    sourceLabel: local('SNE-FDE / LASTRO', 'SNE-FDE / LASTRO'),
    question: local(
      'How does a system know that something happened?',
      'Como um sistema sabe que alguma coisa aconteceu?',
    ),
    summary: local(
      'Reliable knowledge requires separating an external event from the observation, preserved evidence, interpretation and admitted claim the system uses to reason about it.',
      'Conhecimento confiável exige separar um acontecimento externo da observação, evidência preservada, interpretação e claim admitido que o sistema usa para raciocinar sobre ele.',
    ),
    state: 'active',
    categoryIds: ['state-time', 'authority-execution'],
    publicationSlugs: ['como-um-sistema-sabe-que-alguma-coisa-aconteceu'],
  },
  {
    id: 'state-as-claim',
    anchor: 'estudo-estado-claim',
    sourceId: 'causal-substrate',
    sourceLabel: local('SNE CAUSAL SUBSTRATE', 'SNE CAUSAL SUBSTRATE'),
    question: local(
      'Is state a thing or a claim about a thing?',
      'O estado é uma coisa ou uma afirmação sobre uma coisa?',
    ),
    summary: local(
      'Internal state can be directly material while external state often arrives as claims supported, corrected, contradicted or superseded by evidence and temporal relations.',
      'Estado interno pode ser diretamente material enquanto estado externo frequentemente chega como claims sustentados, corrigidos, contraditos ou substituídos por evidência e relações temporais.',
    ),
    state: 'active',
    categoryIds: ['state-time', 'authority-execution'],
    publicationSlugs: ['o-estado-e-uma-coisa-ou-uma-afirmacao-sobre-uma-coisa'],
  },
  {
    id: 'human-end-user',
    anchor: 'estudo-usuario-final-humano',
    sourceId: 'genesis-brineos',
    sourceLabel: local('GENESIS / BRINEOS', 'GENESIS / BRINEOS'),
    question: local(
      'Does the end user of a computer need to be human?',
      'O usuário final de um computador precisa ser humano?',
    ),
    summary: local(
      'Graphical computing encodes a human participant. Agents create pressure for machine-native interfaces to the same underlying capabilities without removing human authority from the system.',
      'Computação gráfica codifica um participante humano. Agentes criam pressão por interfaces machine-native para as mesmas capacidades subjacentes sem remover autoridade humana do sistema.',
    ),
    state: 'active',
    categoryIds: ['agents-interfaces', 'software-production'],
    publicationSlugs: ['o-usuario-final-de-um-computador-precisa-ser-humano'],
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
