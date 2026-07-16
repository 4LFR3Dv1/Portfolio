import { Suspense, lazy, useEffect, useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { AboutSection } from '@/app/components/about-section';
import { CommandPalette } from '@/app/components/command-palette';
import { ContactSection } from '@/app/components/contact-section';
import { EvidenceRoom } from '@/app/components/evidence-room';
import { HeroSection } from '@/app/components/hero-section';
import { PublicationsSection } from '@/app/components/publications-section';
import { SelectedWorkSection } from '@/app/components/selected-work-section';
import { TechTicker } from '@/app/components/tech-ticker';
import { TerminalTopBar } from '@/app/components/terminal-topbar';
import { parseRoute, routePath, type PortfolioRoute } from '@/app/routing';

const ArchitectureExplorer = lazy(() =>
  import('@/app/components/architecture-explorer').then((module) => ({ default: module.ArchitectureExplorer })),
);
const CaseStudyTemplate = lazy(() =>
  import('@/app/components/case-study-template').then((module) => ({ default: module.CaseStudyTemplate })),
);
const SystemArchitecture = lazy(() =>
  import('@/app/components/system-architecture').then((module) => ({ default: module.SystemArchitecture })),
);

export default function App() {
  const [route, setRoute] = useState<PortfolioRoute>(() => parseRoute(window.location.pathname));
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);

  useEffect(() => {
    const handlePopState = () => setRoute(parseRoute(window.location.pathname));
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setIsPaletteOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const title = route.view === 'case-study'
      ? `${route.projectId} — Renan Melo`
      : route.view === 'architecture'
        ? 'Architecture — Renan Melo'
        : 'Renan Melo — Blockchain & Agentic Systems Engineer';
    document.title = title;
  }, [route]);

  const navigate = (nextRoute: PortfolioRoute) => {
    window.history.pushState({}, '', routePath(nextRoute));
    setRoute(nextRoute);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToSection = (sectionId: string) => {
    if (route.view !== 'landing') {
      window.history.pushState({}, '', `/#${sectionId}`);
      setRoute({ view: 'landing' });
      window.setTimeout(() => document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' }), 50);
      return;
    }
    window.history.replaceState({}, '', `/#${sectionId}`);
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handlePaletteNavigate = (section: string) => {
    if (section === 'home') {
      window.history.pushState({}, '', '/');
      setRoute({ view: 'landing' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const sections: Record<string, string> = {
      work: 'selected-work',
      about: 'about',
      contact: 'contact',
      evidence: 'evidence',
      publications: 'publications',
    };
    if (sections[section]) navigateToSection(sections[section]);
  };

  return (
    <div className="min-h-screen bg-background">
      <Analytics />
      <TerminalTopBar />
      <CommandPalette
        isOpen={isPaletteOpen}
        onClose={() => setIsPaletteOpen(false)}
        onNavigate={handlePaletteNavigate}
        onCaseStudy={(projectId) => navigate({ view: 'case-study', projectId })}
        onArchitecture={() => navigate({ view: 'architecture' })}
      />

      <Suspense fallback={<RouteFallback />}>
        {route.view === 'landing' && (
          <>
            <HeroSection
              onViewProjects={() => navigateToSection('selected-work')}
              onArchitecture={() => navigate({ view: 'architecture' })}
              onContact={() => navigateToSection('contact')}
            />
            <TechTicker />
            <SelectedWorkSection
              onCaseStudy={(projectId) => navigate({ view: 'case-study', projectId })}
              onOpen={(url) => window.open(url, '_blank', 'noopener,noreferrer')}
              onEvidence={() => navigateToSection('evidence')}
            />
            <EvidenceRoom />
            <PublicationsSection onCaseStudy={(projectId) => navigate({ view: 'case-study', projectId })} />
            <SystemArchitecture />
            <AboutSection />
            <ContactSection />
          </>
        )}

        {route.view === 'case-study' && (
          <CaseStudyTemplate
            projectId={route.projectId}
            onBack={() => navigate({ view: 'landing' })}
            onArchitecture={() => navigate({ view: 'architecture' })}
          />
        )}

        {route.view === 'architecture' && (
          <ArchitectureExplorer onBack={() => navigate({ view: 'landing' })} />
        )}
      </Suspense>

      <button
        type="button"
        aria-label="Open command palette"
        onClick={() => setIsPaletteOpen(true)}
        className="fixed bottom-6 right-6 z-30 w-14 h-14 sm:w-auto sm:h-auto sm:px-4 sm:py-2 bg-[var(--electric-blue)] sm:bg-[var(--surface-2)] text-[#0a0a0f] sm:text-[var(--terminal-muted)] border border-[var(--electric-blue)] sm:border-[var(--border-default)] font-mono text-sm font-bold shadow-[0_0_30px_rgba(0,217,255,0.35)]"
      >
        <span className="sm:hidden" aria-hidden="true">⌘</span>
        <span className="hidden sm:inline">⌘K COMMANDS</span>
      </button>
    </div>
  );
}

function RouteFallback() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center font-mono text-sm" style={{ color: 'var(--terminal-muted)' }}>
      LOADING INTERFACE…
    </div>
  );
}
