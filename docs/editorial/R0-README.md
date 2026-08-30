# R0 — Editorial Constitution & Content Ontology

Status: **COMPLETE / FROZEN**

Canonical legacy baseline: `main@bff5519fd2b4986dd0c176bc96974b3233d97525`

R0 is the constitutional migration from the project-centric Portfolio model to a record-centric editorial knowledge system. It froze the old public surface, established public-truth rules, defined durable Record identity, knowledge and Evidence semantics, representation boundaries, disclosure/maturity governance, route/language identity, and finally reconciled the complete frozen legacy surface into that model without changing the public runtime.

## Program

| Cut | Purpose | Status |
| --- | --- | --- |
| R0.0 | Current Surface Freeze | **COMPLETE** |
| R0.1 | Editorial Constitution | **COMPLETE** |
| R0.2-PRE | Brine Identity Grounding | **COMPLETE** |
| R0.2 | Record Identity Contract | **COMPLETE** |
| R0.3 | Knowledge Ontology | **COMPLETE** |
| R0.4 | Evidence Contract | **COMPLETE** |
| R0.5 | Publication & Architecture Contract | **COMPLETE** |
| R0.6 | Visibility / Maturity / Disclosure | **COMPLETE** |
| R0.7 | Route + Language Identity | **COMPLETE** |
| R0.8 | Migration & Acceptance | **COMPLETE** |

## Terminal acceptance

R0.8 reconciles the machine-readable R0.0 freeze with:

```text
semantic_loss_count=0
unresolved_migration_count=0
runtime_semantics_changed=false
ui_changed=false
```

The exact R0.8 materialization manifest is cryptographically sealed by `docs/editorial/R0.8-completion.v0.json`, which binds the successful repository `Verify` witness.

```text
R0_8_COMPLETE=true
R0_COMPLETE=true
```

## Constitutional execution rule

A completed cut is not silently rewritten by a later cut. Material changes to a frozen contract require an explicit amendment so the history of the editorial system remains reconstructable.

Research grounding cuts such as R0.2-PRE are explicitly non-normative. They may derive candidate laws from prior research, but those laws acquire authority only when admitted by the corresponding normative R0 cut.

Each normative cut owns only its declared semantic layer. Later implementation MUST NOT bypass these boundaries merely for rendering or migration convenience.

## R0 / R1 boundary

R0 changed no public UI, runtime routing behavior or framework. Reserved migration `RecordId`s are not born Records yet.

**R1 — Editorial Foundation** is now the next program. R1 may materialize generation-zero Records, enact the frozen route/locale compatibility plan, create the editorial runtime and begin projecting the admitted graph into a public reading surface.
