import { useState } from 'react';
import { MermaidDiagram } from './mermaid-diagram';
import { architectureDiagrams } from '../data/diagrams';
import { Badge } from './badge';
import { useLanguage } from '../context/language-context';

export function SystemArchitecture() {
    const { t, language } = useLanguage();
    const [selectedDiagram, setSelectedDiagram] = useState<string>('overview');
    const [isDiagramLoaded, setIsDiagramLoaded] = useState(false);

    const diagramMetadata = [
        { id: 'overview', titleKey: 'diagram.overview.title', descKey: 'diagram.overview.desc' },
        { id: 'desktopArchitecture', titleKey: 'diagram.desktop.title', descKey: 'diagram.desktop.desc' },
        { id: 'landingArchitecture', titleKey: 'diagram.landing.title', descKey: 'diagram.landing.desc' },
        { id: 'purchaseFlow', titleKey: 'diagram.purchase.title', descKey: 'diagram.purchase.desc' },
        { id: 'authFlow', titleKey: 'diagram.auth.title', descKey: 'diagram.auth.desc' },
        { id: 'dataFlow', titleKey: 'diagram.data.title', descKey: 'diagram.data.desc' },
    ];

    const currentDiagram = diagramMetadata.find(d => d.id === selectedDiagram);

    return (
        <section className="mx-auto max-w-[1480px] px-6 py-24 lg:px-10 lg:py-32" id="architecture">
            {/* Header */}
            <div className="mb-14 grid gap-5 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
                <div>
                <div className="eyebrow mb-5">Architecture / Interactive</div>
                <h2 className="text-white">
                    {t('architecture.title')}
                </h2></div>
                <p className="max-w-2xl text-base leading-relaxed text-[var(--terminal-muted)] lg:justify-self-end">
                    {t('architecture.subtitle')}
                </p>
            </div>

            {/* Diagram Selector */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {diagramMetadata.map((diagram) => (
                    <button
                        key={diagram.id}
                        type="button"
                        onClick={() => {
                            setSelectedDiagram(diagram.id);
                            setIsDiagramLoaded(true);
                        }}
                        className={`group rounded-[1.25rem] border p-6 text-left transition-all ${selectedDiagram === diagram.id
                                ? 'border-[rgba(141,162,255,0.5)] bg-[rgba(141,162,255,0.08)]'
                                : 'border-[var(--border-default)] bg-white/[0.025] hover:-translate-y-0.5 hover:border-[var(--electric-blue)]'
                            }`}
                    >
                        <div className="flex items-start justify-between mb-3">
                            <h3 className="font-mono text-sm font-semibold leading-tight" style={{
                                color: selectedDiagram === diagram.id ? 'var(--electric-blue)' : 'var(--terminal-text)'
                            }}>
                                {t(diagram.titleKey)}
                            </h3>
                            {selectedDiagram === diagram.id && (
                                <Badge variant="default">{t('architecture.active')}</Badge>
                            )}
                        </div>
                        <p className="text-xs leading-relaxed" style={{ color: 'var(--terminal-muted)' }}>
                            {t(diagram.descKey)}
                        </p>
                    </button>
                ))}
            </div>

            {/* Active Diagram Display */}
            {currentDiagram && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-mono text-lg font-bold mb-1" style={{ color: 'var(--electric-blue)' }}>
                                {t(currentDiagram.titleKey)}
                            </h3>
                            <p className="text-sm" style={{ color: 'var(--terminal-muted)' }}>
                                {t(currentDiagram.descKey)}
                            </p>
                        </div>
                        <Badge variant="green">{t('architecture.interactive')}</Badge>
                    </div>

                    {isDiagramLoaded ? (
                        <MermaidDiagram
                            chart={architectureDiagrams[selectedDiagram as keyof typeof architectureDiagrams]}
                            id={selectedDiagram}
                        />
                    ) : (
                        <button
                            type="button"
                            onClick={() => setIsDiagramLoaded(true)}
                            className="glass-panel min-h-72 w-full rounded-[1.5rem] font-mono text-sm transition-colors hover:border-[var(--electric-blue)]"
                            style={{ color: 'var(--electric-blue)' }}
                        >
                            {language === 'en' ? 'LOAD INTERACTIVE DIAGRAM' : 'CARREGAR DIAGRAMA INTERATIVO'}
                        </button>
                    )}

                    <div className="flex items-center gap-3 text-xs font-mono" style={{ color: 'var(--terminal-muted)' }}>
                        <span>💡 {t('architecture.tip')}</span>
                        <span>•</span>
                        <span>{t('architecture.rendered')}</span>
                    </div>
                </div>
            )}
        </section>
    );
}
