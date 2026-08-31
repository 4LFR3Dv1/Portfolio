import { createHash } from 'node:crypto';
import semanticCompletionJson from '../../docs/editorial/R1-A2.8-completion.v0.json';
import physicalBoundaryCompletionJson from '../../docs/editorial/R2-A1.0-completion.v0.json';
import {
  materializeCurrentEditorialSurfaces,
  type CurrentSurfaceDto,
} from './current-surface-runtime';
import type { EditorialDocumentDto } from './document-runtime';

export const CURRENT_RENDERER_INPUT_SCHEMA_VERSION = 'editorial-current-renderer-input/v0' as const;
export const ACCEPTED_CURRENT_PUBLICATION_DIGEST = 'sha256_f72c807283aa0f2da0a20b3ecaf1ec5f99227fedac47aa9fb988f5c924997d32' as const;

interface SemanticCompletionSeal {
  contractId: string;
  status: 'complete';
  normative: true;
  specimen: {
    publicationDigest: string;
  };
  acceptance: {
    r1_a2_8Complete: true;
    r1_a2Complete: true;
    currentPublicationValid: true;
    acceptedPublicationDigestFrozen: true;
    cutoverReady: false;
    cutoverAuthorized: false;
    cutoverEnacted: false;
  };
}

interface PhysicalBoundaryCompletionSeal {
  contractId: string;
  status: 'complete';
  normative: true;
  sourceIdentity: {
    r1_a2_8Complete: true;
    r1_a2Complete: true;
    currentPublicationValid: true;
    acceptedPublicationDigest: string;
  };
  acceptance: {
    r2_a1_0Complete: true;
    r2_a1Complete: false;
    currentPhysicalPublicationValid: false;
    cutoverReady: false;
    cutoverAuthorized: false;
    cutoverEnacted: false;
  };
}

export interface CurrentRendererInput {
  schemaVersion: typeof CURRENT_RENDERER_INPUT_SCHEMA_VERSION;
  source: {
    semanticCompletionContractId: string;
    physicalBoundaryCompletionContractId: string;
    acceptedPublicationDigest: typeof ACCEPTED_CURRENT_PUBLICATION_DIGEST;
  };
  surfaces: CurrentSurfaceDto[];
  documents: EditorialDocumentDto[];
}

type CanonicalJson = null | boolean | number | string | CanonicalJson[] | { [key: string]: CanonicalJson };

function canonicalJson(value: CanonicalJson): string {
  if (value === null || typeof value === 'boolean' || typeof value === 'number' || typeof value === 'string') {
    return JSON.stringify(value) as string;
  }
  if (Array.isArray(value)) return `[${value.map((entry) => canonicalJson(entry)).join(',')}]`;
  return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonicalJson(value[key])}`).join(',')}}`;
}

export function serializeCurrentRendererInput(input: CurrentRendererInput): string {
  return `${canonicalJson(input as unknown as CanonicalJson)}\n`;
}

export function currentRendererInputDigest(input: CurrentRendererInput): `sha256_${string}` {
  return `sha256_${createHash('sha256').update(serializeCurrentRendererInput(input), 'utf8').digest('hex')}`;
}

export function materializeCurrentRendererInput(): CurrentRendererInput {
  const semanticCompletion = semanticCompletionJson as SemanticCompletionSeal;
  const physicalBoundaryCompletion = physicalBoundaryCompletionJson as PhysicalBoundaryCompletionSeal;

  if (
    semanticCompletion.status !== 'complete'
    || semanticCompletion.normative !== true
    || semanticCompletion.acceptance.r1_a2_8Complete !== true
    || semanticCompletion.acceptance.r1_a2Complete !== true
    || semanticCompletion.acceptance.currentPublicationValid !== true
    || semanticCompletion.acceptance.acceptedPublicationDigestFrozen !== true
    || semanticCompletion.acceptance.cutoverReady !== false
    || semanticCompletion.acceptance.cutoverAuthorized !== false
    || semanticCompletion.acceptance.cutoverEnacted !== false
    || semanticCompletion.specimen.publicationDigest !== ACCEPTED_CURRENT_PUBLICATION_DIGEST
  ) {
    throw new Error('current-renderer-input-semantic-source-unavailable');
  }

  if (
    physicalBoundaryCompletion.status !== 'complete'
    || physicalBoundaryCompletion.normative !== true
    || physicalBoundaryCompletion.acceptance.r2_a1_0Complete !== true
    || physicalBoundaryCompletion.acceptance.r2_a1Complete !== false
    || physicalBoundaryCompletion.acceptance.currentPhysicalPublicationValid !== false
    || physicalBoundaryCompletion.acceptance.cutoverReady !== false
    || physicalBoundaryCompletion.acceptance.cutoverAuthorized !== false
    || physicalBoundaryCompletion.acceptance.cutoverEnacted !== false
    || physicalBoundaryCompletion.sourceIdentity.r1_a2_8Complete !== true
    || physicalBoundaryCompletion.sourceIdentity.r1_a2Complete !== true
    || physicalBoundaryCompletion.sourceIdentity.currentPublicationValid !== true
    || physicalBoundaryCompletion.sourceIdentity.acceptedPublicationDigest !== ACCEPTED_CURRENT_PUBLICATION_DIGEST
  ) {
    throw new Error('current-renderer-input-physical-boundary-unavailable');
  }

  const materialized = materializeCurrentEditorialSurfaces();
  if (materialized.errors.length > 0) {
    throw new Error(`current-renderer-input-surface-conflict:${materialized.errors.join(',')}`);
  }

  const documents: EditorialDocumentDto[] = [];
  for (const decision of materialized.documents) {
    if (decision.state !== 'document') {
      throw new Error(`current-renderer-input-document-not-materialized:${decision.state}`);
    }
    documents.push(decision.document);
  }

  if (materialized.surfaces.length !== 12) throw new Error('current-renderer-input-surface-count');
  if (documents.length !== 54) throw new Error('current-renderer-input-document-count');

  return {
    schemaVersion: CURRENT_RENDERER_INPUT_SCHEMA_VERSION,
    source: {
      semanticCompletionContractId: semanticCompletion.contractId,
      physicalBoundaryCompletionContractId: physicalBoundaryCompletion.contractId,
      acceptedPublicationDigest: ACCEPTED_CURRENT_PUBLICATION_DIGEST,
    },
    surfaces: materialized.surfaces,
    documents,
  };
}
