import { createHash } from 'node:crypto';
import rendererInputCompletionJson from '../../docs/editorial/R2-A1.1-completion.v0.json';
import {
  ACCEPTED_CURRENT_PUBLICATION_DIGEST,
  currentRendererInputDigest,
  materializeCurrentRendererInput,
} from './current-renderer-input';
import type { CurrentCoreSurfaceId, CurrentSurfaceDto } from './current-surface-runtime';
import type { EditorialDocumentDto } from './document-runtime';
import type { PinnedRecordRef, RecordKind } from '../app/data/editorial-record-identity';
import type { LanguageTag } from '../app/data/editorial-route-language-identity';

export const CURRENT_DISTRIBUTION_SCHEMA_VERSION = 'editorial-current-distribution-bundle/v0' as const;
export const ACCEPTED_CURRENT_RENDERER_INPUT_DIGEST = 'sha256_4b2bc45e2127befd4f7be0aaf7b4a2cebe0ad7ab9da7a7fa774414af155d73e6' as const;
const SITE_URL = 'https://renan.snelabs.space';

interface RendererInputCompletionSeal {
  status: 'complete';
  normative: true;
  sourceIdentity: {
    acceptedPublicationDigest: string;
    rendererInputDigest: string;
    generatedByteDigest: string;
  };
  acceptance: {
    r2_a1_0Complete: true;
    r2_a1_1Complete: true;
    currentSpecimenReemitted: true;
    currentDistributionEmitted: false;
    currentPhysicalPublicationValid: false;
    cutoverReady: false;
    cutoverAuthorized: false;
    cutoverEnacted: false;
  };
}

export interface CurrentDistributionPage {
  source: 'surface' | 'document';
  identityKey: string;
  language: LanguageTag;
  canonicalPath: string;
  canonicalUrl: string;
  title: string;
  description: string;
  targetRef: PinnedRecordRef | null;
  kind: RecordKind | null;
  searchText: string | null;
}

export interface CurrentHreflangLink {
  language: LanguageTag;
  href: string;
}

export interface CurrentHreflangCluster {
  identityKey: string;
  links: CurrentHreflangLink[];
}

export interface CurrentMetadataEntry {
  canonicalPath: string;
  canonicalUrl: string;
  language: LanguageTag;
  title: string;
  description: string;
  robots: 'index,follow';
  alternates: CurrentHreflangLink[];
}

export interface CurrentSitemapEntry {
  loc: string;
  alternates: CurrentHreflangLink[];
}

export interface CurrentRssFeed {
  language: LanguageTag;
  path: string;
  url: string;
  title: string;
  description: string;
  items: [];
}

export interface CurrentSearchEntry {
  id: string;
  targetRef: PinnedRecordRef;
  kind: RecordKind;
  language: LanguageTag;
  canonicalPath: string;
  canonicalUrl: string;
  title: string;
  summary: string;
  text: string;
}

export interface CurrentDistributionBundle {
  schemaVersion: typeof CURRENT_DISTRIBUTION_SCHEMA_VERSION;
  source: {
    acceptedPublicationDigest: typeof ACCEPTED_CURRENT_PUBLICATION_DIGEST;
    rendererInputDigest: typeof ACCEPTED_CURRENT_RENDERER_INPUT_DIGEST;
  };
  pages: CurrentDistributionPage[];
  metadata: CurrentMetadataEntry[];
  hreflang: CurrentHreflangCluster[];
  sitemap: CurrentSitemapEntry[];
  rss: CurrentRssFeed[];
  search: CurrentSearchEntry[];
}

const SURFACE_TITLES: Record<LanguageTag, Record<CurrentCoreSurfaceId, string>> = {
  en: { home: 'Home', systems: 'Systems', archive: 'Archive', research: 'Research', essays: 'Essays', notes: 'Notes' },
  'pt-BR': { home: 'Início', systems: 'Sistemas', archive: 'Arquivo', research: 'Pesquisa', essays: 'Ensaios', notes: 'Notas' },
};

