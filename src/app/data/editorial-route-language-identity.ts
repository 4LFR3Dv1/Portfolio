import {
  isPayloadDigest,
  isValidPinnedRecordRef,
  isValidRecordRef,
  type PayloadDigest,
  type PinnedRecordRef,
  type RecordId,
  type RecordRef,
  type RevisionId,
} from './editorial-record-identity';
import type { PublicationType } from './editorial-publication-architecture';

export const ROUTE_LANGUAGE_CONTRACT_VERSION = 'editorial-route-language-identity/v0' as const;

export const LANGUAGE_TAGS = ['pt-BR', 'en'] as const;
export type LanguageTag = (typeof LANGUAGE_TAGS)[number];

export const LANGUAGE_ROUTE_SEGMENTS: Readonly<Record<LanguageTag, string>> = {
  'pt-BR': 'pt-br',
  en: 'en',
};

export const ROUTE_ROLES = ['canonical', 'alias'] as const;
export type RouteRole = (typeof ROUTE_ROLES)[number];

export const LANGUAGE_ROLES = ['canonical', 'translation'] as const;
export type LanguageRole = (typeof LANGUAGE_ROLES)[number];

export const RECORD_ROUTE_NAMESPACES = [
  'systems',
  'questions',
  'investigations',
  'experiments',
  'essays',
  'research',
  'notes',
  'architecture',
] as const;
export type RecordRouteNamespace = (typeof RECORD_ROUTE_NAMESPACES)[number];

export interface RouteBinding {
  schemaVersion: 'identity.route-binding/v0';
  path: string;
  targetRef: RecordRef;
  admittedAgainst: PinnedRecordRef;
  language: LanguageTag;
  role: RouteRole;
}

export interface LanguageBinding {
  schemaVersion: 'identity.language-binding/v0';
  targetRef: RecordRef;
  basisRef: PinnedRecordRef;
  language: LanguageTag;
  role: LanguageRole;
  translatedFrom: LanguageTag | null;
  realizationDigest: PayloadDigest;
}

export type RouteLanguageEntry = RouteBinding | LanguageBinding;
export type RouteLanguageEntryKind = 'route-binding' | 'language-binding';

export interface RouteLanguageRevisionIndexEntry {
  recordId: RecordId;
  revisionId: RevisionId;
  kind: string;
  payloadDigest: PayloadDigest;
  publicationType?: PublicationType;
}

export interface CurrentRecordHead {
  recordId: RecordId;
  revisionId: RevisionId;
}

export interface ParsedRecordPath {
  language: LanguageTag;
  namespace: RecordRouteNamespace;
  slug: string;
}

export type RouteIdentityResolution =
  | { state: 'unresolved' }
  | { state: 'head-unavailable'; targetRef: RecordRef; language: LanguageTag }
  | { state: 'language-unavailable'; targetRef: PinnedRecordRef; language: LanguageTag }
  | { state: 'conflict'; targetRef: PinnedRecordRef; language: LanguageTag }
  | {
      state: 'resolved';
      targetRef: PinnedRecordRef;
      language: LanguageTag;
      canonicalPath: string;
      redirect: boolean;
    };

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MAX_SLUG_LENGTH = 80;
const SITE_ORIGIN = 'https://renan.snelabs.space';

function hasExactFields(value: object, expected: readonly string[]): boolean {
  const actual = Object.keys(value).sort();
  const wanted = [...expected].sort();
  return actual.length === wanted.length && actual.every((field, index) => field === wanted[index]);
}

function isExactRecordRef(value: unknown): value is RecordRef {
  return typeof value === 'object'
    && value !== null
    && !Array.isArray(value)
    && hasExactFields(value, ['type', 'recordId'])
    && isValidRecordRef(value as RecordRef);
}

function isExactPinnedRef(value: unknown): value is PinnedRecordRef {
  return typeof value === 'object'
    && value !== null
    && !Array.isArray(value)
    && hasExactFields(value, ['type', 'recordId', 'revisionId'])
    && isValidPinnedRecordRef(value as PinnedRecordRef);
}

function isLanguageTag(value: unknown): value is LanguageTag {
  return (LANGUAGE_TAGS as readonly unknown[]).includes(value);
}

function isRouteRole(value: unknown): value is RouteRole {
  return (ROUTE_ROLES as readonly unknown[]).includes(value);
}

function isLanguageRole(value: unknown): value is LanguageRole {
  return (LANGUAGE_ROLES as readonly unknown[]).includes(value);
}

