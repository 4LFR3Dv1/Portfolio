import React, { useState } from 'react';
import { Button } from './button';
import { Badge } from './badge';
import { CodeVault } from './code-vault';
import { PDFViewer } from './pdf-viewer';

interface EvidenceItem {
  id: string;
  title: string;
  description: string;
  type: 'pdf' | 'diagram' | 'spec' | 'screenshot' | 'release' | 'code';
  url?: string;
  codeSnippet?: string;
  language?: string;
}

export function EvidenceRoom() {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [selectedCode, setSelectedCode] = useState<EvidenceItem | null>(null);
  const [selectedPDF, setSelectedPDF] = useState<EvidenceItem | null>(null);

  const evidenceItems: EvidenceItem[] = [
    {
      id: 'sne-smart-contract',
      title: 'Solidity // SCROLL L2 LICENSE REGISTRY',
      description: 'Fonte da verdade para entitlements on-chain.',
      type: 'code',
      language: 'solidity',
      codeSnippet: `// contracts/SNELicenseRegistry.sol
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
}`
    },
    {
      id: 'python-trading-motor',
      title: 'Python // SNE RADAR MOTOR (CYTHONIZED)',
      description: 'Lógica de execução de alta frequência (Excertos).',
      type: 'code',
      language: 'python',
      codeSnippet: `class MarketMonitorPro:
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
            
        if self.detect_accumulation(volume_profile):
            return "ACCUMULATION_ZONE"
            
        return "NEUTRAL"
        
    def execute_order(self, signal):
        if not self.session_valid:
            raise SecurityException("Invalid Session Token")
            
        # Direct socket execution
        self.socket_manager.emit('order_create', {
            'symbol': signal.pair,
            'side': signal.side,
            'size': self.risk_manager.calculate_size()
        })`
    },
    {
      id: 'cv-renan-melo',
      title: 'RENAN MELO // CV 2026 (PDF)',
      description: 'Resumo profissional, stack técnico e projetos.',
      type: 'pdf',
      url: '/docs/RENAN_MELO_2026_EN.pdf'
    },
    {
      id: 'vault-hardened-spec',
      title: 'SNE Vault Protocol // Hardened Specification (PDF)',
      description: 'Especificação técnica completa com modelo de ameaças e garantias de segurança.',
      type: 'pdf',
      url: '/docs/SNE Vault Protocol - Sovereign Physical Infrastructure (Hardened Specification).pdf'
    },
    {
      id: 'vault-dev-plan',
      title: 'SNE Vault Protocol // Development Plan (PDF)',
      description: 'Roadmap técnico incremental e arquitetura de implementação.',
      type: 'pdf',
      url: '/docs/SNE Vault Protocol - Development Plan.pdf'
    },
    {
      id: 'vault-dev-plan-list',
      title: 'SNE Vault Protocol // Development Plan List (PDF)',
      description: 'Checklist detalhado de tarefas e milestones do projeto.',
      type: 'pdf',
      url: '/docs/SNE Vault Protocol - Development Plan List.pdf'
    },
    {
      id: 'vault-overview',
      title: 'SNE Labs // SNE Vault Protocol Overview (PDF)',
      description: 'Visão geral do protocolo e casos de uso.',
      type: 'pdf',
      url: '/docs/SNE Labs - SNE Vault Protocol.pdf'
    },
    {
      id: 'vault-infrastructure',
      title: 'SNE Vault Protocol // Sovereign Infrastructure (PDF)',
      description: 'Arquitetura de infraestrutura física soberana.',
      type: 'pdf',
      url: '/docs/SNE Vault Protocol - Sovereign Physical Infrastructure.pdf'
    }
  ];

  const filters = [
    { id: 'all', label: 'ALL' },
    { id: 'code', label: 'CODE' },
    { id: 'pdf', label: 'PDFs' },
    { id: 'diagram', label: 'DIAGRAMS' },
    { id: 'screenshot', label: 'SCREENSHOTS' }
  ];

  const filteredItems = activeFilter === 'all'
    ? evidenceItems
    : evidenceItems.filter(item => item.type === activeFilter);

  return (
    <section className="max-w-[1600px] mx-auto px-6 py-16 lg:py-24 border-t border-[var(--border-subtle)]" id="evidence">
      {/* Header */}
      <div className="mb-12">
        <h2 className="font-mono font-bold mb-4" style={{ color: 'var(--electric-blue)' }}>
          EVIDENCE ROOM
        </h2>
        <p className="text-base" style={{ color: 'var(--terminal-muted)' }}>
          Code artifacts, smart contracts e documentação técnica. Proof of Work.
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
            {filter.label}
          </button>
        ))}
      </div>

      {/* Evidence Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="border border-[var(--border-default)] bg-[var(--surface-1)] hover:border-[var(--electric-blue)] transition-all group flex flex-col h-full"
          >
            {/* Header */}
            <div className="border-b border-[var(--border-default)] px-4 py-3 bg-[var(--surface-2)] flex items-center justify-between">
              <Badge variant="default">{item.type.toUpperCase()}</Badge>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4 flex-1 flex flex-col">
              <h4 className="font-mono text-sm font-semibold leading-tight flex-1" style={{ color: 'var(--electric-blue)' }}>
                {item.title}
              </h4>
              <p className="text-sm" style={{ color: 'var(--terminal-muted)' }}>
                {item.description}
              </p>

              {item.type === 'code' ? (
                <Button
                  variant="secondary"
                  className="w-full mt-auto"
                  onClick={() => setSelectedCode(item)}
                >
                  VIEW SOURCE
                </Button>
              ) : item.type === 'pdf' ? (
                <Button
                  variant="primary"
                  className="w-full mt-auto"
                  onClick={() => setSelectedPDF(item)}
                >
                  OPEN PDF
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  className="w-full mt-auto"
                  onClick={() => console.log(`Opening ${item.title}`)}
                >
                  VIEW
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <p className="font-mono text-sm" style={{ color: 'var(--terminal-muted)' }}>
            No items found in this section.
          </p>
        </div>
      )}

      {/* Code Vault Modal */}
      {selectedCode && (
        <CodeVault
          title={selectedCode.title}
          language={selectedCode.language || 'text'}
          code={selectedCode.codeSnippet || ''}
          onClose={() => setSelectedCode(null)}
        />
      )}

      {/* PDF Viewer Modal */}
      {selectedPDF && selectedPDF.url && (
        <PDFViewer
          title={selectedPDF.title}
          pdfUrl={selectedPDF.url}
          onClose={() => setSelectedPDF(null)}
        />
      )}
    </section>
  );
}
