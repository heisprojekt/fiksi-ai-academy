import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  onClick?: () => void;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showText = true,
  className,
  onClick,
}) => {
  const sizeMap = {
    sm: { icon: 'w-7 h-7', text: 'text-base', badge: 'text-[9px]' },
    md: { icon: 'w-8 h-8', text: 'text-lg', badge: 'text-[10px]' },
    lg: { icon: 'w-9 h-9', text: 'text-xl', badge: 'text-[10px]' },
    xl: { icon: 'w-11 h-11', text: 'text-2xl', badge: 'text-xs' },
  };

  const currentSize = sizeMap[size];

  return (
    <div
      onClick={onClick}
      className={twMerge(
        clsx(
          'inline-flex items-center gap-2.5 select-none cursor-pointer group',
          className
        )
      )}
    >
      {/* Official 3D Ribbon 'F' Logo Icon */}
      <div className={`relative ${currentSize.icon} shrink-0 flex items-center justify-center transition-transform duration-300 group-hover:scale-105`}>
        <img
          src="/fiksi.png"
          alt="FIKSI AI Academy Logo"
          className="w-full h-full object-contain max-h-full max-w-full drop-shadow-[0_4px_14px_rgba(6,182,212,0.4)]"
        />
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className={`font-black tracking-tight text-white transition-colors group-hover:text-cyan-300 ${currentSize.text}`}>
              FIKSI
            </span>
            <span className={`px-2 py-0.5 rounded-full font-black tracking-wider uppercase bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/40 text-cyan-300 ${currentSize.badge}`}>
              AI ACADEMY
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
