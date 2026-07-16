export type PortfolioRoute =
  | { view: 'landing' }
  | { view: 'architecture' }
  | { view: 'case-study'; projectId: string };

export function parseRoute(pathname: string): PortfolioRoute {
  const normalized = pathname.replace(/\/+$/, '') || '/';
  if (normalized === '/architecture') return { view: 'architecture' };
  const match = normalized.match(/^\/work\/([a-z0-9-]+)$/i);
  if (match) return { view: 'case-study', projectId: match[1] };
  return { view: 'landing' };
}

export function routePath(route: PortfolioRoute): string {
  if (route.view === 'architecture') return '/architecture';
  if (route.view === 'case-study') return `/work/${route.projectId}`;
  return '/';
}
