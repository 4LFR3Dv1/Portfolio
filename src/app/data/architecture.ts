import type { Language } from '../context/language-context';

export type ArchitectureViewId = 'systems' | 'settlement' | 'agents' | 'realtime' | 'handoff';
export type ArchitectureStepKind = 'interface' | 'authority' | 'runtime' | 'verification' | 'human';

type Localized<T> = Record<Language, T>;

export interface ArchitectureStep {
  id: string;
  kind: ArchitectureStepKind;
  label: Localized<string>;
  detail: Localized<string>;
}

export interface ArchitectureView {
  id: ArchitectureViewId;
  index: string;
  shortLabel: Localized<string>;
  title: Localized<string>;
  summary: Localized<string>;
  principle: Localized<string>;
  steps: ArchitectureStep[];
  guarantees: Localized<string[]>;
  boundaries: Array<{
    label: Localized<string>;
    detail: Localized<string>;
  }>;
  examples: string[];
}

const localized = <T>(en: T, pt: T): Localized<T> => ({ en, pt });

export const architectureViews: ArchitectureView[] = [
  {
    id: 'systems',
    index: '00',
    shortLabel: localized('System map', 'Mapa de sistemas'),
    title: localized('A portfolio built as connected system layers', 'Um portfólio construído como camadas de sistemas conectadas'),
    summary: localized(
      'Products vary by domain, but the architecture follows one operating model: interfaces propose actions, authoritative services decide, constrained runtimes execute, and independent verification produces evidence.',
      'Os produtos variam por domínio, mas a arquitetura segue um mesmo modelo operacional: interfaces propõem ações, serviços autoritativos decidem, runtimes limitados executam e verificação independente produz evidências.',
    ),
    principle: localized(
      'Intelligence can propose. Deterministic boundaries authorize, execute and verify.',
      'A inteligência pode propor. Fronteiras determinísticas autorizam, executam e verificam.',
    ),
    steps: [
      {
        id: 'product-surfaces',
        kind: 'interface',
        label: localized('Product surfaces', 'Superfícies de produto'),
        detail: localized('Financial, real-time and conversational interfaces', 'Interfaces financeiras, em tempo real e conversacionais'),
      },
      {
        id: 'authority',
        kind: 'authority',
        label: localized('Authoritative state', 'Estado autoritativo'),
        detail: localized('Identity, policy, sessions, deadlines and domain rules', 'Identidade, policy, sessões, prazos e regras de domínio'),
      },
      {
        id: 'runtimes',
        kind: 'runtime',
        label: localized('Constrained runtimes', 'Runtimes limitados'),
        detail: localized('Specialized agents, signers, workers and integrations', 'Agentes especialistas, signers, workers e integrações'),
      },
      {
        id: 'verification',
        kind: 'verification',
        label: localized('External verification', 'Verificação externa'),
        detail: localized('Network state, reconciliation and independently observed outcomes', 'Estado da rede, reconciliação e resultados observados de forma independente'),
      },
      {
        id: 'evidence',
        kind: 'human',
        label: localized('Evidence & operations', 'Evidência e operação'),
        detail: localized('Receipts, journals, review gates and human intervention', 'Receipts, journals, gates de revisão e intervenção humana'),
      },
    ],
    guarantees: localized(
      ['Explicit authority', 'Fail-closed execution', 'Recoverable state', 'Verifiable outcomes'],
      ['Autoridade explícita', 'Execução fail-closed', 'Estado recuperável', 'Resultados verificáveis'],
    ),
    boundaries: [
      {
        label: localized('Product ↔ domain', 'Produto ↔ domínio'),
        detail: localized('Clients render intent; backend services own business state.', 'Clientes apresentam intenção; serviços de backend controlam o estado de negócio.'),
      },
      {
        label: localized('Authority ↔ execution', 'Autoridade ↔ execução'),
        detail: localized('Executors receive narrow capabilities, never unrestricted business authority.', 'Executores recebem capacidades limitadas, nunca autoridade empresarial irrestrita.'),
      },
      {
        label: localized('Execution ↔ truth', 'Execução ↔ verdade'),
        detail: localized('Success is verified against an external source instead of executor claims.', 'O sucesso é verificado contra uma fonte externa, não pela declaração do executor.'),
      },
    ],
    examples: ['Foundry Pay', 'VIRA', 'SNE OS', 'XS Wallet', 'Transactional Support Bot', 'VERIFY SYSTEMS'],
  },
  {
    id: 'settlement',
    index: '01',
    shortLabel: localized('Governed settlement', 'Settlement governado'),
    title: localized('Financial execution with separated authority', 'Execução financeira com autoridade separada'),
    summary: localized(
      'Foundry Pay authorizes the economic effect. A specialized external agent prepares and simulates the network transaction. A signer accepts only the exact authorized bytes, while reconciliation determines the final result.',
      'O Foundry Pay autoriza o efeito econômico. Um agente externo especialista prepara e simula a transação de rede. Um signer aceita apenas os bytes exatos autorizados, enquanto a reconciliação determina o resultado final.',
    ),
    principle: localized(
      'Prepare and simulate → verify → authorize exact bytes → execute → reconcile.',
      'Preparar e simular → verificar → autorizar bytes exatos → executar → reconciliar.',
    ),
    steps: [
      {
        id: 'economic-plan',
        kind: 'interface',
        label: localized('Economic plan', 'Plano econômico'),
        detail: localized('Obligation, asset, amount, destination and constraints', 'Obrigação, ativo, valor, destino e restrições'),
      },
      {
        id: 'economic-policy',
        kind: 'authority',
        label: localized('Policy & approval', 'Policy e aprovação'),
        detail: localized('Global authorization bound to the approved plan', 'Autorização global vinculada ao plano aprovado'),
      },
      {
        id: 'prepare',
        kind: 'runtime',
        label: localized('Prepare & simulate', 'Preparar e simular'),
        detail: localized('External executor materializes the exact message', 'Executor externo materializa a mensagem exata'),
      },
      {
        id: 'commitment',
        kind: 'authority',
        label: localized('Execution authorization', 'Autorização de execução'),
        detail: localized('Short-lived, single-use and bound to message bytes', 'Curta, single-use e vinculada aos bytes da mensagem'),
      },
      {
        id: 'signer',
        kind: 'runtime',
        label: localized('Signer boundary', 'Fronteira do signer'),
        detail: localized('Signs the authorized commitment only', 'Assina somente o commitment autorizado'),
      },
      {
        id: 'broadcast',
        kind: 'runtime',
        label: localized('Broadcast & recovery', 'Broadcast e recuperação'),
        detail: localized('Signature-first persistence with no blind retry', 'Persistência signature-first, sem retry cego'),
      },
      {
        id: 'reconcile',
        kind: 'verification',
        label: localized('Reconciliation', 'Reconciliação'),
        detail: localized('Independent observation of the economic effect', 'Observação independente do efeito econômico'),
      },
      {
        id: 'bundle',
        kind: 'human',
        label: localized('Evidence bundle', 'Bundle de evidências'),
        detail: localized('Correlated authorization, execution and observations', 'Autorização, execução e observações correlacionadas'),
      },
    ],
    guarantees: localized(
      ['Exact-message authorization', 'Single-use grant', 'At-most-one controlled broadcast', 'Independent reconciliation'],
      ['Autorização da mensagem exata', 'Grant single-use', 'No máximo um broadcast controlado', 'Reconciliação independente'],
    ),
    boundaries: [
      {
        label: localized('Foundry Pay', 'Foundry Pay'),
        detail: localized('Owns economic authority, approval and final outcome.', 'Controla autoridade econômica, aprovação e resultado final.'),
      },
      {
        label: localized('External execution agent', 'Agente externo de execução'),
        detail: localized('Owns local safety, preparation, broadcast and technical recovery.', 'Controla segurança local, preparação, broadcast e recuperação técnica.'),
      },
      {
        label: localized('Signer & reconciler', 'Signer e reconciliador'),
        detail: localized('Sign and observe without inheriting orchestration authority.', 'Assinam e observam sem herdar autoridade de orquestração.'),
      },
    ],
    examples: ['Foundry Pay', 'Solana Agent', 'ExternalExecutionAgent', 'FP-REC', 'Evidence Verifier'],
  },
  {
    id: 'agents',
    index: '02',
    shortLabel: localized('Agent operations', 'Operação agêntica'),
    title: localized('Agents work inside an explicit control plane', 'Agentes trabalham dentro de um control plane explícito'),
    summary: localized(
      'Agentic work is modeled as inspectable work items with bounded context, review gates and preserved evidence. Agents can produce changes, but decisions and mutation authority remain explicit.',
      'O trabalho agêntico é modelado como work items inspecionáveis, com contexto limitado, gates de revisão e evidência preservada. Agentes podem produzir mudanças, mas decisões e autoridade de mutação permanecem explícitas.',
    ),
    principle: localized(
      'Plan → delegate → inspect → review → merge → preserve evidence.',
      'Planejar → delegar → inspecionar → revisar → integrar → preservar evidência.',
    ),
    steps: [
      {
        id: 'work-item',
        kind: 'interface',
        label: localized('Work item', 'Work item'),
        detail: localized('Goal, scope, acceptance criteria and dependencies', 'Objetivo, escopo, critérios de aceite e dependências'),
      },
      {
        id: 'orchestration',
        kind: 'authority',
        label: localized('Orchestration', 'Orquestração'),
        detail: localized('Priorities, context and capability assignment', 'Prioridades, contexto e atribuição de capacidades'),
      },
      {
        id: 'agent-runtime',
        kind: 'runtime',
        label: localized('Agent runtime', 'Runtime de agentes'),
        detail: localized('Bounded implementation and tool use', 'Implementação e uso de ferramentas limitados'),
      },
      {
        id: 'review',
        kind: 'human',
        label: localized('Review gate', 'Gate de revisão'),
        detail: localized('Tests, findings, decisions and human judgment', 'Testes, findings, decisões e julgamento humano'),
      },
      {
        id: 'mutation',
        kind: 'authority',
        label: localized('Controlled mutation', 'Mutação controlada'),
        detail: localized('Approved changes enter the canonical branch', 'Mudanças aprovadas entram na branch canônica'),
      },
      {
        id: 'agent-evidence',
        kind: 'verification',
        label: localized('Evidence trail', 'Trilha de evidências'),
        detail: localized('Commits, checks, artifacts and provenance', 'Commits, checks, artefatos e proveniência'),
      },
    ],
    guarantees: localized(
      ['Bounded capability', 'Explicit review', 'Canonical main', 'Preserved provenance'],
      ['Capacidade limitada', 'Revisão explícita', 'Main canônica', 'Proveniência preservada'],
    ),
    boundaries: [
      {
        label: localized('Intent ↔ work', 'Intenção ↔ trabalho'),
        detail: localized('Goals become testable work items before implementation.', 'Objetivos viram work items testáveis antes da implementação.'),
      },
      {
        label: localized('Agent ↔ mutation', 'Agente ↔ mutação'),
        detail: localized('Producing a patch and approving it are separate capabilities.', 'Produzir um patch e aprová-lo são capacidades separadas.'),
      },
      {
        label: localized('Execution ↔ record', 'Execução ↔ registro'),
        detail: localized('Completed work is tied to checks, commits and review decisions.', 'Trabalho concluído é vinculado a checks, commits e decisões de revisão.'),
      },
    ],
    examples: ['Agentic Systems & Foundry', 'Work Graph', 'Review Contracts', 'CI Evidence'],
  },
  {
    id: 'realtime',
    index: '03',
    shortLabel: localized('Real-time product', 'Produto em tempo real'),
    title: localized('Server-authoritative real-time experiences', 'Experiências em tempo real com servidor autoritativo'),
    summary: localized(
      'The client stays responsive by rendering projections, while the server owns admission, deadlines, deterministic resolution and ranking. Reconnects recover canonical state instead of trusting stale client memory.',
      'O cliente permanece responsivo ao renderizar projeções, enquanto o servidor controla admissão, prazos, resolução determinística e ranking. Reconexões recuperam o estado canônico em vez de confiar na memória desatualizada do cliente.',
    ),
    principle: localized(
      'The browser renders. The server decides. The event trail explains.',
      'O navegador renderiza. O servidor decide. A trilha de eventos explica.',
    ),
    steps: [
      {
        id: 'observation',
        kind: 'runtime',
        label: localized('Observation stream', 'Stream de observações'),
        detail: localized('Live domain signals enter the runtime', 'Sinais vivos do domínio entram no runtime'),
      },
      {
        id: 'canonical-state',
        kind: 'authority',
        label: localized('Canonical state', 'Estado canônico'),
        detail: localized('Server owns clocks, admission and lifecycle', 'Servidor controla relógios, admissão e ciclo de vida'),
      },
      {
        id: 'projection',
        kind: 'interface',
        label: localized('Client projection', 'Projeção no cliente'),
        detail: localized('Responsive UI derived from server state', 'UI responsiva derivada do estado do servidor'),
      },
      {
        id: 'resolution',
        kind: 'authority',
        label: localized('Deterministic resolution', 'Resolução determinística'),
        detail: localized('Domain rules resolve outcomes once', 'Regras de domínio resolvem resultados uma vez'),
      },
      {
        id: 'sync',
        kind: 'verification',
        label: localized('Reconnect & replay', 'Reconexão e replay'),
        detail: localized('Clients recover the latest authoritative snapshot', 'Clientes recuperam o snapshot autoritativo mais recente'),
      },
      {
        id: 'audit',
        kind: 'human',
        label: localized('Operational trail', 'Trilha operacional'),
        detail: localized('Events explain state changes and disputes', 'Eventos explicam mudanças de estado e disputas'),
      },
    ],
    guarantees: localized(
      ['Server authority', 'Deterministic deadlines', 'Reconnect safety', 'Explainable resolution'],
      ['Autoridade no servidor', 'Prazos determinísticos', 'Reconexão segura', 'Resolução explicável'],
    ),
    boundaries: [
      {
        label: localized('Client ↔ server', 'Cliente ↔ servidor'),
        detail: localized('Optimistic rendering never becomes business authority.', 'Renderização otimista nunca vira autoridade de negócio.'),
      },
      {
        label: localized('Observation ↔ outcome', 'Observação ↔ resultado'),
        detail: localized('Input events and domain resolution remain separate concerns.', 'Eventos de entrada e resolução de domínio permanecem responsabilidades separadas.'),
      },
      {
        label: localized('Session ↔ recovery', 'Sessão ↔ recuperação'),
        detail: localized('Reconnect uses canonical snapshots rather than client reconstruction.', 'Reconexão usa snapshots canônicos, não reconstrução pelo cliente.'),
      },
    ],
    examples: ['VIRA', 'Live observations', 'Synchronized challenges', 'Deterministic ranking'],
  },
  {
    id: 'handoff',
    index: '04',
    shortLabel: localized('Transactional handoff', 'Handoff transacional'),
    title: localized('Conversation backed by transactional state', 'Conversa sustentada por estado transacional'),
    summary: localized(
      'A product request becomes an expiring backend session before entering a messaging channel. Identity binding, explicit transitions and idempotent delivery keep the conversation operationally safe.',
      'Uma solicitação do produto vira uma sessão com expiração no backend antes de entrar em um canal de mensagens. Vínculo de identidade, transições explícitas e entrega idempotente mantêm a conversa operacionalmente segura.',
    ),
    principle: localized(
      'Chat is an interface. The backend remains the source of truth.',
      'O chat é uma interface. O backend permanece a fonte de verdade.',
    ),
    steps: [
      {
        id: 'request',
        kind: 'interface',
        label: localized('Product request', 'Solicitação no produto'),
        detail: localized('Structured intent created in the product', 'Intenção estruturada criada no produto'),
      },
      {
        id: 'session',
        kind: 'authority',
        label: localized('Expiring session', 'Sessão com expiração'),
        detail: localized('Persistent state with a random identifier', 'Estado persistente com identificador aleatório'),
      },
      {
        id: 'deep-link',
        kind: 'runtime',
        label: localized('Secure handoff', 'Handoff seguro'),
        detail: localized('Messaging interface recovers the session', 'Interface de mensagens recupera a sessão'),
      },
      {
        id: 'identity',
        kind: 'authority',
        label: localized('Review & identity', 'Revisão e identidade'),
        detail: localized('First account binds and reviews the request', 'Primeira conta vincula e revisa a solicitação'),
      },
      {
        id: 'transition',
        kind: 'runtime',
        label: localized('Confirm or cancel', 'Confirmar ou cancelar'),
        detail: localized('Idempotent transition under backend rules', 'Transição idempotente sob regras do backend'),
      },
      {
        id: 'support',
        kind: 'human',
        label: localized('Human support', 'Atendimento humano'),
        detail: localized('Provider-neutral delivery with operational trace', 'Entrega independente de provedor com trilha operacional'),
      },
    ],
    guarantees: localized(
      ['Persistent session', 'Identity binding', 'Idempotent confirmation', 'Human escalation'],
      ['Sessão persistente', 'Vínculo de identidade', 'Confirmação idempotente', 'Escalonamento humano'],
    ),
    boundaries: [
      {
        label: localized('Product ↔ messaging', 'Produto ↔ mensageria'),
        detail: localized('A secure session replaces fragile text-based context.', 'Uma sessão segura substitui contexto textual frágil.'),
      },
      {
        label: localized('Messaging ↔ domain', 'Mensageria ↔ domínio'),
        detail: localized('Callbacks request transitions; the backend validates them.', 'Callbacks solicitam transições; o backend as valida.'),
      },
      {
        label: localized('Domain ↔ provider', 'Domínio ↔ provedor'),
        detail: localized('A provider adapter cannot redefine the conversational workflow.', 'Um adapter de provedor não pode redefinir o fluxo conversacional.'),
      },
    ],
    examples: ['Transactional Support Bot', 'Persistent sessions', 'Structured webhooks', 'Support handoff'],
  },
];

export function getArchitectureView(id: string | null): ArchitectureView {
  return architectureViews.find((view) => view.id === id) ?? architectureViews[0];
}
