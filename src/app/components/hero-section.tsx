import { Badge } from './badge';
import { Button } from './button';
import { useLanguage } from '../context/language-context';

interface HeroSectionProps {
  onViewProjects?: () => void;
  onArchitecture?: () => void;
  onContact?: () => void;
}

export function HeroSection({ onViewProjects, onArchitecture, onContact }: HeroSectionProps) {
  const { language, t } = useLanguage();
  const copy = language === 'en'
    ? {
        role: 'Computing Systems Engineer',
        author: 'SNE Labs // Computing Research',
        description: 'I build computing systems, agent-native runtimes and experimental infrastructure — from bare-metal and network primitives to governed software surfaces.',
        focus: ['Agent-native systems', 'Bare-metal research', 'Computing infrastructure', 'Applied research'],
        quick: 'CURRENT SURFACES',
        portfolio: 'PERSONAL GITHUB',
        editorial: 'EDITORIAL',
        lab: 'SNE LABS',
      }
    : {
        role: 'Engenheiro de Sistemas Computacionais',
        author: 'SNE Labs // Pesquisa em Computação',
        description: 'Construo sistemas computacionais, runtimes agent-native e infraestrutura experimental — de primitivas bare-metal e de rede a superfícies de software governadas.',
        focus: ['Sistemas agent-native', 'Pesquisa bare-metal', 'Infraestrutura computacional', 'Pesquisa aplicada'],
        quick: 'SUPERFÍCIES ATUAIS',
        portfolio: 'GITHUB PESSOAL',
        editorial: 'EDITORIAL',
        lab: 'SNE LABS',
      };

  return (
    <section className="max-w-[1600px] mx-auto px-6 py-16 lg:py-24">
      <div className="grid lg:grid-cols-2 gap-12 items-start">
        <div className="space-y-8">
          <div className="space-y-3">
            <h1 className="font-mono font-bold tracking-tight text-4xl lg:text-5xl" style={{ color: 'var(--electric-blue)' }}>
              RENAN MELO
            </h1>
            <div className="font-mono text-sm lg:text-base tracking-wide flex flex-wrap items-center gap-2">
              <span style={{ color: 'var(--terminal-text)' }}>{copy.role}</span>
              <span style={{ color: 'var(--border-strong)' }}>|</span>
              <span style={{ color: '#a855f7' }}>{copy.author}</span>
            </div>
          </div>

          <div className="space-y-4 max-w-2xl">
            <p className="text-base leading-relaxed" style={{ color: 'var(--terminal-text)' }}>{copy.description}</p>
            <div className="grid sm:grid-cols-2 gap-2 font-mono text-xs pl-4 border-l-2 border-[var(--border-default)]">
              {copy.focus.map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <span aria-hidden="true" style={{ color: 'var(--electric-blue)' }}>▸</span>
                  <span style={{ color: 'var(--terminal-muted)' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Badge variant="green">COMPUTING SYSTEMS</Badge>
            <Badge variant="blue">AGENT-NATIVE</Badge>
            <Badge variant="purple">RESEARCH + ENGINEERING</Badge>
            <Badge variant="amber">LOCAL-FIRST</Badge>
          </div>

          <div className="flex flex-wrap gap-4 pt-4">
            <Button variant="primary" onClick={onViewProjects}>{t('hero.cta.work')}</Button>
            <Button variant="secondary" onClick={onArchitecture}>{t('hero.cta.architecture')}</Button>
            <Button variant="ghost" onClick={onContact}>{t('hero.cta.contact')}</Button>
          </div>

          <div className="pt-8 border-t border-[var(--border-subtle)]">
            <div className="font-mono text-[10px] uppercase tracking-wider mb-4" style={{ color: 'var(--terminal-muted)' }}>{copy.quick}</div>
            <div className="grid sm:grid-cols-2 gap-3 font-mono text-sm">
              <QuickLink label={copy.portfolio} value="4LFR3Dv1" url="https://github.com/4LFR3Dv1" />
              <QuickLink label={copy.editorial} value="renan.snelabs.space/editorial" url="/editorial/" external={false} />
              <QuickLink label={copy.lab} value="snelabs.space" url="https://snelabs.space" />
              <QuickLink label="LINKEDIN" value="renan-melo-connexions" url="https://linkedin.com/in/renan-melo-connexions" />
            </div>
          </div>
        </div>

        <aside className="border border-[var(--border-default)] bg-[var(--surface-1)] lg:sticky lg:top-24">
          <div className="border-b border-[var(--border-default)] px-6 py-4 bg-[var(--surface-2)]">
            <div className="font-mono text-xs uppercase tracking-wider" style={{ color: '#a855f7' }}>
              CURRENT FOCUS // SYSTEMS IN MOTION
            </div>
          </div>
          <div className="p-6 space-y-5">
            <p className="text-sm leading-relaxed" style={{ color: 'var(--terminal-text)' }}>
              {language === 'en'
                ? 'Current work spans governed web runtimes, bare-metal AI-native computing and field systems that turn research into executable infrastructure.'
                : 'O trabalho atual atravessa runtimes web governados, computação AI-native bare-metal e sistemas de campo que transformam pesquisa em infraestrutura executável.'}
            </p>
            <div className="grid gap-3">
              <FocusRow label="GENESIS" value={language === 'en' ? 'ACTIVE R&D' : 'P&D ATIVO'} />
              <FocusRow label="BRINEOS" value={language === 'en' ? 'BARE-METAL RESEARCH' : 'PESQUISA BARE-METAL'} />
              <FocusRow label="SNE-FDE" value={language === 'en' ? 'FIELD SYSTEM' : 'SISTEMA DE CAMPO'} />
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

function QuickLink({ label, value, url, external = true }: { label: string; value: string; url: string; external?: boolean }) {
  return (
    <a
      href={url}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className="flex items-center gap-2 text-[var(--terminal-muted)] hover:text-[var(--electric-blue)] transition-colors"
    >
      <span aria-hidden="true" className="text-[var(--electric-blue)]">→</span>
      <span className="uppercase text-xs">{label}:</span>
      <span>{value}</span>
    </a>
  );
}

function FocusRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 text-xs font-mono border-t border-[var(--border-subtle)] pt-3">
      <span style={{ color: 'var(--terminal-muted)' }}>{label}</span>
      <span style={{ color: 'var(--electric-green)' }}>{value}</span>
    </div>
  );
}
