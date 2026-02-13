import React, { useState } from 'react';
import { Button } from './button';
import { Badge } from './badge';
import { CodeVault } from './code-vault';
import { useLanguage } from '../context/language-context';

interface EvidenceItem {
  id: string;
  titleKey: string;
  descKey: string;
  type: 'pdf' | 'diagram' | 'spec' | 'screenshot' | 'release' | 'code';
  url?: string;
  codeSnippet?: string;
  language?: string;
}

const SOLIDITY_CODE = `// contracts/SNELicenseRegistry.sol
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract SNELicenseRegistry is ERC721 {
    struct License {
        string tier;        // "free", "premium", "pro"
        uint256 expiresAt;
        bool active;
    }
    
    mapping(uint256 => License) public licenses;
    mapping(address => uint256) public addressToTokenId;
    
    function checkAccess(address user) public view returns (
        bool valid,
        string memory tier,
        uint256 expiresAt
    ) {
        uint256 tokenId = addressToTokenId[user];
        if (tokenId == 0) {
            return (false, "free", 0);
        }
        
        License memory license = licenses[tokenId];
        bool isValid = license.active && license.expiresAt > block.timestamp;
        
        return (isValid, license.tier, license.expiresAt);
    }
}`;

const PYTHON_CODE = `class MarketMonitorPro:
    def __init__(self, config):
        self.pairs = config.PAIRS
        self.depth_cache = {}
        self.session_valid = False

    async def analyze_regime(self, market_data):
        # Neural regime classification
        volatility = self.calculate_atr(market_data)
        volume_profile = self.get_vpvr(market_data)
        
        if volatility > self.THRESHOLD_HIGH:
            return "HIGH_VOLATILITY_BREAKOUT"
            
        depth_imbalance = self.analyze_order_flow()
        if abs(depth_imbalance) > 0.7:
            return "IMBALANCE_DETECTED"
            
        return "NORMAL_REGIME"`;

export function EvidenceRoom() {
  const { t } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [selectedCode, setSelectedCode] = useState<EvidenceItem | null>(null);

  const evidenceItems: EvidenceItem[] = [
    {
      id: 'verify-systems',
      titleKey: 'evidence.verify.title',
      descKey: 'evidence.verify.desc',
      type: 'pdf',
      url: '/docs/VERIFY_SYSTEMS.pdf'
    },
    {
      id: 'sne-smart-contract',
      titleKey: 'evidence.solidity.title',
      descKey: 'evidence.solidity.desc',
      type: 'code',
      language: 'solidity',
      codeSnippet: SOLIDITY_CODE
    },
    {
      id: 'python-trading-motor',
      titleKey: 'evidence.python.title',
      descKey: 'evidence.python.desc',
      type: 'code',
      language: 'python',
      codeSnippet: PYTHON_CODE
    },
    {
      id: 'cv-2026',
      titleKey: 'evidence.cv.title',
      descKey: 'evidence.cv.desc',
      type: 'pdf',
      url: '/docs/RENAN_MELO_2026_EN.pdf'
    },
    {
      id: 'vault-hardened',
      titleKey: 'evidence.vault.hardened.title',
      descKey: 'evidence.vault.hardened.desc',
      type: 'pdf',
      url: '/docs/SNE Vault Protocol - Sovereign Physical Infrastructure (Hardened Specification).pdf'
    },
    {
      id: 'vault-devplan',
      titleKey: 'evidence.vault.devplan.title',
      descKey: 'evidence.vault.devplan.desc',
      type: 'pdf',
      url: '/docs/SNE Vault Protocol - Development Plan.pdf'
    },
    {
      id: 'vault-devlist',
      titleKey: 'evidence.vault.devlist.title',
      descKey: 'evidence.vault.devlist.desc',
      type: 'pdf',
      url: '/docs/SNE Vault Protocol - Development Plan List.pdf'
    },
    {
      id: 'vault-overview',
      titleKey: 'evidence.vault.overview.title',
      descKey: 'evidence.vault.overview.desc',
      type: 'pdf',
      url: '/docs/SNE Labs - SNE Vault Protocol.pdf'
    },
    {
      id: 'vault-infra',
      titleKey: 'evidence.vault.infra.title',
      descKey: 'evidence.vault.infra.desc',
      type: 'pdf',
      url: '/docs/SNE Vault Protocol - Sovereign Physical Infrastructure.pdf'
    }
  ];

  const filters = [
    { id: 'all', labelKey: 'evidence.filter.all' },
    { id: 'code', labelKey: 'evidence.filter.code' },
    { id: 'pdf', labelKey: 'evidence.filter.pdf' }
  ];

  const filteredItems = activeFilter === 'all'
    ? evidenceItems
    : evidenceItems.filter(item => item.type === activeFilter);

  const handleOpenPDF = (url: string) => {
    // Open PDF in new tab - browser's native PDF viewer handles it
    window.open(url, '_blank');
  };

  return (
    <section className="max-w-[1600px] mx-auto px-6 py-16 lg:py-24 border-t border-[var(--border-subtle)]" id="evidence">
      {/* Header */}
      <div className="mb-12">
        <h2 className="font-mono font-bold mb-4" style={{ color: 'var(--electric-blue)' }}>
          {t('evidence.title')}
        </h2>
        <p className="text-base" style={{ color: 'var(--terminal-muted)' }}>
          {t('evidence.subtitle')}
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-8">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`px-4 py-2 font-mono text-xs uppercase tracking-wider border transition-all ${activeFilter === filter.id
              ? 'bg-[var(--electric-blue)] text-[#0a0a0f] border-[var(--electric-blue)]'
              : 'bg-transparent border-[var(--border-default)] text-[var(--terminal-muted)] hover:border-[var(--electric-blue)] hover:text-[var(--electric-blue)]'
              }`}
          >
            {t(filter.labelKey)}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="border border-[var(--border-default)] bg-[var(--surface-1)] hover:border-[var(--electric-blue)] transition-all group"
          >
            <div className="border-b border-[var(--border-default)] px-6 py-4 bg-[var(--surface-2)]">
              <div className="flex items-center justify-between">
                <h3 className="font-mono text-xs font-semibold" style={{ color: 'var(--electric-blue)' }}>
                  {t(item.titleKey)}
                </h3>
                <Badge variant="default">{item.type.toUpperCase()}</Badge>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm" style={{ color: 'var(--terminal-muted)' }}>
                {t(item.descKey)}
              </p>
              {item.type === 'code' && (
                <Button
                  variant="secondary"
                  onClick={() => setSelectedCode(item)}
                  className="w-full"
                >
                  {t('evidence.cta.viewsource')}
                </Button>
              )}
              {item.type === 'pdf' && item.url && (
                <Button
                  variant="secondary"
                  onClick={() => handleOpenPDF(item.url!)}
                  className="w-full"
                >
                  {t('evidence.cta.openpdf')}
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Code Vault Modal */}
      {selectedCode && selectedCode.codeSnippet && (
        <CodeVault
          code={selectedCode.codeSnippet}
          language={selectedCode.language || 'typescript'}
          title={t(selectedCode.titleKey)}
          onClose={() => setSelectedCode(null)}
        />
      )}
    </section>
  );
}
