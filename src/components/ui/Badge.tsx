import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'gradient' | 'cyan' | 'purple' | 'pro' | 'new' | 'outline' | 'dark' | 'green' | 'amber' | 'orange';
  size?: 'sm' | 'md';
  className?: string;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'orange',
  size = 'sm',
  className,
  icon,
}) => {
  const sizeClasses = {
    sm: 'px-2.5 py-0.5 text-[10px] font-bold tracking-wider',
    md: 'px-3 py-1 text-xs font-bold tracking-wider',
  };

  const variantClasses = {
    gradient: 'bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 text-white shadow-sm shadow-cyan-500/25 font-black',
    cyan: 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/35',
    purple: 'bg-purple-500/15 text-purple-300 border border-purple-500/35',
    blue: 'bg-blue-500/15 text-blue-300 border border-blue-500/35',
    pink: 'bg-pink-500/15 text-pink-300 border border-pink-500/35',
    pro: 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-extrabold shadow-sm shadow-purple-500/30',
    new: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-black',
    green: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25',
    amber: 'bg-amber-500/10 text-amber-300 border border-amber-500/25',
    orange: 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/35',
    outline: 'bg-white/[0.04] text-slate-300 border border-white/10',
    dark: 'bg-[#12141C] text-slate-300 border border-white/10'
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
