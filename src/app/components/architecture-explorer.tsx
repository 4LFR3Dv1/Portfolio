import { useState } from 'react';
import { Badge } from './badge';
import { Button } from './button';
import { MermaidDiagram } from './mermaid-diagram';
import { useLanguage } from '../context/language-context';

interface ArchitectureExplorerProps {
  onBack?: () => void;
}

// Full ecosystem diagrams
const ecosystemDiagrams = {
  overview: `graph TB
    subgraph UserLayer["👤 USER LAYER"]
        USER["User / Trader"]
        WALLET["Wallet (MetaMask)"]
    end
    
    subgraph Products["🎯 SNE LABS PRODUCTS"]
        SNEOS["SNE OS<br/>Control Plane Web"]
        RADAR["SNE Radar<br/>Desktop Trading"]
        VAULT["SNE Vault<br/>Security Protocol"]
    end
    
    subgraph Backend["⚙️ BACKEND SERVICES"]
        API["SNE Core API<br/>Flask + PostgreSQL"]
        AUTH["Auth Service<br/>SIWE + Sessions"]
        ALERTS["Alerts/Ops<br/>Telegram Bot"]
    end
    
    subgraph Blockchain["🔗 BLOCKCHAIN LAYER"]
        SCROLL["Scroll L2<br/>License Registry"]
        NFT["NFT Entitlements"]
    end
    
    subgraph External["🌐 EXTERNAL"]
        BINANCE["Binance API"]
        BYBIT["Bybit API"]
    end
    
    USER --> WALLET
    WALLET --> SNEOS
    WALLET --> SCROLL
    
    SNEOS --> API
    SNEOS --> AUTH
    
    RADAR --> API
    RADAR --> BINANCE
    RADAR --> BYBIT
    RADAR --> ALERTS
    
    VAULT --> SCROLL
    VAULT --> NFT
    
    API --> AUTH
    AUTH --> SCROLL
    SCROLL --> NFT`,

  sneos: `graph TB
    subgraph SNEOS["SNE OS - Control Plane"]
        LANDING["Landing Page<br/>radar.snelabs.space"]
        APP["Web App<br/>snelabs.space"]
        DESIGN["Design System<br/>Components + Tokens"]
    end
    
    subgraph Routes["📍 MODULAR ROUTES"]
        HOME["/home"]
        RADAR_R["/radar"]
        PASS["/pass"]
        VAULT_R["/vault"]
    end
    
    subgraph Trust["🛡️ TRUST SURFACES"]
        DOCS["Docs"]
        STATUS["Status"]
        PRICING["Pricing"]
    end
    
    subgraph Auth["🔐 AUTHENTICATION"]
        CONNECT["WalletConnect"]
        SIWE["SIWE Signature"]
        TIERS["Tier Gating<br/>Free/Pro/Enterprise"]
    end
    
    APP --> Routes
    APP --> Trust
    APP --> DESIGN
    
    LANDING --> CONNECT
    CONNECT --> SIWE
    SIWE --> TIERS
    
    Routes --> TIERS`,

  radar: `graph TB
    subgraph Desktop["🖥️ DESKTOP RUNTIME"]
        ELECTRON["Electron Shell"]
        PYTHON["Python Backend<br/>Flask + Motor"]
        VUE["Vue.js Frontend"]
        LOCAL_DB["SQLite Cache"]
    end
    
    subgraph Features["📊 FEATURES"]
        SCANNER["Market Scanner"]
        ALERTS_F["Alert System"]
        DASHBOARD["Dashboard UI"]
        ANALYSIS["Technical Analysis"]
    end
    
    subgraph AuthFlow["🔐 AUTH FLOW"]
        DEEPLINK["Deep Link<br/>sneradar://"]
        CODE["One-Time Code"]
        TOKENS["Access/Refresh Tokens"]
        GRACE["Offline Grace Mode"]
    end
    
    subgraph Integrations["🔌 INTEGRATIONS"]
        BINANCE_I["Binance WebSocket"]
        BYBIT_I["Bybit WebSocket"]
        TELEGRAM["Telegram Alerts"]
    end
    
    ELECTRON --> VUE
    ELECTRON --> PYTHON
    PYTHON --> LOCAL_DB
    PYTHON --> Features
    
    VUE --> DASHBOARD
    
    DEEPLINK --> CODE
    CODE --> TOKENS
    TOKENS --> GRACE
    
    PYTHON --> Integrations`,

  vault: `graph TB
    subgraph Core["🔒 SNE VAULT PROTOCOL"]
        SPEC["Hardened Specification"]
        THREAT["Threat Model"]
        CRYPTO["Crypto Primitives"]
    end
    
    subgraph Security["🛡️ SECURITY CONTROLS"]
        AEAD["AEAD Encryption"]
        HKDF["Key Derivation"]
        TAMPER["Tamper Detection"]
        ZERO["Zeroization"]
    end
    
    subgraph Trust_I["✅ TRUST INPUTS"]
        HARDWARE["Hardware Attestation"]
        POU["Proof of Uptime"]
        ENTITLE["Entitlements"]
    end
    
    subgraph Guarantees["🎯 GUARANTEES"]
        SEPARATION["Domain Separation"]
        VERIFY["Verifiable Signals"]
        RESPONSE["Compromise Response"]
        GOV["Governance Ready"]
    end
    
    Core --> Security
    Core --> Threat
    
    Trust_I --> SPEC
    Security --> Guarantees
    
    AEAD --> HKDF
    TAMPER --> ZERO`,

  dataflow: `sequenceDiagram
    participant User
    participant Desktop as SNE Radar Desktop
    participant API as SNE Core API
    participant Exchange as Binance/Bybit
    participant Telegram as Telegram Bot
    
    User->>Desktop: Opens App
    Desktop->>API: Validate Session
    API-->>Desktop: Session Valid
    
    Desktop->>Exchange: Subscribe WebSocket
    Exchange-->>Desktop: Market Data Stream
    
    Desktop->>Desktop: Run Analysis Motor
    Desktop->>Desktop: Detect Signal
    
    alt Alert Triggered
        Desktop->>Telegram: Send Alert
        Telegram-->>User: Notification
    end
    
    Desktop-->>User: Update Dashboard`
};

