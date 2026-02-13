import React from 'react';
import { Badge } from './badge';
import { useLanguage } from '../context/language-context';

export function AboutSection() {
  const { t } = useLanguage();

  const skills = [
    'PLATFORM UX', 'DESIGN SYSTEMS', 'DESKTOP DISTRIBUTION', 'API DESIGN',
    'SECURITY MODELING', 'WEB3 AUTH', 'OPS/DIAGNOSTICS'
  ];

  const timeline = [
    { year: '2018', label: t('about.timeline.1') },
    { year: '2019', label: t('about.timeline.2') },
    { year: '2021', label: t('about.timeline.3') },
    { year: '2023', label: t('about.timeline.4') },
    { year: '2026', label: t('about.timeline.5') },
  ];

  return (
    <section className="max-w-[1600px] mx-auto px-6 py-16 lg:py-24 border-t border-[var(--border-subtle)]" id="about">
      {/* Header with photo */}
      <div className="flex items-center gap-5 mb-10">
        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[var(--border-default)] flex-shrink-0">
          <img
            src="/docs/EDIT RENAN 1.png"
            alt="Renan Melo"
            className="w-full h-full object-cover object-top"
          />
        </div>
        <div>
          <h2 className="font-mono font-bold" style={{ color: 'var(--electric-blue)' }}>
            {t('about.title')}
          </h2>
          <div className="font-mono text-xs mt-1" style={{ color: 'var(--terminal-muted)' }}>
            Renan Melo — Decentralized Systems Architect
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-12">
        {/* Left: Bio (3 cols) */}
        <div className="lg:col-span-3 space-y-4 text-base leading-relaxed" style={{ color: 'var(--terminal-text)' }}>
          <p>{t('about.p1')}</p>
          <p>{t('about.p2')}</p>
          <p>{t('about.p3')}</p>
          <p className="font-mono text-sm font-semibold pt-2" style={{ color: 'var(--electric-green)' }}>
            {t('about.p4')}
          </p>
        </div>

        {/* Right: Skills + Timeline (2 cols) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Skills */}
          <div className="space-y-3">
            <div className="font-mono text-[10px] uppercase tracking-wider" style={{ color: 'var(--terminal-muted)' }}>
              {t('about.skills')}
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, idx) => (
                <Badge key={idx} variant="default">{skill}</Badge>
              ))}
            </div>
          </div>

          {/* Career Timeline */}
          <div className="space-y-3">
            <div className="font-mono text-[10px] uppercase tracking-wider" style={{ color: 'var(--terminal-muted)' }}>
              {t('about.journey')}
            </div>
            <div className="border-l-2 border-[var(--border-default)] pl-4 space-y-2.5">
              {timeline.map((item, idx) => (
                <div key={idx} className="flex gap-3">
                  <span className="font-mono text-xs font-semibold flex-shrink-0" style={{ color: 'var(--electric-blue)' }}>
                    {item.year}
                  </span>
                  <span className="text-xs" style={{ color: 'var(--terminal-text)' }}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
