import type { DistributionBundle } from './distribution-runtime';
import type {
  LegacyCompatibilityManifest,
  LegacyCompatibilityEntry,
} from './legacy-compatibility';

export const PUBLICATION_SHELL_BOUNDARY_SCHEMA_VERSION = 'editorial-publication-shell-boundary/v0' as const;

export interface PublicationShellBoundaryManifest {
  schemaVersion: typeof PUBLICATION_SHELL_BOUNDARY_SCHEMA_VERSION;
  contractId: string;
  status: 'materialized';
  normative: true;
  baseline: string;
  preconditions: {
    r1Complete: true;
    foundationReady: true;
    cutoverReady: false;
    cutoverAuthorized: false;
  };
  runtime: {
    targetFramework: 'astro-static';
    reactIslandsAllowed: true;
    rendererAuthority: 'consumer-only';
    canonicalPageSource: 'r1.7-distribution-bundle';
    legacyCompatibilitySource: 'r1.8-legacy-compatibility';
    unknownRouteOutcome: '404';
  };
  admission: {
    manualPageDiscoveryAllowed: false;
    directRegistryReadAllowedByRenderer: false;
    directEvidenceReadAllowedByRenderer: false;
    directGovernanceReadAllowedByRenderer: false;
    runtimeSemanticRepairAllowed: false;
    runtimeSanitizationAllowed: false;
    languageFallbackAllowed: false;
    legacyMeaningRewriteAllowed: false;
  };
  expectedPlan: {
    canonicalStaticPageCount: number;
    legacyPreservedPageCount: number;
    compatibilityRedirectCount: number;
    distributionArtifactCount: number;
    rssArtifactCount: number;
  };
  currentState: {
    publicationShellBoundaryMaterialized: true;
    astroDependencyMaterialized: false;
    astroBuildEnacted: false;
    staticHtmlRenderingEnacted: false;
    compatibilityRedirectsEnacted: false;
    legacyFallbackRendererEnacted: false;
    editorialSitemapDeployed: false;
    vercelCutoverEnacted: false;
    publicUiChanged: false;
    deployedRuntimeChanged: false;
  };
  acceptance: {
    r1AcceptedStateIsOnlySemanticInput: true;
    canonicalPagesDerivedFromDistributionOnly: true;
    legacyPagesDerivedFromCompatibilityOnly: true;
    redirectTargetsRequireDistributedCanonicalPage: true;
    unknownRouteBecomes404: true;
    rendererCanMintRecord: false;
    rendererCanChangeDisclosure: false;
    rendererCanInferLanguage: false;
    r2_0Complete: false;
    nextRequiredCut: 'R2.1 — Astro Shell Materialization & Editorial Renderer';
  };
}

export interface CanonicalShellPage {
  kind: 'canonical-static-page';
  path: string;
  canonicalUrl: string;
  sourceIdentityKey: string;
  language: 'en' | 'pt-BR';
}

export interface LegacyPreservedShellPage {
  kind: 'legacy-preserved-page';
  path: string;
  blocker: string;
  historicalMeaning: string;
}

export interface CompatibilityRedirectSpec {
  kind: 'language-negotiated-redirect';
  path: string;
  status: 302;
  successors: {
    en: string;
    'pt-BR': string;
  };
}

export type DistributionArtifactSpec =
  | { kind: 'sitemap'; path: '/sitemap.xml' }
  | { kind: 'rss'; path: '/en/rss.xml'; language: 'en' }
  | { kind: 'rss'; path: '/pt-br/rss.xml'; language: 'pt-BR' }
  | { kind: 'search-index'; path: '/search-index.json' };

export interface PublicationShellPlan {
  schemaVersion: 'editorial-publication-shell-plan/v0';
  framework: 'astro-static';
  canonicalPages: CanonicalShellPage[];
  legacyPreservedPages: LegacyPreservedShellPage[];
  redirects: CompatibilityRedirectSpec[];
  artifacts: DistributionArtifactSpec[];
  unknownRouteOutcome: '404';
}

export interface ReconstructedPublicationShellBoundary {
  state: 'ready' | 'conflict';
  plan: PublicationShellPlan | null;
  errors: string[];
}

function unique(values: readonly string[]): boolean {
  return new Set(values).size === values.length;
}

function preservedEntry(entry: LegacyCompatibilityEntry): LegacyPreservedShellPage | null {
  if (entry.disposition !== 'preserve-legacy-representation') return null;
  if (!entry.blocker) return null;
  return {
    kind: 'legacy-preserved-page',
    path: entry.path,
    blocker: entry.blocker,
    historicalMeaning: entry.historicalMeaning,
  };
}

function redirectEntry(entry: LegacyCompatibilityEntry): CompatibilityRedirectSpec | null {
  if (entry.disposition !== 'language-negotiated-redirect' || !entry.successors) return null;
  return {
    kind: 'language-negotiated-redirect',
    path: entry.path,
    status: 302,
    successors: {
      en: entry.successors.en,
      'pt-BR': entry.successors['pt-BR'],
    },
  };
}

