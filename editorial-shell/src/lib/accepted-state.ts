import registryManifestJson from '../../../docs/editorial/record-registry.v0.json';
import routeManifestJson from '../../../docs/editorial/route-runtime.v0.json';
import languageManifestJson from '../../../docs/editorial/language-runtime.v0.json';
import surfaceManifestJson from '../../../docs/editorial/core-editorial-surfaces.v0.json';
import distributionManifestJson from '../../../docs/editorial/distribution-foundation.v0.json';
import compatibilityManifestJson from '../../../docs/editorial/legacy-compatibility.v0.json';
import shellManifestJson from '../../../docs/editorial/publication-shell-boundary.v0.json';

import {
  materializeRegistryRecords,
  reconstructRecordRegistry,
  type RecordRegistryManifest,
} from '../../../src/editorial/record-registry';
import {
  reconstructRouteRuntime,
  type RouteRuntimeManifest,
} from '../../../src/editorial/route-runtime';
import {
  reconstructLanguageRuntime,
  type LanguageRuntimeManifest,
} from '../../../src/editorial/language-runtime';
import {
  materializeSurfaceDocuments,
  reconstructCoreSurfaceRuntime,
  type CoreEditorialSurfaceManifest,
  type CoreSurfaceDto,
} from '../../../src/editorial/surface-runtime';
import {
  reconstructDistributionRuntime,
  type DistributionBundle,
  type DistributionFoundationManifest,
} from '../../../src/editorial/distribution-runtime';
import type { EditorialDocumentDecision } from '../../../src/editorial/document-runtime';
import type { LegacyCompatibilityManifest } from '../../../src/editorial/legacy-compatibility';
import {
  reconstructPublicationShellBoundary,
  type PublicationShellBoundaryManifest,
  type PublicationShellPlan,
} from '../../../src/editorial/publication-shell-boundary';

export interface AcceptedPublicationState {
  bundle: DistributionBundle;
  documents: EditorialDocumentDecision[];
  surfaces: CoreSurfaceDto[];
  plan: PublicationShellPlan;
}

let cachedState: AcceptedPublicationState | null = null;

export function getAcceptedPublicationState(): AcceptedPublicationState {
  if (cachedState) return cachedState;

  const registryManifest = registryManifestJson as RecordRegistryManifest;
  const routeManifest = routeManifestJson as RouteRuntimeManifest;
  const languageManifest = languageManifestJson as LanguageRuntimeManifest;
  const surfaceManifest = surfaceManifestJson as CoreEditorialSurfaceManifest;
  const distributionManifest = distributionManifestJson as DistributionFoundationManifest;
  const compatibilityManifest = compatibilityManifestJson as LegacyCompatibilityManifest;
  const shellManifest = shellManifestJson as PublicationShellBoundaryManifest;

  const records = materializeRegistryRecords(registryManifest);
  const registry = reconstructRecordRegistry(registryManifest);
  if (registry.errors.length > 0) {
    throw new Error(`editorial-shell-registry-conflict:${registry.errors.join(',')}`);
  }

  const routes = reconstructRouteRuntime(routeManifest, records);
  if (routes.state !== 'ready') {
    throw new Error(`editorial-shell-route-conflict:${routes.errors.join(',')}`);
  }

  const languages = reconstructLanguageRuntime(languageManifest, records);
  if (languages.state !== 'ready') {
    throw new Error(`editorial-shell-language-conflict:${languages.errors.join(',')}`);
  }

  const surfaceState = materializeSurfaceDocuments(
    surfaceManifest,
    records,
    registry,
    routes,
    languages,
  );
  if (surfaceState.governance.state !== 'ready') {
    throw new Error(`editorial-shell-governance-conflict:${surfaceState.governance.errors.join(',')}`);
  }

  const surfaces = reconstructCoreSurfaceRuntime(surfaceManifest, surfaceState.documents);
  if (surfaces.state !== 'ready') {
    throw new Error(`editorial-shell-surface-conflict:${surfaces.errors.join(',')}`);
  }

  const distribution = reconstructDistributionRuntime(
    distributionManifest,
    surfaces,
    surfaceState.documents,
  );
  if (distribution.state !== 'ready' || !distribution.bundle) {
    throw new Error(`editorial-shell-distribution-conflict:${distribution.errors.join(',')}`);
  }

  const shell = reconstructPublicationShellBoundary(
    shellManifest,
    distribution.bundle,
    compatibilityManifest,
  );
  if (shell.state !== 'ready' || !shell.plan) {
    throw new Error(`editorial-shell-boundary-conflict:${shell.errors.join(',')}`);
  }

  cachedState = Object.freeze({
    bundle: distribution.bundle,
    documents: surfaceState.documents,
    surfaces: surfaces.surfaces,
    plan: shell.plan,
  });

  return cachedState;
}
