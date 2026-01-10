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
        mechanisms: [
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

      {/* Flow Player (Radar only) */}
      {projectId === 'sne-radar' && study.flows && (
        <div className="mb-12">
          <h3 className="font-mono text-lg font-semibold mb-6" style={{ color: 'var(--electric-blue)' }}>
            FLOW PLAYER (Auth / Daily Usage)
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
