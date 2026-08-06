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
          DEFAULT: '#060816',
          secondary: '#0B1020',
          tertiary: '#0F1629'
        },
        card: {
          DEFAULT: '#101827',
          hover: '#172238',
          border: 'rgba(255, 255, 255, 0.08)',
          highlight: 'rgba(255, 255, 255, 0.12)'
        },
        accent: {
          cyan: '#22D3EE',
          blue: '#3B82F6',
          purple: '#7C3AED',
          pink: '#C084FC',
          electric: '#6366F1'
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
        'gradient-accent': 'linear-gradient(135deg, #22D3EE 0%, #3B82F6 35%, #7C3AED 70%, #C084FC 100%)',
        'gradient-glow': 'radial-gradient(circle at 50% 0%, rgba(59, 130, 246, 0.15) 0%, rgba(124, 58, 237, 0.05) 50%, transparent 100%)',
        'gradient-card': 'linear-gradient(180deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.01) 100%)',
        'gradient-hero': 'radial-gradient(circle at 50% 20%, rgba(124, 58, 237, 0.2) 0%, rgba(34, 211, 238, 0.1) 40%, rgba(6, 8, 22, 0) 70%)',
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
