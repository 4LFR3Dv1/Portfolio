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
        role: 'Blockchain & Agentic Systems Engineer',
        author: 'Author of VERIFY SYSTEMS',
        description: 'I build verifiable financial products, agentic systems and developer tooling — from protocol and backend architecture to the interfaces people use.',
        focus: ['Financial infrastructure', 'Agent platforms', 'Real-time products', 'Developer tooling'],
        quick: 'VERIFIABLE LINKS',
        portfolio: 'PERSONAL GITHUB',
        demo: 'SNE OS',
      }
    : {
        role: 'Engenheiro de Blockchain & Sistemas Agênticos',
        author: 'Autor de VERIFY SYSTEMS',
        description: 'Construo produtos financeiros, sistemas agênticos e ferramentas para desenvolvedores — da arquitetura de protocolo e backend até as interfaces usadas por pessoas.',
        focus: ['Infraestrutura financeira', 'Plataformas de agentes', 'Produtos em tempo real', 'Ferramentas para desenvolvedores'],
        quick: 'LINKS VERIFICÁVEIS',
        portfolio: 'GITHUB PESSOAL',
        demo: 'SNE OS',
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
            <Badge variant="green">PRODUCTION SYSTEMS</Badge>
            <Badge variant="blue">END-TO-END ENGINEERING</Badge>
            <Badge variant="purple">AGENTIC WORKFLOWS</Badge>
            <Badge variant="amber">BITCOIN + SOLANA</Badge>
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
              <QuickLink label="VIRA" value="vira.snelabs.space" url="https://vira.snelabs.space/?lang=en" />
              <QuickLink label={copy.demo} value="snelabs.space" url="https://snelabs.space" />
              <QuickLink label="LINKEDIN" value="renan-melo-connexions" url="https://linkedin.com/in/renan-melo-connexions" />
            </div>
          </div>
        </div>

        <aside className="border border-[var(--border-default)] bg-[var(--surface-1)] lg:sticky lg:top-24">
          <div className="border-b border-[var(--border-default)] px-6 py-4 bg-[var(--surface-2)]">
            <div className="font-mono text-xs uppercase tracking-wider" style={{ color: '#a855f7' }}>
              CURRENT FOCUS // SYSTEMS THAT PROVE THEIR STATE
            </div>
          </div>
          <div className="p-6 space-y-5">
            <p className="text-sm leading-relaxed" style={{ color: 'var(--terminal-text)' }}>
              {language === 'en'
                ? 'My current work combines authoritative runtimes, local-first financial security and operational control planes for AI agents.'
                : 'Meu trabalho atual combina runtimes autoritativos, segurança financeira local-first e planos de controle operacional para agentes de IA.'}
            </p>
            <div className="grid gap-3">
              <FocusRow label="VIRA" value={language === 'en' ? 'LIVE + VERIFIABLE' : 'ONLINE + VERIFICÁVEL'} />
              <FocusRow label="XS WALLET" value="TECHNICAL PRE-BETA" />
              <FocusRow label="AGENTIC SYSTEMS" value={language === 'en' ? 'PRIVATE R&D' : 'P&D PRIVADO'} />
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

function QuickLink({ label, value, url }: { label: string; value: string; url: string }) {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[var(--terminal-muted)] hover:text-[var(--electric-blue)] transition-colors">
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
