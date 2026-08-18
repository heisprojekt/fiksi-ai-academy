import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface GradientButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'gradient' | 'secondary' | 'ghost' | 'outline' | 'cyan' | 'purple';
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
    sm: 'px-3.5 py-1.5 text-xs font-bold rounded-xl gap-1.5',
    md: 'px-5 py-2.5 text-xs font-bold rounded-2xl gap-2 tracking-wide',
    lg: 'px-7 py-3.5 text-sm font-extrabold rounded-2xl gap-2.5 tracking-wide',
  };

  const variantClasses = {
    gradient: 'bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:from-cyan-400 hover:to-purple-500 active:scale-[0.98]',
    cyan: 'bg-[#06B6D4] text-white shadow-lg shadow-cyan-500/30 hover:bg-cyan-400 active:scale-[0.98]',
    purple: 'bg-[#7C3AED] text-white shadow-lg shadow-purple-500/30 hover:bg-purple-600 active:scale-[0.98]',
    secondary: 'bg-white/[0.06] text-slate-200 hover:text-white hover:bg-white/[0.1] border border-white/10 hover:border-white/20 active:scale-[0.98]',
    ghost: 'bg-transparent text-slate-300 hover:text-white hover:bg-white/[0.05]',
    outline: 'bg-transparent text-cyan-300 border border-cyan-500/40 hover:border-cyan-400 hover:bg-cyan-500/10'
  };

  return (
    <button
      className={twMerge(
        clsx(
          'inline-flex items-center justify-center transition-all duration-200 cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-cyan-500/40 disabled:opacity-50 disabled:pointer-events-none',
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
