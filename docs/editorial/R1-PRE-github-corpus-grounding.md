# R1-PRE — GitHub Corpus Grounding

Status: **IN PROGRESS / PRE-BIRTH**

Portfolio baseline: `main@ed586439e7809f60c56d7ee057db9655f7404105`

Precondition: `R0_COMPLETE=true`.

R1-PRE exists because R0.8 proved that the **legacy Portfolio corpus** fits the R0 ontology, but the legacy Portfolio is not the complete body of work currently present in the connected GitHub corpus.

R1 MUST NOT perform generation-zero Record Birth from the R0.8 migration inventory alone.

The new boundary is:

```text
R0.8
  legacy Portfolio corpus reconciled
        ↓
R1-PRE
  complete connected GitHub corpus grounded
        ↓
  cross-repository canonicality reconstructed
        ↓
  candidate durable entities admitted for Birth
        ↓
R1
  generation-zero materialization
```

## 1. Grounding law

```text
Repository != System
Repository != Record
Repository != current authority merely because it exists
```

A repository may be:

- the primary realization of one System;
- one component of a System realized across several repositories;
- a predecessor or retired realization;
- a research corpus containing many Questions, Investigations, Experiments, Claims and Evidence;
- a publication or artifact surface;
- development or institutional infrastructure;
- a demo, tutorial, canary or benchmark;
- a public presentation surface for another durable identity;
- unresolved until deeper grounding establishes its role.

Repository names, size, visibility and recency are signals, not identity authority.

## 2. Connected corpus census

Observed connected GitHub corpus on 2026-08-30:

```text
54 repositories total
39 under 4LFR3Dv1
15 under SNE-Labs
```

The census is complete for the repositories returned by the connected GitHub installation at this cut. It is not a claim that no other repository exists outside that installation.

### 4LFR3Dv1 — 39 repositories

```text
4LFR3Dv1/ordm
4LFR3Dv1/ORDM-TESTNET-v.01
4LFR3Dv1/ordm-testnet
4LFR3Dv1/OBSERVATORIO-SNE
4LFR3Dv1/SNE-RADAR-v1.0
4LFR3Dv1/SNE-RADAR
4LFR3Dv1/estampai-chatbot
4LFR3Dv1/estampai
4LFR3Dv1/SNE-V1.0-CLOSED-BETA-
4LFR3Dv1/Portfolio
4LFR3Dv1/XSWallet
4LFR3Dv1/hive
4LFR3Dv1/ViewCounter
4LFR3Dv1/AMBIENTE-ALFRED
4LFR3Dv1/AMBIENTE-DOMINI
4LFR3Dv1/EditalSales
4LFR3Dv1/FoundryLandingPage
4LFR3Dv1/Web3Experts-Solana-Zero-to-Hero-2-Deploy-Your-First-Anchor-Program
4LFR3Dv1/vlbet
4LFR3Dv1/VIRA-
4LFR3Dv1/4LFR3Dv1
4LFR3Dv1/Solana-Agent
4LFR3Dv1/Agentic-Engineering
4LFR3Dv1/Foundry-Pay
4LFR3Dv1/counter-demo-5
4LFR3Dv1/counter-demo-6
4LFR3Dv1/BrineT
4LFR3Dv1/brine-factory
4LFR3Dv1/identity-runtime
4LFR3Dv1/lisa-web
4LFR3Dv1/lisa-runtime
4LFR3Dv1/lisa-app
4LFR3Dv1/SNE-Trading
4LFR3Dv1/factory-control
4LFR3Dv1/Foundry-Channels
4LFR3Dv1/BrineOS
4LFR3Dv1/Genesis
4LFR3Dv1/wer-esk
4LFR3Dv1/GitHub-Flow
```

### SNE-Labs — 15 repositories

```text
SNE-Labs/SNE-Scroll-Passport
SNE-Labs/SNE-Labs
SNE-Labs/SNE-Radar
SNE-Labs/SNE-OS
SNE-Labs/SNE-Radar-Standalone
SNE-Labs/ADMIN-API
SNE-Labs/Foundry
SNE-Labs/blueprint-professional-evidence-portfolio
SNE-Labs/agenthub-blueprint-validation-policy
SNE-Labs/AgentHub
SNE-Labs/blueprint-local-business
SNE-Labs/blueprint-offer-campaign
SNE-Labs/Public-Surface
SNE-Labs/SNE-FDE
SNE-Labs/Genesis-CP
```

