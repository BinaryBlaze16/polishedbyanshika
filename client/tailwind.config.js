/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
        elegant: ['Cormorant Garamond', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        // Primary brand — Rose Gold
        rose: {
          50: '#FDF8F4',
          100: '#FAF0EA',
          200: '#F2DDD4',
          300: '#E8C4B8',
          400: '#D4A0A7',
          500: '#B76E79',
          600: '#A05A64',
          700: '#8B4F57',
          800: '#6E3A42',
          900: '#522B32',
          950: '#2E1519',
        },
        // Accent — Soft Gold
        gold: {
          50: '#FEF9F0',
          100: '#FDF0D9',
          200: '#FAE0B5',
          300: '#F0C987',
          400: '#E5B06A',
          500: '#C9956B',
          600: '#B07D52',
          700: '#926644',
          800: '#785339',
          900: '#634430',
          950: '#362218',
        },
        // Neutral — Cream / Linen
        linen: {
          50: '#FEFCFA',
          100: '#FDF8F4',
          200: '#F5EDE8',
          300: '#EAE0D8',
          400: '#D9C8B5',
          500: '#C7AA92',
          600: '#A87C61',
          700: '#8C6652',
          800: '#735446',
          900: '#5F453B',
          950: '#32231E',
        },
        // Dark base — Warm Charcoal
        dark: {
          50: '#F7F5F4',
          100: '#E8E3E0',
          200: '#D1C7C1',
          300: '#B5A69C',
          400: '#96847A',
          500: '#6B5347',
          600: '#5A4238',
          700: '#4A352C',
          800: '#3D2B1F',
          900: '#2E1F16',
          950: '#1A110C',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-luxury': 'linear-gradient(135deg, #FDF8F4 0%, #F5EDE8 50%, #FDF8F4 100%)',
        'gradient-rose': 'linear-gradient(135deg, #B76E79 0%, #D4A0A7 100%)',
        'gradient-gold': 'linear-gradient(135deg, #C9956B 0%, #E5B06A 100%)',
        'gradient-glass': 'linear-gradient(135deg, rgba(183,110,121,0.08), rgba(201,149,107,0.05))',
        'gradient-hero': 'linear-gradient(135deg, #FDF8F4 0%, #F5EDE8 30%, #FAF0EA 60%, #FDF8F4 100%)',
      },
      boxShadow: {
        'glow-rose': '0 4px 20px rgba(183, 110, 121, 0.2)',
        'glow-gold': '0 4px 20px rgba(201, 149, 107, 0.2)',
        'glass': '0 8px 32px 0 rgba(183, 110, 121, 0.08)',
        'luxury': '0 25px 50px -12px rgba(61, 43, 31, 0.15)',
        'card': '0 4px 20px rgba(61, 43, 31, 0.06)',
        'card-hover': '0 20px 40px rgba(183, 110, 121, 0.12)',
        'soft': '0 2px 12px rgba(61, 43, 31, 0.04)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'fade-up': 'fadeUp 0.6s ease-out',
        'slide-right': 'slideRight 0.4s ease-out',
        'slide-left': 'slideLeft 0.4s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 3s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideRight: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideLeft: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 10px rgba(183, 110, 121, 0.2)' },
          '50%': { boxShadow: '0 0 25px rgba(183, 110, 121, 0.5)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '3rem',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
