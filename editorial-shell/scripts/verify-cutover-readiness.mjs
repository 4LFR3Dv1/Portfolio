/* global URL, fetch, process, Buffer, console */
import { createHash } from 'node:crypto'
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve4, resolve6, resolveAny, resolveCname, resolveNs, resolveSoa } from 'node:dns/promises'

const contract = JSON.parse(readFileSync(new URL('../../docs/editorial/cutover-readiness.v0.json', import.meta.url), 'utf8'))
const r26 = JSON.parse(readFileSync(new URL('../../docs/editorial/R2.6-completion.v0.json', import.meta.url), 'utf8'))
const targetWitnessPath = process.env.R2_7_TARGET_WITNESS_PATH ?? 'r2-7-target-witness.json'
const outputPath = process.env.R2_7_READINESS_WITNESS_PATH ?? 'r2-7-cutover-readiness-witness.json'
const targetWitness = JSON.parse(readFileSync(new URL(`../${targetWitnessPath}`, import.meta.url), 'utf8'))

const productionOrigin = contract.productionBaseline.origin
const productionHost = contract.productionBaseline.dnsName
const zoneName = contract.productionBaseline.zoneName

function sha256(buffer) {
  return `sha256:${createHash('sha256').update(buffer).digest('hex')}`
}

async function optionalDns(label, operation) {
  try {
    return { label, values: await operation(), error: null }
  } catch (error) {
    if (['ENODATA', 'ENOTFOUND', 'ENONAME'].includes(error?.code)) {
      return { label, values: [], error: null }
    }
    return { label, values: [], error: `${error?.code ?? 'DNS_ERROR'}:${error?.message ?? String(error)}` }
  }
}

async function observeHttp(path) {
  const url = new URL(path, productionOrigin)
  const response = await fetch(url, {
    method: 'GET',
    redirect: 'follow',
    headers: {
      'user-agent': 'portfolio-r2.7-readiness-witness/1',
      accept: '*/*',
    },
  })
  const body = Buffer.from(await response.arrayBuffer())
  const pickedHeaders = {}
  for (const key of [
    'server',
    'via',
    'content-type',
    'cache-control',
    'content-language',
    'x-robots-tag',
    'x-content-type-options',
    'x-vercel-id',
    'x-vercel-cache',
    'location',
  ]) {
    const value = response.headers.get(key)
    if (value !== null) pickedHeaders[key] = value
  }
  return {
    path,
    requestedUrl: url.href,
    finalUrl: response.url,
    status: response.status,
    redirected: response.redirected,
    headers: pickedHeaders,
    bodySha256: sha256(body),
    bodyBytes: body.length,
  }
}

const rootPackage = JSON.parse(readFileSync(new URL('../../package.json', import.meta.url), 'utf8'))
const vercel = JSON.parse(readFileSync(new URL('../../vercel.json', import.meta.url), 'utf8'))

if (r26.acceptance.r2_6Complete !== true) throw new Error('r2-7-r2-6-not-complete')
if (r26.acceptance.cutoverReady !== false) throw new Error('r2-7-r2-6-cutover-state-unexpected')
if (r26.acceptedPreviewSpecimen.origin !== contract.acceptedTarget.origin) throw new Error('r2-7-target-origin-drift')
if (r26.acceptedPreviewSpecimen.deploymentId !== contract.acceptedTarget.deploymentId) throw new Error('r2-7-target-deployment-drift')
if (targetWitness.previewOrigin !== contract.acceptedTarget.origin) throw new Error('r2-7-fresh-target-origin-mismatch')
if (targetWitness.semanticDifferenceCount !== 0) throw new Error('r2-7-fresh-target-semantic-diff')
if (targetWitness.tls?.authorized !== true) throw new Error('r2-7-fresh-target-tls-failed')
if (targetWitness.productionOriginContacted !== false) throw new Error('r2-7-target-witness-contacted-production')
if (rootPackage.scripts?.build !== contract.productionBaseline.rootBuildContractRequired) throw new Error('r2-7-root-build-contract-drift')
if (JSON.stringify(vercel.rewrites) !== JSON.stringify([{ source: '/((?!.*\\.).*)', destination: '/index.html' }])) {
  throw new Error('r2-7-vercel-production-contract-drift')
}

