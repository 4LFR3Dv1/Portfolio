# R2-A1 — Current Publication Re-emission & Physical Revalidation

Status: **IN PROGRESS / A1.1 ACCEPTED**

Parent semantic authority:

```text
R1_A2_COMPLETE=true
CURRENT_PUBLICATION_VALID=true
CURRENT_PUBLICATION_DIGEST=sha256_f72c807283aa0f2da0a20b3ecaf1ec5f99227fedac47aa9fb988f5c924997d32
```

R2-A1 is a physical amendment. It does not reopen System identity, current Revision payload, Evidence, maturity, disclosure, route/language identity, or editorial surface selection. Those semantics are frozen by R1-A2.8.

## Direction of authority

```text
A2.8 accepted publication digest
        ↓
A1.1 current renderer input
        ↓
A1.2 current distribution emission
        ↓
A1.3 compatibility + commissioned runtime
        ↓
A1.4 isolated preview
        ↓
A1.5 external invariance + readiness
```

Historical R2.0–R2.7 remain implementation substrate and evidence only. They cannot substitute for the current A2.8-bound specimen.

## R2-A1.0 — accepted physical boundary

Candidate `8b98b32d2016822c56201fcb21cc3376e2ec7c0c` passed Verify #347, Editorial Shell Build #182 and Cutover Readiness #113. The terminal A1.0 seal also remained green before A1.1 began.

## R2-A1.1 — accepted current renderer input

A1.1 introduced a new current renderer-neutral physical input instead of modifying the historical `src/editorial/renderer-input.ts` authority. Its source chain is exact:

```text
A2.8 semantic completion
        +
A1.0 physical boundary completion
        +
12 current surfaces
        +
54 current semantic documents
        ↓
CurrentRendererInput
```

Accepted physical identities:

```text
accepted publication digest
sha256_f72c807283aa0f2da0a20b3ecaf1ec5f99227fedac47aa9fb988f5c924997d32

renderer input digest
sha256_4b2bc45e2127befd4f7be0aaf7b4a2cebe0ad7ab9da7a7fa774414af155d73e6

generated JSON byte digest
sha256_43021b2d7007c3452ec7bbc8654fc0b3e9fdc8b9efc15e97f02eb88a627a3c36
```

The accepted candidate `c1ada26b0391ec65fde78de9c8e930dd60211499` passed:

```text
Verify #359                    SUCCESS
Editorial Shell Build #194     SUCCESS
Cutover Readiness #125         SUCCESS
```

The Shell Build physically materialized 12 surfaces and 54 documents, 27 EN + 27 PT-BR. Artifact `9772638124` has ZIP SHA-256 `9ae2f952c4d2d45a874b5ae92946baccb5866be61252c6013153e42af89c9211`.

A1.1 deliberately did **not** switch the Astro build to the new input. The historical 18-page shell remained a control and passed its old commissioning and Internet witness unchanged. Therefore renderer input re-emission is proven independently from distribution emission.

## Program

| Cut | Purpose | Status |
| --- | --- | --- |
| R2-A1.0 | Physical Re-emission Constitution | **COMPLETE** |
| R2-A1.1 | Current Renderer Input Re-emission | **COMPLETE** |
| R2-A1.2 | Current Distribution Emission | **NEXT** |
| R2-A1.3 | Compatibility + Static Runtime Recommissioning | **NOT STARTED** |
| R2-A1.4 | Isolated Current Preview Deployment | **NOT STARTED** |
| R2-A1.5 | External Environmental Invariance + Current Readiness | **NOT STARTED** |

## Production exclusion

```text
renan.snelabs.space mutation          forbidden
production DNS mutation               forbidden
root vercel.json mutation             forbidden
incumbent public runtime mutation     forbidden
cutover authorization                 excluded
cutover enactment                     excluded
```

## Immediate state

```text
R2_A1_0_COMPLETE=true
R2_A1_1_COMPLETE=true
R2_A1_COMPLETE=false
CURRENT_PUBLICATION_VALID=true
CURRENT_SPECIMEN_REEMITTED=true
CURRENT_RENDERER_INPUT_DIGEST=sha256_4b2bc45e2127befd4f7be0aaf7b4a2cebe0ad7ab9da7a7fa774414af155d73e6
CURRENT_DISTRIBUTION_EMITTED=false
CURRENT_STATIC_RUNTIME_RECOMMISSIONED=false
CURRENT_PREVIEW_REDEPLOYED=false
CURRENT_PREVIEW_EXTERNALLY_WITNESSED=false
CURRENT_PHYSICAL_PUBLICATION_VALID=false
CUTOVER_READY=false
CUTOVER_AUTHORIZED=false
CUTOVER_ENACTED=false
PRODUCTION_MUTATION_COUNT=0
NEXT=R2-A1.2 — Current Distribution Emission
```
