import React from 'react';
import { Button } from './button';
import { Badge } from './badge';
import { useLanguage } from '../context/language-context';

interface HeroSectionProps {
  onViewProjects?: () => void;
  onArchitecture?: () => void;
  onContact?: () => void;
}

export function HeroSection({ onViewProjects, onArchitecture, onContact }: HeroSectionProps) {
  const { t } = useLanguage();

  return (
    <section className="max-w-[1600px] mx-auto px-6 py-16 lg:py-24">
      <div className="grid lg:grid-cols-2 gap-12 items-start">
        {/* Left: Main content */}
        <div className="space-y-8">
          {/* Name */}
          <h1 className="font-mono font-bold tracking-tight" style={{ color: 'var(--electric-blue)' }}>
            {t('hero.title')}
          </h1>

          {/* Subheadline */}
          <div className="space-y-3">
            <p className="text-lg leading-relaxed" style={{ color: 'var(--terminal-text)' }}>
              {t('hero.subtitle')}. {t('hero.description')}
            </p>
          </div>

          {/* Proof Chips */}
          <div className="flex flex-wrap gap-3">
            <Badge variant="purple">AUTHOR: VERIFY SYSTEMS</Badge>
            <Badge variant="blue">END-TO-END BUILDER</Badge>
            <Badge variant="green">PRODUCTION SYSTEMS</Badge>
            <Badge variant="amber">WALLET AUTH + LICENSING</Badge>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 pt-4">
            <Button variant="primary" onClick={onViewProjects}>{t('hero.cta.work')}</Button>
            <Button variant="secondary" onClick={onArchitecture}>{t('hero.cta.architecture')}</Button>
            <Button variant="ghost" onClick={onContact}>{t('hero.cta.contact')}</Button>
          </div>

          {/* Quick Links */}
          <div className="pt-8 border-t border-[var(--border-subtle)]">
            <div className="font-mono text-[10px] uppercase tracking-wider mb-4" style={{ color: 'var(--terminal-muted)' }}>
              QUICK LINKS
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-sm">
              <a
                href="https://snelabs.space"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[var(--terminal-muted)] hover:text-[var(--electric-blue)] transition-colors"
              >
                <span className="text-[var(--electric-blue)]">→</span>
                <span className="uppercase text-xs">DEMO:</span>
                <span>snelabs.space</span>
              </a>
              <a
                href="https://github.com/SNE-Labs"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[var(--terminal-muted)] hover:text-[var(--electric-blue)] transition-colors"
              >
                <span className="text-[var(--electric-blue)]">→</span>
                <span className="uppercase text-xs">GITHUB:</span>
                <span>SNE-Labs</span>
              </a>
              <a
                href="https://linkedin.com/in/renan-melo-connexions"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[var(--terminal-muted)] hover:text-[var(--electric-blue)] transition-colors"
              >
                <span className="text-[var(--electric-blue)]">→</span>
                <span className="uppercase text-xs">LINKEDIN:</span>
                <span>renan-melo-connexions</span>
              </a>
              <a
                href="mailto:byrenanmelo@gmail.com"
                className="flex items-center gap-2 text-[var(--terminal-muted)] hover:text-[var(--electric-blue)] transition-colors"
              >
                <span className="text-[var(--electric-blue)]">→</span>
                <span className="uppercase text-xs">EMAIL:</span>
                <span>byrenanmelo@gmail.com</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right: Spotlight Panel */}
        <div className="border border-[var(--border-default)] bg-[var(--surface-1)] lg:sticky lg:top-24">
          {/* Header */}
          <div className="border-b border-[var(--border-default)] px-6 py-4 bg-[var(--surface-2)]">
            <div className="font-mono text-xs uppercase tracking-wider" style={{ color: 'var(--electric-blue)' }}>
              PROJECT SPOTLIGHT // SNE Radar
            </div>
            <div className="font-mono text-[10px] uppercase tracking-wider mt-1" style={{ color: 'var(--terminal-muted)' }}>
              (Case Study)
            </div>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6">
            <div className="space-y-3">
              <p className="text-sm leading-relaxed" style={{ color: 'var(--terminal-text)' }}>
                {t('project.sneradar.description')}
              </p>
            </div>

            {/* Metrics */}
            <div className="pt-4 border-t border-[var(--border-subtle)] space-y-3">
              <div className="font-mono text-[10px] uppercase tracking-wider" style={{ color: 'var(--terminal-muted)' }}>
                SPOTLIGHT METRICS
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span style={{ color: 'var(--terminal-muted)' }}>MODULES:</span>
                  <span style={{ color: 'var(--terminal-text)' }}>DESKTOP • LANDING • API • LICENSING</span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span style={{ color: 'var(--terminal-muted)' }}>SECURITY:</span>
                  <span style={{ color: 'var(--terminal-text)' }}>STATE + ONE-TIME CODE + EXCHANGE</span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span style={{ color: 'var(--terminal-muted)' }}>OPS:</span>
                  <span style={{ color: 'var(--terminal-text)' }}>DIAGNOSTICS • RECOVERY • GRACE MODE</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
