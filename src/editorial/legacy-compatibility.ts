export const LEGACY_COMPATIBILITY_SCHEMA_VERSION = 'editorial-legacy-compatibility/v0' as const;

export type CompatibilityLanguage = 'en' | 'pt-BR';
export type LegacyLanguage = 'en' | 'pt';
export type LegacyRole = 'service-home' | 'service-architecture' | 'case-study';
export type LegacyDisposition = 'language-negotiated-redirect' | 'preserve-legacy-representation';

export interface LegacyCompatibilityEntry {
  path: string;
  legacyRole: LegacyRole;
  disposition: LegacyDisposition;
  successors: Record<CompatibilityLanguage, string> | null;
  blocker: string | null;
  historicalMeaning: string;
  source: string;
}

export interface LegacyCompatibilityManifest {
  schemaVersion: typeof LEGACY_COMPATIBILITY_SCHEMA_VERSION;
  contractId: string;
  status: 'materialized';
  normative: true;
  baseline: string;
  preconditions: {
    r1_7Complete: true;
    r1_6Complete: true;
    r0EffectiveComplete: true;
    legacyFreezeId: string;
  };
  legacyRuntime: {
    routeCount: number;
    sharedLanguagePaths: true;
    languageStorageKey: 'portfolio-language';
    languageDefault: 'en';
    spaUnknownPathBehavior: 'landing-fallback';
    spaRewriteSource: string;
    spaRewriteDestination: '/index.html';
    deployedSitemapPath: 'public/sitemap.xml';
  };
  admission: {
    source: 'R0.0 + R0.8 + R0-A1';
    legacyExceptionRegistryAllowed: true;
    canonicalSuccessorInferenceAllowed: false;
    undistributedSuccessorRedirectAllowed: false;
    crossLanguageFallbackAllowed: false;
    legacyMeaningRewriteAllowed: false;
    unknownPathFallbackAllowedAfterCutover: false;
  };
  languageNegotiation: {
    input: 'legacy-client-state';
    storageKey: 'portfolio-language';
    mapping: Record<LegacyLanguage, CompatibilityLanguage>;
    defaultWhenMissing: 'en';
    acceptLanguageInferenceAllowed: false;
    redirectStatus: 302;
  };
  entries: LegacyCompatibilityEntry[];
  currentState: {
    legacyRouteCount: number;
    redirectReadyCount: number;
    legacyRepresentationPreservedCount: number;
    unknownFutureResolution: 'unresolved';
    compatibilityRedirectsEnacted: false;
    legacyFallbackRenderingEnacted: false;
    legacyPublicSitemapReplaced: false;
    vercelConfigurationChanged: false;
    publicUiChanged: false;
    deployedRuntimeChanged: false;
  };
  acceptance: {
    allFrozenPublicRoutesCovered: true;
    historicalMeaningRewriteCount: 0;
    canonicalSuccessorInferenceCount: 0;
    undistributedRedirectCount: 0;
    agenticLegacyRebindingCount: 0;
    unknownPathWillResolveToLandingAfterCutover: false;
    legacyLanguageStatePreserved: true;
    r1_8Complete: false;
  };
}

export interface ReconstructedLegacyCompatibility {
  state: 'ready' | 'conflict';
  entries: Map<string, LegacyCompatibilityEntry>;
  errors: string[];
}

export type LegacyCompatibilityDecision =
  | {
      state: 'redirect';
      legacyPath: string;
      language: CompatibilityLanguage;
      targetPath: string;
      status: 302;
    }
  | {
      state: 'legacy-preserved';
      legacyPath: string;
      blocker: string;
      historicalMeaning: string;
    }
  | {
      state: 'blocked';
      legacyPath: string;
      reason: 'successor-not-distributed';
      targetPath: string;
    }
  | {
      state: 'unresolved';
      legacyPath: string;
    };

