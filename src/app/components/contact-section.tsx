import { Button } from './button';
import { useLanguage } from '../context/language-context';

export function ContactSection() {
  const { language } = useLanguage();
  const copy = language === 'en'
    ? {
        eyebrow: 'CONTACT',
        title: 'IF SOMETHING HERE CONNECTS WITH WHAT YOU ARE BUILDING, WRITE TO ME.',
        body: 'I like conversations about difficult products, AI systems, infrastructure and experiments that begin as a question. Work, collaboration, research or simply a good technical conversation — email is the best place to start.',
        email: 'SEND AN EMAIL →',
        linkedin: 'LINKEDIN ↗',
        github: 'GITHUB ↗',
        labs: 'SNE LABS ↗',
        location: 'São Paulo, Brazil · working remotely',
      }
    : {
        eyebrow: 'CONTATO',
        title: 'SE ALGO DAQUI CONVERSA COM O QUE VOCÊ ESTÁ CONSTRUINDO, ME ESCREVA.',
        body: 'Gosto de conversar sobre produtos difíceis, sistemas com IA, infraestrutura e experimentos que começam como pergunta. Trabalho, colaboração, pesquisa ou simplesmente uma boa conversa técnica — email é o melhor começo.',
        email: 'ENVIAR EMAIL →',
        linkedin: 'LINKEDIN ↗',
        github: 'GITHUB ↗',
        labs: 'SNE LABS ↗',
        location: 'São Paulo, Brasil · trabalho remoto',
      };

  return (
    <section className="mx-auto max-w-[1600px] border-t border-[var(--border-subtle)] px-4 py-16 sm:px-6 lg:py-24" id="contact">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-20">
        <div className="max-w-4xl">
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--electric-blue)]">{copy.eyebrow}</p>
          <h2 className="mt-4 max-w-4xl font-mono text-3xl font-bold leading-tight tracking-tight text-[var(--terminal-text)] sm:text-4xl lg:text-5xl">
            {copy.title}
          </h2>
          <p className="mt-6 max-w-3xl text-base leading-relaxed text-[var(--terminal-muted)] sm:text-lg">{copy.body}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button variant="primary" onClick={() => window.open('mailto:byrenanmelo@gmail.com', '_self')}>
              {copy.email}
            </Button>
            <Button variant="secondary" onClick={() => window.open('https://linkedin.com/in/renan-melo-connexions', '_blank', 'noopener,noreferrer')}>
              {copy.linkedin}
            </Button>
          </div>
        </div>

        <aside className="border-l border-[var(--border-default)] pl-6 sm:pl-8">
          <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--terminal-muted)]">
            {language === 'en' ? 'Elsewhere' : 'Outros lugares'}
          </p>
          <div className="mt-5 grid gap-1">
            <a href="mailto:byrenanmelo@gmail.com" className="border-t border-[var(--border-default)] py-4 text-sm text-[var(--terminal-text)] transition-colors hover:text-[var(--electric-blue)]">
              byrenanmelo@gmail.com
            </a>
            <a href="https://github.com/4LFR3Dv1" target="_blank" rel="noopener noreferrer" className="border-t border-[var(--border-default)] py-4 font-mono text-xs text-[var(--terminal-muted)] transition-colors hover:text-[var(--electric-blue)]">
              {copy.github}
            </a>
            <a href="https://snelabs.space" target="_blank" rel="noopener noreferrer" className="border-y border-[var(--border-default)] py-4 font-mono text-xs text-[var(--terminal-muted)] transition-colors hover:text-[var(--electric-blue)]">
              {copy.labs}
            </a>
          </div>
          <p className="mt-6 font-mono text-[10px] uppercase tracking-wider text-[var(--terminal-muted)]">{copy.location}</p>
        </aside>
      </div>
    </section>
  );
}
