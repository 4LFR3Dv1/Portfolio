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
        'hero.subtitle': 'Product-first Engineer',
        'hero.description': 'End-to-end systems in production: Platform UX (OS-like), desktop runtime, backend, and Web3 auth/licensing (SIWE).',
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
        'about.title': 'ABOUT',
        'about.description': 'Product-first engineer focused on shipping systems that work. I build end-to-end: from UX to infrastructure. Obsessed with tooling-grade quality and developer experience.',
        'about.focus': 'Current focus: Desktop apps with Python backend, Web3 licensing (SIWE + NFT), and platform-level UX.',

        // Contact
        'contact.title': 'CONTACT',
        'contact.subtitle': 'Open for opportunities in Product Engineering, Systems Design, and Web3.',
        'contact.cta': 'EMAIL ME',

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
        'diagram.data.desc': 'Data pipeline: Market APIs → Processing → Dashboard & Alerts.',
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
        'hero.subtitle': 'Engenheiro Product-first',
        'hero.description': 'Sistemas end-to-end em produção: Platform UX (OS-like), desktop runtime, backend e Web3 auth/licensing (SIWE).',
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
        'about.title': 'SOBRE',
        'about.description': 'Engenheiro product-first focado em entregar sistemas que funcionam. Construo end-to-end: de UX a infraestrutura. Obcecado por qualidade tooling-grade e developer experience.',
        'about.focus': 'Foco atual: Apps desktop com backend Python, licenciamento Web3 (SIWE + NFT), e UX de nível plataforma.',

        // Contact
        'contact.title': 'CONTATO',
        'contact.subtitle': 'Aberto para oportunidades em Product Engineering, Systems Design e Web3.',
        'contact.cta': 'ENVIAR EMAIL',

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
        'diagram.data.title': 'Data Flow // Pipeline de Análise de Mercado',
        'diagram.data.desc': 'Pipeline de dados: Market APIs → Processing → Dashboard & Alerts.',
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
