import React from 'react';
import { Badge } from './badge';
import { Button } from './button';
import { FlowPlayer } from './flow-player';

interface CaseStudyTemplateProps {
  projectId: string;
  onBack?: () => void;
}

export function CaseStudyTemplate({ projectId, onBack }: CaseStudyTemplateProps) {
  const caseStudies = {
    'sne-os': {
      title: 'SNE OS',
      type: 'Control Plane Web • Platform UX • Modular Suite',
      link: 'https://snelabs.space',
      role: 'Renan Melo — end-to-end (produto, arquitetura, UI/UX, integração, operação)',
      proofChips: ['PLATFORM UX', 'MODULAR ROUTES', 'TRUST SURFACES', 'WALLET GATING'],
      summary: {
        intro: 'Uma camada de controle web que organiza um ecossistema inteiro em uma experiência única.',
        description: 'SNE OS é um console OS-like que agrupa módulos e "superfícies de confiança" para que o usuário entenda onde está, o que pode fazer e qual é o estado do sistema.'
      },
      problem: {
        title: 'Produtos complexos falham por três motivos:',
        points: [
          'UX fragmentada: cada módulo parece um site diferente.',
          'Falta de "verdade operacional": sem Status/Docs/contratos, tudo vira suporte manual.',
          'Crescimento trava: onboarding e navegação não escalam.'
        ]
      },
      approach: {
        title: 'Control plane com navegação modular + superfícies persistentes:',
        points: [
          'Rotas de produto sob um domínio: /home • /radar • /pass • /vault',
          'Superfícies de confiança: Docs • Status • Pricing',
          'Autenticação via wallet + gating por tiers (Free/Pro/Enterprise)'
        ],
        why: 'Em vez de "uma landing + páginas soltas", vira um sistema: o usuário sempre vê contexto, estado e próximos passos.'
      },
      architecture: {
        layers: [
          {
            name: 'SURFACE',
            items: [
              'Web App (React/TS) + design system',
              'Navegação modular + layout persistente',
              'Docs/Status/Pricing como superfícies globais'
            ]
          },
          {
            name: 'BACKEND',
            items: [
              'APIs de estado, entitlements, status signals'
            ]
          },
          {
            name: 'ON-CHAIN (quando aplicável)',
            items: [
              'Licença/entitlement como ativo (wallet-native)'
            ]
          }
        ],
        guarantees: ['CONSISTENT NAV', 'SINGLE CONTEXT', 'TRUST SURFACES ALWAYS VISIBLE', 'TIER-BASED ACCESS']
      },
      keyDecisions: [
        'AppShell fixo (o produto não "reinicia" a cada página)',
        'Docs/Status/Pricing como trilhos de confiança (não escondidos)',
        'Navegação por módulos (o usuário escolhe "modo" de trabalho)'
      ],
      learnings: [
        '"Visual bonito" não resolve: o que escala é estrutura.',
        'Produtos complexos precisam de uma camada que pareça ferramenta, não marketing.',
        'Trust surfaces reduzem suporte e aumentam conversão.'
      ]
    },
    'sne-radar': {
      title: 'SNE RADAR',
      type: 'Desktop Runtime • Market Reading • Distribution',
      link: 'https://radar.snelabs.space',
      role: 'Renan Melo — end-to-end (desktop runtime, backend, web onboarding, operação)',
      proofChips: ['DESKTOP RUNTIME', 'TOOLING UI', 'WEB ONBOARDING', 'SESSION CONTROL'],
      summary: {
        intro: 'Um produto de leitura de mercado com runtime local (desktop) e onboarding web.',
        description: 'A proposta é combinar performance e estabilidade de um app nativo com aquisição e autenticação via web (wallet-native).'
      },
      problem: {
        title: 'Desafios de produtos de trading/mercado:',
        points: [
          'Web apps de trading costumam ser pesados, instáveis e limitados por browser.',
          'Usuário não quer cadastro/senha; quer acesso rápido e controlável.',
          'Produto pago precisa de revogação e device control sem virar "login tradicional".'
        ]
      },
      approach: {
        title: 'Arquitetura distribuída por necessidade:',
        points: [
          'Desktop para runtime e UX "tool-like"',
          'Landing para onboarding e conversão',
          'Backend para sessão/licença, revogação e governança'
        ],
        why: 'Handoff Browser → Desktop via deep link + Sessão por device (machine binding) + Tokens com refresh + janela offline (grace mode)'
      },
      architecture: {
        layers: [
          {
            name: 'DESKTOP',
            items: [
              'UI (Vue) + runtime (Python)',
              'API local (Flask) + updates (SocketIO)',
              'Persistência local (cache + auth storage)'
            ]
          },
          {
            name: 'LANDING',
            items: [
              'Fluxo de onboarding e auth (wallet/SIWE)',
              'Modo desktop auth (deep link callback)'
            ]
          },
          {
            name: 'BACKEND',
            items: [
              'Emissão/validação de sessão',
              'Exchange de code one-time',
              'Refresh / revoke / sessions'
            ]
          }
        ],
        guarantees: ['ANTI-REPLAY (STATE)', 'NO TOKEN IN URL', 'OFFLINE GRACE WINDOW', 'DEVICE SESSIONS']
      },
      securityModel: {
        title: 'Security Model (simple, enterprise-like)',
        threats: [
          'Token leak via browser history/logs',
          'Replay attacks',
          'Device spoofing',
          'Session hijacking'
        ],
        mitigations: [
          'state anti-replay (TTL curto)',
          'code one-time (TTL ~60s, single-use)',
          'exchange bound a device + state',
          'access/refresh tokens',
          'revogação por device'
        ],
        why: 'Sem isso, token vaza em histórico/logs e replay vira problema real.'
      },
      keyDecisions: [
        'Desktop paga o custo de distribuição, mas devolve controle total de UX/performance.',
        'O segredo é o handoff seguro e operável (não "hack" com token na URL).',
        '"Produto pago" exige governança: revogação, sessões e recuperação.'
      ],
      flows: [
        {
          id: 'auth',
          label: 'AUTH FLOW',
          steps: [
            { number: 1, title: 'Desktop', description: 'Gera machine_id + state e inicia o handoff.' },
            { number: 2, title: 'Browser', description: 'Abre o modo desktop auth na landing.' },
            { number: 3, title: 'Wallet', description: 'Assinatura SIWE no browser. Sem senha. Sem cadastro.' },
            { number: 4, title: 'Backend', description: 'Emite code one-time (TTL curto, single-use) vinculado a state/device.' },
            { number: 5, title: 'Deep Link', description: 'Browser dispara sneradar://… e o OS entrega para o app.' },
            { number: 6, title: 'Exchange', description: 'Desktop troca code por tokens e salva de forma segura.' }
          ],
          guarantee: 'Token nunca viaja na URL. Replay/injection é bloqueado por state + code.'
        },
        {
          id: 'daily',
          label: 'DAILY USAGE',
          steps: [
            { number: 1, title: 'Token Validation', description: 'Valida access token em background.' },
            { number: 2, title: 'Refresh', description: 'Se expirar: refresh silencioso.' },
            { number: 3, title: 'Offline Mode', description: 'Se offline: grace mode (janela controlada) + revalidação posterior.' }
          ],
          guarantee: 'UX contínua sem abrir mão de controle de sessão.'
        }
      ],
      learnings: [
        'Desktop paga o custo de distribuição, mas devolve controle total de UX/performance.',
        'O segredo é o handoff seguro e operável (não "hack" com token na URL).',
        '"Produto pago" exige governança: revogação, sessões e recuperação.'
      ]
    },
    'sne-vault': {
      title: 'SNE VAULT PROTOCOL',
      type: 'Security Architecture • Sovereign Physical Infrastructure',
      link: null,
      role: 'Renan Melo — especificação, modelo de segurança, arquitetura',
      proofChips: ['DUAL-KERNEL MODEL', 'POU', 'TAMPER/ZEROIZATION', 'AEAD / HKDF'],
      summary: {
        intro: 'Uma especificação de arquitetura de segurança para confiança por prova técnica.',
        description: 'O foco é substituir "confiança em intermediários" por garantias verificáveis: separação de domínios, prova de uptime, e mecanismos de tamper/zeroization.'
      },
      problem: {
        title: 'Problemas de segurança em infra:',
        points: [
          '"Segurança" costuma virar promessa vaga ("enterprise-grade") sem mecanismo verificável.',
          'Infra crítica precisa de modelo de ameaça, separação e resposta a comprometimento.',
          'Governança e confiança precisam de sinais difíceis de falsificar.'
        ]
      },
      approach: {
        title: 'Arquitetura com domínios e garantias explícitas:',
        points: [
          'Separação de responsabilidades (domínios isolados)',
          'PoU (Proof of Uptime) como sinal operacional/anti-sybil',
          'Criptografia com AEAD, derivação de chaves, e políticas de zeroization'
        ],
        why: null
      },
      architecture: {
        layers: [
          {
            name: 'TRUST INPUTS',
            items: [
              'Hardware/attestation signals (quando aplicável)',
              'Uptime proofs periódicos',
              'Entitlements/licenças como controles de acesso'
            ]
          },
          {
            name: 'SECURITY CONTROLS',
            items: [
              'AEAD (confidencialidade + integridade)',
              'HKDF para derivação de material de chave',
              'Tamper detection + zeroization'
            ]
          }
        ],
        guarantees: ['SEPARATION OF DOMAINS', 'VERIFIABLE SIGNALS', 'COMPROMISE RESPONSE', 'GOVERNANCE-READY']
      },
      threatModel: {
        threats: ['key theft', 'replay', 'device compromise', 'social engineering via "cloud trust"'],
        mitigations: ['nonces/state/TTL', 'bound sessions', 'tamper response', 'minimize secrets exposure']
      },
      keyDecisions: [],
      learnings: [
        'Segurança útil é aquela que define "o que acontece quando falha".',
        'Verificação e governança exigem sinais objetivos, não só políticas.',
        'O valor está na clareza do modelo e nas interfaces de controle.'
      ]
    },
    'verify-systems': {
      title: 'VERIFY SYSTEMS',
      type: 'Operational Doctrine • Verifiable Systems • Book',
      link: '/docs/Verify_By_Renan_Melo.pdf',
      role: 'Renan Melo — autor, arquiteto conceitual',
      proofChips: ['EVENT SOURCING', 'RECONCILIATION', 'BITCOIN PRINCIPLES', 'STATE MACHINES', 'OPERATIONAL MODES'],
      summary: {
        intro: 'Doutrina operacional para sistemas que precisam provar que estão corretos, não apenas parecer corretos.',
        description: 'Derivado dos princípios do Bitcoin (UTXO, proof-of-work, consenso), VERIFY SYSTEMS documenta padrões universais para transformar execução em evidência e estado em conhecimento operacional verificável.'
      },
      problem: {
        title: 'Sistemas de produção mentem de três formas:',
        points: [
          'Estado mutável sem rastro: transações mudam de status sem evidência do porquê.',
          'Reconciliação como exceção: diferenças entre sistemas são tratadas ad-hoc, não como processo primário.',
          'Falhas silenciosas: o sistema reporta "sucesso" mas a realidade diverge (pagamento confirmado internamente, rejeitado pelo provedor).'
        ]
      },
      approach: {
        title: 'Don\'t Trust, Verify — arquitetura que prova ao invés de prometer:',
        points: [
          'Event sourcing: toda mudança de estado gera evidência imutável',
          'Hierarquia de verdade: settlement externo > estado interno > cache',
          'Reconciliação contínua como processo primário (não batch noturno)',
          'Modos operacionais explícitos: Normal, Degraded, Reconciling, Safe Mode'
        ],
        why: 'Em sistemas financeiros, "o banco de dados diz que pagou" não é verdade. Verdade é o settlement confirmado pelo provedor. VERIFY formaliza essa distinção.'
      },
      architecture: {
        layers: [
          {
            name: 'EXECUTION PLANE',
            items: [
              'Processa transações e gera evidência de cada operação',
              'Cada mutação de estado produz um evento imutável',
              'Idempotência por chave natural (issuedAt + system + address + value)'
            ]
          },
          {
            name: 'VERIFY PLANE',
            items: [
              'Reconcilia estado interno contra fontes externas de verdade',
              'Detecta divergências e classifica por severidade',
              'Opera independente do plano de execução'
            ]
          },
          {
            name: 'CONTROL PLANE',
            items: [
              'Monitora métricas de saúde (Reconciliation Lag, Unknown Truth Duration)',
              'Transiciona entre modos operacionais automaticamente',
              'Circuit breakers e degradação graceful'
            ]
          }
        ],
        guarantees: ['VERIFIABLE STATE', 'CONTINUOUS RECONCILIATION', 'GRACEFUL DEGRADATION', 'EVIDENCE-BASED']
      },
      keyDecisions: [
        'Derivar de Bitcoin, não de frameworks tradicionais: UTXO como inspiração para transações verificáveis.',
        'Reconciliação é processo primário, não secundário: roda continuamente, não em batch.',
        'Separação em 3 planos (Execution, Verify, Control): cada um pode falhar independentemente.',
        'Shadow mode antes de ativação: validar sem impactar produção.'
      ],
      flows: [
        {
          id: 'operational-modes',
          label: 'OPERATIONAL MODES',
          steps: [
            { number: 1, title: 'Normal Mode', description: 'Todos os provedores respondendo. Reconciliação confirma estado. Métricas dentro dos thresholds.' },
            { number: 2, title: 'Degraded Mode', description: 'Provedor intermitente ou lento. Sistema continua operando com retry strategies e circuit breakers ativados.' },
            { number: 3, title: 'Reconciling Mode', description: 'Divergência detectada entre estado interno e settlement externo. Reconciliação ativa com prioridade máxima.' },
            { number: 4, title: 'Safe Mode', description: 'Falha crítica ou divergência irreconciliável. Novas transações pausadas. Apenas leitura e diagnóstico permitidos.' }
          ],
          guarantee: 'O sistema nunca silencia falhas. Cada transição entre modos gera evidência e alerta ao operador.'
        },
        {
          id: 'reconciliation-cycle',
          label: 'RECONCILIATION CYCLE',
          steps: [
            { number: 1, title: 'Captura de Estado', description: 'Snapshot do estado interno (eventos processados, saldos, transações pending).' },
            { number: 2, title: 'Consulta Settlement', description: 'Busca estado externo no provedor de pagamento (fonte de verdade: blockchain, PIX, etc.).' },
            { number: 3, title: 'Comparação', description: 'Diff entre estado interno e externo. Classifica divergências por tipo e severidade.' },
            { number: 4, title: 'Resolução', description: 'Aplica correções automáticas (auto-heal) ou escala para operador (manual review).' },
            { number: 5, title: 'Evidência', description: 'Registra resultado: o que divergiu, o que foi corrigido, tempo de resolução (Unknown Truth Duration).' }
          ],
          guarantee: 'Reconciliação contínua elimina "bugs silenciosos": se o provedor rejeitou, o sistema sabe em minutos, não em dias.'
        }
      ],
      learnings: [
        'Sistemas financeiros precisam de "hierarquia de verdade" explícita.',
        'O princípio "Don\'t Trust, Verify" do Bitcoin é universal para qualquer sistema crítico.',
        'Documentar a doutrina antes de implementar força clareza arquitetural.',
        'Reconciliação contínua elimina categorias inteiras de bugs silenciosos.'
      ]
    }
  };

  const study = caseStudies[projectId as keyof typeof caseStudies];

  if (!study) {
    return (
      <div className="text-center py-24">
        <p className="text-lg" style={{ color: 'var(--terminal-text)' }}>
          Case study not found
        </p>
      </div>
    );
  }

  return (
    <section className="max-w-[1200px] mx-auto px-6 py-16">
      {/* Back Button */}
      {onBack && (
        <button
          onClick={onBack}
          className="font-mono text-sm mb-8 text-[var(--terminal-muted)] hover:text-[var(--electric-blue)] transition-colors"
        >
          ← BACK TO PORTFOLIO
        </button>
      )}

      {/* Header */}
      <div className="mb-12 pb-8 border-b border-[var(--border-default)]">
        <div className="mb-6">
          <h1 className="font-mono font-bold mb-2" style={{ color: 'var(--electric-blue)' }}>
            CASE STUDY // {study.title}
          </h1>
          <div className="font-mono text-sm mb-2" style={{ color: 'var(--terminal-muted)' }}>
            TYPE: {study.type}
          </div>
          {study.link && (
            <div className="font-mono text-sm mb-2">
              <span style={{ color: 'var(--terminal-muted)' }}>LINK: </span>
              <a
                href={study.link}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[var(--electric-blue)] transition-colors"
                style={{ color: 'var(--electric-blue)' }}
              >
                {study.link.replace('https://', '')}
              </a>
            </div>
          )}
          <div className="font-mono text-sm" style={{ color: 'var(--terminal-muted)' }}>
            ROLE: {study.role}
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          {study.proofChips.map((chip, idx) => (
            <Badge key={idx} variant="blue">{chip}</Badge>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="mb-12">
        <h3 className="font-mono text-lg font-semibold mb-4" style={{ color: 'var(--electric-blue)' }}>
          SUMMARY (10s)
        </h3>
        <div className="space-y-3">
          <p className="text-base leading-relaxed" style={{ color: 'var(--terminal-text)' }}>
            {study.summary.intro}
          </p>
          <p className="text-base leading-relaxed" style={{ color: 'var(--terminal-text)' }}>
            {study.summary.description}
          </p>
        </div>
      </div>

      {/* Problem */}
      <div className="mb-12">
        <h3 className="font-mono text-lg font-semibold mb-4" style={{ color: 'var(--electric-blue)' }}>
          PROBLEM
        </h3>
        <p className="text-base mb-4" style={{ color: 'var(--terminal-text)' }}>
          {study.problem.title}
        </p>
        <ul className="space-y-2">
          {study.problem.points.map((point, idx) => (
            <li key={idx} className="flex items-start gap-3 text-base">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--red)' }}></span>
              <span style={{ color: 'var(--terminal-text)' }}>{point}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Approach */}
      <div className="mb-12">
        <h3 className="font-mono text-lg font-semibold mb-4" style={{ color: 'var(--electric-blue)' }}>
          APPROACH (What I built)
        </h3>
        <p className="text-base mb-4" style={{ color: 'var(--terminal-text)' }}>
          {study.approach.title}
        </p>
        <ul className="space-y-2 mb-6">
          {study.approach.points.map((point, idx) => (
            <li key={idx} className="flex items-start gap-3 text-base">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--electric-blue)' }}></span>
              <span style={{ color: 'var(--terminal-text)' }}>{point}</span>
            </li>
          ))}
        </ul>
        {study.approach.why && (
          <div className="p-4 border-l-2 bg-[var(--surface-1)]" style={{ borderColor: 'var(--electric-blue)' }}>
            <div className="font-mono text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--terminal-muted)' }}>
              WHY THIS MATTERS
            </div>
            <p className="text-base" style={{ color: 'var(--terminal-text)' }}>
              {study.approach.why}
            </p>
          </div>
        )}
      </div>

      {/* Architecture */}
      <div className="mb-12">
        <h3 className="font-mono text-lg font-semibold mb-6" style={{ color: 'var(--electric-blue)' }}>
          ARCHITECTURE (High-level)
        </h3>
        <div className="space-y-6">
          {study.architecture.layers.map((layer, idx) => (
            <div key={idx} className="border border-[var(--border-default)] bg-[var(--surface-1)]">
              <div className="border-b border-[var(--border-default)] px-4 py-3 bg-[var(--surface-2)]">
                <div className="font-mono text-xs uppercase tracking-wider font-semibold" style={{ color: 'var(--electric-green)' }}>
                  {layer.name}
                </div>
              </div>
              <div className="p-4">
                <ul className="space-y-2">
                  {layer.items.map((item, itemIdx) => (
                    <li key={itemIdx} className="flex items-start gap-3 text-sm">
                      <span className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--electric-green)' }}></span>
                      <span style={{ color: 'var(--terminal-text)' }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}

          {/* Guarantees */}
          <div className="pt-4">
            <div className="font-mono text-[10px] uppercase tracking-wider mb-3" style={{ color: 'var(--terminal-muted)' }}>
              GUARANTEES
            </div>
            <div className="flex flex-wrap gap-2">
              {study.architecture.guarantees.map((guarantee, idx) => (
                <Badge key={idx} variant="green">{guarantee}</Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Security Model (Radar only) */}
      {projectId === 'sne-radar' && study.securityModel && (
        <div className="mb-12">
          <h3 className="font-mono text-lg font-semibold mb-6" style={{ color: 'var(--electric-blue)' }}>
            {study.securityModel.title}
          </h3>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="border border-[var(--border-default)] bg-[var(--surface-1)] p-6">
              <div className="font-mono text-xs uppercase tracking-wider mb-3" style={{ color: 'var(--red)' }}>
                THREATS
              </div>
              <ul className="space-y-2">
                {study.securityModel.threats.map((threat, idx) => (
                  <li key={idx} className="text-sm" style={{ color: 'var(--terminal-text)' }}>
                    • {threat}
                  </li>
                ))}
              </ul>
            </div>
            <div className="border border-[var(--border-default)] bg-[var(--surface-1)] p-6">
              <div className="font-mono text-xs uppercase tracking-wider mb-3" style={{ color: 'var(--electric-green)' }}>
                MITIGATIONS
              </div>
              <ul className="space-y-2">
                {study.securityModel.mitigations.map((mitigation, idx) => (
                  <li key={idx} className="text-sm" style={{ color: 'var(--terminal-text)' }}>
                    • {mitigation}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="p-4 border-l-2 bg-[var(--surface-1)]" style={{ borderColor: 'var(--electric-green)' }}>
            <div className="font-mono text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--terminal-muted)' }}>
              WHY IT MATTERS
            </div>
            <p className="text-base" style={{ color: 'var(--terminal-text)' }}>
              {study.securityModel.why}
            </p>
          </div>
        </div>
      )}

      {/* Threat Model (Vault only) */}
      {projectId === 'sne-vault' && study.threatModel && (
        <div className="mb-12">
          <h3 className="font-mono text-lg font-semibold mb-6" style={{ color: 'var(--electric-blue)' }}>
            THREAT MODEL (compact)
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border border-[var(--border-default)] bg-[var(--surface-1)] p-6">
              <div className="font-mono text-xs uppercase tracking-wider mb-3" style={{ color: 'var(--red)' }}>
                THREATS
              </div>
              <ul className="space-y-2">
                {study.threatModel.threats.map((threat, idx) => (
                  <li key={idx} className="text-sm" style={{ color: 'var(--terminal-text)' }}>
                    • {threat}
                  </li>
                ))}
              </ul>
            </div>
            <div className="border border-[var(--border-default)] bg-[var(--surface-1)] p-6">
              <div className="font-mono text-xs uppercase tracking-wider mb-3" style={{ color: 'var(--electric-green)' }}>
                MITIGATIONS
              </div>
              <ul className="space-y-2">
                {study.threatModel.mitigations.map((mitigation, idx) => (
                  <li key={idx} className="text-sm" style={{ color: 'var(--terminal-text)' }}>
                    • {mitigation}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Flow Player (Radar + VERIFY) */}
      {(projectId === 'sne-radar' || projectId === 'verify-systems') && study.flows && (
        <div className="mb-12">
          <h3 className="font-mono text-lg font-semibold mb-6" style={{ color: 'var(--electric-blue)' }}>
            {projectId === 'verify-systems' ? 'FLOW PLAYER (Operational Modes / Reconciliation)' : 'FLOW PLAYER (Auth / Daily Usage)'}
          </h3>
          <FlowPlayer flows={study.flows} />
        </div>
      )}

      {/* Key Decisions (if any) */}
      {study.keyDecisions && study.keyDecisions.length > 0 && (
        <div className="mb-12">
          <h3 className="font-mono text-lg font-semibold mb-4" style={{ color: 'var(--electric-blue)' }}>
            KEY UX/PRODUCT DECISIONS
          </h3>
          <ul className="space-y-2">
            {study.keyDecisions.map((decision, idx) => (
              <li key={idx} className="flex items-start gap-3 text-base">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--amber)' }}></span>
                <span style={{ color: 'var(--terminal-text)' }}>{decision}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Learnings */}
      <div className="mb-12">
        <h3 className="font-mono text-lg font-semibold mb-4" style={{ color: 'var(--electric-blue)' }}>
          LEARNINGS
        </h3>
        <ul className="space-y-2">
          {study.learnings.map((learning, idx) => (
            <li key={idx} className="flex items-start gap-3 text-base">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--electric-blue)' }}></span>
              <span style={{ color: 'var(--terminal-text)' }}>{learning}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* CTAs */}
      <div className="pt-8 border-t border-[var(--border-default)]">
        <div className="flex flex-wrap gap-4">
          {study.link && (
            <Button variant="primary" onClick={() => window.open(study.link!, '_blank')}>
              OPEN DEMO
            </Button>
          )}
          <Button variant="secondary" onClick={() => console.log('Architecture Explorer')}>
            ARCHITECTURE EXPLORER
          </Button>
          <Button variant="ghost" onClick={() => window.location.href = 'mailto:byrenanmelo@gmail.com'}>
            CONTACT
          </Button>
        </div>
      </div>
    </section>
  );
}
