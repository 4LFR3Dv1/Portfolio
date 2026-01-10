import React, { useState } from 'react';
import { MermaidDiagram } from './mermaid-diagram';
import { architectureDiagrams, diagramMetadata } from '../data/diagrams';
import { Badge } from './badge';

export function SystemArchitecture() {
    const [selectedDiagram, setSelectedDiagram] = useState<string>('overview');

    const currentDiagram = diagramMetadata.find(d => d.id === selectedDiagram);

    return (
        <section className="max-w-[1600px] mx-auto px-6 py-16 lg:py-24 border-t border-[var(--border-subtle)]" id="architecture">
            {/* Header */}
            <div className="mb-12">
                <h2 className="font-mono font-bold mb-4" style={{ color: 'var(--electric-blue)' }}>
                    SYSTEM ARCHITECTURE
                </h2>
                <p className="text-base" style={{ color: 'var(--terminal-muted)' }}>
                    Diagramas interativos da arquitetura SNE Radar: Componentes, Fluxos e Integrações.
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
                                {diagram.title}
                            </h3>
                            {selectedDiagram === diagram.id && (
                                <Badge variant="default">ACTIVE</Badge>
                            )}
                        </div>
                        <p className="text-xs leading-relaxed" style={{ color: 'var(--terminal-muted)' }}>
                            {diagram.description}
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
                                {currentDiagram.title}
                            </h3>
                            <p className="text-sm" style={{ color: 'var(--terminal-muted)' }}>
                                {currentDiagram.description}
                            </p>
                        </div>
                        <Badge variant="green">INTERACTIVE</Badge>
                    </div>

                    <MermaidDiagram
                        chart={architectureDiagrams[selectedDiagram as keyof typeof architectureDiagrams]}
                        id={selectedDiagram}
                    />

                    <div className="flex items-center gap-3 text-xs font-mono" style={{ color: 'var(--terminal-muted)' }}>
                        <span>💡 TIP: Scroll horizontally to see full diagram</span>
                        <span>•</span>
                        <span>Rendered with Mermaid.js</span>
                    </div>
                </div>
            )}
        </section>
    );
}
