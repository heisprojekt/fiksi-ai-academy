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
    sm: { icon: 'w-7 h-7', text: 'text-lg', badge: 'text-[9px]' },
    md: { icon: 'w-9 h-9', text: 'text-xl', badge: 'text-[10px]' },
    lg: { icon: 'w-12 h-12', text: 'text-2xl', badge: 'text-[11px]' },
    xl: { icon: 'w-16 h-16', text: 'text-3xl', badge: 'text-xs' },
  };

  const currentSize = sizeMap[size];

  return (
    <div
      onClick={onClick}
      className={twMerge(
        clsx(
          'inline-flex items-center gap-3 select-none cursor-pointer group',
          className
        )
      )}
    >
      {/* 3D Ribbon 'F' Logo Icon */}
      <div className={`relative ${currentSize.icon} shrink-0 transition-transform duration-300 group-hover:scale-105`}>
        <svg
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_10px_20px_rgba(124,58,237,0.4)]"
        >
          <defs>
            {/* Top Cyan -> Blue Gradient */}
            <linearGradient id="fiksiTopGrad" x1="20" y1="20" x2="180" y2="90" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#22D3EE" />
              <stop offset="50%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#1D4ED8" />
            </linearGradient>

            {/* Bottom Purple -> Violet Gradient */}
            <linearGradient id="fiksiBottomGrad" x1="30" y1="90" x2="160" y2="180" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#E879F9" />
              <stop offset="40%" stopColor="#C084FC" />
              <stop offset="85%" stopColor="#7C3AED" />
              <stop offset="100%" stopColor="#4C1D95" />
            </linearGradient>

            {/* Top Gloss Highlight */}
            <linearGradient id="fiksiGloss" x1="50" y1="20" x2="150" y2="50" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </linearGradient>

            {/* Soft Shadow for Overlap Depth */}
            <filter id="ribbonShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="2" dy="6" stdDeviation="6" floodColor="#060816" floodOpacity="0.5" />
            </filter>
          </defs>

          {/* Top Swoosh/Bar of F (Cyan-Blue Curved Ribbon) */}
          <path
            d="M 62,32 
               C 85,28 135,28 172,28 
               C 178,28 182,34 179,40 
               C 172,52 145,62 105,62 
               C 85,62 68,75 62,94 
               C 62,75 62,48 62,32 Z"
            fill="url(#fiksiTopGrad)"
          />

          {/* Top Gloss Curve */}
          <path
            d="M 64,32 C 90,29 135,29 168,29 C 160,38 135,45 105,45 C 80,45 68,39 64,32 Z"
            fill="url(#fiksiGloss)"
          />

          {/* Bottom Swoosh/Bar of F (Purple-Violet Curved Ribbon with Fold Overlap) */}
          <path
            d="M 62,92 
               C 70,80 92,80 128,80 
               C 134,80 138,86 134,92 
               C 126,104 105,114 78,114 
               C 66,114 62,126 62,142 
               C 62,156 56,170 42,176 
               C 52,155 62,118 62,92 Z"
            fill="url(#fiksiBottomGrad)"
            filter="url(#ribbonShadow)"
          />

          {/* Inner Highlight on Bottom Fold */}
          <path
            d="M 62,92 C 75,82 100,82 126,82 C 112,92 90,100 75,100 C 65,100 62,95 62,92 Z"
            fill="#FFFFFF"
            fillOpacity="0.25"
          />
        </svg>
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className={`font-extrabold tracking-tight text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-accent transition-all ${currentSize.text}`}>
              FIKSI
            </span>
            <span className={`px-2 py-0.5 rounded-full font-extrabold uppercase bg-gradient-to-r from-accent-purple to-accent-pink text-white shadow-sm shadow-accent-purple/30 ${currentSize.badge}`}>
              AI ACADEMY
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
