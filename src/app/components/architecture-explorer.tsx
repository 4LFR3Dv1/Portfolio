import React, { useState } from 'react';
import { Badge } from './badge';
import { Button } from './button';
import { CircuitDiagram } from './circuit-diagram';

interface NodeData {
  id: string;
  label: string;
  description: string;
  type: 'core' | 'service' | 'storage' | 'external';
  inputs: string[];
  outputs: string[];
  failures: string[];
  guarantees: string[];
  links?: {
    demo?: string;
    pdf?: string;
    diagram?: string;
    github?: string;
  };
  // Visualization coordinates
  x?: number;
  y?: number;
  connections?: string[];
}

const architectureNodes: NodeData[] = [
  {
    id: 'landing-onboarding',
    label: 'AUTH SERVICE (SIWE)',
    type: 'service',
    description: 'Web app React para aquisição, conversão e autenticação via WalletConnect + NIWE.',
    inputs: ['User signup', 'Wallet connection'],
    outputs: ['SIWE signature', 'Deep links', 'Auth Tokens'],
    failures: ['Wallet rejection', 'Network errors'],
    guarantees: ['ANTI-REPLAY', 'STATE VALIDATION'],
    links: { demo: 'https://snelabs.space' },
    x: 150, y: 150,
    connections: ['backend-api', 'onchain-licensing']
  },
  {
    id: 'backend-api',
    label: 'SNE CORE API',
    type: 'core',
    description: 'Flask Admin API para governança, entitlements e coordenação de sessões.',
    inputs: ['Auth requests', 'Device registration'],
    outputs: ['Access tokens', 'Session state', 'Pub/Sub Events'],
    failures: ['DB connection loss', 'Token expiry'],
    guarantees: ['SESSION CONTROL', 'DEVICE BINDING'],
    x: 400, y: 300,
    connections: ['desktop-runtime', 'alerts-ops']
  },
  {
    id: 'onchain-licensing',
    label: 'SNE PASSPORT (L2)',
    type: 'storage',
    description: 'Smart contracts na Scroll L2 e wallet como source of truth para entitlements.',
    inputs: ['Wallet address', 'License purchase'],
    outputs: ['Entitlement proofs', 'Tier status'],
    failures: ['insufficient gas', 'Network congestion'],
    guarantees: ['WALLET-NATIVE', 'VERIFIABLE', 'DECENTRALIZED'],
    x: 150, y: 450,
    connections: ['backend-api']
  },
  {
    id: 'desktop-runtime',
    label: 'SNE RADAR CLIENT',
    type: 'core',
    description: 'Runtime Electron + Python local (Motor Renan) para scanner de mercado.',
    inputs: ['User interactions', 'Local config'],
    outputs: ['Dashboard UI', 'Market Orders'],
    failures: ['Runtime crash', 'Memory overflow'],
    guarantees: ['OFFLINE GRACE', 'LOCAL PERSISTENCE'],
    links: { github: 'https://github.com/SNE-Labs' },
    x: 650, y: 300,
    connections: ['integrations']
  },
  {
    id: 'integrations',
    label: 'MARKET EXCHANGES',
    type: 'external',
    description: 'Conectores para APIs externas (Binance, Bybit) com resiliência.',
    inputs: ['API credentials', 'Market queries'],
    outputs: ['Market data', 'Order status'],
    failures: ['API downtime', 'Rate limiting'],
    guarantees: ['RETRY LOGIC', 'CACHE FALLBACK'],
    x: 900, y: 300,
    connections: []
  },
  {
    id: 'alerts-ops',
    label: 'TELEGRAM / OPS',
    type: 'service',
    description: 'Bot de notificações e sistema de diagnóstico remoto.',
    inputs: ['Runtime logs', 'Error events'],
    outputs: ['Alerts', 'Diagnostics'],
    failures: ['Log overflow'],
    guarantees: ['STRUCTURED LOGS', 'ACTIONABLE ALERTS'],
    x: 650, y: 500,
    connections: []
  }
];

interface ArchitectureExplorerProps {
  onBack?: () => void;
}

