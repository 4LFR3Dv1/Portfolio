# R1-A2 — Current Corpus Reconciliation

Status: **IN PROGRESS / CURRENT REVISIONS MATERIALIZED**

Baseline: `main@1ad9128328ed702d0c160be5acca5a4874674d25`

R1-A2 is a post-freeze amendment. It does not rewrite R1 Birth, R1 completion, R2 transport witnesses, or the historical R2.7 readiness result. It exists because direct inspection of the accepted R2.6 preview demonstrated that the publication remained structurally coherent while projecting stale R0.8-era public semantics.

## Discovery

The accepted preview displayed only SNE-OS, VIRA and XS Wallet / Domini with the generation-zero summary:

```text
Durable System subject admitted from the connected GitHub corpus grounding.
```

The repository already contains 28 born System Records, including current frontier subjects such as Genesis, BrineOS, WER-ESK, Lisa, Factory, Foundry, AgentHub, SNE-FDE and GitHub Flow. The loss occurs downstream: R1.3 routes only five R0.8 migration targets and R1.6 reuses the R0.8 disclosure plan, leaving 23 born Systems unrouted and only three full-disclosure Systems on semantic surfaces.

Therefore the following distinction is now normative:

```text
R2.7 historical infrastructure readiness = true
current publication validity            = false
current cutover readiness                = false
```

R2.7 remains historical evidence about the exact specimen it witnessed. It is not authority to publish that specimen after a later contradiction in publication validity has been admitted.

## Constitutional laws

1. **Identity continuity is monotonic.** An already-born Record MUST NOT be recreated merely because current repository evidence changed.
2. **Current change produces Revision, not replacement identity.** A new payload is admitted only against an existing Record unless evidence proves a genuinely new subject.
3. **Repository identity is not System identity.** New repository, rename, split or merge cannot mint a System automatically.
4. **Temporal basis is mandatory.** Every current corpus observation MUST bind repository, default branch, observed HEAD and observation time.
5. **Grounding is not disclosure.** Current evidence may update a Record without authorizing its public publication.
6. **Birth is not routing.** Born Records do not receive public routes by inference.
7. **Historical migration plans are not perpetual public truth.** R0.8 may remain evidence of historical intent but cannot be the sole authority for current disclosure, routes, summaries, maturity or surface membership.
8. **Generic Birth copy is not current editorial content.** Generation-zero placeholders may remain historical payload but MUST NOT be emitted as the current public summary after R1-A2 acceptance.
9. **Private evidence stays private by default.** Public representation may cite conclusions derived from admissible evidence without leaking private source content.
10. **Current publication validity gates cutover.** No R2.8 authorization is possible while `CURRENT_PUBLICATION_VALID=false`.

## Program

| Cut | Purpose | Status |
| --- | --- | --- |
| R1-A2.0 | Reconciliation Constitution + Cutover Eligibility Revocation | **MATERIALIZED** |
| R1-A2.1 | Current GitHub Census + HEAD Observation | **COMPLETE** |
| R1-A2.2 | Existing Identity Reconciliation | **COMPLETE** |
| R1-A2.3 | Current Revision Materialization | **COMPLETE** |
| R1-A2.4 | Evidence + Maturity Reconciliation | **NEXT** |
| R1-A2.5 | Public Disclosure Reauthorization | **NOT STARTED** |
| R1-A2.6 | Current Route Admission | **NOT STARTED** |
| R1-A2.7 | Current Editorial Surface Reconstruction | **NOT STARTED** |
| R1-A2.8 | Current Publication Acceptance | **NOT STARTED** |

## R1-A2.1 physical census

The connected GitHub installation was re-enumerated rather than inferred from the R1-PRE file. The inventory still contains 54 repositories: 39 under `4LFR3Dv1` and 15 under `SNE-Labs`. Every default branch ref was queried directly. Fifty-two repositories have a material HEAD; `4LFR3Dv1/SNE-RADAR-v1.0` and `4LFR3Dv1/factory-control` are explicitly empty. `4LFR3Dv1/ORDM-TESTNET-v.01` is material despite repository size metadata of zero because its exact default-branch ref resolves to `186b1b09f82e92fb13217b48edc956b9d9fa701f`; repository size is not HEAD authority.

The frozen observation is `docs/editorial/R1-A2.1-current-github-census.v0.json`. It records repository, visibility, default branch and exact observed HEAD. Inventory equality with R1-PRE is not treated as semantic equality.

## R1-A2.2 identity reconciliation

All 28 born System Records were reconciled against the current repository realization set. No RecordId changed and no repository observation automatically minted a new Record.

Key continuity findings include:

