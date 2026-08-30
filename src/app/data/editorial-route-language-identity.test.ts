import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  LANGUAGE_ROUTE_SEGMENTS,
  LANGUAGE_TAGS,
  RECORD_ROUTE_NAMESPACES,
  canonicalUrlForPath,
  deriveLanguageAvailability,
  parseRecordPath,
  resolveRouteIdentity,
  serializeRouteLanguageEntry,
  validateLanguageBinding,
  validateLanguageRegistry,
  validateRouteBinding,
  validateRouteRegistry,
  validateRouteRegistryEvolution,
  type CurrentRecordHead,
  type LanguageBinding,
  type RouteBinding,
  type RouteLanguageEntry,
  type RouteLanguageEntryKind,
  type RouteLanguageRevisionIndexEntry,
} from './editorial-route-language-identity';
import type {
  PayloadDigest,
  PinnedRecordRef,
  RecordId,
  RevisionId,
} from './editorial-record-identity';

interface ContractManifest {
  status: string;
  normative: boolean;
  preconditions: { r0_6Complete: boolean };
  recordKindsAdded: string[];
  languages: {
    tags: string[];
    routeSegments: Record<string, string>;
    implicitFallback: boolean;
    translationRequired: boolean;
    canonicalPerExactRevision: boolean;
  };
  routes: {
    origin: string;
    grammar: string;
    namespaces: string[];
    roleValues: string[];
    oneCanonicalPerRecordLanguage: boolean;
    historicalPathReassignmentAllowed: boolean;
    unknownPathResolution: string;
    canonicalPathAllowsQueryOrFragment: boolean;
  };
  laws: Array<{ id: string; title: string; rule: string }>;
  testVectors: Array<{
    kind: RouteLanguageEntryKind;
    entry: RouteLanguageEntry;
    expectedDigest: string;
  }>;
  ciWitness: null | {
    workflow: string;
    runId: number;
    commit: string;
    conclusion: string;
  };
  acceptance: {
    r0_6Preserved: boolean;
    runtimeSemanticsChanged: boolean;
    uiChanged: boolean;
    r0_7Complete: boolean;
  };
}

interface PriorManifest {
  status: string;
  acceptance: { r0_6Complete: boolean };
}

function readRepoFile(path: string): string {
  return readFileSync(new URL(`../../../${path}`, import.meta.url), 'utf8');
}

const contract = JSON.parse(
  readRepoFile('docs/editorial/route-language-identity.v0.json'),
) as ContractManifest;

const prior = JSON.parse(
  readRepoFile('docs/editorial/visibility-maturity-disclosure.v0.json'),
) as PriorManifest;

const rec = (suffix: string): RecordId =>
  `rec_${suffix.padStart(32, '0')}` as RecordId;

const rev = (hex: string): RevisionId =>
  `rev_sha256_${hex.repeat(64).slice(0, 64)}` as RevisionId;

const digest = (hex: string): PayloadDigest =>
  `sha256_${hex.repeat(64).slice(0, 64)}` as PayloadDigest;

const pinned = (suffix: string, hex: string): PinnedRecordRef => ({
  type: 'pinned-record',
  recordId: rec(suffix),
  revisionId: rev(hex),
});

function indexEntry(
  ref: PinnedRecordRef,
  kind: string,
  payloadDigest: PayloadDigest = digest('1'),
  publicationType?: RouteLanguageRevisionIndexEntry['publicationType'],
): RouteLanguageRevisionIndexEntry {
  return {
    recordId: ref.recordId,
    revisionId: ref.revisionId,
    kind,
    payloadDigest,
    ...(publicationType ? { publicationType } : {}),
  };
}

const systemBasis = pinned('1', 'a');

const canonicalLanguage: LanguageBinding = {
  schemaVersion: 'identity.language-binding/v0',
  targetRef: { type: 'record', recordId: rec('1') },
  basisRef: systemBasis,
  language: 'pt-BR',
  role: 'canonical',
  translatedFrom: null,
  realizationDigest: digest('1'),
};

