import { useEffect, useRef, useState } from 'react';
import type { PortfolioRoute } from '../routing';
import { useLanguage } from '../context/language-context';
import { LanguageToggle } from './language-toggle';

type NavigationId = 'home' | 'work' | 'editorial' | 'evidence' | 'architecture' | 'about' | 'contact';

interface TerminalTopBarProps {
  route: PortfolioRoute;
  onNavigate: (section: NavigationId) => void;
  onArchitecture: () => void;
  onEditorial: () => void;
  onOpenPalette: () => void;
}

interface NavigationItem {
  id: Exclude<NavigationId, 'home'>;
  index: string;
  label: string;
}

const observedSections: Array<{ elementId: string; navigationId: NavigationId }> = [
  { elementId: 'selected-work', navigationId: 'work' },
  { elementId: 'editorial', navigationId: 'editorial' },
  { elementId: 'evidence', navigationId: 'evidence' },
  { elementId: 'architecture', navigationId: 'architecture' },
  { elementId: 'about', navigationId: 'about' },
  { elementId: 'contact', navigationId: 'contact' },
];

export function resolveActiveNavigation(route: PortfolioRoute, visibleSection: NavigationId): NavigationId {
  if (route.view === 'architecture') return 'architecture';
  if (route.view === 'case-study') return 'work';
  return visibleSection;
}