## 3. First-wave canonicality findings

The following findings are strong enough to guide deeper grounding, but **R1-PRE does not yet mint RecordIds or Birth revisions**.

### Genesis

`4LFR3Dv1/Genesis` is a high-confidence independent System candidate.

Its current repository thesis defines Genesis as a sovereign agentic Web runtime with durable institutional semantics separated from replaceable Web substrates. The active corpus contains current V1/V2/V3 implementation and physical/runtime evidence. It must not inherit the old Portfolio's generic `Agentic Systems & Foundry` identity.

Disposition:

```text
candidate entity       Genesis
candidate kind         knowledge.system
repository role        primary realization / research corpus
Birth                   BLOCKED ON R1-PRE admission
```

### BrineOS

`4LFR3Dv1/BrineOS` is a high-confidence independent research System candidate.

The repository is already organized around narrow research questions, explicit experiment boundaries, physical or machine-verifiable witnesses, established claims, non-claims and unresolved observations. Its A-series, GVR0, Life, causal-work and Network Materialization work must later decompose into many R0.3/R0.4 Records rather than collapsing into one project card.

Disposition:

```text
candidate entity       BrineOS
candidate kind         knowledge.system
repository role        primary realization + research corpus
internal extraction    Question / Investigation / Experiment / Claim / Evidence
```

### WER-ESK

`4LFR3Dv1/wer-esk` is a high-confidence independent System candidate.

Its current thesis is a local Web cartography/exploration runtime with bounded acquisition, transport provenance, content-addressed storage and deterministic exploration. It is not merely a Genesis component by naming proximity.

### Lisa

The following repositories are high-confidence **realizations of one Lisa product/system identity**, not three independent Systems by default:

```text
4LFR3Dv1/lisa-web      public presentation/discovery surface
4LFR3Dv1/lisa-app      public conversation/application surface
4LFR3Dv1/lisa-runtime  durable operational runtime
```

Current repository contracts explicitly connect `lisa-web` to the canonical Lisa App and `lisa-app` to Lisa Runtime.

Provisional relation:

```text
Lisa
  ├── lisa-web
  ├── lisa-app
  └── lisa-runtime
```

The System Record should represent Lisa; repository identities remain provenance/realization locators.

### Personal Identity Runtime

`4LFR3Dv1/identity-runtime` is a high-confidence System candidate by its own architecture: a local-first Windows runtime for persistent digital identity with observation, reconstructible projections, episodic memory, bounded cognition and an independent Morphing Shell.

No current repository evidence inspected in this cut proves whether it is a predecessor of Lisa, a separate system, or a research lineage that Lisa later absorbed. **That relationship remains unresolved and MUST NOT be inferred from chronology or thematic similarity.**

### Factory

`4LFR3Dv1/brine-factory` is a high-confidence independent development-infrastructure System candidate.

Its own contract states that Factory is an external governed production system, multi-target, and not part of target product runtimes. It currently registers AgentHub, Genesis, Lisa Web, Lisa Runtime and Lisa App as distinct execution targets.

`4LFR3Dv1/BrineT` is explicitly retired as a production target by Factory and remains historical execution evidence/research provenance.

### Foundry

`SNE-Labs/Foundry` is a high-confidence independent System candidate: an operational cockpit for planning, agent execution, evidence, human review and Git-traceable governance.

It must not be conflated with `brine-factory`: Foundry is the cockpit/work system; Factory is the external governed production execution system.

### AgentHub

`SNE-Labs/AgentHub` is a high-confidence independent System/product candidate. Its own repository contract explicitly states that it is independent of Foundry and owns its product, deploy, data and operation.

### Foundry Pay / Foundry Channels / Solana-Agent

These three repositories define explicit responsibility boundaries and therefore remain separate candidate Systems:

```text
Foundry Pay
  economic intent / policy / authorization / reconciliation

Solana-Agent
  constrained Solana preparation / execution / recovery / evidence

Foundry Channels
  consumer product/runtime for persistent funded payment channels
```

