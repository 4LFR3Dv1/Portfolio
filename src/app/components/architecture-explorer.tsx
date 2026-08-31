import { useEffect } from 'react';
import { Button } from './button';
import { useLanguage } from '../context/language-context';
import { architectureLegacyViewAnchors, architecturePage } from '../data/architecture-page';

interface ArchitectureExplorerProps {
  onBack?: () => void;
}

const legacyHashAnchors: Record<string, string> = {
  '#architecture-systems': 'architecture-model',
  '#architecture-settlement': 'architecture-context-payments',
  '#architecture-agents': 'architecture-context-agents',
  '#architecture-realtime': 'architecture-context-realtime',
  '#architecture-handoff': 'architecture-context-people',
};

export function ArchitectureExplorer({ onBack }: ArchitectureExplorerProps) {
  const { language } = useLanguage();

  useEffect(() => {
    const requestedView = new URLSearchParams(window.location.search).get('view');
    const targetId = (requestedView && architectureLegacyViewAnchors[requestedView]) || legacyHashAnchors[window.location.hash];
    if (!targetId) return;

    window.requestAnimationFrame(() => {
      document.getElementById(targetId)?.scrollIntoView({ block: 'start' });
    });
  }, []);

  const copy = language === 'en'
    ? {
        back: 'BACK TO PORTFOLIO',
        modelNote: 'The exact implementation changes. This sequence is only a way to keep the responsibilities understandable.',
        question: 'QUESTION THAT MATTERS',
        explore: 'EXPLORE',
        footer: 'Architecture is useful when it makes a system easier to reason about, not when it makes the diagram more impressive.',
      }
    : {
        back: 'VOLTAR AO PORTFÓLIO',
        modelNote: 'A implementação concreta muda. Esta sequência serve apenas para manter as responsabilidades compreensíveis.',
        question: 'PERGUNTA QUE IMPORTA',
        explore: 'EXPLORAR',
        footer: 'Arquitetura é útil quando torna um sistema mais fácil de entender, não quando torna o diagrama mais impressionante.',
      };

  return (
    <main className="mx-auto max-w-[1240px] px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <header className="max-w-5xl border-b border-[var(--border-default)] pb-12 sm:pb-16">
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--electric-blue)]">
          {architecturePage.hero.eyebrow[language]}
        </p>
        <h1 className="mt-5 max-w-5xl font-mono text-4xl font-bold leading-[1.02] tracking-[-0.045em] text-[var(--terminal-text)] sm:text-5xl lg:text-[3.6rem]">
          {architecturePage.hero.title[language]}
        </h1>
        <p className="mt-7 max-w-3xl text-base leading-8 text-[var(--terminal-muted)] sm:text-lg">
          {architecturePage.hero.intro[language]}
        </p>

        {onBack && (
          <Button variant="ghost" onClick={onBack} className="mt-7 min-h-10">
            ← {copy.back}
          </Button>
        )}
      </header>

      <section id="architecture-model" className="scroll-mt-24 border-b border-[var(--border-default)] py-14 sm:py-16 lg:py-20">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:gap-16">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--electric-blue)]">
              {architecturePage.model.eyebrow[language]}
            </p>
            <p className="mt-5 max-w-xl text-base leading-8 text-[var(--terminal-muted)]">
              {architecturePage.model.intro[language]}
            </p>
            <p className="mt-6 max-w-xl border-l-2 border-[var(--electric-green)] pl-5 text-sm leading-7 text-[var(--terminal-text)]">
              {copy.modelNote}
            </p>
          </div>

          <ol className="relative">
            {architecturePage.model.steps.map((step, index) => (
              <li
                key={step.id}
                className="grid grid-cols-[2.75rem_minmax(0,1fr)] gap-4 border-t border-[var(--border-default)] py-5 first:border-t-0 first:pt-0 sm:grid-cols-[3.25rem_12rem_minmax(0,1fr)] sm:gap-6"
              >
                <span className="font-mono text-[10px] text-[var(--electric-blue)]">{String(index + 1).padStart(2, '0')}</span>
                <h2 className="font-mono text-sm font-semibold text-[var(--terminal-text)]">{step.label[language]}</h2>
                <p className="col-start-2 text-sm leading-6 text-[var(--terminal-muted)] sm:col-start-auto">{step.question[language]}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-b border-[var(--border-default)] py-14 sm:py-16 lg:py-20">
        <div className="max-w-3xl">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--electric-blue)]">
            {architecturePage.separations.eyebrow[language]}
          </p>
          <p className="mt-5 text-base leading-8 text-[var(--terminal-muted)] sm:text-lg">
            {architecturePage.separations.intro[language]}
          </p>
        </div>

        <ol className="mt-10 grid border-t border-[var(--border-default)] lg:grid-cols-2">
          {architecturePage.separations.items.map((item, index) => (
            <li
              key={item.label.en}
              className={`grid grid-cols-[2.75rem_minmax(0,1fr)] gap-4 border-b border-[var(--border-default)] py-7 lg:px-6 ${index % 2 === 0 ? 'lg:border-r' : ''}`}
            >
              <span className="font-mono text-[10px] text-[var(--terminal-muted)]">{String(index + 1).padStart(2, '0')}</span>
              <div>
                <h2 className="font-mono text-base font-semibold text-[var(--terminal-text)]">{item.label[language]}</h2>
                <p className="mt-3 max-w-xl text-sm leading-7 text-[var(--terminal-muted)]">{item.detail[language]}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-b border-[var(--border-default)] py-14 sm:py-16 lg:py-20">
        <div className="max-w-3xl">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--electric-blue)]">
            {architecturePage.contexts.eyebrow[language]}
          </p>
          <p className="mt-5 text-base leading-8 text-[var(--terminal-muted)] sm:text-lg">
            {architecturePage.contexts.intro[language]}
          </p>
        </div>

        <div className="mt-10 divide-y divide-[var(--border-default)] border-y border-[var(--border-default)]">
          {architecturePage.contexts.items.map((context, index) => (
            <article
              key={context.id}
              id={`architecture-context-${context.id}`}
              className="scroll-mt-24 grid gap-6 py-8 lg:grid-cols-[3rem_11rem_minmax(0,1fr)_minmax(260px,0.7fr)] lg:gap-8"
            >
              <span className="font-mono text-[10px] text-[var(--electric-blue)]">{String(index + 1).padStart(2, '0')}</span>
              <h2 className="font-mono text-base font-semibold text-[var(--terminal-text)]">{context.label[language]}</h2>
              <p className="text-sm leading-7 text-[var(--terminal-muted)]">{context.body[language]}</p>
              <div className="border-l-2 border-[var(--electric-green)] pl-5">
                <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-[var(--electric-green)]">{copy.question}</p>
                <p className="mt-3 text-sm leading-7 text-[var(--terminal-text)]">{context.question[language]}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="py-14 sm:py-16 lg:py-20">
        <div className="max-w-3xl">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--electric-blue)]">
            {architecturePage.projects.eyebrow[language]}
          </p>
          <p className="mt-5 text-base leading-8 text-[var(--terminal-muted)] sm:text-lg">
            {architecturePage.projects.intro[language]}
          </p>
        </div>

        <div className="mt-10 grid gap-px border border-[var(--border-default)] bg-[var(--border-default)] md:grid-cols-2 lg:grid-cols-3">
          {architecturePage.projects.items.map((project) => (
            <article key={project.name} className="flex min-h-[230px] flex-col bg-[var(--terminal-bg)] p-6">
              <h2 className="font-mono text-lg font-semibold text-[var(--terminal-text)]">{project.name}</h2>
              <p className="mt-4 flex-1 text-sm leading-7 text-[var(--terminal-muted)]">{project.description[language]}</p>
              <div className="mt-7 flex flex-wrap gap-x-5 gap-y-3">
                {project.links.map((link) => (
                  <a
                    key={`${project.name}-${link.href}`}
                    href={link.href}
                    target={link.external ? '_blank' : undefined}
                    rel={link.external ? 'noreferrer' : undefined}
                    className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--electric-blue)] no-underline hover:text-[var(--terminal-text)]"
                  >
                    {link.label[language]} {link.external ? '↗' : '→'}
                  </a>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <footer className="border-t border-[var(--border-default)] pt-7">
        <p className="max-w-3xl text-sm leading-7 text-[var(--terminal-muted)]">{copy.footer}</p>
        {onBack && (
          <Button variant="ghost" onClick={onBack} className="mt-5 min-h-10">
            ← {copy.back}
          </Button>
        )}
      </footer>
    </main>
  );
}
