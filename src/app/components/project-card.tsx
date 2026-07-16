import { Badge } from './badge';
import { Button } from './button';

interface ProjectCardProps {
  title: string;
  subtitle: string;
  impact: string;
  highlights: string[];
  badges: string[];
  visibility: 'public' | 'private';
  labels: { impact: string; highlights: string; caseStudy: string; evidence: string; public: string; private: string };
  size?: 'large' | 'medium';
  index?: number;
  onCaseStudy?: () => void;
  primaryAction?: { label: string; onClick: () => void };
  onEvidence?: () => void;
}

export function ProjectCard({ title, subtitle, impact, highlights, badges, visibility, labels, size = 'medium', index = 0, onCaseStudy, primaryAction, onEvidence }: ProjectCardProps) {
  const large = size === 'large';
  const accents = ['var(--electric-green)', 'var(--electric-blue)', 'var(--violet)', 'var(--amber)', '#ff829d'];
  const accent = accents[index % accents.length];

  return (
    <article className={`group glass-panel relative isolate overflow-hidden rounded-[1.75rem] p-6 transition-all duration-500 hover:-translate-y-1 hover:border-[var(--border-strong)] sm:p-8 ${large ? 'lg:col-span-2 lg:grid lg:grid-cols-[0.9fr_1.1fr] lg:gap-12' : ''}`}>
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full opacity-[0.08] blur-3xl transition-opacity duration-500 group-hover:opacity-[0.16]" style={{ background: accent }} />

      <div className="relative flex flex-col">
        <div className="flex items-center justify-between gap-4">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--terminal-muted)]">0{index + 1} / PROJECT</span>
          <Badge variant={visibility === 'public' ? 'green' : 'default'}>{visibility === 'public' ? labels.public : labels.private}</Badge>
        </div>
        <h3 className={`${large ? 'mt-12 text-5xl sm:text-6xl' : 'mt-10 text-4xl'} font-bold tracking-[-0.055em] text-white`}>{title}</h3>
        <p className="mt-5 max-w-xl text-sm leading-relaxed text-[var(--terminal-muted)]">{subtitle}</p>
        <div className="mt-8 flex flex-wrap gap-2">
          {badges.map((badge) => <Badge key={badge}>{badge}</Badge>)}
        </div>
      </div>

      <div className={`relative flex flex-col ${large ? 'mt-10 border-t border-[var(--border-subtle)] pt-8 lg:mt-0 lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0' : 'mt-8 border-t border-[var(--border-subtle)] pt-7'}`}>
        <div className="eyebrow">{labels.impact}</div>
        <p className="mt-3 text-base font-medium leading-relaxed text-[var(--terminal-text)]">{impact}</p>
        <div className="mt-8 space-y-3">
          {highlights.slice(0, large ? 4 : 3).map((highlight) => (
            <div key={highlight} className="flex items-start gap-3 text-sm leading-relaxed text-[var(--terminal-muted)]">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: accent }} />
              <span>{highlight}</span>
            </div>
          ))}
        </div>
        <div className="mt-auto flex flex-wrap gap-2 pt-9">
          {onCaseStudy && <Button variant="primary" onClick={onCaseStudy}>{labels.caseStudy}</Button>}
          {primaryAction && <Button variant="secondary" onClick={primaryAction.onClick}>{primaryAction.label}</Button>}
          {onEvidence && <Button variant="ghost" onClick={onEvidence}>{labels.evidence}</Button>}
        </div>
      </div>
    </article>
  );
}