- Genesis remains the same substrate-independent institutional web runtime subject.
- BrineOS remains distinct from the host-level Brine runtime.
- Lisa remains one System across `lisa-web`, `lisa-app` and `lisa-runtime`.
- Factory remains external production infrastructure, distinct from Brine, Foundry and every target product.
- AgentHub remains an independent product rather than a Foundry runtime component.
- Foundry Channels explicitly remains distinct from Foundry Pay protocol authority and Solana-Agent execution infrastructure.
- SNE-FDE remains current field authority while Public-Surface remains a historical presentation predecessor.
- SNE Trading remains an independent tribunal/replay/risk/execution plane rather than a Radar component.
- XS Wallet / Domini remains one Record with its canonical public name still explicitly unresolved.
- SNE Vault and SNE Observatorio retain historical Record identities while their cross-system lineage questions remain explicit rather than being silently collapsed.
- Transactional Support Bot retains its historical Record even though no current repository successor is admitted.

The reconciliation is frozen in `docs/editorial/R1-A2.2-identity-reconciliation.v0.json` and sealed by `docs/editorial/R1-A2.2-completion.v0.json`.

```text
EXISTING_BIRTH_RECORD_COUNT=28
RECONCILED_RECORD_COUNT=28
PRESERVED_RECORD_ID_COUNT=28
RECORD_ID_CHANGE_COUNT=0
NEW_RECORD_BIRTH_COUNT=0
```

## R1-A2.3 current Revision materialization

R1-A2.3 preserves every R1 Birth revision and materializes current semantic payload only as a successor of that identity. The exact existing R1.1 digest and revision algorithms are reused; there is no amendment-specific identity scheme.

```text
Birth revision
  generation=0
        ↓
same RecordId + same RecordKind
        ↓
current knowledge.system payload
        ↓
payload digest
        ↓
generation=1
previousRevisionId=exact Birth RevisionId
        ↓
canonical RevisionId
        ↓
validateSuccessor()
```

Twenty-seven Systems now have generation-1 current successors. Transactional Support Bot remains explicitly deferred at its historical Birth revision because no current repository successor or new semantic evidence was admitted. This is not deletion and does not authorize a replacement Record.

Every successor also resolves its repository realization through the exact R1-A2.1 census, inheriting repository, visibility, default branch, observed HEAD and `observedAt`. Repository names therefore cannot act as free-floating evidence locators.

The candidate was witnessed by successful `Verify` run `33411967644` / run number `255` at branch head `a38d185184d437a71bd9de7f71b6f59267ebd5e1`. The accepted contract is `docs/editorial/R1-A2.3-current-system-revisions.v0.json`; the witness seal is `docs/editorial/R1-A2.3-completion.v0.json`.

```text
BORN_SYSTEM_RECORD_COUNT=28
CURRENT_SUCCESSOR_REVISION_COUNT=27
DEFERRED_CURRENT_REVISION_COUNT=1
PRESERVED_RECORD_ID_COUNT=28
RECORD_ID_CHANGE_COUNT=0
NEW_RECORD_BIRTH_COUNT=0
GENERIC_BIRTH_SUMMARY_SUCCESSOR_COUNT=0
```

A2.3 deliberately does **not** reauthorize disclosure, inherit maturity, admit routes or reconstruct public surfaces. Under R0.6, those policies are revision-bound. Advancing a System head therefore makes stale generation-zero maturity/disclosure insufficient for the new current head until a new policy decision is admitted.

## Direction of authority

```text
current connected GitHub installation
        ↓
repository + default branch + observed HEAD
        ↓
current evidence reconstruction
        ↓
compare against existing R1 Birth Record
        ↓
identity reconciliation
        ↓
new Revision when warranted
        ↓
current evidence + maturity
        ↓
explicit current disclosure decision
        ↓
explicit current route admission
        ↓
current editorial documents + surfaces
        ↓
new distribution digest
        ↓
R2-A1 re-emission / commissioning / preview / witness
```

## Immediate state

```text
R1_COMPLETE=true
R1_HISTORY_REWRITTEN=false
R2_6_HISTORICAL_COMPLETE=true
R2_7_HISTORICAL_COMPLETE=true

CURRENT_CORPUS_CENSUS_COMPLETE=true
CURRENT_REPOSITORY_COUNT=54
MATERIAL_HEAD_COUNT=52
EMPTY_REPOSITORY_COUNT=2
IDENTITY_RECONCILIATION_COMPLETE=true
RECONCILED_SYSTEM_RECORD_COUNT=28
RECORD_ID_CHANGE_COUNT=0
NEW_RECORD_BIRTH_COUNT=0

CURRENT_REVISION_MATERIALIZATION_COMPLETE=true
CURRENT_SUCCESSOR_REVISION_COUNT=27
DEFERRED_CURRENT_REVISION_COUNT=1
GENERIC_BIRTH_SUMMARY_SUCCESSOR_COUNT=0

EVIDENCE_MATURITY_RECONCILIATION_COMPLETE=false
CURRENT_PUBLICATION_VALID=false
CUTOVER_READY=false
CUTOVER_AUTHORIZED=false
CUTOVER_ENACTED=false

R1_A2_0_MATERIALIZED=true
R1_A2_1_COMPLETE=true
R1_A2_2_COMPLETE=true
R1_A2_3_COMPLETE=true
R1_A2_COMPLETE=false
NEXT=R1-A2.4 — Evidence + Maturity Reconciliation
```
