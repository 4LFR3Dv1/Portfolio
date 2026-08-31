export type PublicationKind = 'SYSTEM' | 'RESEARCH' | 'ESSAY' | 'NOTE';

interface LocalizedCopy {
  summary: string;
  thesis: string | null;
}

export interface EditorialPublication {
  slug: string;
  title: string;
  kind: PublicationKind;
  updatedAt: string;
  featured: boolean;
  tags: string[];
  copy: {
    en: LocalizedCopy;
    pt: LocalizedCopy;
  };
}

export const publications: EditorialPublication[] = [
  {
    slug: 'systems/genesis',
    title: 'Genesis',
    kind: 'SYSTEM',
    updatedAt: '31 AUG 2026',
    featured: true,
    tags: ['browser', 'AI agents', 'web automation'],
    copy: {
      en: {
        summary: 'An experimental browser environment for AI agents to use the web through explicit permissions, visible actions and recoverable sessions.',
        thesis: 'AI agents should be able to use the web without bypassing the controls we expect from ordinary software. Genesis explores a browser where actions can be reviewed, limited and recovered when something fails.',
      },
      pt: {
        summary: 'Um ambiente experimental de navegador para agentes de IA usarem a web com permissões explícitas, ações visíveis e sessões recuperáveis.',
        thesis: 'Agentes de IA devem conseguir usar a web sem contornar os controles que esperamos de um software comum. Genesis explora um navegador em que ações podem ser revisadas, limitadas e recuperadas quando algo falha.',
      },
    },
  },
  {
    slug: 'systems/wer-esk',
    title: 'WER-ESK',
    kind: 'RESEARCH',
    updatedAt: '31 AUG 2026',
    featured: true,
    tags: ['internet', 'mapping', 'web research'],
    copy: {
      en: {
        summary: 'A research project about mapping and exploring how websites, services and observations relate across the Internet.',
        thesis: 'The Internet is easier to study when observations keep their source and context instead of being flattened into a single application database.',
      },
      pt: {
        summary: 'Um projeto de pesquisa sobre como mapear e explorar relações entre sites, serviços e observações na Internet.',
        thesis: 'A Internet fica mais fácil de estudar quando cada observação preserva sua origem e seu contexto, em vez de tudo ser achatado em um único banco de dados de aplicação.',
      },
    },
  },
  {
    slug: 'systems/foundry',
    title: 'Foundry',
    kind: 'SYSTEM',
    updatedAt: '31 AUG 2026',
    featured: true,
    tags: ['AI agents', 'developer tools', 'workflow'],
    copy: {
      en: {
        summary: 'A workspace for planning, running and reviewing software work carried out with AI agents.',
        thesis: 'Working with AI becomes more reliable when tasks, outputs, reviews and decisions stay visible instead of disappearing into isolated chat sessions.',
      },
      pt: {
        summary: 'Um ambiente para planejar, executar e revisar trabalho de software realizado com agentes de IA.',
        thesis: 'Trabalhar com IA fica mais confiável quando tarefas, resultados, revisões e decisões permanecem visíveis, em vez de desaparecerem em conversas isoladas.',
      },
    },
  },
  {
    slug: 'systems/sne-fde',
    title: 'SNE-FDE',
    kind: 'SYSTEM',
    updatedAt: '31 AUG 2026',
    featured: false,
    tags: ['engineering', 'research', 'SNE Labs'],
    copy: {
      en: {
        summary: 'An engineering model for turning difficult technical problems into focused research, implementation and verifiable results at SNE Labs.',
        thesis: 'Complex computing work becomes easier to evaluate when a problem is clearly framed, implemented against explicit goals and supported by evidence that others can inspect.',
      },
      pt: {
        summary: 'Um modelo de engenharia para transformar problemas técnicos difíceis em pesquisa focada, implementação e resultados verificáveis na SNE Labs.',
        thesis: 'Trabalho computacional complexo fica mais fácil de avaliar quando o problema é bem definido, a implementação responde a objetivos explícitos e os resultados vêm acompanhados de evidências que outras pessoas podem inspecionar.',
      },
    },
  },
  {
    slug: 'systems/lisa',
    title: 'Lisa',
    kind: 'SYSTEM',
    updatedAt: '31 AUG 2026',
    featured: false,
    tags: ['AI assistant', 'business software', 'operations'],
    copy: {
      en: {
        summary: 'An AI assistant designed for business conversations that can keep context, use company knowledge and perform a limited set of useful actions.',
        thesis: 'A useful business assistant needs more than good conversation: it should remember the right context, know what information it can trust and be clear about what it is allowed to do.',
      },
      pt: {
        summary: 'Uma assistente de IA para conversas de negócio, capaz de manter contexto, usar conhecimento da empresa e executar um conjunto limitado de ações úteis.',
        thesis: 'Uma boa assistente para negócios precisa de mais do que conversar bem: deve lembrar o contexto certo, saber em quais informações pode confiar e deixar claro o que está autorizada a fazer.',
      },
    },
  },
];

export const featuredPublications = publications.filter((publication) => publication.featured);
