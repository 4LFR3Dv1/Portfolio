import React from 'react';

export function TerminalTopBar() {
  const [metrics, setMetrics] = React.useState({ gas: 12, latency: 45 });

  React.useEffect(() => {
    const interval = setInterval(() => {
      setMetrics({
        gas: Math.floor(Math.random() * 5) + 10, // 10-15 gwei
        latency: Math.floor(Math.random() * 20) + 35 // 35-55ms
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full border-b border-[#1a1a24] bg-[#0a0a0f] sticky top-0 z-50">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Left */}
        <div className="flex items-center gap-4 sm:gap-6">
          <span className="font-mono text-xs sm:text-sm font-semibold tracking-wide" style={{ color: 'var(--electric-blue)' }}>
            RENAN MELO // PORTFOLIO
          </span>
        </div>

        {/* Center */}
        <div className="hidden md:flex items-center gap-6 font-mono text-xs" style={{ color: 'var(--terminal-muted)' }}>
          <span className="flex items-center gap-2">
            <span className="opacity-50">L2 GAS:</span>
            <span style={{ color: 'var(--electric-green)' }}>{metrics.gas} GWEI</span>
          </span>
          <span className="text-[#3a3a44]">|</span>
          <span className="flex items-center gap-2">
            <span className="opacity-50">NET:</span>
            <span style={{ color: 'var(--electric-blue)' }}>{metrics.latency}ms</span>
          </span>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3 sm:gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--status-online)' }}></div>
            <span className="hidden sm:inline font-mono text-xs uppercase tracking-wider" style={{ color: 'var(--terminal-muted)' }}>
              SYSTEM: <span style={{ color: 'var(--status-online)' }}>NOMINAL</span>
            </span>
          </div>
          <span className="hidden lg:block font-mono text-xs uppercase tracking-wider" style={{ color: 'var(--terminal-muted)' }}>
            SAO_PAULO
          </span>
        </div>
      </div>
    </div>
  );
}