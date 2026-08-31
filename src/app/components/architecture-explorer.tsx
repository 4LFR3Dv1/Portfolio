import { useEffect } from 'react';
import { ArchitectureMap } from './architecture-map';
import { Button } from './button';
import { useLanguage } from '../context/language-context';
import { getPublicArchitectureView, publicArchitectureViews } from '../data/public-architecture';

interface ArchitectureExplorerProps {
  onBack?: () => void;
}

export function ArchitectureExplorer({ onBack }: ArchitectureExplorerProps) {
  const { language } = useLanguage();

  useEffect(() => {
    const requestedView = new URLSearchParams(window.location.search).get('view');
    if (!requestedView) return;

    const view = getPublicArchitectureView(requestedView);
    if (view.id === 'systems' && requestedView !== 'systems') return;

    window.requestAnimationFrame(() => {
      document.getElementById(`architecture-${view.id}`)?.scrollIntoView({ block: 'start' });
    });
  }, []);

  const copy = language === 'en'
    ? {
        eyebrow: 'HOW I MAKE SYSTEM DECISIONS',
        title: 'Five questions I keep asking while building.',
        intro: 'Architecture becomes useful to me when it explains decisions: what enters a system, who decides, where the effect happens, how we know what happened, and what comes next. The five sections below show that reasoning directly. You can read everything from top to bottom; the index is only a shortcut.',
        back: 'BACK TO PORTFOLIO',
        index: 'ON THIS PAGE',
        indexHint: 'Five recurring questions. One continuous read.',
        centralIdea: 'CENTRAL IDEA',
        flow: 'HOW I THINK ABOUT THE FLOW',
        decisions: 'DECISIONS THAT SEPARATE RESPONSIBILITIES',
        preserve: 'WHAT NEEDS TO REMAIN TRUE',
        examples: 'EXAMPLES',
        stages: 'steps',
        note: 'These are recurring ways I reason about systems, not fixed recipes. The implementation changes with the product; the questions are what tend to survive.',
      }
    : {
        eyebrow: 'COMO EU TOMO DECISÕES DE SISTEMA',
        title: 'Cinco perguntas que continuo fazendo enquanto construo.',
        intro: 'Arquitetura fica útil para mim quando explica decisões: o que entra no sistema, quem decide, onde o efeito acontece, como sabemos o que aconteceu e o que vem depois. As cinco seções abaixo mostram esse raciocínio diretamente. Dá para ler tudo de cima para baixo; o índice serve apenas como atalho.',
        back: 'VOLTAR AO PORTFÓLIO',
        index: 'NESTA PÁGINA',
        indexHint: 'Cinco perguntas recorrentes. Uma leitura contínua.',
        centralIdea: 'IDEIA CENTRAL',
        flow: 'COMO EU PENSO O FLUXO',
        decisions: 'DECISÕES QUE SEPARAM RESPONSABILIDADES',
        preserve: 'O QUE PRECISA CONTINUAR VERDADE',
        examples: 'EXEMPLOS',
        stages: 'etapas',
        note: 'Essas são formas recorrentes de raciocinar sobre sistemas, não receitas fixas. A implementação muda conforme o produto; as perguntas são o que costuma permanecer.',
      };

  return (
    <main className="mx-auto max-w-[1280px] px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <header className="max-w-5xl border-b border-[var(--border-default)] pb-12 sm:pb-14">
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--electric-blue)]">{copy.eyebrow}</p>

        <h1 className="mt-5 max-w-4xl font-mono text-4xl font-bold leading-[1] tracking-[-0.04em] text-[var(--terminal-text)] sm:text-5xl lg:text-[3.5rem]">
          {copy.title}
        </h1>

        <p className="mt-6 max-w-3xl text-base leading-8 text-[var(--terminal-muted)] sm:text-lg">{copy.intro}</p>

        {onBack && (
          <Button variant="ghost" onClick={onBack} className="mt-7 min-h-10">
            ← {copy.back}
          </Button>
        )}
      </header>

      <nav className="border-b border-[var(--border-default)] py-8" aria-label={copy.index}>
        <div className="mb-5 flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--electric-blue)]">{copy.index}</h2>
          <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--terminal-muted)]">{copy.indexHint}</p>
        </div>

        <ol className="grid gap-px border border-[var(--border-default)] bg-[var(--border-default)] md:grid-cols-5">
          {publicArchitectureViews.map((view) => (
            <li key={view.id} className="bg-[var(--terminal-bg)]">
              <a
                href={`#architecture-${view.id}`}
                className="group block h-full min-h-[116px] px-4 py-4 transition-colors hover:bg-[var(--terminal-surface)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--electric-blue)]"
              >
                <span className="font-mono text-[10px] text-[var(--electric-blue)]">{view.index}</span>
                <span className="mt-3 block font-mono text-sm font-semibold leading-5 text-[var(--terminal-text)] group-hover:text-[var(--electric-blue)]">
                  {view.shortLabel[language]}
                </span>
                <span className="mt-2 block text-xs leading-5 text-[var(--terminal-muted)]">
                  {view.title[language]}
                </span>
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div>
        {publicArchitectureViews.map((view, viewIndex) => (
          <article
            key={view.id}
            id={`architecture-${view.id}`}
            className="scroll-mt-24 border-b border-[var(--border-default)] py-14 sm:py-16 lg:py-20"
          >
            <header className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-16">
              <div className="max-w-4xl">
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--electric-blue)]">
                  {view.index} / {view.shortLabel[language]}
                </p>
                <h2 className="mt-4 max-w-4xl font-mono text-3xl font-semibold leading-[1.08] tracking-[-0.03em] text-[var(--terminal-text)] sm:text-4xl">
                  {view.title[language]}
                </h2>
                <p className="mt-5 max-w-3xl text-base leading-8 text-[var(--terminal-muted)] sm:text-lg">
                  {view.summary[language]}
                </p>
              </div>

              <aside className="self-end border-l-2 border-[var(--electric-green)] pl-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--electric-green)]">{copy.centralIdea}</p>
                <p className="mt-3 text-base leading-7 text-[var(--terminal-text)]">{view.principle[language]}</p>
              </aside>
            </header>

            <section className="mt-10 border-y border-[var(--border-default)] py-9 sm:mt-12 sm:py-10">
              <div className="mb-7 flex flex-wrap items-baseline justify-between gap-4">
                <h3 className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--terminal-text)]">{copy.flow}</h3>
                <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--terminal-muted)]">
                  {view.steps.length} {copy.stages}
                </span>
              </div>
              <ArchitectureMap
                steps={view.steps}
                language={language}
                label={`${view.title[language]} — ${copy.flow.toLowerCase()}`}
              />
            </section>

            <div className="grid gap-12 pt-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)] lg:gap-16 lg:pt-12">
              <section>
                <h3 className="border-b border-[var(--border-default)] pb-4 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--electric-blue)]">
                  {copy.decisions}
                </h3>
                <ol>
                  {view.boundaries.map((boundary, index) => (
                    <li
                      key={boundary.label.en}
                      className="grid gap-3 border-b border-[var(--border-default)] py-5 sm:grid-cols-[2.25rem_minmax(150px,0.4fr)_minmax(0,1fr)] sm:gap-5"
                    >
                      <span className="font-mono text-[10px] text-[var(--terminal-muted)]">{String(index + 1).padStart(2, '0')}</span>
                      <h4 className="font-mono text-sm font-semibold leading-6 text-[var(--terminal-text)]">{boundary.label[language]}</h4>
                      <p className="text-sm leading-7 text-[var(--terminal-muted)]">{boundary.detail[language]}</p>
                    </li>
                  ))}
                </ol>
              </section>

              <aside>
                <h3 className="border-b border-[var(--border-default)] pb-4 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--electric-green)]">
                  {copy.preserve}
                </h3>
                <ul>
                  {view.guarantees[language].map((item, index) => (
                    <li
                      key={item}
                      className="grid grid-cols-[2rem_1fr] gap-4 border-b border-[var(--border-default)] py-4 text-sm leading-6 text-[var(--terminal-text)]"
                    >
                      <span className="font-mono text-[10px] text-[var(--electric-green)]">{String(index + 1).padStart(2, '0')}</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                {view.examples.length > 0 && (
                  <div className="mt-8">
                    <h3 className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--terminal-muted)]">{copy.examples}</h3>
                    <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
                      {view.examples.map((example) => (
                        <li key={example} className="font-mono text-xs text-[var(--terminal-text)]">{example}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </aside>
            </div>

            {viewIndex < publicArchitectureViews.length - 1 && (
              <a
                href={`#architecture-${publicArchitectureViews[viewIndex + 1].id}`}
                className="mt-10 inline-flex font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--terminal-muted)] no-underline hover:text-[var(--electric-blue)]"
              >
                {language === 'en' ? 'NEXT QUESTION' : 'PRÓXIMA PERGUNTA'} ↓
              </a>
            )}
          </article>
        ))}
      </div>

      <footer className="pt-8">
        <p className="max-w-4xl text-sm leading-7 text-[var(--terminal-muted)]">{copy.note}</p>
        {onBack && (
          <Button variant="ghost" onClick={onBack} className="mt-5 min-h-10">
            ← {copy.back}
          </Button>
        )}
      </footer>
    </main>
  );
}
