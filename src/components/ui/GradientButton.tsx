import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface GradientButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'gradient' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  icon?: React.ReactNode;
}

export const GradientButton: React.FC<GradientButtonProps> = ({
  children,
  variant = 'gradient',
  size = 'md',
  className,
  icon,
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-3.5 py-1.5 text-xs font-medium rounded-xl gap-1.5',
    md: 'px-5 py-2.5 text-sm font-semibold rounded-2xl gap-2',
    lg: 'px-7 py-3.5 text-base font-bold rounded-2xl gap-2.5',
  };

  const variantClasses = {
    gradient: 'bg-gradient-accent text-white shadow-lg shadow-accent-purple/20 hover:shadow-accent-purple/40 hover:scale-[1.02] active:scale-[0.98]',
    secondary: 'bg-white/10 text-white hover:bg-white/15 border border-white/10 hover:border-white/20 hover:scale-[1.01] active:scale-[0.99]',
    ghost: 'bg-transparent text-slate-300 hover:text-white hover:bg-white/5',
    outline: 'bg-transparent text-accent-cyan border border-accent-cyan/30 hover:border-accent-cyan/60 hover:bg-accent-cyan/10'
  };

  return (
    <button
      className={twMerge(
        clsx(
          'inline-flex items-center justify-center transition-all duration-200 cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-accent-blue/50 disabled:opacity-50 disabled:pointer-events-none',
          sizeClasses[size],
          variantClasses[variant],
          className
        )
      )}
      {...props}
    >
      {children}
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
    </button>
  );
};
