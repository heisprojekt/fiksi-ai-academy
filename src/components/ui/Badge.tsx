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
    gradient: 'bg-gradient-to-r from-[#FF5500] to-[#E63600] text-white shadow-sm shadow-orange-500/25',
    orange: 'bg-orange-500/15 text-orange-400 border border-orange-500/30',
    cyan: 'bg-orange-500/10 text-orange-300 border border-orange-500/20',
    purple: 'bg-orange-500/15 text-orange-400 border border-orange-500/30',
    pro: 'bg-gradient-to-r from-[#FF5500] to-[#E63600] text-white font-extrabold shadow-sm shadow-orange-500/30',
    new: 'bg-orange-500/20 text-orange-300 border border-orange-500/40 font-black',
    green: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25',
    amber: 'bg-amber-500/10 text-amber-300 border border-amber-500/25',
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
