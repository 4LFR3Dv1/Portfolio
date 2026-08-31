import type { Language } from '../context/language-context';
import type { ProjectId } from './projects';

type Localized = Record<Language, string>;

export interface SelectedWorkItem {
  id: string;
  title: string;
  year: string;
  description: Localized;
  topics: Localized[];
  caseStudyId?: ProjectId;
  href?: string;
  linkLabel?: Localized;
}

const local = (en: string, pt: string): Localized => ({ en, pt });

export const selectedWork: SelectedWorkItem[] = [
  {
    id: 'genesis',
    title: 'Genesis',
    year: '2026',
    description: local(
      'An experimental browser I am building to explore how AI can work inside real software without reducing the web to a sequence of automated clicks.',
      'Um navegador experimental que estou construindo para explorar como IA pode trabalhar dentro de software real sem reduzir a web a uma sequência de cliques automatizados.',
    ),
    topics: [local('Browser', 'Navegador'), local('AI', 'IA'), local('Systems', 'Sistemas')],
    href: 'https://github.com/SNE-Labs/Genesis-CP',
    linkLabel: local('View project', 'Ver projeto'),
  },
  {
    id: 'foundry',
    title: 'Foundry',
    year: '2026',
    description: local(
      'A workspace for organizing software work done with AI: planning tasks, running agents, reviewing results and keeping the work understandable over time.',
      'Um ambiente para organizar trabalho de software feito com IA: planejar tarefas, executar agentes, revisar resultados e manter o trabalho compreensível ao longo do tempo.',
    ),
    topics: [local('Developer tools', 'Ferramentas'), local('AI', 'IA'), local('Workflow', 'Fluxo de trabalho')],
  },
  {
    id: 'lisa',
    title: 'Lisa',
    year: '2026',
    description: local(
      'An AI product built around conversation, context and useful actions, with the goal of feeling like a coherent digital presence instead of another generic assistant.',
      'Um produto de IA construído em torno de conversa, contexto e ações úteis, com o objetivo de funcionar como uma presença digital coerente em vez de mais uma assistente genérica.',
    ),
    topics: [local('Product', 'Produto'), local('AI', 'IA'), local('Interaction', 'Interação')],
  },
  {
    id: 'vira',
    title: 'VIRA',
    year: '2026',
    description: local(
      'A multiplayer football experience synchronized with real matches. I built the product, backend and real-time behavior that keep players sharing the same game state.',
      'Uma experiência multiplayer de futebol sincronizada com partidas reais. Construí o produto, o backend e o comportamento em tempo real que mantém os jogadores no mesmo estado de jogo.',
    ),
    topics: [local('Product', 'Produto'), local('Real time', 'Tempo real'), local('Multiplayer', 'Multiplayer')],
    caseStudyId: 'vira',
    href: 'https://vira.snelabs.space/?lang=pt',
    linkLabel: local('Open product', 'Abrir produto'),
  },
  {
    id: 'xs-wallet',
    title: 'XS Wallet',
    year: '2026',
    description: local(
      'A desktop self-custody wallet experiment spanning Bitcoin, Liquid and Lightning, with critical operations kept local and a Go core separated from the interface.',
      'Um experimento de wallet desktop self-custody para Bitcoin, Liquid e Lightning, com operações críticas mantidas localmente e um core em Go separado da interface.',
    ),
    topics: [local('Desktop', 'Desktop'), local('Bitcoin', 'Bitcoin'), local('Security', 'Segurança')],
    caseStudyId: 'xs-wallet',
    href: 'https://github.com/4LFR3Dv1/XSWallet',
    linkLabel: local('View code', 'Ver código'),
  },
];
