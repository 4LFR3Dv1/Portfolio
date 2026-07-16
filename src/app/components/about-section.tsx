import { Badge } from './badge';
import { useLanguage } from '../context/language-context';

export function AboutSection() {
  const { t, language } = useLanguage();

  const skills = [
    'DISTRIBUTED SYSTEMS', 'AGENTIC WORKFLOWS', 'API DESIGN', 'EVENT SOURCING',
    'SECURITY MODELING', 'BITCOIN / SOLANA', 'OPS / DIAGNOSTICS'
  ];

  const timeline = [
    { year: '2018', label: t('about.timeline.1') },
    { year: '2019', label: t('about.timeline.2') },
    { year: '2021', label: t('about.timeline.3') },
    { year: '2023', label: t('about.timeline.4') },
    { year: '2026', label: t('about.timeline.5') },
  ];

  return (
    <section className="mx-auto max-w-[1480px] px-6 py-24 lg:px-10 lg:py-32" id="about">
      {/* Header with photo */}
      <div className="mb-14 flex items-center gap-6">
        <div className="h-24 w-24 flex-shrink-0 overflow-hidden border border-[var(--border-default)] bg-[var(--surface-2)] p-1">
          <img
            src="/docs/EDIT RENAN 1.png"
            alt="Renan Melo"
            className="h-full w-full object-cover object-top grayscale transition-all duration-500 hover:grayscale-0"
          />
        </div>
        <div>
          <div className="eyebrow mb-3">05 / Profile</div>
          <h2 className="text-white">
            {t('about.title')}
          </h2>
          <div className="font-mono text-xs mt-1" style={{ color: 'var(--terminal-muted)' }}>
            {language === 'en'
              ? 'Renan Melo — Blockchain & Agentic Systems Engineer'
              : 'Renan Melo — Engenheiro de Blockchain & Sistemas Agênticos'}
          </div>
        </div>
      </div>

      <div className="glass-panel grid gap-12 border-t-2 border-t-[var(--electric-blue)] p-7 sm:p-10 lg:grid-cols-5 lg:p-14">
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