`Foundry Channels` explicitly identifies `Foundry-Pay` as protocol/economic-authority infrastructure and `Solana-Agent` as network-specific execution infrastructure. Repository separation here corresponds to a real authority split, not merely code organization.

### SNE-FDE and Public-Surface

`SNE-Labs/SNE-FDE` is the current canonical institutional/executable field boundary candidate for the SNE Labs public/economic surface.

`SNE-Labs/Public-Surface` explicitly declares itself historical presentation research and says `SNE-Labs/SNE-FDE` is now the canonical institutional and executable surface.

Provisional lineage:

```text
Public-Surface
  historical presentation research
        ↓ superseded for operational authority
SNE-FDE
  current institutional/executable field boundary
```

The historical repository must remain provenance and must not compete with SNE-FDE as current authority.

### Genesis RCP

`SNE-Labs/Genesis-CP` is **not Genesis itself**. It is the Genesis Research & Contributor Program around Genesis, with its own contribution, research-track, intake, IP and security-disclosure contracts.

Its durable entity type is not yet admitted. It may become a System-like program entity, a set of Publications/Investigations, or another representation pattern. R1-PRE must not force it into `knowledge.system` merely because the ontology lacks a generic `program` kind.

### GitHub Flow

`4LFR3Dv1/GitHub-Flow` is a high-confidence operational System candidate whose thesis is a workspace over GitHub reality that reconstructs work, frontiers and tasks while GitHub remains source of truth/governance.

### SNE-OS

`SNE-Labs/SNE-OS` remains a strong System candidate. The current repository explicitly distinguishes active frontend/backend workspaces from archived legacy code.

Its relationship with the several Radar repositories requires deeper reconciliation before Birth.

### SNE Radar cluster

The corpus contains several Radar identities/realizations:

```text
4LFR3Dv1/SNE-RADAR-v1.0
4LFR3Dv1/SNE-RADAR
SNE-Labs/SNE-Radar
SNE-Labs/SNE-Radar-Standalone
Radar code also exists inside SNE-OS history/current workspace
```

`SNE-Radar-Standalone` describes itself as the distribution landing surface for SNE Radar. `SNE-Labs/SNE-Radar` has a stale root README and a large mixed historical corpus. This cluster therefore remains **CANONICALITY UNRESOLVED**.

R1-PRE must determine whether the durable identity is:

```text
one SNE Radar System with several realizations
OR
multiple historical generations / products
OR
one subsystem of SNE-OS plus independent distribution artifacts
```

No Birth until that is reconciled.

### VIRA

`4LFR3Dv1/VIRA-` is a high-confidence independent System/product candidate with a live consumer deployment, TxLINE authority boundary, deterministic replay/evidence model and distinct Solana responsibilities.

### XS Wallet

`4LFR3Dv1/XSWallet` is a high-confidence System candidate, but **its public product name is explicitly unresolved**: the repository/docs use XS Wallet while the current frontend uses Domini.

The future RecordId can remain stable and opaque, but the canonical title/route must not be frozen until the identity-name decision is reconciled.

### ORDM

`4LFR3Dv1/ordm-testnet` explicitly classifies itself as a legacy research build and learning artifact, not a current production system. ORDM may deserve a historical System/Research identity, but it must not be promoted into the current frontier merely because the repository is large or public.

## 4. Corpus classes for the remaining grounding

Every repository must ultimately receive one explicit corpus disposition before R1 Birth begins:

```text
PRIMARY_REALIZATION
  primary current repository for a durable entity

COMPONENT_REALIZATION
  one repository inside a multi-repository durable entity

INDEPENDENT_SYSTEM
  repository strongly corresponds to its own durable System

RESEARCH_CORPUS
  repository contains multiple scientific/epistemic Records

INSTITUTIONAL_INFRASTRUCTURE
  operating/institutional system distinct from product systems

PROGRAM_SURFACE
  research/contributor/program entity whose ontology treatment needs care

PRESENTATION_OR_DISTRIBUTION
  public/marketing/download surface for another entity

HISTORICAL_PREDECESSOR
  superseded implementation or prior generation preserved as provenance

ARTIFACT_OR_BLUEPRINT
  reusable artifact rather than a System

DEMO_OR_CANARY
  bounded demonstration, tutorial or execution canary

PROFILE_OR_PORTFOLIO
  presentation/indexing surface rather than subject identity

EMPTY_OR_PLACEHOLDER
  no material corpus to admit

UNRESOLVED
  insufficient evidence for canonicality
```

