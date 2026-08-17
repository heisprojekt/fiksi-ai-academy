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
          'relative rounded-2xl bg-[#121420]/80 backdrop-blur-xl border border-white/[0.07] text-slate-100 overflow-hidden transition-all duration-300',
          hoverable && 'hover:bg-[#171A29]/90 hover:border-violet-500/30 hover:shadow-[0_12px_32px_-8px_rgba(0,0,0,0.6),0_0_20px_0_rgba(139,92,246,0.08)] hover:-translate-y-0.5',
          glow && 'border-gradient-glow shadow-[0_0_30px_rgba(139,92,246,0.12)]',
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
};
