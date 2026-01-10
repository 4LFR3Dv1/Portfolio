import React, { useEffect, useState, useRef } from 'react';

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
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands: Command[] = [
    {
      id: 'nav-home',
      label: 'Go to Home',
      description: 'Navigate to portfolio home',
      category: 'navigation',
      action: () => { onNavigate('home'); onClose(); }
    },
    {
      id: 'nav-work',
      label: 'Go to Selected Work',
      description: 'View project showcase',
      category: 'navigation',
      action: () => { onNavigate('work'); onClose(); }
    },
    {
      id: 'nav-about',
      label: 'Go to About',
      description: 'Learn more about Renan',
      category: 'navigation',
      action: () => { onNavigate('about'); onClose(); }
    },
    {
      id: 'nav-contact',
      label: 'Go to Contact',
      description: 'Get in touch',
      category: 'navigation',
      action: () => { onNavigate('contact'); onClose(); }
    },
    {
      id: 'nav-evidence',
      label: 'Go to Evidence Room',
      description: 'View documentation and artifacts',
      category: 'navigation',
      action: () => { onNavigate('evidence'); onClose(); }
    },
    {
      id: 'arch-explorer',
      label: 'Open Architecture Explorer',
      description: 'Explore system architecture',
      category: 'navigation',
      action: () => { onArchitecture(); onClose(); }
    },
    {
      id: 'case-sne-os',
      label: 'SNE OS Case Study',
      description: 'Control Plane Web',
      category: 'case-study',
      action: () => { onCaseStudy('sne-os'); onClose(); }
    },
    {
      id: 'case-radar',
      label: 'SNE Radar Case Study',
      description: 'Desktop + Web + Backend',
      category: 'case-study',
      action: () => { onCaseStudy('sne-radar'); onClose(); }
    },
    {
      id: 'case-vault',
      label: 'SNE Vault Case Study',
      description: 'Security & Infrastructure',
      category: 'case-study',
      action: () => { onCaseStudy('sne-vault'); onClose(); }
    },
    {
      id: 'ext-demo',
      label: 'Open Demo (snelabs.space)',
      description: 'Visit live demo',
      category: 'external',
      action: () => { window.open('https://snelabs.space', '_blank'); onClose(); }
    },
    {
      id: 'ext-github',
      label: 'Open GitHub',
      description: 'View code repositories',
      category: 'external',
      action: () => { window.open('https://github.com/SNE-Labs', '_blank'); onClose(); }
    },
    {
      id: 'ext-linkedin',
      label: 'Open LinkedIn',
      description: 'Connect on LinkedIn',
      category: 'external',
      action: () => { window.open('https://linkedin.com/in/renan-melo-connexions', '_blank'); onClose(); }
    },
    {
      id: 'ext-email',
      label: 'Send Email',
      description: 'byrenanmelo@gmail.com',
      category: 'external',
      action: () => { window.location.href = 'mailto:byrenanmelo@gmail.com'; onClose(); }
    }
  ];

  const filteredCommands = commands.filter(cmd => 
    cmd.label.toLowerCase().includes(query.toLowerCase()) ||
    cmd.description.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

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
      case 'navigation': return 'NAVIGATION';
      case 'case-study': return 'CASE STUDIES';
      case 'external': return 'EXTERNAL LINKS';
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
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
        onClick={onClose}
      ></div>
      
      {/* Palette */}
      <div className="fixed top-[20vh] left-1/2 -translate-x-1/2 w-full max-w-[600px] z-50 mx-4">
        <div className="border border-[var(--electric-blue)] bg-[var(--terminal-bg)] shadow-[0_0_40px_rgba(0,217,255,0.3)]">
          {/* Header */}
          <div className="border-b border-[var(--border-default)] px-4 py-3 bg-[var(--surface-2)]">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs" style={{ color: 'var(--electric-blue)' }}>⌘K</span>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type a command or search..."
                className="flex-1 bg-transparent border-none outline-none font-mono text-sm"
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
                {cmds.map((cmd, idx) => {
                  const globalIndex = filteredCommands.indexOf(cmd);
                  const isSelected = globalIndex === selectedIndex;
                  
                  return (
                    <button
                      key={cmd.id}
                      onClick={cmd.action}
                      className={`w-full text-left px-4 py-3 border-b border-[var(--border-subtle)] transition-colors ${
                        isSelected
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
                  No commands found
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
