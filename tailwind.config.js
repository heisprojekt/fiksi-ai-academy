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
          DEFAULT: '#08090E',
          secondary: '#0D0F18',
          tertiary: '#121420'
        },
        card: {
          DEFAULT: '#121420',
          hover: '#181B2B',
          border: 'rgba(255, 255, 255, 0.07)',
          highlight: 'rgba(255, 255, 255, 0.12)'
        },
        accent: {
          DEFAULT: '#8B5CF6',
          hover: '#7C3AED',
          light: '#A78BFA',
          soft: '#DDD6FE',
          purple: '#8B5CF6',
          pink: '#A78BFA',
          cyan: '#A78BFA',
          blue: '#7C3AED',
          electric: '#8B5CF6'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
        '4xl': '32px'
      },
      backgroundImage: {
        'gradient-accent': 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)',
        'gradient-glow': 'radial-gradient(circle at 50% 0%, rgba(139, 92, 246, 0.12) 0%, transparent 70%)',
        'gradient-card': 'linear-gradient(180deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%)',
        'gradient-hero': 'radial-gradient(circle at 50% 10%, rgba(139, 92, 246, 0.15) 0%, rgba(8, 9, 14, 0) 70%)',
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
