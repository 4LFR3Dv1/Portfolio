import { ArchitectureLegend, ArchitectureMap } from './architecture-map';
import { Button } from './button';
import { useLanguage } from '../context/language-context';
import { architectureViews } from '../data/architecture';

interface SystemArchitectureProps {
  onOpen: () => void;
}

export function SystemArchitecture({ onOpen }: SystemArchitectureProps) {
  const { language } = useLanguage();
  const systemMap = architectureViews[0];

  return (
    <section
      className="mx-auto max-w-[1600px] border-t border-[var(--border-subtle)] px-4 py-16 sm:px-6 lg:py-24"
      id="architecture"
    >
      <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <div className="mb-3 font-mono text-xs uppercase tracking-widest text-[var(--electric-blue)]">
            {language === 'en' ? 'ARCHITECTURE // OPERATING MODEL' : 'ARQUITETURA // MODELO OPERACIONAL'}
          </div>
          <h2 className="font-mono font-bold text-[var(--electric-blue)]">
            {language === 'en' ? 'HOW THE SYSTEMS FIT TOGETHER' : 'COMO OS SISTEMAS SE CONECTAM'}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[var(--terminal-muted)]">
            {systemMap.summary[language]}
          </p>
        </div>
        <Button
          variant="secondary"
          onClick={onOpen}
          className="min-h-10 self-start focus-visible:ring-2 focus-visible:ring-[var(--electric-blue)] lg:self-auto"
        >
          {language === 'en' ? 'EXPLORE ALL ARCHITECTURES →' : 'EXPLORAR TODAS AS ARQUITETURAS →'}
        </Button>
      </div>

      <div className="border border-[var(--border-default)] bg-[var(--surface-1)] p-4 sm:p-6">
        <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <p className="font-mono text-sm text-[var(--terminal-text)]">{systemMap.principle[language]}</p>
          <ArchitectureLegend language={language} />
        </div>
        <ArchitectureMap
          steps={systemMap.steps}
          language={language}
          label={language === 'en' ? 'Portfolio operating model' : 'Modelo operacional do portfólio'}
          compact
        />
      </div>
    </section>
  );
}
