# R1-A2 — Current Corpus Reconciliation

Status: **IN PROGRESS / A2.5 ACCEPTED**

Baseline: `main@1ad9128328ed702d0c160be5acca5a4874674d25`

R1-A2 is a post-freeze amendment. It does not rewrite R1 Birth, R1 completion, R2 transport witnesses, or the historical R2.7 readiness result. It exists because direct inspection of the accepted R2.6 preview demonstrated that the publication remained structurally coherent while projecting stale R0.8-era public semantics.

## Discovery

The accepted preview displayed only SNE-OS, VIRA and XS Wallet / Domini with the generation-zero summary:

```text
Durable System subject admitted from the connected GitHub corpus grounding.
```

The repository already contains 28 born System Records. R1.3 routes only five R0.8 migration targets and R1.6 reuses the R0.8 disclosure plan, leaving 23 born Systems unrouted and only three full-disclosure Systems on semantic surfaces.

Therefore:

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
10. **Governance identity is also monotonic.** If a logical governance Record already exists for a target, a changed basis or decision advances that governance lineage by Revision rather than minting a replacement governance identity.
11. **Current publication validity gates cutover.** No R2.8 authorization is possible while `CURRENT_PUBLICATION_VALID=false`.

## Program

| Cut | Purpose | Status |
| --- | --- | --- |
| R1-A2.0 | Reconciliation Constitution + Cutover Eligibility Revocation | **MATERIALIZED** |
| R1-A2.1 | Current GitHub Census + HEAD Observation | **COMPLETE** |
| R1-A2.2 | Existing Identity Reconciliation | **COMPLETE** |
| R1-A2.3 | Current Revision Materialization | **COMPLETE** |
| R1-A2.4 | Evidence + Maturity Reconciliation | **COMPLETE / CORRECTED** |
| R1-A2.5 | Public Disclosure Reauthorization | **COMPLETE** |
| R1-A2.6 | Current Route Admission | **NEXT** |
| R1-A2.7 | Current Editorial Surface Reconstruction | **NOT STARTED** |
| R1-A2.8 | Current Publication Acceptance | **NOT STARTED** |

## R1-A2.1 physical census

The connected GitHub installation was re-enumerated rather than inferred from the R1-PRE file. The inventory still contains 54 repositories: 39 under `4LFR3Dv1` and 15 under `SNE-Labs`. Every default branch ref was queried directly. Fifty-two repositories have a material HEAD; `4LFR3Dv1/SNE-RADAR-v1.0` and `4LFR3Dv1/factory-control` are explicitly empty.

`4LFR3Dv1/ORDM-TESTNET-v.01` is material despite repository size metadata of zero because its exact default-branch ref resolves to `186b1b09f82e92fb13217b48edc956b9d9fa701f`. Repository size is not HEAD authority.

The frozen observation is `docs/editorial/R1-A2.1-current-github-census.v0.json`.

## R1-A2.2 identity reconciliation

All 28 born System Records were reconciled against the current repository realization set. No RecordId changed and no repository observation automatically minted a new Record.

Explicit unresolved relations remain:

- XS Wallet / Domini canonical public name;
- ORDM internal PoC/testnet exact continuity;
- SNE Vault material migration relationship to SNE-OS;
- SNE Observatorio relationship to SNE Radar.

Transactional Support Bot retains its historical Record even though no current repository successor is admitted.

```text
EXISTING_BIRTH_RECORD_COUNT=28
RECONCILED_RECORD_COUNT=28
PRESERVED_RECORD_ID_COUNT=28
RECORD_ID_CHANGE_COUNT=0
NEW_RECORD_BIRTH_COUNT=0
```

## R1-A2.3 current Revision materialization

R1-A2.3 preserves every R1 Birth revision and materializes current semantic payload only as a successor of that identity. The exact existing R1.1 digest and revision algorithms are reused.

```text
Birth revision generation=0
        ↓
same RecordId + same RecordKind
        ↓
current knowledge.system payload
        ↓
generation=1
previousRevisionId=exact Birth RevisionId
        ↓
canonical RevisionId
        ↓
validateSuccessor()
```

