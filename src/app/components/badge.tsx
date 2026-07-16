import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'blue' | 'green' | 'amber' | 'purple';
  className?: string;
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  const variantClasses = {
    default: 'bg-white/[0.035] text-[var(--terminal-muted)] border-[var(--border-default)]',
    blue: 'bg-[rgba(141,162,255,0.1)] text-[var(--electric-blue)] border-[rgba(141,162,255,0.28)]',
    green: 'bg-[rgba(101,230,180,0.09)] text-[var(--electric-green)] border-[rgba(101,230,180,0.28)]',
    amber: 'bg-[rgba(255,195,107,0.09)] text-[var(--amber)] border-[rgba(255,195,107,0.28)]',
    purple: 'bg-[rgba(189,140,255,0.09)] text-[var(--violet)] border-[rgba(189,140,255,0.28)]'
  };

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.12em] border ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
}
