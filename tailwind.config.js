/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#0B0C10',
          secondary: '#101218',
          tertiary: '#151720',
          canvas: '#0D0E13'
        },
        card: {
          DEFAULT: '#13151D',
          hover: '#181B26',
          border: 'rgba(255, 255, 255, 0.08)',
          highlight: 'rgba(6, 182, 212, 0.15)'
        },
        accent: {
          DEFAULT: '#06B6D4',
          hover: '#22D3EE',
          light: '#67E8F9',
          soft: '#CFFAFE',
          dark: '#0891B2',
          cyan: '#06B6D4',
          blue: '#3B82F6',
          purple: '#8B5CF6',
          violet: '#7C3AED',
          pink: '#EC4899',
          magenta: '#E879F9',
          electric: '#06B6D4'
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
        '4xl': '32px'
      },
      backgroundImage: {
        'gradient-accent': 'linear-gradient(135deg, #06B6D4 0%, #3B82F6 50%, #8B5CF6 100%)',
        'gradient-fiksi': 'linear-gradient(135deg, #22D3EE 0%, #3B82F6 40%, #8B5CF6 75%, #EC4899 100%)',
        'gradient-glow': 'radial-gradient(circle at 50% 0%, rgba(6, 182, 212, 0.22) 0%, rgba(139, 92, 246, 0.12) 50%, transparent 70%)',
        'gradient-card': 'linear-gradient(180deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.01) 100%)',
        'gradient-hero': 'radial-gradient(circle at 50% 0%, rgba(34, 211, 238, 0.20) 0%, rgba(124, 58, 237, 0.12) 50%, rgba(11, 12, 16, 0) 75%)',
        'gradient-corner': 'radial-gradient(circle at 100% 0%, rgba(6, 182, 212, 0.15) 0%, transparent 50%)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s infinite',
        'glow': 'glow 3s ease-in-out infinite alternate'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        glow: {
          '0%': { opacity: '0.4', filter: 'blur(20px)' },
          '100%': { opacity: '0.8', filter: 'blur(30px)' },
        }
      }
    },
  },
  plugins: [],
}