export function ArchitectureExplorer({ onBack }: ArchitectureExplorerProps) {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'circuit'>('circuit');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleNodeClick = (nodeId: string) => {
    setSelectedNode(nodeId);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  const selectedNodeData = architectureNodes.find(n => n.id === selectedNode);

  return (
    <section className="max-w-[1600px] mx-auto px-6 py-16">
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-mono font-bold" style={{ color: 'var(--electric-blue)' }}>
            ARCHITECTURE EXPLORER
          </h2>
          <div className="flex gap-4">
            <div className="flex bg-[var(--surface-1)] border border-[var(--border-default)] rounded-md p-1">
              <button
                onClick={() => setViewMode('circuit')}
                className={`px-3 py-1 text-xs font-mono transition-colors rounded ${viewMode === 'circuit' ? 'bg-[var(--electric-blue)] text-black' : 'text-[var(--terminal-muted)] hover:text-white'}`}
              >
                CIRCUIT
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1 text-xs font-mono transition-colors rounded ${viewMode === 'grid' ? 'bg-[var(--electric-blue)] text-black' : 'text-[var(--terminal-muted)] hover:text-white'}`}
              >
                GRID
              </button>
            </div>
            {onBack && (
              <button
                onClick={onBack}
                className="font-mono text-sm text-[var(--terminal-muted)] hover:text-[var(--electric-blue)] transition-colors"
              >
                ← BACK
              </button>
            )}
          </div>
        </div>
        <p className="text-base mb-2" style={{ color: 'var(--terminal-muted)' }}>
          Visualize o ecossistema SNE Labs: Identidade, Execução e Governança.
        </p>
      </div>

      {/* Content */}
      <div className="mb-8">
        {viewMode === 'circuit' ? (
          <div className="w-full overflow-hidden">
            <CircuitDiagram
              nodes={architectureNodes.filter(n => n.x !== undefined) as any[]}
              onNodeClick={handleNodeClick}
              selectedNodeId={selectedNode}
            />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {architectureNodes.map((node) => (
              <button
                key={node.id}
                onClick={() => handleNodeClick(node.id)}
                className="border border-[var(--border-default)] bg-[var(--surface-1)] p-6 text-left hover:border-[var(--electric-blue)] hover:bg-[var(--surface-2)] transition-all group"
              >
                <div className="font-mono text-sm font-semibold mb-2 group-hover:text-[var(--electric-blue)]" style={{ color: 'var(--terminal-text)' }}>
                  {node.label}
                </div>
                <div className="text-xs leading-relaxed" style={{ color: 'var(--terminal-muted)' }}>
                  {node.description}
                </div>
                <div className="mt-4 text-[10px] font-mono uppercase tracking-wider" style={{ color: 'var(--electric-blue)' }}>
                  CLICK TO EXPLORE →
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Drawer */}
      {isDrawerOpen && selectedNodeData && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
            onClick={handleCloseDrawer}
          ></div>

          {/* Drawer Panel */}
          <div className="fixed right-0 top-0 bottom-0 w-full md:w-[600px] bg-[var(--terminal-bg)] border-l border-[var(--border-default)] z-50 overflow-y-auto shadow-2xl">
            {/* Drawer Header */}
            <div className="sticky top-0 bg-[var(--surface-2)] border-b border-[var(--border-default)] px-6 py-4 flex items-center justify-between z-10">
              <div>
                <div className="font-mono text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--terminal-muted)' }}>
                  NODE DETAILS
                </div>
                <div className="font-mono text-lg font-semibold" style={{ color: 'var(--electric-blue)' }}>
                  {selectedNodeData.label}
                </div>
              </div>
              <button
                onClick={handleCloseDrawer}
                className="text-2xl text-[var(--terminal-muted)] hover:text-[var(--electric-blue)] transition-colors"
              >
                ×
              </button>
            </div>

            {/* Drawer Content */}
            <div className="p-6 space-y-8 bg-[var(--terminal-bg)]">
              {/* Overview */}
              <div>
                <div className="font-mono text-[10px] uppercase tracking-wider mb-3" style={{ color: 'var(--terminal-muted)' }}>
                  OVERVIEW
                </div>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--terminal-text)' }}>
                  {selectedNodeData.description}
                </p>
              </div>

              {/* Interfaces Table */}
              <div className="border border-[var(--border-default)] bg-[var(--surface-1)]">
                <div className="border-b border-[var(--border-default)] px-4 py-3 bg-[var(--surface-2)]">
                  <div className="font-mono text-[10px] uppercase tracking-wider" style={{ color: 'var(--terminal-muted)' }}>
                    INTERFACES
                  </div>
                </div>
                <div className="p-4 space-y-4">
                  <div>
                    <div className="font-mono text-xs mb-2" style={{ color: 'var(--electric-blue)' }}>INPUTS</div>
                    <ul className="space-y-1">
                      {selectedNodeData.inputs.map((input, idx) => (
                        <li key={idx} className="text-sm flex items-start gap-2">
                          <span className="text-[var(--terminal-muted)]">→</span>
                          <span style={{ color: 'var(--terminal-text)' }}>{input}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="font-mono text-xs mb-2" style={{ color: 'var(--electric-green)' }}>OUTPUTS</div>
                    <ul className="space-y-1">
                      {selectedNodeData.outputs.map((output, idx) => (
                        <li key={idx} className="text-sm flex items-start gap-2">
                          <span className="text-[var(--terminal-muted)]">←</span>
                          <span style={{ color: 'var(--terminal-text)' }}>{output}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="font-mono text-xs mb-2" style={{ color: 'var(--red)' }}>FAILURES</div>
                    <ul className="space-y-1">
                      {selectedNodeData.failures.map((failure, idx) => (
                        <li key={idx} className="text-sm flex items-start gap-2">
                          <span className="text-[var(--red)]">!</span>
                          <span style={{ color: 'var(--terminal-text)' }}>{failure}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Guarantees */}
              <div>
                <div className="font-mono text-[10px] uppercase tracking-wider mb-3" style={{ color: 'var(--terminal-muted)' }}>
                  GUARANTEES
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedNodeData.guarantees.map((guarantee, idx) => (
                    <Badge key={idx} variant="green">{guarantee}</Badge>
                  ))}
                </div>
              </div>

              {/* Links */}
              {selectedNodeData.links && Object.keys(selectedNodeData.links).length > 0 && (
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-wider mb-3" style={{ color: 'var(--terminal-muted)' }}>
                    LINKS
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {selectedNodeData.links.demo && (
                      <Button variant="primary" onClick={() => window.open(selectedNodeData.links!.demo, '_blank')}>
                        OPEN DEMO
                      </Button>
                    )}
                    {selectedNodeData.links.github && (
                      <Button variant="secondary" onClick={() => window.open(selectedNodeData.links!.github, '_blank')}>
                        GITHUB
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </section>
  );
}

