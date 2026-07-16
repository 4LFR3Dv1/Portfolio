export function TechTicker() {
  const groups = [
    { label: 'PRODUCT', techs: ['REACT', 'TYPESCRIPT', 'VITE', 'ELECTRON'] },
    { label: 'RUNTIME', techs: ['NODE.JS', 'GO', 'PYTHON', 'GRPC', 'SSE'] },
    { label: 'PROTOCOLS', techs: ['BITCOIN', 'LIQUID', 'LIGHTNING', 'SOLANA'] },
    { label: 'SYSTEMS', techs: ['EVENT SOURCING', 'AGENTS', 'POSTGRESQL', 'DOCKER'] },
  ];

  return (
    <section className="mx-auto max-w-[1480px] px-6 lg:px-10" aria-label="Technology stack">
      <div className="flex flex-wrap gap-x-8 gap-y-4 border-y border-[var(--border-subtle)] bg-white/[0.02] px-5 py-5">
        {groups.map((group) => (
          <div key={group.label} className="flex flex-wrap items-center gap-2 font-mono text-[10px]">
            <span style={{ color: 'var(--electric-green)' }}>{group.label}</span>
            <span style={{ color: 'var(--border-strong)' }}>//</span>
            {group.techs.map((tech) => <span key={tech} className="border-l border-[var(--border-default)] px-2 py-1" style={{ color: 'var(--terminal-muted)' }}>{tech}</span>)}
          </div>
        ))}
      </div>
    </section>
  );
}
