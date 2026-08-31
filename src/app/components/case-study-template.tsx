import { getPortfolioProject } from '../data/current-case-studies';
import { useLanguage } from '../context/language-context';
import { Button } from './button';

interface CaseStudyTemplateProps {
  projectId: string;
  onBack?: () => void;
  onArchitecture?: () => void;
}

export function CaseStudyTemplate({ projectId, onBack, onArchitecture }: CaseStudyTemplateProps) {
  const { language } = useLanguage();
  const project = getPortfolioProject(projectId);
  const copy = language === 'en'
    ? {
        back: 'BACK TO PORTFOLIO',
        eyebrow: 'SELECTED WORK',
        what: 'WHAT I BUILT',
        problem: 'THE PROBLEM',
        choices: 'WHAT I CHOSE TO DO',
        works: 'HOW IT WORKS',
        learned: 'WHAT I LEARNED',
        links: 'OPEN THE WORK',
        details: 'TECHNICAL NOTES',
        detailsHint: 'Architecture, state, implementation constraints and supporting links.',
        flow: 'FLOW',
        state: 'STATE MODEL',
        constraints: 'CONSTRAINTS I WANTED TO PRESERVE',
        supporting: 'SUPPORTING LINKS',
        scope: 'SCOPE NOTE',
        role: 'My role',
        status: 'Current status',
        public: 'Public project',
        caseStudy: 'Public case study',
        private: 'Private work',
        architecture: 'SEE HOW I THINK ABOUT ARCHITECTURE →',
        contact: 'START A CONVERSATION →',
        missing: 'Case study not found.',
      }
    : {
        back: 'VOLTAR AO PORTFÓLIO',
        eyebrow: 'TRABALHO SELECIONADO',
        what: 'O QUE EU CONSTRUÍ',
        problem: 'O PROBLEMA',
        choices: 'O QUE EU ESCOLHI FAZER',
        works: 'COMO FUNCIONA',
        learned: 'O QUE EU APRENDI',
        links: 'ABRIR O TRABALHO',
        details: 'NOTAS TÉCNICAS',
        detailsHint: 'Arquitetura, estados, restrições de implementação e links de apoio.',
        flow: 'FLUXO',
        state: 'MODELO DE ESTADOS',
        constraints: 'RESTRIÇÕES QUE EU QUERIA PRESERVAR',
        supporting: 'LINKS DE APOIO',
        scope: 'NOTA DE ESCOPO',
        role: 'Meu papel',
        status: 'Estado atual',
        public: 'Projeto público',
        caseStudy: 'Case study público',
        private: 'Trabalho privado',
        architecture: 'VER COMO EU PENSO ARQUITETURA →',
        contact: 'COMEÇAR UMA CONVERSA →',
        missing: 'Estudo de caso não encontrado.',
      };

  if (!project) {
    return (
      <section className="mx-auto max-w-[900px] px-6 py-24 text-center">
        <p className="text-[var(--terminal-text)]">{copy.missing}</p>
        {onBack && <Button className="mt-6" variant="secondary" onClick={onBack}>{copy.back}</Button>}
      </section>
    );
  }

  const study = project.caseStudy;
  const extended = study.extended;
  const status = project.visibility === 'public'
    ? copy.public
    : project.visibility === 'case-study'
      ? copy.caseStudy
      : copy.private;

  return (
    <article className="mx-auto max-w-[1180px] px-4 py-12 sm:px-6 sm:py-16">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="mb-10 min-h-10 font-mono text-xs tracking-wider text-[var(--terminal-muted)] transition-colors duration-100 hover:text-[var(--electric-blue)]"
        >
          ← {copy.back}
        </button>
      )}

      <header className="border-b border-[var(--border-default)] pb-12">
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--electric-blue)]">{copy.eyebrow}</p>
        <h1 className="mt-4 max-w-4xl font-mono text-4xl font-bold tracking-tight text-[var(--terminal-text)] sm:text-5xl lg:text-6xl">
          {project.title}
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-[var(--terminal-muted)] sm:text-xl">
          {project.subtitle[language]}
        </p>

        <dl className="mt-8 grid max-w-4xl gap-5 border-t border-[var(--border-subtle)] pt-6 sm:grid-cols-3">
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-wider text-[var(--terminal-muted)]">{copy.role}</dt>
            <dd className="mt-2 text-sm leading-relaxed text-[var(--terminal-text)]">{study.role[language]}</dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-wider text-[var(--terminal-muted)]">{copy.status}</dt>
            <dd className="mt-2 text-sm text-[var(--terminal-text)]">{status}</dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-wider text-[var(--terminal-muted)]">{language === 'en' ? 'Why it mattered' : 'Por que importou'}</dt>
            <dd className="mt-2 text-sm leading-relaxed text-[var(--terminal-text)]">{project.impact[language]}</dd>
          </div>
        </dl>

        {project.links.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-3">
            {project.links.map((link, index) => (
              <Button
                key={link.url}
                variant={index === 0 ? 'primary' : 'secondary'}
                onClick={() => window.open(link.url, '_blank', 'noopener,noreferrer')}
              >
                {link.label[language]} ↗
              </Button>
            ))}
          </div>
        )}
      </header>

      <div className="grid gap-14 py-14 lg:grid-cols-[minmax(0,1fr)_minmax(260px,0.42fr)] lg:gap-20">
        <div>
          <TextSection title={copy.what} text={study.summary[language]} large />
          {extended && (
            <div className="mb-12 border-l-2 border-[var(--amber)] pl-5">
              <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--amber)]">{copy.scope}</p>
              <p className="mt-3 text-sm leading-relaxed text-[var(--terminal-muted)]">{extended.disclosure[language]}</p>
            </div>
          )}
          <ListSection title={copy.problem} items={study.problem[language]} />
          <ListSection title={copy.choices} items={study.approach[language]} />
        </div>

        <aside className="lg:border-l lg:border-[var(--border-default)] lg:pl-8">
          <p className="font-mono text-xs uppercase tracking-wider text-[var(--terminal-muted)]">
            {language === 'en' ? 'A few things worth noticing' : 'Algumas coisas que valem notar'}
          </p>
          <ul className="mt-5 space-y-5">
            {project.highlights[language].map((highlight, index) => (
              <li key={highlight} className="border-t border-[var(--border-default)] pt-4">
                <span className="font-mono text-[10px] text-[var(--electric-blue)]">{String(index + 1).padStart(2, '0')}</span>
                <p className="mt-2 text-sm leading-relaxed text-[var(--terminal-text)]">{highlight}</p>
              </li>
            ))}
          </ul>
        </aside>
      </div>

      <section className="border-y border-[var(--border-default)] py-14">
        <p className="font-mono text-xs uppercase tracking-wider text-[var(--electric-blue)]">{copy.works}</p>
        <div className="mt-7 grid gap-px bg-[var(--border-default)] md:grid-cols-3">
          {study.architecture[language].map((layer, index) => (
            <div key={layer.name} className="bg-[var(--surface-1)] p-5 sm:p-6">
              <span className="font-mono text-[10px] text-[var(--terminal-muted)]">{String(index + 1).padStart(2, '0')}</span>
              <h2 className="mt-3 font-mono text-sm font-semibold text-[var(--terminal-text)]">{layer.name}</h2>
              <ul className="mt-4 space-y-2 text-sm leading-relaxed text-[var(--terminal-muted)]">
                {layer.items.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="py-14">
        <p className="font-mono text-xs uppercase tracking-wider text-[var(--electric-blue)]">{copy.learned}</p>
        <div className="mt-7 grid gap-5 md:grid-cols-3">
          {study.learnings[language].map((learning) => (
            <p key={learning} className="border-t border-[var(--border-default)] pt-4 text-base leading-relaxed text-[var(--terminal-text)]">
              {learning}
            </p>
          ))}
        </div>
      </section>

      <details className="group border border-[var(--border-default)] bg-[var(--surface-1)]">
        <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 px-5 py-4 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--electric-blue)] sm:px-6">
          <span>
            <span className="block font-mono text-xs font-semibold tracking-wider text-[var(--terminal-text)]">{copy.details}</span>
            <span className="mt-1 block text-sm text-[var(--terminal-muted)]">{copy.detailsHint}</span>
          </span>
          <span className="font-mono text-lg text-[var(--electric-blue)] transition-transform group-open:rotate-45" aria-hidden="true">+</span>
        </summary>

        <div className="border-t border-[var(--border-default)] px-5 py-8 sm:px-6">
          {extended && <SystemFlow title={copy.flow} steps={extended.flow[language]} />}
          {extended && (
            <StateModel
              title={copy.state}
              primary={extended.stateModel.primary[language]}
              branches={extended.stateModel.branches[language]}
              note={extended.stateModel.note[language]}
            />
          )}

          <div className="mb-10">
            <h2 className="font-mono text-xs uppercase tracking-wider text-[var(--terminal-muted)]">{copy.constraints}</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {study.guarantees.map((guarantee) => (
                <span key={guarantee} className="border border-[var(--border-default)] px-3 py-2 font-mono text-[10px] tracking-wider text-[var(--terminal-text)]">
                  {guarantee}
                </span>
              ))}
            </div>
          </div>

          {study.evidence.length > 0 && (
            <div>
              <h2 className="font-mono text-xs uppercase tracking-wider text-[var(--terminal-muted)]">{copy.supporting}</h2>
              <div className="mt-4 flex flex-wrap gap-3">
                {study.evidence.map((item) => (
                  <Button key={item.url} variant="ghost" onClick={() => window.open(item.url, '_blank', 'noopener,noreferrer')}>
                    {item.label[language]} ↗
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </details>

      <footer className="mt-12 flex flex-wrap gap-3 border-t border-[var(--border-default)] pt-8">
        {onArchitecture && <Button variant="secondary" onClick={onArchitecture}>{copy.architecture}</Button>}
        <Button variant="ghost" onClick={() => window.open('mailto:byrenanmelo@gmail.com', '_self')}>{copy.contact}</Button>
      </footer>
    </article>
  );
}

function TextSection({ title, text, large = false }: { title: string; text: string; large?: boolean }) {
  return (
    <section className="mb-12">
      <h2 className="font-mono text-xs uppercase tracking-wider text-[var(--electric-blue)]">{title}</h2>
      <p className={`mt-4 max-w-[72ch] leading-relaxed text-[var(--terminal-text)] ${large ? 'text-lg sm:text-xl' : 'text-base'}`}>{text}</p>
    </section>
  );
}

function ListSection({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="mb-12">
      <h2 className="font-mono text-xs uppercase tracking-wider text-[var(--electric-blue)]">{title}</h2>
      <ul className="mt-4 space-y-4">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-4 text-base leading-relaxed text-[var(--terminal-text)]">
            <span aria-hidden="true" className="mt-[0.7em] h-px w-4 shrink-0 bg-[var(--border-strong)]" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function SystemFlow({ title, steps }: { title: string; steps: string[] }) {
  return (
    <section className="mb-10">
      <h2 className="font-mono text-xs uppercase tracking-wider text-[var(--terminal-muted)]">{title}</h2>
      <ol className="mt-4 grid gap-3 lg:grid-cols-4">
        {steps.map((step, index) => (
          <li key={step} className="border border-[var(--border-default)] bg-[var(--surface-2)] p-4">
            <span className="font-mono text-[10px] text-[var(--electric-blue)]">{String(index + 1).padStart(2, '0')}</span>
            <p className="mt-2 text-sm leading-relaxed text-[var(--terminal-text)]">{step}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function StateModel({ title, primary, branches, note }: { title: string; primary: string[]; branches: string[]; note: string }) {
  return (
    <section className="mb-10">
      <h2 className="font-mono text-xs uppercase tracking-wider text-[var(--terminal-muted)]">{title}</h2>
      <div className="mt-4 border border-[var(--border-default)] bg-[var(--surface-2)] p-5">
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-[var(--terminal-text)]">
          {primary.map((state, index) => (
            <span key={state} className="contents">
              <span className="border border-[var(--border-strong)] px-3 py-2">{state}</span>
              {index < primary.length - 1 && <span className="text-[var(--terminal-muted)]" aria-hidden="true">→</span>}
            </span>
          ))}
        </div>
        <ul className="mt-5 grid gap-2 md:grid-cols-3">
          {branches.map((branch) => <li key={branch} className="text-xs text-[var(--terminal-muted)]">{branch}</li>)}
        </ul>
        <p className="mt-5 border-t border-[var(--border-default)] pt-4 text-sm leading-relaxed text-[var(--terminal-muted)]">{note}</p>
      </div>
    </section>
  );
}
