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
        eyebrow: 'Renan Melo · Engineering studio',
        headline: 'I build systems that prove their state.',
        description: 'Blockchain infrastructure, agentic runtimes and real-time products engineered from protocol to interface.',
        status: 'Selected system · live now',
        vira: 'A real-time football product with server-authoritative challenges, resolution and ranking.',
        proof: 'Open live product',
        architecture: 'Explore architecture',
        current: 'Current practice',
        disciplines: ['Financial infrastructure', 'Agent control planes', 'Real-time products', 'Developer experience'],
      }
    : {
        eyebrow: 'Renan Melo · Estúdio de engenharia',
        headline: 'Construo sistemas que provam seu estado.',
        description: 'Infraestrutura blockchain, runtimes agênticos e produtos em tempo real — do protocolo à interface.',
        status: 'Sistema selecionado · online agora',
        vira: 'Produto de futebol em tempo real com desafios, resolução e ranking controlados pelo servidor.',
        proof: 'Abrir produto online',
        architecture: 'Explorar arquitetura',
        current: 'Prática atual',
        disciplines: ['Infraestrutura financeira', 'Planos de controle para agentes', 'Produtos em tempo real', 'Experiência de desenvolvimento'],
      };

  return (
    <section className="relative mx-auto max-w-[1480px] overflow-hidden px-6 pb-24 pt-24 lg:px-10 lg:pb-32 lg:pt-36">
      <div className="pointer-events-none absolute right-[-12rem] top-12 h-[36rem] w-[36rem] rounded-full bg-[rgba(104,126,255,0.12)] blur-[110px]" />
      <div className="grid items-end gap-16 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="relative z-10">
          <div className="eyebrow mb-8 flex items-center gap-3">
            <span className="h-px w-10 bg-[var(--electric-green)]" />
            {copy.eyebrow}
          </div>

          <h1 className="max-w-5xl text-gradient">{copy.headline}</h1>

          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-[var(--terminal-muted)] sm:text-xl">
            {copy.description}
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Button variant="primary" onClick={onViewProjects}>{t('hero.cta.work')} <span className="ml-2">↘</span></Button>
            <Button variant="secondary" onClick={onArchitecture}>{copy.architecture}</Button>
            <Button variant="ghost" onClick={onContact}>{t('hero.cta.contact')}</Button>
          </div>

          <div className="mt-14 grid max-w-3xl gap-x-8 gap-y-4 border-t border-[var(--border-subtle)] pt-6 sm:grid-cols-2">
            {copy.disciplines.map((item, index) => (
              <div key={item} className="flex items-center gap-3 text-sm text-[var(--terminal-muted)]">
                <span className="font-mono text-[10px] text-[var(--electric-blue)]">0{index + 1}</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <aside className="glass-panel relative overflow-hidden rounded-[2rem] p-6 sm:p-8">
          <div className="absolute right-[-3rem] top-[-4rem] h-48 w-48 rounded-full bg-[rgba(101,230,180,0.12)] blur-3xl" />
          <div className="relative">
            <div className="eyebrow flex items-center justify-between">
              <span>{copy.status}</span>
              <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--electric-green)] shadow-[0_0_18px_var(--electric-green)]" />
            </div>
            <div className="mt-14 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--terminal-muted)]">01 / VIRA</div>
            <h2 className="mt-3 !text-5xl !tracking-[-0.06em] text-white sm:!text-6xl">Live intelligence.<br />Authoritative state.</h2>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-[var(--terminal-muted)]">{copy.vira}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="https://vira.snelabs.space/?lang=en" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[var(--electric-green)] px-4 py-2.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-[#07100d] transition-transform hover:-translate-y-0.5">
                {copy.proof} <span>↗</span>
              </a>
              <a href="https://github.com/4LFR3Dv1" target="_blank" rel="noopener noreferrer" className="inline-flex items-center rounded-full border border-[var(--border-default)] px-4 py-2.5 font-mono text-[10px] uppercase tracking-wider text-[var(--terminal-muted)] hover:border-[var(--electric-blue)] hover:text-white">
                GitHub / 4LFR3Dv1
              </a>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