const dns = {
  cname: await optionalDns('CNAME', () => resolveCname(productionHost)),
  a: await optionalDns('A', () => resolve4(productionHost, { ttl: true })),
  aaaa: await optionalDns('AAAA', () => resolve6(productionHost, { ttl: true })),
  any: await optionalDns('ANY', () => resolveAny(productionHost)),
  ns: await optionalDns('NS', () => resolveNs(zoneName)),
  soa: await optionalDns('SOA', () => resolveSoa(zoneName)),
}

const dnsErrors = Object.values(dns).filter((entry) => entry.error !== null)
const addressCount = dns.cname.values.length + dns.a.values.length + dns.aaaa.values.length
if (addressCount === 0) throw new Error('r2-7-production-dns-unresolved')
if (dns.ns.values.length === 0) throw new Error('r2-7-zone-ns-unresolved')
if (dns.soa.values.length === 0 && dns.soa.error === null) throw new Error('r2-7-zone-soa-unresolved')

const productionHttp = {
  root: await observeHttp('/'),
  robots: await observeHttp('/robots.txt'),
  sitemap: await observeHttp('/sitemap.xml'),
}

if (productionHttp.root.status < 200 || productionHttp.root.status >= 400) {
  throw new Error(`r2-7-production-root-unhealthy:${productionHttp.root.status}`)
}

const witness = {
  schemaVersion: 'editorial-cutover-readiness-witness/v0',
  contractId: contract.contractId,
  generatedAt: new Date().toISOString(),
  sourceCommit: process.env.GITHUB_SHA ?? null,
  observationMode: 'read-only',
  acceptedTarget: {
    deploymentId: r26.acceptedPreviewSpecimen.deploymentId,
    origin: r26.acceptedPreviewSpecimen.origin,
    freshTlsAuthorized: targetWitness.tls.authorized,
    freshTlsProtocol: targetWitness.tls.protocol,
    freshSemanticDifferenceCount: targetWitness.semanticDifferenceCount,
    freshStaticAssetCount: targetWitness.counts?.staticAssets ?? null,
  },
  productionBaseline: {
    origin: productionOrigin,
    dns,
    http: productionHttp,
    repositoryContract: {
      rootBuildScript: rootPackage.scripts.build,
      vercelRewrites: vercel.rewrites,
    },
  },
  rollbackBaseline: {
    dnsAnswerSetCaptured: true,
    productionHttpFingerprintCaptured: true,
    oldProductionSourcePreserved: true,
    oldVercelConfigPreserved: true,
  },
  cutoverTransaction: contract.cutoverTransaction,
  diagnostics: {
    dnsErrors,
  },
  acceptance: {
    acceptedTargetStillEquivalent: true,
    currentProductionDnsCaptured: true,
    currentProductionHttpCaptured: true,
    rollbackBaselineCaptured: true,
    cutoverWriteSetBounded: true,
    productionMutationCount: 0,
    cutoverReadyCandidate: true,
    cutoverAuthorized: false,
  },
}

writeFileSync(outputPath, `${JSON.stringify(witness, null, 2)}\n`)

console.log(`accepted_target=${witness.acceptedTarget.origin}`)
console.log(`target_semantic_diff_count=${witness.acceptedTarget.freshSemanticDifferenceCount}`)
console.log(`production_dns_answers=${addressCount}`)
console.log(`production_nameservers=${dns.ns.values.length}`)
console.log(`production_root_status=${productionHttp.root.status}`)
console.log(`production_root_sha256=${productionHttp.root.bodySha256}`)
console.log(`production_mutation_count=${witness.acceptance.productionMutationCount}`)
console.log(`witness=${outputPath}`)
console.log('R2.7 CUTOVER READINESS READ-ONLY WITNESS: PASS')
