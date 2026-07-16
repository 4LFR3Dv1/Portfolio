import { LanguageToggle } from './language-toggle';
import { useLanguage } from '../context/language-context';

export function TerminalTopBar() {
  const { language } = useLanguage();

  return (
    <header className="glass-panel sticky top-0 z-50 w-full border-x-0 border-t-0">
      <div className="mx-auto flex max-w-[1480px] items-center justify-between gap-4 px-5 py-3 sm:px-8">
        <a href="/" className="flex items-center gap-3 text-sm font-bold tracking-[-0.02em] text-white">
          <span className="grid h-8 w-8 place-items-center border border-[var(--electric-blue)] bg-[rgba(141,162,255,0.1)] font-mono text-[10px] text-[var(--electric-blue)]">RM</span>
          <span className="hidden sm:inline">Renan Melo</span>
        </a>

        <div className="hidden items-center gap-6 font-mono text-[10px] uppercase tracking-[0.14em] lg:flex" style={{ color: 'var(--terminal-muted)' }}>
          <a href="/#selected-work" className="transition-colors hover:text-white">{language === 'en' ? 'Work' : 'Projetos'}</a>
          <a href="/#evidence" className="transition-colors hover:text-white">{language === 'en' ? 'Evidence' : 'Evidências'}</a>
          <a href="/#about" className="transition-colors hover:text-white">{language === 'en' ? 'About' : 'Sobre'}</a>
          <a href="/#contact" className="transition-colors hover:text-white">{language === 'en' ? 'Contact' : 'Contato'}</a>
        </div>

        <div className="flex items-center gap-3 sm:gap-6">
          <LanguageToggle />
          <span className="hidden border-l border-[var(--border-default)] px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.12em] sm:block" style={{ color: 'var(--electric-green)' }}>
            ● {language === 'en' ? 'Available remotely' : 'Disponível remoto'}
          </span>
        </div>
      </div>
    </header>
  );
}
