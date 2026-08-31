import type { Language } from '../context/language-context';

type Localized = Record<Language, string>;

export interface SelectedWorkLink {
  href: string;
  label: Localized;
}

export interface SelectedWorkItem {
  id: string;
  title: string;
  year: string;
  description: Localized;
  topics: Localized[];
  caseStudyId?: string;
  links?: SelectedWorkLink[];
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
    caseStudyId: 'genesis',
    links: [
      {
        href: 'https://github.com/SNE-Labs/Genesis-CP',
        label: local('Public research', 'Pesquisa pública'),
      },
    ],
  },
  {
    id: 'factory',
    title: 'Factory',
    year: '2026',
    description: local(
      'A production system for turning software decisions into controlled work carried out by AI agents across multiple repositories, with independent checks before changes are accepted.',
      'Um sistema de produção para transformar decisões de software em trabalho controlado executado por agentes de IA em múltiplos repositórios, com verificações independentes antes de aceitar mudanças.',
    ),
    topics: [local('Software production', 'Produção de software'), local('AI', 'IA'), local('Automation', 'Automação')],
    caseStudyId: 'factory',
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
    links: [
      {
        href: 'https://assistentelisa.online/',
        label: local('Visit Lisa', 'Conhecer Lisa'),
      },
      {
        href: 'https://app.assistentelisa.online/',
        label: local('Open app', 'Abrir app'),
      },
    ],
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
    links: [
      {
        href: 'https://vira.snelabs.space/?lang=pt',
        label: local('Open product', 'Abrir produto'),
      },
    ],
  },
  {
    id: 'foundry-pay-channels',
    title: 'Foundry Pay / Foundry Channels',
    year: '2026',
    description: local(
      'Two connected experiments around stablecoin payments: one explores how software and AI systems can request payments without becoming unrestricted wallets; the other turns that foundation into persistent payment channels people can open, share and reuse.',
      'Dois experimentos conectados em pagamentos com stablecoins: um explora como software e sistemas de IA podem solicitar pagamentos sem virar wallets irrestritas; o outro transforma essa base em canais persistentes que pessoas podem abrir, compartilhar e reutilizar.',
    ),
    topics: [local('Payments', 'Pagamentos'), local('Stablecoins', 'Stablecoins'), local('Solana', 'Solana')],
    links: [
      {
        href: 'https://github.com/4LFR3Dv1/Foundry-Pay',
        label: local('Foundry Pay', 'Foundry Pay'),
      },
      {
        href: 'https://github.com/4LFR3Dv1/Foundry-Channels',
        label: local('Foundry Channels', 'Foundry Channels'),
      },
    ],
  },
];
