import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  children: React.ReactNode;
}

export function Button({ variant = 'primary', children, className = '', ...props }: ButtonProps) {
  const baseClasses = 'px-4 py-2 font-mono text-xs uppercase tracking-wider transition-all duration-200 border';
  
  const variantClasses = {
    primary: 'bg-[var(--electric-blue)] text-[#0a0a0f] border-[var(--electric-blue)] hover:bg-[#00c4ea] hover:shadow-[0_0_20px_rgba(0,217,255,0.4)]',
    secondary: 'bg-transparent border-[var(--border-strong)] text-[var(--terminal-text)] hover:bg-[var(--surface-2)] hover:border-[var(--electric-blue)]',
    ghost: 'bg-transparent border-transparent text-[var(--terminal-muted)] hover:text-[var(--electric-blue)] hover:bg-[var(--surface-1)]'
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
