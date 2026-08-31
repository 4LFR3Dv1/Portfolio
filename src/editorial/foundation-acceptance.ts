export const FOUNDATION_ACCEPTANCE_SCHEMA_VERSION = 'editorial-foundation-acceptance/v0' as const;

export interface FoundationAcceptanceManifest {
  schemaVersion: typeof FOUNDATION_ACCEPTANCE_SCHEMA_VERSION;
  contractId: string;
  status: 'materialized';
  normative: true;
  baseline: string;
  preconditions: {
    r0EffectiveComplete: true;
    r1PreComplete: true;
    r1_0Complete: true;
    r1_1Complete: true;
    r1_2Complete: true;
    r1_3Complete: true;
    r1_4Complete: true;
    r1_5Complete: true;
    r1_6Complete: true;
    r1_7Complete: true;
    r1_8Complete: true;
  };
  boundary: {
    foundationAcceptanceOnly: true;
    publicCutoverAuthorizationIncluded: false;
    deploymentMutationAllowed: false;
    ontologyMutationAllowed: false;
    semanticRepairAllowed: false;
  };
  expectedState: {
    completionSealCount: number;
    systemRecordBirthCount: number;
    governanceRecordBirthCount: number;
    routeBindingCount: number;
    languageBindingCount: number;
    publicProjectionCount: number;
    editorialDocumentCount: number;
    coreSurfaceCount: number;
    distributionPageCount: number;
    metadataEntryCount: number;
    hreflangClusterCount: number;
    sitemapEntryCount: number;
    rssFeedCount: number;
    rssItemCount: number;
    searchEntryCount: number;
    legacyRouteCount: number;
    redirectReadyLegacyCount: number;
    preservedLegacyCount: number;
  };
  cutoverState: {
    publicationShellMaterialized: false;
    staticHtmlRenderingEnacted: false;
    compatibilityRedirectsEnacted: false;
    legacyFallbackRendererEnacted: false;
    editorialSitemapDeployed: false;
    vercelCutoverEnacted: false;
    deployedRuntimeChanged: false;
  };
  acceptance: {
    previousCutsSealed: true;
    endToEndReconstructionRequired: true;
    authorityDirectionPreserved: true;
    publicLeakCount: 0;
    identityReassignmentCount: 0;
    crossLanguageFallbackCount: 0;
    undistributedRedirectCount: 0;
    unknownFutureResolution: 'unresolved';
    foundationReady: true;
    cutoverReady: false;
    cutoverAuthorized: false;
    r1Complete: false;
    r1_9Complete: false;
    nextRequiredProgram: 'R2 — Editorial Publication Shell & Cutover';
  };
}

export interface FoundationAcceptanceSnapshot {
  completionSealCount: number;
  allPreviousCutsSealed: boolean;
  registryState: 'ready' | 'conflict';
  routeState: 'ready' | 'conflict';
  languageState: 'ready' | 'conflict';
  surfaceState: 'ready' | 'conflict';
  distributionState: 'ready' | 'conflict';
  compatibilityState: 'ready' | 'conflict';
  systemRecordBirthCount: number;
  governanceRecordBirthCount: number;
  routeBindingCount: number;
  languageBindingCount: number;
  publicProjectionCount: number;
  editorialDocumentCount: number;
  coreSurfaceCount: number;
  distributionPageCount: number;
  metadataEntryCount: number;
  hreflangClusterCount: number;
  sitemapEntryCount: number;
  rssFeedCount: number;
  rssItemCount: number;
  searchEntryCount: number;
  legacyRouteCount: number;
  redirectReadyLegacyCount: number;
  preservedLegacyCount: number;
  publicLeakCount: number;
  identityReassignmentCount: number;
  crossLanguageFallbackCount: number;
  undistributedRedirectCount: number;
  unknownFutureResolution: 'unresolved' | 'landing';
  deployedRuntimeChanged: boolean;
}

export interface FoundationAcceptanceResult {
  state: 'ready' | 'conflict';
  foundationReady: boolean;
  cutoverReady: false;
  cutoverAuthorized: false;
  errors: string[];
}

function compareCount(
  errors: string[],
  label: string,
  actual: number,
  expected: number,
): void {
  if (actual !== expected) errors.push(`${label}:${actual}:${expected}`);
}