const SURFACE_DESCRIPTIONS: Record<LanguageTag, Record<CurrentCoreSurfaceId, string>> = {
  en: {
    home: 'Editorial index of admitted systems, research, essays and notes.',
    systems: 'Admitted public systems in the current editorial state.',
    archive: 'Deterministic archive of currently admitted editorial documents.',
    research: 'Admitted research publications.',
    essays: 'Admitted essays.',
    notes: 'Admitted notes.',
  },
  'pt-BR': {
    home: 'Índice editorial de sistemas, pesquisas, ensaios e notas admitidos.',
    systems: 'Sistemas públicos admitidos no estado editorial atual.',
    archive: 'Arquivo determinístico dos documentos editoriais atualmente admitidos.',
    research: 'Publicações de pesquisa admitidas.',
    essays: 'Ensaios admitidos.',
    notes: 'Notas admitidas.',
  },
};

type CanonicalJson = null | boolean | number | string | CanonicalJson[] | { [key: string]: CanonicalJson };

function canonicalJson(value: CanonicalJson): string {
  if (value === null || typeof value === 'boolean' || typeof value === 'number' || typeof value === 'string') {
    return JSON.stringify(value) as string;
  }
  if (Array.isArray(value)) return `[${value.map((entry) => canonicalJson(entry)).join(',')}]`;
  return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonicalJson(value[key])}`).join(',')}}`;
}

function siteUrl(path: string): string {
  return `${SITE_URL}${path}`;
}

function surfacePage(surface: CurrentSurfaceDto): CurrentDistributionPage {
  const label = SURFACE_TITLES[surface.language][surface.id];
  return {
    source: 'surface',
    identityKey: `surface:${surface.id}`,
    language: surface.language,
    canonicalPath: surface.path,
    canonicalUrl: siteUrl(surface.path),
    title: `${label} — Renan Melo`,
    description: SURFACE_DESCRIPTIONS[surface.language][surface.id],
    targetRef: null,
    kind: null,
    searchText: null,
  };
}

function documentPage(document: EditorialDocumentDto): CurrentDistributionPage {
  if (document.content.type !== 'knowledge.system') throw new Error('current-distribution-non-semantic-document');
  const searchText = [document.content.name, document.content.summary, document.content.thesis]
    .filter((value): value is string => typeof value === 'string' && value.trim().length > 0)
    .join('\n');
  return {
    source: 'document',
    identityKey: `record:${document.targetRef.recordId}:${document.targetRef.revisionId}`,
    language: document.language,
    canonicalPath: document.canonicalPath,
    canonicalUrl: document.canonicalUrl,
    title: `${document.content.name} — Renan Melo`,
    description: document.content.summary,
    targetRef: document.targetRef,
    kind: document.kind,
    searchText,
  };
}

function hreflangClusters(pages: readonly CurrentDistributionPage[]): CurrentHreflangCluster[] {
  const groups = new Map<string, CurrentDistributionPage[]>();
  for (const page of pages) groups.set(page.identityKey, [...(groups.get(page.identityKey) ?? []), page]);
  return [...groups.entries()]
    .filter(([, group]) => new Set(group.map((entry) => entry.language)).size > 1)
    .map(([identityKey, group]) => ({
      identityKey,
      links: group
        .map((entry) => ({ language: entry.language, href: entry.canonicalUrl }))
        .sort((left, right) => left.language.localeCompare(right.language)),
    }))
    .sort((left, right) => left.identityKey.localeCompare(right.identityKey));
}

function alternates(page: CurrentDistributionPage, clusters: readonly CurrentHreflangCluster[]): CurrentHreflangLink[] {
  return clusters.find((entry) => entry.identityKey === page.identityKey)?.links ?? [];
}

