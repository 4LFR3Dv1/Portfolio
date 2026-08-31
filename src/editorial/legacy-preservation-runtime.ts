import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

import legacyFreezeJson from '../../docs/editorial/legacy/portfolio-surface.v0.json';
import compatibilityManifestJson from '../../docs/editorial/legacy-compatibility.v0.json';
import { architectureViews } from '../app/data/architecture';
import { projects, type Project, type ProjectId, type ProjectVisibility } from '../app/data/projects';
import type { PublicationShellPlan } from './publication-shell-boundary';
import type { LegacyCompatibilityManifest } from './legacy-compatibility';

export const LEGACY_PRESERVATION_SCHEMA_VERSION = 'editorial-legacy-preservation-state/v0' as const;

export type PreservedLegacyLanguage = 'en' | 'pt';

interface LegacySurfaceFreeze {
  schemaVersion: 'portfolio-surface-freeze/v0';
  freezeId: string;
  canonical: {
    repository: string;
    branch: string;
    commit: string;
    origin: string;
  };
  routes: string[];
  projects: Array<{
    id: ProjectId;
    title: string;
    visibility: ProjectVisibility;
    guarantees: string[];
  }>;
  architectureViews: Array<{
    id: string;
    principle: string;
    guarantees: string[];
  }>;
  sourceBlobs: Record<string, string>;
}

export interface LegacyResolvedLink {
  label: string;
  url: string;
}

export interface LegacyResolvedArchitectureLayer {
  name: string;
  items: string[];
}

export interface LegacyResolvedExtendedStudy {
  flow: string[];
  stateModel: {
    primary: string[];
    branches: string[];
    note: string;
  };
  roleDescription: string;
  aiRelevance: string;
  disclosure: string;
}

export interface LegacyResolvedCaseStudy {
  title: string;
  seoTitle: string;
  seoDescription: string;
  visibility: ProjectVisibility;
  badges: string[];
  type: string;
  role: string;
  summary: string;
  problem: string[];
  approach: string[];
  architecture: LegacyResolvedArchitectureLayer[];
  guarantees: string[];
  evidence: LegacyResolvedLink[];
  learnings: string[];
  extended: LegacyResolvedExtendedStudy | null;
}

export interface LegacyResolvedArchitectureView {
  id: string;
  index: string;
  shortLabel: string;
  title: string;
  summary: string;
  principle: string;
  steps: Array<{
    id: string;
    kind: string;
    label: string;
    detail: string;
  }>;
  guarantees: string[];
  boundaries: Array<{
    label: string;
    detail: string;
  }>;
  examples: string[];
}

export interface LegacyResolvedArchitecturePage {
  title: string;
  description: string;
  facts: Array<{ label: string; value: string }>;
  views: LegacyResolvedArchitectureView[];
  disclosure: string;
}

export type LegacyPreservedPage =
  | {
      kind: 'legacy-architecture';
      path: '/architecture';
      blocker: string;
      historicalMeaning: string;
      languages: Record<PreservedLegacyLanguage, LegacyResolvedArchitecturePage>;
    }
  | {
      kind: 'legacy-case-study';
      path: `/work/${string}`;
      blocker: string;
      historicalMeaning: string;
      projectId: ProjectId;
      languages: Record<PreservedLegacyLanguage, LegacyResolvedCaseStudy>;
    };

export interface LegacyPreservationState {
  schemaVersion: typeof LEGACY_PRESERVATION_SCHEMA_VERSION;
  source: {
    freezeId: string;
    freezeCommit: string;
    compatibilityContractId: string;
    projectsBlobSha: string;
    architectureBlobSha: string;
  };
  language: {
    storageKey: 'portfolio-language';
    defaultLanguage: 'en';
    acceptedValues: ['en', 'pt'];
    acceptLanguageInferenceAllowed: false;
  };
  indexing: {
    robots: 'noindex,follow';
    sitemapEligible: false;
    rssEligible: false;
    searchEligible: false;
    canonicalRecordBindingAllowed: false;
  };
  pages: LegacyPreservedPage[];
}

function readRepoFile(path: string): string {
  return readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
}

function gitBlobSha(content: string): string {
  const bytes = Buffer.from(content, 'utf8');
  return createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
}

function assertFrozenBlob(path: string, expectedSha: string): string {
  const actual = gitBlobSha(readRepoFile(path));
  if (actual !== expectedSha) throw new Error(`legacy-preservation-source-drift:${path}:${actual}`);
  return actual;
}

