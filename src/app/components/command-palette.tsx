import { useEffect, useState, useRef } from 'react';
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
    {
      id: 'nav-home',
      label: language === 'en' ? 'Go to Home' : 'Ir para início',
      description: language === 'en' ? 'Navigate to portfolio home' : 'Navegar para o início do portfólio',
      category: 'navigation',
      action: () => { onNavigate('home'); onClose(); }
    },
    {
      id: 'nav-work',
      label: language === 'en' ? 'Go to Selected Work' : 'Ir para projetos',
      description: language === 'en' ? 'View project showcase' : 'Ver projetos selecionados',
      category: 'navigation',
      action: () => { onNavigate('work'); onClose(); }
    },
    {
      id: 'nav-about',
      label: language === 'en' ? 'Go to About' : 'Ir para sobre',
      description: language === 'en' ? 'Learn more about Renan' : 'Conhecer mais sobre Renan',
      category: 'navigation',
      action: () => { onNavigate('about'); onClose(); }
    },
    {
      id: 'nav-contact',
      label: language === 'en' ? 'Go to Contact' : 'Ir para contato',
      description: language === 'en' ? 'Get in touch' : 'Entrar em contato',
      category: 'navigation',
      action: () => { onNavigate('contact'); onClose(); }
    },
    {
      id: 'nav-evidence',
      label: language === 'en' ? 'Go to Evidence Room' : 'Ir para sala de evidências',
      description: language === 'en' ? 'View public proof and artifacts' : 'Ver provas e artefatos públicos',
      category: 'navigation',
      action: () => { onNavigate('evidence'); onClose(); }
    },
    {
      id: 'arch-explorer',
      label: language === 'en' ? 'Open Architecture Explorer' : 'Abrir explorador de arquitetura',
      description: language === 'en' ? 'Explore system architecture' : 'Explorar arquitetura de sistemas',
      category: 'navigation',
      action: () => { onArchitecture(); onClose(); }
    },
    {
      id: 'case-vira',
      label: 'VIRA',
      description: language === 'en' ? 'Real-time product case study' : 'Estudo de produto em tempo real',
      category: 'case-study',
      action: () => { onCaseStudy('vira'); onClose(); }
    },
    {
      id: 'case-wallet',
      label: 'XS Wallet',
      description: language === 'en' ? 'Self-custody architecture' : 'Arquitetura self-custody',
      category: 'case-study',
      action: () => { onCaseStudy('xs-wallet'); onClose(); }
    },
    {
      id: 'case-agents',
      label: 'Agentic Systems & Foundry',
      description: language === 'en' ? 'Agent operations and evidence' : 'Operação de agentes e evidências',
      category: 'case-study',
      action: () => { onCaseStudy('agentic-systems'); onClose(); }
    },
    {
      id: 'case-transactional-support',
      label: 'Transactional Support Bot',
      description: language === 'en'
        ? 'Deterministic conversational support workflow'
        : 'Fluxo conversacional determinístico de suporte',
      category: 'case-study',
      action: () => { onCaseStudy('transactional-support-bot'); onClose(); }
    },
    {
      id: 'ext-demo',
      label: language === 'en' ? 'Open SNE OS' : 'Abrir SNE OS',
      description: language === 'en' ? 'Visit public product' : 'Visitar produto público',
      category: 'external',
      action: () => { window.open('https://snelabs.space', '_blank', 'noopener,noreferrer'); onClose(); }
    },
    {
      id: 'ext-github',
      label: language === 'en' ? 'Open GitHub' : 'Abrir GitHub',
      description: language === 'en' ? 'View public repositories' : 'Ver repositórios públicos',
      category: 'external',
      action: () => { window.open('https://github.com/4LFR3Dv1', '_blank', 'noopener,noreferrer'); onClose(); }
    },
    {
      id: 'ext-linkedin',
      label: language === 'en' ? 'Open LinkedIn' : 'Abrir LinkedIn',
      description: language === 'en' ? 'Connect on LinkedIn' : 'Conectar no LinkedIn',
      category: 'external',
      action: () => { window.open('https://linkedin.com/in/renan-melo-connexions', '_blank', 'noopener,noreferrer'); onClose(); }
    },
    {
      id: 'ext-email',
      label: language === 'en' ? 'Send Email' : 'Enviar email',
      description: 'byrenanmelo@gmail.com',
      category: 'external',
      action: () => { window.open('mailto:byrenanmelo@gmail.com', '_self'); onClose(); }
    },
    {
      id: 'nav-publications',
      label: language === 'en' ? 'Go to Publications' : 'Ir para publicações',
      description: language === 'en' ? 'View books and written work' : 'Ver livros e textos',
      category: 'navigation',
      action: () => { onNavigate('publications'); onClose(); }
    },
    {
      id: 'case-verify',
      label: language === 'en' ? 'VERIFY SYSTEMS Case Study' : 'Estudo de caso VERIFY SYSTEMS',
      description: language === 'en' ? 'Operational doctrine for verifiable systems' : 'Doutrina operacional para sistemas verificáveis',
      category: 'case-study',
      action: () => { onCaseStudy('verify-systems'); onClose(); }
    },
  ];

  const filteredCommands = commands.filter(cmd =>
    cmd.label.toLowerCase().includes(query.toLowerCase()) ||
    cmd.description.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setQuery('');
      setSelectedIndex(0);
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, filteredCommands.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
        e.preventDefault();
        filteredCommands[selectedIndex].action();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filteredCommands, onClose]);

  if (!isOpen) return null;

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'navigation': return language === 'en' ? 'NAVIGATION' : 'NAVEGAÇÃO';
      case 'case-study': return language === 'en' ? 'CASE STUDIES' : 'ESTUDOS DE CASO';
      case 'external': return language === 'en' ? 'EXTERNAL LINKS' : 'LINKS EXTERNOS';
      default: return category.toUpperCase();
    }
  };

  const groupedCommands = filteredCommands.reduce((acc, cmd) => {
    if (!acc[cmd.category]) acc[cmd.category] = [];
    acc[cmd.category].push(cmd);
    return acc;
  }, {} as Record<string, Command[]>);

  return (
    <>
      {/* Overlay */}
      <button
        type="button"
        aria-label={language === 'en' ? 'Close command palette' : 'Fechar paleta de comandos'}
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
        tabIndex={-1}
      />

      {/* Palette */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={language === 'en' ? 'Command palette' : 'Paleta de comandos'}
        className="fixed inset-x-4 top-[14vh] z-50 mx-auto max-w-[600px] sm:top-[20vh]"
      >
        <div className="border border-[var(--electric-blue)] bg-[var(--terminal-bg)] shadow-[0_0_40px_rgba(0,217,255,0.3)]">
          {/* Header */}
          <div className="border-b border-[var(--border-default)] px-4 py-3 bg-[var(--surface-2)]">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs" style={{ color: 'var(--electric-blue)' }}>⌘K</span>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                placeholder={language === 'en' ? 'Type a command or search...' : 'Digite um comando ou pesquise...'}
                aria-label={language === 'en' ? 'Search commands' : 'Pesquisar comandos'}
                className="min-h-10 flex-1 border-none bg-transparent font-mono text-sm outline-none focus-visible:ring-2 focus-visible:ring-[var(--electric-blue)]"
                style={{ color: 'var(--terminal-text)' }}
              />
              <span className="font-mono text-xs" style={{ color: 'var(--terminal-muted)' }}>ESC</span>
            </div>
          </div>

          {/* Results */}
          <div className="max-h-[60vh] overflow-y-auto">
            {Object.entries(groupedCommands).map(([category, cmds]) => (
              <div key={category}>
                <div className="px-4 py-2 bg-[var(--surface-2)] border-b border-[var(--border-subtle)]">
                  <div className="font-mono text-[10px] uppercase tracking-wider" style={{ color: 'var(--terminal-muted)' }}>
                    {getCategoryLabel(category)}
                  </div>
                </div>
                {cmds.map((cmd) => {
                  const globalIndex = filteredCommands.indexOf(cmd);
                  const isSelected = globalIndex === selectedIndex;

                  return (
                    <button
                      key={cmd.id}
                      onClick={cmd.action}
                      className={`min-h-14 w-full border-b border-[var(--border-subtle)] px-4 py-3 text-left motion-safe:transition-colors motion-safe:duration-100 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--electric-blue)] ${isSelected
                          ? 'bg-[var(--surface-2)]'
                          : 'hover:bg-[var(--surface-1)]'
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div
                            className="font-mono text-sm mb-1"
                            style={{ color: isSelected ? 'var(--electric-blue)' : 'var(--terminal-text)' }}
                          >
                            {cmd.label}
                          </div>
                          <div className="text-xs" style={{ color: 'var(--terminal-muted)' }}>
                            {cmd.description}
                          </div>
                        </div>
                        {isSelected && (
                          <span className="font-mono text-xs" style={{ color: 'var(--electric-blue)' }}>↵</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            ))}

            {filteredCommands.length === 0 && (
              <div className="px-4 py-8 text-center">
                <p className="font-mono text-sm" style={{ color: 'var(--terminal-muted)' }}>
                  {language === 'en' ? 'No commands found' : 'Nenhum comando encontrado'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