export function materializeCurrentDistribution(): CurrentDistributionBundle {
  const completion = rendererInputCompletionJson as RendererInputCompletionSeal;
  if (
    completion.status !== 'complete'
    || completion.normative !== true
    || completion.sourceIdentity.acceptedPublicationDigest !== ACCEPTED_CURRENT_PUBLICATION_DIGEST
    || completion.sourceIdentity.rendererInputDigest !== ACCEPTED_CURRENT_RENDERER_INPUT_DIGEST
    || completion.acceptance.r2_a1_0Complete !== true
    || completion.acceptance.r2_a1_1Complete !== true
    || completion.acceptance.currentSpecimenReemitted !== true
    || completion.acceptance.currentDistributionEmitted !== false
    || completion.acceptance.currentPhysicalPublicationValid !== false
    || completion.acceptance.cutoverReady !== false
    || completion.acceptance.cutoverAuthorized !== false
    || completion.acceptance.cutoverEnacted !== false
  ) throw new Error('current-distribution-renderer-input-seal-unavailable');

  const input = materializeCurrentRendererInput();
  if (currentRendererInputDigest(input) !== ACCEPTED_CURRENT_RENDERER_INPUT_DIGEST) {
    throw new Error('current-distribution-renderer-input-digest-drift');
  }

  const pages = [
    ...input.surfaces.map(surfacePage),
    ...input.documents.map(documentPage),
  ].sort((left, right) => left.canonicalPath.localeCompare(right.canonicalPath));

  if (pages.length !== 66) throw new Error(`current-distribution-page-count:${pages.length}`);
  if (new Set(pages.map((entry) => entry.canonicalPath)).size !== pages.length) throw new Error('current-distribution-duplicate-path');
  if (pages.some((entry) => entry.canonicalUrl !== siteUrl(entry.canonicalPath))) throw new Error('current-distribution-canonical-url-drift');

  const hreflang = hreflangClusters(pages);
  if (hreflang.length !== 33) throw new Error(`current-distribution-hreflang-count:${hreflang.length}`);
  if (hreflang.some((entry) => entry.links.length !== 2)) throw new Error('current-distribution-hreflang-pair-incomplete');

  const metadata: CurrentMetadataEntry[] = pages.map((page) => ({
    canonicalPath: page.canonicalPath,
    canonicalUrl: page.canonicalUrl,
    language: page.language,
    title: page.title,
    description: page.description,
    robots: 'index,follow',
    alternates: alternates(page, hreflang),
  }));
  const sitemap: CurrentSitemapEntry[] = pages.map((page) => ({ loc: page.canonicalUrl, alternates: alternates(page, hreflang) }));
  const rss: CurrentRssFeed[] = [
    {
      language: 'en', path: '/en/rss.xml', url: siteUrl('/en/rss.xml'), title: 'Renan Melo — Publications',
      description: 'Admitted editorial publications from renan.snelabs.space.', items: [],
    },
    {
      language: 'pt-BR', path: '/pt-br/rss.xml', url: siteUrl('/pt-br/rss.xml'), title: 'Renan Melo — Publicações',
      description: 'Publicações editoriais admitidas de renan.snelabs.space.', items: [],
    },
  ].sort((left, right) => left.path.localeCompare(right.path)) as CurrentRssFeed[];
  const search: CurrentSearchEntry[] = pages
    .filter((page): page is CurrentDistributionPage & { targetRef: PinnedRecordRef; kind: RecordKind; searchText: string } =>
      page.source === 'document' && page.targetRef !== null && page.kind !== null && page.searchText !== null)
    .map((page) => ({
      id: `${page.targetRef.recordId}:${page.targetRef.revisionId}:${page.language}`,
      targetRef: page.targetRef,
      kind: page.kind,
      language: page.language,
      canonicalPath: page.canonicalPath,
      canonicalUrl: page.canonicalUrl,
      title: page.title,
      summary: page.description,
      text: page.searchText,
    }));

  if (metadata.length !== 66 || sitemap.length !== 66 || rss.length !== 2 || search.length !== 54) {
    throw new Error('current-distribution-derived-count-drift');
  }

  return {
    schemaVersion: CURRENT_DISTRIBUTION_SCHEMA_VERSION,
    source: {
      acceptedPublicationDigest: ACCEPTED_CURRENT_PUBLICATION_DIGEST,
      rendererInputDigest: ACCEPTED_CURRENT_RENDERER_INPUT_DIGEST,
    },
    pages,
    metadata,
    hreflang,
    sitemap,
    rss,
    search,
  };
}

export function serializeCurrentDistribution(bundle: CurrentDistributionBundle): string {
  return `${canonicalJson(bundle as unknown as CanonicalJson)}\n`;
}

export function currentDistributionDigest(bundle: CurrentDistributionBundle): `sha256_${string}` {
  return `sha256_${createHash('sha256').update(serializeCurrentDistribution(bundle), 'utf8').digest('hex')}`;
}