function normalizePath(path: string): string {
  const withoutQuery = path.split(/[?#]/, 1)[0] ?? '/';
  return withoutQuery.replace(/\/+$/, '') || '/';
}

function unique(values: readonly string[]): boolean {
  return new Set(values).size === values.length;
}

export function reconstructLegacyCompatibility(
  manifest: LegacyCompatibilityManifest,
  distributedCanonicalPaths: ReadonlySet<string>,
): ReconstructedLegacyCompatibility {
  const errors: string[] = [];

  if (manifest.schemaVersion !== LEGACY_COMPATIBILITY_SCHEMA_VERSION) errors.push('compatibility-schema-version');
  if (manifest.status !== 'materialized') errors.push('compatibility-status');
  if (manifest.normative !== true) errors.push('compatibility-normative');
  if (!manifest.admission.legacyExceptionRegistryAllowed) errors.push('legacy-exception-registry-disabled');
  if (manifest.admission.canonicalSuccessorInferenceAllowed) errors.push('canonical-successor-inference-enabled');
  if (manifest.admission.undistributedSuccessorRedirectAllowed) errors.push('undistributed-successor-redirect-enabled');
  if (manifest.admission.crossLanguageFallbackAllowed) errors.push('cross-language-fallback-enabled');
  if (manifest.admission.legacyMeaningRewriteAllowed) errors.push('legacy-meaning-rewrite-enabled');
  if (manifest.admission.unknownPathFallbackAllowedAfterCutover) errors.push('unknown-path-fallback-enabled');

  if (manifest.entries.length !== manifest.legacyRuntime.routeCount) errors.push('legacy-route-count');
  if (!unique(manifest.entries.map((entry) => normalizePath(entry.path)))) errors.push('duplicate-legacy-path');

  const entries = new Map<string, LegacyCompatibilityEntry>();
  let redirectReadyCount = 0;
  let preservedCount = 0;

  for (const entry of manifest.entries) {
    const normalized = normalizePath(entry.path);
    if (normalized !== entry.path) errors.push(`noncanonical-legacy-path:${entry.path}`);

    if (entry.disposition === 'language-negotiated-redirect') {
      if (!entry.successors) {
        errors.push(`redirect-successors-missing:${entry.path}`);
      } else {
        for (const language of ['en', 'pt-BR'] as const) {
          const target = entry.successors[language];
          if (!distributedCanonicalPaths.has(target)) {
            errors.push(`redirect-successor-not-distributed:${entry.path}:${language}:${target}`);
          }
        }
      }
      if (entry.blocker !== null) errors.push(`redirect-has-blocker:${entry.path}`);
      redirectReadyCount += 1;
    } else {
      if (!entry.blocker) errors.push(`preserved-route-blocker-missing:${entry.path}`);
      preservedCount += 1;
    }

    entries.set(normalized, entry);
  }

  if (redirectReadyCount !== manifest.currentState.redirectReadyCount) errors.push('redirect-ready-count');
  if (preservedCount !== manifest.currentState.legacyRepresentationPreservedCount) errors.push('legacy-preserved-count');
  if (manifest.currentState.legacyRouteCount !== manifest.entries.length) errors.push('current-state-route-count');

  const agentic = entries.get('/work/agentic-systems');
  if (!agentic || agentic.disposition !== 'preserve-legacy-representation' || agentic.successors !== null) {
    errors.push('agentic-legacy-rebinding');
  }

  const uniqueErrors = [...new Set(errors)];
  return {
    state: uniqueErrors.length === 0 ? 'ready' : 'conflict',
    entries,
    errors: uniqueErrors,
  };
}

function resolveLanguage(
  hint: LegacyLanguage | null | undefined,
  manifest: LegacyCompatibilityManifest,
): CompatibilityLanguage {
  if (!hint) return manifest.languageNegotiation.defaultWhenMissing;
  return manifest.languageNegotiation.mapping[hint];
}

export function resolveLegacyCompatibility(
  pathname: string,
  languageHint: LegacyLanguage | null | undefined,
  manifest: LegacyCompatibilityManifest,
  runtime: ReconstructedLegacyCompatibility,
  distributedCanonicalPaths: ReadonlySet<string>,
): LegacyCompatibilityDecision {
  const legacyPath = normalizePath(pathname);
  const entry = runtime.entries.get(legacyPath);
  if (!entry) return { state: 'unresolved', legacyPath };

  if (entry.disposition === 'preserve-legacy-representation') {
    return {
      state: 'legacy-preserved',
      legacyPath,
      blocker: entry.blocker ?? 'legacy-preservation-required',
      historicalMeaning: entry.historicalMeaning,
    };
  }

  const language = resolveLanguage(languageHint, manifest);
  const targetPath = entry.successors?.[language];
  if (!targetPath || !distributedCanonicalPaths.has(targetPath)) {
    return {
      state: 'blocked',
      legacyPath,
      reason: 'successor-not-distributed',
      targetPath: targetPath ?? '',
    };
  }

  return {
    state: 'redirect',
    legacyPath,
    language,
    targetPath,
    status: manifest.languageNegotiation.redirectStatus,
  };
}
