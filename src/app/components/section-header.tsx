import React from 'react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  id?: string;
}

export function SectionHeader({ title, subtitle, id }: SectionHeaderProps) {
  return (
    <div className="mb-12" id={id}>
      <div className="flex items-center gap-4 mb-4">
        <div className="w-1 h-8 bg-[var(--electric-blue)]"></div>
        <h2 className="font-mono font-bold" style={{ color: 'var(--electric-blue)' }}>
          {title}
        </h2>
      </div>
      {subtitle && (
        <p className="text-base ml-8" style={{ color: 'var(--terminal-muted)' }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
