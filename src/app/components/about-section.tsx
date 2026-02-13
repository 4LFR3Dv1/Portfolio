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
      {/* Section Header */}
      <div className="mb-12">
        <h2 className="font-mono font-bold mb-4" style={{ color: 'var(--electric-blue)' }}>
          {t('about.title')}
        </h2>
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Left: Photo + Bio */}
        <div className="lg:col-span-2 space-y-6">
          {/* Photo */}
          <div className="flex items-start gap-6 mb-2">
            <div className="flex-shrink-0 w-28 h-28 border border-[var(--border-default)] bg-[var(--surface-2)] overflow-hidden">
              <img
                src="/docs/EDIT RENAN 1.png"
                alt="Renan Melo"
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
              />
            </div>
            <div className="space-y-2 pt-1">
              <div className="font-mono text-lg font-semibold" style={{ color: 'var(--electric-blue)' }}>
                Renan Melo
              </div>
              <div className="font-mono text-xs" style={{ color: 'var(--terminal-muted)' }}>
                Decentralized Systems Architect
              </div>
              <div className="font-mono text-xs" style={{ color: '#a855f7' }}>
                Author of VERIFY SYSTEMS
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-4 text-base leading-relaxed" style={{ color: 'var(--terminal-text)' }}>
            <p>{t('about.p1')}</p>
            <p>{t('about.p2')}</p>
            <p>{t('about.p3')}</p>
            <p>{t('about.p4')}</p>
          </div>
        </div>

        {/* Right: Skills + Timeline */}
        <div className="space-y-8">
          {/* Skills */}
          <div className="space-y-4">
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
          <div className="space-y-4">
            <div className="font-mono text-[10px] uppercase tracking-wider" style={{ color: 'var(--terminal-muted)' }}>
              {t('about.journey')}
            </div>
            <div className="border-l-2 border-[var(--border-default)] pl-4 space-y-3">
              {timeline.map((item, idx) => (
                <div key={idx} className="flex gap-3">
                  <span className="font-mono text-xs font-semibold flex-shrink-0 mt-0.5" style={{ color: 'var(--electric-blue)' }}>
                    {item.year}
                  </span>
                  <span className="text-sm" style={{ color: 'var(--terminal-text)' }}>
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
