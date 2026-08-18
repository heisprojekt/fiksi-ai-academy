import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverable?: boolean;
  glow?: boolean;
  className?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  hoverable = true,
  glow = false,
  className,
  ...props
}) => {
  return (
    <div
      className={twMerge(
        clsx(
          'relative rounded-2xl bg-white/90 dark:bg-[#13151D]/90 backdrop-blur-xl border border-slate-200/90 dark:border-white/[0.08] text-slate-800 dark:text-slate-100 shadow-sm dark:shadow-none overflow-hidden transition-all duration-300',
          hoverable && 'hover:bg-white dark:hover:bg-[#181B26] hover:border-cyan-500/50 dark:hover:border-cyan-500/40 hover:shadow-[0_16px_36px_-8px_rgba(15,23,42,0.08),0_0_24px_0_rgba(6,182,212,0.15)] dark:hover:shadow-[0_16px_36px_-8px_rgba(0,0,0,0.7),0_0_24px_0_rgba(6,182,212,0.15)] hover:-translate-y-0.5',
          glow && 'border-gradient-glow shadow-[0_0_35px_rgba(6,182,212,0.18)]',
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
};
