import type {
  PayloadDigest,
  PinnedRecordRef,
  RecordKind,
} from '../app/data/editorial-record-identity';
import type { SystemPayload } from '../app/data/editorial-knowledge-ontology';
import type {
  LanguageTag,
  LanguageRole,
} from '../app/data/editorial-route-language-identity';
import type {
  ProjectionOmissionReason,
  ProjectedMaturity,
  PublicProjectionDecision,
} from './projection-engine';
import type {
  LanguageRealization,
  ReconstructedLanguageRuntime,
} from './language-runtime';

export const EDITORIAL_DOCUMENT_RUNTIME_SCHEMA_VERSION = 'editorial-document-runtime/v0' as const;
export const EDITORIAL_DOCUMENT_SCHEMA_VERSION = 'editorial-document/v0' as const;

export type EditorialDocumentContent =
  | {
      type: 'knowledge.system';
      name: string;
      summary: string;
      thesis: string | null;
    }
  | {
      type: 'metadata-only';
    };

export interface EditorialDocumentDto {
  readonly schemaVersion: typeof EDITORIAL_DOCUMENT_SCHEMA_VERSION;
  readonly targetRef: PinnedRecordRef;
  readonly kind: RecordKind;
  readonly lifecycle: 'active' | 'archived';
  readonly language: LanguageTag;
  readonly canonicalPath: string;
  readonly canonicalUrl: string;
  readonly disclosure: {
    readonly mode: 'full' | 'metadata-only';
    readonly source: 'public' | 'partial' | 'private' | 'not-applicable' | 'unknown';
    readonly evidence: 'public' | 'partial' | 'private' | 'none' | 'unknown';
  };
  readonly maturity: ProjectedMaturity;
  readonly realization: {
    readonly role: LanguageRole;
    readonly digest: PayloadDigest;
    readonly translatedFrom: LanguageTag | null;
  } | null;
  readonly content: EditorialDocumentContent;
}

export type EditorialDocumentOmissionReason =
  | ProjectionOmissionReason
  | 'content-realization-unavailable'
  | 'content-realization-conflict'
  | 'content-target-mismatch'
  | 'content-language-mismatch'
  | 'unsupported-document-kind'
  | 'sanitized-content-authority-unavailable';

export type EditorialDocumentDecision =
  | {
      state: 'omitted';
      targetRef: PinnedRecordRef;
      reasons: EditorialDocumentOmissionReason[];
    }
  | {
      state: 'redirect';
      targetRef: PinnedRecordRef;
      language: LanguageTag;
      canonicalPath: string;
      canonicalUrl: string;
    }
  | {
      state: 'document';
      document: EditorialDocumentDto;
    };

function samePinnedRef(left: PinnedRecordRef, right: PinnedRecordRef): boolean {
  return left.recordId === right.recordId && left.revisionId === right.revisionId;
}

function matchingRealizations(
  targetRef: PinnedRecordRef,
  language: LanguageTag,
  runtime: ReconstructedLanguageRuntime,
): LanguageRealization[] {
  return runtime.realizations.filter((realization) =>
    realization.binding.targetRef.recordId === targetRef.recordId
    && samePinnedRef(realization.binding.basisRef, targetRef)
    && realization.binding.language === language);
}

function systemContent(payload: SystemPayload): EditorialDocumentContent {
  return Object.freeze({
    type: 'knowledge.system' as const,
    name: payload.name,
    summary: payload.summary,
    thesis: payload.thesis,
  });
}

function freezeDocument(document: EditorialDocumentDto): EditorialDocumentDto {
  Object.freeze(document.disclosure);
  Object.freeze(document.maturity);
  if (document.realization) Object.freeze(document.realization);
  Object.freeze(document.content);
  return Object.freeze(document);
}

export function materializeEditorialDocument(
  projection: PublicProjectionDecision,
  languageRuntime: ReconstructedLanguageRuntime,
): EditorialDocumentDecision {
  if (languageRuntime.state !== 'ready') {
    throw new Error('language-runtime-conflict');
  }

  if (projection.state === 'omitted') {
    return {
      state: 'omitted',
      targetRef: projection.targetRef,
      reasons: [...projection.reasons],
    };
  }

  if (projection.state === 'redirect') {
    return {
      state: 'redirect',
      targetRef: projection.targetRef,
      language: projection.language,
      canonicalPath: projection.canonicalPath,
      canonicalUrl: projection.canonicalUrl,
    };
  }

  const dto = projection.dto;

  if (dto.disclosure.mode === 'sanitized') {
    return {
      state: 'omitted',
      targetRef: dto.targetRef,
      reasons: ['sanitized-content-authority-unavailable'],
    };
  }

  if (dto.disclosure.mode === 'metadata-only') {
    return {
      state: 'document',
      document: freezeDocument({
        schemaVersion: EDITORIAL_DOCUMENT_SCHEMA_VERSION,
        targetRef: dto.targetRef,
        kind: dto.kind,
        lifecycle: dto.lifecycle,
        language: dto.language,
        canonicalPath: dto.canonicalPath,
        canonicalUrl: dto.canonicalUrl,
        disclosure: {
          mode: 'metadata-only',
          source: dto.disclosure.source,
          evidence: dto.disclosure.evidence,
        },
        maturity: dto.maturity,
        realization: null,
        content: { type: 'metadata-only' },
      }),
    };
  }

  if (dto.kind !== 'knowledge.system') {
    return {
      state: 'omitted',
      targetRef: dto.targetRef,
      reasons: ['unsupported-document-kind'],
    };
  }

  const realizations = matchingRealizations(dto.targetRef, dto.language, languageRuntime);
  if (realizations.length === 0) {
    return {
      state: 'omitted',
      targetRef: dto.targetRef,
      reasons: ['content-realization-unavailable'],
    };
  }
  if (realizations.length !== 1) {
    return {
      state: 'omitted',
      targetRef: dto.targetRef,
      reasons: ['content-realization-conflict'],
    };
  }

  const realization = realizations[0];
  if (realization.binding.targetRef.recordId !== dto.targetRef.recordId
    || !samePinnedRef(realization.binding.basisRef, dto.targetRef)) {
    return {
      state: 'omitted',
      targetRef: dto.targetRef,
      reasons: ['content-target-mismatch'],
    };
  }
  if (realization.binding.language !== dto.language) {
    return {
      state: 'omitted',
      targetRef: dto.targetRef,
      reasons: ['content-language-mismatch'],
    };
  }

  return {
    state: 'document',
    document: freezeDocument({
      schemaVersion: EDITORIAL_DOCUMENT_SCHEMA_VERSION,
      targetRef: dto.targetRef,
      kind: dto.kind,
      lifecycle: dto.lifecycle,
      language: dto.language,
      canonicalPath: dto.canonicalPath,
      canonicalUrl: dto.canonicalUrl,
      disclosure: {
        mode: 'full',
        source: dto.disclosure.source,
        evidence: dto.disclosure.evidence,
      },
      maturity: dto.maturity,
      realization: {
        role: realization.binding.role,
        digest: realization.binding.realizationDigest,
        translatedFrom: realization.binding.translatedFrom,
      },
      content: systemContent(realization.payload),
    }),
  };
}

export function documentContainsSemanticPayload(decision: EditorialDocumentDecision): boolean {
  return decision.state === 'document' && decision.document.content.type !== 'metadata-only';
}