These are grounding dispositions, not new R0 `RecordKind`s.

## 5. Repositories still requiring deep grounding

The following have not yet received enough repository-level evidence in this first wave to admit a canonical entity relationship:

```text
4LFR3Dv1/ordm
4LFR3Dv1/ORDM-TESTNET-v.01
4LFR3Dv1/OBSERVATORIO-SNE
4LFR3Dv1/SNE-RADAR-v1.0
4LFR3Dv1/SNE-RADAR
4LFR3Dv1/estampai-chatbot
4LFR3Dv1/estampai
4LFR3Dv1/SNE-V1.0-CLOSED-BETA-
4LFR3Dv1/hive
4LFR3Dv1/ViewCounter
4LFR3Dv1/AMBIENTE-ALFRED
4LFR3Dv1/AMBIENTE-DOMINI
4LFR3Dv1/EditalSales
4LFR3Dv1/FoundryLandingPage
4LFR3Dv1/Web3Experts-Solana-Zero-to-Hero-2-Deploy-Your-First-Anchor-Program
4LFR3Dv1/vlbet
4LFR3Dv1/4LFR3Dv1
4LFR3Dv1/Agentic-Engineering
4LFR3Dv1/counter-demo-5
4LFR3Dv1/counter-demo-6
4LFR3Dv1/SNE-Trading
4LFR3Dv1/factory-control
SNE-Labs/SNE-Scroll-Passport
SNE-Labs/SNE-Labs
SNE-Labs/SNE-Radar
SNE-Labs/SNE-Radar-Standalone
SNE-Labs/ADMIN-API
SNE-Labs/blueprint-professional-evidence-portfolio
SNE-Labs/agenthub-blueprint-validation-policy
SNE-Labs/blueprint-local-business
SNE-Labs/blueprint-offer-campaign
```

Some of these already have strong hints from names or surrounding repositories. They remain unresolved deliberately because R1-PRE uses repository evidence, not naming inference.

## 6. Canonicality questions to resolve next

R1-PRE next wave must resolve at least:

```text
IDENTITY-RUNTIME-01
  Is Personal Identity Runtime independent, predecessor to Lisa, or absorbed lineage?

RADAR-01
  What is the canonical SNE Radar identity across five locations/generations?

SNE-VAULT-01
  Is SNE-Labs/SNE-Labs an active SNE Vault System, a historical public surface, or both through revisions?

SNE-OS-01
  Which Radar/Admin components belong to SNE-OS versus independent Systems?

FOUNDRY-01
  What is the exact lineage between FoundryLandingPage, Foundry and later Factory infrastructure?

ORDM-01
  What relation exists between ordm, ORDM-TESTNET-v.01 and ordm-testnet?

ESTAMPAI-01
  Is estampai-chatbot a component of estampai or an independent historical System?

AGENTIC-01
  What durable entity, if any, corresponds to Agentic-Engineering and the old Portfolio `Agentic Systems & Foundry` card?

BLUEPRINT-01
  Which blueprint repositories are Publications/Artifacts versus executable Systems?
```

## 7. Birth gate

No new System from this corpus may receive generation-zero Birth merely because it appears in this document.

The Birth gate is:

```text
repository evidence sufficient
AND
cross-repository identity reconciled
AND
current vs historical authority resolved
AND
private/public disclosure plan known
AND
durable entity candidate selected
AND
R0 RecordKind treatment known
        ↓
ADMISSION READY
        ↓
R1 generation-zero Birth
```

## 8. Current grounding outcome

```text
connected_repository_census             54 / 54
repository_equals_system                false
R0.8_legacy_inventory_is_full_corpus    false
first_wave_identity_clusters_grounded    true
cross_repo_canonicality_complete         false
new_Record_Birth_performed               false
R1_runtime_work_started                  false
```

R1-PRE continues before R1.0.