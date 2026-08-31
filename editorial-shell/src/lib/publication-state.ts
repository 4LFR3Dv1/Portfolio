import publicationStateJson from '../generated/accepted-publication-state.json';
import type { CompatibilityRedirectState } from '../../../src/editorial/compatibility-redirect-adapter';
import type { EditorialDocumentDto } from '../../../src/editorial/document-runtime';
import type { DistributionBundle, DistributionPage } from '../../../src/editorial/distribution-runtime';
import type { DistributionEmission } from '../../../src/editorial/distribution-emission';
import type { LegacyPreservationState } from '../../../src/editorial/legacy-preservation-runtime';
import type { PublicationShellPlan } from '../../../src/editorial/publication-shell-boundary';
import type { CoreSurfaceDto } from '../../../src/editorial/surface-runtime';

export interface RenderablePublicationState {
  schemaVersion: 'editorial-renderer-input/v0' | 'editorial-current-publication-state/v0';
  source: {
    distributionDigest: `sha256_${string}`;
    r1CompletionContractId?: string;
    r20CompletionContractId?: string;
    semanticCompletionContractId?: string;
    physicalBoundaryCompletionContractId?: string;
    acceptedPublicationDigest?: `sha256_${string}`;
    rendererInputDigest?: `sha256_${string}`;
    compatibilitySourceContractId?: string;
    historicalTransportUsedAsSemanticAuthority?: false;
  };
  pages: DistributionPage[];
  distribution: DistributionBundle;
  emission: DistributionEmission;
  surfaces: CoreSurfaceDto[];
  documents: EditorialDocumentDto[];
  shellPlan: PublicationShellPlan;
  legacy: LegacyPreservationState;
  redirects: CompatibilityRedirectState;
}

export const publicationState = publicationStateJson as RenderablePublicationState;
