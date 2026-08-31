import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { AboutSection } from '@/app/components/about-section';
import { CommandPalette } from '@/app/components/command-palette';
import { ContactSection } from '@/app/components/contact-section';
import { EditorialSection } from '@/app/components/editorial-section';
import { EvidenceRoom } from '@/app/components/evidence-room';
import { HeroSection } from '@/app/components/hero-section';
import { PublicationsSection } from '@/app/components/publications-section';
import { SelectedWorkSection } from '@/app/components/selected-work-section';
import { TechTicker } from '@/app/components/tech-ticker';
import { TerminalTopBar } from '@/app/components/terminal-topbar';
import { useLanguage } from '@/app/context/language-context';
import { applyMetadata, metadataForRoute } from '@/app/metadata';
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
  const { language } = useLanguage();
  const [route, setRoute] = useState<PortfolioRoute>(() => parseRoute(window.location.pathname));
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const paletteOriginRef = useRef<HTMLElement | null>(null);

  const openPalette = () => {
    paletteOriginRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setIsPaletteOpen(true);
  };

  const closePalette = () => {
    setIsPaletteOpen(false);
    window.requestAnimationFrame(() => paletteOriginRef.current?.focus());
  };

  useEffect(() => {
    const handlePopState = () => setRoute(parseRoute(window.location.pathname));
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        openPalette();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    applyMetadata(metadataForRoute(route, language));
  }, [language, route]);

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
    if (section === 'editorial') {
      window.location.assign('/editorial/');
      return;
    }
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
      <TerminalTopBar
        route={route}
        onNavigate={handlePaletteNavigate}
        onArchitecture={() => navigate({ view: 'architecture' })}
        onEditorial={() => window.location.assign('/editorial/')}
        onOpenPalette={openPalette}
      />
      <CommandPalette
        isOpen={isPaletteOpen}
        onClose={closePalette}
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
            <EditorialSection />
            <EvidenceRoom />
            <PublicationsSection onCaseStudy={(projectId) => navigate({ view: 'case-study', projectId })} />
            <SystemArchitecture onOpen={() => navigate({ view: 'architecture' })} />
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
