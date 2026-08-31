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
    <div className="overflow-x-auto pb-3" role="img" aria-label={label}>
      <ol className={`flex min-w-full flex-col md:flex-row md:items-stretch ${compact ? 'gap-2' : 'gap-3'}`}>
        {steps.map((step, index) => {
          const style = kindStyles[step.kind];
          return (
            <li key={step.id} className="flex min-w-0 flex-1 flex-col md:flex-row md:items-stretch">
              <article className={`min-w-44 flex-1 border-l-2 bg-[var(--surface-1)] ${style.border} ${compact ? 'p-4' : 'p-5'}`}>
                <div className="mb-4 flex items-center justify-between gap-3">
                  <span className="font-mono text-xs text-[var(--terminal-muted)]">{String(index + 1).padStart(2, '0')}</span>
                  <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-[var(--terminal-muted)]">
                    <span className={`h-2 w-2 ${style.marker}`} aria-hidden="true" />
                    {style.label[language]}
                  </span>
                </div>
                <h3 className={`${compact ? 'text-sm' : 'text-base'} font-mono font-semibold text-[var(--terminal-text)]`}>
                  {step.label[language]}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--terminal-muted)]">{step.detail[language]}</p>
              </article>

              {index < steps.length - 1 && (
                <div className="flex h-8 shrink-0 items-center justify-center font-mono text-[var(--border-strong)] md:h-auto md:w-6" aria-hidden="true">
                  <span className="md:hidden">↓</span>
                  <span className="hidden md:inline">→</span>
                </div>
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
