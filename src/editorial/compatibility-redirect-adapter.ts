import type { PublicationShellPlan } from './publication-shell-boundary';

export const COMPATIBILITY_REDIRECT_ADAPTER_SCHEMA_VERSION = 'editorial-compatibility-redirect-adapter/v0' as const;
export const COMPATIBILITY_REDIRECT_STATE_SCHEMA_VERSION = 'editorial-compatibility-redirect-state/v0' as const;

export type LegacyStoredLanguage = 'en' | 'pt';
export type CompatibilityLanguage = 'en' | 'pt-BR';

export interface CompatibilityRedirectAdapterManifest {
  schemaVersion: typeof COMPATIBILITY_REDIRECT_ADAPTER_SCHEMA_VERSION;
  contractId: 'PORTFOLIO-R2.4-2026-08-31';
  status: 'materialized';
  normative: true;
  baseline: string;
  preconditions: {
    r1Complete: true;
    r2_0Complete: true;
    r2_1Complete: true;
    r2_2Complete: true;
    r2_3Complete: true;
    cutoverReady: false;
    cutoverAuthorized: false;
  };
  negotiation: {
    storageKey: 'portfolio-language';
    acceptedStoredValues: string[];
    defaultWhenMissing: 'en';
    serverCanReadLocalStorage: false;
    clientHandshakeRequired: true;
    acceptLanguageInferenceAllowed: false;
    navigatorLanguageInferenceAllowed: false;
    requestLanguageParameter: 'lang';
    requestSourceParameter: 'from';
  };
  http: {
    endpoint: '/_compat/redirect';
    redirectStatus: 302;
    blockedStatus: 503;
    invalidRequestStatus: 400;
    unknownPathStatus: 404;
    cacheControl: 'no-store';
  };
  expected: {
    redirectCount: 4;
    distributedTargetCount: 8;
    handshakePageCount: 4;
  };
  currentState: {
    redirectAdapterMaterialized: true;
    handshakePagesMaterialized: true;
    physicalHttpWitnessed: false;
    productionAdapterActivated: false;
    vercelConfigurationChanged: false;
    rootBuildScriptChanged: false;
    publicUiChanged: false;
    deployedRuntimeChanged: false;
  };
  acceptance: {
    allRedirectTargetsDistributed: true;
    directServerLanguageInferenceCount: 0;
    crossLanguageFallbackCount: 0;
    successorAbsenceRedirectCount: 0;
    deploymentMutationCount: 0;
    r2_4Complete: false;
    nextRequiredCut: 'R2.5 — Static Runtime Commissioning';
  };
}

export interface CompatibilityRedirectEntry {
  legacyPath: string;
  status: 302;
  successors: Record<CompatibilityLanguage, string>;
}

export interface CompatibilityRedirectState {
  schemaVersion: typeof COMPATIBILITY_REDIRECT_STATE_SCHEMA_VERSION;
  sourceContractId: string;
  language: {
    storageKey: 'portfolio-language';
    acceptedStoredValues: readonly ['en', 'pt'];
    defaultWhenMissing: 'en';
    acceptLanguageInferenceAllowed: false;
    navigatorLanguageInferenceAllowed: false;
  };
  http: {
    endpoint: '/_compat/redirect';
    requestLanguageParameter: 'lang';
    requestSourceParameter: 'from';
    redirectStatus: 302;
    blockedStatus: 503;
    invalidRequestStatus: 400;
    unknownPathStatus: 404;
    cacheControl: 'no-store';
  };
  entries: CompatibilityRedirectEntry[];
}

export interface ReconstructedCompatibilityRedirectAdapter {
  state: 'ready' | 'conflict';
  adapter: CompatibilityRedirectState | null;
  errors: string[];
}

export type CompatibilityRedirectDecision =
  | {
      state: 'redirect';
      legacyPath: string;
      language: CompatibilityLanguage;
      location: string;
      status: 302;
    }
  | {
      state: 'blocked';
      legacyPath: string;
      language: CompatibilityLanguage;
      targetPath: string;
      reason: 'successor-not-distributed';
      status: 503;
    }
  | {
      state: 'invalid-request';
      legacyPath: string;
      reason: 'explicit-language-required' | 'invalid-language';
      status: 400;
    }
  | {
      state: 'unresolved';
      legacyPath: string;
      status: 404;
    };

