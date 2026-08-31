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
    tags: ['agent-native', 'web runtime', 'governance'],
    copy: {
      en: {
        summary: 'Sovereign agentic web runtime that owns institutional identity, authority, causal history, effect reconciliation and recovery above replaceable physical substrates.',
        thesis: 'The Web can be treated as an operational environment in which browser and OS mechanisms remain substrate while Genesis owns institutional identity, governed authority and causal continuity.',
      },
      pt: {
        summary: 'Runtime web agêntico soberano que detém identidade institucional, autoridade, histórico causal, reconciliação de efeitos e recuperação acima de substratos físicos substituíveis.',
        thesis: 'A Web pode ser tratada como ambiente operacional no qual mecanismos de browser e OS permanecem substrato enquanto Genesis detém identidade institucional, autoridade governada e continuidade causal.',
      },
    },
  },
  {
    slug: 'systems/brineos',
    title: 'BrineOS',
    kind: 'RESEARCH',
    updatedAt: '31 AUG 2026',
    featured: true,
    tags: ['bare-metal', 'ai-native', 'systems research'],
    copy: {
      en: {
        summary: 'Bare-metal research system exploring the minimum deterministic substrate required for a persistent AI-native entity to exist directly on a machine.',
        thesis: 'Cognition may be replaceable while continuity, authority, state, effects, evidence and recovery belong to the machine-owned substrate that sustains the entity.',
      },
      pt: {
        summary: 'Sistema de pesquisa bare-metal que explora o substrato determinístico mínimo necessário para uma entidade AI-native persistente existir diretamente em uma máquina.',
        thesis: 'A cognição pode ser substituível enquanto continuidade, autoridade, estado, efeitos, evidência e recuperação pertencem ao substrato controlado pela máquina que sustenta a entidade.',
      },
    },
  },
  {
    slug: 'systems/wer-esk',
    title: 'WER-ESK',
    kind: 'RESEARCH',
    updatedAt: '31 AUG 2026',
    featured: true,
    tags: ['internet', 'cartography', 'observation'],
    copy: {
      en: {
        summary: 'Local kernel for cartography and exploration of the Internet through bounded Web observations, explicit provenance and deterministic relation frontiers.',
        thesis: 'The Internet can be explored as an observable relational space without turning the exploration layer into an application ledger or remote authority.',
      },
      pt: {
        summary: 'Kernel local para cartografia e exploração da Internet por meio de observações Web limitadas, proveniência explícita e fronteiras determinísticas de relação.',
        thesis: 'A Internet pode ser explorada como espaço relacional observável sem transformar a camada de exploração em ledger de aplicação ou autoridade remota.',
      },
    },
  },
  {
    slug: 'systems/foundry',
    title: 'Foundry',
    kind: 'SYSTEM',
    updatedAt: '31 AUG 2026',
    featured: false,
    tags: ['agents', 'operations', 'evidence'],
    copy: {
      en: {
        summary: 'Local-priority cockpit for orchestrating software agents with durable state, explicit contracts, evidence, human review and Git-backed work history.',
        thesis: 'Agentic development becomes operationally tractable when planning, execution, evidence and review are represented as governed state rather than disposable chat sessions.',
      },
      pt: {
        summary: 'Cockpit local-priority para orquestrar agentes de software com estado durável, contratos explícitos, evidência, revisão humana e histórico de trabalho respaldado por Git.',
        thesis: 'O desenvolvimento agêntico se torna operacionalmente tratável quando planejamento, execução, evidência e revisão são representados como estado governado, e não como sessões descartáveis de chat.',
      },
    },
  },
  {
    slug: 'systems/sne-fde',
    title: 'SNE-FDE',
    kind: 'SYSTEM',
    updatedAt: '31 AUG 2026',
    featured: false,
    tags: ['field engineering', 'computing', 'evidence'],
    copy: {
      en: {
        summary: 'Institutional and executable field boundary of SNE Labs, connecting computing thesis, computational treasury, field contracts, evidence and an external problem-intake surface.',
        thesis: 'SNE Labs should expose computing through reality, problems, work and evidence while preserving a separate institutional chain from company to treasury, field and evidence.',
      },
      pt: {
        summary: 'Fronteira institucional e executável de campo da SNE Labs, conectando tese computacional, tesouraria computacional, contratos de campo, evidência e uma superfície externa de entrada de problemas.',
        thesis: 'A SNE Labs deve expor computação por meio de realidade, problemas, trabalho e evidência, preservando uma cadeia institucional separada entre empresa, tesouraria, campo e evidência.',
      },
    },
  },
  {
    slug: 'systems/lisa',
    title: 'Lisa',
    kind: 'SYSTEM',
    updatedAt: '31 AUG 2026',
    featured: false,
    tags: ['digital presence', 'operations', 'ai'],
    copy: {
      en: {
        summary: 'Digital operational presence that handles business conversations with persistent context, grounded knowledge and bounded operational actions.',
        thesis: 'A business-facing AI presence should preserve conversational and operational continuity while separating cognition, knowledge retrieval and authorized actions.',
      },
      pt: {
        summary: 'Presença operacional digital que conduz conversas de negócio com contexto persistente, conhecimento fundamentado e ações operacionais limitadas.',
        thesis: 'Uma presença de IA voltada a negócios deve preservar continuidade conversacional e operacional enquanto separa cognição, recuperação de conhecimento e ações autorizadas.',
      },
    },
  },
];

export const featuredPublications = publications.filter((publication) => publication.featured);
