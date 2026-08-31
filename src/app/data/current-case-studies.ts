import type { Language } from '../context/language-context';
import { getProject as getLegacyProject, type Project } from './projects';

type Localized = Record<Language, string>;
export type PortfolioProject = Omit<Project, 'id'> & { id: string };

const local = (en: string, pt: string): Localized => ({ en, pt });

export const currentCaseStudies: PortfolioProject[] = [
  {
    id: 'genesis',
    title: 'Genesis',
    seo: {
      title: local('Genesis — Renan Melo', 'Genesis — Renan Melo'),
      description: local(
        'An experimental browser project exploring what changes when AI can work with the web as part of the browser itself.',
        'Um projeto experimental de navegador que explora o que muda quando IA pode trabalhar com a web como parte do próprio navegador.',
      ),
    },
    subtitle: local(
      'An experimental browser project exploring what changes when AI can work with the web as part of the browser itself, rather than as an external automation layer.',
      'Um projeto experimental de navegador que explora o que muda quando IA pode trabalhar com a web como parte do próprio navegador, em vez de existir apenas como uma camada externa de automação.',
    ),
    impact: local(
      'Turns browser automation into a deeper product and systems question: how software can give AI useful context and useful actions without reducing the web to brittle click scripts.',
      'Transforma automação de navegador em uma pergunta mais profunda de produto e sistemas: como software pode dar contexto e ações úteis para IA sem reduzir a web a scripts frágeis de clique.',
    ),
    highlights: {
      en: [
        'The browser is treated as part of the system, not only as a remote-controlled page.',
        'The current page is represented through structured browser and web context instead of depending only on visual coordinates.',
        'Actions, results and recovery remain visible enough to understand what happened after an interruption.',
      ],
      pt: [
        'O navegador é tratado como parte do sistema, não apenas como uma página controlada remotamente.',
        'A página atual é representada por contexto estruturado do navegador e da web, em vez de depender apenas de coordenadas visuais.',
        'Ações, resultados e recuperação continuam visíveis o bastante para entender o que aconteceu depois de uma interrupção.',
      ],
    },
    badges: ['BROWSER', 'RUST', 'CHROMIUM', 'AI'],
    visibility: 'case-study',
    links: [
      {
        label: local('PUBLIC RESEARCH', 'PESQUISA PÚBLICA'),
        url: 'https://github.com/SNE-Labs/Genesis-CP',
      },
    ],
    caseStudy: {
      type: local('Experimental browser and AI systems research', 'Pesquisa experimental em navegador e sistemas de IA'),
      role: local('Product direction, systems design and implementation', 'Direção de produto, design de sistemas e implementação'),
      summary: local(
        'Genesis started from a practical limitation: most AI browser tools operate outside the browser and reconstruct the page from a distance. I wanted to explore what becomes possible when the browser itself can expose useful context, keep continuity across failures and make actions understandable before and after they happen.',
        'Genesis começou a partir de uma limitação prática: a maior parte das ferramentas de IA para navegador opera do lado de fora e reconstrói a página à distância. Eu quis explorar o que se torna possível quando o próprio navegador consegue oferecer contexto útil, manter continuidade depois de falhas e tornar ações compreensíveis antes e depois de acontecerem.',
      ),
      problem: {
        en: [
          'Visual automation is fragile when layouts, timing and page structure change.',
          'A browser session contains more useful state than a sequence of screenshots and clicks can express.',
          'When an action is interrupted, the system needs to know what actually happened before deciding what to do next.',
        ],
        pt: [
          'Automação visual é frágil quando layout, timing e estrutura da página mudam.',
          'Uma sessão de navegador contém mais estado útil do que uma sequência de screenshots e cliques consegue expressar.',
          'Quando uma ação é interrompida, o sistema precisa saber o que realmente aconteceu antes de decidir o próximo passo.',
        ],
      },
      approach: {
        en: [
          'Move useful observation closer to the browser instead of rebuilding everything from pixels.',
          'Represent tabs, documents and page structure as stable software objects that can survive ordinary runtime restarts.',
          'Keep proposed actions, execution and observed results separate enough to reason about recovery instead of blindly repeating work.',
        ],
        pt: [
          'Aproximar a observação útil do navegador em vez de reconstruir tudo a partir de pixels.',
          'Representar abas, documentos e estrutura da página como objetos de software estáveis que possam sobreviver a reinícios comuns do runtime.',
          'Manter proposta, execução e resultado observado separados o bastante para raciocinar sobre recuperação em vez de simplesmente repetir trabalho.',
        ],
      },
      architecture: {
        en: [
          { name: 'BROWSER', items: ['Chromium-based browser surface', 'Tabs, documents and native browser context'] },
          { name: 'CONTEXT', items: ['Structured web semantics', 'Current state reconstructed across runtime restarts'] },
          { name: 'ACTIONS', items: ['Explicit proposed operations', 'Observed outcomes before recovery or continuation'] },
        ],
        pt: [
          { name: 'NAVEGADOR', items: ['Superfície baseada em Chromium', 'Abas, documentos e contexto nativo do navegador'] },
          { name: 'CONTEXTO', items: ['Semântica estruturada da web', 'Estado atual reconstruído após reinícios do runtime'] },
          { name: 'AÇÕES', items: ['Operações propostas de forma explícita', 'Resultados observados antes de recuperar ou continuar'] },
        ],
      },
      guarantees: ['OBSERVE BEFORE ACT', 'EXPLICIT ACTIONS', 'RECOVERABLE SESSION', 'NO BLIND RETRY'],
      evidence: [
        {
          label: local('Open Genesis public research', 'Abrir pesquisa pública de Genesis'),
          url: 'https://github.com/SNE-Labs/Genesis-CP',
        },
      ],
      learnings: {
        en: [
          'A browser becomes much more interesting when treated as an environment instead of a screenshot source.',
          'Stable meaning matters more than stable coordinates.',
          'Recovery is part of the interaction model, not only an infrastructure concern.',
        ],
        pt: [
          'Um navegador fica muito mais interessante quando é tratado como ambiente, não como fonte de screenshots.',
          'Significado estável importa mais do que coordenadas estáveis.',
          'Recuperação faz parte do modelo de interação, não é apenas uma preocupação de infraestrutura.',
        ],
      },
    },
  },
  {
    id: 'factory',
    title: 'Factory',
    seo: {
      title: local('Factory — Renan Melo', 'Factory — Renan Melo'),
      description: local(
        'A production system for turning software decisions into controlled work carried out by AI agents across multiple repositories.',
        'Um sistema de produção para transformar decisões de software em trabalho controlado executado por agentes de IA em múltiplos repositórios.',
      ),
    },
    subtitle: local(
      'A production system I built to turn software decisions into controlled work carried out by AI agents across multiple repositories.',
      'Um sistema de produção que construí para transformar decisões de software em trabalho controlado executado por agentes de IA em múltiplos repositórios.',
    ),
    impact: local(
      'Lets me use agents as a software production workforce without treating generated code as automatically correct, accepted or ready to ship.',
      'Permite usar agentes como força de produção de software sem tratar código gerado como automaticamente correto, aceito ou pronto para publicação.',
    ),
    highlights: {
      en: [
        'The same production path can work against different repositories with different build and test requirements.',
        'Agents receive a bounded piece of work instead of open-ended access to the whole project.',
        'The generated change is checked independently before it can be accepted into the target repository.',
      ],
      pt: [
        'O mesmo caminho de produção consegue trabalhar em repositórios diferentes com requisitos diferentes de build e teste.',
        'Agentes recebem uma parte delimitada do trabalho em vez de acesso aberto ao projeto inteiro.',
        'A mudança gerada é verificada de forma independente antes de poder ser aceita no repositório alvo.',
      ],
    },
    badges: ['AI', 'SOFTWARE DELIVERY', 'WINDOWS', 'TOOLING'],
    visibility: 'case-study',
    links: [],
    caseStudy: {
      type: local('Private software production infrastructure', 'Infraestrutura privada de produção de software'),
      role: local('System design, implementation and operation', 'Design do sistema, implementação e operação'),
      summary: local(
        'Factory grew out of a simple problem: once AI agents can produce a lot of software quickly, typing code stops being the bottleneck. The difficult part becomes deciding what should be done, giving each worker the right amount of context, checking what came back and preserving enough state to continue without losing control of the project.',
        'Factory nasceu de um problema simples: quando agentes de IA conseguem produzir muito software rapidamente, digitar código deixa de ser o gargalo. A parte difícil passa a ser decidir o que deve ser feito, dar a cada trabalhador o contexto certo, verificar o que voltou e preservar estado suficiente para continuar sem perder controle do projeto.',
      ),
      problem: {
        en: [
          'High agent throughput can create more review work than useful progress if tasks are vague.',
          'Different repositories need different preparation, tests and integration rules.',
          'An agent producing a patch should not be the same thing as the project deciding that the patch belongs in the product.',
        ],
        pt: [
          'Alto throughput de agentes pode criar mais trabalho de revisão do que progresso útil quando as tarefas são vagas.',
          'Repositórios diferentes precisam de preparação, testes e regras de integração diferentes.',
          'Um agente produzir um patch não deveria ser a mesma coisa que o projeto decidir que aquele patch pertence ao produto.',
        ],
      },
      approach: {
        en: [
          'Turn a decision into a small, target-specific work package with explicit scope and acceptance conditions.',
          'Run the worker against a disposable copy of the target instead of giving it unrestricted control of the canonical repository.',
          'After the worker stops, run the target own checks and inspect the resulting source change before integration.',
        ],
        pt: [
          'Transformar uma decisão em um pacote pequeno de trabalho específico para o alvo, com escopo e condições de aceite explícitos.',
          'Executar o trabalhador sobre uma cópia descartável do alvo em vez de dar controle irrestrito do repositório canônico.',
          'Depois que o trabalhador termina, rodar os testes do próprio alvo e inspecionar a mudança de código antes da integração.',
        ],
      },
      architecture: {
        en: [
          { name: 'DECIDE', items: ['Define the problem, scope and target', 'Choose what completion means before execution'] },
          { name: 'PRODUCE', items: ['Prepare an isolated target workspace', 'Agent implements only the bounded change'] },
          { name: 'REVIEW', items: ['Run target-specific checks', 'Inspect, accept, revise or reject the result'] },
        ],
        pt: [
          { name: 'DECIDIR', items: ['Definir problema, escopo e alvo', 'Escolher o que significa concluir antes da execução'] },
          { name: 'PRODUZIR', items: ['Preparar workspace isolado do alvo', 'Agente implementa apenas a mudança delimitada'] },
          { name: 'REVISAR', items: ['Rodar verificações específicas do alvo', 'Inspecionar, aceitar, corrigir ou rejeitar o resultado'] },
        ],
      },
      guarantees: ['SCOPE BEFORE EXECUTION', 'TARGET-SPECIFIC CHECKS', 'SEPARATE REVIEW', 'NO DIRECT RELEASE AUTHORITY'],
      evidence: [],
      learnings: {
        en: [
          'Agent speed only becomes leverage when the surrounding production system can absorb it.',
          'The meaning of done must belong to the project, not to the worker that produced the change.',
          'Review is not a cleanup step after AI work; it is part of the architecture of AI work.',
        ],
        pt: [
          'Velocidade de agentes só vira alavancagem quando o sistema de produção ao redor consegue absorvê-la.',
          'O significado de concluído precisa pertencer ao projeto, não ao trabalhador que produziu a mudança.',
          'Revisão não é uma etapa de limpeza depois do trabalho com IA; ela faz parte da arquitetura desse trabalho.',
        ],
      },
    },
  },
];

export function getPortfolioProject(id: string): PortfolioProject | undefined {
  return currentCaseStudies.find((project) => project.id === id) ?? getLegacyProject(id);
}
