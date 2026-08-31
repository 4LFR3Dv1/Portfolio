import { describe, expect, it } from 'vitest';
import routeAdmissionJson from '../../docs/editorial/R1-A2.6-current-route-admission.v0.json';
import historicalRouteJson from '../../docs/editorial/route-runtime.v0.json';
import { CURRENT_ROUTE_LANGUAGE_CANDIDATES } from './current-route-language-candidates';
import {
  materializeCurrentRouteAdmission,
  type CurrentRouteAdmissionManifest,
} from './current-route-language-runtime';
import { materializeCurrentSystemRevisions } from './current-revision-runtime';
import { materializeCurrentDisclosure } from './current-disclosure-runtime';

const manifest = routeAdmissionJson as CurrentRouteAdmissionManifest;
const materialized = materializeCurrentRouteAdmission();
const revisions = materializeCurrentSystemRevisions();
const disclosure = materializeCurrentDisclosure();
const historical = historicalRouteJson as {
  assignments: Array<{
    path: string;
    targetRecordId: string;
    language: 'en' | 'pt-BR';
    role: 'canonical' | 'alias';
  }>;
};

describe('R1-A2.6 current bilingual route admission', () => {
  it('admits an explicit EN and PT-BR route decision for every current System successor', () => {
    expect(materialized.errors).toEqual([]);
    expect(revisions.errors).toEqual([]);
    expect(disclosure.errors).toEqual([]);
    expect(CURRENT_ROUTE_LANGUAGE_CANDIDATES).toHaveLength(27);
    expect(materialized.currentRouteBindings).toHaveLength(54);
    expect(materialized.currentRouteBindings.filter((entry) => entry.language === 'en')).toHaveLength(27);
    expect(materialized.currentRouteBindings.filter((entry) => entry.language === 'pt-BR')).toHaveLength(27);
    expect(new Set(materialized.currentRouteBindings.map((entry) => entry.path)).size).toBe(54);
    expect(new Set(materialized.currentRouteBindings.map((entry) => entry.targetRef.recordId)).size).toBe(27);
    expect(materialized.currentResolutionStates.every((entry) => entry.state === 'resolved')).toBe(true);

    const paths = new Set(materialized.currentRouteBindings.map((entry) => entry.path));
    for (const candidate of CURRENT_ROUTE_LANGUAGE_CANDIDATES) {
      expect(paths.has(candidate.routes.en)).toBe(true);
      expect(paths.has(candidate.routes.ptBR)).toBe(true);
    }
  });

  it('materializes exact-current English canonical payloads and explicit Portuguese translations', () => {
    expect(materialized.currentLanguageRealizations).toHaveLength(54);
    expect(materialized.currentLanguageRealizations.filter((entry) => entry.language === 'en')).toHaveLength(27);
    expect(materialized.currentLanguageRealizations.filter((entry) => entry.language === 'pt-BR')).toHaveLength(27);

    const successorBySubject = new Map(revisions.successors.map((entry) => [entry.subjectKey, entry]));
    for (const realization of materialized.currentLanguageRealizations) {
      const successor = successorBySubject.get(realization.subjectKey);
      expect(successor).toBeDefined();
      expect(realization.binding.basisRef.recordId).toBe(successor?.recordId);
      expect(realization.binding.basisRef.revisionId).toBe(successor?.revision.revisionId);
      if (realization.language === 'en') {
        expect(realization.binding.role).toBe('canonical');
        expect(realization.binding.translatedFrom).toBeNull();
        expect(realization.binding.realizationDigest).toBe(successor?.revision.payloadDigest);
        expect(realization.payload).toEqual(successor?.payload);
      } else {
        expect(realization.binding.role).toBe('translation');
        expect(realization.binding.translatedFrom).toBe('en');
        expect(realization.payload.name).toBe(successor?.payload.name);
        expect(realization.payload.summary.trim().length).toBeGreaterThan(0);
        expect(realization.payload.summary).not.toBe(successor?.payload.summary);
        expect(realization.payload.thesis === null).toBe(successor?.payload.thesis === null);
      }
    }

    const genesisPt = materialized.currentLanguageRealizations.find((entry) => entry.subjectKey === 'genesis' && entry.language === 'pt-BR');
    expect(genesisPt?.payload.summary).toContain('Runtime web agêntico soberano');
    const radarPt = materialized.currentLanguageRealizations.find((entry) => entry.subjectKey === 'sne-radar' && entry.language === 'pt-BR');
    expect(radarPt?.payload.thesis).toBeNull();
  });

  it('preserves all ten R1.3 route identities and their historical admission basis exactly', () => {
    expect(materialized.allRouteBindings).toHaveLength(56);
    expect(historical.assignments).toHaveLength(10);

    for (const prior of historical.assignments) {
      const next = materialized.allRouteBindings.find((entry) => entry.path === prior.path);
      expect(next).toBeDefined();
      expect(next?.targetRef.recordId).toBe(prior.targetRecordId);
      expect(next?.language).toBe(prior.language);
      expect(next?.role).toBe(prior.role);
    }

    const preservedPaths = new Set(historical.assignments.map((entry) => entry.path));
    expect(materialized.allRouteBindings.filter((entry) => preservedPaths.has(entry.path))).toHaveLength(10);
    expect(materialized.currentRouteBindings.filter((entry) => preservedPaths.has(entry.path))).toHaveLength(8);
    expect(materialized.allRouteBindings.filter((entry) => !preservedPaths.has(entry.path))).toHaveLength(46);
    expect(manifest.materialization).toMatchObject({
      preservedHistoricalRouteBindingCount: 10,
      preservedHistoricalRouteForCurrentSystemCount: 8,
      deferredHistoricalRouteBindingCount: 2,
      newRouteBindingCount: 46,
      totalRouteBindingCount: 56,
    });
  });

  it('keeps the two Transactional Support Bot historical routes but refuses to invent a current head for them', () => {
    expect(materialized.deferredHistoricalResolutionStates).toEqual([
      { path: '/en/systems/transactional-support-bot', state: 'head-unavailable' },
      { path: '/pt-br/systems/transactional-support-bot', state: 'head-unavailable' },
    ]);
    expect(CURRENT_ROUTE_LANGUAGE_CANDIDATES.some((entry) => entry.subjectKey === 'transactional-support-bot')).toBe(false);
    expect(manifest.acceptance.deferredHistoricalRouteHeadUnavailableCount).toBe(2);
  });

  it('requires explicit public disclosure before route admission but does not derive the route path from disclosure', () => {
    const disclosureBySubject = new Map(disclosure.resolutions.map((entry) => [entry.subjectKey, entry]));
    for (const candidate of CURRENT_ROUTE_LANGUAGE_CANDIDATES) {
      expect(disclosureBySubject.get(candidate.subjectKey)).toMatchObject({
        state: 'classified',
        visibility: 'public',
        disclosure: 'full',
      });
      expect(candidate.routes.en).toMatch(/^\/en\/systems\/[a-z0-9-]+$/);
      expect(candidate.routes.ptBR).toMatch(/^\/pt-br\/systems\/[a-z0-9-]+$/);
    }
    expect(manifest.laws).toMatchObject({
      routePathDerivedFromRepositoryName: false,
      disclosureImpliesRoute: false,
      routeImpliesSurfaceMembership: false,
    });
  });

  it('keeps A2.6 isolated from surface membership and production while awaiting CI', () => {
    expect(manifest.status).toBe('materialized-awaiting-ci');
    expect(manifest.materialization).toMatchObject({
      currentSuccessorSystemCount: 27,
      currentRoutedSystemCount: 27,
      currentUnroutedSystemCount: 0,
      currentRouteLanguagePairCount: 54,
      currentEnglishRouteCount: 27,
      currentPortugueseRouteCount: 27,
      currentLanguageBindingCount: 54,
      currentCanonicalEnglishBindingCount: 27,
      currentPortugueseTranslationBindingCount: 27,
      totalRouteTargetRecordCount: 28,
    });
    expect(manifest.acceptance).toMatchObject({
      allCurrentRouteLanguagePairsResolved: true,
      currentRouteConflictCount: 0,
      currentLanguageConflictCount: 0,
      staleTranslationInheritanceCount: 0,
      historicalPathDropCount: 0,
      historicalPathReassignmentCount: 0,
      historicalAdmissionBasisRewriteCount: 0,
      deferredHistoricalRouteHeadUnavailableCount: 2,
      publicSurfaceMutationCount: 0,
      productionMutationCount: 0,
      r1_a2_6Complete: false,
    });
    expect(manifest.acceptance.nextRequiredAction).toContain('CI must reconstruct');
  });
});
