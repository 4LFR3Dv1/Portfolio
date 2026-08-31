import r1CompletionJson from '../../docs/editorial/R1.9-completion.v0.json';
import r20CompletionJson from '../../docs/editorial/R2.0-completion.v0.json';
import registryManifestJson from '../../docs/editorial/record-registry.v0.json';
import routeManifestJson from '../../docs/editorial/route-runtime.v0.json';
import languageManifestJson from '../../docs/editorial/language-runtime.v0.json';
import surfaceManifestJson from '../../docs/editorial/core-editorial-surfaces.v0.json';
import distributionManifestJson from '../../docs/editorial/distribution-foundation.v0.json';
import compatibilityManifestJson from '../../docs/editorial/legacy-compatibility.v0.json';
import shellManifestJson from '../../docs/editorial/publication-shell-boundary.v0.json';

import {
  materializeRegistryRecords,
  reconstructRecordRegistry,
  type RecordRegistryManifest,
} from './record-registry';
import {
  reconstructRouteRuntime,
  type RouteRuntimeManifest,
} from './route-runtime';
import {
  reconstructLanguageRuntime,
  type LanguageRuntimeManifest,
} from './language-runtime';
import {
  materializeSurfaceDocuments,
  reconstructCoreSurfaceRuntime,
  type CoreEditorialSurfaceManifest,
  type CoreSurfaceDto,
} from './surface-runtime';
import {
  reconstructDistributionRuntime,
  type DistributionFoundationManifest,
  type DistributionPage,
} from './distribution-runtime';
import type { EditorialDocumentDto } from './document-runtime';
import type { LegacyCompatibilityManifest } from './legacy-compatibility';
import {
  reconstructPublicationShellBoundary,
  type PublicationShellBoundaryManifest,
  type PublicationShellPlan,
} from './publication-shell-boundary';

export const R2_RENDERER_INPUT_SCHEMA_VERSION = 'editorial-renderer-input/v0' as const;

interface R1CompletionSeal {
  contractId: string;
  status: 'frozen';
  normative: true;
  acceptance: {
    r1Complete: true;
    foundationReady: true;
    cutoverReady: false;
    cutoverAuthorized: false;
  };
}

interface R20CompletionSeal {
  contractId: string;
  status: 'frozen';
  normative: true;
  acceptance: {
    r1Complete: true;
    r2_0Complete: true;
    shellBoundaryReady: true;
    cutoverReady: false;
    cutoverAuthorized: false;
  };
}

export interface AcceptedRendererInput {
  schemaVersion: typeof R2_RENDERER_INPUT_SCHEMA_VERSION;
  source: {
    r1CompletionContractId: string;
    r20CompletionContractId: string;
    distributionDigest: `sha256_${string}`;
  };
  pages: DistributionPage[];
  surfaces: CoreSurfaceDto[];
  documents: EditorialDocumentDto[];
  shellPlan: PublicationShellPlan;
}

export function materializeAcceptedRendererInput(): AcceptedRendererInput {
  const r1Completion = r1CompletionJson as R1CompletionSeal;
  const r20Completion = r20CompletionJson as R20CompletionSeal;
  if (
    r1Completion.status !== 'frozen'
    || r1Completion.normative !== true
    || r1Completion.acceptance.r1Complete !== true
    || r1Completion.acceptance.foundationReady !== true
    || r1Completion.acceptance.cutoverReady !== false
    || r1Completion.acceptance.cutoverAuthorized !== false
  ) {
    throw new Error('renderer-input-r1-acceptance-unavailable');
  }
  if (
    r20Completion.status !== 'frozen'
    || r20Completion.normative !== true
    || r20Completion.acceptance.r2_0Complete !== true
    || r20Completion.acceptance.shellBoundaryReady !== true
    || r20Completion.acceptance.cutoverReady !== false
    || r20Completion.acceptance.cutoverAuthorized !== false
  ) {
    throw new Error('renderer-input-r2-boundary-unavailable');
  }

  const registryManifest = registryManifestJson as RecordRegistryManifest;
  const records = materializeRegistryRecords(registryManifest);
  const registry = reconstructRecordRegistry(registryManifest);
  if (registry.errors.length > 0) throw new Error(`renderer-input-registry-conflict:${registry.errors.join(',')}`);

  const routes = reconstructRouteRuntime(routeManifestJson as RouteRuntimeManifest, records);
  if (routes.state !== 'ready') throw new Error(`renderer-input-route-conflict:${routes.errors.join(',')}`);

  const languages = reconstructLanguageRuntime(languageManifestJson as LanguageRuntimeManifest, records);
  if (languages.state !== 'ready') throw new Error(`renderer-input-language-conflict:${languages.errors.join(',')}`);

  const surfaceManifest = surfaceManifestJson as CoreEditorialSurfaceManifest;
  const surfaceState = materializeSurfaceDocuments(surfaceManifest, records, registry, routes, languages);
  if (surfaceState.governance.state !== 'ready') {
    throw new Error(`renderer-input-governance-conflict:${surfaceState.governance.errors.join(',')}`);
  }

  const surfaces = reconstructCoreSurfaceRuntime(surfaceManifest, surfaceState.documents);
  if (surfaces.state !== 'ready') throw new Error(`renderer-input-surface-conflict:${surfaces.errors.join(',')}`);

  const distribution = reconstructDistributionRuntime(
    distributionManifestJson as DistributionFoundationManifest,
    surfaces,
    surfaceState.documents,
  );
  if (distribution.state !== 'ready' || !distribution.bundle || !distribution.digest) {
    throw new Error(`renderer-input-distribution-conflict:${distribution.errors.join(',')}`);
  }

  const shell = reconstructPublicationShellBoundary(
    shellManifestJson as PublicationShellBoundaryManifest,
    distribution.bundle,
    compatibilityManifestJson as LegacyCompatibilityManifest,
  );
  if (shell.state !== 'ready' || !shell.plan) {
    throw new Error(`renderer-input-shell-conflict:${shell.errors.join(',')}`);
  }

  const documents = surfaceState.documents
    .filter((entry): entry is Extract<(typeof surfaceState.documents)[number], { state: 'document' }> => entry.state === 'document')
    .map((entry) => entry.document);

  return {
    schemaVersion: R2_RENDERER_INPUT_SCHEMA_VERSION,
    source: {
      r1CompletionContractId: r1Completion.contractId,
      r20CompletionContractId: r20Completion.contractId,
      distributionDigest: distribution.digest,
    },
    pages: distribution.bundle.pages,
    surfaces: surfaces.surfaces,
    documents,
    shellPlan: shell.plan,
  };
}
