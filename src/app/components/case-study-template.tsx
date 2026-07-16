import { getProject } from '../data/projects';
import { useLanguage } from '../context/language-context';
import { Badge } from './badge';
import { Button } from './button';

interface CaseStudyTemplateProps {
  projectId: string;
  onBack?: () => void;
  onArchitecture?: () => void;
}

export function CaseStudyTemplate({ projectId, onBack, onArchitecture }: CaseStudyTemplateProps) {
  const { language } = useLanguage();
  const project = getProject(projectId);
  const labels = language === 'en'
    ? {
        back: 'BACK TO PORTFOLIO',
        caseStudy: 'CASE STUDY',
        type: 'TYPE',
        role: 'ROLE',
        summary: 'SUMMARY',
        problem: 'PROBLEM',
        approach: 'APPROACH',
        architecture: 'ARCHITECTURE',
        guarantees: 'GUARANTEES',
        evidence: 'PUBLIC EVIDENCE',
        privateEvidence: 'This is a private technical build. Public evidence is intentionally limited; implementation details are available in an appropriate review context.',
        learnings: 'LEARNINGS',
        explorer: 'ARCHITECTURE EXPLORER',
        contact: 'CONTACT',
      }
    : {
        back: 'VOLTAR AO PORTFÓLIO',
        caseStudy: 'ESTUDO DE CASO',
        type: 'TIPO',
        role: 'PAPEL',
        summary: 'RESUMO',
        problem: 'PROBLEMA',
        approach: 'ABORDAGEM',
        architecture: 'ARQUITETURA',
        guarantees: 'GARANTIAS',
        evidence: 'EVIDÊNCIA PÚBLICA',
        privateEvidence: 'Este é um projeto técnico privado. A evidência pública é intencionalmente limitada; detalhes de implementação estão disponíveis em um contexto adequado de revisão.',
        learnings: 'APRENDIZADOS',
        explorer: 'EXPLORADOR DE ARQUITETURA',
        contact: 'CONTATO',
      };

  if (!project) {
    return (
      <section className="max-w-[900px] mx-auto px-6 py-24 text-center">
        <p style={{ color: 'var(--terminal-text)' }}>
          {language === 'en' ? 'Case study not found.' : 'Estudo de caso não encontrado.'}
        </p>
        {onBack && <Button className="mt-6" variant="secondary" onClick={onBack}>{labels.back}</Button>}
      </section>
    );
  }

  const study = project.caseStudy;

  return (
    <article className="max-w-[1200px] mx-auto px-6 py-16">
      {onBack && (
        <button onClick={onBack} className="font-mono text-sm mb-8 text-[var(--terminal-muted)] hover:text-[var(--electric-blue)] transition-colors">
          ← {labels.back}
        </button>
      )}

      <header className="mb-12 pb-8 border-b border-[var(--border-default)]">
        <div className="flex flex-wrap items-start justify-between gap-5 mb-6">
          <div>
            <h1 className="font-mono font-bold mb-3" style={{ color: 'var(--electric-blue)' }}>
              {labels.caseStudy} // {project.title}
            </h1>
            <p className="font-mono text-sm mb-2" style={{ color: 'var(--terminal-muted)' }}>
              {labels.type}: {study.type[language]}
            </p>
            <p className="font-mono text-sm" style={{ color: 'var(--terminal-muted)' }}>
              {labels.role}: {study.role[language]}
            </p>
          </div>
          <Badge variant={project.visibility === 'public' ? 'green' : 'default'}>
            {project.visibility === 'public'
              ? (language === 'en' ? 'PUBLIC' : 'PÚBLICO')
              : (language === 'en' ? 'PRIVATE BUILD' : 'PROJETO PRIVADO')}
          </Badge>
        </div>
        <div className="flex flex-wrap gap-2">
          {project.badges.map((badge) => <Badge key={badge} variant="blue">{badge}</Badge>)}
        </div>
      </header>

      <section className="mb-12">
        <h2 className="font-mono text-lg font-semibold mb-4" style={{ color: 'var(--electric-blue)' }}>{labels.summary}</h2>
        <p className="text-base leading-relaxed" style={{ color: 'var(--terminal-text)' }}>{study.summary[language]}</p>
      </section>

      <ListSection title={labels.problem} items={study.problem[language]} color="var(--red)" />
      <ListSection title={labels.approach} items={study.approach[language]} color="var(--electric-blue)" />

      <section className="mb-12">
        <h2 className="font-mono text-lg font-semibold mb-6" style={{ color: 'var(--electric-blue)' }}>{labels.architecture}</h2>
        <div className="grid md:grid-cols-3 gap-5">
          {study.architecture[language].map((layer) => (
            <div key={layer.name} className="border border-[var(--border-default)] bg-[var(--surface-1)]">
              <div className="border-b border-[var(--border-default)] px-4 py-3 bg-[var(--surface-2)]">
                <h3 className="font-mono text-xs font-semibold" style={{ color: 'var(--electric-green)' }}>{layer.name}</h3>
              </div>
              <ul className="p-4 space-y-2">
                {layer.items.map((item) => <li key={item} className="text-sm" style={{ color: 'var(--terminal-text)' }}>• {item}</li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <div className="font-mono text-[10px] uppercase tracking-wider mb-3" style={{ color: 'var(--terminal-muted)' }}>{labels.guarantees}</div>
          <div className="flex flex-wrap gap-2">
            {study.guarantees.map((guarantee) => <Badge key={guarantee} variant="green">{guarantee}</Badge>)}
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="font-mono text-lg font-semibold mb-4" style={{ color: 'var(--electric-blue)' }}>{labels.evidence}</h2>
        {study.evidence.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {study.evidence.map((item) => (
              <Button key={item.url} variant="secondary" onClick={() => window.open(item.url, '_blank', 'noopener,noreferrer')}>
                {item.label[language]}
              </Button>
            ))}
          </div>
        ) : (
          <p className="text-sm border-l-2 border-[var(--amber)] pl-4" style={{ color: 'var(--terminal-muted)' }}>{labels.privateEvidence}</p>
        )}
      </section>

      <ListSection title={labels.learnings} items={study.learnings[language]} color="var(--electric-green)" />

      <footer className="pt-8 border-t border-[var(--border-default)] flex flex-wrap gap-4">
        <Button variant="secondary" onClick={onArchitecture}>{labels.explorer}</Button>
        <Button variant="ghost" onClick={() => window.open('mailto:byrenanmelo@gmail.com', '_self')}>{labels.contact}</Button>
      </footer>
    </article>
  );
}

function ListSection({ title, items, color }: { title: string; items: string[]; color: string }) {
  return (
    <section className="mb-12">
      <h2 className="font-mono text-lg font-semibold mb-4" style={{ color: 'var(--electric-blue)' }}>{title}</h2>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3 text-base">
            <span aria-hidden="true" className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
            <span style={{ color: 'var(--terminal-text)' }}>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
