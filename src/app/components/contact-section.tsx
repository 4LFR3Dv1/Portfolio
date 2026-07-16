import { Button } from './button';
import { useLanguage } from '../context/language-context';

export function ContactSection() {
  const { t } = useLanguage();

  const contactCards = [
    {
      titleKey: 'contact.hiring.title',
      descKey: 'contact.hiring.desc',
      ctaKey: 'contact.hiring.cta',
      action: () => window.open('mailto:byrenanmelo@gmail.com', '_self')
    },
    {
      titleKey: 'contact.partnership.title',
      descKey: 'contact.partnership.desc',
      ctaKey: 'contact.partnership.cta',
      action: () => window.open('mailto:byrenanmelo@gmail.com?subject=Partnership Inquiry', '_self')
    },
    {
      titleKey: 'contact.consulting.title',
      descKey: 'contact.consulting.desc',
      ctaKey: 'contact.consulting.cta',
      action: () => window.open('mailto:byrenanmelo@gmail.com?subject=Consulting Inquiry', '_self')
    }
  ];

  return (
    <section className="mx-auto max-w-[1480px] px-6 pb-10 pt-24 lg:px-10 lg:pt-32" id="contact">
      {/* Section Header */}
      <div className="glass-panel relative overflow-hidden rounded-[2rem] p-7 sm:p-12 lg:p-16">
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-[rgba(141,162,255,0.12)] blur-3xl" />
        <div className="relative mb-12 max-w-3xl">
          <div className="eyebrow mb-5">06 / Start a conversation</div>
          <h2 className="text-white">
          {t('contact.title')}
        </h2>
        <p className="mt-5 text-base leading-relaxed" style={{ color: 'var(--terminal-muted)' }}>
          {t('contact.subtitle')}
        </p>
      </div>

      {/* Contact Cards */}
      <div className="relative grid gap-4 md:grid-cols-3">
        {contactCards.map((card, idx) => (
          <div
            key={idx}
            className="rounded-[1.5rem] border border-[var(--border-default)] bg-white/[0.025] p-6 transition-all hover:-translate-y-1 hover:border-[var(--electric-blue)]"
          >
            <div>
              <div className="font-mono text-xs uppercase tracking-wider font-semibold" style={{ color: 'var(--electric-blue)' }}>
                {t(card.titleKey)}
              </div>
            </div>
            <div className="mt-5 space-y-6">
              <p className="text-sm" style={{ color: 'var(--terminal-text)' }}>
                {t(card.descKey)}
              </p>
              <Button variant="primary" onClick={card.action} className="w-full">
                {t(card.ctaKey)}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Links */}
      <div className="relative mt-12 border-t border-[var(--border-subtle)] pt-8">
        <div className="flex flex-wrap gap-4 font-mono text-xs" style={{ color: 'var(--terminal-muted)' }}>
          <a
            href="mailto:byrenanmelo@gmail.com"
            className="hover:text-[var(--electric-blue)] transition-colors"
          >
            byrenanmelo@gmail.com
          </a>
          <span>•</span>
          <a
            href="https://linkedin.com/in/renan-melo-connexions"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--electric-blue)] transition-colors"
          >
            LinkedIn: renan-melo-connexions
          </a>
          <span>•</span>
          <a
            href="https://github.com/4LFR3Dv1"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--electric-blue)] transition-colors"
          >
            GitHub: 4LFR3Dv1
          </a>
          <span>•</span>
          <a
            href="https://snelabs.space"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--electric-blue)] transition-colors"
          >
            Demo: snelabs.space
          </a>
        </div>

        <div className="mt-8 border-t border-[var(--border-subtle)] pt-8 text-center">
          <p className="font-mono text-xs" style={{ color: 'var(--terminal-muted)' }}>
            {t('contact.location')}
          </p>
        </div>
      </div>
      </div>
    </section>
  );
}
