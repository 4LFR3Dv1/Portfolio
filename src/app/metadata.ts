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
        ? 'Explore computing systems, agentic runtimes, operational infrastructure and verifiable architecture.'
        : 'Explore sistemas computacionais, runtimes agênticos, infraestrutura operacional e arquitetura verificável.',
      canonicalUrl: `${SITE_URL}/architecture`,
    };
  }

  return {
    title: language === 'en'
      ? 'Renan Melo — Computing Systems Engineer'
      : 'Renan Melo — Engenheiro de Sistemas Computacionais',
    description: language === 'en'
      ? 'Computing systems, agent-native runtimes, bare-metal research and applied infrastructure by Renan Melo.'
      : 'Sistemas computacionais, runtimes agent-native, pesquisa bare-metal e infraestrutura aplicada por Renan Melo.',
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
