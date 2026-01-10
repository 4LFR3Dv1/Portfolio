import React from 'react';
import { ProjectCard } from './project-card';

interface SelectedWorkSectionProps {
  onCaseStudy?: (project: string) => void;
  onDemo?: (url: string) => void;
  onEvidence?: () => void;
}

export function SelectedWorkSection({ onCaseStudy, onDemo, onEvidence }: SelectedWorkSectionProps) {
  const projects = [
    {
      id: 'sne-os',
      title: 'SNE OS // Control Plane Web',
      subtitle: 'Console web OS-like para operar módulos, superfícies de confiança e fluxos de produto.',
      impact: 'Transforma um ecossistema técnico em uma experiência unificada (UX de plataforma).',
      highlights: [
        'Módulos sob um domínio: /home • /radar • /pass • /vault',
        '"Trust surfaces": Docs • Status • Pricing',
        'Wallet auth + gating por tiers (Free/Pro/Enterprise)'
      ],
      badges: ['REACT', 'TYPESCRIPT', 'DESIGN SYSTEM', 'PLATFORM UX', 'WEB3 FLOWS'],
      demo: 'https://snelabs.space'
    },
    {
      id: 'sne-radar',
      title: 'SNE Radar // Desktop + Web + Backend',
      subtitle: 'Produto "tooling-grade" para leitura de mercado com runtime local e distribuição.',
      impact: 'Performance e estabilidade de desktop + aquisição e onboarding via web.',
      highlights: [
        'Runtime local + UI de dashboard',
        'Handoff Browser → Desktop (deep link)',
        'Sessões por dispositivo + revogação (padrão enterprise)'
      ],
      badges: ['PYTHON', 'DESKTOP', 'DISTRIBUTION', 'FLASK', 'SOCKETIO', 'VUE', 'AUTH'],
      demo: 'https://radar.snelabs.space'
    },
    {
      id: 'sne-vault',
      title: 'SNE Vault Protocol // Security & Infra',
      subtitle: 'Especificação de infra soberana: confiança por prova técnica, não por intermediário.',
      impact: 'Modelo de arquitetura e segurança para execução/attestation e governança.',
      highlights: [
        'Dual-kernel / separação de domínios',
        'PoU (Proof of Uptime) como sinal de confiança',
        'Criptografia e zeroization por tamper'
      ],
      badges: ['SECURITY', 'CRYPTO', 'TPM', 'AEAD', 'THREAT MODEL']
    }
  ];
  
  return (
    <section className="max-w-[1600px] mx-auto px-6 py-16 lg:py-24" id="selected-work">
      {/* Section Header */}
      <div className="mb-12">
        <h2 className="font-mono font-bold mb-4" style={{ color: 'var(--electric-blue)' }}>
          SELECTED WORK
        </h2>
        <p className="text-base" style={{ color: 'var(--terminal-muted)' }}>
          Sistemas completos. Cada case inclui produto, arquitetura e evidência.
        </p>
      </div>
      
      {/* Project Cards Grid */}
      <div className="grid gap-6 lg:gap-8">
        {projects.map((project, idx) => (
          <ProjectCard
            key={project.id}
            title={project.title}
            subtitle={project.subtitle}
            impact={project.impact}
            highlights={project.highlights}
            badges={project.badges}
            size={idx < 2 ? 'large' : 'medium'}
            onCaseStudy={() => onCaseStudy?.(project.id)}
            onDemo={project.demo ? () => onDemo?.(project.demo!) : undefined}
            onEvidence={onEvidence}
          />
        ))}
      </div>
    </section>
  );
}
