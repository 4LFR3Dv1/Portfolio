import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import type { RecordId, RevisionId } from '../app/data/editorial-record-identity';
import type {
  DisclosureMode,
  DisclosurePayload,
  GovernanceProjection,
} from '../app/data/editorial-visibility-maturity-disclosure';
import type { CurrentRecordHead } from '../app/data/editorial-route-language-identity';
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
  resolveLocalizedRouteIdentity,
  type LanguageRuntimeManifest,
} from './language-runtime';
import {
  projectPublicRecord,
  type ProjectionTargetHead,
  type PublicProjectionDecision,
} from './projection-engine';
import {
  documentContainsSemanticPayload,
  materializeEditorialDocument,
} from './document-runtime';

interface DocumentRuntimeManifest {
  schemaVersion: 'editorial-document-runtime/v0';
  contractId: string;
  status: 'materialized';
  normative: true;
  baseline: string;
  authority: {
    projectionSource: string;
    languageSource: string;
    documentIsRecordAuthority: false;
    documentIsLanguageAuthority: false;
    rendererMayInferSemanticContent: false;
    runtimeSanitizationAllowed: false;
  };
  currentState: {
    publicProjectionCount: 0;
    editorialDocumentCount: 0;
    frameworkCutoverEnacted: false;
    staticHtmlRenderingEnacted: false;
    markdownAuthorityIntroduced: false;
    publicUiChanged: false;
    runtimeSemanticsChanged: false;
  };
  acceptance: {
    documentRuntimeMaterialized: true;
    projectionRequired: true;
    exactLanguageRealizationRequiredForFullContent: true;
    metadataOnlySemanticPayloadForbidden: true;
    sanitizedRuntimeTransformationForbidden: true;
    redirectDoesNotBecomeDocument: true;
    currentEditorialDocumentCount: 0;
    publicUiChanged: false;
    runtimeSemanticsChanged: false;
    r1_5Complete: false;
  };
}

function readRepoFile(path: string): string {
  return readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
}

const registryManifest = JSON.parse(
  readRepoFile('docs/editorial/record-registry.v0.json'),
) as RecordRegistryManifest;
const routeManifest = JSON.parse(
  readRepoFile('docs/editorial/route-runtime.v0.json'),
) as RouteRuntimeManifest;
const languageManifest = JSON.parse(
  readRepoFile('docs/editorial/language-runtime.v0.json'),
) as LanguageRuntimeManifest;
const documentManifest = JSON.parse(
  readRepoFile('docs/editorial/editorial-document-runtime.v0.json'),
) as DocumentRuntimeManifest;

const records = materializeRegistryRecords(registryManifest);
const registry = reconstructRecordRegistry(registryManifest);
const routeRuntime = reconstructRouteRuntime(routeManifest, records);
const languageRuntime = reconstructLanguageRuntime(languageManifest, records);
const currentHeads: CurrentRecordHead[] = records.map((record) => ({
  recordId: record.recordId,
  revisionId: record.revisions[0].revision.revisionId,
}));

const vira = records.find((record) => record.subjectKey === 'vira');
if (!vira) throw new Error('missing-vira');
const viraEntry = vira.revisions[0];
const viraRevision = viraEntry.revision;

function targetForVira(): ProjectionTargetHead {
  return {
    recordId: viraRevision.recordId,
    revisionId: viraRevision.revisionId,
    kind: viraRevision.kind,
    lifecycle: viraRevision.lifecycle,
  };
}

function disclosure(mode: DisclosureMode): GovernanceProjection<DisclosurePayload> {
  return {
    state: 'classified',
    governanceRecordId: `rec_${'a'.repeat(32)}` as RecordId,
    payload: {
      schemaVersion: 'governance.disclosure/v0',
      targetRef: { type: 'record', recordId: viraRevision.recordId },
      basisRef: {
        type: 'pinned-record',
        recordId: viraRevision.recordId,
        revisionId: viraRevision.revisionId,
      },
      visibility: {
        record: 'public',
        source: 'public',
        evidence: 'unknown',
      },
      disclosure: mode,
      rationale: 'R1.5 synthetic acceptance authority.',
    },
  };
}

