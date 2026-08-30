# R1-PRE.2 — Corpus Admission Frontier

Status: **MATERIALIZED / PRE-BIRTH**

Preconditions:

```text
R0_COMPLETE=true
connected_repository_census=54/54
repository_grounding_disposition=54/54
R1_PRE_1_second_wave=true
```

R1-PRE.2 converts repository grounding into a durable-entity admission frontier. It still creates **zero Records** and performs **zero Birth events**.

The purpose is not to publish every repository. It is to decide which durable subjects actually exist behind the repository corpus and which repository identities are only realizations, historical material, artifacts, third-party references or private workspaces.

## 1. Same-identity requires positive continuity evidence

R1-PRE adopts the R0 identity discipline for corpus reconstruction:

```text
similar architecture
similar name
chronological adjacency
shared vocabulary
same owner
        !=
proof of same durable identity
```

When two repositories each define their own system boundary and no explicit continuity relation exists, they remain distinct identities. A later proven predecessor/successor or migration relation may connect them without rewriting either identity.

This closes several previously open canonicality questions.

## 2. Personal Identity Runtime and Lisa remain distinct

`identity-runtime` predates `lisa-runtime` by roughly one day in repository creation time, but temporal adjacency is not identity authority.

The inspected corpora establish different system boundaries:

```text
Personal Identity Runtime
  local-first Windows identity runtime
  observation / projection / episodic memory
  bounded cognition
  Morphing Shell

Lisa
  business-facing operational digital presence
  conversations / messages / actions / jobs
  company knowledge / tools / handoff / audit
  lisa-web + lisa-app + lisa-runtime realizations
```

Cross-repository code search found no `Lisa` reference in `identity-runtime`, no `identity-runtime` reference in the Lisa repositories, and no issue-level continuity declaration.

Therefore:

```text
Personal Identity Runtime != Lisa
```

A possible intellectual predecessor relationship remains a non-claim until positive evidence appears. Separate logical identities are admission-safe.

## 3. Brine and BrineOS remain distinct

The two repositories have different explicit system boundaries and no inspected cross-reference establishing identity continuity.

```text
Brine
  local-first persistent agent runtime
  model replaceable
  runtime owns identity/state/context/memory/effects/recovery

BrineOS
  bare-metal research system
  asks what minimum non-intelligent substrate lets an AI-native entity
  exist directly on hardware
  owns continuity/authority/epistemic separation below the host OS
```

`BrineT` was created before `BrineOS`, but chronology and naming similarity do not transfer Record identity.

Therefore:

```text
Brine != BrineOS
```

They may later receive an explicit intellectual/research relation, but they must not share a RecordId by inference.

## 4. SNE Vault is a historical System distinct from SNE-OS

The SNE Vault repository defines its own product/system surface across Passport, Vault, Keys, Radar, Explore and Docs.

SNE-OS later imported material from that system. Its history explicitly records:

```text
Migrate advanced Docs page from SNE VAULT to SNE OS
```

and later describes SNE Vault **integration** inside SNE-OS. The current SNE-OS runtime is broader and composes Radar, Swaps, Vault, Pass, Keys and Secrets.

This supports:

```text
SNE Vault
  historical System
       ↓ material migration / integration
SNE-OS
  later broader System
```

not:

```text
SNE Vault == SNE-OS
```

The two receive distinct candidate identities. Migration provenance is preserved as a relation.

## 5. SNE Observatório remains distinct from SNE Radar

SNE Observatório is explicit historical SNE market-language research. Later Radar repositories share domain and conceptual vocabulary, but no inspected source or history explicitly declares Observatório to be the same durable Radar identity.

Therefore the safe model is:

```text
SNE Observatório
  historical market-language research System

SNE Radar
  later Radar System lineage

exact predecessor relation
  unasserted
```

This prevents a thematic similarity from being promoted into lineage fact.

## 6. ORDM is one research lineage across PoC and testnet realizations

ORDM has stronger continuity evidence than the cases above.

The private `ordm` repository is a compact Go proof of concept for a hybrid offline chain:

```text
offline lightweight PoW
  -> DAG micro-blocks
  -> online reconciliation
  -> BFT macro-blocks
```

Two days later `ordm-testnet` begins with the explicit commit:

```text
Initial commit: ORDM Testnet with complete deploy configuration
```

and then extends the same offline→online research direction with an independent offline miner and synchronization/validation phases. Its current README calls the repository “ORDM Testnet” and describes it as retained legacy research.

The empty `ORDM-TESTNET-v.01` contributes no competing implementation identity.

R1-PRE therefore admits one durable historical research subject:

```text
ORDM
  ├── ordm                 early PoC realization
  ├── ORDM-TESTNET-v.01    empty placeholder; no semantic authority
  └── ordm-testnet         expanded testnet / legacy research realization
```

## 7. SNE Scroll Pass remains distinct

`SNE-Scroll-Passport` defines an independently deployed Scroll-facing product surface. No inspected SNE Vault/SNE-OS source establishes that repository as the same identity as the older in-suite `SNE Pass` concept.

Therefore:

```text
SNE Scroll Pass != SNE Pass-by-name
```

It remains its own historical/public System candidate unless future provenance proves continuity.

## 8. Legacy Portfolio reconciliation changes before Birth

R0.8 reserved identities from the **legacy Portfolio**, not from the complete corpus. R1-PRE now reconciles those reservations against the actual systems.

### VIRA

```text
legacy VIRA reservation
  -> current VIRA durable subject
```

Safe to preserve reservation into eventual Birth.

