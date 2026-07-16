import { useEffect, useState } from 'react';

interface MermaidDiagramProps {
  chart: string;
  id: string;
}

let initializedMermaid: Promise<typeof import('mermaid').default> | null = null;

async function getMermaid() {
  if (!initializedMermaid) {
    initializedMermaid = import('mermaid').then(({ default: mermaid }) => {
      mermaid.initialize({
        startOnLoad: false,
        theme: 'dark',
        securityLevel: 'strict',
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
          fontFamily: 'JetBrains Mono, monospace',
        },
        flowchart: { useMaxWidth: true, htmlLabels: false, curve: 'basis' },
        sequence: { useMaxWidth: true, wrap: true },
      });
      return mermaid;
    });
  }
  return initializedMermaid;
}

export function MermaidDiagram({ chart, id }: MermaidDiagramProps) {
  const [svg, setSvg] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function renderDiagram() {
      try {
        const mermaid = await getMermaid();
        const result = await mermaid.render(`mermaid-${id}-${Date.now()}`, chart);
        if (active) {
          setSvg(result.svg);
          setError(null);
        }
      } catch (caughtError) {
        if (active) setError(caughtError instanceof Error ? caughtError.message : String(caughtError));
      }
    }

    void renderDiagram();
    return () => { active = false; };
  }, [chart, id]);

  if (error) {
    return (
      <div className="bg-[var(--surface-1)] p-6 rounded-lg border border-red-500/50 overflow-x-auto">
        <p className="text-red-400 font-mono text-sm mb-4">Diagram render error</p>
        <pre className="text-xs text-[var(--terminal-muted)] overflow-x-auto whitespace-pre-wrap">{chart}</pre>
      </div>
    );
  }

  if (!svg) {
    return <div className="min-h-72 grid place-items-center font-mono text-xs text-[var(--terminal-muted)]">RENDERING DIAGRAM…</div>;
  }

  return (
    <div
      className="bg-[var(--surface-1)] p-6 rounded-lg border border-[var(--border-default)] overflow-x-auto"
      data-diagram-id={id}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
