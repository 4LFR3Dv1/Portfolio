import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import type {
  PinnedRecordRef,
  RecordId,
} from '../app/data/editorial-record-identity';
import type {
  DisclosureMode,
  DisclosurePayload,
  GovernanceProjection,
  MaturityPayload,
  RecordVisibility,
} from '../app/data/editorial-visibility-maturity-disclosure';
import type { RouteIdentityResolution } from '../app/data/editorial-route-language-identity';
import {
  materializeRegistryRecords,
  reconstructRecordRegistry,
  type RecordRegistryManifest,
} from './record-registry';
import {
  PUBLIC_PROJECTION_SCHEMA_VERSION,
  projectPublicRecord,
  projectionContainsCanonicalPayload,
  type ProjectionTargetHead,
} from './projection-engine';

interface R11Completion {
  acceptance: {
    r1_1Complete: true;
    recordRegistryReconstructs: true;
    systemSubjectCoverage: 28;
    nextRequiredCut: 'R1.2 — Projection Engine';
  };
}

function readRepoFile(path: string): string {
  return readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
}

const registryManifest = JSON.parse(
  readRepoFile('docs/editorial/record-registry.v0.json'),
) as RecordRegistryManifest;
const r11Completion = JSON.parse(
  readRepoFile('docs/editorial/R1.1-completion.v0.json'),
) as R11Completion;
const r1Readme = readRepoFile('docs/editorial/R1-README.md');

const bornRecords = materializeRegistryRecords(registryManifest);
const genesisRecord = bornRecords.find((record) => record.subjectKey === 'genesis');
if (!genesisRecord) throw new Error('missing-genesis-record');
const genesisRevision = genesisRecord.revisions[0].revision;

const governanceDisclosureId = 'rec_aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' as RecordId;
const governanceMaturityId = 'rec_bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb' as RecordId;

function targetFromBirth(lifecycle = genesisRevision.lifecycle): ProjectionTargetHead {
  return {
    recordId: genesisRevision.recordId,
    revisionId: genesisRevision.revisionId,
    kind: genesisRevision.kind,
    lifecycle,
  };
}

function pinned(target: ProjectionTargetHead): PinnedRecordRef {
  return {
    type: 'pinned-record',
    recordId: target.recordId,
    revisionId: target.revisionId,
  };
}

function disclosureFor(
  target: ProjectionTargetHead,
  mode: DisclosureMode = 'full',
  record: RecordVisibility = 'public',
): GovernanceProjection<DisclosurePayload> {
  return {
    state: 'classified',
    governanceRecordId: governanceDisclosureId,
    payload: {
      schemaVersion: 'governance.disclosure/v0',
      targetRef: { type: 'record', recordId: target.recordId },
      basisRef: pinned(target),
      visibility: {
        record,
        source: 'unknown',
        evidence: 'unknown',
      },
      disclosure: mode,
      rationale: 'Synthetic R1.2 projection fixture.',
    },
  };
}

function maturityFor(
  target: ProjectionTargetHead,
  stage: MaturityPayload['stage'] = 'research',
): GovernanceProjection<MaturityPayload> {
  return {
    state: 'classified',
    governanceRecordId: governanceMaturityId,
    payload: {
      schemaVersion: 'governance.maturity/v0',
      targetRef: { type: 'record', recordId: target.recordId },
      basisRef: pinned(target),
      stage,
      rationale: 'Synthetic R1.2 maturity fixture.',
    },
  };
}

function resolvedRoute(
  target: ProjectionTargetHead,
  redirect = false,
  canonicalPath = '/en/systems/genesis',
): Extract<RouteIdentityResolution, { state: 'resolved' }> {
  return {
    state: 'resolved',
    targetRef: pinned(target),
    language: 'en',
    canonicalPath,
    redirect,
  };
}