const diagramTabs = [
  { id: 'overview', label: 'ECOSYSTEM', icon: '🌐' },
  { id: 'sneos', label: 'SNE OS', icon: '🎯' },
  { id: 'radar', label: 'SNE RADAR', icon: '📡' },
  { id: 'vault', label: 'SNE VAULT', icon: '🔒' },
  { id: 'dataflow', label: 'DATA FLOW', icon: '📊' },
];

export function ArchitectureExplorer({ onBack }: ArchitectureExplorerProps) {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');

  const descriptions: Record<string, { en: string; pt: string }> = {
    overview: {
      en: 'Complete SNE Labs ecosystem: Products, Services, Blockchain, and External Integrations.',
      pt: 'Ecossistema completo SNE Labs: Produtos, Serviços, Blockchain e Integrações Externas.'
    },
    sneos: {
      en: 'Control Plane Web with modular routes, trust surfaces, and wallet-based authentication.',
      pt: 'Control Plane Web com rotas modulares, superfícies de confiança e autenticação via wallet.'
    },
    radar: {
      en: 'Desktop trading terminal with local runtime, market analysis, and real-time integrations.',
      pt: 'Terminal de trading desktop com runtime local, análise de mercado e integrações em tempo real.'
    },
    vault: {
      en: 'Security protocol with hardened specification, threat modeling, and cryptographic guarantees.',
      pt: 'Protocolo de segurança com especificação hardened, modelagem de ameaças e garantias criptográficas.'
    },
    dataflow: {
      en: 'Real-time data flow from market exchanges to user notifications.',
      pt: 'Fluxo de dados em tempo real dos exchanges de mercado até notificações do usuário.'
    }
  };

  return (
    <section className="max-w-[1600px] mx-auto px-6 py-16">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-mono font-bold mb-2" style={{ color: 'var(--electric-blue)' }}>
              {language === 'en' ? 'ARCHITECTURE EXPLORER' : 'EXPLORADOR DE ARQUITETURA'}
            </h2>
            <p className="text-sm" style={{ color: 'var(--terminal-muted)' }}>
              {language === 'en'
                ? 'Interactive visualization of the complete SNE Labs ecosystem.'
                : 'Visualização interativa do ecossistema completo SNE Labs.'}
            </p>
          </div>
          {onBack && (
            <Button variant="ghost" onClick={onBack}>
              ← {language === 'en' ? 'BACK' : 'VOLTAR'}
            </Button>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-6 pb-4 border-b border-[var(--border-default)]">
        {diagramTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 font-mono text-xs uppercase tracking-wider border transition-all flex items-center gap-2 ${activeTab === tab.id
                ? 'bg-[var(--electric-blue)] text-black border-[var(--electric-blue)]'
                : 'bg-[var(--surface-1)] border-[var(--border-default)] text-[var(--terminal-muted)] hover:border-[var(--electric-blue)] hover:text-[var(--electric-blue)]'
              }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Active Diagram */}
      <div className="space-y-4">
        {/* Description */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge variant="blue">
              {diagramTabs.find(t => t.id === activeTab)?.icon} {diagramTabs.find(t => t.id === activeTab)?.label}
            </Badge>
            <span className="text-sm" style={{ color: 'var(--terminal-muted)' }}>
              {descriptions[activeTab][language]}
            </span>
          </div>
          <Badge variant="green">{language === 'en' ? 'INTERACTIVE' : 'INTERATIVO'}</Badge>
        </div>

        {/* Diagram Container */}
        <div className="overflow-hidden border border-[var(--border-default)] bg-[var(--surface-1)]">
          <div className="border-b border-[var(--border-default)] px-4 py-3 bg-[var(--surface-2)] flex items-center justify-between">
            <div className="font-mono text-xs uppercase tracking-wider" style={{ color: 'var(--electric-blue)' }}>
              {diagramTabs.find(t => t.id === activeTab)?.label} // ARCHITECTURE
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[var(--status-online)] animate-pulse"></div>
              <span className="font-mono text-xs" style={{ color: 'var(--terminal-muted)' }}>{language === 'en' ? 'LIVE' : 'ATIVO'}</span>
            </div>
          </div>

          <div className="p-4 min-h-[500px]">
            <MermaidDiagram
              chart={ecosystemDiagrams[activeTab as keyof typeof ecosystemDiagrams]}
              id={`arch-${activeTab}`}
            />
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 pt-4 border-t border-[var(--border-subtle)]">
          <div className="flex items-center gap-2 text-xs font-mono" style={{ color: 'var(--terminal-muted)' }}>
            <div className="w-3 h-3 rounded bg-[var(--electric-blue)]"></div>
            <span>{language === 'en' ? 'Core Service' : 'Serviço principal'}</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono" style={{ color: 'var(--terminal-muted)' }}>
            <div className="w-3 h-3 rounded bg-[var(--electric-green)]"></div>
            <span>{language === 'en' ? 'Storage/Blockchain' : 'Armazenamento/Blockchain'}</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono" style={{ color: 'var(--terminal-muted)' }}>
            <div className="w-3 h-3 rounded bg-[var(--amber)]"></div>
            <span>{language === 'en' ? 'External Integration' : 'Integração externa'}</span>
          </div>
          <div className="flex-1 text-right text-xs font-mono" style={{ color: 'var(--terminal-muted)' }}>
            💡 {language === 'en' ? 'Scroll horizontally for full diagram' : 'Role horizontalmente para diagrama completo'}
          </div>
        </div>
      </div>
    </section>
  );
}
