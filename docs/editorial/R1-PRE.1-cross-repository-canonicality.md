# R1-PRE.1 — Cross-Repository Canonicality

Status: **IN PROGRESS / SECOND WAVE**

Precondition: `R0_COMPLETE=true` and the connected 54-repository census exists.

This cut narrows repository relationships. It remains non-normative and performs no Record Birth.

## 1. First-wave correction: Factory and Brine are not one identity

The first grounding wave grouped `brine-factory` and `BrineT` too aggressively because Factory records BrineT as a retired production target.

Direct repository authority corrects that reading.

`brine-factory` says it is external development/production infrastructure. `BrineT` says Brine is a local-first agent runtime and explicitly says `brine-factory` is external development infrastructure, not part of Brine runtime, state, context or product identity.

Correct relation:

```text
Brine
  primary repository: 4LFR3Dv1/BrineT
  role: persistent local-first agent runtime

Factory
  primary repository: 4LFR3Dv1/brine-factory
  role: external governed production infrastructure

Factory --can build / historically target--> Brine
Factory != Brine
```

`BrineT` being retired as a Factory *production target* does not mean Brine itself is a retired System.

This is exactly why repository census must precede Record Birth.

## 2. Foundry has a separate presentation surface

`4LFR3Dv1/FoundryLandingPage` describes itself as the public product surface for Foundry.

Therefore:

```text
Foundry
  primary operational realization: SNE-Labs/Foundry
  presentation realization:        4LFR3Dv1/FoundryLandingPage
```

The landing repository does not mint another System.

Factory remains separate from Foundry. Foundry is an operational cockpit/work system; Factory is external governed production infrastructure.

## 3. Agentic Engineering is a proposal artifact, not an implemented System

`4LFR3Dv1/Agentic-Engineering` explicitly states:

```text
PROPOSED PROJECT — NOT YET BUILT
```

Its repository is an application/delivery package for a proposed Solana Transaction Guard grant project. The described implementation, tests, demo and release are future deliverables.

Therefore the repository MUST NOT become a current `knowledge.system` merely because an architecture and build plan exist.

Its eventual editorial treatment may be a proposal/publication/artifact relationship; that treatment is deferred.

## 4. EstampAI and the generic chatbot scaffold are not one proven identity

`4LFR3Dv1/estampai` describes an authored conversational interface for generating PNG patterns in-browser.

`4LFR3Dv1/estampai-chatbot` retains the generic upstream Chat SDK README and does not establish an EstampAI-specific identity relationship.

Therefore:

```text
EstampAI
  independent historical/experimental System candidate

estampai-chatbot
  third-party chatbot scaffold / possible implementation material
  relation to EstampAI unproven
```

The scaffold does not receive a System identity by repository name proximity.

## 5. SNE Radar repository lineage is now substantially reconstructed

The Radar corpus is not six independent Systems.

Evidence establishes these roles:

```text
4LFR3Dv1/SNE-RADAR-v1.0
  empty placeholder

4LFR3Dv1/SNE-RADAR
  explicit clean backup of SNE Radar

4LFR3Dv1/SNE-V1.0-CLOSED-BETA-
  explicit SNE Radar generation
  documentation points to SNE-Labs/SNE-Radar

SNE-Labs/SNE-Radar
  substantial implementation corpus
  active through Jan 2026
  current observed primary Radar repository

SNE-Labs/SNE-Radar-Standalone
  explicit landing/distribution surface for SNE Radar

SNE-Labs/ADMIN-API
  older snapshot/parallel copy of the same SNE web/Radar application lineage;
  shared documentation and nearly identical App structure precede later
  SNE-Labs/SNE-Radar desktop-auth work
```

The durable candidate is therefore **SNE Radar**, not one System per repository.

This does not collapse SNE Radar into SNE-OS. The current SNE-OS application composes Radar alongside Vault, Pass, Keys, Swaps and Secrets. `SNE-Trading` also names `SNE-OS / Radar` as the producer of market intelligence while retaining an independent audit/execution boundary.

## 6. SNE Observatório is related research, but exact Radar continuity remains unproven

`4LFR3Dv1/OBSERVATORIO-SNE` describes “SNE v2.0 — Observatório de Forças”, explicitly saying SNE evolved from a trading bot into a proprietary market-visualization language.

Its vocabulary strongly overlaps later Radar material, but no inspected repository contract establishes exact Record continuity.

Therefore:

```text
SNE Observatório
  historical SNE market-language research candidate
  probable Radar predecessor
  exact same-identity claim: UNRESOLVED
```

It remains separate from the mechanically stronger Radar repository lineage until explicit continuity evidence is found.

## 7. SNE Vault materially feeds SNE-OS, but identity continuity is not assumed

`SNE-Labs/SNE-Labs` identifies its subject as **SNE Vault / Sistema de Nós de Execução**, with Passport, Vault, Keys, Radar, Explore and documentation surfaces.

The SNE-OS history contains an explicit commit:

```text
Migrate advanced Docs page from SNE VAULT to SNE OS
```

and the current SNE-OS app exposes Radar, Swaps, Vault, Pass, Keys and Secrets.

This establishes material lineage:

```text
SNE Vault / earlier SNE web3 hub
        ↓ material migration
SNE-OS
```

It does **not** yet establish:

```text
same RecordId
```

A rename/evolution and a superseding System are both still possible interpretations. R1 Birth remains blocked on this identity decision.

## 8. SNE Trading is independent by design

