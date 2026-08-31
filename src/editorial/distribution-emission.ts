import { createHash } from 'node:crypto';
import {
  serializeRssXml,
  serializeSitemapXml,
  type CanonicalMetadataEntry,
  type DistributionBundle,
  type HreflangCluster,
  type SearchIndexEntry,
} from './distribution-runtime';

export const DISTRIBUTION_EMISSION_SCHEMA_VERSION = 'editorial-distribution-emission/v0' as const;

export type DistributionArtifactKind = 'sitemap' | 'rss' | 'search-index';

export interface EmittedDistributionArtifact {
  kind: DistributionArtifactKind;
  path: string;
  contentType: 'application/xml; charset=utf-8' | 'application/rss+xml; charset=utf-8' | 'application/json; charset=utf-8';
  body: string;
  digest: `sha256:${string}`;
}

export interface DistributionEmission {
  schemaVersion: typeof DISTRIBUTION_EMISSION_SCHEMA_VERSION;
  sourceBundleDigest: `sha256_${string}`;
  metadata: CanonicalMetadataEntry[];
  hreflang: HreflangCluster[];
  search: SearchIndexEntry[];
  artifacts: EmittedDistributionArtifact[];
}

export interface ReconstructedDistributionEmission {
  state: 'ready' | 'conflict';
  emission: DistributionEmission | null;
  errors: string[];
}

type CanonicalJson = null | boolean | number | string | CanonicalJson[] | { [key: string]: CanonicalJson };

function canonicalJson(value: CanonicalJson): string {
  if (value === null || typeof value === 'boolean' || typeof value === 'number' || typeof value === 'string') {
    return JSON.stringify(value) as string;
  }
  if (Array.isArray(value)) return `[${value.map((entry) => canonicalJson(entry)).join(',')}]`;
  return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonicalJson(value[key])}`).join(',')}}`;
}

export function serializeSearchIndexJson(entries: readonly SearchIndexEntry[]): string {
  return `${canonicalJson(entries as unknown as CanonicalJson)}\n`;
}

function digest(body: string): `sha256:${string}` {
  return `sha256:${createHash('sha256').update(body, 'utf8').digest('hex')}`;
}

function unique(values: readonly string[]): boolean {
  return new Set(values).size === values.length;
}

export function reconstructDistributionEmission(
  bundle: DistributionBundle,
  sourceBundleDigest: `sha256_${string}`,
): ReconstructedDistributionEmission {
  const errors: string[] = [];
  if (!/^sha256_[0-9a-f]{64}$/.test(sourceBundleDigest)) errors.push('distribution-emission-source-digest');
  if (bundle.schemaVersion !== 'editorial-distribution-bundle/v0') errors.push('distribution-emission-bundle-schema');

  const pagePaths = new Set(bundle.pages.map((page) => page.canonicalPath));
  if (!unique(bundle.pages.map((page) => page.canonicalPath))) errors.push('distribution-emission-duplicate-page-path');
  if (!unique(bundle.metadata.map((entry) => entry.canonicalPath))) errors.push('distribution-emission-duplicate-metadata-path');
  if (bundle.metadata.length !== bundle.pages.length) errors.push('distribution-emission-metadata-count');
  if (bundle.sitemap.length !== bundle.pages.length) errors.push('distribution-emission-sitemap-count');

  for (const metadata of bundle.metadata) {
    const page = bundle.pages.find((entry) => entry.canonicalPath === metadata.canonicalPath);
    if (!page) {
      errors.push(`distribution-emission-metadata-without-page:${metadata.canonicalPath}`);
      continue;
    }
    if (metadata.canonicalUrl !== page.canonicalUrl) errors.push(`distribution-emission-canonical-url-mismatch:${metadata.canonicalPath}`);
    if (metadata.language !== page.language) errors.push(`distribution-emission-language-mismatch:${metadata.canonicalPath}`);
    if (metadata.robots !== 'index,follow') errors.push(`distribution-emission-robots-mismatch:${metadata.canonicalPath}`);
  }

  for (const entry of bundle.search) {
    if (!pagePaths.has(entry.canonicalPath)) errors.push(`distribution-emission-search-without-page:${entry.canonicalPath}`);
  }

  if (!unique(bundle.rss.map((feed) => feed.path))) errors.push('distribution-emission-duplicate-rss-path');
  if (bundle.rss.length !== 2) errors.push(`distribution-emission-rss-count:${bundle.rss.length}`);

  const artifacts: EmittedDistributionArtifact[] = [];
  const sitemapBody = serializeSitemapXml(bundle);
  artifacts.push({
    kind: 'sitemap',
    path: '/sitemap.xml',
    contentType: 'application/xml; charset=utf-8',
    body: sitemapBody,
    digest: digest(sitemapBody),
  });

  for (const feed of bundle.rss) {
    const body = serializeRssXml(feed);
    artifacts.push({
      kind: 'rss',
      path: feed.path,
      contentType: 'application/rss+xml; charset=utf-8',
      body,
      digest: digest(body),
    });
  }

  const searchBody = serializeSearchIndexJson(bundle.search);
  artifacts.push({
    kind: 'search-index',
    path: '/search-index.json',
    contentType: 'application/json; charset=utf-8',
    body: searchBody,
    digest: digest(searchBody),
  });

  artifacts.sort((left, right) => left.path.localeCompare(right.path));
  if (!unique(artifacts.map((artifact) => artifact.path))) errors.push('distribution-emission-duplicate-artifact-path');
  if (artifacts.length !== 4) errors.push(`distribution-emission-artifact-count:${artifacts.length}`);

  const uniqueErrors = [...new Set(errors)];
  if (uniqueErrors.length > 0) return { state: 'conflict', emission: null, errors: uniqueErrors };

  return {
    state: 'ready',
    emission: {
      schemaVersion: DISTRIBUTION_EMISSION_SCHEMA_VERSION,
      sourceBundleDigest,
      metadata: bundle.metadata,
      hreflang: bundle.hreflang,
      search: bundle.search,
      artifacts,
    },
    errors: [],
  };
}
