import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

interface MermaidDiagramProps {
    chart: string;
    id: string;
}

export function MermaidDiagram({ chart, id }: MermaidDiagramProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        mermaid.initialize({
            startOnLoad: true,
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
            }
        });

        if (containerRef.current) {
            containerRef.current.innerHTML = chart;
            mermaid.contentLoaded();
        }
    }, [chart]);

    return (
        <div
            ref={containerRef}
            className="mermaid bg-[var(--surface-1)] p-6 rounded-lg border border-[var(--border-default)] overflow-x-auto"
            data-diagram-id={id}
        />
    );
}
