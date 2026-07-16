export function TechTicker() {
  const groups = [
    { label: 'PRODUCT', techs: ['REACT', 'TYPESCRIPT', 'VITE', 'ELECTRON'] },
    { label: 'RUNTIME', techs: ['NODE.JS', 'GO', 'PYTHON', 'GRPC', 'SSE'] },
    { label: 'PROTOCOLS', techs: ['BITCOIN', 'LIQUID', 'LIGHTNING', 'SOLANA'] },
    { label: 'SYSTEMS', techs: ['EVENT SOURCING', 'AGENTS', 'POSTGRESQL', 'DOCKER'] },
  ];

  return (
    <section className="border-y border-[var(--border-subtle)] bg-[var(--surface-1)]" aria-label="Technology stack">
      <div className="max-w-[1600px] mx-auto px-6 py-4 flex flex-wrap gap-x-8 gap-y-3">
        {groups.map((group) => (
          <div key={group.label} className="flex flex-wrap items-center gap-2 font-mono text-[10px]">
            <span style={{ color: 'var(--electric-blue)' }}>{group.label}</span>
            <span style={{ color: 'var(--border-strong)' }}>//</span>
            {group.techs.map((tech) => <span key={tech} style={{ color: 'var(--terminal-muted)' }}>{tech}</span>)}
          </div>
        ))}
      </div>
    </section>
  );
}