export function reconstructPublicationShellBoundary(
  manifest: PublicationShellBoundaryManifest,
  distribution: DistributionBundle,
  compatibility: LegacyCompatibilityManifest,
): ReconstructedPublicationShellBoundary {
  const errors: string[] = [];

  if (manifest.schemaVersion !== PUBLICATION_SHELL_BOUNDARY_SCHEMA_VERSION) errors.push('shell-schema-version');
  if (manifest.status !== 'materialized') errors.push('shell-status');
  if (manifest.normative !== true) errors.push('shell-normative');
  if (manifest.runtime.targetFramework !== 'astro-static') errors.push('shell-framework');
  if (manifest.runtime.rendererAuthority !== 'consumer-only') errors.push('renderer-authority');
  if (manifest.runtime.unknownRouteOutcome !== '404') errors.push('unknown-route-outcome');

  if (manifest.admission.manualPageDiscoveryAllowed) errors.push('manual-page-discovery-enabled');
  if (manifest.admission.directRegistryReadAllowedByRenderer) errors.push('renderer-registry-read-enabled');
  if (manifest.admission.directEvidenceReadAllowedByRenderer) errors.push('renderer-evidence-read-enabled');
  if (manifest.admission.directGovernanceReadAllowedByRenderer) errors.push('renderer-governance-read-enabled');
  if (manifest.admission.runtimeSemanticRepairAllowed) errors.push('runtime-semantic-repair-enabled');
  if (manifest.admission.runtimeSanitizationAllowed) errors.push('runtime-sanitization-enabled');
  if (manifest.admission.languageFallbackAllowed) errors.push('language-fallback-enabled');
  if (manifest.admission.legacyMeaningRewriteAllowed) errors.push('legacy-meaning-rewrite-enabled');

  const canonicalPaths = distribution.pages.map((page) => page.canonicalPath);
  if (!unique(canonicalPaths)) errors.push('duplicate-canonical-page-path');

  const canonicalPages: CanonicalShellPage[] = distribution.pages.map((page) => ({
    kind: 'canonical-static-page',
    path: page.canonicalPath,
    canonicalUrl: page.canonicalUrl,
    sourceIdentityKey: page.identityKey,
    language: page.language,
  }));

  const legacyPreservedPages = compatibility.entries
    .map(preservedEntry)
    .filter((entry): entry is LegacyPreservedShellPage => entry !== null);
  const redirects = compatibility.entries
    .map(redirectEntry)
    .filter((entry): entry is CompatibilityRedirectSpec => entry !== null);

  const distributedPaths = new Set(canonicalPaths);
  for (const redirect of redirects) {
    for (const target of Object.values(redirect.successors)) {
      if (!distributedPaths.has(target)) {
        errors.push(`redirect-target-not-distributed:${redirect.path}:${target}`);
      }
    }
  }

  const legacyPaths = [
    ...legacyPreservedPages.map((entry) => entry.path),
    ...redirects.map((entry) => entry.path),
  ];
  if (!unique(legacyPaths)) errors.push('duplicate-legacy-shell-path');
  for (const path of legacyPreservedPages.map((entry) => entry.path)) {
    if (distributedPaths.has(path)) errors.push(`legacy-canonical-path-collision:${path}`);
  }

  const artifacts: DistributionArtifactSpec[] = [
    { kind: 'sitemap', path: '/sitemap.xml' },
    { kind: 'rss', path: '/en/rss.xml', language: 'en' },
    { kind: 'rss', path: '/pt-br/rss.xml', language: 'pt-BR' },
    { kind: 'search-index', path: '/search-index.json' },
  ];

  if (canonicalPages.length !== manifest.expectedPlan.canonicalStaticPageCount) {
    errors.push(`canonical-page-count:${canonicalPages.length}`);
  }
  if (legacyPreservedPages.length !== manifest.expectedPlan.legacyPreservedPageCount) {
    errors.push(`legacy-preserved-page-count:${legacyPreservedPages.length}`);
  }
  if (redirects.length !== manifest.expectedPlan.compatibilityRedirectCount) {
    errors.push(`compatibility-redirect-count:${redirects.length}`);
  }
  if (artifacts.length !== manifest.expectedPlan.distributionArtifactCount) {
    errors.push(`distribution-artifact-count:${artifacts.length}`);
  }
  if (artifacts.filter((artifact) => artifact.kind === 'rss').length !== manifest.expectedPlan.rssArtifactCount) {
    errors.push('rss-artifact-count');
  }

  const uniqueErrors = [...new Set(errors)];
  if (uniqueErrors.length > 0) {
    return { state: 'conflict', plan: null, errors: uniqueErrors };
  }

  return {
    state: 'ready',
    plan: {
      schemaVersion: 'editorial-publication-shell-plan/v0',
      framework: 'astro-static',
      canonicalPages,
      legacyPreservedPages,
      redirects,
      artifacts,
      unknownRouteOutcome: '404',
    },
    errors: [],
  };
}
