import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

function readRepoFile(path: string): string {
  return readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
}

function readJson<T>(path: string): T {
  return JSON.parse(readRepoFile(path)) as T;
}

const contract = readJson<any>('docs/editorial/cutover-readiness.v0.json');
const completion = readJson<any>('docs/editorial/R2.7-completion.v0.json');
const r26 = readJson<any>('docs/editorial/R2.6-completion.v0.json');
const rootPackage = readJson<any>('package.json');
const vercel = readJson<any>('vercel.json');
const readinessScript = readRepoFile('editorial-shell/scripts/verify-cutover-readiness.mjs');
const workflow = readRepoFile('.github/workflows/editorial-cutover-readiness.yml');
const doc = readRepoFile('docs/editorial/R2.7-cutover-readiness.md');

describe('R2.7 cutover readiness', () => {
  it('uses the exact accepted R2.6 deployment as the cutover target', () => {
    expect(r26.acceptance.r2_6Complete).toBe(true);
    expect(contract.status).toBe('accepted');
    expect(contract.baseline).toBe('1479b5ce092655c770bc24dee8c94fc825db931e');
    expect(contract.acceptedTarget.origin).toBe(r26.acceptedPreviewSpecimen.origin);
    expect(contract.acceptedTarget.deploymentId).toBe(r26.acceptedPreviewSpecimen.deploymentId);
    expect(contract.acceptedTarget.semanticRuntimeReplacementAllowed).toBe(false);
    expect(contract.acceptedTarget.redeployRequiredForCutover).toBe(false);
    expect(completion.acceptedTarget.deploymentId).toBe(contract.acceptedTarget.deploymentId);
    expect(completion.acceptedTarget.freshSemanticDifferenceCount).toBe(0);
    expect(completion.acceptedTarget.freshTlsAuthorized).toBe(true);
    expect(completion.acceptedTarget.customProductionDomainAttached).toBe(false);
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
    expect(completion.rollback.exactCnameToRestore).toBe('d27855497dcf813a.vercel-dns-017.com');
    expect(completion.rollback.observedTtlSeconds).toBe(300);
  });

  it('keeps current production configuration untouched while sealing readiness', () => {
    expect(rootPackage.scripts.build).toBe('vite build');
    expect(vercel.rewrites).toEqual([{ source: '/((?!.*\\.).*)', destination: '/index.html' }]);
    expect(contract.authorizationBoundary.domainOrDnsWriteAllowedInR2_7).toBe(false);
    expect(contract.authorizationBoundary.r2_7MayAuthorizeCutover).toBe(false);
    expect(contract.authorizationBoundary.r2_8RequiresExplicitAuthorization).toBe(true);
    expect(contract.currentState.railwayCustomProductionDomainAttached).toBe(false);
    expect(contract.currentState.productionMutationCount).toBe(0);
    expect(completion.productionBoundary.productionDnsChanged).toBe(false);
    expect(completion.productionBoundary.productionDomainChanged).toBe(false);
    expect(completion.productionBoundary.railwayCustomProductionDomainAttached).toBe(false);
    expect(completion.productionBoundary.vercelConfigurationChanged).toBe(false);
    expect(completion.productionBoundary.rootBuildScriptChanged).toBe(false);
    expect(completion.productionBoundary.productionMutationCount).toBe(0);
  });

  it('seals the read-only DNS and HTTP rollback evidence', () => {
    expect(contract.currentState.freshTargetWitnessed).toBe(true);
    expect(contract.currentState.productionDnsSnapshotCaptured).toBe(true);
    expect(contract.currentState.productionHttpFingerprintCaptured).toBe(true);
    expect(contract.currentState.rollbackBaselineCaptured).toBe(true);
    expect(completion.productionBaseline.dns.cname).toEqual(['d27855497dcf813a.vercel-dns-017.com']);
    expect(completion.productionBaseline.dns.a).toEqual([
      { address: '216.150.1.1', ttl: 300 },
      { address: '216.150.16.1', ttl: 300 },
    ]);
    expect(completion.productionBaseline.dns.aaaa).toEqual([]);
    expect(completion.productionBaseline.http.root.status).toBe(200);
    expect(completion.productionBaseline.http.root.server).toBe('Vercel');
    expect(completion.productionBaseline.http.root.bodySha256).toBe(
      'sha256:1b1140b646d40fb3f52d874d13faa85bbb90857623f9c4bdc81733749fb25740',
    );
    expect(readinessScript).toContain("resolveCname(productionHost)");
    expect(readinessScript).toContain("resolve4(productionHost, { ttl: true })");
    expect(readinessScript).toContain("resolveNs(zoneName)");
    expect(readinessScript).toContain("await observeHttp('/')");
    expect(readinessScript).toContain("productionMutationCount: 0");
    expect(workflow).toContain('Fresh external witness of accepted R2.6 target');
    expect(workflow).toContain('Observe current production and freeze rollback baseline');
    expect(workflow).toContain('npm run verify:cutover-readiness');
  });

  it('promotes readiness without authorizing or enacting cutover', () => {
    expect(completion.status).toBe('complete');
    expect(contract.acceptance.r2_7Complete).toBe(true);
    expect(contract.acceptance.cutoverReady).toBe(true);
    expect(contract.acceptance.cutoverAuthorized).toBe(false);
    expect(completion.acceptance.r2_7Complete).toBe(true);
    expect(completion.acceptance.cutoverReady).toBe(true);
    expect(completion.acceptance.cutoverAuthorized).toBe(false);
    expect(completion.acceptance.cutoverEnacted).toBe(false);
    expect(completion.acceptance.nextRequiredCut).toBe('R2.8 — Public Cutover');
    expect(doc).toContain('Status: **COMPLETE / CUTOVER READY / NOT AUTHORIZED**');
  });
});
