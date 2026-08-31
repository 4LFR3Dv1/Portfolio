import { createHash } from 'node:crypto';
import type { PinnedRecordRef, RecordKind } from '../app/data/editorial-record-identity';
import type { LanguageTag } from '../app/data/editorial-route-language-identity';
import type { EditorialDocumentDecision, EditorialDocumentDto } from './document-runtime';
import type { CoreSurfaceDto, CoreSurfaceId, ReconstructedCoreSurfaceRuntime } from './surface-runtime';

export const DISTRIBUTION_FOUNDATION_SCHEMA_VERSION = 'editorial-distribution-foundation/v0' as const;
export const DISTRIBUTION_BUNDLE_SCHEMA_VERSION = 'editorial-distribution-bundle/v0' as const;

const SITE_URL = 'https://renan.snelabs.space';

export interface DistributionFoundationManifest {
  schemaVersion: typeof DISTRIBUTION_FOUNDATION_SCHEMA_VERSION;
  contractId: string;
  status: 'materialized';
  normative: true;
  baseline: string;
  preconditions: {
    r1_6Complete: true;
    r1_5Complete: true;
    r1_4Complete: true;
    r1_3Complete: true;
    r1_2Complete: true;
    r1_1Complete: true;
    r0EffectiveComplete: true;
  };
  admission: {
    pageSource: 'r1.6-core-surfaces-plus-r1.5-documents';
    manualPageRegistryAllowed: false;
    indexUnprojectedRecordAllowed: false;
    indexOmittedDocumentAllowed: false;
    crossLanguageFallbackAllowed: false;
    lastModifiedInferenceAllowed: false;
    priorityInferenceAllowed: false;
    publicationChronologyInferenceAllowed: false;
    xDefaultInferenceAllowed: false;
  };
  distribution: {
    metadata: true;
    hreflang: true;
    sitemap: true;
    rss: true;
    search: true;
    structuredBundle: true;
    rssLanguages: LanguageTag[];
    rssPaths: Record<'en' | 'pt-BR', string>;
  };
  currentState: {
    surfacePageCount: number;
    documentPageCount: number;
    indexablePageCount: number;
    metadataEntryCount: number;
    hreflangClusterCount: number;
    hreflangLinkCount: number;
    sitemapEntryCount: number;
    rssFeedCount: number;
    rssItemCount: number;
    searchEntryCount: number;
    structuredBundleCount: number;
    legacyPublicSitemapReplaced: false;
    staticHtmlRenderingEnacted: false;
    frameworkCutoverEnacted: false;
    vercelConfigurationChanged: false;
    publicUiChanged: false;
    deployedRuntimeChanged: false;
  };
  acceptance: {
    distributionRuntimeMaterialized: true;
    distributionConsumesAuthorizedOutputsOnly: true;
    manualPageRegistryAllowed: false;
    unprojectedRecordIndexCount: 0;
    omittedDocumentIndexCount: 0;
    crossLanguageFallbackCount: 0;
    metadataEntryCount: number;
    sitemapEntryCount: number;
    searchEntryCount: number;
    rssFeedCount: number;
    rssItemCount: number;
    r1_7Complete: false;
  };
}

export type DistributionPageSource = 'surface' | 'document';

