import { Button } from './button';
import { currentFocus } from '../data/current-focus';
import { useLanguage } from '../context/language-context';

interface HeroSectionProps {
  onViewProjects?: () => void;
  onContact?: () => void;
}

export function HeroSection({ onViewProjects, onContact }: HeroSectionProps) {
  const { language } = useLanguage();
  const copy = language === 'en'
    ? {
        eyebrow: 'SOFTWARE · PRODUCT · COMPUTING',
        lead: 'I design and build software systems.',
        description: 'My work moves between product, infrastructure, AI and experimental computing. I usually start with a question, build until the problem becomes concrete, and then try to explain what I learned without hiding the idea behind jargon.',
        work: 'VIEW WORK',
        editorial: 'READ EDITORIAL',
        contact: 'CONTACT',
        now: 'NOW',
        currentStudies: 'CURRENT STUDIES',
        links: 'ELSEWHERE',
      }
    : {
        eyebrow: 'SOFTWARE · PRODUTO · COMPUTAÇÃO',
        lead: 'Projeto e construo sistemas de software.',
        description: 'Meu trabalho passa por produto, infraestrutura, IA e computação experimental. Normalmente começo por uma pergunta, construo até o problema ficar concreto e depois tento explicar o que aprendi sem esconder a ideia atrás de jargão.',
        work: 'VER TRABALHOS',
        editorial: 'LER EDITORIAL',
        contact: 'CONTATO',
        now: 'AGORA',
        currentStudies: 'ESTUDOS ATUAIS',
        links: 'OUTROS LUGARES',
      };

  return (
    <section className="mx-auto max-w-[1600px] px-6 py-16 lg:py-28">
      <div className="grid gap-14 lg:grid-cols-[minmax(0,1.35fr)_minmax(360px,.65fr)] lg:items-start">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--terminal-muted)]">
            {copy.eyebrow}
          </div>
          <h1 className="mt-5 font-mono text-4xl font-bold tracking-[-0.04em] text-[var(--electric-blue)] sm:text-5xl lg:text-7xl">
            RENAN MELO
          </h1>
          <p className="mt-8 max-w-4xl text-2xl font-medium leading-tight text-[var(--terminal-text)] sm:text-3xl lg:text-4xl">
            {copy.lead}
          </p>
          <p className="mt-6 max-w-3xl text-base leading-relaxed text-[var(--terminal-muted)] sm:text-lg">
            {copy.description}
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Button variant="primary" onClick={onViewProjects}>{copy.work}</Button>
            <a
              href="/editorial/"
              className="inline-flex min-h-10 items-center justify-center border border-[var(--border-default)] bg-[var(--surface-1)] px-4 font-mono text-xs text-[var(--terminal-text)] transition-colors hover:border-[var(--electric-blue)] hover:text-[var(--electric-blue)]"
            >
              {copy.editorial}
            </a>
            <Button variant="ghost" onClick={onContact}>{copy.contact}</Button>
          </div>

          <div className="mt-12 border-t border-[var(--border-subtle)] pt-5">
            <div className="mb-4 font-mono text-[10px] uppercase tracking-wider text-[var(--terminal-muted)]">{copy.links}</div>
            <div className="flex flex-wrap gap-x-6 gap-y-3 font-mono text-xs">
              <QuickLink label="GITHUB" url="https://github.com/4LFR3Dv1" />
              <QuickLink label="SNE LABS" url="https://home.snelabs.space/" />
              <QuickLink label="LINKEDIN" url="https://linkedin.com/in/renan-melo-connexions" />
            </div>
          </div>
        </div>

        <aside className="border border-[var(--border-default)] bg-[var(--surface-1)]">
          <div className="flex items-center justify-between gap-4 border-b border-[var(--border-default)] bg-[var(--surface-2)] px-6 py-4 font-mono text-xs">
            <span className="text-[#a855f7]">{copy.now}</span>
            <a href="/editorial/#estudos-atuais" className="text-[10px] text-[var(--terminal-muted)] transition-colors hover:text-[var(--electric-blue)]">
              {copy.currentStudies} →
            </a>
          </div>
          <ol className="divide-y divide-[var(--border-subtle)]">
            {currentFocus.map((item, index) => (
              <li key={item.id} className="px-6 py-5">
                <div className="grid grid-cols-[32px_1fr] gap-4">
                  <span className="pt-0.5 font-mono text-xs text-[var(--terminal-muted)]">{String(index + 1).padStart(2, '0')}</span>
                  <div>
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                      <span className="font-mono text-sm font-bold text-[var(--terminal-text)]">{item.name[language]}</span>
                      <span className="font-mono text-[9px] uppercase tracking-wider text-[#00ff84]">{item.state[language]}</span>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-[var(--terminal-muted)]">{item.description[language]}</p>

                    <div className="mt-4 space-y-3 border-t border-[var(--border-subtle)] pt-3">
                      {item.studies.map((study) => (
                        <a key={study.href} href={study.href} className="group block">
                          <span className="block font-mono text-[9px] uppercase tracking-wider text-[#a855f7]">{study.state[language]}</span>
                          <span className="mt-1 block text-xs leading-relaxed text-[var(--terminal-text)] transition-colors group-hover:text-[var(--electric-blue)]">
                            {study.title[language]} →
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </aside>
      </div>
    </section>
  );
}

function QuickLink({ label, url }: { label: string; url: string }) {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="text-[var(--terminal-muted)] transition-colors hover:text-[var(--electric-blue)]">
      {label} ↗
    </a>
  );
}
