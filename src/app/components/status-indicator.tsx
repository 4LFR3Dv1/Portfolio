import React from 'react';

interface StatusIndicatorProps {
  status: 'online' | 'offline' | 'warning' | 'error';
  label?: string;
}

export function StatusIndicator({ status, label }: StatusIndicatorProps) {
  const colors = {
    online: 'var(--status-online)',
    offline: 'var(--status-offline)',
    warning: 'var(--status-warning)',
    error: 'var(--status-error)'
  };
  
  return (
    <div className="flex items-center gap-2">
      <div 
        className="w-2 h-2 rounded-full animate-pulse" 
        style={{ backgroundColor: colors[status] }}
      ></div>
      {label && (
        <span className="font-mono text-xs uppercase tracking-wider" style={{ color: colors[status] }}>
          {label}
        </span>
      )}
    </div>
  );
}
