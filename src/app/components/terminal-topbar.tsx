import { LanguageToggle } from './language-toggle';
import { useLanguage } from '../context/language-context';

export function TerminalTopBar() {
  const { language } = useLanguage();

  return (
    <header className="w-full border-b border-[#1a1a24] bg-[#0a0a0f] sticky top-0 z-50">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        <a href="/" className="font-mono text-xs sm:text-sm font-semibold tracking-wide" style={{ color: 'var(--electric-blue)' }}>
          RENAN MELO // PORTFOLIO
        </a>

        <div className="hidden md:flex items-center gap-3 font-mono text-xs" style={{ color: 'var(--terminal-muted)' }}>
          <span>{language === 'en' ? 'SYSTEMS' : 'SISTEMAS'}</span>
          <span className="text-[#3a3a44]">/</span>
          <span>PRODUCT</span>
          <span className="text-[#3a3a44]">/</span>
          <span>WEB3</span>
          <span className="text-[#3a3a44]">/</span>
          <span>AI</span>
        </div>

        <div className="flex items-center gap-3 sm:gap-6">
          <LanguageToggle />
          <span className="hidden sm:block font-mono text-xs uppercase tracking-wider" style={{ color: 'var(--terminal-muted)' }}>
            SÃO PAULO · REMOTE
          </span>
        </div>
      </div>
    </header>
  );
}
