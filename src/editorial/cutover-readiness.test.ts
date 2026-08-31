import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

function readRepoFile(path: string): string {
  return readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
}

function readJson<T>(path: string): T {
  return JSON.parse(readRepoFile(path)) as T;
}

const contract = readJson<any>('docs/editorial/cutover-readiness.v0.json');
const r26 = readJson<any>('docs/editorial/R2.6-completion.v0.json');
const rootPackage = readJson<any>('package.json');
const vercel = readJson<any>('vercel.json');
const readinessScript = readRepoFile('editorial-shell/scripts/verify-cutover-readiness.mjs');
const workflow = readRepoFile('.github/workflows/editorial-cutover-readiness.yml');
const doc = readRepoFile('docs/editorial/R2.7-cutover-readiness.md');

describe('R2.7 cutover readiness', () => {
  it('uses the exact accepted R2.6 deployment as the cutover target', () => {
    expect(r26.acceptance.r2_6Complete).toBe(true);
    expect(contract.baseline).toBe('1479b5ce092655c770bc24dee8c94fc825db931e');
    expect(contract.acceptedTarget.origin).toBe(r26.acceptedPreviewSpecimen.origin);
    expect(contract.acceptedTarget.deploymentId).toBe(r26.acceptedPreviewSpecimen.deploymentId);
    expect(contract.acceptedTarget.semanticRuntimeReplacementAllowed).toBe(false);
    expect(contract.acceptedTarget.redeployRequiredForCutover).toBe(false);
  });

  it('bounds R2.8 to a reversible domain handoff rather than a runtime rewrite', () => {
    expect(contract.cutoverTransaction.strategy).toBe('domain-handoff-to-accepted-r2-6-service');
    expect(contract.cutoverTransaction.runtimeMutationAllowed).toBe(false);
    expect(contract.cutoverTransaction.repositoryProductionConfigMutationAllowed).toBe(false);
    expect(contract.cutoverTransaction.dnsMutationScope).toEqual(['renan.snelabs.space']);
    expect(contract.cutoverTransaction.apexMutationAllowed).toBe(false);
    expect(contract.cutoverTransaction.wildcardMutationAllowed).toBe(false);
    expect(contract.cutoverTransaction.wwwMutationAllowed).toBe(false);
    expect(contract.cutoverTransaction.oldProductionRuntimeMustRemainAvailable).toBe(true);
    expect(contract.cutoverTransaction.rollbackBeforeDestructiveCleanup).toBe(true);
  });

  it('keeps current production configuration untouched during readiness', () => {
    expect(rootPackage.scripts.build).toBe('vite build');
    expect(vercel.rewrites).toEqual([{ source: '/((?!.*\\.).*)', destination: '/index.html' }]);
    expect(contract.authorizationBoundary.domainOrDnsWriteAllowedInR2_7).toBe(false);
    expect(contract.authorizationBoundary.r2_7MayAuthorizeCutover).toBe(false);
    expect(contract.currentState.productionMutationCount).toBe(0);
    expect(contract.acceptance.r2_7Complete).toBe(false);
    expect(contract.acceptance.cutoverReady).toBe(false);
    expect(contract.acceptance.cutoverAuthorized).toBe(false);
  });

  it('requires a fresh target witness plus read-only DNS and HTTP rollback evidence', () => {
    expect(readinessScript).toContain("resolveCname(productionHost)");
    expect(readinessScript).toContain("resolve4(productionHost, { ttl: true })");
    expect(readinessScript).toContain("resolveNs(zoneName)");
    expect(readinessScript).toContain("await observeHttp('/')");
    expect(readinessScript).toContain("productionMutationCount: 0");
    expect(workflow).toContain('Fresh external witness of accepted R2.6 target');
    expect(workflow).toContain('Observe current production and freeze rollback baseline');
    expect(workflow).toContain('npm run verify:cutover-readiness');
    expect(doc).toContain('Status: **MATERIALIZED / AWAITING READ-ONLY PRODUCTION WITNESS**');
  });
});