function resolveLinks(project: Project, language: PreservedLegacyLanguage): LegacyResolvedLink[] {
  return project.caseStudy.evidence.map((entry) => ({
    label: entry.label[language],
    url: entry.url,
  }));
}

function resolveCaseStudy(project: Project, language: PreservedLegacyLanguage): LegacyResolvedCaseStudy {
  const study = project.caseStudy;
  const extended = study.extended
    ? {
        flow: [...study.extended.flow[language]],
        stateModel: {
          primary: [...study.extended.stateModel.primary[language]],
          branches: [...study.extended.stateModel.branches[language]],
          note: study.extended.stateModel.note[language],
        },
        roleDescription: study.extended.roleDescription[language],
        aiRelevance: study.extended.aiRelevance[language],
        disclosure: study.extended.disclosure[language],
      }
    : null;

  return {
    title: project.title,
    seoTitle: project.seo?.title[language] ?? `${project.title} — Renan Melo`,
    seoDescription: project.seo?.description[language] ?? study.summary[language],
    visibility: project.visibility,
    badges: [...project.badges],
    type: study.type[language],
    role: study.role[language],
    summary: study.summary[language],
    problem: [...study.problem[language]],
    approach: [...study.approach[language]],
    architecture: study.architecture[language].map((layer) => ({
      name: layer.name,
      items: [...layer.items],
    })),
    guarantees: [...study.guarantees],
    evidence: resolveLinks(project, language),
    learnings: [...study.learnings[language]],
    extended,
  };
}

function resolveArchitecture(language: PreservedLegacyLanguage): LegacyResolvedArchitecturePage {
  const english = language === 'en';
  return {
    title: english ? 'ARCHITECTURE EXPLORER' : 'EXPLORADOR DE ARQUITETURA',
    description: english
      ? 'A current, sanitized view of how product interfaces, authoritative services, constrained runtimes and verification layers fit together across my work.'
      : 'Uma visão atual e sanitizada de como interfaces de produto, serviços autoritativos, runtimes limitados e camadas de verificação se conectam nos meus trabalhos.',
    facts: english
      ? [
          { label: 'Operating model', value: 'DETERMINISTIC FIRST' },
          { label: 'Authority', value: 'EXPLICIT & BOUNDED' },
          { label: 'Outcome', value: 'VERIFIED EXTERNALLY' },
        ]
      : [
          { label: 'Modelo operacional', value: 'DETERMINÍSTICO PRIMEIRO' },
          { label: 'Autoridade', value: 'EXPLÍCITA E LIMITADA' },
          { label: 'Resultado', value: 'VERIFICADO EXTERNAMENTE' },
        ],
    views: architectureViews.map((view) => ({
      id: view.id,
      index: view.index,
      shortLabel: view.shortLabel[language],
      title: view.title[language],
      summary: view.summary[language],
      principle: view.principle[language],
      steps: view.steps.map((step) => ({
        id: step.id,
        kind: step.kind,
        label: step.label[language],
        detail: step.detail[language],
      })),
      guarantees: [...view.guarantees[language]],
      boundaries: view.boundaries.map((boundary) => ({
        label: boundary.label[language],
        detail: boundary.detail[language],
      })),
      examples: [...view.examples],
    })),
    disclosure: english
      ? 'This explorer publishes responsibility boundaries and operating principles. Credentials, customer data and private deployment topology are intentionally excluded.'
      : 'Este explorador publica fronteiras de responsabilidade e princípios operacionais. Credenciais, dados de clientes e topologia privada de deploy são intencionalmente excluídos.',
  };
}

