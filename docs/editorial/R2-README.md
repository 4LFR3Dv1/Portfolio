# R2 — Editorial Publication Shell & Cutover

Status: **IN PROGRESS**

Effective preconditions:

```text
R0_EFFECTIVE_COMPLETE=true
R1_PRE_COMPLETE=true
R1_COMPLETE=true
FOUNDATION_READY=true
CUTOVER_READY=true
CUTOVER_AUTHORIZED=false
```

R2 turns the accepted editorial foundation into a physical publication runtime without allowing presentation, framework or deployment convenience to become semantic authority.

## Program

| Cut | Purpose | Status |
| --- | --- | --- |
| R2.0 | Publication Shell Boundary | **COMPLETE** |
| R2.1 | Astro Shell Materialization & Editorial Renderer | **COMPLETE** |
| R2.2 | Distribution Emission | **COMPLETE** |
| R2.3 | Legacy Preservation Runtime | **COMPLETE** |
| R2.4 | Compatibility Redirect Adapter | **COMPLETE** |
| R2.5 | Static Runtime Commissioning | **COMPLETE** |
| R2.6 | Shadow / Preview Deployment | **COMPLETE** |
| R2.7 | Cutover Readiness | **COMPLETE** |
| R2.8 | Public Cutover | **NEXT / REQUIRES EXPLICIT AUTHORIZATION** |
| R2.9 | Physical Acceptance | **NOT STARTED** |

## Authority boundary

```text
accepted R1 state
      ↓
Publication Shell Plan
      ↓
bounded renderer input
      ↓
Astro static renderer
      ↓
HTML + emitted distribution artifacts
      +
bounded historical compatibility pages
      +
bounded redirect handshake state
      ↓
commissioned local HTTP runtime
      ↓
isolated preview binding
      ↓
public HTTPS hosting transport
      ↓
external environmental witness
      ↓
accepted R2.6 target
      +
read-only current production observation
      ↓
accepted cutover transaction + rollback baseline
      ↓
explicit R2.8 authorization boundary
```

The renderer, commissioned server, preview binding and hosting layer are consumers. They cannot mint Records, rewrite Evidence, change disclosure, infer translations, invent routes or reinterpret legacy identities.

R2.0 froze the renderer-facing shell boundary. R2.1 physically materialized an isolated Astro 7.2.9 shell with a committed dependency lock and a prebuild adapter that passes only bounded public DTOs into Astro. R2.2 physically emits canonical/robots/hreflang metadata for all 18 canonical pages plus the accepted sitemap, two empty language RSS feeds and the six-entry semantic search index. R2.3 physically preserves the four R1.8 historical exceptions from the exact frozen R0.0 source blobs, keeps their shared-path EN/PT client-state behavior and quarantines them from canonical distribution. R2.4 physically witnesses all eight language-specific successors through a bounded HTTP 302 adapter, with client-side `portfolio-language` handshakes and fail-closed 503 behavior if a successor stops being distributed. R2.5 composes canonical pages, historical pages, handshakes, redirect behavior, distribution artifacts, two physical static assets and the 404 into one locally commissioned HTTP runtime. R2.6 deploys that semantic runtime through a bounded `0.0.0.0:$PORT` adapter to an isolated Railway HTTPS origin and physically compares the public environment against a fresh local R2.5 runtime from a GitHub-hosted external observer. R2.7 then re-proves that accepted target, captures the exact incumbent production CNAME/A/NS/SOA and HTTP fingerprints read-only, preserves the existing Vercel runtime as rollback and freezes R2.8 as a bounded domain handoff affecting only `renan.snelabs.space`. Production remains on Vercel and the Railway service still has no custom production domain attached.

## Deployment rule

R2 separates physical readiness from activation:

```text
shell materialized
      !=
distribution emitted in build
      !=
legacy compatibility rendered in build
      !=
redirect adapter materialized and witnessed
      !=
redirect adapter activated in production
      !=
static runtime commissioned locally
      !=
preview adapter materialized
      !=
preview publicly deployed and witnessed
      !=
cutover readiness materialized
      !=
cutover ready
      !=
cutover authorized
      !=
cutover enacted
```

The current React/Vite Vercel deploy remains authoritative until an explicitly authorized R2.8 cutover step.

```text
R2_0_COMPLETE=true
R2_1_COMPLETE=true
R2_2_COMPLETE=true
R2_3_COMPLETE=true
R2_4_COMPLETE=true
R2_5_COMPLETE=true
R2_6_COMPLETE=true
R2_7_COMPLETE=true
CUTOVER_READY=true
CUTOVER_AUTHORIZED=false
CUTOVER_ENACTED=false
NEXT=R2.8 — Public Cutover (explicit authorization required)
```