export function evaluateFoundationAcceptance(
  manifest: FoundationAcceptanceManifest,
  snapshot: FoundationAcceptanceSnapshot,
): FoundationAcceptanceResult {
  const errors: string[] = [];

  if (manifest.schemaVersion !== FOUNDATION_ACCEPTANCE_SCHEMA_VERSION) errors.push('foundation-schema-version');
  if (manifest.status !== 'materialized') errors.push('foundation-status');
  if (manifest.normative !== true) errors.push('foundation-normative');
  if (!manifest.boundary.foundationAcceptanceOnly) errors.push('foundation-boundary');
  if (manifest.boundary.publicCutoverAuthorizationIncluded) errors.push('cutover-authorization-included');
  if (manifest.boundary.deploymentMutationAllowed) errors.push('deployment-mutation-allowed');
  if (manifest.boundary.ontologyMutationAllowed) errors.push('ontology-mutation-allowed');
  if (manifest.boundary.semanticRepairAllowed) errors.push('semantic-repair-allowed');

  if (!snapshot.allPreviousCutsSealed) errors.push('previous-cuts-not-sealed');
  if (snapshot.registryState !== 'ready') errors.push('registry-not-ready');
  if (snapshot.routeState !== 'ready') errors.push('route-runtime-not-ready');
  if (snapshot.languageState !== 'ready') errors.push('language-runtime-not-ready');
  if (snapshot.surfaceState !== 'ready') errors.push('surface-runtime-not-ready');
  if (snapshot.distributionState !== 'ready') errors.push('distribution-runtime-not-ready');
  if (snapshot.compatibilityState !== 'ready') errors.push('compatibility-runtime-not-ready');

  compareCount(errors, 'completion-seal-count', snapshot.completionSealCount, manifest.expectedState.completionSealCount);
  compareCount(errors, 'system-record-birth-count', snapshot.systemRecordBirthCount, manifest.expectedState.systemRecordBirthCount);
  compareCount(errors, 'governance-record-birth-count', snapshot.governanceRecordBirthCount, manifest.expectedState.governanceRecordBirthCount);
  compareCount(errors, 'route-binding-count', snapshot.routeBindingCount, manifest.expectedState.routeBindingCount);
  compareCount(errors, 'language-binding-count', snapshot.languageBindingCount, manifest.expectedState.languageBindingCount);
  compareCount(errors, 'public-projection-count', snapshot.publicProjectionCount, manifest.expectedState.publicProjectionCount);
  compareCount(errors, 'editorial-document-count', snapshot.editorialDocumentCount, manifest.expectedState.editorialDocumentCount);
  compareCount(errors, 'core-surface-count', snapshot.coreSurfaceCount, manifest.expectedState.coreSurfaceCount);
  compareCount(errors, 'distribution-page-count', snapshot.distributionPageCount, manifest.expectedState.distributionPageCount);
  compareCount(errors, 'metadata-entry-count', snapshot.metadataEntryCount, manifest.expectedState.metadataEntryCount);
  compareCount(errors, 'hreflang-cluster-count', snapshot.hreflangClusterCount, manifest.expectedState.hreflangClusterCount);
  compareCount(errors, 'sitemap-entry-count', snapshot.sitemapEntryCount, manifest.expectedState.sitemapEntryCount);
  compareCount(errors, 'rss-feed-count', snapshot.rssFeedCount, manifest.expectedState.rssFeedCount);
  compareCount(errors, 'rss-item-count', snapshot.rssItemCount, manifest.expectedState.rssItemCount);
  compareCount(errors, 'search-entry-count', snapshot.searchEntryCount, manifest.expectedState.searchEntryCount);
  compareCount(errors, 'legacy-route-count', snapshot.legacyRouteCount, manifest.expectedState.legacyRouteCount);
  compareCount(errors, 'redirect-ready-legacy-count', snapshot.redirectReadyLegacyCount, manifest.expectedState.redirectReadyLegacyCount);
  compareCount(errors, 'preserved-legacy-count', snapshot.preservedLegacyCount, manifest.expectedState.preservedLegacyCount);

  if (snapshot.publicLeakCount !== manifest.acceptance.publicLeakCount) errors.push('public-leak-count');
  if (snapshot.identityReassignmentCount !== manifest.acceptance.identityReassignmentCount) errors.push('identity-reassignment-count');
  if (snapshot.crossLanguageFallbackCount !== manifest.acceptance.crossLanguageFallbackCount) errors.push('cross-language-fallback-count');
  if (snapshot.undistributedRedirectCount !== manifest.acceptance.undistributedRedirectCount) errors.push('undistributed-redirect-count');
  if (snapshot.unknownFutureResolution !== manifest.acceptance.unknownFutureResolution) errors.push('unknown-future-resolution');
  if (snapshot.deployedRuntimeChanged !== manifest.cutoverState.deployedRuntimeChanged) errors.push('deployed-runtime-changed');

  const uniqueErrors = [...new Set(errors)];
  return {
    state: uniqueErrors.length === 0 ? 'ready' : 'conflict',
    foundationReady: uniqueErrors.length === 0,
    cutoverReady: false,
    cutoverAuthorized: false,
    errors: uniqueErrors,
  };
}
