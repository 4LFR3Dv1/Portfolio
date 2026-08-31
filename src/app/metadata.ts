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
        ? 'A readable map of the recurring questions and design choices behind Renan Melo’s software systems.'
        : 'Um mapa legível das perguntas e escolhas de design que se repetem nos sistemas de software de Renan Melo.',
      canonicalUrl: `${SITE_URL}/architecture`,
    };
  }

  return {
    title: language === 'en'
      ? 'Renan Melo — Software, Product & Computing'
      : 'Renan Melo — Software, Produto e Computação',
    description: language === 'en'
      ? 'Software, products and experiments by Renan Melo, plus essays on technology, computing and the questions that appear while building.'
      : 'Software, produtos e experimentos de Renan Melo, além de ensaios sobre tecnologia, computação e as perguntas que aparecem enquanto constrói.',
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
