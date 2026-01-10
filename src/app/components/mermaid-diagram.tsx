import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

interface MermaidDiagramProps {
    chart: string;
    id: string;
}

// Initialize mermaid once
mermaid.initialize({
    startOnLoad: false,
    theme: 'dark',
    themeVariables: {
        primaryColor: '#00d9ff',
        primaryTextColor: '#fff',
        primaryBorderColor: '#00d9ff',
        lineColor: '#00d9ff',
        secondaryColor: '#1a1a24',
        tertiaryColor: '#0a0a0f',
        background: '#0a0a0f',
        mainBkg: '#1a1a24',
        secondBkg: '#0a0a0f',
        textColor: '#c9d1d9',
        fontSize: '14px',
        fontFamily: 'JetBrains Mono, monospace'
    },
    securityLevel: 'loose',
    flowchart: {
        useMaxWidth: true,
        htmlLabels: true,
        curve: 'basis'
    },
    sequence: {
        useMaxWidth: true,
        wrap: true
    }
});

export function MermaidDiagram({ chart, id }: MermaidDiagramProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [svg, setSvg] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const renderDiagram = async () => {
            try {
                // Generate unique ID for this render
                const uniqueId = `mermaid-${id}-${Date.now()}`;

                // Render the diagram
                const { svg: renderedSvg } = await mermaid.render(uniqueId, chart);
                setSvg(renderedSvg);
                setError(null);
            } catch (err) {
                console.error('Mermaid render error:', err);
                setError(String(err));
            }
        };

        renderDiagram();
    }, [chart, id]);

    if (error) {
        return (
            <div className="bg-[var(--surface-1)] p-6 rounded-lg border border-red-500/50 overflow-x-auto">
                <p className="text-red-400 font-mono text-sm mb-4">Diagram render error</p>
                <pre className="text-xs text-[var(--terminal-muted)] overflow-x-auto whitespace-pre-wrap">
                    {chart}
                </pre>
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            className="bg-[var(--surface-1)] p-6 rounded-lg border border-[var(--border-default)] overflow-x-auto"
            data-diagram-id={id}
            dangerouslySetInnerHTML={{ __html: svg }}
        />
    );
}
