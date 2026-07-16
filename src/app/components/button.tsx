import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  children: React.ReactNode;
}

export function Button({ variant = 'primary', children, className = '', ...props }: ButtonProps) {
  const baseClasses = 'group inline-flex min-h-11 items-center justify-center rounded-full px-5 py-2.5 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] transition-all duration-300 border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--electric-blue)] disabled:opacity-50';
  
  const variantClasses = {
    primary: 'bg-[var(--electric-blue)] text-[#090b12] border-[var(--electric-blue)] hover:-translate-y-0.5 hover:bg-[#a5b5ff] hover:shadow-[0_14px_35px_rgba(104,126,255,0.28)]',
    secondary: 'bg-white/[0.035] border-[var(--border-strong)] text-[var(--terminal-text)] hover:-translate-y-0.5 hover:bg-white/[0.07] hover:border-[var(--electric-blue)]',
    ghost: 'bg-transparent border-transparent text-[var(--terminal-muted)] hover:text-white hover:bg-white/[0.05]'
  };
  
  return (
    <button 
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