function sameStrings(left: readonly string[], right: readonly string[]): boolean {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

export function materializeLegacyPreservationState(shellPlan: PublicationShellPlan): LegacyPreservationState {
  const freeze = legacyFreezeJson as LegacySurfaceFreeze;
  const compatibility = compatibilityManifestJson as LegacyCompatibilityManifest;

  if (freeze.schemaVersion !== 'portfolio-surface-freeze/v0') throw new Error('legacy-preservation-freeze-schema');
  if (freeze.freezeId !== compatibility.preconditions.legacyFreezeId) throw new Error('legacy-preservation-freeze-id');
  if (freeze.canonical.repository !== '4LFR3Dv1/Portfolio') throw new Error('legacy-preservation-freeze-repository');
  if (compatibility.status !== 'materialized' || compatibility.normative !== true) {
    throw new Error('legacy-preservation-compatibility-unavailable');
  }

  const projectsBlobSha = assertFrozenBlob(
    'src/app/data/projects.ts',
    freeze.sourceBlobs['src/app/data/projects.ts'] ?? '',
  );
  const architectureBlobSha = assertFrozenBlob(
    'src/app/data/architecture.ts',
    freeze.sourceBlobs['src/app/data/architecture.ts'] ?? '',
  );

  const preservedSpecs = [...shellPlan.legacyPreservedPages].sort((left, right) => left.path.localeCompare(right.path));
  if (preservedSpecs.length !== 4) throw new Error(`legacy-preservation-page-count:${preservedSpecs.length}`);

  const compatibilityByPath = new Map(compatibility.entries.map((entry) => [entry.path, entry]));
  const pages = preservedSpecs.map((spec): LegacyPreservedPage => {
    if (!freeze.routes.includes(spec.path)) throw new Error(`legacy-preservation-unfrozen-route:${spec.path}`);
    const compatibilityEntry = compatibilityByPath.get(spec.path);
    if (!compatibilityEntry || compatibilityEntry.disposition !== 'preserve-legacy-representation') {
      throw new Error(`legacy-preservation-disposition:${spec.path}`);
    }
    if (compatibilityEntry.historicalMeaning !== spec.historicalMeaning || compatibilityEntry.blocker !== spec.blocker) {
      throw new Error(`legacy-preservation-compatibility-drift:${spec.path}`);
    }

    if (spec.path === '/architecture') {
      return {
        kind: 'legacy-architecture',
        path: '/architecture',
        blocker: spec.blocker,
        historicalMeaning: spec.historicalMeaning,
        languages: {
          en: resolveArchitecture('en'),
          pt: resolveArchitecture('pt'),
        },
      };
    }

    if (!spec.path.startsWith('/work/')) throw new Error(`legacy-preservation-unsupported-route:${spec.path}`);
    const projectId = spec.path.slice('/work/'.length) as ProjectId;
    const project = projects.find((entry) => entry.id === projectId);
    const frozenProject = freeze.projects.find((entry) => entry.id === projectId);
    if (!project || !frozenProject) throw new Error(`legacy-preservation-project-missing:${projectId}`);
    if (
      project.title !== frozenProject.title
      || project.visibility !== frozenProject.visibility
      || !sameStrings(project.caseStudy.guarantees, frozenProject.guarantees)
    ) {
      throw new Error(`legacy-preservation-project-semantic-drift:${projectId}`);
    }

    return {
      kind: 'legacy-case-study',
      path: spec.path as `/work/${string}`,
      blocker: spec.blocker,
      historicalMeaning: spec.historicalMeaning,
      projectId,
      languages: {
        en: resolveCaseStudy(project, 'en'),
        pt: resolveCaseStudy(project, 'pt'),
      },
    };
  });

  const agentic = pages.find((page) => page.path === '/work/agentic-systems');
  if (!agentic || agentic.kind !== 'legacy-case-study' || agentic.projectId !== 'agentic-systems') {
    throw new Error('legacy-preservation-agentic-identity');
  }
  if (compatibilityByPath.get('/work/agentic-systems')?.successors !== null) {
    throw new Error('legacy-preservation-agentic-rebinding');
  }

  const frozenArchitectureById = new Map(freeze.architectureViews.map((view) => [view.id, view]));
  for (const view of architectureViews) {
    const frozen = frozenArchitectureById.get(view.id);
    if (!frozen || view.principle.en !== frozen.principle || !sameStrings(view.guarantees.en, frozen.guarantees)) {
      throw new Error(`legacy-preservation-architecture-semantic-drift:${view.id}`);
    }
  }

  return {
    schemaVersion: LEGACY_PRESERVATION_SCHEMA_VERSION,
    source: {
      freezeId: freeze.freezeId,
      freezeCommit: freeze.canonical.commit,
      compatibilityContractId: compatibility.contractId,
      projectsBlobSha,
      architectureBlobSha,
    },
    language: {
      storageKey: compatibility.languageNegotiation.storageKey,
      defaultLanguage: 'en',
      acceptedValues: ['en', 'pt'],
      acceptLanguageInferenceAllowed: false,
    },
    indexing: {
      robots: 'noindex,follow',
      sitemapEligible: false,
      rssEligible: false,
      searchEligible: false,
      canonicalRecordBindingAllowed: false,
    },
    pages,
  };
}
