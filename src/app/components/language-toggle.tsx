import { useLanguage } from '../context/language-context';

export function LanguageToggle() {
    const { language, setLanguage } = useLanguage();

    return (
        <div className="flex items-center font-mono text-xs" aria-label={language === 'en' ? 'Language' : 'Idioma'}>
            <button
                type="button"
                onClick={() => setLanguage('en')}
                aria-pressed={language === 'en'}
                className={`min-h-10 min-w-10 border px-2 motion-safe:transition-colors motion-safe:duration-100 focus-visible:ring-2 focus-visible:ring-[var(--electric-blue)] ${language === 'en'
                        ? 'text-[var(--electric-blue)] bg-[var(--electric-blue)]/10 border border-[var(--electric-blue)]'
                        : 'text-[var(--terminal-muted)] hover:text-white border border-transparent'
                    }`}
            >
                EN
            </button>
            <span className="text-[var(--border-strong)]" aria-hidden="true">/</span>
            <button
                type="button"
                onClick={() => setLanguage('pt')}
                aria-pressed={language === 'pt'}
                className={`min-h-10 min-w-10 border px-2 motion-safe:transition-colors motion-safe:duration-100 focus-visible:ring-2 focus-visible:ring-[var(--electric-blue)] ${language === 'pt'
                        ? 'text-[var(--electric-blue)] bg-[var(--electric-blue)]/10 border border-[var(--electric-blue)]'
                        : 'text-[var(--terminal-muted)] hover:text-white border border-transparent'
                    }`}
            >
                PT
            </button>
        </div>
    );
}
