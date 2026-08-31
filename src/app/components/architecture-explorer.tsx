import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { ArchitectureLegend, ArchitectureMap } from './architecture-map';
import { Button } from './button';
import { useLanguage } from '../context/language-context';
import { publicArchitectureViews, getPublicArchitectureView, type PublicArchitectureViewId } from '../data/public-architecture';

interface ArchitectureExplorerProps {
  onBack?: () => void;
}

function initialView(): PublicArchitectureViewId {
  if (typeof window === 'undefined') return 'systems';
  return getPublicArchitectureView(new URLSearchParams(window.location.search).get('view')).id;
}

export function ArchitectureExplorer({ onBack }: ArchitectureExplorerProps) {
  const { language } = useLanguage();
  const [activeViewId, setActiveViewId] = useState<PublicArchitectureViewId>(initialView);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const activeView = getPublicArchitectureView(activeViewId);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (activeViewId === 'systems') url.searchParams.delete('view');
    else url.searchParams.set('view', activeViewId);
    window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
  }, [activeViewId]);

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();

    let nextIndex = index;
    if (event.key === 'ArrowRight') nextIndex = (index + 1) % publicArchitectureViews.length;
    if (event.key === 'ArrowLeft') nextIndex = (index - 1 + publicArchitectureViews.length) % publicArchitectureViews.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = publicArchitectureViews.length - 1;

    const nextView = publicArchitectureViews[nextIndex];
    setActiveViewId(nextView.id);
    tabRefs.current[nextIndex]?.focus();
  };

  const copy = language === 'en'
    ? {
        eyebrow: 'HOW I THINK ABOUT SYSTEMS',
        title: 'ARCHITECTURE, WITHOUT THE CEREMONY',
        intro: 'Different products create different constraints, but the questions underneath repeat. Where does a decision live? Where does an effect happen? What do we trust after something fails? This explorer is a map of those recurring choices.',
        back: 'BACK TO PORTFOLIO',
        principles: [
          ['START', 'Make the intention understandable.'],
          ['MIDDLE', 'Separate decisions from the machinery that performs them.'],
          ['FINISH', 'Observe the result and preserve a way forward.'],
        ],
        nav: 'Architecture questions',
        select: 'Select a question',
        rule: 'RULE OF THUMB',
        flow: 'HOW IT MOVES',
        decisions: 'WHERE I DRAW THE LINE',
        preserve: 'WHAT I TRY TO PRESERVE',
        examples: 'WHERE THIS SHOWS UP',
        note: 'This is a simplified map of recurring design patterns. It is meant to explain how I reason about systems, not to publish a blueprint of any private implementation.',
      }
    : {
        eyebrow: 'COMO EU PENSO SISTEMAS',
        title: 'ARQUITETURA, SEM CERIMÔNIA',
        intro: 'Produtos diferentes criam restrições diferentes, mas as perguntas por baixo se repetem. Onde uma decisão vive? Onde um efeito acontece? Em que confiamos depois que algo falha? Este explorador é um mapa dessas escolhas recorrentes.',
        back: 'VOLTAR AO PORTFÓLIO',
        principles: [
          ['COMEÇO', 'Tornar a intenção compreensível.'],
          ['MEIO', 'Separar decisões da máquina que as executa.'],
          ['FIM', 'Observar o resultado e preservar um caminho adiante.'],
        ],
        nav: 'Perguntas de arquitetura',
        select: 'Selecionar uma pergunta',
        rule: 'REGRA PRÁTICA',
        flow: 'COMO SE MOVE',
        decisions: 'ONDE EU DESENHO A LINHA',
        preserve: 'O QUE EU TENTO PRESERVAR',
        examples: 'ONDE ISSO APARECE',
        note: 'Este é um mapa simplificado de padrões de design recorrentes. A intenção é explicar como eu raciocino sobre sistemas, não publicar o blueprint de nenhuma implementação privada.',
      };

  return (
    <main className="mx-auto max-w-[1500px] px-4 py-10 sm:px-6 sm:py-16">
      <header className="border-b border-[var(--border-default)] pb-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-4xl">
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--electric-blue)]">{copy.eyebrow}</p>
            <h1 className="mt-4 max-w-3xl font-mono text-3xl font-bold tracking-tight text-[var(--terminal-text)] sm:text-4xl lg:text-5xl">
              {copy.title}
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-relaxed text-[var(--terminal-muted)] sm:text-lg">{copy.intro}</p>
          </div>

          {onBack && (
            <Button variant="ghost" onClick={onBack} className="min-h-10 self-start lg:self-auto">
              ← {copy.back}
            </Button>
          )}
        </div>

        <dl className="mt-10 grid gap-px bg-[var(--border-default)] md:grid-cols-3">
          {copy.principles.map(([label, text]) => (
            <div key={label} className="bg-[var(--surface-1)] p-5 sm:p-6">
              <dt className="font-mono text-[10px] uppercase tracking-wider text-[var(--electric-blue)]">{label}</dt>
              <dd className="mt-3 text-sm leading-relaxed text-[var(--terminal-text)]">{text}</dd>
            </div>
          ))}
        </dl>
      </header>

      <nav className="py-8" aria-label={copy.nav}>
        <div role="tablist" aria-label={copy.select} className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-5">
          {publicArchitectureViews.map((view, index) => {
            const isActive = view.id === activeViewId;
            return (
              <button
                key={view.id}
                ref={(element) => { tabRefs.current[index] = element; }}
                type="button"
                role="tab"
                id={`architecture-tab-${view.id}`}
                aria-controls={`architecture-panel-${view.id}`}
                aria-selected={isActive}
                tabIndex={isActive ? 0 : -1}
                onClick={() => setActiveViewId(view.id)}
                onKeyDown={(event) => handleTabKeyDown(event, index)}
                className={`min-h-16 border px-4 py-3 text-left transition-colors duration-100 focus-visible:ring-2 focus-visible:ring-[var(--electric-blue)] ${
                  isActive
                    ? 'border-[var(--electric-blue)] bg-[var(--surface-2)] text-[var(--terminal-text)]'
                    : 'border-[var(--border-default)] bg-[var(--surface-1)] text-[var(--terminal-muted)] hover:border-[var(--border-strong)] hover:text-[var(--terminal-text)]'
                }`}
              >
                <span className="mr-3 font-mono text-[10px] text-[var(--electric-blue)]">{view.index}</span>
                <span className="text-xs leading-snug">{view.shortLabel[language]}</span>
              </button>
            );
          })}
        </div>
      </nav>

      <section
        role="tabpanel"
        id={`architecture-panel-${activeView.id}`}
        aria-labelledby={`architecture-tab-${activeView.id}`}
        className="border border-[var(--border-default)] bg-[var(--surface-1)]"
      >
        <div className="border-b border-[var(--border-default)] p-5 sm:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="max-w-4xl">
              <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--electric-blue)]">
                {activeView.index} // {activeView.shortLabel[language]}
              </p>
              <h2 className="mt-4 max-w-3xl font-mono text-2xl font-semibold leading-tight text-[var(--terminal-text)] sm:text-3xl">
                {activeView.title[language]}
              </h2>
              <p className="mt-5 max-w-3xl text-base leading-relaxed text-[var(--terminal-muted)]">{activeView.summary[language]}</p>
            </div>

            <aside className="border-l-2 border-[var(--electric-green)] bg-[var(--surface-2)] p-5">
              <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--electric-green)]">{copy.rule}</p>
              <p className="mt-3 text-sm leading-relaxed text-[var(--terminal-text)]">{activeView.principle[language]}</p>
            </aside>
          </div>
        </div>

        <div className="p-5 sm:p-8 lg:p-10">
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <h2 className="font-mono text-xs uppercase tracking-wider text-[var(--terminal-text)]">{copy.flow}</h2>
            <ArchitectureLegend language={language} />
          </div>
          <ArchitectureMap
            steps={activeView.steps}
            language={language}
            label={`${activeView.title[language]} — ${copy.flow.toLowerCase()}`}
          />
        </div>

        <div className="grid border-t border-[var(--border-default)] lg:grid-cols-[1.25fr_0.75fr]">
          <section className="border-b border-[var(--border-default)] p-5 sm:p-8 lg:border-b-0 lg:border-r lg:p-10">
            <h2 className="font-mono text-xs uppercase tracking-wider text-[var(--electric-blue)]">{copy.decisions}</h2>
            <ol className="mt-6 space-y-5">
              {activeView.boundaries.map((boundary, index) => (
                <li key={boundary.label.en} className="grid gap-3 border-t border-[var(--border-default)] pt-5 sm:grid-cols-[2rem_12rem_1fr]">
                  <span className="font-mono text-[10px] text-[var(--terminal-muted)]">{String(index + 1).padStart(2, '0')}</span>
                  <h3 className="font-mono text-sm font-semibold text-[var(--terminal-text)]">{boundary.label[language]}</h3>
                  <p className="text-sm leading-relaxed text-[var(--terminal-muted)]">{boundary.detail[language]}</p>
                </li>
              ))}
            </ol>
          </section>

          <aside className="p-5 sm:p-8 lg:p-10">
            <h2 className="font-mono text-xs uppercase tracking-wider text-[var(--electric-green)]">{copy.preserve}</h2>
            <ul className="mt-5 space-y-3">
              {activeView.guarantees[language].map((item) => (
                <li key={item} className="border-t border-[var(--border-default)] pt-3 text-sm leading-relaxed text-[var(--terminal-text)]">
                  {item}
                </li>
              ))}
            </ul>

            {activeView.examples.length > 0 && (
              <>
                <h2 className="mt-9 font-mono text-xs uppercase tracking-wider text-[var(--terminal-muted)]">{copy.examples}</h2>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {activeView.examples.map((example) => (
                    <li key={example} className="border border-[var(--border-default)] px-3 py-2 font-mono text-[10px] text-[var(--terminal-text)]">{example}</li>
                  ))}
                </ul>
              </>
            )}
          </aside>
        </div>
      </section>

      <footer className="mt-6 border-l-2 border-[var(--border-strong)] px-4 py-2">
        <p className="max-w-4xl text-sm leading-relaxed text-[var(--terminal-muted)]">{copy.note}</p>
      </footer>
    </main>
  );
}
