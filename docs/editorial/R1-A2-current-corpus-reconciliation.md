# R1-A2 — Current Corpus Reconciliation

Status: **COMPLETE / CURRENT PUBLICATION ACCEPTED**

Baseline: `main@1ad9128328ed702d0c160be5acca5a4874674d25`

R1-A2 is a post-freeze amendment. It does not rewrite R1 Birth, R1 completion, R2 transport witnesses, or the historical R2.7 readiness result. It exists because direct inspection of the accepted R2.6 preview demonstrated that the publication remained structurally coherent while projecting stale R0.8-era public semantics.

## Discovery

The accepted preview displayed only SNE-OS, VIRA and XS Wallet / Domini with the generation-zero summary:

```text
Durable System subject admitted from the connected GitHub corpus grounding.
```

The repository already contains 28 born System Records. R1.3 routes only five R0.8 migration targets and R1.6 reuses the R0.8 disclosure plan, leaving 23 born Systems unrouted and only three full-disclosure Systems on semantic surfaces.

Therefore the amendment opened under:

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
10. **Governance identity is monotonic.** Existing logical governance Records advance by Revision rather than replacement Birth.
11. **Historical route identity is monotonic.** Existing public paths cannot be dropped, reassigned or have their admission basis silently rewritten.
12. **Current publication validity gates cutover.** A semantically valid current publication is necessary but not sufficient for physical cutover readiness.

## Program

| Cut | Purpose | Status |
| --- | --- | --- |
| R1-A2.0 | Reconciliation Constitution + Cutover Eligibility Revocation | **MATERIALIZED** |
| R1-A2.1 | Current GitHub Census + HEAD Observation | **COMPLETE** |
| R1-A2.2 | Existing Identity Reconciliation | **COMPLETE** |
| R1-A2.3 | Current Revision Materialization | **COMPLETE** |
| R1-A2.4 | Evidence + Maturity Reconciliation | **COMPLETE / CORRECTED** |
| R1-A2.5 | Public Disclosure Reauthorization | **COMPLETE** |
| R1-A2.6 | Current Route Admission | **COMPLETE** |
| R1-A2.7 | Current Editorial Surface Reconstruction | **COMPLETE** |
| R1-A2.8 | Current Publication Acceptance | **COMPLETE** |

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

Twenty-seven Systems have generation-1 current successors. Transactional Support Bot remains explicitly deferred at its historical Birth revision because no current repository successor or new semantic evidence was admitted. Every successor resolves its repository realization through the exact R1-A2.1 census.

```text
BORN_SYSTEM_RECORD_COUNT=28
CURRENT_SUCCESSOR_REVISION_COUNT=27
DEFERRED_CURRENT_REVISION_COUNT=1
RECORD_ID_CHANGE_COUNT=0
NEW_RECORD_BIRTH_COUNT=0
GENERIC_BIRTH_SUMMARY_SUCCESSOR_COUNT=0
```

## R1-A2.4 Evidence + Maturity reconciliation

A2.4 separates observation from governance instead of turning repository implementation into an editorial status shortcut. The accepted ledger contains 48 observations across all 27 current successors:

```text
supports       29
qualifies      16
contradicts     3
```

Contradictions remain explicit for SNE-FDE, SNE Radar and ViewCounter. Eight current heads receive an admitted R0.6 maturity classification:

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

Nineteen current successors remain explicitly `unclassified`. A2.4 also corrected governance lineage for XS Wallet: the existing R1.6 maturity governance Record advances to generation 1 instead of being replaced.

```text
CURRENT_EVIDENCE_OBSERVATION_COUNT=48
CURRENT_MATURITY_CLASSIFIED_COUNT=8
CURRENT_MATURITY_UNCLASSIFIED_COUNT=19
CURRENT_MATURITY_CONFLICT_COUNT=0
CURRENT_MATURITY_GOVERNANCE_BIRTH_COUNT=7
CURRENT_MATURITY_GOVERNANCE_SUCCESSOR_COUNT=1
MATURITY_IDENTITY_REPLACEMENT_COUNT=0
STALE_MATURITY_INHERITANCE_COUNT=0
```

## R1-A2.5 Public Disclosure reauthorization

A2.5 removes R0.8 as perpetual disclosure authority. Every one of the 27 current generation-1 System heads receives an explicit current disclosure decision against its exact revision.

