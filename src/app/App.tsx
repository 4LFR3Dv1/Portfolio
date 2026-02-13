import React, { useState, useEffect } from 'react';
import { TerminalTopBar } from '@/app/components/terminal-topbar';
import { HeroSection } from '@/app/components/hero-section';
import { TechTicker } from '@/app/components/tech-ticker';
import { SelectedWorkSection } from '@/app/components/selected-work-section';
import { AboutSection } from '@/app/components/about-section';
import { ContactSection } from '@/app/components/contact-section';
import { ArchitectureExplorer } from '@/app/components/architecture-explorer';
import { CaseStudyTemplate } from '@/app/components/case-study-template';
import { EvidenceRoom } from '@/app/components/evidence-room';
import { PublicationsSection } from '@/app/components/publications-section';
import { SystemArchitecture } from '@/app/components/system-architecture';
import { CommandPalette } from '@/app/components/command-palette';

export default function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'case-study' | 'architecture'>('landing');
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);

  // Set page title
  useEffect(() => {
    document.title = 'Renan Melo // Portfolio // Systems • Product • Web3';
  }, []);

  // Command Palette keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsPaletteOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleViewProjects = () => {
    if (currentView !== 'landing') {
      setCurrentView('landing');
      setTimeout(() => {
        document.getElementById('selected-work')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById('selected-work')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCaseStudy = (projectId: string) => {
    setSelectedProject(projectId);
    setCurrentView('case-study');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDemo = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleContact = () => {
    if (currentView !== 'landing') {
      setCurrentView('landing');
      setTimeout(() => {
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleEvidence = () => {
    if (currentView !== 'landing') {
      setCurrentView('landing');
      setTimeout(() => {
        document.getElementById('evidence')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById('evidence')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleArchitecture = () => {
    setCurrentView('architecture');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToLanding = () => {
    setCurrentView('landing');
    setSelectedProject(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePaletteNavigate = (section: string) => {
    if (currentView !== 'landing') {
      setCurrentView('landing');
    }

    setTimeout(() => {
      if (section === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (section === 'work') {
        document.getElementById('selected-work')?.scrollIntoView({ behavior: 'smooth' });
      } else if (section === 'about') {
        document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
      } else if (section === 'contact') {
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
      } else if (section === 'evidence') {
        document.getElementById('evidence')?.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-background">
      <TerminalTopBar />

      {/* Command Palette */}
      <CommandPalette
        isOpen={isPaletteOpen}
        onClose={() => setIsPaletteOpen(false)}
        onNavigate={handlePaletteNavigate}
        onCaseStudy={handleCaseStudy}
        onArchitecture={handleArchitecture}
      />

      {/* Landing View */}
      {currentView === 'landing' && (
        <>
          <HeroSection
            onViewProjects={handleViewProjects}
            onArchitecture={handleArchitecture}
            onContact={handleContact}
          />

          <TechTicker />

          <SelectedWorkSection
            onCaseStudy={handleCaseStudy}
            onDemo={handleDemo}
            onEvidence={handleEvidence}
          />

          <EvidenceRoom />

          <PublicationsSection onCaseStudy={handleCaseStudy} />

          <SystemArchitecture />

          <AboutSection />

          <ContactSection />
        </>
      )}

      {/* Case Study View */}
      {currentView === 'case-study' && selectedProject && (
        <CaseStudyTemplate
          projectId={selectedProject}
          onBack={handleBackToLanding}
        />
      )}

      {/* Architecture Explorer View */}
      {currentView === 'architecture' && (
        <ArchitectureExplorer onBack={handleBackToLanding} />
      )}

      {/* Floating Command Palette hint */}
      <div className="fixed bottom-6 right-6 z-30 hidden sm:block">
        <button
          onClick={() => setIsPaletteOpen(true)}
          className="px-4 py-2 bg-[var(--surface-2)] border border-[var(--border-default)] font-mono text-xs flex items-center gap-2 hover:border-[var(--electric-blue)] hover:shadow-[0_0_20px_rgba(0,217,255,0.2)] transition-all"
          style={{ color: 'var(--terminal-muted)' }}
        >
          <span>Press</span>
          <kbd className="px-2 py-1 bg-[var(--surface-1)] border border-[var(--border-default)]" style={{ color: 'var(--electric-blue)' }}>
            ⌘K
          </kbd>
          <span>for commands</span>
        </button>
      </div>

      {/* Mobile Command Palette button */}
      <button
        onClick={() => setIsPaletteOpen(true)}
        className="sm:hidden fixed bottom-6 right-6 z-30 w-14 h-14 bg-[var(--electric-blue)] text-[#0a0a0f] border-2 border-[var(--electric-blue)] flex items-center justify-center font-mono text-lg font-bold shadow-[0_0_30px_rgba(0,217,255,0.5)] hover:shadow-[0_0_40px_rgba(0,217,255,0.7)] transition-all"
      >
        ⌘
      </button>
    </div>
  );
}