function samePinnedRef(left: PinnedRecordRef, right: PinnedRecordRef): boolean {
  return left.recordId === right.recordId && left.revisionId === right.revisionId;
}

function sameRouteTarget(left: RouteBinding, right: RouteBinding): boolean {
  return left.targetRef.recordId === right.targetRef.recordId && left.language === right.language;
}

function localeFromSegment(segment: string): LanguageTag | null {
  for (const language of LANGUAGE_TAGS) {
    if (LANGUAGE_ROUTE_SEGMENTS[language] === segment) return language;
  }
  return null;
}

export function parseRecordPath(path: string): ParsedRecordPath | null {
  if (!path.startsWith('/')) return null;
  if (path === '/' || path.endsWith('/')) return null;
  if (path.includes('?') || path.includes('#') || path.includes('%')) return null;
  if (path !== path.toLowerCase()) return null;
  if (!/^[\x20-\x7e]+$/.test(path)) return null;

  const segments = path.slice(1).split('/');
  if (segments.length !== 3) return null;

  const language = localeFromSegment(segments[0]);
  if (!language) return null;

  if (!(RECORD_ROUTE_NAMESPACES as readonly string[]).includes(segments[1])) return null;
  const namespace = segments[1] as RecordRouteNamespace;

  const slug = segments[2];
  if (slug.length === 0 || slug.length > MAX_SLUG_LENGTH || !SLUG_PATTERN.test(slug)) return null;

  return { language, namespace, slug };
}

export function canonicalUrlForPath(path: string): string | null {
  return parseRecordPath(path) ? `${SITE_ORIGIN}${path}` : null;
}

export function validateRouteBinding(binding: unknown): string[] {
  const errors: string[] = [];
  if (typeof binding !== 'object' || binding === null || Array.isArray(binding)) return ['binding-object'];

  if (!hasExactFields(binding, ['schemaVersion', 'path', 'targetRef', 'admittedAgainst', 'language', 'role'])) {
    errors.push('binding-fields');
  }

  const candidate = binding as Record<string, unknown>;
  if (candidate.schemaVersion !== 'identity.route-binding/v0') errors.push('schema-version');
  if (typeof candidate.path !== 'string' || !parseRecordPath(candidate.path)) errors.push('path');
  if (!isExactRecordRef(candidate.targetRef)) errors.push('target-ref');
  if (!isExactPinnedRef(candidate.admittedAgainst)) errors.push('admitted-against');
  if (!isLanguageTag(candidate.language)) errors.push('language');
  if (!isRouteRole(candidate.role)) errors.push('route-role');

  if (
    isExactRecordRef(candidate.targetRef)
    && isExactPinnedRef(candidate.admittedAgainst)
    && candidate.targetRef.recordId !== candidate.admittedAgainst.recordId
  ) {
    errors.push('admission-target-mismatch');
  }

  if (typeof candidate.path === 'string' && isLanguageTag(candidate.language)) {
    const parsed = parseRecordPath(candidate.path);
    if (parsed && parsed.language !== candidate.language) errors.push('path-language-mismatch');
  }

  return [...new Set(errors)];
}

export function validateLanguageBinding(binding: unknown): string[] {
  const errors: string[] = [];
  if (typeof binding !== 'object' || binding === null || Array.isArray(binding)) return ['binding-object'];

  if (!hasExactFields(binding, [
    'schemaVersion',
    'targetRef',
    'basisRef',
    'language',
    'role',
    'translatedFrom',
    'realizationDigest',
  ])) {
    errors.push('binding-fields');
  }

  const candidate = binding as Record<string, unknown>;
  if (candidate.schemaVersion !== 'identity.language-binding/v0') errors.push('schema-version');
  if (!isExactRecordRef(candidate.targetRef)) errors.push('target-ref');
  if (!isExactPinnedRef(candidate.basisRef)) errors.push('basis-ref');
  if (!isLanguageTag(candidate.language)) errors.push('language');
  if (!isLanguageRole(candidate.role)) errors.push('language-role');
  if (typeof candidate.realizationDigest !== 'string' || !isPayloadDigest(candidate.realizationDigest)) {
    errors.push('realization-digest');
  }

  if (
    isExactRecordRef(candidate.targetRef)
    && isExactPinnedRef(candidate.basisRef)
    && candidate.targetRef.recordId !== candidate.basisRef.recordId
  ) {
    errors.push('basis-target-mismatch');
  }

  if (candidate.role === 'canonical') {
    if (candidate.translatedFrom !== null) errors.push('canonical-translated-from');
  } else if (candidate.role === 'translation') {
    if (!isLanguageTag(candidate.translatedFrom)) {
      errors.push('translation-source-language');
    } else if (candidate.translatedFrom === candidate.language) {
      errors.push('translation-self-source');
    }
  }

  return [...new Set(errors)];
}