describe('R1.2 Projection Engine', () => {
  it('starts only after R1.1 has sealed the Record Registry', () => {
    expect(r11Completion.acceptance).toMatchObject({
      r1_1Complete: true,
      recordRegistryReconstructs: true,
      systemSubjectCoverage: 28,
      nextRequiredCut: 'R1.2 — Projection Engine',
    });
    expect(reconstructRecordRegistry(registryManifest).errors).toEqual([]);
    expect(r1Readme).toContain('| R1.2 | Projection Engine | **NEXT** |');
  });

  it('fails closed when current disclosure is absent or conflicted', () => {
    const target = targetFromBirth();
    const route = resolvedRoute(target);

    const unclassified = projectPublicRecord({
      target,
      disclosure: { state: 'unclassified' },
      maturity: null,
      route,
    });
    expect(unclassified.state).toBe('omitted');
    if (unclassified.state === 'omitted') {
      expect(unclassified.reasons).toContain('disclosure-unclassified');
    }

    const conflict = projectPublicRecord({
      target,
      disclosure: { state: 'conflict' },
      maturity: null,
      route,
    });
    expect(conflict.state).toBe('omitted');
    if (conflict.state === 'omitted') {
      expect(conflict.reasons).toContain('disclosure-conflict');
    }
  });

  it('blocks private, withheld, withdrawn and tombstoned targets independently of route validity', () => {
    const target = targetFromBirth();
    const route = resolvedRoute(target);

    const privateDecision = projectPublicRecord({
      target,
      disclosure: disclosureFor(target, 'withheld', 'private'),
      maturity: null,
      route,
    });
    expect(privateDecision.state).toBe('omitted');
    if (privateDecision.state === 'omitted') {
      expect(privateDecision.reasons).toContain('record-private');
      expect(privateDecision.reasons).toContain('record-withheld');
    }

    for (const lifecycle of ['withdrawn', 'tombstoned'] as const) {
      const ineligible = targetFromBirth(lifecycle);
      const decision = projectPublicRecord({
        target: ineligible,
        disclosure: disclosureFor(ineligible),
        maturity: null,
        route: resolvedRoute(ineligible),
      });
      expect(decision.state).toBe('omitted');
      if (decision.state === 'omitted') {
        expect(decision.reasons).toContain('target-lifecycle-ineligible');
      }
    }
  });

  it('requires exact current disclosure and exact resolved route identity', () => {
    const target = targetFromBirth();
    const staleDisclosure = disclosureFor(target);
    if (staleDisclosure.state !== 'classified') throw new Error('fixture-disclosure');
    staleDisclosure.payload.basisRef = {
      ...staleDisclosure.payload.basisRef,
      revisionId: `rev_sha256_${'f'.repeat(64)}`,
    };

    const stale = projectPublicRecord({
      target,
      disclosure: staleDisclosure,
      maturity: null,
      route: resolvedRoute(target),
    });
    expect(stale.state).toBe('omitted');
    if (stale.state === 'omitted') {
      expect(stale.reasons).toContain('disclosure-target-mismatch');
    }

    const second = bornRecords[1].revisions[0].revision;
    const wrongRoute: Extract<RouteIdentityResolution, { state: 'resolved' }> = {
      state: 'resolved',
      targetRef: {
        type: 'pinned-record',
        recordId: second.recordId,
        revisionId: second.revisionId,
      },
      language: 'en',
      canonicalPath: '/en/systems/genesis',
      redirect: false,
    };
    const routeMismatch = projectPublicRecord({
      target,
      disclosure: disclosureFor(target),
      maturity: null,
      route: wrongRoute,
    });
    expect(routeMismatch.state).toBe('omitted');
    if (routeMismatch.state === 'omitted') {
      expect(routeMismatch.reasons).toContain('route-target-mismatch');
    }
  });

  it('preserves route and language failures rather than inventing fallback', () => {
    const target = targetFromBirth();
    const disclosure = disclosureFor(target);
    const failures: Array<[RouteIdentityResolution, string]> = [
      [{ state: 'unresolved' }, 'route-unresolved'],
      [{ state: 'head-unavailable', targetRef: { type: 'record', recordId: target.recordId }, language: 'en' }, 'route-head-unavailable'],
      [{ state: 'language-unavailable', targetRef: pinned(target), language: 'en' }, 'language-unavailable'],
      [{ state: 'conflict', targetRef: pinned(target), language: 'en' }, 'route-conflict'],
    ];

    for (const [route, reason] of failures) {
      const decision = projectPublicRecord({ target, disclosure, maturity: null, route });
      expect(decision.state).toBe('omitted');
      if (decision.state === 'omitted') expect(decision.reasons).toContain(reason);
    }
  });

  it('projects only bounded public metadata and never canonical payload, governance rationale or registry provenance', () => {
    const target = targetFromBirth();
    const decision = projectPublicRecord({
      target,
      disclosure: disclosureFor(target, 'metadata-only'),
      maturity: maturityFor(target, 'research'),
      route: resolvedRoute(target),
    });

    expect(decision.state).toBe('projected');
    if (decision.state !== 'projected') return;

    expect(decision.dto.schemaVersion).toBe(PUBLIC_PROJECTION_SCHEMA_VERSION);
    expect(decision.dto.targetRef).toEqual(pinned(target));
    expect(decision.dto.disclosure).toEqual({
      mode: 'metadata-only',
      source: 'unknown',
      evidence: 'unknown',
    });
    expect(decision.dto.maturity).toEqual({ state: 'classified', stage: 'research' });
    expect(decision.dto.contentPolicy).toEqual({
      mode: 'metadata-only',
      payloadIncluded: false,
      runtimeSanitizationAllowed: false,
    });
    expect(projectionContainsCanonicalPayload(decision)).toBe(false);

    const serialized = JSON.stringify(decision.dto);
    expect(serialized).not.toContain('rationale');
    expect(serialized).not.toContain('groundingCluster');
    expect(serialized).not.toContain('identityDecision');
    expect(serialized).not.toContain('Durable System subject admitted');
  });

  it('treats sanitized disclosure as admission, never as a runtime redaction instruction', () => {
    const target = targetFromBirth();
    const decision = projectPublicRecord({
      target,
      disclosure: disclosureFor(target, 'sanitized'),
      maturity: { state: 'unclassified' },
      route: resolvedRoute(target),
    });

    expect(decision.state).toBe('projected');
    if (decision.state !== 'projected') return;
    expect(decision.dto.disclosure.mode).toBe('sanitized');
    expect(decision.dto.contentPolicy).toEqual({
      mode: 'sanitized',
      payloadIncluded: false,
      runtimeSanitizationAllowed: false,
    });
  });

  it('does not make maturity an exposure gate and preserves maturity uncertainty', () => {
    const target = targetFromBirth();

    const unclassified = projectPublicRecord({
      target,
      disclosure: disclosureFor(target),
      maturity: { state: 'unclassified' },
      route: resolvedRoute(target),
    });
    expect(unclassified.state).toBe('projected');
    if (unclassified.state === 'projected') {
      expect(unclassified.dto.maturity).toEqual({ state: 'unclassified' });
    }

    const conflict = projectPublicRecord({
      target,
      disclosure: disclosureFor(target),
      maturity: { state: 'conflict' },
      route: resolvedRoute(target),
    });
    expect(conflict.state).toBe('projected');
    if (conflict.state === 'projected') {
      expect(conflict.dto.maturity).toEqual({ state: 'conflict' });
    }
  });

  it('turns an admitted alias into a redirect decision instead of a duplicate projected document', () => {
    const target = targetFromBirth();
    const decision = projectPublicRecord({
      target,
      disclosure: disclosureFor(target),
      maturity: null,
      route: resolvedRoute(target, true),
    });

    expect(decision).toEqual({
      state: 'redirect',
      targetRef: pinned(target),
      language: 'en',
      canonicalPath: '/en/systems/genesis',
      canonicalUrl: 'https://renan.snelabs.space/en/systems/genesis',
    });
  });

  it('rejects malformed canonical paths even if an upstream caller labels the route resolved', () => {
    const target = targetFromBirth();
    const decision = projectPublicRecord({
      target,
      disclosure: disclosureFor(target),
      maturity: null,
      route: resolvedRoute(target, false, '/EN/systems/genesis'),
    });

    expect(decision.state).toBe('omitted');
    if (decision.state === 'omitted') {
      expect(decision.reasons).toContain('route-invalid-canonical-path');
    }
  });

  it('keeps the newly born R1 registry non-public until disclosure, route and language authority are explicitly admitted', () => {
    const decisions = bornRecords.map((record) => {
      const revision = record.revisions[0].revision;
      const target: ProjectionTargetHead = {
        recordId: revision.recordId,
        revisionId: revision.revisionId,
        kind: revision.kind,
        lifecycle: revision.lifecycle,
      };
      return projectPublicRecord({
        target,
        disclosure: { state: 'unclassified' },
        maturity: null,
        route: { state: 'unresolved' },
      });
    });

    expect(bornRecords).toHaveLength(28);
    expect(registryManifest.admission.otherRecordBirthCount).toBe(0);
    expect(decisions.filter((decision) => decision.state === 'projected')).toHaveLength(0);
    expect(decisions.filter((decision) => decision.state === 'redirect')).toHaveLength(0);
    expect(decisions.every((decision) => decision.state === 'omitted')).toBe(true);
  });
});
