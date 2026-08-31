export interface CurrentSurfaceSelection {
  systems: string[];
  research: string[];
  archive: string[];
  essays: string[];
  notes: string[];
  home: {
    systems: string[];
    research: string[];
    archive: string[];
    essays: string[];
    notes: string[];
  };
}

export const CURRENT_SURFACE_SELECTION: CurrentSurfaceSelection = {
  systems: [
    'genesis',
    'brineos',
    'wer-esk',
    'brine',
    'lisa',
    'factory',
    'foundry',
    'sne-fde',
    'agenthub',
    'github-flow',
    'personal-identity-runtime',
    'foundry-pay',
    'foundry-channels',
    'solana-agent',
    'sne-os',
    'sne-trading',
    'sne-radar',
    'vira',
    'xs-wallet',
    'ordm',
    'sne-observatorio',
    'sne-vault',
    'sne-scroll-pass',
    'viewcounter',
    'edital-sales',
    'estampai',
    'vlbet',
  ],
  research: [
    'brineos',
    'wer-esk',
    'sne-trading',
    'ordm',
    'sne-observatorio',
  ],
  archive: [],
  essays: [],
  notes: [],
  home: {
    systems: [
      'genesis',
      'brine',
      'lisa',
      'factory',
      'foundry',
      'sne-fde',
      'agenthub',
    ],
    research: [
      'brineos',
      'wer-esk',
      'sne-trading',
      'ordm',
      'sne-observatorio',
    ],
    archive: [],
    essays: [],
    notes: [],
  },
};

export const CURRENT_SURFACE_SELECTION_RATIONALE = {
  systems: 'All 27 current public System successors belong to the canonical Systems surface; order is explicitly authored here and is not inferred from repository order, maturity, recency or runtime state.',
  research: 'Research membership is an explicit editorial decision. It may agree with admitted maturity evidence but is not derived from maturity and intentionally includes WER-ESK despite its current maturity remaining unclassified.',
  archive: 'A2.7 does not rewrite lifecycle. No current successor has an admitted archived lifecycle, so the current Archive surface remains empty instead of inferring historical status from names, repository age or prose.',
  essays: 'No current representation.publication essay Record is admitted by R1-A2, so A2.7 does not fabricate essays from System prose.',
  notes: 'No current representation.publication system-note Record is admitted by R1-A2, so A2.7 does not fabricate notes from System prose.',
  home: 'Home is a bounded explicit selection over already-public current documents. Home membership does not change disclosure, route identity, lifecycle or maturity.',
} as const;
