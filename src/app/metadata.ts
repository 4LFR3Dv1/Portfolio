import type { Language } from './context/language-context';
import { getProject } from './data/projects';
import { routePath, type PortfolioRoute } from './routing';

const SITE_URL = 'https://renan.snelabs.space';

export interface PortfolioMetadata {
  title: string;
  description: string;
  canonicalUrl: string;
}

export function metadataForRoute(route: PortfolioRoute, language: Language): PortfolioMetadata {
  if (route.view === 'case-study') {
    const project = getProject(route.projectId);
    if (project) {
      return {
        title: project.seo?.title[language] ?? `${project.title} — Renan Melo`,
        description: project.seo?.description[language] ?? project.subtitle[language],
        canonicalUrl: `${SITE_URL}${routePath(route)}`,
      };
    }
  }

  if (route.view === 'architecture') {
    return {
      title: language === 'en' ? 'Architecture — Renan Melo' : 'Arquitetura — Renan Melo',
      description: language === 'en'
        ? 'Explore system architecture across governed settlement, agent operations, real-time products, transactional workflows and verifiable evidence.'
        : 'Explore arquiteturas de settlement governado, operação agêntica, produtos em tempo real, fluxos transacionais e evidência verificável.',
      canonicalUrl: `${SITE_URL}/architecture`,
    };
  }

  return {
    title: language === 'en'
      ? 'Renan Melo — Blockchain & Agentic Systems Engineer'
      : 'Renan Melo — Engenheiro de Blockchain e Sistemas Agênticos',
    description: language === 'en'
      ? 'Blockchain and agentic systems engineer building financial products, real-time runtimes, agent platforms and developer tooling.'
      : 'Engenheiro de blockchain e sistemas agênticos construindo produtos financeiros, runtimes em tempo real, plataformas de agentes e ferramentas para desenvolvedores.',
    canonicalUrl: `${SITE_URL}/`,
  };
}

export function applyMetadata(metadata: PortfolioMetadata): void {
  document.title = metadata.title;
  setMetaContent('meta[name="description"]', metadata.description);
  setMetaContent('meta[property="og:title"]', metadata.title);
  setMetaContent('meta[property="og:description"]', metadata.description);
  setMetaContent('meta[property="og:url"]', metadata.canonicalUrl);
  setMetaContent('meta[name="twitter:title"]', metadata.title);
  setMetaContent('meta[name="twitter:description"]', metadata.description);

  const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (canonical) canonical.href = metadata.canonicalUrl;
}

function setMetaContent(selector: string, content: string): void {
  const element = document.querySelector<HTMLMetaElement>(selector);
  if (element) element.content = content;
}
