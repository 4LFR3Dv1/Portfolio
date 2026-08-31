# R2 — Editorial Publication Shell & Cutover

Status: **IN PROGRESS**

Effective preconditions:

```text
R0_EFFECTIVE_COMPLETE=true
R1_PRE_COMPLETE=true
R1_COMPLETE=true
FOUNDATION_READY=true
CUTOVER_READY=false
CUTOVER_AUTHORIZED=false
```

R2 turns the accepted editorial foundation into a physical publication runtime without allowing presentation, framework or deployment convenience to become semantic authority.

## Program

| Cut | Purpose | Status |
| --- | --- | --- |
| R2.0 | Publication Shell Boundary | **NEXT** |
| R2.1 | Astro Shell Materialization & Editorial Renderer | **NOT STARTED** |
| R2.2 | Distribution Emission | **NOT STARTED** |
| R2.3 | Legacy Preservation Runtime | **NOT STARTED** |
| R2.4 | Compatibility Redirect Adapter | **NOT STARTED** |
| R2.5 | Static Runtime Commissioning | **NOT STARTED** |
| R2.6 | Shadow / Preview Deployment | **NOT STARTED** |
| R2.7 | Cutover Readiness | **NOT STARTED** |
| R2.8 | Public Cutover | **NOT STARTED** |
| R2.9 | Physical Acceptance | **NOT STARTED** |

## Authority boundary

```text
accepted R1 state
      ↓
Publication Shell Plan
      ↓
Astro static renderer
      ↓
HTML / metadata / feeds / indexes
      ↓
optional React islands
```

The renderer is a consumer. It cannot mint Records, rewrite Evidence, change disclosure, infer translations, invent routes or reinterpret legacy identities.

## Deployment rule

R2 separates physical readiness from activation:

```text
shell materialized
      !=
preview commissioned
      !=
cutover ready
      !=
cutover authorized
      !=
cutover enacted
```

The current React/Vite deploy remains authoritative until an explicit R2 cutover step.

```text
NEXT=R2.0 — Publication Shell Boundary
```