export function TerminalTopBar({ route, onNavigate, onArchitecture, onEditorial, onOpenPalette }: TerminalTopBarProps) {
  const { language } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [visibleSection, setVisibleSection] = useState<NavigationId>('home');
  const [scrollProgress, setScrollProgress] = useState(0);
  const headerRef = useRef<HTMLElement>(null);

  const copy = language === 'en'
    ? {
        portfolio: 'PORTFOLIO',
        status: 'AVAILABLE // REMOTE',
        navigation: 'Primary navigation',
        menu: 'MENU',
        close: 'CLOSE',
        commands: 'COMMANDS',
        shortcut: 'Shortcut',
        items: [
          { id: 'work', index: '01', label: 'WORK' },
          { id: 'editorial', index: '02', label: 'EDITORIAL' },
          { id: 'evidence', index: '03', label: 'EVIDENCE' },
          { id: 'architecture', index: '04', label: 'ARCHITECTURE' },
          { id: 'about', index: '05', label: 'ABOUT' },
          { id: 'contact', index: '06', label: 'CONTACT' },
        ] satisfies NavigationItem[],
      }
    : {
        portfolio: 'PORTFÓLIO',
        status: 'DISPONÍVEL // REMOTO',
        navigation: 'Navegação principal',
        menu: 'MENU',
        close: 'FECHAR',
        commands: 'COMANDOS',
        shortcut: 'Atalho',
        items: [
          { id: 'work', index: '01', label: 'TRABALHOS' },
          { id: 'editorial', index: '02', label: 'EDITORIAL' },
          { id: 'evidence', index: '03', label: 'EVIDÊNCIAS' },
          { id: 'architecture', index: '04', label: 'ARQUITETURA' },
          { id: 'about', index: '05', label: 'SOBRE' },
          { id: 'contact', index: '06', label: 'CONTATO' },
        ] satisfies NavigationItem[],
      };

  const activeNavigation = resolveActiveNavigation(route, visibleSection);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsMenuOpen(false);
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  useEffect(() => {
    let animationFrame = 0;
    const updateProgress = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(scrollable > 0 ? Math.min(window.scrollY / scrollable, 1) : 0);
      animationFrame = 0;
    };
    const handleScroll = () => {
      if (!animationFrame) animationFrame = window.requestAnimationFrame(updateProgress);
    };

    updateProgress();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
    };
  }, [route]);

  useEffect(() => {
    if (route.view !== 'landing') return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visible) {
          if (window.scrollY < window.innerHeight * 0.45) setVisibleSection('home');
          return;
        }

        const match = observedSections.find((section) => section.elementId === visible.target.id);
        if (match) setVisibleSection(match.navigationId);
      },
      { rootMargin: '-20% 0px -55% 0px', threshold: [0, 0.1, 0.35] },
    );

    observedSections.forEach(({ elementId }) => {
      const element = document.getElementById(elementId);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [route]);

  const activateItem = (id: NavigationItem['id']) => {
    setIsMenuOpen(false);
    if (id === 'editorial') {
      onEditorial();
      return;
    }
    if (id === 'architecture') {
      onArchitecture();
      return;
    }
    onNavigate(id);
  };

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-40 w-full border-b border-[var(--border-default)] bg-[color:var(--terminal-bg)]/95 backdrop-blur-md"
    >
      <div className="mx-auto flex min-h-16 max-w-[1600px] items-stretch px-4 sm:px-6">
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="group flex min-h-11 shrink-0 items-center gap-3 pr-4 text-left focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--electric-blue)] sm:pr-6"
          aria-label={language === 'en' ? 'Go to portfolio home' : 'Ir para o início do portfólio'}
        >
          <span className="grid h-8 w-8 place-items-center border border-[var(--electric-blue)] bg-[rgba(0,217,255,0.08)] font-mono text-xs font-bold text-[var(--electric-blue)] motion-safe:transition-colors motion-safe:duration-100 group-hover:bg-[var(--electric-blue)] group-hover:text-[var(--terminal-bg)]">
            RM
          </span>
          <span className="hidden min-w-0 xl:block">
            <span className="block font-mono text-xs font-semibold tracking-wide text-[var(--terminal-text)]">RENAN MELO</span>
            <span className="mt-1 flex items-center gap-2 font-mono text-xs text-[var(--terminal-muted)]">
              <span className="h-1.5 w-1.5 bg-[var(--status-online)]" aria-hidden="true" />
              {copy.portfolio}
            </span>
          </span>
        </button>

        <nav className="hidden min-w-0 flex-1 items-stretch border-l border-[var(--border-default)] lg:flex" aria-label={copy.navigation}>
          {copy.items.map((item) => {
            const isActive = activeNavigation === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => activateItem(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`group relative flex min-h-16 min-w-0 flex-1 items-center justify-center gap-2 border-r border-[var(--border-default)] px-3 font-mono text-xs tracking-wider motion-safe:transition-colors motion-safe:duration-100 focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--electric-blue)] ${isActive ? 'bg-[var(--surface-2)] text-[var(--electric-blue)]' : 'text-[var(--terminal-muted)] hover:bg-[var(--surface-1)] hover:text-[var(--terminal-text)]'}`}
              >
                <span className={isActive ? 'text-[var(--electric-blue)]' : 'text-[var(--border-strong)]'}>{item.index}</span>
                <span className="truncate">{item.label}</span>
                <span className={`absolute inset-x-0 bottom-0 h-px origin-left bg-[var(--electric-blue)] motion-safe:transition-transform motion-safe:duration-150 ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} aria-hidden="true" />
              </button>
            );
          })}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-2 pl-3">
          <div className="hidden items-center gap-2 2xl:flex">
            <span className="h-1.5 w-1.5 bg-[var(--status-online)]" aria-hidden="true" />
            <span className="font-mono text-xs text-[var(--terminal-muted)]">{copy.status}</span>
          </div>
          <button type="button" onClick={onOpenPalette} className="hidden min-h-10 items-center gap-3 border border-[var(--border-default)] bg-[var(--surface-1)] px-3 font-mono text-xs text-[var(--terminal-muted)] motion-safe:transition-colors motion-safe:duration-100 hover:border-[var(--electric-blue)] hover:text-[var(--electric-blue)] focus-visible:ring-2 focus-visible:ring-[var(--electric-blue)] sm:flex" aria-label={language === 'en' ? 'Open command palette' : 'Abrir paleta de comandos'}>
            <span>{copy.commands}</span>
            <kbd className="border border-[var(--border-strong)] bg-[var(--terminal-bg)] px-1.5 py-0.5 text-[var(--terminal-text)]">⌘K</kbd>
          </button>
          <LanguageToggle />
          <button type="button" aria-expanded={isMenuOpen} aria-controls="portfolio-mobile-navigation" onClick={() => setIsMenuOpen((open) => !open)} className="flex min-h-11 min-w-11 items-center justify-center border border-[var(--border-default)] bg-[var(--surface-1)] px-3 font-mono text-xs text-[var(--terminal-text)] motion-safe:transition-colors motion-safe:duration-100 hover:border-[var(--electric-blue)] hover:text-[var(--electric-blue)] focus-visible:ring-2 focus-visible:ring-[var(--electric-blue)] lg:hidden">
            {isMenuOpen ? copy.close : copy.menu}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div id="portfolio-mobile-navigation" className="border-t border-[var(--border-default)] bg-[var(--terminal-bg)] lg:hidden">
          <nav className="mx-auto grid max-w-[1600px] grid-cols-1 px-4 py-3 sm:grid-cols-2 sm:px-6" aria-label={copy.navigation}>
            {copy.items.map((item) => {
              const isActive = activeNavigation === item.id;
              return (
                <button key={item.id} type="button" onClick={() => activateItem(item.id)} aria-current={isActive ? 'page' : undefined} className={`flex min-h-12 items-center justify-between border-b border-[var(--border-default)] px-3 text-left font-mono text-xs tracking-wider motion-safe:transition-colors motion-safe:duration-100 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--electric-blue)] sm:odd:border-r ${isActive ? 'bg-[var(--surface-2)] text-[var(--electric-blue)]' : 'text-[var(--terminal-text)] hover:bg-[var(--surface-1)]'}`}>
                  <span><span className="mr-3 text-[var(--terminal-muted)]">{item.index}</span>{item.label}</span>
                  <span aria-hidden="true">→</span>
                </button>
              );
            })}
            <button type="button" onClick={() => { setIsMenuOpen(false); onOpenPalette(); }} className="flex min-h-12 items-center justify-between border-b border-[var(--electric-blue)] px-3 text-left font-mono text-xs tracking-wider text-[var(--electric-blue)] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--electric-blue)] sm:col-span-2">
              <span>{copy.shortcut} // {copy.commands}</span>
              <kbd className="border border-[var(--electric-blue)] px-2 py-1">⌘K</kbd>
            </button>
          </nav>
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 h-px overflow-hidden" aria-hidden="true">
        <div className="h-full origin-left bg-[var(--electric-blue)]" style={{ transform: `scaleX(${scrollProgress})` }} />
      </div>
    </header>
  );
}
