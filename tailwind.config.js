/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        base: '#050505',
        'base-2': '#080808',
        surface: '#0c0c0f',
        edge: '#1f1f24',
        edgebright: '#2c2c33',
        primary: {
          50: '#ede9fe',
          100: '#ddd6fe',
          200: '#c4b5fd',
          300: '#a78bfa',
          400: '#a78bfa',
          500: '#8B5CF6',
          600: '#7c3aed',
          700: '#6D28D9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        accent: {
          400: '#a78bfa',
          500: '#8B5CF6',
          600: '#7c3aed',
          700: '#6D28D9',
        },
        success: {
          500: '#10b981',
          600: '#059669',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        heading: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
        mitr: ['Mitr', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['4.25rem', { lineHeight: '1.05', fontWeight: '800' }],
        'display-lg': ['3.5rem', { lineHeight: '1.1', fontWeight: '800' }],
        display: ['2.25rem', { lineHeight: '1.2', fontWeight: '700' }],
        'heading-lg': ['1.875rem', { lineHeight: '1.3', fontWeight: '600' }],
        heading: ['1.5rem', { lineHeight: '1.4', fontWeight: '600' }],
        'body-lg': ['1.125rem', { lineHeight: '1.7', fontWeight: '400' }],
        body: ['1rem', { lineHeight: '1.7', fontWeight: '400' }],
        'body-sm': ['0.875rem', { lineHeight: '1.6', fontWeight: '400' }],
      },
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
        30: '7.5rem',
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        soft: '0 10px 40px rgba(0, 0, 0, 0.5)',
        card: '0 18px 60px rgba(0, 0, 0, 0.6)',
        glow: '0 0 40px rgba(139, 92, 246, 0.16), 0 0 0 1px rgba(139, 92, 246, 0.12)',
        'glow-lg': '0 0 60px rgba(139, 92, 246, 0.28), 0 0 0 1px rgba(139, 92, 246, 0.2)',
        'inner-soft': 'inset 0 1px 0 rgba(255, 255, 255, 0.04)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'scale-in': 'scaleIn 0.3s ease-out',
        'float-soft': 'floatSoft 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        floatSoft: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
}
