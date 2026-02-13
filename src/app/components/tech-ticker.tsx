import React from 'react';

export function TechTicker() {
  const groups = [
    { label: 'FRONTEND', techs: ['REACT', 'VITE', 'TAILWIND', 'ELECTRON'] },
    { label: 'BACKEND', techs: ['FLASK', 'POSTGRES', 'REDIS PUB/SUB'] },
    { label: 'WEB3', techs: ['SOLIDITY', 'SCROLL L2', 'WALLETCONNECT', 'SIWE'] },
    { label: 'INFRA', techs: ['DOCKER', 'K8S', 'DEEP LINKS', 'CYTHON'] },
  ];

  // Flatten into display items with group labels
  const items: { text: string; isLabel: boolean }[] = [];
  groups.forEach((group) => {
    items.push({ text: group.label, isLabel: true });
    group.techs.forEach((tech) => {
      items.push({ text: tech, isLabel: false });
    });
  });

  // Duplicate for seamless loop
  const allItems = [...items, ...items];

  return (
    <div className="relative w-full overflow-hidden border-y border-[var(--border-default)] bg-[var(--surface-2)] py-4">
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[var(--surface-2)] to-transparent z-10"></div>
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[var(--surface-2)] to-transparent z-10"></div>

      <div
        className="flex gap-6 items-center"
        style={{
          animation: 'scroll 40s linear infinite'
        }}
      >
        {allItems.map((item, idx) => (
          <React.Fragment key={idx}>
            {item.isLabel ? (
              <span
                className="font-mono text-[10px] uppercase tracking-widest whitespace-nowrap flex-shrink-0 px-2 py-0.5 border border-[var(--border-default)]"
                style={{ color: 'var(--electric-blue)' }}
              >
                {item.text}
              </span>
            ) : (
              <span
                className="font-mono text-sm uppercase tracking-wider whitespace-nowrap flex-shrink-0"
                style={{ color: 'var(--terminal-muted)' }}
              >
                {item.text}
              </span>
            )}
          </React.Fragment>
        ))}
      </div>

      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}