export interface DistributionPage {
  source: DistributionPageSource;
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

export interface HreflangLink {
  language: LanguageTag;
  href: string;
}

export interface HreflangCluster {
  identityKey: string;
  links: HreflangLink[];
}

export interface CanonicalMetadataEntry {
  canonicalPath: string;
  canonicalUrl: string;
  language: LanguageTag;
  title: string;
  description: string;
  robots: 'index,follow';
  alternates: HreflangLink[];
}

export interface SitemapEntry {
  loc: string;
  alternates: HreflangLink[];
}

export interface RssItem {
  guid: string;
  title: string;
  link: string;
  description: string;
}

export interface RssFeed {
  language: LanguageTag;
  path: string;
  url: string;
  title: string;
  description: string;
  items: RssItem[];
}

export interface SearchIndexEntry {
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

export interface DistributionBundle {
  schemaVersion: typeof DISTRIBUTION_BUNDLE_SCHEMA_VERSION;
  pages: DistributionPage[];
  metadata: CanonicalMetadataEntry[];
  hreflang: HreflangCluster[];
  sitemap: SitemapEntry[];
  rss: RssFeed[];
  search: SearchIndexEntry[];
}

export interface ReconstructedDistributionRuntime {
  state: 'ready' | 'conflict';
  bundle: DistributionBundle | null;
  digest: `sha256_${string}` | null;
  errors: string[];
}

const SURFACE_TITLES: Record<LanguageTag, Record<CoreSurfaceId, string>> = {
  en: {
    home: 'Home',
    systems: 'Systems',
    archive: 'Archive',
    research: 'Research',
    essays: 'Essays',
    notes: 'Notes',
  },
  'pt-BR': {
    home: 'Início',
    systems: 'Sistemas',
    archive: 'Arquivo',
    research: 'Pesquisa',
    essays: 'Ensaios',
    notes: 'Notas',
  },
};

const SURFACE_DESCRIPTIONS: Record<LanguageTag, Record<CoreSurfaceId, string>> = {
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

function unique<T>(values: readonly T[]): boolean {
  return new Set(values).size === values.length;
}

function siteUrl(path: string): string {
  return `${SITE_URL}${path}`;
}

function surfacePage(surface: CoreSurfaceDto): DistributionPage {
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

function semanticDocumentPage(document: EditorialDocumentDto): DistributionPage | null {
  if (document.content.type === 'metadata-only') return null;

  if (document.content.type === 'knowledge.system') {
    const text = [document.content.name, document.content.summary, document.content.thesis]
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
      searchText: text,
    };
  }

  return null;
}

function distributionPages(
  surfaces: ReconstructedCoreSurfaceRuntime,
  documents: readonly EditorialDocumentDecision[],
): DistributionPage[] {
  const pages: DistributionPage[] = [];
  for (const surface of surfaces.surfaces) pages.push(surfacePage(surface));
  for (const decision of documents) {
    if (decision.state !== 'document') continue;
    const page = semanticDocumentPage(decision.document);
    if (page) pages.push(page);
  }
  return pages.sort((left, right) => left.canonicalPath.localeCompare(right.canonicalPath));
}

function hreflangClusters(pages: readonly DistributionPage[]): HreflangCluster[] {
  const byIdentity = new Map<string, DistributionPage[]>();
  for (const page of pages) {
    const group = byIdentity.get(page.identityKey) ?? [];
    group.push(page);
    byIdentity.set(page.identityKey, group);
  }

  return [...byIdentity.entries()]
    .filter(([, group]) => new Set(group.map((page) => page.language)).size > 1)
    .map(([identityKey, group]) => ({
      identityKey,
      links: group
        .map((page) => ({ language: page.language, href: page.canonicalUrl }))
        .sort((left, right) => left.language.localeCompare(right.language)),
    }))
    .sort((left, right) => left.identityKey.localeCompare(right.identityKey));
}

function alternatesFor(page: DistributionPage, clusters: readonly HreflangCluster[]): HreflangLink[] {
  return clusters.find((cluster) => cluster.identityKey === page.identityKey)?.links ?? [];
}

function metadataEntries(
  pages: readonly DistributionPage[],
  clusters: readonly HreflangCluster[],
): CanonicalMetadataEntry[] {
  return pages.map((page) => ({
    canonicalPath: page.canonicalPath,
    canonicalUrl: page.canonicalUrl,
    language: page.language,
    title: page.title,
    description: page.description,
    robots: 'index,follow' as const,
    alternates: alternatesFor(page, clusters),
  }));
}

function sitemapEntries(
  pages: readonly DistributionPage[],
  clusters: readonly HreflangCluster[],
): SitemapEntry[] {
  return pages.map((page) => ({
    loc: page.canonicalUrl,
    alternates: alternatesFor(page, clusters),
  }));
}

function rssFeeds(manifest: DistributionFoundationManifest): RssFeed[] {
  return manifest.distribution.rssLanguages
    .map((language) => {
      const path = manifest.distribution.rssPaths[language];
      const english = language === 'en';
      return {
        language,
        path,
        url: siteUrl(path),
        title: english ? 'Renan Melo — Publications' : 'Renan Melo — Publicações',
        description: english
          ? 'Admitted editorial publications from renan.snelabs.space.'
          : 'Publicações editoriais admitidas de renan.snelabs.space.',
        items: [],
      };
    })
    .sort((left, right) => left.path.localeCompare(right.path));
}

function searchEntries(pages: readonly DistributionPage[]): SearchIndexEntry[] {
  return pages
    .filter((page): page is DistributionPage & { targetRef: PinnedRecordRef; kind: RecordKind; searchText: string } =>
      page.source === 'document'
      && page.targetRef !== null
      && page.kind !== null
      && page.searchText !== null)
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
}

type CanonicalJson = null | boolean | number | string | CanonicalJson[] | { [key: string]: CanonicalJson };

function canonicalJson(value: CanonicalJson): string {
  if (value === null || typeof value === 'boolean' || typeof value === 'number' || typeof value === 'string') {
    return JSON.stringify(value) as string;
  }
  if (Array.isArray(value)) return `[${value.map((entry) => canonicalJson(entry)).join(',')}]`;
  return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonicalJson(value[key])}`).join(',')}}`;
}

export function serializeDistributionBundle(bundle: DistributionBundle): string {
  return `${canonicalJson(bundle as unknown as CanonicalJson)}\n`;
}

function bundleDigest(bundle: DistributionBundle): `sha256_${string}` {
  return `sha256_${createHash('sha256').update(serializeDistributionBundle(bundle), 'utf8').digest('hex')}`;
}

export function reconstructDistributionRuntime(
  manifest: DistributionFoundationManifest,
  surfaces: ReconstructedCoreSurfaceRuntime,
  documents: readonly EditorialDocumentDecision[],
): ReconstructedDistributionRuntime {
  const errors: string[] = [];
  if (manifest.schemaVersion !== DISTRIBUTION_FOUNDATION_SCHEMA_VERSION) errors.push('distribution-schema-version');
  if (manifest.status !== 'materialized') errors.push('distribution-status');
  if (manifest.normative !== true) errors.push('distribution-normative');
  if (manifest.admission.manualPageRegistryAllowed) errors.push('manual-page-registry-enabled');
  if (manifest.admission.indexUnprojectedRecordAllowed) errors.push('unprojected-index-enabled');
  if (manifest.admission.indexOmittedDocumentAllowed) errors.push('omitted-document-index-enabled');
  if (manifest.admission.crossLanguageFallbackAllowed) errors.push('cross-language-fallback-enabled');
  if (manifest.admission.lastModifiedInferenceAllowed) errors.push('lastmod-inference-enabled');
  if (manifest.admission.priorityInferenceAllowed) errors.push('priority-inference-enabled');
  if (manifest.admission.publicationChronologyInferenceAllowed) errors.push('publication-chronology-inference-enabled');
  if (manifest.admission.xDefaultInferenceAllowed) errors.push('x-default-inference-enabled');
  if (surfaces.state !== 'ready') errors.push('surface-runtime-conflict');

  const pages = surfaces.state === 'ready' ? distributionPages(surfaces, documents) : [];
  if (!unique(pages.map((page) => page.canonicalPath))) errors.push('duplicate-distribution-path');
  if (!unique(pages.map((page) => page.canonicalUrl))) errors.push('duplicate-distribution-url');
  if (pages.some((page) => page.canonicalUrl !== siteUrl(page.canonicalPath))) errors.push('canonical-url-mismatch');

  const clusters = hreflangClusters(pages);
  for (const cluster of clusters) {
    if (!unique(cluster.links.map((link) => link.language))) errors.push(`duplicate-hreflang-language:${cluster.identityKey}`);
    if (!unique(cluster.links.map((link) => link.href))) errors.push(`duplicate-hreflang-href:${cluster.identityKey}`);
  }

  const metadata = metadataEntries(pages, clusters);
  const sitemap = sitemapEntries(pages, clusters);
  const rss = rssFeeds(manifest);
  const search = searchEntries(pages);

  const bundle: DistributionBundle = {
    schemaVersion: DISTRIBUTION_BUNDLE_SCHEMA_VERSION,
    pages,
    metadata,
    hreflang: clusters,
    sitemap,
    rss,
    search,
  };

  const uniqueErrors = [...new Set(errors)];
  return {
    state: uniqueErrors.length === 0 ? 'ready' : 'conflict',
    bundle: uniqueErrors.length === 0 ? bundle : null,
    digest: uniqueErrors.length === 0 ? bundleDigest(bundle) : null,
    errors: uniqueErrors,
  };
}

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

export function serializeSitemapXml(bundle: DistributionBundle): string {
  const rows = bundle.sitemap.map((entry) => {
    const alternates = entry.alternates.map((alternate) =>
      `    <xhtml:link rel="alternate" hreflang="${escapeXml(alternate.language)}" href="${escapeXml(alternate.href)}" />`,
    );
    return [
      '  <url>',
      `    <loc>${escapeXml(entry.loc)}</loc>`,
      ...alternates,
      '  </url>',
    ].join('\n');
  });
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...rows,
    '</urlset>',
    '',
  ].join('\n');
}

export function serializeRssXml(feed: RssFeed): string {
  const items = feed.items.map((item) => [
    '    <item>',
    `      <guid>${escapeXml(item.guid)}</guid>`,
    `      <title>${escapeXml(item.title)}</title>`,
    `      <link>${escapeXml(item.link)}</link>`,
    `      <description>${escapeXml(item.description)}</description>`,
    '    </item>',
  ].join('\n'));
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0">',
    '  <channel>',
    `    <title>${escapeXml(feed.title)}</title>`,
    `    <link>${escapeXml(siteUrl(feed.language === 'pt-BR' ? '/pt-br' : '/en'))}</link>`,
    `    <description>${escapeXml(feed.description)}</description>`,
    ...items,
    '  </channel>',
    '</rss>',
    '',
  ].join('\n');
}