The bounded current `knowledge.system` payload contains only `name`, `summary` and `thesis`; source locators, private repository bytes, raw evidence and implementation details are not part of that payload. All 27 current System payloads are admitted as public/full editorial Records while source and evidence availability remain independent.

```text
public Record payload != public source repository != public evidence
```

Accepted availability distribution:

```text
source public   12
source partial   2
source private  13

evidence public   13
evidence partial   1
evidence private  13
```

Four existing disclosure governance identities continue by successor Revision: Foundry Pay, SNE-OS, VIRA and XS Wallet. The other 23 current Systems receive new disclosure-governance Births. Transactional Support Bot remains historical only.

The A2.5 candidate `41eb785efbe4e274104c228d0efd813a2490d6c9` passed Verify #298, Editorial Shell Build #133 and Cutover Readiness #64. Its terminal monotonic state at `ea9ee21cddcb40898d6410e63b80e659efa5020f` passed Verify #306, Shell #141 and Cutover #72.

```text
CURRENT_DISCLOSURE_CLASSIFIED_COUNT=27
CURRENT_PUBLIC_RECORD_COUNT=27
CURRENT_DISCLOSURE_CONFLICT_COUNT=0
CURRENT_DISCLOSURE_UNCLASSIFIED_COUNT=0
CURRENT_DISCLOSURE_GOVERNANCE_BIRTH_COUNT=23
CURRENT_DISCLOSURE_GOVERNANCE_SUCCESSOR_COUNT=4
DISCLOSURE_IDENTITY_REPLACEMENT_COUNT=0
```

## R1-A2.6 Current Route Admission

A2.6 admits only routes that can resolve against an exact current language realization. It therefore materializes the current language layer together with route admission rather than creating deliberately `language-unavailable` public paths.

Every one of the 27 current System successors receives:

```text
1 exact-current canonical EN LanguageBinding
1 explicit PT-BR translation LanguageBinding
1 /en/systems/... canonical route
1 /pt-br/systems/... canonical route
```

The PT-BR realization is an explicit translation of the bounded current `knowledge.system` payload. It is not an inferred translation of repository source or private evidence and does not inherit any of the five generic R0.8 translations.

R1.3 historical route identity is preserved exactly. Its ten bindings remain in the route registry with the same path, target, language, role and `admittedAgainst` value. Eight of those paths belong to VIRA, XS Wallet, SNE-OS and Foundry Pay and now resolve against their current heads plus current language realizations. The two Transactional Support Bot paths remain present but return `head-unavailable` because no current successor is admitted.

The remaining 23 current Systems receive 46 new route bindings, one per language.

```text
CURRENT_ROUTED_SYSTEM_COUNT=27
CURRENT_UNROUTED_SYSTEM_COUNT=0
CURRENT_ROUTE_LANGUAGE_PAIR_COUNT=54
CURRENT_ENGLISH_ROUTE_COUNT=27
CURRENT_PORTUGUESE_ROUTE_COUNT=27
CURRENT_LANGUAGE_BINDING_COUNT=54
CURRENT_CANONICAL_ENGLISH_BINDING_COUNT=27
CURRENT_PORTUGUESE_TRANSLATION_BINDING_COUNT=27

PRESERVED_HISTORICAL_ROUTE_BINDING_COUNT=10
PRESERVED_HISTORICAL_ROUTE_FOR_CURRENT_SYSTEM_COUNT=8
DEFERRED_HISTORICAL_ROUTE_BINDING_COUNT=2
NEW_ROUTE_BINDING_COUNT=46
TOTAL_ROUTE_BINDING_COUNT=56

HISTORICAL_PATH_DROP_COUNT=0
HISTORICAL_PATH_REASSIGNMENT_COUNT=0
HISTORICAL_ADMISSION_BASIS_REWRITE_COUNT=0
STALE_TRANSLATION_INHERITANCE_COUNT=0
```

The A2.6 candidate at `d31f9797b69435806f0da82bb4f3ef896ca935b7` passed Verify #310, Editorial Shell Build #145 and Cutover Readiness #76. After the completion-test monotonicity corrections, the terminal A2.6 head `099fa7cd4a81020599dbbe5230e293359aa35403` passed Verify #320, Editorial Shell Build #155 and Cutover Readiness #86.

## R1-A2.7 Current Editorial Surface Reconstruction

A2.7 reconstructs the semantic publication surface from the current A2.3–A2.6 state instead of mutating the historical R1.6 surface runtime.

All 27 current Systems produce one EN and one PT-BR public projection and semantic EditorialDocument:

```text
CURRENT_PUBLIC_PROJECTION_COUNT=54
CURRENT_PROJECTION_OMISSION_COUNT=0
CURRENT_EDITORIAL_DOCUMENT_COUNT=54
CURRENT_SEMANTIC_DOCUMENT_COUNT=54
CURRENT_DOCUMENT_OMISSION_COUNT=0
GENERIC_BIRTH_SUMMARY_EMISSION_COUNT=0
```

The canonical `Systems` surface is the complete current System corpus and has 27 items per language. Its order is explicitly authored and is not repository order, maturity order, recency order or renderer output.

Home is a smaller explicit editorial selection. Its Systems section contains Genesis, Brine, Lisa, Factory, Foundry, SNE-FDE and AgentHub. Its Research section contains BrineOS, WER-ESK, SNE Trading, ORDM and SNE Observatório. The same Record identities appear in the same order in EN and PT-BR. Research membership is not derived from maturity: WER-ESK is intentionally admitted while its current maturity remains `unclassified`.

Archive remains empty because no current successor has an admitted `archived` lifecycle. Essays and Notes remain empty because this amendment has not admitted current `representation.publication` Records of those kinds.

```text
CURRENT_CORE_SURFACE_COUNT=12
CURRENT_SYSTEMS_PER_LANGUAGE=27
CURRENT_RESEARCH_PER_LANGUAGE=5
CURRENT_ARCHIVE_PER_LANGUAGE=0
CURRENT_HOME_SYSTEMS_PER_LANGUAGE=7
CURRENT_HOME_RESEARCH_PER_LANGUAGE=5
CURRENT_CROSS_LANGUAGE_SURFACE_DRIFT_COUNT=0
CURRENT_RANKING_INFERENCE_COUNT=0
```

Candidate `d764c401e2d624f67f3eb5ef955781c591670e2b` passed Verify #325, Editorial Shell Build #160 and Cutover Readiness #91. The sealed A2.7 state at `4d1553622ee4b88841e40b0ba0e9981e4f7791c9` then passed Verify #332, Editorial Shell Build #167 and Cutover Readiness #98.

## R1-A2.8 Current Publication Acceptance

A2.8 introduces no new editorial meaning. It reconstructs A2.1–A2.7 as one exact specimen and fails closed if any accepted count, identity, route, projection, document, surface or privacy boundary differs.

The acceptance snapshot proves:

```text
COMPLETION_SEAL_COUNT=7
BORN_SYSTEM_RECORD_COUNT=28
CURRENT_SUCCESSOR_SYSTEM_COUNT=27
DEFERRED_CURRENT_SYSTEM_COUNT=1
EVIDENCE_OBSERVATION_COUNT=48
MATURITY_CLASSIFIED_COUNT=8
MATURITY_UNCLASSIFIED_COUNT=19
DISCLOSURE_CLASSIFIED_COUNT=27
PUBLIC_FULL_DISCLOSURE_COUNT=27
CURRENT_ROUTE_LANGUAGE_PAIR_COUNT=54
CURRENT_LANGUAGE_BINDING_COUNT=54
TOTAL_ROUTE_BINDING_COUNT=56
PUBLIC_PROJECTION_COUNT=54
SEMANTIC_DOCUMENT_COUNT=54
CORE_SURFACE_COUNT=12
SYSTEMS_PER_LANGUAGE=27
RESEARCH_PER_LANGUAGE=5
HOME_SYSTEMS_PER_LANGUAGE=7
HOME_RESEARCH_PER_LANGUAGE=5
```

It also reconstructs every required zero:

```text
RECORD_IDENTITY_REPLACEMENT_COUNT=0
MATURITY_IDENTITY_REPLACEMENT_COUNT=0
DISCLOSURE_IDENTITY_REPLACEMENT_COUNT=0
HISTORICAL_PATH_DROP_COUNT=0
HISTORICAL_PATH_REASSIGNMENT_COUNT=0
HISTORICAL_ADMISSION_BASIS_REWRITE_COUNT=0
CURRENT_PROJECTION_OMISSION_COUNT=0
CURRENT_DOCUMENT_OMISSION_COUNT=0
GENERIC_BIRTH_SUMMARY_EMISSION_COUNT=0
CROSS_LANGUAGE_IDENTITY_DRIFT_COUNT=0
DEFERRED_CURRENT_SYSTEM_EXPOSURE_COUNT=0
PRIVATE_SOURCE_LOCATOR_LEAK_COUNT=0
PRIVATE_EVIDENCE_LOCATOR_LEAK_COUNT=0
RANKING_INFERENCE_COUNT=0
ARCHIVE_INFERENCE_COUNT=0
PRODUCTION_MUTATION_COUNT=0
```