function unique(values: readonly string[]): boolean {
  return new Set(values).size === values.length;
}

function normalizePath(path: string): string {
  const clean = path.split(/[?#]/, 1)[0] ?? '/';
  return clean.replace(/\/+$/, '') || '/';
}

export function reconstructCompatibilityRedirectAdapter(
  manifest: CompatibilityRedirectAdapterManifest,
  shellPlan: PublicationShellPlan,
  distributedCanonicalPaths: ReadonlySet<string>,
): ReconstructedCompatibilityRedirectAdapter {
  const errors: string[] = [];

  if (manifest.schemaVersion !== COMPATIBILITY_REDIRECT_ADAPTER_SCHEMA_VERSION) errors.push('redirect-adapter-schema');
  if (manifest.status !== 'materialized') errors.push('redirect-adapter-status');
  if (manifest.normative !== true) errors.push('redirect-adapter-normative');
  if (manifest.negotiation.storageKey !== 'portfolio-language') errors.push('redirect-adapter-storage-key');
  if (
    manifest.negotiation.acceptedStoredValues.length !== 2
    || manifest.negotiation.acceptedStoredValues[0] !== 'en'
    || manifest.negotiation.acceptedStoredValues[1] !== 'pt'
  ) {
    errors.push('redirect-adapter-language-values');
  }
  if (manifest.negotiation.serverCanReadLocalStorage) errors.push('redirect-adapter-server-local-storage-read');
  if (!manifest.negotiation.clientHandshakeRequired) errors.push('redirect-adapter-client-handshake-disabled');
  if (manifest.negotiation.acceptLanguageInferenceAllowed) errors.push('redirect-adapter-accept-language-inference');
  if (manifest.negotiation.navigatorLanguageInferenceAllowed) errors.push('redirect-adapter-navigator-language-inference');
  if (manifest.http.redirectStatus !== 302) errors.push('redirect-adapter-status-not-302');
  if (manifest.http.blockedStatus !== 503) errors.push('redirect-adapter-blocked-status');

  if (shellPlan.redirects.length !== manifest.expected.redirectCount) {
    errors.push(`redirect-adapter-count:${shellPlan.redirects.length}`);
  }

  const entries: CompatibilityRedirectEntry[] = shellPlan.redirects.map((redirect) => ({
    legacyPath: normalizePath(redirect.path),
    status: redirect.status,
    successors: {
      en: redirect.successors.en,
      'pt-BR': redirect.successors['pt-BR'],
    },
  }));

  if (!unique(entries.map((entry) => entry.legacyPath))) errors.push('redirect-adapter-duplicate-legacy-path');
  const allTargets = entries.flatMap((entry) => [entry.successors.en, entry.successors['pt-BR']]);
  if (!unique(allTargets)) errors.push('redirect-adapter-duplicate-target');
  if (allTargets.length !== manifest.expected.distributedTargetCount) {
    errors.push(`redirect-adapter-target-count:${allTargets.length}`);
  }

  for (const entry of entries) {
    if (entry.status !== 302) errors.push(`redirect-adapter-entry-status:${entry.legacyPath}`);
    for (const target of Object.values(entry.successors)) {
      if (!distributedCanonicalPaths.has(target)) {
        errors.push(`redirect-adapter-target-not-distributed:${entry.legacyPath}:${target}`);
      }
    }
  }

  for (const preserved of shellPlan.legacyPreservedPages) {
    if (entries.some((entry) => entry.legacyPath === preserved.path)) {
      errors.push(`redirect-adapter-preserved-collision:${preserved.path}`);
    }
  }

  const uniqueErrors = [...new Set(errors)];
  if (uniqueErrors.length > 0) return { state: 'conflict', adapter: null, errors: uniqueErrors };

  entries.sort((left, right) => left.legacyPath.localeCompare(right.legacyPath));
  return {
    state: 'ready',
    adapter: {
      schemaVersion: COMPATIBILITY_REDIRECT_STATE_SCHEMA_VERSION,
      sourceContractId: manifest.contractId,
      language: {
        storageKey: manifest.negotiation.storageKey,
        acceptedStoredValues: ['en', 'pt'],
        defaultWhenMissing: manifest.negotiation.defaultWhenMissing,
        acceptLanguageInferenceAllowed: false,
        navigatorLanguageInferenceAllowed: false,
      },
      http: {
        endpoint: manifest.http.endpoint,
        requestLanguageParameter: manifest.negotiation.requestLanguageParameter,
        requestSourceParameter: manifest.negotiation.requestSourceParameter,
        redirectStatus: manifest.http.redirectStatus,
        blockedStatus: manifest.http.blockedStatus,
        invalidRequestStatus: manifest.http.invalidRequestStatus,
        unknownPathStatus: manifest.http.unknownPathStatus,
        cacheControl: manifest.http.cacheControl,
      },
      entries,
    },
    errors: [],
  };
}

export function negotiateLegacyClientLanguage(storedValue: string | null | undefined): LegacyStoredLanguage {
  return storedValue === 'pt' ? 'pt' : 'en';
}

export function compatibilityLanguageFromLegacy(value: LegacyStoredLanguage): CompatibilityLanguage {
  return value === 'pt' ? 'pt-BR' : 'en';
}

export function buildCompatibilityHandshakeLocation(
  adapter: CompatibilityRedirectState,
  legacyPath: string,
  storedValue: string | null | undefined,
): string {
  const normalized = normalizePath(legacyPath);
  const language = negotiateLegacyClientLanguage(storedValue);
  const params = new URLSearchParams({
    [adapter.http.requestSourceParameter]: normalized,
    [adapter.http.requestLanguageParameter]: language,
  });
  return `${adapter.http.endpoint}?${params.toString()}`;
}

export function resolveCompatibilityRedirectRequest(
  adapter: CompatibilityRedirectState,
  legacyPath: string,
  explicitLegacyLanguage: string | null | undefined,
  distributedCanonicalPaths: ReadonlySet<string>,
): CompatibilityRedirectDecision {
  const normalized = normalizePath(legacyPath);
  const entry = adapter.entries.find((candidate) => candidate.legacyPath === normalized);
  if (!entry) return { state: 'unresolved', legacyPath: normalized, status: adapter.http.unknownPathStatus };

  if (explicitLegacyLanguage === null || explicitLegacyLanguage === undefined || explicitLegacyLanguage === '') {
    return {
      state: 'invalid-request',
      legacyPath: normalized,
      reason: 'explicit-language-required',
      status: adapter.http.invalidRequestStatus,
    };
  }
  if (explicitLegacyLanguage !== 'en' && explicitLegacyLanguage !== 'pt') {
    return {
      state: 'invalid-request',
      legacyPath: normalized,
      reason: 'invalid-language',
      status: adapter.http.invalidRequestStatus,
    };
  }

  const language = compatibilityLanguageFromLegacy(explicitLegacyLanguage);
  const targetPath = entry.successors[language];
  if (!distributedCanonicalPaths.has(targetPath)) {
    return {
      state: 'blocked',
      legacyPath: normalized,
      language,
      targetPath,
      reason: 'successor-not-distributed',
      status: adapter.http.blockedStatus,
    };
  }

  return {
    state: 'redirect',
    legacyPath: normalized,
    language,
    location: targetPath,
    status: adapter.http.redirectStatus,
  };
}

export function redirectDecisionToResponse(
  adapter: CompatibilityRedirectState,
  decision: CompatibilityRedirectDecision,
): Response {
  const headers = new Headers({ 'Cache-Control': adapter.http.cacheControl });
  if (decision.state === 'redirect') {
    headers.set('Location', decision.location);
    return new Response(null, { status: decision.status, headers });
  }
  return new Response(decision.state, { status: decision.status, headers });
}
