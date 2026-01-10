import React from 'react';
import { Button } from './button';

export function ContactSection() {
  const contactCards = [
    {
      title: 'HIRING',
      description: 'Disponível para full-time remoto.',
      cta: 'EMAIL ME',
      action: () => window.location.href = 'mailto:byrenanmelo@gmail.com'
    },
    {
      title: 'PARTNERSHIPS / PILOTS',
      description: 'Demonstração, integração, piloto pago.',
      cta: "LET'S TALK",
      action: () => window.location.href = 'mailto:byrenanmelo@gmail.com?subject=Partnership Inquiry'
    },
    {
      title: 'CONSULTING',
      description: 'Arquitetura, produto, UX tooling, web3 auth.',
      cta: 'REQUEST AVAILABILITY',
      action: () => window.location.href = 'mailto:byrenanmelo@gmail.com?subject=Consulting Inquiry'
    }
  ];
  
  return (
    <section className="max-w-[1600px] mx-auto px-6 py-16 lg:py-24 border-t border-[var(--border-subtle)]" id="contact">
      {/* Section Header */}
      <div className="mb-12">
        <h2 className="font-mono font-bold mb-4" style={{ color: 'var(--electric-blue)' }}>
          CONTACT // ROUTING
        </h2>
        <p className="text-base" style={{ color: 'var(--terminal-muted)' }}>
          Se você quer contratar, fazer parceria ou discutir um piloto, me chame direto.
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
                {card.title}
              </div>
            </div>
            <div className="p-6 space-y-6">
              <p className="text-sm" style={{ color: 'var(--terminal-text)' }}>
                {card.description}
              </p>
              <Button variant="primary" onClick={card.action} className="w-full">
                {card.cta}
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
            São Paulo, Brasil • Remoto OK
          </p>
        </div>
      </div>
    </section>
  );
}
