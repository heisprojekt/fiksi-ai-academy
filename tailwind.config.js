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
          highlight: 'rgba(255, 77, 0, 0.15)'
        },
        accent: {
          DEFAULT: '#FF4D00',
          hover: '#FF5F1A',
          light: '#FF7D40',
          soft: '#FFD9C7',
          dark: '#D93B00',
          orange: '#FF4D00',
          amber: '#FF8800',
          ember: '#FF3700',
          flame: '#FF5500',
          purple: '#FF4D00',
          cyan: '#FF7733',
          blue: '#FF4D00',
          pink: '#FF6036',
          electric: '#FF4D00'
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
        'gradient-accent': 'linear-gradient(135deg, #FF5500 0%, #E63600 100%)',
        'gradient-ember': 'linear-gradient(135deg, #FF6600 0%, #FF3700 50%, #CC2200 100%)',
        'gradient-glow': 'radial-gradient(circle at 50% 0%, rgba(255, 77, 0, 0.22) 0%, transparent 70%)',
        'gradient-card': 'linear-gradient(180deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.01) 100%)',
        'gradient-hero': 'radial-gradient(circle at 50% 0%, rgba(255, 77, 0, 0.25) 0%, rgba(11, 12, 16, 0) 70%)',
        'gradient-corner': 'radial-gradient(circle at 100% 0%, rgba(255, 77, 0, 0.15) 0%, transparent 50%)',
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
