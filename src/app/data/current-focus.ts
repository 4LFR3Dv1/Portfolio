import type { Language } from '../context/language-context';

type Localized = Record<Language, string>;

export interface CurrentStudyLink {
  title: Localized;
  state: Localized;
  href: string;
}

export interface CurrentFocusItem {
  id: string;
  name: Localized;
  state: Localized;
  description: Localized;
  studies: CurrentStudyLink[];
}

const local = (en: string, pt: string): Localized => ({ en, pt });

export const currentFocus: CurrentFocusItem[] = [
  {
    id: 'genesis',
    name: local('Genesis', 'Genesis'),
    state: local('IN DEVELOPMENT', 'EM DESENVOLVIMENTO'),
    description: local(
      'An experimental browser exploring how AI can understand pages, act inside real software and continue work without reducing the web to automated clicks.',
      'Um navegador experimental que explora como IA pode compreender páginas, agir dentro de software real e continuar trabalho sem reduzir a web a cliques automatizados.',
    ),
    studies: [
      {
        title: local(
          'When does a browser stop being a tool?',
          'Quando um navegador deixa de ser uma ferramenta?',
        ),
        state: local('PUBLISHED ESSAY', 'ENSAIO PUBLICADO'),
        href: '/editorial/quando-um-navegador-deixa-de-ser-uma-ferramenta/',
      },
    ],
  },
  {
    id: 'factory',
    name: local('Factory', 'Factory'),
    state: local('IN DEVELOPMENT', 'EM DESENVOLVIMENTO'),
    description: local(
      'A software-production environment for delegating implementation to AI agents while keeping scope, review and integration visible.',
      'Um ambiente de produção de software para delegar implementação a agentes de IA mantendo escopo, revisão e integração visíveis.',
    ),
    studies: [
      {
        title: local(
          'What changes when producing software stops being the bottleneck?',
          'O que muda quando produzir software deixa de ser o gargalo?',
        ),
        state: local('OPEN STUDY', 'ESTUDO ABERTO'),
        href: '/editorial/#estudo-software-agentes',
      },
    ],
  },
  {
    id: 'experimental-computing',
    name: local('Experimental computing', 'Computação experimental'),
    state: local('ACTIVE RESEARCH', 'PESQUISA ATIVA'),
    description: local(
      'Networks, state, time and abstraction investigated through concrete software and hardware experiments.',
      'Redes, estado, tempo e abstrações investigados a partir de experimentos concretos em software e hardware.',
    ),
    studies: [
      {
        title: local('Where does a network exist?', 'Onde existe uma rede?'),
        state: local('PUBLISHED ESSAY', 'ENSAIO PUBLICADO'),
        href: '/editorial/onde-existe-uma-rede/',
      },
      {
        title: local("A system's past does not exist", 'O passado de um sistema não existe'),
        state: local('PUBLISHED ESSAY', 'ENSAIO PUBLICADO'),
        href: '/editorial/o-passado-de-um-sistema-nao-existe/',
      },
    ],
  },
];