function routeCompatibility(
  parsed: ParsedRecordPath,
  target: RouteLanguageRevisionIndexEntry,
): boolean {
  if (parsed.namespace === 'systems') return target.kind === 'knowledge.system';
  if (parsed.namespace === 'questions') return target.kind === 'knowledge.question';
  if (parsed.namespace === 'investigations') return target.kind === 'knowledge.investigation';
  if (parsed.namespace === 'experiments') return target.kind === 'knowledge.experiment';
  if (parsed.namespace === 'architecture') return target.kind === 'representation.architecture';

  if (target.kind !== 'representation.publication') return false;
  if (parsed.namespace === 'essays') return target.publicationType === 'essay';
  if (parsed.namespace === 'notes') return target.publicationType === 'system-note';
  if (parsed.namespace === 'research') {
    return target.publicationType === 'research-note'
      || target.publicationType === 'experiment-report'
      || target.publicationType === 'technical-paper';
  }

  return false;
}

function exactIndexEntry(
  ref: PinnedRecordRef,
  index: readonly RouteLanguageRevisionIndexEntry[],
): RouteLanguageRevisionIndexEntry | undefined {
  return index.find((entry) => entry.recordId === ref.recordId && entry.revisionId === ref.revisionId);
}

export function validateLanguageRegistry(
  bindings: readonly LanguageBinding[],
  index: readonly RouteLanguageRevisionIndexEntry[],
): string[] {
  const errors: string[] = [];
  const perRevisionLanguage = new Set<string>();
  const perRevision = new Map<string, LanguageBinding[]>();

  for (const binding of bindings) {
    for (const error of validateLanguageBinding(binding)) {
      errors.push(`${binding.targetRef.recordId}:${error}`);
    }

    const target = exactIndexEntry(binding.basisRef, index);
    if (!target) {
      errors.push(`${binding.targetRef.recordId}:basis-unresolved`);
      continue;
    }

    if (![
      'knowledge.system',
      'knowledge.question',
      'knowledge.investigation',
      'knowledge.experiment',
      'knowledge.claim',
      'representation.publication',
      'representation.architecture',
    ].includes(target.kind)) {
      errors.push(`${binding.targetRef.recordId}:language-target-kind:${target.kind}`);
    }

    if (binding.role === 'canonical' && binding.realizationDigest !== target.payloadDigest) {
      errors.push(`${binding.targetRef.recordId}:canonical-digest-mismatch`);
    }

    const uniqueKey = `${binding.basisRef.recordId}:${binding.basisRef.revisionId}:${binding.language}`;
    if (perRevisionLanguage.has(uniqueKey)) {
      errors.push(`${binding.targetRef.recordId}:duplicate-language`);
    } else {
      perRevisionLanguage.add(uniqueKey);
    }

    const revisionKey = `${binding.basisRef.recordId}:${binding.basisRef.revisionId}`;
    const group = perRevision.get(revisionKey) ?? [];
    group.push(binding);
    perRevision.set(revisionKey, group);
  }

  for (const [revisionKey, group] of perRevision) {
    const canonical = group.filter((binding) => binding.role === 'canonical');
    if (canonical.length !== 1) errors.push(`${revisionKey}:canonical-language-count`);

    for (const binding of group.filter((candidate) => candidate.role === 'translation')) {
      const source = canonical.find((candidate) => candidate.language === binding.translatedFrom);
      if (!source) errors.push(`${revisionKey}:${binding.language}:translation-source-missing`);
    }
  }

  return [...new Set(errors)];
}

export function validateRouteRegistry(
  bindings: readonly RouteBinding[],
  index: readonly RouteLanguageRevisionIndexEntry[],
): string[] {
  const errors: string[] = [];
  const paths = new Set<string>();
  const byTargetLanguage = new Map<string, RouteBinding[]>();

  for (const binding of bindings) {
    for (const error of validateRouteBinding(binding)) {
      errors.push(`${binding.path}:${error}`);
    }

    if (paths.has(binding.path)) {
      errors.push(`${binding.path}:duplicate-path`);
    } else {
      paths.add(binding.path);
    }

    const target = exactIndexEntry(binding.admittedAgainst, index);
    if (!target) {
      errors.push(`${binding.path}:admission-ref-unresolved`);
    } else {
      const parsed = parseRecordPath(binding.path);
      if (parsed && !routeCompatibility(parsed, target)) {
        errors.push(`${binding.path}:target-kind`);
      }
    }

    const key = `${binding.targetRef.recordId}:${binding.language}`;
    const group = byTargetLanguage.get(key) ?? [];
    group.push(binding);
    byTargetLanguage.set(key, group);
  }

  for (const [key, group] of byTargetLanguage) {
    const canonical = group.filter((binding) => binding.role === 'canonical');
    if (canonical.length !== 1) errors.push(`${key}:canonical-route-count`);
  }

  return [...new Set(errors)];
}

