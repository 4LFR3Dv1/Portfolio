import { Badge } from './badge';
import { Button } from './button';

interface ProjectCardProps {
  title: string;
  subtitle: string;
  impact: string;
  highlights: string[];
  badges: string[];
  visibility: 'public' | 'private';
  labels: {
    impact: string;
    highlights: string;
    caseStudy: string;
    evidence: string;
    public: string;
    private: string;
  };
  size?: 'large' | 'medium';
  onCaseStudy?: () => void;
  primaryAction?: { label: string; onClick: () => void };
  onEvidence?: () => void;
}

export function ProjectCard({
  title,
  subtitle,
  impact,
  highlights,
  badges,
  visibility,
  labels,
  onCaseStudy,
  primaryAction,
  onEvidence,
}: ProjectCardProps) {
  return (
    <article className="border border-[var(--border-default)] bg-[var(--surface-1)] hover:border-[var(--border-strong)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,217,255,0.1)]">
      <div className="border-b border-[var(--border-default)] px-6 py-4 bg-[var(--surface-2)] flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-mono text-lg font-semibold" style={{ color: 'var(--electric-blue)' }}>
          {title}
        </h3>
        <Badge variant={visibility === 'public' ? 'green' : 'default'}>
          {visibility === 'public' ? labels.public : labels.private}
        </Badge>
      </div>

      <div className="p-6 space-y-4">
        <p className="text-sm leading-relaxed" style={{ color: 'var(--terminal-text)' }}>{subtitle}</p>

        <div className="pt-2 border-t border-[var(--border-subtle)]">
          <div className="font-mono text-[10px] uppercase tracking-wider mb-2" style={{ color: 'var(--terminal-muted)' }}>
            {labels.impact}
          </div>
          <p className="text-sm" style={{ color: 'var(--foreground)' }}>{impact}</p>
        </div>

        <div className="pt-2">
          <div className="font-mono text-[10px] uppercase tracking-wider mb-3" style={{ color: 'var(--terminal-muted)' }}>
            {labels.highlights}
          </div>
          <ul className="space-y-2">
            {highlights.map((highlight) => (
              <li key={highlight} className="flex items-start gap-3 text-sm">
                <span aria-hidden="true" className="mt-1 w-1 h-1 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--electric-blue)' }} />
                <span style={{ color: 'var(--terminal-text)' }}>{highlight}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-wrap gap-2 pt-4">
          {badges.map((badge) => <Badge key={badge} variant="default">{badge}</Badge>)}
        </div>

        <div className="flex flex-wrap gap-3 pt-6">
          {onCaseStudy && <Button variant="primary" onClick={onCaseStudy}>{labels.caseStudy}</Button>}
          {primaryAction && <Button variant="secondary" onClick={primaryAction.onClick}>{primaryAction.label}</Button>}
          {onEvidence && <Button variant="ghost" onClick={onEvidence}>{labels.evidence}</Button>}
        </div>
      </div>
    </article>
  );
}
