import { projects } from '../data/projects';
import { useLanguage } from '../context/language-context';
import { ProjectCard } from './project-card';

interface SelectedWorkSectionProps {
  onCaseStudy?: (project: string) => void;
  onOpen?: (url: string) => void;
  onEvidence?: () => void;
}

export function SelectedWorkSection({ onCaseStudy, onOpen, onEvidence }: SelectedWorkSectionProps) {
  const { language, t } = useLanguage();

  return (
    <section className="mx-auto max-w-[1480px] px-6 py-24 lg:px-10 lg:py-32" id="selected-work">
      <div className="mb-14 grid gap-5 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
        <div>
          <div className="eyebrow mb-5">02 / Selected systems</div>
          <h2 className="text-white">
          {t('work.title')}
          </h2>
        </div>
        <p className="max-w-2xl text-base leading-relaxed text-[var(--terminal-muted)] lg:justify-self-end">
          {t('work.subtitle')}
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {projects.map((project, index) => (
          <ProjectCard
            key={project.id}
            title={project.title}
            subtitle={project.subtitle[language]}
            impact={project.impact[language]}
            highlights={project.highlights[language]}
            badges={project.badges}
            visibility={project.visibility}
            labels={{
              impact: language === 'en' ? 'IMPACT' : 'IMPACTO',
              highlights: language === 'en' ? 'HIGHLIGHTS' : 'DESTAQUES',
              caseStudy: t('work.cta.casestudy'),
              evidence: t('work.cta.evidence'),
              public: language === 'en' ? 'PUBLIC' : 'PÚBLICO',
              private: language === 'en' ? 'PRIVATE BUILD' : 'PROJETO PRIVADO',
            }}
            size={index === 0 ? 'large' : 'medium'}
            index={index}
            onCaseStudy={() => onCaseStudy?.(project.id)}
            primaryAction={project.links[0]
              ? { label: project.links[0].label[language], onClick: () => onOpen?.(project.links[0].url) }
              : undefined}
            onEvidence={onEvidence}
          />
        ))}
      </div>
    </section>
  );
}
