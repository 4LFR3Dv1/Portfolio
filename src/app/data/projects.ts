import type { Language } from '../context/language-context';

export type ProjectId = 'vira' | 'xs-wallet' | 'agentic-systems' | 'sne-os' | 'verify-systems';
type Localized = Record<Language, string>;

export interface ProjectLink {
  label: Localized;
  url: string;
}

export interface Project {
  id: ProjectId;
  title: string;
  subtitle: Localized;
  impact: Localized;
  highlights: Record<Language, string[]>;
  badges: string[];
  visibility: 'public' | 'private';
  links: ProjectLink[];
  caseStudy: {
    type: Localized;
    role: Localized;
    summary: Localized;
    problem: Record<Language, string[]>;
    approach: Record<Language, string[]>;
    architecture: Record<Language, Array<{ name: string; items: string[] }>>;
    guarantees: string[];
    evidence: ProjectLink[];
    learnings: Record<Language, string[]>;
  };
}

const local = (en: string, pt: string): Localized => ({ en, pt });

export const projects: Project[] = [
  {
    id: 'vira',
    title: 'VIRA',
    subtitle: local('Synchronized multiplayer football driven by authoritative match data.', 'Futebol multiplayer sincronizado orientado por dados oficiais da partida.'),
    impact: local('Turns passive viewing into a shared, verifiable second-screen experience.', 'Transforma consumo passivo em uma experiência coletiva e verificável de segunda tela.'),
    highlights: {
      en: ['Server-owned deadlines and deterministic resolution', 'Hash-chained ledger and verified replay', 'Live product with automated and two-device E2E checks'],
      pt: ['Prazos controlados pelo servidor e resolução determinística', 'Ledger encadeado por hash e replay verificado', 'Produto online com testes automatizados e E2E em dois dispositivos'],
    },
    badges: ['REACT', 'TYPESCRIPT', 'EVENT SOURCING', 'SOLANA', 'PLAYWRIGHT'],
    visibility: 'private',
    links: [
      { label: local('LIVE PRODUCT', 'PRODUTO ONLINE'), url: 'https://vira.snelabs.space/?lang=en' },
      { label: local('DEMO VIDEO', 'VÍDEO DEMO'), url: 'https://www.youtube.com/watch?v=eqe9e5TZ02k' },
    ],
    caseStudy: {
      type: local('Real-time consumer product', 'Produto de consumo em tempo real'),
      role: local('Product, architecture and end-to-end engineering', 'Produto, arquitetura e engenharia end-to-end'),
      summary: local('VIRA converts live football observations into synchronized challenges. The browser renders projections; the server owns admission, deadlines, resolution and ranking.', 'O VIRA converte observações ao vivo de futebol em desafios sincronizados. O navegador renderiza projeções; o servidor controla admissão, prazos, resolução e ranking.'),
      problem: {
        en: ['Clients drift when each one interprets live events independently.', 'Competitive interactions need private answers and one authoritative deadline.', 'Results need reproducible evidence, not only mutable state.'],
        pt: ['Clientes divergem quando cada um interpreta eventos ao vivo de forma independente.', 'Interações competitivas exigem respostas privadas e um prazo autoritativo.', 'Resultados precisam de evidência reproduzível, não apenas estado mutável.'],
      },
      approach: {
        en: ['Serialize room mutations on the server.', 'Persist domain events in an append-only, hash-chained ledger.', 'Project state through SSE and reconstruct rounds through deterministic replay.'],
        pt: ['Serializar mutações da sala no servidor.', 'Persistir eventos de domínio em ledger append-only encadeado por hash.', 'Projetar estado via SSE e reconstruir rodadas por replay determinístico.'],
      },
      architecture: {
        en: [{ name: 'AUTHORITY', items: ['TxLINE observations', 'Normalization and stale-data checks'] }, { name: 'RUNTIME', items: ['Serialized room queue', 'Server-owned locks and scoring'] }, { name: 'EVIDENCE', items: ['Hash-chained ledger', 'Verified replay and optional Solana commitment'] }],
        pt: [{ name: 'AUTORIDADE', items: ['Observações via TxLINE', 'Normalização e validação de dados obsoletos'] }, { name: 'RUNTIME', items: ['Fila serializada por sala', 'Locks e pontuação controlados pelo servidor'] }, { name: 'EVIDÊNCIA', items: ['Ledger encadeado por hash', 'Replay verificado e compromisso opcional em Solana'] }],
      },
      guarantees: ['AUTHORITATIVE STATE', 'DETERMINISTIC REPLAY', 'PRIVATE ANSWERS', 'OBSERVABLE DELIVERY'],
      evidence: [
        { label: local('Open live product', 'Abrir produto online'), url: 'https://vira.snelabs.space/?lang=en' },
        { label: local('Watch end-to-end demo', 'Assistir demonstração end-to-end'), url: 'https://www.youtube.com/watch?v=eqe9e5TZ02k' },
        { label: local('Inspect readiness endpoint', 'Inspecionar endpoint de prontidão'), url: 'https://vira.snelabs.space/ready' },
      ],
      learnings: {
        en: ['Authoritative time is a product feature.', 'Replayable evidence improves debugging and trust.', 'Fail closed when provider authority is missing.'],
        pt: ['Tempo autoritativo é uma funcionalidade do produto.', 'Evidência reproduzível melhora debugging e confiança.', 'Falhar de forma fechada quando a autoridade do provedor estiver ausente.'],
      },
    },
  },
  {
    id: 'xs-wallet',
    title: 'XS Wallet',
    subtitle: local('Private technical pre-beta for self-custody across Bitcoin, Liquid and Lightning.', 'Pré-beta técnico privado de self-custody para Bitcoin, Liquid e Lightning.'),
    impact: local('Unifies wallet security, node operations and swaps in a local-first desktop system.', 'Unifica segurança de wallet, operação de nós e swaps em um sistema desktop local-first.'),
    highlights: {
      en: ['Encrypted local vault and explicit session contract', 'Electron → local bridge → gRPC → Go core', 'Real Bitcoin testnet transaction validated end to end'],
      pt: ['Vault local criptografado e contrato explícito de sessão', 'Electron → bridge local → gRPC → core Go', 'Transação real em Bitcoin testnet validada ponta a ponta'],
    },
    badges: ['GO', 'ELECTRON', 'GRPC', 'BITCOIN', 'LIQUID', 'LIGHTNING'],
    visibility: 'private',
    links: [],
    caseStudy: {
      type: local('Private financial infrastructure R&D', 'P&D privado de infraestrutura financeira'),
      role: local('Architecture, security model and implementation', 'Arquitetura, modelo de segurança e implementação'),
      summary: local('A modular desktop wallet that keeps critical execution local and separates UI, IPC, bridge and core responsibilities. Public disclosure is limited while release hardening continues.', 'Uma wallet desktop modular que mantém execução crítica local e separa responsabilidades de UI, IPC, bridge e core. A divulgação pública é limitada durante o hardening de release.'),
      problem: {
        en: ['Self-custody fails when privileged operations leak across layers.', 'BTC, Liquid and Lightning expose different settlement models.', 'Desktop releases need explicit recovery and node-management gates.'],
        pt: ['Self-custody falha quando operações privilegiadas vazam entre camadas.', 'BTC, Liquid e Lightning possuem modelos distintos de settlement.', 'Releases desktop exigem gates explícitos de recuperação e gestão de nós.'],
      },
      approach: {
        en: ['Keep secrets in an Argon2id + AES-256-GCM local vault.', 'Route critical operations through allowlisted Electron IPC.', 'Isolate wallet and swap logic in a Go core exposed through gRPC.'],
        pt: ['Manter segredos em vault local Argon2id + AES-256-GCM.', 'Roteiar operações críticas por IPC allowlisted no Electron.', 'Isolar lógica de wallet e swaps em core Go exposto via gRPC.'],
      },
      architecture: {
        en: [{ name: 'DESKTOP', items: ['React interface', 'Electron main/preload and IPC registry'] }, { name: 'LOCAL SERVICES', items: ['REST-to-gRPC bridge', 'Go wallet, swap and node services'] }, { name: 'NETWORKS', items: ['Bitcoin Core', 'Elements/Liquid', 'LND and swap provider'] }],
        pt: [{ name: 'DESKTOP', items: ['Interface React', 'Electron main/preload e registro IPC'] }, { name: 'SERVIÇOS LOCAIS', items: ['Bridge REST-para-gRPC', 'Serviços Go de wallet, swap e nós'] }, { name: 'REDES', items: ['Bitcoin Core', 'Elements/Liquid', 'LND e provedor de swaps'] }],
      },
      guarantees: ['SELF-CUSTODY', 'IPC-FIRST', 'LOCAL ENCRYPTION', 'EXPLICIT SESSIONS'],
      evidence: [],
      learnings: {
        en: ['A desktop wallet is a distributed system on one machine.', 'Recovery modes must be designed before release.', 'Private work must be described without pretending to be publicly auditable.'],
        pt: ['Uma wallet desktop é um sistema distribuído em uma máquina.', 'Modos de recuperação precisam ser projetados antes do release.', 'Trabalho privado deve ser descrito sem fingir ser publicamente auditável.'],
      },
    },
  },
  {
    id: 'agentic-systems',
    title: 'Agentic Systems & Foundry',
    subtitle: local('Operational environments for agents, tools, memory, review and evidence.', 'Ambientes operacionais para agentes, ferramentas, memória, revisão e evidências.'),
    impact: local('Moves AI work from isolated prompts to observable, reviewable workflows.', 'Leva o trabalho com IA de prompts isolados para fluxos observáveis e revisáveis.'),
    highlights: {
      en: ['Task and execution control planes', 'Human review and explicit decision states', 'Evidence, runtime health and operational documentation'],
      pt: ['Planos de controle de tarefas e execução', 'Revisão humana e estados explícitos de decisão', 'Evidências, saúde de runtime e documentação operacional'],
    },
    badges: ['AGENTS', 'TOOLING', 'PYTHON', 'TYPESCRIPT', 'OPERATIONS'],
    visibility: 'private',
    links: [],
    caseStudy: {
      type: local('Private agent-platform engineering', 'Engenharia privada de plataforma de agentes'),
      role: local('System design, product model and implementation', 'Design de sistema, modelo de produto e implementação'),
      summary: local('Operational surfaces for planning work, launching agents, reviewing outputs and preserving evidence. Details remain private; the public description is intentionally architectural.', 'Superfícies operacionais para planejar trabalho, executar agentes, revisar resultados e preservar evidências. Os detalhes permanecem privados; a descrição pública é intencionalmente arquitetural.'),
      problem: {
        en: ['Prompt-only workflows hide state and failure modes.', 'Parallel execution needs bounded tasks and observable ownership.', 'Human approval must be represented as state.'],
        pt: ['Fluxos baseados apenas em prompt escondem estado e falhas.', 'Execução paralela precisa de tarefas limitadas e ownership observável.', 'Aprovação humana deve ser representada como estado.'],
      },
      approach: {
        en: ['Model tasks, runs, reviews and decisions explicitly.', 'Attach artifacts and evidence to execution records.', 'Expose runtime health and intervention points.'],
        pt: ['Modelar tarefas, execuções, revisões e decisões explicitamente.', 'Vincular artefatos e evidências aos registros.', 'Expor saúde de runtime e pontos de intervenção.'],
      },
      architecture: {
        en: [{ name: 'CONTROL', items: ['Work items and execution policy', 'Agent launch and continuation'] }, { name: 'EVIDENCE', items: ['Artifacts, logs and reviews', 'Decision and acceptance history'] }, { name: 'OPERATOR', items: ['Queue and runtime health', 'Human intervention'] }],
        pt: [{ name: 'CONTROLE', items: ['Work items e política de execução', 'Inicialização e continuação de agentes'] }, { name: 'EVIDÊNCIA', items: ['Artefatos, logs e revisões', 'Histórico de decisão e aceite'] }, { name: 'OPERAÇÃO', items: ['Saúde de filas e runtime', 'Intervenção humana'] }],
      },
      guarantees: ['EXPLICIT STATE', 'HUMAN REVIEW', 'TRACEABLE OUTPUTS', 'BOUNDED EXECUTION'],
      evidence: [],
      learnings: {
        en: ['Agent reliability depends on workflow design.', 'Review and evidence need first-class models.', 'Clear intervention points precede safe autonomy.'],
        pt: ['Confiabilidade de agentes depende do desenho do fluxo.', 'Revisão e evidência precisam de modelos de primeira classe.', 'Pontos claros de intervenção precedem autonomia segura.'],
      },
    },
  },
  {
    id: 'sne-os',
    title: 'SNE OS',
    subtitle: local('A sovereign-account product surface for USDT operations.', 'Uma superfície de conta soberana para operações em USDT.'),
    impact: local('Packages financial infrastructure into a focused browser experience.', 'Empacota infraestrutura financeira em uma experiência web focada.'),
    highlights: { en: ['Public product surface', 'Wallet and account flows', 'Responsive platform design'], pt: ['Superfície pública de produto', 'Fluxos de wallet e conta', 'Design responsivo de plataforma'] },
    badges: ['REACT', 'TYPESCRIPT', 'PRODUCT UX', 'WEB3'],
    visibility: 'public',
    links: [{ label: local('OPEN PRODUCT', 'ABRIR PRODUTO'), url: 'https://snelabs.space' }],
    caseStudy: {
      type: local('Public product surface', 'Superfície pública de produto'),
      role: local('Product UX and frontend engineering', 'UX de produto e engenharia frontend'),
      summary: local('SNE OS presents sovereign-account workflows through a cohesive, responsive control surface.', 'O SNE OS apresenta fluxos de conta soberana em uma superfície de controle coesa e responsiva.'),
      problem: { en: ['Financial infrastructure needs a clear product model.', 'Wallet flows often expose protocol complexity.'], pt: ['Infraestrutura financeira precisa de um modelo claro de produto.', 'Fluxos de wallet frequentemente expõem complexidade de protocolo.'] },
      approach: { en: ['Organize actions around user intent.', 'Keep trust and account context visible.'], pt: ['Organizar ações pela intenção do usuário.', 'Manter confiança e contexto da conta visíveis.'] },
      architecture: { en: [{ name: 'PRODUCT SURFACE', items: ['Responsive React interface', 'Account and transaction workflows'] }], pt: [{ name: 'SUPERFÍCIE DE PRODUTO', items: ['Interface React responsiva', 'Fluxos de conta e transação'] }] },
      guarantees: ['RESPONSIVE UX', 'EXPLICIT CONTEXT', 'PUBLIC DEMO'],
      evidence: [{ label: local('Open SNE OS', 'Abrir SNE OS'), url: 'https://snelabs.space' }],
      learnings: { en: ['Protocol complexity should not become interface complexity.'], pt: ['Complexidade de protocolo não deve se transformar em complexidade de interface.'] },
    },
  },
  {
    id: 'verify-systems',
    title: 'VERIFY SYSTEMS',
    subtitle: local('Operational doctrine for evidence-driven, reconcilable systems.', 'Doutrina operacional para sistemas reconciliáveis e orientados por evidências.'),
    impact: local('Turns reliability principles into explicit architecture and operating modes.', 'Transforma princípios de confiabilidade em arquitetura e modos operacionais explícitos.'),
    highlights: { en: ['Truth hierarchy', 'Continuous reconciliation', 'Explicit operational modes'], pt: ['Hierarquia de verdade', 'Reconciliação contínua', 'Modos operacionais explícitos'] },
    badges: ['EVENT SOURCING', 'RECONCILIATION', 'SYSTEMS THINKING'],
    visibility: 'public',
    links: [{ label: local('READ PUBLICATION', 'LER PUBLICAÇÃO'), url: '/docs/Verify_By_Renan_Melo.pdf' }],
    caseStudy: {
      type: local('Technical publication', 'Publicação técnica'),
      role: local('Author', 'Autor'),
      summary: local('A practical doctrine for systems that must prove state against external truth.', 'Uma doutrina prática para sistemas que precisam provar estado contra verdade externa.'),
      problem: { en: ['Mutable state hides why transitions happened.', 'Reconciliation is treated as an exception.', 'Silent failures let state diverge from settlement.'], pt: ['Estado mutável esconde por que transições ocorreram.', 'Reconciliação é tratada como exceção.', 'Falhas silenciosas permitem divergência do settlement.'] },
      approach: { en: ['Record evidence for every transition.', 'Define a truth hierarchy.', 'Reconcile continuously and expose operating modes.'], pt: ['Registrar evidência para toda transição.', 'Definir uma hierarquia de verdade.', 'Reconciliar continuamente e expor modos operacionais.'] },
      architecture: { en: [{ name: 'EXECUTION', items: ['Commands and immutable events'] }, { name: 'VERIFY', items: ['External truth and reconciliation'] }, { name: 'CONTROL', items: ['Health, modes and intervention'] }], pt: [{ name: 'EXECUÇÃO', items: ['Comandos e eventos imutáveis'] }, { name: 'VERIFICAÇÃO', items: ['Verdade externa e reconciliação'] }, { name: 'CONTROLE', items: ['Saúde, modos e intervenção'] }] },
      guarantees: ['VERIFIABLE STATE', 'CONTINUOUS RECONCILIATION', 'EXPLICIT FAILURE MODES'],
      evidence: [{ label: local('Read VERIFY SYSTEMS', 'Ler VERIFY SYSTEMS'), url: '/docs/Verify_By_Renan_Melo.pdf' }],
      learnings: { en: ['Correctness is continuously verified.', 'External settlement outranks internal state.'], pt: ['Correção é verificada continuamente.', 'Settlement externo tem precedência sobre estado interno.'] },
    },
  },
];

export const getProject = (projectId: string): Project | undefined =>
  projects.find((project) => project.id === projectId);
