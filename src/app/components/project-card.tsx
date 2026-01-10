import React from 'react';
import { Button } from './button';
import { Badge } from './badge';

interface ProjectCardProps {
  title: string;
  subtitle: string;
  impact: string;
  highlights: string[];
  badges: string[];
  size?: 'large' | 'medium';
  onCaseStudy?: () => void;
  onDemo?: () => void;
  onEvidence?: () => void;
}

export function ProjectCard({
  title,
  subtitle,
  impact,
  highlights,
  badges,
  size = 'large',
  onCaseStudy,
  onDemo,
  onEvidence
}: ProjectCardProps) {
  return (
    <div 
      className="border border-[var(--border-default)] bg-[var(--surface-1)] hover:border-[var(--border-strong)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,217,255,0.1)] group"
    >
      {/* Header */}
      <div className="border-b border-[var(--border-default)] px-6 py-4 bg-[var(--surface-2)]">
        <h3 className="font-mono text-lg font-semibold" style={{ color: 'var(--electric-blue)' }}>
          {title}
        </h3>
      </div>
      
      {/* Body */}
      <div className="p-6 space-y-4">
        <p className="text-sm leading-relaxed" style={{ color: 'var(--terminal-text)' }}>
          {subtitle}
        </p>
        
        {/* Impact */}
        <div className="pt-2 border-t border-[var(--border-subtle)]">
          <div className="font-mono text-[10px] uppercase tracking-wider mb-2" style={{ color: 'var(--terminal-muted)' }}>
            IMPACT
          </div>
          <p className="text-sm" style={{ color: 'var(--foreground)' }}>
            {impact}
          </p>
        </div>
        
        {/* Highlights */}
        <div className="pt-2">
          <div className="font-mono text-[10px] uppercase tracking-wider mb-3" style={{ color: 'var(--terminal-muted)' }}>
            HIGHLIGHTS
          </div>
          <ul className="space-y-2">
            {highlights.map((highlight, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm">
                <span className="mt-1 w-1 h-1 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--electric-blue)' }}></span>
                <span style={{ color: 'var(--terminal-text)' }}>{highlight}</span>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Badges */}
        <div className="flex flex-wrap gap-2 pt-4">
          {badges.map((badge, idx) => (
            <Badge key={idx} variant="default">{badge}</Badge>
          ))}
        </div>
        
        {/* CTAs */}
        <div className="flex flex-wrap gap-3 pt-6">
          {onCaseStudy && <Button variant="primary" onClick={onCaseStudy}>CASE STUDY</Button>}
          {onDemo && <Button variant="secondary" onClick={onDemo}>OPEN DEMO</Button>}
          {onEvidence && <Button variant="ghost" onClick={onEvidence}>EVIDENCE</Button>}
        </div>
      </div>
    </div>
  );
}
