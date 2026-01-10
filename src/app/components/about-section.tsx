import React from 'react';
import { Badge } from './badge';
import { useLanguage } from '../context/language-context';

export function AboutSection() {
  const { t } = useLanguage();

  const skills = [
    'PLATFORM UX', 'DESIGN SYSTEMS', 'DESKTOP DISTRIBUTION', 'API DESIGN',
    'SECURITY MODELING', 'WEB3 AUTH', 'OPS/DIAGNOSTICS'
  ];

  return (
    <section className="max-w-[1600px] mx-auto px-6 py-16 lg:py-24 border-t border-[var(--border-subtle)]" id="about">
      {/* Section Header */}
      <div className="mb-12">
        <h2 className="font-mono font-bold mb-4" style={{ color: 'var(--electric-blue)' }}>
          {t('about.title')}
        </h2>
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-4 text-base leading-relaxed" style={{ color: 'var(--terminal-text)' }}>
          <p>{t('about.p1')}</p>
          <p>{t('about.p2')}</p>
          <p>{t('about.p3')}</p>
          <p>{t('about.p4')}</p>
        </div>

        {/* Skills */}
        <div className="space-y-6">
          <div className="font-mono text-[10px] uppercase tracking-wider" style={{ color: 'var(--terminal-muted)' }}>
            {t('about.skills')}
          </div>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, idx) => (
              <Badge key={idx} variant="default">{skill}</Badge>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
