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
    gradient: 'bg-violet-500/15 text-violet-300 border border-violet-500/30',
    cyan: 'bg-violet-500/10 text-violet-300 border border-violet-500/20',
    purple: 'bg-violet-500/15 text-violet-300 border border-violet-500/30',
    pro: 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold shadow-sm shadow-violet-600/20',
    new: 'bg-violet-500/15 text-violet-300 border border-violet-500/30 font-bold',
    green: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    amber: 'bg-amber-500/10 text-amber-300 border border-amber-500/20',
    outline: 'bg-white/[0.04] text-slate-300 border border-white/10',
    dark: 'bg-[#0D0F18] text-slate-300 border border-white/10'
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
