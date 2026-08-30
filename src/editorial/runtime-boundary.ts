export const EDITORIAL_RUNTIME_BOUNDARY_SCHEMA_VERSION = 'editorial-runtime-boundary/v0' as const;

export type RuntimePipelineStage =
  | 'load'
  | 'validate-contracts'
  | 'reconstruct-lineage'
  | 'apply-amendments'
  | 'resolve-governance'
  | 'resolve-language'
  | 'resolve-route'
  | 'project'
  | 'render';

export type BuildFailureDisposition = 'build-error' | 'omit-from-public-projection';

export interface EditorialRuntimeBoundary {
  readonly schemaVersion: typeof EDITORIAL_RUNTIME_BOUNDARY_SCHEMA_VERSION;
  readonly targetRuntime: {
    readonly publicationShell: 'astro-static';
    readonly interactiveLayer: 'react-islands';
    readonly outputMode: 'static';
    readonly canonicalReadingRequiresServer: false;
  };
  readonly authority: {
    readonly semanticAuthority: 'editorial-registry';
    readonly rendererIsAuthority: false;
    readonly clientStateIsAuthority: false;
    readonly requestTimeRepositoryCrawlMayInferOntology: false;
  };
  readonly pipeline: readonly RuntimePipelineStage[];
  readonly projectionBoundary: {
    readonly renderersConsumeProjectionDtos: true;
    readonly reactIslandsReceiveAuthoritativeStores: false;
    readonly reactIslandsMayMutateCanonicalEditorialState: false;
  };
  readonly routing: {
    readonly recordRoutesGeneratedFromBindings: true;
    readonly unknownPathOutcome: '404-unresolved';
    readonly unknownPathMayRenderHome: false;
    readonly legacyCompatibilityIsExplicit: true;
  };
  readonly language: {
    readonly canonicalRecordRoutesAreLocalePrefixed: true;
    readonly clientLanguageStateMayRedefineCanonicalUrl: false;
    readonly implicitFallbackAllowed: false;
    readonly missingRealizationOutcome: 'language-unavailable';
  };
  readonly migration: {
    readonly frameworkCutoverEnacted: false;
    readonly publicUiChanged: false;
    readonly runtimeSemanticsChanged: false;
    readonly recordBirthCount: 0;
  };
}

export const runtimeBoundaryV0: EditorialRuntimeBoundary = {
  schemaVersion: EDITORIAL_RUNTIME_BOUNDARY_SCHEMA_VERSION,
  targetRuntime: {
    publicationShell: 'astro-static',
    interactiveLayer: 'react-islands',
    outputMode: 'static',
    canonicalReadingRequiresServer: false,
  },
  authority: {
    semanticAuthority: 'editorial-registry',
    rendererIsAuthority: false,
    clientStateIsAuthority: false,
    requestTimeRepositoryCrawlMayInferOntology: false,
  },
  pipeline: [
    'load',
    'validate-contracts',
    'reconstruct-lineage',
    'apply-amendments',
    'resolve-governance',
    'resolve-language',
    'resolve-route',
    'project',
    'render',
  ],
  projectionBoundary: {
    renderersConsumeProjectionDtos: true,
    reactIslandsReceiveAuthoritativeStores: false,
    reactIslandsMayMutateCanonicalEditorialState: false,
  },
  routing: {
    recordRoutesGeneratedFromBindings: true,
    unknownPathOutcome: '404-unresolved',
    unknownPathMayRenderHome: false,
    legacyCompatibilityIsExplicit: true,
  },
  language: {
    canonicalRecordRoutesAreLocalePrefixed: true,
    clientLanguageStateMayRedefineCanonicalUrl: false,
    implicitFallbackAllowed: false,
    missingRealizationOutcome: 'language-unavailable',
  },
  migration: {
    frameworkCutoverEnacted: false,
    publicUiChanged: false,
    runtimeSemanticsChanged: false,
    recordBirthCount: 0,
  },
};

const REQUIRED_PIPELINE: readonly RuntimePipelineStage[] = [
  'load',
  'validate-contracts',
  'reconstruct-lineage',
  'apply-amendments',
  'resolve-governance',
  'resolve-language',
  'resolve-route',
  'project',
  'render',
];

export function validateRuntimeBoundary(boundary: EditorialRuntimeBoundary): readonly string[] {
  const errors: string[] = [];

  if (boundary.targetRuntime.outputMode !== 'static') {
    errors.push('publication output must remain static-first');
  }

  if (boundary.authority.rendererIsAuthority) {
    errors.push('renderer cannot be semantic authority');
  }

  if (boundary.authority.clientStateIsAuthority) {
    errors.push('client state cannot be semantic authority');
  }

  if (boundary.authority.requestTimeRepositoryCrawlMayInferOntology) {
    errors.push('request-time repository crawling cannot infer ontology');
  }

  if (boundary.pipeline.length !== REQUIRED_PIPELINE.length ||
      boundary.pipeline.some((stage, index) => stage !== REQUIRED_PIPELINE[index])) {
    errors.push('runtime pipeline order changed');
  }

  if (!boundary.projectionBoundary.renderersConsumeProjectionDtos) {
    errors.push('renderers must consume projections');
  }

  if (boundary.projectionBoundary.reactIslandsReceiveAuthoritativeStores ||
      boundary.projectionBoundary.reactIslandsMayMutateCanonicalEditorialState) {
    errors.push('React islands crossed the authority boundary');
  }

  if (boundary.routing.unknownPathMayRenderHome || boundary.routing.unknownPathOutcome !== '404-unresolved') {
    errors.push('unknown route behavior violates R0.7');
  }

  if (boundary.language.implicitFallbackAllowed ||
      boundary.language.clientLanguageStateMayRedefineCanonicalUrl) {
    errors.push('language runtime violates explicit route identity');
  }

  if (boundary.migration.recordBirthCount !== 0 ||
      boundary.migration.frameworkCutoverEnacted ||
      boundary.migration.publicUiChanged ||
      boundary.migration.runtimeSemanticsChanged) {
    errors.push('R1.0 must not enact Birth, cutover, UI or runtime semantics');
  }

  return errors;
}
