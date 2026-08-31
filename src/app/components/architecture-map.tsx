import type { ArchitectureStep, ArchitectureStepKind } from '../data/architecture';
import type { Language } from '../context/language-context';

interface ArchitectureMapProps {
  steps: ArchitectureStep[];
  language: Language;
  label: string;
  compact?: boolean;
}

const kindStyles: Record<ArchitectureStepKind, { marker: string; border: string; label: Record<Language, string> }> = {
  interface: {
    marker: 'bg-[var(--electric-blue)]',
    border: 'border-[var(--electric-blue)]',
    label: { en: 'Input', pt: 'Entrada' },
  },
  authority: {
    marker: 'bg-[var(--amber)]',
    border: 'border-[var(--amber)]',
    label: { en: 'Decision', pt: 'Decisão' },
  },
  runtime: {
    marker: 'bg-[#a855f7]',
    border: 'border-[#a855f7]',
    label: { en: 'Execution', pt: 'Execução' },
  },
  verification: {
    marker: 'bg-[var(--electric-green)]',
    border: 'border-[var(--electric-green)]',
    label: { en: 'Feedback', pt: 'Retorno' },
  },
  human: {
    marker: 'bg-[var(--terminal-text)]',
    border: 'border-[var(--border-strong)]',
    label: { en: 'Human', pt: 'Pessoa' },
  },
};

export function ArchitectureMap({ steps, language, label, compact = false }: ArchitectureMapProps) {
  return (
    <div className="overflow-x-auto pb-2" role="img" aria-label={label}>
      <ol className={`flex min-w-full flex-col md:flex-row ${compact ? 'gap-4' : 'gap-6 lg:gap-8'}`}>
        {steps.map((step, index) => {
          const style = kindStyles[step.kind];
          return (
            <li key={step.id} className="relative min-w-0 flex-1">
              <article className={`h-full border-l-2 pl-4 md:border-l-0 md:border-t-2 md:pl-0 ${style.border} ${compact ? 'md:pt-3' : 'md:pt-4'}`}>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[10px] text-[var(--terminal-muted)]">{String(index + 1).padStart(2, '0')}</span>
                  <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-[var(--terminal-muted)]">
                    <span className={`h-1.5 w-1.5 ${style.marker}`} aria-hidden="true" />
                    {style.label[language]}
                  </span>
                </div>

                <h3 className={`${compact ? 'mt-3 text-sm' : 'mt-4 text-base'} font-mono font-semibold leading-snug text-[var(--terminal-text)]`}>
                  {step.label[language]}
                </h3>
                <p className={`${compact ? 'mt-2' : 'mt-3'} text-sm leading-6 text-[var(--terminal-muted)]`}>{step.detail[language]}</p>
              </article>

              {index < steps.length - 1 && (
                <span
                  className="absolute -right-5 top-0 hidden font-mono text-xs text-[var(--border-strong)] md:block lg:-right-6"
                  aria-hidden="true"
                >
                  →
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export function ArchitectureLegend({ language }: { language: Language }) {
  const order: ArchitectureStepKind[] = ['interface', 'authority', 'runtime', 'verification', 'human'];

  return (
    <ul className="flex flex-wrap gap-x-5 gap-y-3" aria-label={language === 'en' ? 'Flow legend' : 'Legenda do fluxo'}>
      {order.map((kind) => (
        <li key={kind} className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-[var(--terminal-muted)]">
          <span className={`h-2 w-2 ${kindStyles[kind].marker}`} aria-hidden="true" />
          {kindStyles[kind].label[language]}
        </li>
      ))}
    </ul>
  );
}
