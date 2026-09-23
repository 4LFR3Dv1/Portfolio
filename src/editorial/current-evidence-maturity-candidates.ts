import type { MaturityStage } from '../app/data/editorial-visibility-maturity-disclosure';

export type CurrentEvidenceObservationRelation = 'supports' | 'qualifies' | 'contradicts';
export type CurrentMaturityConfidence = 'high' | 'medium' | 'low';

export interface CurrentEvidenceObservation {
  relation: CurrentEvidenceObservationRelation;
  sourceRef: string;
  statement: string;
}

export interface CurrentMaturityDecision {
  stage: MaturityStage | null;
  governanceRecordId: `rec_${string}` | null;
  rationale: string;
  confidence: CurrentMaturityConfidence;
}

export interface CurrentEvidenceMaturityCandidate {
  subjectKey: string;
  observations: CurrentEvidenceObservation[];
  maturity: CurrentMaturityDecision;
}

function candidate(
  subjectKey: string,
  observations: CurrentEvidenceObservation[],
  stage: MaturityStage | null,
  governanceRecordId: `rec_${string}` | null,
  rationale: string,
  confidence: CurrentMaturityConfidence,
): CurrentEvidenceMaturityCandidate {
  return {
    subjectKey,
    observations,
    maturity: { stage, governanceRecordId, rationale, confidence },
  };
}

