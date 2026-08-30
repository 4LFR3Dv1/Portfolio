# R0-A1 — Legacy Agentic Migration Amendment

Status: **MATERIALIZED / AWAITING CI WITNESS**

Base: `R0.8 — Migration & Acceptance`

Grounding authority: `R1-PRE — GitHub Corpus Grounding`

R0-A1 exists because the complete connected GitHub corpus disproves one migration assumption made by R0.8 from the narrower legacy Portfolio surface.

R0.8 reserved one future `knowledge.system` identity for:

```text
Agentic Systems & Foundry
  -> rec_d5549271c541d17165c0ad8512dcdcc1
  -> /en/systems/agentic-systems
  -> /pt-br/systems/agentic-systems
```

R1-PRE later established that the old card is not evidence for another independent durable System. The underlying body of work now resolves into concrete subjects including Foundry, Factory and AgentHub.

The frozen R0.8 artifact is not rewritten. This amendment overlays the effective migration interpretation while preserving the historical contract exactly as it was accepted.

## 1. Amendment boundary

R0-A1 changes only the effective migration treatment of the legacy `agentic-systems` Project mapping and the architecture subject bindings that depended on its abandoned reservation.

It does not amend EC-01 through EC-15, R0.2 Record identity, the R0.3 ontology registry, Evidence semantics, disclosure semantics or route grammar.

The constitutional execution rule remains:

```text
frozen prior state
  + explicit amendment
  = reconstructable effective state
```

not:

```text
rewrite old contract
  = pretend the old decision never existed
```

## 2. The reservation is retired before Birth

The identifier:

```text
rec_d5549271c541d17165c0ad8512dcdcc1
```

was provisioned by R0.8 but never admitted as a generation-zero Record.

Therefore R0-A1 does **not** tombstone it.

R0.2 defines tombstone as a terminal accepted revision of an already-born Record. Applying a tombstone here would manufacture a Birth that never occurred.

The correct state is:

```text
reservation status    retired-pre-birth
Record born           false
Record lifecycle      not applicable
reuse                  forbidden forever
```

The reservation is burned as migration history. It may not later become Foundry, Factory, AgentHub or any unrelated Record.

## 3. The historical public locator survives

The public legacy path:

```text
/work/agentic-systems
```

must remain durable because it was part of the frozen public surface.

But it cannot become an R0.7 Record alias to a different System. Rebinding the path to Foundry, Factory or AgentHub would convert one historical public meaning into another identity.

Its effective compatibility treatment is instead:

```text
/work/agentic-systems
  -> legacy compatibility entry
  -> render frozen legacy representation
  -> no target RecordId
  -> no canonical successor redirect
```

The old path remains a historical representation endpoint. It is not a canonical Record route and not an alias to a newly born Record.

The never-enacted planned routes:

```text
/en/systems/agentic-systems
/pt-br/systems/agentic-systems
```

are cancelled. They were migration plans, not published canonical Record locators, so cancelling them creates no URL identity loss.

## 4. Preserve the old representation without preserving the false ontology

The original card remains reconstructable from the R0.0 freeze and its exact legacy source:

```text
legacyId     agentic-systems
title        Agentic Systems & Foundry
source       src/app/data/projects.ts
source blob  df6fe680cd96ede69b3ff7e1f0a6b3b498b16c9f
baseline     bff5519fd2b4986dd0c176bc96974b3233d97525
```

Its public disclosure boundary remains:

```text
record       public
source       private
evidence     none
disclosure   sanitized
```

The frozen guarantee labels remain visible representation text:

```text
EXPLICIT STATE
HUMAN REVIEW
TRACEABLE OUTPUTS
BOUNDED EXECUTION
```

They no longer have a migration disposition of `knowledge.claim` because there is no target System Record to own those inherited claims.

Any future Claim concerning Foundry, Factory or AgentHub must be admitted independently against those concrete Systems and their own Evidence. Nothing is inherited from the broad legacy card merely because the wording is similar.

## 5. Architecture compatibility

R0.8 planned the abandoned RecordId as a subject of two frozen Architecture records:

```text
architecture:systems
architecture:agents
```

R0-A1 removes the abandoned subject binding from the **effective** migration interpretation while preserving the Architecture representations themselves byte-for-byte in history.

The replacement subject binding is deliberately deferred until the concrete Systems are born in R1.

This means:

```text
frozen diagram/text remains
abandoned subject identity does not
new subject relation is not guessed pre-Birth
```

R1 may later relate those Architecture records to Foundry, Factory, AgentHub or a narrower subset only through explicit born Record references and a new accepted relation state.

## 6. Identity consequence

The amendment establishes an important distinction:

```text
historical representation continuity
!=
logical System continuity
```

The old card can survive as public history without forcing a synthetic durable System to exist.

Likewise:

```text
preserve URL
!=
reassign URL to nearest modern concept
```

This is the direct application of EC-11, EC-12, EC-14 and the R0.2 locator law.

## 7. Effective R0 state

After this amendment is CI witnessed, the effective migration state becomes:

```text
R0.8 frozen historical contract              preserved
agentic-systems pre-Birth reservation         retired
abandoned RecordId reuse                      forbidden
/work/agentic-systems                         preserved
legacy representation                         preserved
legacy guarantees                             representation-only
planned agentic canonical Record routes       cancelled
architecture false subject binding            removed effectively
Foundry / Factory / AgentHub identity          independent Birth required
runtime semantics changed                     false
public UI changed                              false
R0 consistency                                restored
```

No Record Birth occurs in R0-A1.

## 8. R1 boundary

R1-PRE already completed corpus identity reconstruction. R0-A1 removes the only known contradiction between that grounding and the frozen R0.8 migration map.

Once the amendment materialization and terminal completion commits both pass `npm run verify`:

```text
R0_A1_COMPLETE=true
R0_EFFECTIVE_COMPLETE=true
R1_0_UNBLOCKED=true
```

The next cut is:

```text
R1.0 — Editorial Runtime Boundary
```

R1.0 may then define the executable boundary between the frozen/admitted editorial contracts and the new publication runtime without silently turning repositories, old cards or route locators into ontology.
