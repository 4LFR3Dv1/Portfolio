import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../context/language-context';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (section: string) => void;
  onCaseStudy: (projectId: string) => void;
  onArchitecture: () => void;
}

interface Command {
  id: string;
  label: string;
  description: string;
  category: 'navigation' | 'case-study' | 'external';
  action: () => void;
}

export function CommandPalette({ isOpen, onClose, onNavigate, onCaseStudy, onArchitecture }: CommandPaletteProps) {
  const { language } = useLanguage();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands: Command[] = [
    { id: 'nav-home', label: language === 'en' ? 'Go to Home' : 'Ir para início', description: language === 'en' ? 'Portfolio home' : 'Início do portfólio', category: 'navigation', action: () => { onNavigate('home'); onClose(); } },
    { id: 'nav-work', label: language === 'en' ? 'Go to Work' : 'Ir para trabalhos', description: language === 'en' ? 'Selected products, tools and experiments' : 'Produtos, ferramentas e experimentos selecionados', category: 'navigation', action: () => { onNavigate('work'); onClose(); } },
    { id: 'nav-editorial', label: language === 'en' ? 'Open Editorial' : 'Abrir Editorial', description: language === 'en' ? 'Essays and notes on technology and computing' : 'Ensaios e notas sobre tecnologia e computação', category: 'navigation', action: () => { onNavigate('editorial'); onClose(); } },
    { id: 'nav-architecture', label: language === 'en' ? 'Open Architecture' : 'Abrir Arquitetura', description: language === 'en' ? 'A deeper look at how the work is structured' : 'Uma visão mais profunda de como o trabalho é estruturado', category: 'navigation', action: () => { onArchitecture(); onClose(); } },
    { id: 'nav-about', label: language === 'en' ? 'Go to About' : 'Ir para sobre', description: language === 'en' ? 'How I work and what I care about' : 'Como trabalho e o que considero importante', category: 'navigation', action: () => { onNavigate('about'); onClose(); } },
    { id: 'nav-contact', label: language === 'en' ? 'Go to Contact' : 'Ir para contato', description: language === 'en' ? 'Get in touch' : 'Entrar em contato', category: 'navigation', action: () => { onNavigate('contact'); onClose(); } },
    { id: 'case-vira', label: 'VIRA', description: language === 'en' ? 'Real-time football product' : 'Produto de futebol em tempo real', category: 'case-study', action: () => { onCaseStudy('vira'); onClose(); } },
    { id: 'case-wallet', label: 'XS Wallet', description: language === 'en' ? 'Desktop self-custody experiment' : 'Experimento desktop de self-custody', category: 'case-study', action: () => { onCaseStudy('xs-wallet'); onClose(); } },
    { id: 'ext-github', label: 'GitHub', description: language === 'en' ? 'View public repositories' : 'Ver repositórios públicos', category: 'external', action: () => { window.open('https://github.com/4LFR3Dv1', '_blank', 'noopener,noreferrer'); onClose(); } },
    { id: 'ext-linkedin', label: 'LinkedIn', description: language === 'en' ? 'Open LinkedIn profile' : 'Abrir perfil no LinkedIn', category: 'external', action: () => { window.open('https://linkedin.com/in/renan-melo-connexions', '_blank', 'noopener,noreferrer'); onClose(); } },
    { id: 'ext-email', label: language === 'en' ? 'Send Email' : 'Enviar email', description: 'byrenanmelo@gmail.com', category: 'external', action: () => { window.open('mailto:byrenanmelo@gmail.com', '_self'); onClose(); } },
  ];

  const filteredCommands = commands.filter((command) =>
    command.label.toLowerCase().includes(query.toLowerCase()) || command.description.toLowerCase().includes(query.toLowerCase()),
  );

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setQuery('');
      setSelectedIndex(0);
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;
      if (event.key === 'Escape') onClose();
      else if (event.key === 'ArrowDown') { event.preventDefault(); setSelectedIndex((index) => Math.min(index + 1, filteredCommands.length - 1)); }
      else if (event.key === 'ArrowUp') { event.preventDefault(); setSelectedIndex((index) => Math.max(index - 1, 0)); }
      else if (event.key === 'Enter' && filteredCommands[selectedIndex]) { event.preventDefault(); filteredCommands[selectedIndex].action(); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filteredCommands, isOpen, onClose, selectedIndex]);

  if (!isOpen) return null;

  const groupedCommands = filteredCommands.reduce((groups, command) => {
    (groups[command.category] ??= []).push(command);
    return groups;
  }, {} as Record<string, Command[]>);

  const categoryLabel = (category: string) => {
    if (category === 'navigation') return language === 'en' ? 'NAVIGATION' : 'NAVEGAÇÃO';
    if (category === 'case-study') return language === 'en' ? 'CASE STUDIES' : 'ESTUDOS DE CASO';
    return language === 'en' ? 'ELSEWHERE' : 'OUTROS LUGARES';
  };

  return (
    <>
      <button type="button" aria-label={language === 'en' ? 'Close command palette' : 'Fechar paleta de comandos'} className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm" onClick={onClose} tabIndex={-1} />
      <div role="dialog" aria-modal="true" className="fixed inset-x-4 top-[14vh] z-50 mx-auto max-w-[600px] sm:top-[20vh]">
        <div className="border border-[var(--electric-blue)] bg-[var(--terminal-bg)] shadow-[0_0_40px_rgba(0,217,255,0.3)]">
          <div className="border-b border-[var(--border-default)] bg-[var(--surface-2)] px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-[var(--electric-blue)]">⌘K</span>
              <input ref={inputRef} value={query} onChange={(event) => { setQuery(event.target.value); setSelectedIndex(0); }} placeholder={language === 'en' ? 'Type a command or search...' : 'Digite um comando ou pesquise...'} className="min-h-10 flex-1 border-none bg-transparent font-mono text-sm text-[var(--terminal-text)] outline-none" />
              <span className="font-mono text-xs text-[var(--terminal-muted)]">ESC</span>
            </div>
          </div>
          <div className="max-h-[60vh] overflow-y-auto">
            {Object.entries(groupedCommands).map(([category, items]) => (
              <div key={category}>
                <div className="border-b border-[var(--border-subtle)] bg-[var(--surface-2)] px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-[var(--terminal-muted)]">{categoryLabel(category)}</div>
                {items.map((command) => {
                  const globalIndex = filteredCommands.indexOf(command);
                  const selected = globalIndex === selectedIndex;
                  return (
                    <button key={command.id} type="button" onClick={command.action} className={`min-h-14 w-full border-b border-[var(--border-subtle)] px-4 py-3 text-left ${selected ? 'bg-[var(--surface-2)]' : 'hover:bg-[var(--surface-1)]'}`}>
                      <div className="font-mono text-sm" style={{ color: selected ? 'var(--electric-blue)' : 'var(--terminal-text)' }}>{command.label}</div>
                      <div className="mt-1 text-xs text-[var(--terminal-muted)]">{command.description}</div>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
