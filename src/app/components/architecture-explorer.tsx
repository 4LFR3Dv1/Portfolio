import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { ArchitectureMap } from './architecture-map';
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
        questionCount: '05 recurring questions',
        stageLabel: 'stages',
        boundaryLabel: 'boundaries',
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
        questionCount: '05 perguntas recorrentes',
        stageLabel: 'etapas',
        boundaryLabel: 'limites',
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
    <main className="mx-auto max-w-[1380px] px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
      <header className="grid gap-10 border-b border-[var(--border-default)] pb-12 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-16 lg:pb-16">
        <div className="max-w-4xl">
          <div className="flex flex-wrap items-center gap-4">
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--electric-blue)]">{copy.eyebrow}</p>
            <span className="h-px w-10 bg-[var(--border-strong)]" aria-hidden="true" />
            <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--terminal-muted)]">{copy.questionCount}</span>
          </div>

          <h1 className="mt-5 max-w-4xl font-mono text-4xl font-bold leading-[0.98] tracking-[-0.04em] text-[var(--terminal-text)] sm:text-5xl lg:text-6xl">
            {copy.title}
          </h1>
          <p className="mt-7 max-w-3xl text-base leading-8 text-[var(--terminal-muted)] sm:text-lg">{copy.intro}</p>

          {onBack && (
            <Button variant="ghost" onClick={onBack} className="mt-8 min-h-10">
              ← {copy.back}
            </Button>
          )}
        </div>

        <ol className="self-end border-t border-[var(--border-default)]">
          {copy.principles.map(([label, text], index) => (
            <li key={label} className="grid grid-cols-[2.25rem_5.5rem_1fr] gap-3 border-b border-[var(--border-default)] py-4">
              <span className="font-mono text-[10px] text-[var(--terminal-muted)]">{String(index + 1).padStart(2, '0')}</span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--electric-blue)]">{label}</span>
              <span className="text-sm leading-6 text-[var(--terminal-text)]">{text}</span>
            </li>
          ))}
        </ol>
      </header>

      <nav className="border-b border-[var(--border-default)]" aria-label={copy.nav}>
        <div role="tablist" aria-label={copy.select} className="flex min-w-0 overflow-x-auto">
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
                className={`relative min-w-[190px] flex-1 px-2 py-6 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--electric-blue)] sm:px-4 ${
                  isActive
                    ? 'text-[var(--terminal-text)]'
                    : 'text-[var(--terminal-muted)] hover:text-[var(--terminal-text)]'
                }`}
              >
                <span className="block font-mono text-[10px] text-[var(--electric-blue)]">{view.index}</span>
                <span className="mt-2 block max-w-[12rem] text-sm leading-snug">{view.shortLabel[language]}</span>
                {isActive && <span className="absolute inset-x-2 bottom-0 h-0.5 bg-[var(--electric-blue)] sm:inset-x-4" aria-hidden="true" />}
              </button>
            );
          })}
        </div>
      </nav>

      <section
        role="tabpanel"
        id={`architecture-panel-${activeView.id}`}
        aria-labelledby={`architecture-tab-${activeView.id}`}
      >
        <div className="grid gap-10 py-12 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-16 lg:py-16">
          <div className="max-w-4xl">
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--electric-blue)]">
              {activeView.index} / {activeView.shortLabel[language]}
            </p>
            <h2 className="mt-4 max-w-4xl font-mono text-3xl font-semibold leading-[1.08] tracking-[-0.03em] text-[var(--terminal-text)] sm:text-4xl">
              {activeView.title[language]}
            </h2>
            <p className="mt-6 max-w-3xl text-base leading-8 text-[var(--terminal-muted)] sm:text-lg">{activeView.summary[language]}</p>
          </div>

          <aside className="self-end border-l-2 border-[var(--electric-green)] pl-5">
            <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--electric-green)]">{copy.rule}</p>
            <p className="mt-3 text-base leading-7 text-[var(--terminal-text)]">{activeView.principle[language]}</p>
          </aside>
        </div>

        <section className="border-y border-[var(--border-default)] py-10 sm:py-12">
          <div className="mb-8 flex items-baseline justify-between gap-6">
            <h2 className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--terminal-text)]">{copy.flow}</h2>
            <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--terminal-muted)]">{activeView.steps.length} {copy.stageLabel}</span>
          </div>
          <ArchitectureMap
            steps={activeView.steps}
            language={language}
            label={`${activeView.title[language]} — ${copy.flow.toLowerCase()}`}
          />
        </section>

        <div className="grid gap-12 py-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(300px,0.8fr)] lg:gap-20 lg:py-16">
          <section>
            <div className="flex items-baseline justify-between gap-6 border-b border-[var(--border-default)] pb-4">
              <h2 className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--electric-blue)]">{copy.decisions}</h2>
              <span className="font-mono text-[10px] text-[var(--terminal-muted)]">{String(activeView.boundaries.length).padStart(2, '0')} {copy.boundaryLabel}</span>
            </div>
            <ol>
              {activeView.boundaries.map((boundary, index) => (
                <li key={boundary.label.en} className="grid gap-3 border-b border-[var(--border-default)] py-6 sm:grid-cols-[2.5rem_minmax(150px,0.38fr)_minmax(0,1fr)] sm:gap-6">
                  <span className="font-mono text-[10px] text-[var(--terminal-muted)]">{String(index + 1).padStart(2, '0')}</span>
                  <h3 className="font-mono text-sm font-semibold leading-6 text-[var(--terminal-text)]">{boundary.label[language]}</h3>
                  <p className="text-sm leading-7 text-[var(--terminal-muted)]">{boundary.detail[language]}</p>
                </li>
              ))}
            </ol>
          </section>

          <aside>
            <h2 className="border-b border-[var(--border-default)] pb-4 font-mono text-xs uppercase tracking-[0.14em] text-[var(--electric-green)]">{copy.preserve}</h2>
            <ul>
              {activeView.guarantees[language].map((item, index) => (
                <li key={item} className="grid grid-cols-[2rem_1fr] gap-4 border-b border-[var(--border-default)] py-4 text-sm leading-6 text-[var(--terminal-text)]">
                  <span className="font-mono text-[10px] text-[var(--electric-green)]">{String(index + 1).padStart(2, '0')}</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            {activeView.examples.length > 0 && (
              <div className="mt-10">
                <h2 className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--terminal-muted)]">{copy.examples}</h2>
                <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-3">
                  {activeView.examples.map((example) => (
                    <li key={example} className="font-mono text-xs text-[var(--terminal-text)]">{example}</li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </section>

      <footer className="border-t border-[var(--border-default)] pt-6">
        <p className="max-w-4xl text-sm leading-7 text-[var(--terminal-muted)]">{copy.note}</p>
      </footer>
    </main>
  );
}
