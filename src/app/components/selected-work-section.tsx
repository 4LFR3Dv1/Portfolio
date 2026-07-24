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
    <section className="max-w-[1600px] mx-auto px-6 py-16 lg:py-24" id="selected-work">
      <div className="mb-12">
        <h2 className="font-mono font-bold mb-4" style={{ color: 'var(--electric-blue)' }}>
          {t('work.title')}
        </h2>
        <p className="text-base" style={{ color: 'var(--terminal-muted)' }}>
          {t('work.subtitle')}
        </p>
      </div>

      <div className="grid gap-6 lg:gap-8">
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
              publicCase: language === 'en' ? 'PUBLIC CASE' : 'CASE PÚBLICO',
            }}
            size={index < 3 ? 'large' : 'medium'}
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