Twenty-seven Systems have generation-1 current successors. Transactional Support Bot remains explicitly deferred at its historical Birth revision because no current repository successor or new semantic evidence was admitted.

Every successor resolves its repository realization through the exact R1-A2.1 census, inheriting repository, visibility, default branch, observed HEAD and `observedAt`.

The A2.3 candidate passed `Verify` run `33411967644` / #255 and the accepted terminal state later passed `Verify` run `33412743780` / #264.

```text
BORN_SYSTEM_RECORD_COUNT=28
CURRENT_SUCCESSOR_REVISION_COUNT=27
DEFERRED_CURRENT_REVISION_COUNT=1
RECORD_ID_CHANGE_COUNT=0
NEW_RECORD_BIRTH_COUNT=0
GENERIC_BIRTH_SUMMARY_SUCCESSOR_COUNT=0
```

## R1-A2.4 Evidence + Maturity reconciliation

A2.4 separates observation from governance instead of turning repository implementation into an editorial status shortcut.

The R0.4 `evidence.binding` contract targets `knowledge.claim` and `knowledge.experiment`; it does not authorize a direct formal EvidenceBinding against `knowledge.system`. A2.4 therefore does not mint artificial Claims or widen that contract. It freezes current-head observations as a temporal reconciliation ledger and uses them only as declared basis for separate `governance.maturity` decisions.

Every observation resolves through the temporal basis already attached to its generation-1 System successor.

The accepted ledger contains 48 observations across all 27 current successors:

```text
supports       29
qualifies      16
contradicts     3
```

Contradictions remain explicit for SNE-FDE, SNE Radar and ViewCounter.

Eight current heads receive an admitted R0.6 maturity classification:

```text
BrineOS            research
Factory            production
Foundry Channels   beta
SNE Trading        research
VIRA               production
XS Wallet / Domini pre-beta
ORDM               research
SNE Observatorio   research
```

Nineteen current successors remain explicitly `unclassified`. Terms such as `pre-alpha`, `experimental`, `scaffold`, launch-critical architecture, implemented code or testnet deployment are not automatically translated into `prototype`, `beta` or `production`.

`production` remains a maturity classification only. It does not prove uptime, runtime health, test success, security, custody safety, SLA or network readiness.

A2.4 also corrected governance lineage for XS Wallet: instead of minting a replacement maturity identity, the existing R1.6 `governance.maturity` Record `rec_3a926254f23e4a0c89102c3fbfe636d6` advances to generation 1 and binds the exact current XS Wallet System revision.

```text
CURRENT_EVIDENCE_OBSERVATION_COUNT=48
CURRENT_MATURITY_CLASSIFIED_COUNT=8
CURRENT_MATURITY_UNCLASSIFIED_COUNT=19
CURRENT_MATURITY_CONFLICT_COUNT=0
CURRENT_MATURITY_GOVERNANCE_BIRTH_COUNT=7
CURRENT_MATURITY_GOVERNANCE_SUCCESSOR_COUNT=1
MATURITY_IDENTITY_REPLACEMENT_COUNT=0
STALE_MATURITY_INHERITANCE_COUNT=0
FORMAL_EVIDENCE_RECORD_BIRTH_COUNT=0
FORMAL_EVIDENCE_BINDING_BIRTH_COUNT=0
```

## R1-A2.5 Public Disclosure reauthorization

A2.5 removes R0.8 as perpetual disclosure authority. Every one of the 27 current generation-1 System heads now receives an explicit current disclosure decision against its exact revision.

The bounded current `knowledge.system` payload contains only `name`, `summary` and `thesis`; source locators, private repository bytes, raw evidence and implementation details are not part of that payload. A2.5 therefore admits all 27 current System payloads as public/full editorial Records while independently preserving source and evidence availability.

This distinction is normative:

```text
public Record payload
        !=
public source repository
        !=
public evidence
```

For example:

