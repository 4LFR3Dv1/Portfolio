import React from 'react';
import { useLanguage } from '../context/language-context';

export function LanguageToggle() {
    const { language, setLanguage } = useLanguage();

    return (
        <div className="flex items-center gap-1 font-mono text-xs">
            <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 transition-all ${language === 'en'
                        ? 'text-[var(--electric-blue)] bg-[var(--electric-blue)]/10 border border-[var(--electric-blue)]'
                        : 'text-[var(--terminal-muted)] hover:text-white border border-transparent'
                    }`}
            >
                EN
            </button>
            <span className="text-[var(--terminal-muted)]">/</span>
            <button
                onClick={() => setLanguage('pt')}
                className={`px-2 py-1 transition-all ${language === 'pt'
                        ? 'text-[var(--electric-blue)] bg-[var(--electric-blue)]/10 border border-[var(--electric-blue)]'
                        : 'text-[var(--terminal-muted)] hover:text-white border border-transparent'
                    }`}
            >
                PT
            </button>
        </div>
    );
}
