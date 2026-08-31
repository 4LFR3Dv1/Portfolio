import type { DisclosureMode, RecordVisibility } from '../app/data/editorial-visibility-maturity-disclosure';

export interface CurrentDisclosureCandidate {
  subjectKey: string;
  governanceRecordId: `rec_${string}`;
  recordVisibility: RecordVisibility;
  disclosure: DisclosureMode;
  rationale: string;
}

function decision(
  subjectKey: string,
  governanceRecordId: `rec_${string}`,
  recordVisibility: RecordVisibility,
  disclosure: DisclosureMode,
  rationale: string,
): CurrentDisclosureCandidate {
  return { subjectKey, governanceRecordId, recordVisibility, disclosure, rationale };
}

/**
 * R1-A2.5 decisions are explicit publication policy over the bounded generation-1
 * System payloads. They do not expose repository contents, source locators, private
 * evidence or implementation details. Source/evidence availability is derived
 * separately by the runtime from the temporal corpus observation.
 */
export const CURRENT_DISCLOSURE_CANDIDATES: CurrentDisclosureCandidate[] = [
  decision('genesis', 'rec_cedf643f9f14871bc9cc8d418843fed8', 'public', 'full', 'Publish the bounded current Genesis Record payload as a public portfolio System while keeping its private repository and evidence unavailable as source material.'),
  decision('brineos', 'rec_7aa68966d4fc33d8fb6764357263ec63', 'public', 'full', 'Publish the bounded current BrineOS research identity and thesis without exposing private repository contents or experiment evidence by implication.'),
  decision('wer-esk', 'rec_d466388ccf8d2d7065f0373bb3a2d9e5', 'public', 'full', 'Publish the bounded current WER-ESK System payload while preserving the private implementation source boundary.'),
  decision('lisa', 'rec_80fa0090abe8574bd03651e8ba826f5f', 'public', 'full', 'Publish Lisa as a current System using only its bounded editorial payload; private application/runtime source remains private.'),
  decision('factory', 'rec_fdf92282d5eced211fc430d23ab33c18', 'public', 'full', 'Publish Factory as a current production-system subject without exposing private control-plane source, execution details or target authority.'),
  decision('foundry', 'rec_1c220eaf4c4fdce7265f3f2d90fe1bfb', 'public', 'full', 'Publish the bounded current Foundry System description while the private implementation repository remains non-public.'),
  decision('agenthub', 'rec_8da88d001a4f4f92ebd257bdad921273', 'public', 'full', 'Publish AgentHub as a current product System from its bounded editorial payload; private product source remains private.'),
  decision('foundry-pay', 'rec_31d32647a6fc43c1b1bc5257aefaf367', 'public', 'full', 'Advance the existing Foundry Pay disclosure lineage and publish the current bounded public-safe System payload; current public reference source may remain independently observable.'),
  decision('foundry-channels', 'rec_a89572bdbbcb9b891d5ae344daca3bc8', 'public', 'full', 'Publish the current Foundry Channels beta System payload while retaining its devnet and custody qualifications.'),
  decision('solana-agent', 'rec_62b517f51032ef370202d1214564312d', 'public', 'full', 'Publish the current Solana-Agent System payload while preserving its pre-alpha and non-mainnet qualifications.'),
  decision('sne-fde', 'rec_a990132075825e52f24348228e02715d', 'public', 'full', 'Publish the bounded SNE-FDE institutional System payload while preserving private source and the admitted E0 contradiction as separate evidence state.'),
  decision('github-flow', 'rec_51c148ec8fa1fe5f5ae9b3f6baf6aa90', 'public', 'full', 'Publish the current GitHub Flow System concept and boundary without exposing private workspace implementation.'),
  decision('sne-os', 'rec_2821df1a24244689ab76bb5fb697018b', 'public', 'full', 'Advance the existing SNE-OS disclosure lineage to the current generation-1 System payload while retaining its private source boundary.'),
  decision('sne-radar', 'rec_22b986562b18701bfbd50dfefa4c99e5', 'public', 'full', 'Publish the bounded current SNE Radar System payload while preserving mixed public/private realization availability and explicit mock/preview qualifications.'),
  decision('sne-trading', 'rec_9ce76cf754efb66a135dbd570b2b36a4', 'public', 'full', 'Publish the bounded current SNE Trading research System payload without exposing private source or implying live-capital authority.'),
  decision('brine', 'rec_79d014649d7cae0f55a399c535ef9793', 'public', 'full', 'Publish the bounded current Brine runtime identity and thesis while preserving private implementation and operational state.'),
  decision('personal-identity-runtime', 'rec_8fbb44e49f462243bab73691664d99a1', 'public', 'full', 'Publish only the bounded architectural identity of Personal Identity Runtime; private runtime source, local identity state and manifestations remain outside disclosure.'),
  decision('vira', 'rec_fe675b13970843099b802b2b6d03daf1', 'public', 'full', 'Advance the existing VIRA disclosure lineage to the current System revision and preserve its current bounded live-product description.'),
  decision('xs-wallet', 'rec_5bc3c1113cfe4c14b79aaa63f2515d79', 'public', 'full', 'Advance the existing XS Wallet disclosure lineage to the current pre-beta System revision without resolving the XS Wallet / Domini naming ambiguity by policy inference.'),
  decision('ordm', 'rec_0287fda93ec5a2c39de90f589de2240e', 'public', 'full', 'Publish the bounded current ORDM research lineage while preserving mixed source availability and the unresolved internal PoC/testnet continuity detail.'),
  decision('sne-vault', 'rec_77d90ef904843aea2d918f045a7dace2', 'public', 'full', 'Publish the bounded historical SNE Vault System Record while keeping its relationship to current SNE-OS explicitly unresolved.'),
  decision('sne-scroll-pass', 'rec_d94dd85bf5e58101e8ec334cc91f0136', 'public', 'full', 'Publish the current SNE Scroll Pass System payload with its testnet context preserved.'),
  decision('sne-observatorio', 'rec_92698bf94c30ad0c1b3596d7070db122', 'public', 'full', 'Publish the bounded SNE Observatório research System without collapsing it into SNE Radar.'),
  decision('viewcounter', 'rec_9767e0d5ddbc696ab0a7250dadd343cf', 'public', 'full', 'Publish the current ViewCounter System payload while retaining its public-deploy failure and production blocker as separate evidence state.'),
  decision('edital-sales', 'rec_129bd95a3b7b538ea1a84ae86d596bd9', 'public', 'full', 'Publish the current Edital Sales System payload from its public implementation evidence.'),
  decision('estampai', 'rec_b2d40ec5e28d94f50466b6b06b62d43b', 'public', 'full', 'Publish the current EstampAI experimental System payload without translating experimental status into maturity policy.'),
  decision('vlbet', 'rec_8d4358af46c17f0fa1b7ca24d334356f', 'public', 'full', 'Publish the bounded current vlbet System payload without implying production readiness from implementation topology.'),
];
