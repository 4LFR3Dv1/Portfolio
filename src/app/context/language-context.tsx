import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'pt';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translations
const translations: Record<Language, Record<string, string>> = {
    en: {
        // Header
        'nav.systems': 'SYSTEMS',
        'nav.product': 'PRODUCT',
        'nav.web3': 'WEB3',
        'nav.desktop': 'DESKTOP',
        'system.status': 'SYSTEM: NOMINAL',

        // Hero
        'hero.title': 'RENAN MELO',
        'hero.subtitle': 'Decentralized Systems Architect | Author of VERIFY SYSTEMS',
        'hero.description': 'From Bitcoin principles to production systems. I derive verifiable architectures from first principles and build end-to-end: Platform UX, desktop runtime, backend, and Web3 auth/licensing.',
        'hero.cta.work': 'VIEW WORK',
        'hero.cta.contact': 'CONTACT',
        'hero.cta.architecture': 'ARCHITECTURE',

        // Selected Work
        'work.title': 'SELECTED WORK',
        'work.subtitle': 'Production-grade systems. Real users. Measurable impact.',
        'work.cta.casestudy': 'CASE STUDY',
        'work.cta.demo': 'LIVE DEMO',
        'work.cta.evidence': 'EVIDENCE',

        // Evidence Room
        'evidence.title': 'EVIDENCE ROOM',
        'evidence.subtitle': 'Code artifacts, smart contracts, and technical documentation. Proof of Work.',
        'evidence.filter.all': 'ALL',
        'evidence.filter.pdf': 'PDF',
        'evidence.filter.code': 'CODE',
        'evidence.filter.diagram': 'DIAGRAM',
        'evidence.cta.viewsource': 'VIEW SOURCE',
        'evidence.cta.openpdf': 'OPEN PDF',
        'evidence.cta.view': 'VIEW',

        // System Architecture
        'architecture.title': 'SYSTEM ARCHITECTURE',
        'architecture.subtitle': 'Interactive diagrams of SNE Radar architecture: Components, Flows, and Integrations.',
        'architecture.interactive': 'INTERACTIVE',
        'architecture.active': 'ACTIVE',
        'architecture.tip': 'TIP: Scroll horizontally to see full diagram',
        'architecture.rendered': 'Rendered with Mermaid.js',

        // About
        'about.title': 'ABOUT // OPERATOR NOTES',
        'about.p1': 'I build products like tools: interfaces that provide clarity, control, and performance.',
        'about.p2': 'I like distributed systems that need to work in the real world: networks fail, APIs change, users abandon if UX breaks.',
        'about.p3': 'My background includes systems thinking from first principles. I studied Bitcoin\'s architecture and derived universal patterns for verifiable systems--documented in VERIFY SYSTEMS, an operational doctrine for production environments.',
        'about.p4': 'My focus is end-to-end ownership: architecture, UX, integration, deploy, diagnostics, and continuous evolution. I prefer high signal: less promise, more evidence.',
        'about.skills': 'SKILLS',

        // Contact
        'contact.title': 'CONTACT // ROUTING',
        'contact.subtitle': 'If you want to hire, partner, or discuss a pilot, reach out directly.',
        'contact.hiring.title': 'HIRING',
        'contact.hiring.desc': 'Available for full-time remote.',
        'contact.hiring.cta': 'EMAIL ME',
        'contact.partnership.title': 'PARTNERSHIPS / PILOTS',
        'contact.partnership.desc': 'Demo, integration, paid pilot.',
        'contact.partnership.cta': "LET'S TALK",
        'contact.consulting.title': 'CONSULTING',
        'contact.consulting.desc': 'Architecture, product, UX tooling, web3 auth.',
        'contact.consulting.cta': 'REQUEST AVAILABILITY',
        'contact.location': 'São Paulo, Brazil • Remote OK',

        // Evidence items
        'evidence.solidity.title': 'Solidity // SCROLL L2 LICENSE REGISTRY',
        'evidence.solidity.desc': 'Source of truth for on-chain entitlements.',
        'evidence.python.title': 'Python // SNE RADAR MOTOR (CYTHONIZED)',
        'evidence.python.desc': 'High-frequency execution logic (Excerpts).',
        'evidence.cv.title': 'RENAN MELO // CV 2026 (PDF)',
        'evidence.cv.desc': 'Professional summary, tech stack, and projects.',
        'evidence.vault.hardened.title': 'SNE Vault Protocol // Hardened Specification (PDF)',
        'evidence.vault.hardened.desc': 'Complete technical specification with threat model and security guarantees.',
        'evidence.vault.devplan.title': 'SNE Vault Protocol // Development Plan (PDF)',
        'evidence.vault.devplan.desc': 'Incremental technical roadmap and implementation architecture.',
        'evidence.vault.devlist.title': 'SNE Vault Protocol // Development Plan List (PDF)',
        'evidence.vault.devlist.desc': 'Detailed task checklist and project milestones.',
        'evidence.vault.overview.title': 'SNE Labs // SNE Vault Protocol Overview (PDF)',
        'evidence.vault.overview.desc': 'Protocol overview and use cases.',
        'evidence.vault.infra.title': 'SNE Vault Protocol // Sovereign Infrastructure (PDF)',
        'evidence.vault.infra.desc': 'Sovereign physical infrastructure architecture.',
        'evidence.verify.title': 'VERIFY SYSTEMS // Operational Doctrine (PDF)',
        'evidence.verify.desc': 'From Bitcoin principles to production systems. Event sourcing, reconciliation, and verifiable state management.',

        // Command Palette
        'palette.placeholder': 'Type a command or search...',
        'palette.navigation': 'Navigation',
        'palette.projects': 'Projects',
        'palette.goto.home': 'Go to Home',
        'palette.goto.work': 'Go to Work',
        'palette.goto.about': 'Go to About',
        'palette.goto.contact': 'Go to Contact',
        'palette.goto.evidence': 'Go to Evidence',
        'palette.open.architecture': 'Open Architecture Explorer',

        // Projects
        'project.sneos.title': 'SNE OS',
        'project.sneos.description': 'Platform-level UX desktop experience. OS-like interface with window management, deep navigation, and unified design system.',
        'project.sneradar.title': 'SNE Radar',
        'project.sneradar.description': 'Desktop trading terminal with Python backend, real-time market analysis, and Web3 authentication system.',
        'project.vault.title': 'SNE Vault Protocol',
        'project.vault.description': 'Sovereign physical infrastructure for secure key storage and decentralized identity management.',

        // Diagram titles
        'diagram.overview.title': 'SNE Radar // System Overview',
        'diagram.overview.desc': 'Complete ecosystem architecture: Frontend, Backend, Blockchain and Integrations.',
        'diagram.desktop.title': 'Desktop App // Component Architecture',
        'diagram.desktop.desc': 'Internal structure of SNE_Radar.exe: Python Backend + Vue.js Frontend.',
        'diagram.landing.title': 'Landing Page // Component Architecture',
        'diagram.landing.desc': 'Landing page organization: Auth, License Flow and UI Components.',
        'diagram.purchase.title': 'User Flow // Purchase & Installation',
        'diagram.purchase.desc': 'Complete flow from license purchase to first app execution.',
        'diagram.auth.title': 'User Flow // Desktop Authentication',
        'diagram.auth.desc': 'Deep Link authentication: How desktop authenticates via browser + SIWE.',
        'diagram.data.title': 'Data Flow // Market Analysis Pipeline',
        'diagram.data.desc': 'Data pipeline: Market APIs -> Processing -> Dashboard & Alerts.',

        // Publications
        'publications.title': 'PUBLICATIONS // WRITING',
        'publications.subtitle': 'Doctrine, frameworks, and systems thinking. From first principles to production.',
        'publications.verify.description': 'Operational doctrine for verifiable systems. Derived from Bitcoin principles (UTXO, proof-of-work, consensus), VERIFY SYSTEMS establishes universal patterns for turning execution into evidence and state into verifiable operational knowledge.',
        'publications.verify.concepts': 'KEY CONCEPTS',
        'publications.verify.origin': 'ORIGIN STORY',
        'publications.verify.timeline.1': 'Discovered Bitcoin. Studied the protocol deeply.',
        'publications.verify.timeline.2': 'Realized Bitcoin\'s patterns are universal.',
        'publications.verify.timeline.3': 'Applied UTXO thinking to fintech systems.',
        'publications.verify.timeline.4': 'Formalized VERIFY SYSTEMS as operational doctrine.',
        'publications.production.title': 'Production Systems Handbook',
        'publications.production.desc': 'Operational guide for production-grade systems. Covers deployment strategies, monitoring, incident response, and system reliability patterns.',
        'publications.typescript.title': 'TypeScript Handbook',
        'publications.typescript.desc': 'Comprehensive guide to TypeScript best practices, advanced type patterns, and type-safe architecture for scalable applications.',
    },
    pt: {
        // Header
        'nav.systems': 'SISTEMAS',
        'nav.product': 'PRODUTO',
        'nav.web3': 'WEB3',
        'nav.desktop': 'DESKTOP',
        'system.status': 'SISTEMA: NOMINAL',

        // Hero
        'hero.title': 'RENAN MELO',
        'hero.subtitle': 'Arquiteto de Sistemas Descentralizados | Autor de VERIFY SYSTEMS',
        'hero.description': 'Dos princípios do Bitcoin a sistemas de produção. Derivo arquiteturas verificáveis a partir de primeiros princípios e construo end-to-end: Platform UX, desktop runtime, backend e Web3 auth/licensing.',
        'hero.cta.work': 'VER TRABALHOS',
        'hero.cta.contact': 'CONTATO',
        'hero.cta.architecture': 'ARQUITETURA',

        // Selected Work
        'work.title': 'TRABALHOS SELECIONADOS',
        'work.subtitle': 'Sistemas production-grade. Usuários reais. Impacto mensurável.',
        'work.cta.casestudy': 'CASE STUDY',
        'work.cta.demo': 'DEMO AO VIVO',
        'work.cta.evidence': 'EVIDÊNCIAS',

        // Evidence Room
        'evidence.title': 'SALA DE EVIDÊNCIAS',
        'evidence.subtitle': 'Artefatos de código, smart contracts e documentação técnica. Proof of Work.',
        'evidence.filter.all': 'TODOS',
        'evidence.filter.pdf': 'PDF',
        'evidence.filter.code': 'CÓDIGO',
        'evidence.filter.diagram': 'DIAGRAMA',
        'evidence.cta.viewsource': 'VER CÓDIGO',
        'evidence.cta.openpdf': 'ABRIR PDF',
        'evidence.cta.view': 'VER',

        // System Architecture
        'architecture.title': 'ARQUITETURA DO SISTEMA',
        'architecture.subtitle': 'Diagramas interativos da arquitetura SNE Radar: Componentes, Fluxos e Integrações.',
        'architecture.interactive': 'INTERATIVO',
        'architecture.active': 'ATIVO',
        'architecture.tip': 'DICA: Role horizontalmente para ver o diagrama completo',
        'architecture.rendered': 'Renderizado com Mermaid.js',

        // About
        'about.title': 'SOBRE // NOTAS DO OPERADOR',
        'about.p1': 'Eu construo produtos como ferramentas: interfaces que dão clareza, controle e performance.',
        'about.p2': 'Gosto de sistemas distribuídos que precisam funcionar no mundo real: rede falha, APIs mudam, usuários abandonam se a UX quebra.',
        'about.p3': 'Minha formação inclui pensamento sistêmico a partir de primeiros princípios. Estudei a arquitetura do Bitcoin e derivei padrões universais para sistemas verificáveis--documentados em VERIFY SYSTEMS, uma doutrina operacional para ambientes de produção.',
        'about.p4': 'Meu foco é end-to-end ownership: arquitetura, UX, integração, deploy, diagnósticos e evolução contínua. Tenho preferência por alto sinal: menos promessa, mais evidência.',
        'about.skills': 'HABILIDADES',

        // Contact
        'contact.title': 'CONTATO // ROTEAMENTO',
        'contact.subtitle': 'Se você quer contratar, fazer parceria ou discutir um piloto, me chame direto.',
        'contact.hiring.title': 'CONTRATAÇÃO',
        'contact.hiring.desc': 'Disponível para full-time remoto.',
        'contact.hiring.cta': 'ENVIAR EMAIL',
        'contact.partnership.title': 'PARCERIAS / PILOTOS',
        'contact.partnership.desc': 'Demonstração, integração, piloto pago.',
        'contact.partnership.cta': 'VAMOS CONVERSAR',
        'contact.consulting.title': 'CONSULTORIA',
        'contact.consulting.desc': 'Arquitetura, produto, UX tooling, web3 auth.',
        'contact.consulting.cta': 'VER DISPONIBILIDADE',
        'contact.location': 'São Paulo, Brasil • Remoto OK',

        // Evidence items
        'evidence.solidity.title': 'Solidity // SCROLL L2 LICENSE REGISTRY',
        'evidence.solidity.desc': 'Fonte da verdade para entitlements on-chain.',
        'evidence.python.title': 'Python // SNE RADAR MOTOR (CYTHONIZED)',
        'evidence.python.desc': 'Lógica de execução de alta frequência (Excertos).',
        'evidence.cv.title': 'RENAN MELO // CV 2026 (PDF)',
        'evidence.cv.desc': 'Resumo profissional, stack técnico e projetos.',
        'evidence.vault.hardened.title': 'SNE Vault Protocol // Especificação Hardened (PDF)',
        'evidence.vault.hardened.desc': 'Especificação técnica completa com modelo de ameaças e garantias de segurança.',
        'evidence.vault.devplan.title': 'SNE Vault Protocol // Plano de Desenvolvimento (PDF)',
        'evidence.vault.devplan.desc': 'Roadmap técnico incremental e arquitetura de implementação.',
        'evidence.vault.devlist.title': 'SNE Vault Protocol // Lista do Plano de Desenvolvimento (PDF)',
        'evidence.vault.devlist.desc': 'Checklist detalhado de tarefas e milestones do projeto.',
        'evidence.vault.overview.title': 'SNE Labs // SNE Vault Protocol Overview (PDF)',
        'evidence.vault.overview.desc': 'Visão geral do protocolo e casos de uso.',
        'evidence.vault.infra.title': 'SNE Vault Protocol // Infraestrutura Soberana (PDF)',
        'evidence.vault.infra.desc': 'Arquitetura de infraestrutura física soberana.',
        'evidence.verify.title': 'VERIFY SYSTEMS // Doutrina Operacional (PDF)',
        'evidence.verify.desc': 'Dos princípios do Bitcoin a sistemas de produção. Event sourcing, reconciliação e gerenciamento de estado verificável.',

        // Command Palette
        'palette.placeholder': 'Digite um comando ou pesquise...',
        'palette.navigation': 'Navegação',
        'palette.projects': 'Projetos',
        'palette.goto.home': 'Ir para Home',
        'palette.goto.work': 'Ir para Trabalhos',
        'palette.goto.about': 'Ir para Sobre',
        'palette.goto.contact': 'Ir para Contato',
        'palette.goto.evidence': 'Ir para Evidências',
        'palette.open.architecture': 'Abrir Explorador de Arquitetura',

        // Projects
        'project.sneos.title': 'SNE OS',
        'project.sneos.description': 'Experiência desktop de nível plataforma. Interface OS-like com gerenciamento de janelas, navegação profunda e design system unificado.',
        'project.sneradar.title': 'SNE Radar',
        'project.sneradar.description': 'Terminal de trading desktop com backend Python, análise de mercado em tempo real e sistema de autenticação Web3.',
        'project.vault.title': 'SNE Vault Protocol',
        'project.vault.description': 'Infraestrutura física soberana para armazenamento seguro de chaves e gerenciamento de identidade descentralizada.',

        // Diagram titles
        'diagram.overview.title': 'SNE Radar // Visão Geral do Sistema',
        'diagram.overview.desc': 'Arquitetura completa do ecossistema: Frontend, Backend, Blockchain e Integrações.',
        'diagram.desktop.title': 'Desktop App // Arquitetura de Componentes',
        'diagram.desktop.desc': 'Estrutura interna do SNE_Radar.exe: Python Backend + Vue.js Frontend.',
        'diagram.landing.title': 'Landing Page // Arquitetura de Componentes',
        'diagram.landing.desc': 'Organização da landing page: Auth, License Flow e UI Components.',
        'diagram.purchase.title': 'User Flow // Compra & Instalação',
        'diagram.purchase.desc': 'Fluxo completo desde a compra da licença até a primeira execução do app.',
        'diagram.auth.title': 'User Flow // Autenticação Desktop',
        'diagram.auth.desc': 'Deep Link authentication: Como o desktop se autentica via browser + SIWE.',
        'diagram.data.title': 'Data Flow // Pipeline de Analise de Mercado',
        'diagram.data.desc': 'Pipeline de dados: Market APIs -> Processing -> Dashboard & Alerts.',

        // Publications
        'publications.title': 'PUBLICACOES // ESCRITOS',
        'publications.subtitle': 'Doutrina, frameworks e pensamento sistemico. Dos primeiros principios a producao.',
        'publications.verify.description': 'Doutrina operacional para sistemas verificaveis. Derivado dos principios do Bitcoin (UTXO, proof-of-work, consenso), VERIFY SYSTEMS estabelece padroes universais para transformar execucao em evidencia e estado em conhecimento operacional verificavel.',
        'publications.verify.concepts': 'CONCEITOS-CHAVE',
        'publications.verify.origin': 'HISTORIA DE ORIGEM',
        'publications.verify.timeline.1': 'Descobriu Bitcoin. Estudou o protocolo a fundo.',
        'publications.verify.timeline.2': 'Percebeu que padroes do Bitcoin sao universais.',
        'publications.verify.timeline.3': 'Aplicou pensamento UTXO em sistemas fintech.',
        'publications.verify.timeline.4': 'Formalizou VERIFY SYSTEMS como doutrina operacional.',
        'publications.production.title': 'Manual de Sistemas em Producao',
        'publications.production.desc': 'Guia operacional para sistemas production-grade. Cobre estrategias de deploy, monitoramento, resposta a incidentes e padroes de confiabilidade.',
        'publications.typescript.title': 'Manual de TypeScript',
        'publications.typescript.desc': 'Guia completo de boas praticas TypeScript, padroes avancados de tipos e arquitetura type-safe para aplicacoes escalaveis.',
    }
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguage] = useState<Language>(() => {
        // Check localStorage first
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('portfolio-language');
            if (saved === 'en' || saved === 'pt') return saved;
        }
        return 'en'; // Default to English
    });

    useEffect(() => {
        localStorage.setItem('portfolio-language', language);
        document.documentElement.lang = language;
    }, [language]);

    const t = (key: string): string => {
        return translations[language][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
