# R2-A1 — Current Publication Re-emission & Physical Revalidation

Status: **IN PROGRESS / A1.0 ACCEPTED**

Parent semantic authority:

```text
R1_A2_COMPLETE=true
CURRENT_PUBLICATION_VALID=true
CURRENT_PUBLICATION_DIGEST=
sha256_f72c807283aa0f2da0a20b3ecaf1ec5f99227fedac47aa9fb988f5c924997d32
```

R2-A1 is a physical amendment. It does not reopen System identity, current Revision payload, Evidence, maturity, disclosure, route/language identity, or editorial surface selection. Those semantics are frozen by R1-A2.8.

## Why R2-A1 exists

The historical R2.6 preview and R2.7 readiness campaign physically proved an older publication specimen. Human inspection then contradicted that specimen's semantic eligibility and R1-A2 reconstructed a new accepted publication state.

Therefore:

```text
historical transport success
        !=
physical identity of the A2.8 specimen
```

The new semantic specimen must cross the physical stack again.

## Constitutional direction

```text
A2.8 accepted publication digest
        ↓
current renderer input
        ↓
current distribution emission
        ↓
compatibility reconciliation
        ↓
commissioned local HTTP runtime
        ↓
isolated preview runtime
        ↓
real Internet / TLS / hosting layer
        ↓
external invariance witness
        ↓
current cutover-readiness decision
```

Every arrow is a transform whose output must remain attributable to the exact A2.8 publication digest.

## Non-authorities

The following remain useful historical implementations or evidence, but none may become the source of current meaning:

- `src/editorial/renderer-input.ts` — historical R1.6/R1.7 renderer input;
- `docs/editorial/distribution-foundation.v0.json` — historical distribution contract;
- the accepted historical R2.6 Railway deployment;
- the historical R2.6 external TLS witness;
- the historical R2.7 cutover-readiness seal.

They may be reused as implementation substrate only where R2-A1 proves that the resulting bytes bind to the A2.8 digest.

## R2-A1.0 accepted boundary

The A1.0 candidate `8b98b32d2016822c56201fcb21cc3376e2ec7c0c` passed:

```text
Verify #347                    SUCCESS
Editorial Shell Build #182     SUCCESS
Cutover Readiness #113         SUCCESS
```

The accepted boundary fixes the A2.8 publication digest as physical source identity, preserves historical R2.6/R2.7 only as evidence, forbids semantic mutation inside R2-A1 and keeps production excluded.

## Program

| Cut | Purpose | Status |
| --- | --- | --- |
| R2-A1.0 | Physical Re-emission Constitution | **COMPLETE** |
| R2-A1.1 | Current Renderer Input Re-emission | **NEXT** |
| R2-A1.2 | Current Distribution Emission | **NOT STARTED** |
| R2-A1.3 | Compatibility + Static Runtime Recommissioning | **NOT STARTED** |
| R2-A1.4 | Isolated Current Preview Deployment | **NOT STARTED** |
| R2-A1.5 | External Environmental Invariance + Current Readiness | **NOT STARTED** |

## Production exclusion

R2-A1 is not cutover.

```text
renan.snelabs.space mutation          forbidden
production DNS mutation               forbidden
root vercel.json mutation             forbidden
incumbent public runtime mutation     forbidden
cutover authorization                 excluded
cutover enactment                     excluded
```

Read-only observation of production is permitted only when a later R2-A1 readiness cut needs to compare the incumbent rollback target or current network state.

## Immediate state

```text
R2_A1_0_COMPLETE=true
R2_A1_COMPLETE=false
CURRENT_PUBLICATION_VALID=true
CURRENT_PHYSICAL_PUBLICATION_VALID=false
CURRENT_SPECIMEN_REEMITTED=false
CURRENT_DISTRIBUTION_EMITTED=false
CURRENT_STATIC_RUNTIME_RECOMMISSIONED=false
CURRENT_PREVIEW_REDEPLOYED=false
CURRENT_PREVIEW_EXTERNALLY_WITNESSED=false
CUTOVER_READY=false
CUTOVER_AUTHORIZED=false
CUTOVER_ENACTED=false
PRODUCTION_MUTATION_COUNT=0
NEXT=R2-A1.1 — Current Renderer Input Re-emission
```