export const CURRENT_EVIDENCE_MATURITY_CANDIDATES: CurrentEvidenceMaturityCandidate[] = [
  candidate(
    'genesis',
    [
      { relation: 'supports', sourceRef: '4LFR3Dv1/Genesis:README.md', statement: 'Current source describes a sovereign agentic web runtime with an installed Rust Daily Driver, live browser/runtime boundaries and explicit current-versus-historical proof vocabulary.' },
      { relation: 'qualifies', sourceRef: '4LFR3Dv1/Genesis:README.md', statement: 'Governed action and security properties include historically accepted proofs that are not automatically current physical PASS for the installed specimen.' },
    ],
    null,
    null,
    'The current head demonstrates a substantial implemented runtime but does not admit one of the R0.6 maturity stage names as current publication authority.',
    'high',
  ),
  candidate(
    'brineos',
    [
      { relation: 'supports', sourceRef: '4LFR3Dv1/BrineOS:README.md', statement: 'The current source explicitly defines BrineOS as a bare-metal research project and preserves machine-verifiable and physical experiment witnesses.' },
      { relation: 'qualifies', sourceRef: '4LFR3Dv1/BrineOS:README.md', statement: 'Physical and emulated witnesses are bounded to their declared experiment scopes and do not imply a conventional production operating system.' },
    ],
    'research',
    'rec_8ca23ef00c79fd0856af30948ae55cbc',
    'Current source explicitly identifies BrineOS as research and its acceptance model is organized around bounded experiments and witnesses.',
    'high',
  ),
  candidate(
    'wer-esk',
    [
      { relation: 'supports', sourceRef: '4LFR3Dv1/wer-esk:README.md', statement: 'Current source describes a runnable local Web cartography and exploration kernel with resumable state and deterministic verification commands.' },
    ],
    null,
    null,
    'Implementation and verification are present, but the current source does not admit a canonical R0.6 maturity stage.',
    'high',
  ),
  candidate(
    'lisa',
    [
      { relation: 'supports', sourceRef: '4LFR3Dv1/lisa-runtime:lisa_architecture_v1.md', statement: 'The current architecture is frozen for a Launch Critical Path and defines conversations, knowledge retrieval, tools, jobs, approvals and operational continuity.' },
      { relation: 'qualifies', sourceRef: '4LFR3Dv1/lisa-runtime:lisa_architecture_v1.md', statement: 'A frozen launch architecture and active implementation do not by themselves state an R0.6 maturity stage.' },
    ],
    null,
    null,
    'Launch-critical architecture is current, but no exact allowed maturity label is admitted by the observed source.',
    'high',
  ),
  candidate(
    'factory',
    [
      { relation: 'supports', sourceRef: '4LFR3Dv1/brine-factory:README.md', statement: 'Current source explicitly defines Factory as an external governed production system and documents commissioned multi-target execution boundaries.' },
      { relation: 'qualifies', sourceRef: '4LFR3Dv1/brine-factory:README.md', statement: 'Production maturity does not grant target product, merge, release or deployment authority and does not prove current availability or SLA.' },
    ],
    'production',
    'rec_b2e3c72edd89eb2ef5f647cbb540db91',
    'The current source explicitly identifies Factory as a production system; this maturity classification is not an evidential claim about uptime, correctness or target-product readiness.',
    'high',
  ),
  candidate(
    'foundry',
    [
      { relation: 'supports', sourceRef: 'SNE-Labs/Foundry:README.md', statement: 'Current source describes a runnable local-priority cockpit with planning, execution, evidence, review, decision ledger and agent surfaces.' },
    ],
    null,
    null,
    'The system is materially implemented but the observed source does not explicitly resolve its current R0.6 maturity stage.',
    'high',
  ),
  candidate(
    'agenthub',
    [
      { relation: 'supports', sourceRef: 'SNE-Labs/AgentHub:README.md', statement: 'Current source describes an independent Next.js product with agent/job core, delivery flows, tests, CI and orchestration contracts.' },
      { relation: 'qualifies', sourceRef: 'SNE-Labs/AgentHub:README.md', statement: 'The repository self-describes its current state as an initial scaffold rather than using an R0.6 stage label.' },
    ],
    null,
    null,
    'Initial scaffold is meaningful current state but is not automatically translated into prototype or another governance stage.',
    'high',
  ),
  candidate(
    'foundry-pay',
    [
      { relation: 'supports', sourceRef: '4LFR3Dv1/Foundry-Pay:README.md', statement: 'Current source contains a public reference implementation and an implemented proof chain for governed payment execution and recovery.' },
      { relation: 'qualifies', sourceRef: '4LFR3Dv1/Foundry-Pay:README.md', statement: 'The project self-identifies as pre-alpha and explicitly disclaims production custody, managed service and mainnet readiness.' },
    ],
    null,
    null,
    'Pre-alpha is not an allowed R0.6 maturity stage and is not silently mapped to pre-beta or prototype.',
    'high',
  ),
  candidate(
    'foundry-channels',
    [
      { relation: 'supports', sourceRef: '4LFR3Dv1/Foundry-Channels:README.md', statement: 'Current source explicitly identifies the application as a public beta for persistent funded stablecoin payment channels.' },
      { relation: 'qualifies', sourceRef: '4LFR3Dv1/Foundry-Channels:README.md', statement: 'The beta is initially scoped to Solana devnet and does not claim mainnet, real-value production or custody readiness.' },
    ],
    'beta',
    'rec_465a90def7c3fdee38caa051b7af9e3b',
    'The current source explicitly uses the beta maturity label while separately bounding network and custody claims.',
    'high',
  ),
  candidate(
    'solana-agent',
    [
      { relation: 'supports', sourceRef: '4LFR3Dv1/Solana-Agent:README.md', statement: 'Current source documents governed Solana execution, recovery, evidence and demonstrated devnet mission/execution baselines.' },
      { relation: 'qualifies', sourceRef: '4LFR3Dv1/Solana-Agent:README.md', statement: 'The repository self-identifies as pre-alpha and explicitly rejects wallet, custody and autonomous mainnet-operator interpretations.' },
    ],
    null,
    null,
    'Pre-alpha is outside the R0.6 stage vocabulary and is preserved without lossy translation.',
    'high',
  ),
  candidate(
    'sne-fde',
    [
      { relation: 'supports', sourceRef: 'SNE-Labs/SNE-FDE:README.md', statement: 'Current source documents the institutional field boundary and a public E0 experiment with durable ProblemCandidate materialization.' },
      { relation: 'contradicts', sourceRef: 'SNE-Labs/SNE-FDE:README.md', statement: 'The current E0 witness explicitly records runtime-replacement durability FAIL and overall SNE-PUBLIC-E0 FAIL.' },
    ],
    null,
    null,
    'Current evidence is intentionally mixed and no canonical R0.6 maturity stage is admitted; the failure remains visible rather than being hidden by a maturity label.',
    'high',
  ),
  candidate(
    'github-flow',
    [
      { relation: 'supports', sourceRef: '4LFR3Dv1/GitHub-Flow:README.md', statement: 'Current source defines an operational workspace that reads GitHub reality and reconstructs repositories, frontiers and tasks without replacing GitHub authority.' },
    ],
    null,
    null,
    'Operational intent is clear, but the observed source does not admit an R0.6 maturity stage.',
    'high',
  ),
  candidate(
    'sne-os',
    [
      { relation: 'supports', sourceRef: 'SNE-Labs/SNE-OS:README.md', statement: 'Current source identifies an active frontend and backend workspace with operational documentation.' },
      { relation: 'supports', sourceRef: 'SNE-Labs/SNE-OS:src/app/navigation.ts', statement: 'Current code exposes Home, Radar, Intel, Passport, Vault, swaps, keys, secrets and documentation as the operational surface.' },
    ],
    null,
    null,
    'The current system surface is concrete, but implementation breadth is not converted into a maturity label without explicit governance basis.',
    'high',
  ),
  candidate(
    'sne-radar',
    [
      { relation: 'supports', sourceRef: 'SNE-Labs/SNE-Radar:backend-v2/services/sne-web/app/radar_api.py', statement: 'Current code exposes market summary, signals and authenticated analysis paths.' },
      { relation: 'contradicts', sourceRef: 'SNE-Labs/SNE-Radar:backend-v2/services/sne-web/app/radar_api.py', statement: 'Current signal and market preview paths include explicitly mocked or representative data.' },
    ],
    null,
    null,
    'The current realization contains implemented market surfaces and explicit mock/preview behavior; no maturity stage is inferred from that mixed state.',
    'high',
  ),
  candidate(
    'sne-trading',
    [
      { relation: 'supports', sourceRef: '4LFR3Dv1/SNE-Trading:README.md', statement: 'Current source explicitly defines an independent research, replay, risk and execution plane whose first responsibility is historical evaluation rather than trading.' },
      { relation: 'qualifies', sourceRef: '4LFR3Dv1/SNE-Trading:README.md', statement: 'Live capital is explicitly disabled until replay and shadow gates are satisfied.' },
    ],
    'research',
    'rec_b10ef035e70e0eae2c6c426684709aae',
    'The current source explicitly frames SNE Trading as research and keeps live execution behind future gates.',
    'high',
  ),
  candidate(
    'brine',
    [
      { relation: 'supports', sourceRef: '4LFR3Dv1/BrineT:README.md', statement: 'Current source describes a local-first persistent agent runtime with M0 and M1 complete and M2 durable SQLite work in progress.' },
      { relation: 'qualifies', sourceRef: '4LFR3Dv1/BrineT:README.md', statement: 'The modernization program remains in progress and the legacy CLI/store remains active until cutover.' },
    ],
    null,
    null,
    'The observed engineering milestones are current, but they do not resolve to one explicit R0.6 maturity stage.',
    'high',
  ),
  candidate(
    'personal-identity-runtime',
    [
      { relation: 'supports', sourceRef: '4LFR3Dv1/identity-runtime:README.md', statement: 'Current source describes a local-first Windows runtime with installed shell, observations, memory, bounded cognition and evidence-gated manifestations.' },
    ],
    null,
    null,
    'Implemented runtime capabilities are present, but no explicit R0.6 stage is admitted by the current source.',
    'high',
  ),
  candidate(
    'vira',
    [
      { relation: 'supports', sourceRef: '4LFR3Dv1/VIRA-:README.md', statement: 'Current source explicitly presents VIRA as a live consumer deployment with a live app, synchronized multiplayer runtime and verified TxLINE/Solana-devnet path.' },
      { relation: 'qualifies', sourceRef: '4LFR3Dv1/VIRA-:README.md', statement: 'Production maturity does not make guided fixtures equivalent to live delivery and does not establish uptime, security or mainnet claims.' },
    ],
    'production',
    'rec_62a539241777b41c607332d0eb7c99b7',
    'The current source explicitly identifies a live consumer deployment. Under R0.6 this is admitted as production maturity only, not as evidence of health, SLA, security or unrelated network properties.',
    'high',
  ),
  candidate(
    'xs-wallet',
    [
      { relation: 'supports', sourceRef: '4LFR3Dv1/XSWallet:README.md', statement: 'Current source explicitly identifies the repository as a pre-beta engineering build and documents implemented wallet/session/swap controls.' },
      { relation: 'qualifies', sourceRef: '4LFR3Dv1/XSWallet:README.md', statement: 'The source explicitly says it is not a public release and keeps the XS Wallet / Domini canonical product name unresolved.' },
    ],
    'pre-beta',
    'rec_3a926254f23e4a0c89102c3fbfe636d6',
    'The current source explicitly states pre-beta and separately disclaims public release status.',
    'high',
  ),
  candidate(
    'ordm',
    [
      { relation: 'supports', sourceRef: '4LFR3Dv1/ordm:README.md', statement: 'Current family evidence includes a proof-of-concept for offline block production and later network reconciliation.' },
      { relation: 'supports', sourceRef: '4LFR3Dv1/ordm-testnet:README.md', statement: 'The current public testnet source explicitly identifies itself as a legacy research build.' },
      { relation: 'qualifies', sourceRef: '4LFR3Dv1/ordm-testnet:README.md', statement: 'The testnet explicitly disclaims production readiness, external audit and current public endpoint verification.' },
    ],
    'research',
    'rec_59339992447f05be1b0186c547b7464d',
    'The current lineage is explicitly bounded as PoC / legacy research and rejects production interpretation.',
    'high',
  ),
  candidate(
    'sne-vault',
    [
      { relation: 'supports', sourceRef: 'SNE-Labs/SNE-Labs:README.md', statement: 'Current source preserves a historical SNE Vault surface and technical architecture claims around edge execution, encrypted storage and on-chain licensing.' },
      { relation: 'qualifies', sourceRef: 'SNE-Labs/SNE-Labs:README.md', statement: 'The relationship between this historical surface and current SNE-OS remains unresolved in A2.2.' },
    ],
    null,
    null,
    'Historical architecture material is current evidence of the preserved Record, but cross-system continuity and present maturity remain unresolved.',
    'medium',
  ),
  candidate(
    'sne-scroll-pass',
    [
      { relation: 'supports', sourceRef: 'SNE-Labs/SNE-Scroll-Passport:README.md', statement: 'Current source exposes a live demo and describes an active privacy-first Scroll interface.' },
      { relation: 'qualifies', sourceRef: 'SNE-Labs/SNE-Scroll-Passport:README.md', statement: 'The observed network is Scroll Sepolia and the source does not admit a canonical R0.6 maturity stage.' },
    ],
    null,
    null,
    'A live testnet demo does not automatically map to prototype, beta or production maturity.',
    'high',
  ),
  candidate(
    'sne-observatorio',
    [
      { relation: 'supports', sourceRef: '4LFR3Dv1/OBSERVATORIO-SNE:README_SNE_v2.md', statement: 'Current source preserves an exploratory market-analysis system centered on a proprietary visual language, temporal resonance and force-field metaphors.' },
      { relation: 'qualifies', sourceRef: '4LFR3Dv1/OBSERVATORIO-SNE:README_SNE_v2.md', statement: 'Its relationship to the later SNE Radar identity remains explicitly unresolved rather than silently collapsed.' },
    ],
    'research',
    'rec_8b792fb847b30ce3825c0a9689bd06a8',
    'The preserved System is an exploratory market-language investigation and is classified as research without asserting continuity into SNE Radar.',
    'medium',
  ),
  candidate(
    'viewcounter',
    [
      { relation: 'supports', sourceRef: '4LFR3Dv1/ViewCounter:README.md', statement: 'Current source explicitly identifies an experimental full-stack social-metrics dashboard with local build availability.' },
      { relation: 'contradicts', sourceRef: '4LFR3Dv1/ViewCounter:README.md', statement: 'The previous public deploy returns 404 and production redeploy is blocked until OAuth-token encryption exists.' },
    ],
    null,
    null,
    'Experimental implementation plus an explicit production blocker is preserved without translating experimental into a formal prototype stage.',
    'high',
  ),
  candidate(
    'edital-sales',
    [
      { relation: 'supports', sourceRef: '4LFR3Dv1/EditalSales:README.md', statement: 'Current source documents a React/Python application for public-notice discovery, opportunity CRM, artist/project records and ingestion.' },
    ],
    null,
    null,
    'The current implementation is observable but no exact R0.6 maturity stage is admitted.',
    'high',
  ),
  candidate(
    'estampai',
    [
      { relation: 'supports', sourceRef: '4LFR3Dv1/estampai:README.md', statement: 'Current source describes a conversational experimental system for generating and previewing print designs.' },
    ],
    null,
    null,
    'Experimental product behavior is preserved without automatically mapping the term experimental into prototype maturity.',
    'high',
  ),
  candidate(
    'vlbet',
    [
      { relation: 'supports', sourceRef: '4LFR3Dv1/vlbet:README.md', statement: 'Current source documents a multi-service sports value engine with odds ingestion, prediction, signal sizing, API and bot components.' },
    ],
    null,
    null,
    'Implementation topology is current evidence but does not itself authorize a maturity stage.',
    'high',
  ),
];