const englishTranslation: LanguageBinding = {
  schemaVersion: 'identity.language-binding/v0',
  targetRef: { type: 'record', recordId: rec('1') },
  basisRef: systemBasis,
  language: 'en',
  role: 'translation',
  translatedFrom: 'pt-BR',
  realizationDigest: digest('2'),
};

const canonicalRoute: RouteBinding = {
  schemaVersion: 'identity.route-binding/v0',
  path: '/pt-br/systems/genesis',
  targetRef: { type: 'record', recordId: rec('1') },
  admittedAgainst: systemBasis,
  language: 'pt-BR',
  role: 'canonical',
};

const englishRoute: RouteBinding = {
  schemaVersion: 'identity.route-binding/v0',
  path: '/en/systems/genesis',
  targetRef: { type: 'record', recordId: rec('1') },
  admittedAgainst: systemBasis,
  language: 'en',
  role: 'canonical',
};

function entryDigest(kind: RouteLanguageEntryKind, entry: RouteLanguageEntry): string {
  return `sha256_${createHash('sha256').update(serializeRouteLanguageEntry(kind, entry)).digest('hex')}`;
}

describe('R0.7 Route + Language Identity', () => {
  it('preserves R0.6 and adds zero RecordKinds', () => {
    expect(prior.status).toBe('frozen');
    expect(prior.acceptance.r0_6Complete).toBe(true);
    expect(contract.preconditions.r0_6Complete).toBe(true);
    expect(contract.recordKindsAdded).toEqual([]);
  });

  it('freezes explicit pt-BR and en route-language identity', () => {
    expect(LANGUAGE_TAGS).toEqual(['pt-BR', 'en']);
    expect(LANGUAGE_ROUTE_SEGMENTS).toEqual({ 'pt-BR': 'pt-br', en: 'en' });
    expect(contract.languages.tags).toEqual(['pt-BR', 'en']);
    expect(contract.languages.implicitFallback).toBe(false);
    expect(contract.languages.translationRequired).toBe(false);
  });

  it('parses only the canonical Record route grammar', () => {
    expect(parseRecordPath('/pt-br/systems/genesis')).toEqual({
      language: 'pt-BR',
      namespace: 'systems',
      slug: 'genesis',
    });
    expect(parseRecordPath('/en/research/evidence-and-authority')).toEqual({
      language: 'en',
      namespace: 'research',
      slug: 'evidence-and-authority',
    });

    expect(parseRecordPath('/pt/systems/genesis')).toBeNull();
    expect(parseRecordPath('/PT-BR/systems/genesis')).toBeNull();
    expect(parseRecordPath('/pt-br/systems/genesis/')).toBeNull();
    expect(parseRecordPath('/pt-br/systems/genesis?x=1')).toBeNull();
    expect(parseRecordPath('/pt-br/systems/genesis#x')).toBeNull();
    expect(parseRecordPath('/pt-br/systems/g%65nesis')).toBeNull();
    expect(parseRecordPath('/pt-br/unknown/genesis')).toBeNull();

    expect(RECORD_ROUTE_NAMESPACES).toEqual([
      'systems',
      'questions',
      'investigations',
      'experiments',
      'essays',
      'research',
      'notes',
      'architecture',
    ]);
  });

  it('derives canonical URLs without making URL the Record identity', () => {
    expect(canonicalUrlForPath('/pt-br/systems/genesis')).toBe(
      'https://renan.snelabs.space/pt-br/systems/genesis',
    );
    expect(canonicalUrlForPath('/pt-br/systems/genesis/')).toBeNull();
    expect(contract.routes.origin).toBe('https://renan.snelabs.space');
  });

  it('requires exact logical target and pinned route-admission basis for the same Record', () => {
    expect(validateRouteBinding(canonicalRoute)).toEqual([]);
    expect(validateRouteBinding({
      ...canonicalRoute,
      admittedAgainst: pinned('2', 'a'),
    })).toContain('admission-target-mismatch');

    expect(validateRouteBinding({
      ...canonicalRoute,
      language: 'en',
    })).toContain('path-language-mismatch');

    expect(validateRouteBinding({
      ...canonicalRoute,
      path: '/pt-br/systems/Genesis',
    })).toContain('path');
  });

  it('requires exact revision-bound language bindings', () => {
    expect(validateLanguageBinding(canonicalLanguage)).toEqual([]);
    expect(validateLanguageBinding(englishTranslation)).toEqual([]);

    expect(validateLanguageBinding({
      ...canonicalLanguage,
      basisRef: pinned('2', 'a'),
    })).toContain('basis-target-mismatch');

    expect(validateLanguageBinding({
      ...canonicalLanguage,
      role: 'canonical',
      translatedFrom: 'en',
    })).toContain('canonical-translated-from');

    expect(validateLanguageBinding({
      ...englishTranslation,
      translatedFrom: 'en',
    })).toContain('translation-self-source');
  });

  it('enforces namespace and target-kind compatibility', () => {
    expect(validateRouteRegistry(
      [canonicalRoute, englishRoute],
      [indexEntry(systemBasis, 'knowledge.system')],
    )).toEqual([]);

    const essayRef = pinned('2', 'b');
    const essayRoute: RouteBinding = {
      ...canonicalRoute,
      path: '/pt-br/essays/identity-as-lineage',
      targetRef: { type: 'record', recordId: essayRef.recordId },
      admittedAgainst: essayRef,
    };

    expect(validateRouteRegistry(
      [essayRoute],
      [indexEntry(essayRef, 'representation.publication', digest('3'), 'essay')],
    )).toEqual([]);

    expect(validateRouteRegistry(
      [essayRoute],
      [indexEntry(essayRef, 'representation.publication', digest('3'), 'system-note')],
    )).toContain(`${essayRoute.path}:target-kind`);
  });

  it('requires exactly one canonical route for each registered Record/language pair', () => {
    expect(validateRouteRegistry(
      [canonicalRoute, { ...canonicalRoute, path: '/pt-br/systems/genesis-runtime', role: 'alias' }],
      [indexEntry(systemBasis, 'knowledge.system')],
    )).toEqual([]);

    expect(validateRouteRegistry(
      [
        canonicalRoute,
        { ...canonicalRoute, path: '/pt-br/systems/genesis-runtime', role: 'canonical' },
      ],
      [indexEntry(systemBasis, 'knowledge.system')],
    )).toContain(`${rec('1')}:pt-BR:canonical-route-count`);
  });

  it('preserves historical paths while allowing canonical movement', () => {
    const nextCanonical: RouteBinding = {
      ...canonicalRoute,
      path: '/pt-br/systems/genesis-runtime',
      role: 'canonical',
    };
    const oldAsAlias: RouteBinding = { ...canonicalRoute, role: 'alias' };

    expect(validateRouteRegistryEvolution(
      [canonicalRoute],
      [oldAsAlias, nextCanonical],
    )).toEqual([]);

    expect(validateRouteRegistryEvolution(
      [canonicalRoute],
      [nextCanonical],
    )).toContain(`${canonicalRoute.path}:historical-path-dropped`);

    expect(validateRouteRegistryEvolution(
      [canonicalRoute],
      [{
        ...oldAsAlias,
        targetRef: { type: 'record', recordId: rec('2') },
      }],
    )).toContain(`${canonicalRoute.path}:historical-path-reassigned`);

    expect(validateRouteRegistryEvolution(
      [canonicalRoute],
      [{ ...oldAsAlias, admittedAgainst: pinned('1', 'b') }],
    )).toContain(`${canonicalRoute.path}:admission-basis-rewritten`);
  });

  it('requires exactly one canonical language per exact revision and validates translation source', () => {
    const index = [indexEntry(systemBasis, 'knowledge.system', digest('1'))];
    expect(validateLanguageRegistry([canonicalLanguage, englishTranslation], index)).toEqual([]);

    expect(validateLanguageRegistry([
      canonicalLanguage,
      { ...englishTranslation, translatedFrom: 'en' },
    ], index)).toContain(
      `${systemBasis.recordId}:${systemBasis.revisionId}:en:translation-source-missing`,
    );

    expect(validateLanguageRegistry([
      { ...canonicalLanguage, realizationDigest: digest('9') },
      englishTranslation,
    ], index)).toContain(`${systemBasis.recordId}:canonical-digest-mismatch`);
  });

  it('does not require a translation', () => {
    const index = [indexEntry(systemBasis, 'knowledge.system', digest('1'))];
    expect(validateLanguageRegistry([canonicalLanguage], index)).toEqual([]);
    expect(contract.languages.translationRequired).toBe(false);
  });

  it('never falls back implicitly to another language', () => {
    expect(deriveLanguageAvailability(systemBasis, 'pt-BR', [canonicalLanguage])).toBe('canonical');
    expect(deriveLanguageAvailability(systemBasis, 'en', [canonicalLanguage])).toBe('unavailable');
    expect(contract.languages.implicitFallback).toBe(false);
  });

  it('invalidates stale language availability when the Record head advances', () => {
    const nextHead = pinned('1', 'b');
    expect(deriveLanguageAvailability(nextHead, 'pt-BR', [canonicalLanguage])).toBe('unavailable');
    expect(deriveLanguageAvailability(nextHead, 'en', [canonicalLanguage, englishTranslation])).toBe('unavailable');
  });

  it('resolves aliases to the canonical path for the same Record and language', () => {
    const alias: RouteBinding = {
      ...canonicalRoute,
      path: '/pt-br/systems/genesis-runtime',
      role: 'alias',
    };
    const currentHeads: CurrentRecordHead[] = [{
      recordId: systemBasis.recordId,
      revisionId: systemBasis.revisionId,
    }];

    expect(resolveRouteIdentity(
      alias.path,
      [canonicalRoute, alias],
      currentHeads,
      [canonicalLanguage],
    )).toEqual({
      state: 'resolved',
      targetRef: systemBasis,
      language: 'pt-BR',
      canonicalPath: canonicalRoute.path,
      redirect: true,
    });
  });

  it('treats an unknown path as unresolved instead of landing fallback', () => {
    expect(resolveRouteIdentity('/pt-br/systems/unknown', [], [], [])).toEqual({ state: 'unresolved' });
    expect(contract.routes.unknownPathResolution).toBe('unresolved');
  });

  it('keeps logical route identity while requiring a language binding for the current head', () => {
    const nextHead = pinned('1', 'b');
    const heads: CurrentRecordHead[] = [{
      recordId: nextHead.recordId,
      revisionId: nextHead.revisionId,
    }];

    expect(resolveRouteIdentity(
      canonicalRoute.path,
      [canonicalRoute],
      heads,
      [canonicalLanguage],
    )).toEqual({
      state: 'language-unavailable',
      targetRef: nextHead,
      language: 'pt-BR',
    });
  });

  it('reproduces both canonical registry-entry SHA-256 vectors', () => {
    expect(contract.testVectors).toHaveLength(2);
    for (const vector of contract.testVectors) {
      expect(entryDigest(vector.kind, vector.entry)).toBe(vector.expectedDigest);
    }
  });

  it('freezes exactly twenty contiguous RLI laws', () => {
    const expected = Array.from({ length: 20 }, (_, index) => `RLI-${String(index + 1).padStart(2, '0')}`);
    expect(contract.laws.map((law) => law.id)).toEqual(expected);
    expect(new Set(contract.laws.map((law) => law.title)).size).toBe(20);
    for (const law of contract.laws) {
      expect(law.rule.length).toBeGreaterThan(50);
      expect(law.rule).toMatch(/\b(MUST|MAY)\b/);
    }
  });

  it('materializes without changing UI/runtime and waits for CI witness before completion', () => {
    expect(contract.normative).toBe(true);
    expect(contract.status).toBe('materialized');
    expect(contract.ciWitness).toBeNull();
    expect(contract.acceptance.r0_6Preserved).toBe(true);
    expect(contract.acceptance.runtimeSemanticsChanged).toBe(false);
    expect(contract.acceptance.uiChanged).toBe(false);
    expect(contract.acceptance.r0_7Complete).toBe(false);
  });
});
