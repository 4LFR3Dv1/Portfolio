import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { ArchitectureLegend, ArchitectureMap } from './architecture-map';
import { Badge } from './badge';
import { Button } from './button';
import { useLanguage } from '../context/language-context';
import { architectureViews, getArchitectureView, type ArchitectureViewId } from '../data/architecture';

interface ArchitectureExplorerProps {
  onBack?: () => void;
}

function initialView(): ArchitectureViewId {
  if (typeof window === 'undefined') return 'systems';
  return getArchitectureView(new URLSearchParams(window.location.search).get('view')).id;
}

export function ArchitectureExplorer({ onBack }: ArchitectureExplorerProps) {
  const { language } = useLanguage();
  const [activeViewId, setActiveViewId] = useState<ArchitectureViewId>(initialView);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const activeView = getArchitectureView(activeViewId);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (activeViewId === 'systems') {
      url.searchParams.delete('view');
    } else {
      url.searchParams.set('view', activeViewId);
    }
    window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
  }, [activeViewId]);

  const selectView = (id: ArchitectureViewId) => {
    setActiveViewId(id);
  };

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();

    let nextIndex = index;
    if (event.key === 'ArrowRight') nextIndex = (index + 1) % architectureViews.length;
    if (event.key === 'ArrowLeft') nextIndex = (index - 1 + architectureViews.length) % architectureViews.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = architectureViews.length - 1;

    const nextView = architectureViews[nextIndex];
    selectView(nextView.id);
    tabRefs.current[nextIndex]?.focus();
  };

  return (
    <main className="mx-auto max-w-[1600px] px-4 py-10 sm:px-6 sm:py-16">
      <header className="border-b border-[var(--border-default)] pb-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-4xl">
            <div className="mb-4 flex items-center gap-3">
              <span className="font-mono text-xs uppercase tracking-widest text-[var(--electric-blue)]">
                {language === 'en' ? 'SYSTEM MAP // PUBLIC' : 'MAPA DE SISTEMAS // PÚBLICO'}
              </span>
              <span className="h-px w-12 bg-[var(--electric-blue)]" aria-hidden="true" />
            </div>
            <h1 className="font-mono text-3xl font-bold tracking-tight text-[var(--electric-blue)] lg:text-4xl">
              {language === 'en' ? 'ARCHITECTURE EXPLORER' : 'EXPLORADOR DE ARQUITETURA'}
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-relaxed text-[var(--terminal-muted)] sm:text-lg">
              {language === 'en'
                ? 'A current, sanitized view of how product interfaces, authoritative services, constrained runtimes and verification layers fit together across my work.'
                : 'Uma visão atual e sanitizada de como interfaces de produto, serviços autoritativos, runtimes limitados e camadas de verificação se conectam nos meus trabalhos.'}
            </p>
          </div>

          {onBack && (
            <Button
              variant="ghost"
              onClick={onBack}
              className="min-h-10 self-start focus-visible:ring-2 focus-visible:ring-[var(--electric-blue)] lg:self-auto"
            >
              ← {language === 'en' ? 'BACK TO PORTFOLIO' : 'VOLTAR AO PORTFÓLIO'}
            </Button>
          )}
        </div>

        <dl className="mt-8 grid grid-cols-1 border border-[var(--border-default)] sm:grid-cols-3">
          <div className="border-b border-[var(--border-default)] p-4 sm:border-b-0 sm:border-r">
            <dt className="font-mono text-xs uppercase tracking-wider text-[var(--terminal-muted)]">
              {language === 'en' ? 'Operating model' : 'Modelo operacional'}
            </dt>
            <dd className="mt-2 font-mono text-sm text-[var(--terminal-text)]">
              {language === 'en' ? 'DETERMINISTIC FIRST' : 'DETERMINÍSTICO PRIMEIRO'}
            </dd>
          </div>
          <div className="border-b border-[var(--border-default)] p-4 sm:border-b-0 sm:border-r">
            <dt className="font-mono text-xs uppercase tracking-wider text-[var(--terminal-muted)]">
              {language === 'en' ? 'Authority' : 'Autoridade'}
            </dt>
            <dd className="mt-2 font-mono text-sm text-[var(--terminal-text)]">
              {language === 'en' ? 'EXPLICIT & BOUNDED' : 'EXPLÍCITA E LIMITADA'}
            </dd>
          </div>
          <div className="p-4">
            <dt className="font-mono text-xs uppercase tracking-wider text-[var(--terminal-muted)]">
              {language === 'en' ? 'Outcome' : 'Resultado'}
            </dt>
            <dd className="mt-2 font-mono text-sm text-[var(--terminal-text)]">
              {language === 'en' ? 'VERIFIED EXTERNALLY' : 'VERIFICADO EXTERNAMENTE'}
            </dd>
          </div>
        </dl>
      </header>

      <nav className="py-6" aria-label={language === 'en' ? 'Architecture views' : 'Visões de arquitetura'}>
        <div
          role="tablist"
          aria-label={language === 'en' ? 'Select architecture view' : 'Selecionar visão de arquitetura'}
          className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-5"
        >
          {architectureViews.map((view, index) => {
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
                onClick={() => selectView(view.id)}
                onKeyDown={(event) => handleTabKeyDown(event, index)}
                className={`min-h-14 border px-4 py-3 text-left motion-safe:transition-colors motion-safe:duration-100 focus-visible:ring-2 focus-visible:ring-[var(--electric-blue)] ${
                  isActive
                    ? 'border-[var(--electric-blue)] bg-[var(--electric-blue)] text-[#0a0a0f]'
                    : 'border-[var(--border-default)] bg-[var(--surface-1)] text-[var(--terminal-text)] hover:border-[var(--border-strong)]'
                }`}
              >
                <span className={`mr-3 text-xs ${isActive ? 'text-[#0a0a0f]' : 'text-[var(--terminal-muted)]'}`}>
                  {view.index}
                </span>
                <span className="text-xs uppercase tracking-wider">{view.shortLabel[language]}</span>
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
        <div className="border-b border-[var(--border-default)] p-5 sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-4xl">
              <Badge variant="blue">{activeView.index} // {activeView.shortLabel[language]}</Badge>
              <h2 className="mt-5 font-mono text-lg font-semibold text-[var(--electric-blue)]">
                {activeView.title[language]}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-[var(--terminal-muted)]">
                {activeView.summary[language]}
              </p>
            </div>
            <div className="border-l-2 border-[var(--electric-green)] bg-[var(--surface-2)] p-4 lg:max-w-md">
              <div className="font-mono text-xs uppercase tracking-wider text-[var(--electric-green)]">
                {language === 'en' ? 'Governing principle' : 'Princípio de governo'}
              </div>
              <p className="mt-2 font-mono text-sm leading-relaxed text-[var(--terminal-text)]">
                {activeView.principle[language]}
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-8">
          <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <h2 className="font-mono text-sm uppercase tracking-wider text-[var(--terminal-text)]">
              {language === 'en' ? 'Responsibility flow' : 'Fluxo de responsabilidades'}
            </h2>
            <ArchitectureLegend language={language} />
          </div>
          <ArchitectureMap
            steps={activeView.steps}
            language={language}
            label={`${activeView.title[language]} — ${language === 'en' ? 'responsibility flow' : 'fluxo de responsabilidades'}`}
          />
        </div>

        <div className="grid border-t border-[var(--border-default)] lg:grid-cols-[1.2fr_1fr]">
          <section className="border-b border-[var(--border-default)] p-5 sm:p-8 lg:border-b-0 lg:border-r">
            <h2 className="font-mono text-sm uppercase tracking-wider text-[var(--electric-blue)]">
              {language === 'en' ? 'Trust boundaries' : 'Fronteiras de confiança'}
            </h2>
            <ol className="mt-5 space-y-3">
              {activeView.boundaries.map((boundary, index) => (
                <li key={boundary.label.en} className="grid gap-3 border-t border-[var(--border-default)] pt-4 sm:grid-cols-[2rem_12rem_1fr]">
                  <span className="font-mono text-xs text-[var(--terminal-muted)]">{String(index + 1).padStart(2, '0')}</span>
                  <h3 className="font-mono text-sm font-semibold text-[var(--terminal-text)]">{boundary.label[language]}</h3>
                  <p className="text-sm leading-relaxed text-[var(--terminal-muted)]">{boundary.detail[language]}</p>
                </li>
              ))}
            </ol>
          </section>

          <aside className="p-5 sm:p-8">
            <h2 className="font-mono text-sm uppercase tracking-wider text-[var(--electric-green)]">
              {language === 'en' ? 'System guarantees' : 'Garantias do sistema'}
            </h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {activeView.guarantees[language].map((guarantee) => (
                <li key={guarantee} className="flex items-center gap-3 border border-[var(--border-default)] bg-[var(--surface-2)] p-3">
                  <span className="h-2 w-2 bg-[var(--electric-green)]" aria-hidden="true" />
                  <span className="font-mono text-xs uppercase tracking-wider text-[var(--terminal-text)]">{guarantee}</span>
                </li>
              ))}
            </ul>

            <h2 className="mt-8 font-mono text-sm uppercase tracking-wider text-[var(--terminal-muted)]">
              {language === 'en' ? 'Applied in' : 'Aplicado em'}
            </h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {activeView.examples.map((example) => (
                <li key={example}>
                  <Badge>{example}</Badge>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      <footer className="mt-6 flex flex-col gap-3 border-l-2 border-[var(--amber)] bg-[var(--surface-1)] p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-relaxed text-[var(--terminal-muted)]">
          {language === 'en'
            ? 'This explorer publishes responsibility boundaries and operating principles. Credentials, customer data and private deployment topology are intentionally excluded.'
            : 'Este explorador publica fronteiras de responsabilidade e princípios operacionais. Credenciais, dados de clientes e topologia privada de deploy são intencionalmente excluídos.'}
        </p>
        <Badge variant="amber">{language === 'en' ? 'SANITIZED PUBLIC VIEW' : 'VISÃO PÚBLICA SANITIZADA'}</Badge>
      </footer>
    </main>
  );
}
