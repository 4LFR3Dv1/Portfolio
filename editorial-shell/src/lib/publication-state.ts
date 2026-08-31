import publicationStateJson from '../generated/accepted-publication-state.json';
import type { EditorialDocumentDto } from '../../../src/editorial/document-runtime';
import type { DistributionPage } from '../../../src/editorial/distribution-runtime';
import type { PublicationShellPlan } from '../../../src/editorial/publication-shell-boundary';
import type { CoreSurfaceDto } from '../../../src/editorial/surface-runtime';

export interface RenderablePublicationState {
  schemaVersion: 'editorial-renderer-input/v0';
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

export const publicationState = publicationStateJson as RenderablePublicationState;
