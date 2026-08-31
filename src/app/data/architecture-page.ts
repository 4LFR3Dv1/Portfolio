import type { Language } from '../context/language-context';

type Localized = Record<Language, string>;

const localized = (en: string, pt: string): Localized => ({ en, pt });

export interface ArchitectureModelStep {
  id: string;
  label: Localized;
  question: Localized;
}

export interface ArchitectureSeparation {
  label: Localized;
  detail: Localized;
}

export interface ArchitectureContext {
  id: 'payments' | 'agents' | 'realtime' | 'people';
  legacyView: 'settlement' | 'agents' | 'realtime' | 'handoff';
  label: Localized;
  body: Localized;
  question: Localized;
}

export interface ArchitectureProjectLink {
  label: Localized;
  href: string;
  external?: boolean;
}

export interface ArchitectureProject {
  name: string;
  description: Localized;
  links: ArchitectureProjectLink[];
}

export const architecturePage = {
  hero: {
    eyebrow: localized('ARCHITECTURE', 'ARQUITETURA'),
    title: localized(
      'How I turn an idea into a system I can understand, operate and change.',
      'Como transformo uma ideia em um sistema que consigo entender, operar e mudar.',
    ),
    intro: localized(
      'Different products need different architectures. What tends to repeat are a few decisions: where state lives, who decides what can happen, where an action is performed, and how the result returns to the rest of the system.',
      'Produtos diferentes exigem arquiteturas diferentes. O que costuma se repetir são algumas decisões: onde o estado vive, quem decide o que pode acontecer, onde uma ação é executada e como o resultado volta para o restante do sistema.',
    ),
  },
  model: {
    eyebrow: localized('FROM IDEA TO RESULT', 'DA IDEIA AO RESULTADO'),
    intro: localized(
      'Interfaces, agents, backends, networks and people can occupy different places in this path. Architecture starts by deciding who should do what.',
      'Interfaces, agentes, backends, redes e pessoas podem ocupar lugares diferentes nesse caminho. A arquitetura começa decidindo quem deve fazer o quê.',
    ),
    steps: [
      {
        id: 'intent',
        label: localized('Intent', 'Intenção'),
        question: localized('What are we trying to make happen?', 'O que estamos tentando fazer acontecer?'),
      },
      {
        id: 'state-decision',
        label: localized('State + decision', 'Estado + decisão'),
        question: localized('What do we know now, and what is allowed to happen?', 'O que sabemos agora, e o que pode acontecer?'),
      },
      {
        id: 'action',
        label: localized('Action', 'Ação'),
        question: localized('Where does the change actually happen?', 'Onde a mudança realmente acontece?'),
      },
      {
        id: 'result',
        label: localized('Result', 'Resultado'),
        question: localized('What actually happened?', 'O que aconteceu de verdade?'),
      },
      {
        id: 'next',
        label: localized('Next step', 'Próximo passo'),
        question: localized('Continue, correct, wait or ask for help?', 'Continuar, corrigir, esperar ou pedir ajuda?'),
      },
    ] satisfies ArchitectureModelStep[],
  },
  separations: {
    eyebrow: localized('SEPARATIONS I TRY TO PRESERVE', 'SEPARAÇÕES QUE EU TENTO PRESERVAR'),
    intro: localized(
      'Most architectural problems become easier to reason about when responsibilities that look similar are allowed to remain different.',
      'Muitos problemas de arquitetura ficam mais fáceis de entender quando responsabilidades que parecem próximas podem continuar separadas.',
    ),
    items: [
      {
        label: localized('Interface ≠ decision', 'Interface ≠ decisão'),
        detail: localized(
          'An interface can make an action easy without becoming the place that decides whether it is valid.',
          'Uma interface pode tornar uma ação simples sem virar o lugar que decide se ela é válida.',
        ),
      },
      {
        label: localized('Request ≠ result', 'Pedido ≠ resultado'),
        detail: localized(
          'Sending an operation does not mean the intended outcome actually happened.',
          'Enviar uma operação não significa que o resultado que queríamos realmente aconteceu.',
        ),
      },
      {
        label: localized('Execution ≠ approval', 'Execução ≠ aprovação'),
        detail: localized(
          'A person or agent can produce a change without having the final word on whether it belongs in the system.',
          'Uma pessoa ou agente pode produzir uma mudança sem ter a palavra final sobre ela pertencer ao sistema.',
        ),
      },
      {
        label: localized('Local state ≠ shared state', 'Estado local ≠ estado compartilhado'),
        detail: localized(
          'A screen can react immediately without becoming the source of what everyone else should consider current.',
          'Uma tela pode reagir imediatamente sem virar a fonte daquilo que todos os outros devem considerar atual.',
        ),
      },
      {
        label: localized('Automation ≠ absence of people', 'Automação ≠ ausência de pessoas'),
        detail: localized(
          'When software reaches its limit, the useful behavior is often to preserve context and let a person continue.',
          'Quando o software chega ao seu limite, o comportamento útil muitas vezes é preservar o contexto e deixar uma pessoa continuar.',
        ),
      },
    ] satisfies ArchitectureSeparation[],
  },
  contexts: {
    eyebrow: localized('THE PROBLEM CHANGES THE ARCHITECTURE', 'O PROBLEMA MUDA A ARQUITETURA'),
    intro: localized(
      'The model stays small on purpose. What changes is which part becomes difficult enough to deserve more structure.',
      'O modelo continua pequeno de propósito. O que muda é qual parte fica difícil o bastante para precisar de mais estrutura.',
    ),
    items: [
      {
        id: 'payments',
        legacyView: 'settlement',
        label: localized('Payments', 'Pagamentos'),
        body: localized(
          'Moving money works better when economic intent, transaction preparation, signing and final confirmation are treated as different moments.',
          'Mover dinheiro fica mais compreensível quando intenção econômica, preparação da transação, assinatura e confirmação final são tratados como momentos diferentes.',
        ),
        question: localized(
          'Who can move value — and how do we know it really moved?',
          'Quem pode mover valor — e como sabemos que ele realmente se moveu?',
        ),
      },
      {
        id: 'agents',
        legacyView: 'agents',
        label: localized('AI agents', 'Agentes de IA'),
        body: localized(
          'When producing code becomes cheap, the hard part moves from execution to deciding what should be done, by whom, and how the result will be reviewed.',
          'Quando produzir código fica barato, a parte difícil deixa de ser apenas executar e passa a ser decidir o que deve ser feito, por quem e como o resultado será revisado.',
        ),
        question: localized(
          'What can be delegated without delegating the meaning of done?',
          'O que pode ser delegado sem delegar o significado de concluído?',
        ),
      },
      {
        id: 'realtime',
        legacyView: 'realtime',
        label: localized('Real-time systems', 'Sistemas em tempo real'),
        body: localized(
          'The more immediate an experience feels, the more important it becomes to decide where shared time and shared state actually live.',
          'Quanto mais imediata uma experiência parece, mais importante fica decidir onde tempo e estado compartilhados realmente vivem.',
        ),
        question: localized(
          'How can many people see the same moment without each device inventing its own version of it?',
          'Como várias pessoas podem ver o mesmo momento sem cada dispositivo inventar sua própria versão dele?',
        ),
      },
      {
        id: 'people',
        legacyView: 'handoff',
        label: localized('Software + people', 'Software + pessoas'),
        body: localized(
          'Not every flow should end in more automation. Sometimes the correct behavior is to preserve the current context and make it possible for a person to continue.',
          'Nem todo fluxo deveria terminar em mais automação. Às vezes o comportamento correto é preservar o contexto atual e permitir que uma pessoa continue.',
        ),
        question: localized(
          'What should software carry with it when software alone is no longer enough?',
          'O que o software precisa carregar consigo quando ele sozinho deixa de ser suficiente?',
        ),
      },
    ] satisfies ArchitectureContext[],
  },
  projects: {
    eyebrow: localized('WHERE THIS SHOWS UP', 'ONDE ISSO APARECE'),
    intro: localized(
      'These ideas are easier to see in concrete systems. The projects below each expose a different part of the same reasoning.',
      'Essas ideias ficam mais fáceis de perceber em sistemas concretos. Cada projeto abaixo expõe uma parte diferente desse raciocínio.',
    ),
    items: [
      {
        name: 'Genesis',
        description: localized(
          'Browsers, agents and the difference between asking for an action and knowing what actually happened.',
          'Browsers, agentes e a diferença entre pedir uma ação e saber o que realmente aconteceu.',
        ),
        links: [
          { label: localized('OPEN GENESIS', 'ABRIR GENESIS'), href: 'https://genesis.snelabs.space/#genesis', external: true },
          { label: localized('CASE STUDY', 'CASE STUDY'), href: '/work/genesis' },
        ],
      },
      {
        name: 'Factory',
        description: localized(
          'Delegating software work without losing scope, review and the decision about what becomes part of the system.',
          'Delegar trabalho de software sem perder escopo, revisão e a decisão sobre o que passa a fazer parte do sistema.',
        ),
        links: [{ label: localized('CASE STUDY', 'CASE STUDY'), href: '/work/factory' }],
      },
      {
        name: 'VIRA',
        description: localized(
          'Shared time and state across many clients inside a live experience.',
          'Tempo e estado compartilhados entre vários clientes dentro de uma experiência ao vivo.',
        ),
        links: [{ label: localized('CASE STUDY', 'CASE STUDY'), href: '/work/vira' }],
      },
      {
        name: 'Lisa',
        description: localized(
          'A product surface where automation, context and human interaction meet.',
          'Uma superfície de produto onde automação, contexto e interação humana se encontram.',
        ),
        links: [{ label: localized('OPEN LISA', 'CONHECER LISA'), href: 'https://assistentelisa.online/', external: true }],
      },
      {
        name: 'Foundry Pay / Channels',
        description: localized(
          'Payment intent, execution and financial state explored as separate responsibilities.',
          'Intenção de pagamento, execução e estado financeiro explorados como responsabilidades separadas.',
        ),
        links: [
          { label: localized('FOUNDRY PAY', 'FOUNDRY PAY'), href: 'https://github.com/4LFR3Dv1/Foundry-Pay', external: true },
          { label: localized('FOUNDRY CHANNELS', 'FOUNDRY CHANNELS'), href: 'https://github.com/4LFR3Dv1/Foundry-Channels', external: true },
        ],
      },
    ] satisfies ArchitectureProject[],
  },
} as const;

export const architectureLegacyViewAnchors: Record<string, string> = {
  systems: 'architecture-model',
  settlement: 'architecture-context-payments',
  agents: 'architecture-context-agents',
  realtime: 'architecture-context-realtime',
  handoff: 'architecture-context-people',
};