### XS Wallet

```text
legacy XS Wallet reservation
  -> current XS Wallet / Domini durable subject
```

Logical subject is preserved; canonical public title remains unresolved.

### SNE OS

```text
legacy SNE OS reservation
  -> current SNE-OS durable subject
```

Safe to preserve reservation into eventual Birth.

### Foundry Pay

R0.8 introduced Foundry Pay only as a bounded supporting System because the old Architecture surface named it. Repository grounding now establishes it as a full independent System. The reserved identity may still be preserved because the subject is the same; only the known semantic surface is richer.

### Transactional Support Bot

No repository successor has been found. That does **not** erase the historical system described by the frozen case study.

The legacy source gives a bounded implemented-system account with persistent sessions, identity binding, idempotent confirmation, provider abstraction, secure handoff and operational traceability.

Therefore it remains a valid **historical sanitized System subject** whose source/evidence may stay private or unavailable. `Repository != System` applies in both directions: absence of a dedicated repository does not make a demonstrated professional system nonexistent.

### Agentic Systems & Foundry

This is the problematic reservation.

The frozen legacy card was intentionally broad:

```text
operational environments for agents, tools, memory, review and evidence
```

The current corpus reveals concrete durable systems behind that territory:

```text
Foundry
Factory
AgentHub
```

The old card is therefore better understood as a **historical representation/category of work**, not enough evidence for another independent System identity.

R1-PRE disposition:

```text
R0.8 reserved Agentic Systems RecordId
  -> DO NOT BIRTH
  -> DO NOT reuse for Foundry, Factory or AgentHub
  -> preserve as abandoned pre-Birth reservation

/work/agentic-systems
  -> compatibility treatment requires explicit R0 amendment before R1 enactment
```

The old locator must not disappear, but its frozen planned target cannot be enacted as though a canonical System had been discovered.

## 9. Canonical subject inventory — admission classes

R1-PRE distinguishes three positive subject classes.

### A. Frontier / current high-value System subjects

```text
Genesis
BrineOS
WER-ESK
Lisa
Factory
Foundry
AgentHub
Foundry Pay
Foundry Channels
Solana-Agent
SNE-FDE
GitHub Flow
SNE-OS
SNE Radar
SNE Trading
```

This class means only that repository evidence supports a distinct durable current/recent System subject. It does not imply public source, production maturity or established claims.

### B. Historical / experimental System subjects

```text
Brine
Personal Identity Runtime
VIRA
XS Wallet / Domini
ORDM
SNE Vault
SNE Scroll Pass
SNE Observatório
ViewCounter
Edital Sales
EstampAI
VLBet
Transactional Support Bot
```

These remain first-class technical history. Historical does not mean irrelevant; it means the editorial system should not present them as the current frontier merely because they exist.

### C. Non-System or separately treated corpus

```text
Genesis Research & Contributor Program
  program/research surface, not forced into knowledge.system

Agentic Engineering
  proposed/unbuilt grant artifact

AgentHub blueprint repositories
  candidate/artifact/validation-policy corpus

Renan GitHub profile repository
  profile/index surface

Solana learning + counter demo repositories
  learning/generated experiment artifacts

Hive
  third-party upstream reference source

FoundryLandingPage
  Foundry presentation realization

SNE-Radar-Standalone
  Radar distribution realization

ADMIN-API
  Radar historical snapshot/parallel realization

empty placeholders
  no durable subject authority
```

## 10. Private workspaces are deliberately outside positive public admission

`AMBIENTE-ALFRED` and `AMBIENTE-DOMINI` contain substantial technical material but also represent private multi-repository workspaces whose public ownership/disclosure boundary has not been established by the repository evidence itself.

They remain:

```text
DEFER_PRIVATE_DISCLOSURE
```

R1-PRE may use them to understand technical history internally but MUST NOT turn the underlying external product identities into public Systems by default.

## 11. The public journal should not be a repository catalog

The canonical graph is now closer to:

```text
54 repositories
      ↓ grounding
~28 durable System subjects
      ↓ admission / historical classification
15 frontier subjects
13 historical/experimental subjects
+ representations / artifacts / programs / private-deferred corpus
```

The exact count is less important than the identity rule: one subject can have many repositories, and one repository can contain many epistemic Records.

For BrineOS in particular:

```text
1 System
  -> many Questions
  -> many Investigations
  -> many Experiments
  -> many Claims
  -> many Evidence artifacts
```

R1 must not flatten that graph back into a card named after a repository.

## 12. Remaining admission blockers

The remaining blockers are narrower than before:

```text
XS-NAME-01
  XS Wallet vs Domini canonical public title

PRIVATE-WORK-01
  Alfred/Dominipay disclosure/ownership boundary

LEGACY-AGENTIC-AMENDMENT
  explicit amendment required before old /work/agentic-systems compatibility is enacted

PUBLICATION-SELECTION-01
  which historical Systems should receive public routes at R1 Birth versus remain archive-only/private

RESEARCH-EXTRACTION-01
  BrineOS/Genesis/WER/FoundryPay etc. need internal Question/Experiment/Claim/Evidence extraction after System Birth
```

None of these requires merging unrelated Systems.

## 13. Birth remains closed

R1-PRE.2 is an admission plan, not admission authority.

```text
Record Birth count        0
RevisionId minted         0
R1 runtime started        false
R0 contracts modified     false
```

Before R1.0, R1-PRE must freeze a final machine-readable admission inventory and record the required explicit R0 amendment for the legacy agentic compatibility mapping.