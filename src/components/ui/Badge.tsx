import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'gradient' | 'cyan' | 'purple' | 'pro' | 'new' | 'outline' | 'dark' | 'green' | 'amber';
  size?: 'sm' | 'md';
  className?: string;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'cyan',
  size = 'sm',
  className,
  icon,
}) => {
  const sizeClasses = {
    sm: 'px-2.5 py-0.5 text-[11px] font-medium tracking-wide',
    md: 'px-3 py-1 text-xs font-semibold tracking-wide',
  };

  const variantClasses = {
    gradient: 'bg-gradient-accent text-white shadow-sm',
    cyan: 'bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20',
    purple: 'bg-accent-purple/15 text-accent-pink border border-accent-purple/30',
    pro: 'bg-gradient-to-r from-accent-purple to-accent-pink text-white font-bold shadow-md shadow-accent-purple/20',
    new: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    green: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    amber: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
    outline: 'bg-white/5 text-slate-300 border border-white/10',
    dark: 'bg-[#0B1020] text-slate-300 border border-white/10'
  };

  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center gap-1.5 rounded-full backdrop-blur-md shrink-0 uppercase',
          sizeClasses[size],
          variantClasses[variant],
          className
        )
      )}
    >
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
      {children}
    </span>
  );
};
