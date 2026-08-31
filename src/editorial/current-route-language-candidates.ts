import type { SystemPayload } from '../app/data/editorial-knowledge-ontology';

export interface CurrentRouteLanguageCandidate {
  subjectKey: string;
  recordId: `rec_${string}`;
  routes: {
    en: string;
    ptBR: string;
  };
  ptBR: SystemPayload;
}

function candidate(
  subjectKey: string,
  recordId: `rec_${string}`,
  slug: string,
  name: string,
  summary: string,
  thesis: string | null,
): CurrentRouteLanguageCandidate {
  return {
    subjectKey,
    recordId,
    routes: {
      en: `/en/systems/${slug}`,
      ptBR: `/pt-br/systems/${slug}`,
    },
    ptBR: {
      schemaVersion: 'knowledge.system/v0',
      name,
      summary,
      thesis,
    },
  };
}

/**
 * Explicit bilingual realizations and exact public paths for every A2.3 current
 * System successor. These translations are bounded representations of the
 * admitted current payload, not translations of repository/source evidence.
 */
export const CURRENT_ROUTE_LANGUAGE_CANDIDATES: CurrentRouteLanguageCandidate[] = [
  candidate(
    'genesis',
    'rec_5eeb93bd8811b6c0fbecf3cc733cbd2e',
    'genesis',
    'Genesis',
    'Runtime web agêntico soberano que detém identidade institucional, autoridade, histórico causal, reconciliação de efeitos e recuperação acima de substratos físicos substituíveis.',
    'A Web pode ser tratada como um ambiente operacional no qual mecanismos físicos do navegador e do sistema operacional permanecem como substrato, enquanto Genesis detém identidade institucional, autoridade governada e continuidade causal.',
  ),
  candidate(
    'brineos',
    'rec_6822adfb4aaf3520816ff305f6b4e572',
    'brineos',
    'BrineOS',
    'Sistema de pesquisa bare metal que explora o substrato determinístico mínimo necessário para que uma entidade persistente nativa de IA exista diretamente em uma máquina.',
    'A cognição pode ser substituível, enquanto continuidade, autoridade, estado, efeitos, evidência e recuperação pertencem ao substrato controlado pela máquina que sustenta a entidade.',
  ),
  candidate(
    'wer-esk',
    'rec_4515d2eb7d17e9a876ff890f7b90d6a8',
    'wer-esk',
    'WER-ESK',
    'Kernel local para cartografia e exploração da Internet por meio de observações Web delimitadas, proveniência explícita e fronteiras determinísticas de relações.',
    'A Internet pode ser explorada como um espaço relacional observável sem transformar a camada de exploração em um ledger de aplicação ou autoridade remota.',
  ),
  candidate(
    'lisa',
    'rec_286639cfc48e0fac9065fe4e3258a916',
    'lisa',
    'Lisa',
    'Presença operacional digital que conduz conversas de negócio com contexto persistente, conhecimento fundamentado e ações operacionais delimitadas.',
    'Uma presença de IA voltada a negócios deve preservar continuidade conversacional e operacional enquanto separa cognição, recuperação de conhecimento e ações autorizadas.',
  ),
  candidate(
    'factory',
    'rec_1fe061f491894efe1e0b1674448b7501',
    'factory',
    'Factory',
    'Sistema externo e governado de produção que transforma decisões do Coordinator em mudanças de código delimitadas e verificadas de forma independente por meio de um host persistente e workers com capacidades restritas.',
    'A produção agêntica de software deve separar coordenação, autoridade de execução e verificação independente, em vez de permitir que workers definam ou aceitem o próprio trabalho.',
  ),
  candidate(
    'foundry',
    'rec_66057eae80fabfa4478a600481d755f0',
    'foundry',
    'Foundry',
    'Cockpit local-priority para orquestrar agentes de software com estado durável, contratos explícitos, evidência, revisão humana e histórico de trabalho respaldado por Git.',
    'O desenvolvimento agêntico se torna operacionalmente tratável quando planejamento, execução, evidência e revisão são representados como estado governado, e não como sessões descartáveis de chat.',
  ),
  candidate(
    'agenthub',
    'rec_10d864e055b79f67dce52412083e6763',
    'agenthub',
    'AgentHub',
    'Produto independente para comprar trabalho digital executado por agentes especializados, com aplicação pública, modelo de jobs, fluxo de entrega, dados e operação próprios.',
    'Capacidade agêntica pode ser exposta como trabalho digital concluído enquanto o estado do produto voltado ao cliente permanece independente do cockpit interno de produção de software.',
  ),
  candidate(
    'foundry-pay',
    'rec_0e6beb6a5f17831616af328fe8f2afb2',
    'foundry-pay',
    'Foundry Pay',
    'Infraestrutura governada de pagamentos para sistemas de agentes e aplicações de stablecoin que separa autoridade econômica da execução em rede.',
    'Uma aplicação pode solicitar um efeito econômico sem obter autoridade irrestrita de assinatura quando obrigações, autorização, execução, recuperação e reconciliação são vinculadas de forma independente.',
  ),
  candidate(
    'foundry-channels',
    'rec_38f6f81328b9ccd007127d1071f8cc02',
    'foundry-channels',
    'Foundry Channels',
    'Produto e superfície de runtime para canais persistentes e financiados de pagamentos em stablecoin, separados da autoridade de protocolo e da infraestrutura de execução específica de rede.',
    'O estado de canais para consumidores deve vir de estado durável da aplicação reconciliado com realidade autorizada do protocolo, e não de UI fabricada ou execução inferida.',
  ),
  candidate(
    'solana-agent',
    'rec_43dd086ef220193d441943461e8863f0',
    'solana-agent',
    'Solana-Agent',
    'Infraestrutura governada de execução, recuperação e evidência para operações Solana propostas por aplicações ou agentes de IA.',
    'Agentes podem propor trabalho em Solana sem receber autoridade irrestrita de assinatura quando política, autorização exata, execução, journaling, recuperação e evidência permanecem responsabilidades separadas.',
  ),
  candidate(
    'sne-fde',
    'rec_6bd4d56023990c25879daecf2ff34b55',
    'sne-fde',
    'SNE-FDE',
    'Fronteira institucional e executável de campo da SNE Labs, conectando tese computacional, tesouraria computacional, contratos de campo, evidência e uma superfície externa de entrada de problemas.',
    'A SNE Labs deve expor computação por meio de realidade, problemas, trabalho e evidência, preservando uma cadeia institucional separada entre empresa, tesouraria, campo e evidência.',
  ),
  candidate(
    'github-flow',
    'rec_0db35eb308dd8da06948dcde9666a6df',
    'github-flow',
    'GitHub Flow',
    'Workspace operacional sobre a realidade do GitHub que relaciona estado de repositórios, reconstrói fronteiras e apresenta uma visão automática do trabalho em andamento.',
    'O GitHub permanece fonte de verdade e governança enquanto um workspace separado pode reconstruir e apresentar seu estado operacional sem substituir essa autoridade.',
  ),
  candidate(
    'sne-os',
    'rec_499f928363217da10f93cd54aead0101',
    'sne-os',
    'SNE-OS',
    'Workspace operacional self-custodial e USDT-first que combina contexto de mercado, saldo on-chain, movimentação multichain, identidade operacional, chaves de acesso, segredos criptografados e superfícies de referência.',
    'Uma conta soberana de dólar digital pode usar USDT como saldo-base enquanto unifica contexto, identidade, acesso e execução sem abrir mão da autocustódia.',
  ),
  candidate(
    'sne-radar',
    'rec_553b9088a5b22a51a44679f582de47f5',
    'sne-radar',
    'SNE Radar',
    'Sistema de inteligência de mercado e análise de sinais da linhagem SNE, com dados de mercado, superfícies de sinais e caminhos autenticados de análise em suas realizações de repositório atuais e históricas.',
    null,
  ),
  candidate(
    'sne-trading',
    'rec_b1afa6a6409eff3f0c4d55f88b2112b2',
    'sne-trading',
    'SNE Trading',
    'Plano independente de pesquisa, replay, risco e execução para inteligência de mercado SNE, projetado para avaliar comportamento histórico de sinais antes de qualquer execução controlada.',
    'O sistema que está sendo julgado não deve controlar o tribunal que o julga; geração de sinais, avaliação histórica, autoridade de risco e execução devem permanecer separáveis.',
  ),
  candidate(
    'brine',
    'rec_5c9f2ece90fb6528b9b317a5181d5336',
    'brine',
    'Brine',
    'Runtime local-first de agentes para trabalho persistente no computador que detém identidade, estado durável, sessões, memória, autoridade, efeitos de ferramentas, recibos e recuperação ao redor de cognição substituível.',
    'Soberania agêntica vem de possuir o estado autoritativo do runtime e as fronteiras de efeitos, e não de vincular identidade a um modelo, provedor ou harness específico.',
  ),
  candidate(
    'personal-identity-runtime',
    'rec_10610fee4c64c6463ccbb745deaf1a92',
    'personal-identity-runtime',
    'Personal Identity Runtime',
    'Runtime local-first para Windows destinado a uma identidade digital persistente, com observação durável, projeções reconstruíveis, memória episódica, cognição delimitada e manifestações condicionadas por evidência.',
    'Uma identidade digital persistente pode sobreviver a qualquer interface específica ao manter continuidade de runtime e estado durável independentes de seu shell desktop.',
  ),
  candidate(
    'vira',
    'rec_c844725e35cf61830221efc597612017',
    'vira',
    'VIRA',
    'Experiência multiplayer de futebol ao vivo que transforma observações autoritativas da partida em desafios sincronizados, respostas privadas, resolução compartilhada, ranking e replay verificável.',
    'Uma partida ao vivo pode se tornar um jogo social sincronizado quando um único fluxo autoritativo de eventos controla o momento e a resolução dos desafios para todos os participantes.',
  ),
  candidate(
    'xs-wallet',
    'rec_724d518ee338e32eb06e79077ad01f3d',
    'xs-wallet',
    'XS Wallet / Domini',
    'Carteira desktop self-custody em pré-beta para BTC, Liquid e Lightning, com frontend modular, Electron, bridge de API e core em Go, incluindo fluxos de carteira e swap.',
    'Operações críticas de carteira devem permanecer self-custodial e IPC-first, com material de chave local criptografado e fronteiras explícitas de sessão em toda a stack desktop.',
  ),
  candidate(
    'ordm',
    'rec_f941765df0d17315570234ddb6df2c24',
    'ordm',
    'ORDM',
    'Família legada de pesquisa em blockchain que explora produção de blocos offline ou local, consenso híbrido, coordenação entre peers, persistência e controles de segurança de carteira.',
    'Experimentos de blockchain podem separar produção local ou offline de reconciliação posterior em rede, mas as realizações históricas de PoC e testnet permanecem uma linhagem de pesquisa, e não uma rede de produção.',
  ),
  candidate(
    'sne-vault',
    'rec_358fbaec4b74b7f1739ea5943c4a4ca0',
    'sne-vault',
    'SNE Vault',
    'Superfície histórica de sistema SNE para execução verificável na borda, armazenamento criptografado, licenciamento on-chain e conceitos operacionais enraizados em hardware.',
    null,
  ),
  candidate(
    'sne-scroll-pass',
    'rec_eb671d4728bb44327b1a0b832006f320',
    'sne-scroll-pass',
    'SNE Scroll Pass',
    'Interface privacy-first para inspecionar e interagir com o ecossistema Scroll, incluindo saldos, gas, watchlists e visualizações orientadas a carteira.',
    'Superfícies de controle blockchain podem reduzir ruído e rastreamento ao expor somente as informações solicitadas de conta e rede por meio de uma interface focada.',
  ),
  candidate(
    'sne-observatorio',
    'rec_c2af8a986e38518d716f397320072368',
    'sne-observatorio',
    'SNE Observatório',
    'Sistema histórico de pesquisa de mercado que representava comportamento de preço por meio de uma linguagem visual proprietária de campos, ressonâncias, fluxos e exploração temporal.',
    'Análise de mercado pode ser expressa como uma linguagem visual de forças interagindo, e não apenas como tabelas convencionais de indicadores e sinais.',
  ),
  candidate(
    'viewcounter',
    'rec_757fe2f771ef44acc68af55ce9313c95',
    'viewcounter',
    'ViewCounter',
    'Dashboard experimental de métricas sociais que conecta contas autorizadas do YouTube e TikTok, registra snapshots de visualizações totais, agrega crescimento e transmite projeções atualizadas.',
    'Métricas sociais entre plataformas se tornam comparáveis quando observações dos provedores são normalizadas em um único histórico durável, enquanto falhas preservam a última medição válida em vez de fabricar dados.',
  ),
  candidate(
    'edital-sales',
    'rec_e8947ad40f9a202dc9413a1bb91199f1',
    'edital-sales',
    'Edital Sales',
    'Aplicação para descoberta de editais, CRM de oportunidades, registros de artistas e projetos, ingestão de fontes e análise assistida por meio de frontend React e backend Python.',
    null,
  ),
  candidate(
    'estampai',
    'rec_b9dc85a2002a434fdb540b53496c99f2',
    'estampai',
    'EstampAI',
    'Sistema experimental de design conversacional no qual usuários descrevem uma estampa, recebem padrões visuais gerados e inspecionam ou exportam os assets PNG resultantes.',
    null,
  ),
  candidate(
    'vlbet',
    'rec_ad5db27acd07f0934b47ae313e9e812f',
    'vlbet',
    'VLBet',
    'Engine experimental de valor esportivo que combina ingestão de odds de múltiplos provedores, modelos de probabilidade Elo e Poisson, dimensionamento Kelly e entrega de sinais.',
    'Um sinal de value betting deve emergir de uma comparação explícita entre probabilidade estimada e preço de mercado, com o dimensionamento separado em uma regra formal de risco.',
  ),
];
