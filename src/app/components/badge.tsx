import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'blue' | 'green' | 'amber' | 'purple';
  className?: string;
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  const variantClasses = {
    default: 'bg-[var(--surface-2)] text-[var(--terminal-muted)] border-[var(--border-default)]',
    blue: 'bg-[rgba(0,217,255,0.1)] text-[var(--electric-blue)] border-[var(--electric-blue)]',
    green: 'bg-[rgba(0,255,136,0.1)] text-[var(--electric-green)] border-[var(--electric-green)]',
    amber: 'bg-[rgba(255,170,0,0.1)] text-[var(--amber)] border-[var(--amber)]',
    purple: 'bg-[rgba(168,85,247,0.1)] text-[#a855f7] border-[#a855f7]'
  };

  return (
    <span className={`inline-block px-2 py-1 font-mono text-[10px] uppercase tracking-wider border ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
}
