import { Button } from './button';
import { selectedWork } from '../data/selected-work';
import { useLanguage } from '../context/language-context';

interface SelectedWorkSectionProps {
  onCaseStudy?: (project: string) => void;
  onOpen?: (url: string) => void;
}

export function SelectedWorkSection({ onCaseStudy, onOpen }: SelectedWorkSectionProps) {
  const { language } = useLanguage();
  const copy = language === 'en'
    ? {
        eyebrow: '01 // SELECTED WORK',
        title: 'A few things I build and have built.',
        subtitle: 'Products, tools and experiments selected because they say something useful about the kind of work I do.',
        caseStudy: 'CASE STUDY',
      }
    : {
        eyebrow: '01 // TRABALHOS SELECIONADOS',
        title: 'Algumas coisas que construo e já construí.',
        subtitle: 'Produtos, ferramentas e experimentos escolhidos porque ajudam a mostrar o tipo de trabalho que faço.',
        caseStudy: 'CASE STUDY',
      };

  return (
    <section className="mx-auto max-w-[1600px] px-6 py-16 lg:py-24" id="selected-work">
      <div className="mb-12 max-w-3xl">
        <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--terminal-muted)]">
          {copy.eyebrow}
        </div>
        <h2 className="font-mono text-2xl font-bold tracking-tight text-[var(--electric-blue)] lg:text-3xl">
          {copy.title}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-[var(--terminal-muted)]">{copy.subtitle}</p>
      </div>

      <div className="grid border border-[var(--border-default)] md:grid-cols-2">
        {selectedWork.map((item, index) => (
          <article
            key={item.id}
            className={`group min-h-[300px] border-[var(--border-default)] bg-[var(--surface-1)] p-6 transition-colors hover:bg-[var(--surface-2)] lg:p-8 ${index % 2 === 0 ? 'md:border-r' : ''} ${index < selectedWork.length - 2 ? 'border-b' : ''}`}
          >
            <div className="flex items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-wider text-[var(--terminal-muted)]">
              <span>{String(index + 1).padStart(2, '0')}</span>
              <span>{item.year}</span>
            </div>

            <h3 className="mt-8 font-mono text-2xl font-bold text-[var(--terminal-text)] transition-colors group-hover:text-[var(--electric-blue)]">
              {item.title}
            </h3>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--terminal-muted)]">
              {item.description[language]}
            </p>

            <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2 font-mono text-[10px] uppercase tracking-wider text-[var(--terminal-muted)]">
              {item.topics.map((topic) => <span key={topic[language]}>{topic[language]}</span>)}
            </div>

            {(item.caseStudyId || item.href) && (
              <div className="mt-8 flex flex-wrap gap-3 border-t border-[var(--border-subtle)] pt-5">
                {item.caseStudyId && (
                  <Button variant="ghost" onClick={() => onCaseStudy?.(item.caseStudyId!)}>
                    {copy.caseStudy}
                  </Button>
                )}
                {item.href && item.linkLabel && (
                  <Button variant="secondary" onClick={() => onOpen?.(item.href!)}>
                    {item.linkLabel[language]} ↗
                  </Button>
                )}
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