export function validateRouteRegistryEvolution(
  previous: readonly RouteBinding[],
  next: readonly RouteBinding[],
): string[] {
  const errors: string[] = [];
  const nextByPath = new Map(next.map((binding) => [binding.path, binding]));

  for (const prior of previous) {
    const candidate = nextByPath.get(prior.path);
    if (!candidate) {
      errors.push(`${prior.path}:historical-path-dropped`);
      continue;
    }

    if (!sameRouteTarget(prior, candidate)) errors.push(`${prior.path}:historical-path-reassigned`);
    if (!samePinnedRef(prior.admittedAgainst, candidate.admittedAgainst)) {
      errors.push(`${prior.path}:admission-basis-rewritten`);
    }
  }

  return [...new Set(errors)];
}

function sameHead(binding: LanguageBinding, head: PinnedRecordRef): boolean {
  return samePinnedRef(binding.basisRef, head);
}

export function deriveLanguageAvailability(
  targetHeadRef: PinnedRecordRef,
  language: LanguageTag,
  bindings: readonly LanguageBinding[],
): 'unavailable' | 'canonical' | 'translation' | 'conflict' {
  const matching = bindings.filter((binding) =>
    binding.targetRef.recordId === targetHeadRef.recordId
    && sameHead(binding, targetHeadRef)
    && binding.language === language,
  );

  if (matching.length === 0) return 'unavailable';
  if (matching.length > 1) return 'conflict';
  return matching[0].role;
}

export function resolveRouteIdentity(
  path: string,
  routes: readonly RouteBinding[],
  currentHeads: readonly CurrentRecordHead[],
  languages: readonly LanguageBinding[],
): RouteIdentityResolution {
  const route = routes.find((candidate) => candidate.path === path);
  if (!route) return { state: 'unresolved' };

  const head = currentHeads.find((candidate) => candidate.recordId === route.targetRef.recordId);
  if (!head) {
    return { state: 'head-unavailable', targetRef: route.targetRef, language: route.language };
  }

  const targetRef: PinnedRecordRef = {
    type: 'pinned-record',
    recordId: head.recordId,
    revisionId: head.revisionId,
  };

  const availability = deriveLanguageAvailability(targetRef, route.language, languages);
  if (availability === 'unavailable') {
    return { state: 'language-unavailable', targetRef, language: route.language };
  }
  if (availability === 'conflict') {
    return { state: 'conflict', targetRef, language: route.language };
  }

  const canonical = routes.filter((candidate) =>
    candidate.targetRef.recordId === route.targetRef.recordId
    && candidate.language === route.language
    && candidate.role === 'canonical',
  );

  if (canonical.length !== 1) {
    return { state: 'conflict', targetRef, language: route.language };
  }

  return {
    state: 'resolved',
    targetRef,
    language: route.language,
    canonicalPath: canonical[0].path,
    redirect: route.role === 'alias',
  };
}

type CanonicalJson = null | boolean | number | string | CanonicalJson[] | { [key: string]: CanonicalJson };

function canonicalJson(value: CanonicalJson): string {
  if (
    value === null
    || typeof value === 'boolean'
    || typeof value === 'number'
    || typeof value === 'string'
  ) {
    if (typeof value === 'number' && !Number.isFinite(value)) throw new Error('non-finite-number');
    return JSON.stringify(value) as string;
  }
  if (Array.isArray(value)) return `[${value.map((item) => canonicalJson(item)).join(',')}]`;
  const keys = Object.keys(value).sort();
  return `{${keys.map((key) => `${JSON.stringify(key)}:${canonicalJson(value[key])}`).join(',')}}`;
}

export function serializeRouteLanguageEntry(
  kind: RouteLanguageEntryKind,
  entry: RouteLanguageEntry,
): string {
  const errors = kind === 'route-binding'
    ? validateRouteBinding(entry)
    : validateLanguageBinding(entry);
  if (errors.length > 0) throw new Error(`invalid-route-language-entry:${errors.join(',')}`);
  return `${canonicalJson(entry as unknown as CanonicalJson)}\n`;
}
