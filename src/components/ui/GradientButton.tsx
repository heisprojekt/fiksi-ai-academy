import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface GradientButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'gradient' | 'secondary' | 'ghost' | 'outline' | 'orange';
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
    gradient: 'bg-gradient-to-r from-[#FF5500] to-[#E63600] text-white shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:from-[#FF661A] hover:to-[#FF3D14] active:scale-[0.98]',
    orange: 'bg-[#FF4D00] text-white shadow-lg shadow-orange-500/30 hover:bg-[#FF5D14] active:scale-[0.98]',
    secondary: 'bg-white/[0.06] text-slate-200 hover:text-white hover:bg-white/[0.1] border border-white/10 hover:border-white/20 active:scale-[0.98]',
    ghost: 'bg-transparent text-slate-300 hover:text-white hover:bg-white/[0.05]',
    outline: 'bg-transparent text-orange-400 border border-orange-500/40 hover:border-orange-500 hover:bg-orange-500/10'
  };

  return (
    <button
      className={twMerge(
        clsx(
          'inline-flex items-center justify-center transition-all duration-200 cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-orange-500/40 disabled:opacity-50 disabled:pointer-events-none',
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