function projection(path: string, mode: DisclosureMode): PublicProjectionDecision {
  const route = resolveLocalizedRouteIdentity(
    path,
    routeRuntime,
    languageRuntime,
    currentHeads,
  );
  return projectPublicRecord({
    target: targetForVira(),
    disclosure: disclosure(mode),
    maturity: null,
    route,
  });
}

describe('R1.5 Editorial Document Runtime', () => {
  it('starts from the sealed R1 substrate without changing the deployed runtime', () => {
    expect(registry.errors).toEqual([]);
    expect(routeRuntime.state).toBe('ready');
    expect(languageRuntime.state).toBe('ready');
    expect(documentManifest.schemaVersion).toBe('editorial-document-runtime/v0');
    expect(documentManifest.status).toBe('materialized');
    expect(documentManifest.normative).toBe(true);
    expect(documentManifest.currentState).toEqual({
      publicProjectionCount: 0,
      editorialDocumentCount: 0,
      frameworkCutoverEnacted: false,
      staticHtmlRenderingEnacted: false,
      markdownAuthorityIntroduced: false,
      publicUiChanged: false,
      runtimeSemanticsChanged: false,
    });
  });

  it('materializes full EN System content only from the exact admitted language realization', () => {
    const decision = materializeEditorialDocument(
      projection('/en/systems/vira', 'full'),
      languageRuntime,
    );
    expect(decision.state).toBe('document');
    if (decision.state !== 'document') return;

    expect(decision.document.targetRef.revisionId).toBe(viraRevision.revisionId);
    expect(decision.document.language).toBe('en');
    expect(decision.document.content).toEqual({
      type: 'knowledge.system',
      ...viraEntry.payload,
      schemaVersion: undefined,
    });
  });

  it('carries the exact PT-BR realization rather than falling back to EN', () => {
    const decision = materializeEditorialDocument(
      projection('/pt-br/systems/vira', 'full'),
      languageRuntime,
    );
    expect(decision.state).toBe('document');
    if (decision.state !== 'document') return;

    const pt = languageRuntime.realizations.find((realization) =>
      realization.binding.targetRef.recordId === vira.recordId
      && realization.binding.language === 'pt-BR');
    expect(pt).toBeDefined();
    expect(decision.document.language).toBe('pt-BR');
    expect(decision.document.realization?.role).toBe('translation');
    expect(decision.document.realization?.translatedFrom).toBe('en');
    expect(decision.document.realization?.digest).toBe(pt?.binding.realizationDigest);
    expect(decision.document.content.type).toBe('knowledge.system');
    if (decision.document.content.type === 'knowledge.system') {
      expect(decision.document.content.summary).toBe(pt?.payload.summary);
    }
  });

  it('preserves projection omission and cannot turn unclassified disclosure into a document', () => {
    const route = resolveLocalizedRouteIdentity(
      '/en/systems/vira',
      routeRuntime,
      languageRuntime,
      currentHeads,
    );
    const upstream = projectPublicRecord({
      target: targetForVira(),
      disclosure: { state: 'unclassified' },
      maturity: null,
      route,
    });
    const decision = materializeEditorialDocument(upstream, languageRuntime);
    expect(decision.state).toBe('omitted');
    if (decision.state === 'omitted') {
      expect(decision.reasons).toContain('disclosure-unclassified');
    }
  });

  it('emits metadata-only documents without semantic Record payload', () => {
    const decision = materializeEditorialDocument(
      projection('/en/systems/vira', 'metadata-only'),
      languageRuntime,
    );
    expect(decision.state).toBe('document');
    expect(documentContainsSemanticPayload(decision)).toBe(false);
    if (decision.state !== 'document') return;
    expect(decision.document.content).toEqual({ type: 'metadata-only' });
    expect(decision.document.realization).toBeNull();
    expect(JSON.stringify(decision.document)).not.toContain(viraEntry.payload.summary);
  });

  it('refuses to derive sanitized content from the canonical realization at runtime', () => {
    const decision = materializeEditorialDocument(
      projection('/en/systems/vira', 'sanitized'),
      languageRuntime,
    );
    expect(decision.state).toBe('omitted');
    if (decision.state === 'omitted') {
      expect(decision.reasons).toEqual(['sanitized-content-authority-unavailable']);
    }
  });

  it('does not reuse a stale realization for a different exact Record revision', () => {
    const upstream = projection('/en/systems/vira', 'full');
    expect(upstream.state).toBe('projected');
    if (upstream.state !== 'projected') return;

    const staleTarget: PublicProjectionDecision = {
      state: 'projected',
      dto: {
        ...upstream.dto,
        targetRef: {
          ...upstream.dto.targetRef,
          revisionId: `rev_sha256_${'f'.repeat(64)}` as RevisionId,
        },
      },
    };
    const decision = materializeEditorialDocument(staleTarget, languageRuntime);
    expect(decision.state).toBe('omitted');
    if (decision.state === 'omitted') {
      expect(decision.reasons).toEqual(['content-realization-unavailable']);
    }
  });

  it('preserves redirect semantics instead of manufacturing a document', () => {
    const decision = materializeEditorialDocument({
      state: 'redirect',
      targetRef: {
        type: 'pinned-record',
        recordId: viraRevision.recordId,
        revisionId: viraRevision.revisionId,
      },
      language: 'en',
      canonicalPath: '/en/systems/vira',
      canonicalUrl: 'https://renan.snelabs.space/en/systems/vira',
    }, languageRuntime);

    expect(decision.state).toBe('redirect');
    if (decision.state === 'redirect') {
      expect(decision.canonicalPath).toBe('/en/systems/vira');
    }
  });

  it('freezes the DTO and keeps it a consumer artifact rather than mutable authority', () => {
    const decision = materializeEditorialDocument(
      projection('/en/systems/vira', 'full'),
      languageRuntime,
    );
    expect(decision.state).toBe('document');
    if (decision.state !== 'document') return;
    expect(Object.isFrozen(decision.document)).toBe(true);
    expect(Object.isFrozen(decision.document.content)).toBe(true);
    expect(Object.isFrozen(decision.document.disclosure)).toBe(true);
  });

  it('fails closed when the language runtime itself is conflicted', () => {
    expect(() => materializeEditorialDocument(
      projection('/en/systems/vira', 'full'),
      { ...languageRuntime, state: 'conflict', errors: ['synthetic-conflict'] },
    )).toThrow('language-runtime-conflict');
  });

  it('keeps the current effective editorial document count at zero until disclosure is actually admitted', () => {
    const decisions = routeManifest.assignments.map((assignment) => {
      const route = resolveLocalizedRouteIdentity(
        assignment.path,
        routeRuntime,
        languageRuntime,
        currentHeads,
      );
      if (route.state !== 'resolved') return null;
      const record = records.find((candidate) => candidate.recordId === route.targetRef.recordId);
      if (!record) return null;
      const revision = record.revisions.find((entry) => entry.revision.revisionId === route.targetRef.revisionId)?.revision;
      if (!revision) return null;
      const upstream = projectPublicRecord({
        target: {
          recordId: revision.recordId,
          revisionId: revision.revisionId,
          kind: revision.kind,
          lifecycle: revision.lifecycle,
        },
        disclosure: { state: 'unclassified' },
        maturity: null,
        route,
      });
      return materializeEditorialDocument(upstream, languageRuntime);
    }).filter(Boolean);

    expect(decisions.filter((decision) => decision?.state === 'document')).toHaveLength(0);
    expect(documentManifest.acceptance.currentEditorialDocumentCount).toBe(0);
    expect(documentManifest.acceptance.r1_5Complete).toBe(false);
  });
});