`4LFR3Dv1/SNE-Trading` explicitly defines itself as the independent research, replay, risk and execution plane for SNE market intelligence.

Its authority law is:

```text
SNE-OS / Radar
  produces intelligence / signal candidates
        ↓
SNE Trading
  records / replays / evaluates / eventually executes authorized signals
```

The repository explicitly isolates the tribunal from the system being judged.

Therefore SNE Trading is a separate high-confidence System candidate and MUST NOT be treated as another Radar implementation repository.

## 9. SNE Scroll Pass is a separate product candidate

`SNE-Labs/SNE-Scroll-Passport` defines **SNE Scroll Pass**, a privacy-first Scroll interface with balance inspection, gas tracking, watchlists and wallet functionality.

Nothing inspected establishes that it is merely the same identity as the older SNE Pass concept embedded in SNE Vault/SNE-OS documentation.

Until continuity is explicit:

```text
SNE Scroll Pass
  independent product/System candidate
```

## 10. Blueprints are not Systems by default

The AgentHub blueprint repositories explicitly reject premature identity promotion:

```text
blueprint-professional-evidence-portfolio
  quarantined candidate; not catalog authority

blueprint-local-business
  source subject; repository identity intentionally pending

blueprint-offer-campaign
  source subject; repository identity intentionally pending

agenthub-blueprint-validation-policy
  independent trusted validation policy
  candidate repositories cannot mint authoritative promotion results
```

Therefore these repositories are a candidate/artifact corpus around AgentHub, not four new Systems.

## 11. Solana demo repositories are outputs, not generator identity

`counter-demo-5` and `counter-demo-6` both explicitly state they were generated by Solana Agent for the `create-counter` mission.

The Web3Experts Anchor repository is a bounded learning/deployment artifact for a simple devnet counter.

These repositories may later become Evidence or Experiment artifacts, but they do not mint separate durable product Systems and they do not become the Solana-Agent identity themselves.

## 12. Third-party Hive source is not user System identity

`4LFR3Dv1/hive` carries the Aden Hive upstream identity, documentation, company links and framework description.

The connected repository may be useful reference or experimentation material, but repository possession does not transform third-party source identity into a user-authored `knowledge.system`.

Disposition:

```text
THIRD_PARTY_SOURCE_REFERENCE
no System Birth
```

## 13. Private multi-repository workspaces remain admission-blocked

`AMBIENTE-ALFRED` explicitly describes one platform spread across multiple repositories with public frontend, admin, business API and transactional executor boundaries.

`AMBIENTE-DOMINI` contains a Dominipay workspace and GasFree Tron integration planning across admin, secure app and API components.

These repositories clearly contain substantive systems work, but R1-PRE has not established public ownership/disclosure rights for their underlying product identities.

Therefore:

```text
repository evidence preserved
technical contribution may later be represented in sanitized form
public System Birth from private product identity: BLOCKED
```

This prevents a private working copy from silently becoming a public subject.

## 14. Additional independent System candidates grounded in wave 2

Repository-level evidence is sufficient to recognize these as separate candidates, while still keeping Birth closed:

```text
ViewCounter
  experimental social-metrics aggregation system

Edital Sales
  edital ingestion / opportunities / artists / project workflow system

VLBet
  experimental multi-provider sports value engine

EstampAI
  conversational design-pattern generation system
```

Candidate recognition is not a claim of maturity, production readiness or evidential strength.

## 15. Legacy Portfolio identities need reconciliation against the real corpus

R0.8 reserved migration identity for:

```text
Agentic Systems & Foundry
```

The legacy source itself describes a broad private category: planning, execution, review, evidence and operator surfaces. The current GitHub corpus now has at least two concrete systems occupying that territory:

```text
Foundry
Factory
```

and additional related infrastructure such as AgentHub.

Therefore the reserved R0.8 identity MUST NOT automatically receive Birth as a new independent System. R1-PRE must decide whether the legacy card becomes:

```text
historical representation of Foundry/Factory work
OR
compatibility route to a Systems collection/publication
OR
another explicitly proven durable entity
```

The same caution applies to any R0.8 reservation whose real corpus later proves a different identity boundary. R0.8 reservation was migration planning, not Birth authority.

## 16. Remaining high-value canonicality questions

```text
IDENTITY-RUNTIME-01
  Personal Identity Runtime vs Lisa lineage

SNE-VAULT-01
  same durable identity as SNE-OS or superseded predecessor?

OBSERVATORIO-01
  exact relation between SNE Observatório and SNE Radar

ORDM-01
  exact continuity between L2 Offline Chain, empty testnet placeholder and ORDM legacy testnet

LEGACY-AGENTIC-01
  disposition of R0.8 Agentic Systems & Foundry reservation

LEGACY-SUPPORT-01
  whether Transactional Support Bot has any explicit repository successor or remains a standalone sanitized professional case study

PRIVATE-WORK-01
  which facts, if any, from Alfred/Dominipay workspaces may receive sanitized public Records

BRINE-LINEAGE-01
  intellectual/identity relation between Brine and BrineOS, if any; naming similarity alone is insufficient
```

## 17. Current gate

```text
connected repository census             COMPLETE (54/54)
repository-level grounding disposition  COMPLETE (54/54)
second-wave identity clusters           MATERIALIZED
known first-wave conflation corrected    Factory != Brine
SNE Radar repository lineage            SUBSTANTIALLY RESOLVED
cross-repository canonicality            INCOMPLETE
Record Birth                             0
R1 runtime                               NOT STARTED
```

R1-PRE continues.