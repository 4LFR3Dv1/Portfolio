import React from 'react';
import { Button } from './button';
import { useLanguage } from '../context/language-context';

export function ContactSection() {
  const { t } = useLanguage();

  const contactCards = [
    {
      titleKey: 'contact.hiring.title',
      descKey: 'contact.hiring.desc',
      ctaKey: 'contact.hiring.cta',
      action: () => window.location.href = 'mailto:byrenanmelo@gmail.com'
    },
    {
      titleKey: 'contact.partnership.title',
      descKey: 'contact.partnership.desc',
      ctaKey: 'contact.partnership.cta',
      action: () => window.location.href = 'mailto:byrenanmelo@gmail.com?subject=Partnership Inquiry'
    },
    {
      titleKey: 'contact.consulting.title',
      descKey: 'contact.consulting.desc',
      ctaKey: 'contact.consulting.cta',
      action: () => window.location.href = 'mailto:byrenanmelo@gmail.com?subject=Consulting Inquiry'
    }
  ];

  return (
    <section className="max-w-[1600px] mx-auto px-6 py-16 lg:py-24 border-t border-[var(--border-subtle)]" id="contact">
      {/* Section Header */}
      <div className="mb-12">
        <h2 className="font-mono font-bold mb-4" style={{ color: 'var(--electric-blue)' }}>
          {t('contact.title')}
        </h2>
        <p className="text-base" style={{ color: 'var(--terminal-muted)' }}>
          {t('contact.subtitle')}
        </p>
      </div>

      {/* Contact Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {contactCards.map((card, idx) => (
          <div
            key={idx}
            className="border border-[var(--border-default)] bg-[var(--surface-1)] hover:border-[var(--electric-blue)] transition-all"
          >
            <div className="border-b border-[var(--border-default)] px-6 py-4 bg-[var(--surface-2)]">
              <div className="font-mono text-xs uppercase tracking-wider font-semibold" style={{ color: 'var(--electric-blue)' }}>
                {t(card.titleKey)}
              </div>
            </div>
            <div className="p-6 space-y-6">
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
      <div className="pt-12 border-t border-[var(--border-subtle)]">
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
            href="https://github.com/SNE-Labs"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--electric-blue)] transition-colors"
          >
            GitHub: SNE-Labs
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

        <div className="mt-8 pt-8 border-t border-[var(--border-subtle)] text-center">
          <p className="font-mono text-xs" style={{ color: 'var(--terminal-muted)' }}>
            {t('contact.location')}
          </p>
        </div>
      </div>
    </section>
  );
}