The full semantic specimen is recursively canonicalized with sorted object keys and preserved array order, then hashed with SHA-256. Its accepted identity is:

```text
CURRENT_PUBLICATION_DIGEST=
sha256_f72c807283aa0f2da0a20b3ecaf1ec5f99227fedac47aa9fb988f5c924997d32
```

The A2.8 candidate `38267dea5d9b4bde33a787ef93dbc3ecdf9059df` passed:

```text
Verify #335                    SUCCESS
Editorial Shell Build #170     SUCCESS
Cutover Readiness #101         SUCCESS
64 test files / 424 tests      PASS
```

This acceptance restores current semantic publication validity. It does **not** inherit the historical R2.6 preview or R2.7 cutover-readiness witness onto the new digest. The physical publication pipeline must be re-emitted and revalidated against this exact accepted specimen before cutover readiness can be reconsidered.

## Terminal authority direction

```text
current connected GitHub installation
        ↓
A2.1 current repository observation
        ↓
A2.2 preserved System identity
        ↓
A2.3 current System Revision
        ↓
A2.4 current evidence + maturity governance
        ↓
A2.5 current disclosure governance
        ↓
A2.6 current bilingual language + route admission
        ↓
A2.7 current PublicProjections + EditorialDocuments + surfaces
        ↓
A2.8 accepted publication digest
        ↓
R2-A1 — Current Publication Re-emission & Physical Revalidation
```

## Terminal state

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

CURRENT_ROUTE_ADMISSION_COMPLETE=true
CURRENT_ROUTED_SYSTEM_COUNT=27
CURRENT_UNROUTED_SYSTEM_COUNT=0
CURRENT_ROUTE_LANGUAGE_PAIR_COUNT=54
CURRENT_LANGUAGE_BINDING_COUNT=54
PRESERVED_HISTORICAL_ROUTE_BINDING_COUNT=10
DEFERRED_HISTORICAL_ROUTE_BINDING_COUNT=2
NEW_ROUTE_BINDING_COUNT=46

CURRENT_EDITORIAL_SURFACE_RECONSTRUCTION_COMPLETE=true
CURRENT_PUBLIC_PROJECTION_COUNT=54
CURRENT_PROJECTION_OMISSION_COUNT=0
CURRENT_EDITORIAL_DOCUMENT_COUNT=54
CURRENT_SEMANTIC_DOCUMENT_COUNT=54
CURRENT_DOCUMENT_OMISSION_COUNT=0
CURRENT_CORE_SURFACE_COUNT=12
CURRENT_SYSTEMS_PER_LANGUAGE=27
CURRENT_RESEARCH_PER_LANGUAGE=5
CURRENT_ARCHIVE_PER_LANGUAGE=0
CURRENT_HOME_SYSTEMS_PER_LANGUAGE=7
CURRENT_HOME_RESEARCH_PER_LANGUAGE=5
CURRENT_GENERIC_BIRTH_SUMMARY_EMISSION_COUNT=0
CURRENT_CROSS_LANGUAGE_SURFACE_DRIFT_COUNT=0
CURRENT_RANKING_INFERENCE_COUNT=0

CURRENT_PUBLICATION_ACCEPTANCE_COMPLETE=true
CURRENT_PUBLICATION_SPECIMEN_DETERMINISTIC=true
CURRENT_PUBLICATION_VALID=true
CURRENT_PUBLICATION_DIGEST=sha256_f72c807283aa0f2da0a20b3ecaf1ec5f99227fedac47aa9fb988f5c924997d32

CUTOVER_READY=false
CUTOVER_AUTHORIZED=false
CUTOVER_ENACTED=false
PRODUCTION_MUTATION_COUNT=0

R1_A2_0_MATERIALIZED=true
R1_A2_1_COMPLETE=true
R1_A2_2_COMPLETE=true
R1_A2_3_COMPLETE=true
R1_A2_4_COMPLETE=true
R1_A2_5_COMPLETE=true
R1_A2_6_COMPLETE=true
R1_A2_7_COMPLETE=true
R1_A2_8_COMPLETE=true
R1_A2_COMPLETE=true
NEXT=R2-A1 — Current Publication Re-emission & Physical Revalidation
```
