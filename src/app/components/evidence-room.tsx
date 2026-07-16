import { useState } from 'react';
import { Badge } from './badge';
import { Button } from './button';
import { useLanguage } from '../context/language-context';

type EvidenceType = 'live' | 'source' | 'document' | 'health';

interface EvidenceItem {
  id: string;
  type: EvidenceType;
  title: { en: string; pt: string };
  description: { en: string; pt: string };
  url: string;
  provenance: { en: string; pt: string };
}

const evidenceItems: EvidenceItem[] = [
  {
    id: 'vira-live',
    type: 'live',
    title: { en: 'VIRA // LIVE PRODUCT', pt: 'VIRA // PRODUTO ONLINE' },
    description: { en: 'Deployed consumer experience with public read-only flows.', pt: 'Experiência de consumo publicada com fluxos públicos somente leitura.' },
    url: 'https://vira.snelabs.space/?lang=en',
    provenance: { en: 'Production deployment', pt: 'Deploy de produção' },
  },
  {
    id: 'vira-readiness',
    type: 'health',
    title: { en: 'VIRA // READINESS', pt: 'VIRA // PRONTIDÃO' },
    description: { en: 'Public operational endpoint for deployment readiness.', pt: 'Endpoint operacional público de prontidão do deploy.' },
    url: 'https://vira.snelabs.space/ready',
    provenance: { en: 'Live HTTP endpoint', pt: 'Endpoint HTTP online' },
  },
  {
    id: 'portfolio-source',
    type: 'source',
    title: { en: 'PORTFOLIO // SOURCE', pt: 'PORTFÓLIO // CÓDIGO' },
    description: { en: 'Public source, history and automated verification for this portfolio.', pt: 'Código público, histórico e verificação automatizada deste portfólio.' },
    url: 'https://github.com/4LFR3Dv1/Portfolio',
    provenance: { en: 'Public GitHub repository', pt: 'Repositório público no GitHub' },
  },
  {
    id: 'edital-sales',
    type: 'source',
    title: { en: 'EDITALSALES // SOURCE', pt: 'EDITALSALES // CÓDIGO' },
    description: { en: 'React and Python product for public-funding discovery and opportunity workflows.', pt: 'Produto React e Python para descoberta de editais e fluxos de oportunidades.' },
    url: 'https://github.com/4LFR3Dv1/EditalSales',
    provenance: { en: 'Public GitHub repository', pt: 'Repositório público no GitHub' },
  },
  {
    id: 'ordm-testnet',
    type: 'source',
    title: { en: 'ORDM TESTNET // SOURCE', pt: 'ORDM TESTNET // CÓDIGO' },
    description: { en: 'Public Go experiment for two-layer blockchain architecture.', pt: 'Experimento público em Go para arquitetura blockchain de duas camadas.' },
    url: 'https://github.com/4LFR3Dv1/ordm-testnet',
    provenance: { en: 'Public GitHub repository', pt: 'Repositório público no GitHub' },
  },
  {
    id: 'verify-systems',
    type: 'document',
    title: { en: 'VERIFY SYSTEMS // PUBLICATION', pt: 'VERIFY SYSTEMS // PUBLICAÇÃO' },
    description: { en: 'Operational doctrine for verifiable and reconcilable systems.', pt: 'Doutrina operacional para sistemas verificáveis e reconciliáveis.' },
    url: '/docs/Verify_By_Renan_Melo.pdf',
    provenance: { en: 'Public PDF artifact', pt: 'Artefato PDF público' },
  },
  {
    id: 'cv-2026',
    type: 'document',
    title: { en: 'RENAN MELO // CV', pt: 'RENAN MELO // CURRÍCULO' },
    description: { en: 'Professional summary, technology stack and selected experience.', pt: 'Resumo profissional, stack tecnológica e experiência selecionada.' },
    url: '/docs/RENAN_MELO_2026_EN.pdf',
    provenance: { en: 'Public PDF artifact', pt: 'Artefato PDF público' },
  },
];

export function EvidenceRoom() {
  const { language, t } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<'all' | EvidenceType>('all');
  const visibleItems = activeFilter === 'all'
    ? evidenceItems
    : evidenceItems.filter((item) => item.type === activeFilter);
  const labels = language === 'en'
    ? { all: 'ALL', live: 'LIVE', source: 'SOURCE', document: 'DOCUMENTS', health: 'HEALTH', open: 'OPEN EVIDENCE' }
    : { all: 'TODOS', live: 'ONLINE', source: 'CÓDIGO', document: 'DOCUMENTOS', health: 'SAÚDE', open: 'ABRIR EVIDÊNCIA' };

  return (
    <section className="mx-auto max-w-[1480px] px-6 py-24 lg:px-10 lg:py-32" id="evidence">
      <div className="mb-14 grid gap-5 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
        <div>
          <div className="eyebrow mb-5">03 / Public proof</div>
          <h2 className="text-white">{t('evidence.title')}</h2>
        </div>
        <p className="max-w-2xl text-base leading-relaxed text-[var(--terminal-muted)] lg:justify-self-end">
          {language === 'en'
            ? 'Every item below resolves to a public deployment, repository, endpoint or document. Private projects are never presented as publicly auditable.'
            : 'Cada item abaixo leva a um deploy, repositório, endpoint ou documento público. Projetos privados nunca são apresentados como publicamente auditáveis.'}
        </p>
      </div>

      <div className="mb-8 flex flex-wrap gap-1 border-y border-[var(--border-subtle)] bg-white/[0.02] p-2">
        {(['all', 'live', 'source', 'document', 'health'] as const).map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setActiveFilter(filter)}
            className={`rounded-[0.2rem] px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.12em] transition-all ${activeFilter === filter
              ? 'bg-[var(--electric-blue)] text-[#0a0a0f]'
              : 'text-[var(--terminal-muted)] hover:bg-white/[0.04] hover:text-white'}`}
          >
            {labels[filter]}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleItems.map((item) => (
          <article key={item.id} className="glass-panel group flex min-h-64 flex-col border-t-2 border-t-[var(--border-strong)] p-6 transition-transform duration-300 hover:-translate-y-1 hover:border-t-[var(--electric-blue)]">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-mono text-xs font-semibold text-white">{item.title[language]}</h3>
              <Badge variant={item.type === 'health' ? 'green' : 'default'}>{labels[item.type]}</Badge>
            </div>
            <div className="mt-8 flex flex-1 flex-col space-y-4">
              <p className="flex-1 text-sm leading-relaxed" style={{ color: 'var(--terminal-muted)' }}>{item.description[language]}</p>
              <p className="font-mono text-[10px] uppercase tracking-wider" style={{ color: 'var(--electric-green)' }}>{item.provenance[language]}</p>
              <Button variant="secondary" onClick={() => window.open(item.url, '_blank', 'noopener,noreferrer')} className="w-full">
                {labels.open}
              </Button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
