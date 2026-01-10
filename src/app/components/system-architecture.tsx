import React, { useState } from 'react';
import { MermaidDiagram } from './mermaid-diagram';
import { architectureDiagrams } from '../data/diagrams';
import { Badge } from './badge';
import { useLanguage } from '../context/language-context';

export function SystemArchitecture() {
    const { t } = useLanguage();
    const [selectedDiagram, setSelectedDiagram] = useState<string>('overview');

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
        <section className="max-w-[1600px] mx-auto px-6 py-16 lg:py-24 border-t border-[var(--border-subtle)]" id="architecture">
            {/* Header */}
            <div className="mb-12">
                <h2 className="font-mono font-bold mb-4" style={{ color: 'var(--electric-blue)' }}>
                    {t('architecture.title')}
                </h2>
                <p className="text-base" style={{ color: 'var(--terminal-muted)' }}>
                    {t('architecture.subtitle')}
                </p>
            </div>

            {/* Diagram Selector */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {diagramMetadata.map((diagram) => (
                    <button
                        key={diagram.id}
                        onClick={() => setSelectedDiagram(diagram.id)}
                        className={`border p-6 text-left transition-all group ${selectedDiagram === diagram.id
                                ? 'border-[var(--electric-blue)] bg-[var(--surface-2)]'
                                : 'border-[var(--border-default)] bg-[var(--surface-1)] hover:border-[var(--electric-blue)]'
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

                    <MermaidDiagram
                        chart={architectureDiagrams[selectedDiagram as keyof typeof architectureDiagrams]}
                        id={selectedDiagram}
                    />

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