```text
Genesis
record      public
mode        full
source      private
evidence    private
```

The runtime derives source availability from the R1-A2.1 temporal repository basis and evidence availability from the current A2.4 observations. Publication policy itself remains an explicit candidate decision and is not derived from those axes.

Accepted availability distribution:

```text
source public   12
source partial   2
source private  13

evidence public   13
evidence partial   1
evidence private  13
```

Four existing disclosure governance identities continue instead of being replaced:

```text
Foundry Pay  rec_31d32647a6fc43c1b1bc5257aefaf367
SNE-OS       rec_2821df1a24244689ab76bb5fb697018b
VIRA         rec_fe675b13970843099b802b2b6d03daf1
XS Wallet    rec_5bc3c1113cfe4c14b79aaa63f2515d79
```

Each becomes a generation-1 `governance.disclosure` successor bound to the exact current System revision. The other 23 current Systems receive new disclosure-governance Births. The historical Transactional Support Bot disclosure remains historical only because that System has no admitted current successor.

The A2.5 candidate at `41eb785efbe4e274104c228d0efd813a2490d6c9` passed:

```text
Verify #298                    SUCCESS
Editorial Shell Build #133     SUCCESS
Cutover Readiness #64          SUCCESS
```

```text
CURRENT_DISCLOSURE_CLASSIFIED_COUNT=27
CURRENT_PUBLIC_RECORD_COUNT=27
CURRENT_PRIVATE_RECORD_COUNT=0
CURRENT_FULL_DISCLOSURE_COUNT=27
CURRENT_DISCLOSURE_CONFLICT_COUNT=0
CURRENT_DISCLOSURE_UNCLASSIFIED_COUNT=0
CURRENT_DISCLOSURE_GOVERNANCE_BIRTH_COUNT=23
CURRENT_DISCLOSURE_GOVERNANCE_SUCCESSOR_COUNT=4
DISCLOSURE_IDENTITY_REPLACEMENT_COUNT=0
PRIVATE_SOURCE_PROMOTED_TO_PUBLIC_COUNT=0
```

A2.5 does not create routes, select homepage membership, mutate the existing R1.6 semantic surfaces or touch production.

## Direction of authority

```text
current connected GitHub installation
        ↓
repository + default branch + observed HEAD
        ↓
current evidence reconstruction
        ↓
existing System identity
        ↓
current System Revision
        ↓
current evidence + maturity governance lineage
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

EVIDENCE_MATURITY_RECONCILIATION_COMPLETE=true
CURRENT_EVIDENCE_OBSERVATION_COUNT=48
CURRENT_MATURITY_CLASSIFIED_COUNT=8
CURRENT_MATURITY_UNCLASSIFIED_COUNT=19
CURRENT_MATURITY_CONFLICT_COUNT=0
MATURITY_IDENTITY_REPLACEMENT_COUNT=0

CURRENT_DISCLOSURE_REAUTHORIZATION_COMPLETE=true
CURRENT_DISCLOSURE_CLASSIFIED_COUNT=27
CURRENT_PUBLIC_RECORD_COUNT=27
CURRENT_DISCLOSURE_CONFLICT_COUNT=0
CURRENT_DISCLOSURE_UNCLASSIFIED_COUNT=0
CURRENT_DISCLOSURE_GOVERNANCE_BIRTH_COUNT=23
CURRENT_DISCLOSURE_GOVERNANCE_SUCCESSOR_COUNT=4
DISCLOSURE_IDENTITY_REPLACEMENT_COUNT=0

CURRENT_PUBLICATION_VALID=false
CUTOVER_READY=false
CUTOVER_AUTHORIZED=false
CUTOVER_ENACTED=false

R1_A2_0_MATERIALIZED=true
R1_A2_1_COMPLETE=true
R1_A2_2_COMPLETE=true
R1_A2_3_COMPLETE=true
R1_A2_4_COMPLETE=true
R1_A2_5_COMPLETE=true
R1_A2_COMPLETE=false
NEXT=R1-A2.6 — Current Route Admission
```
