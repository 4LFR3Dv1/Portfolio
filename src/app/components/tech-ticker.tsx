import React, { useEffect, useRef } from 'react';

export function TechTicker() {
  const technologies = [
    'SCROLL L2', 'SOLIDITY', 'CYTHON', 'ELECTRON', 'FLASK',
    'REDIS PUB/SUB', 'DEEP LINKS', 'WALLETCONNECT', 'SIWE',
    'POSTGRES', 'DOCKER', 'K8S', 'VITE', 'TAILWIND', 'REACT'
  ];

  const tickerRef = useRef<HTMLDivElement>(null);

  // Duplicate array for seamless loop
  const allTechs = [...technologies, ...technologies];

  return (
    <div className="relative w-full overflow-hidden border-y border-[var(--border-default)] bg-[var(--surface-2)] py-4">
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[var(--surface-2)] to-transparent z-10"></div>
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[var(--surface-2)] to-transparent z-10"></div>

      <div
        ref={tickerRef}
        className="flex gap-8 animate-scroll"
        style={{
          animation: 'scroll 30s linear infinite'
        }}
      >
        {allTechs.map((tech, idx) => (
          <React.Fragment key={idx}>
            <span
              className="font-mono text-sm uppercase tracking-wider whitespace-nowrap flex-shrink-0"
              style={{ color: 'var(--terminal-muted)' }}
            >
              {tech}
            </span>
            {idx < allTechs.length - 1 && (
              <span className="text-[var(--electric-blue)]">•</span>
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
