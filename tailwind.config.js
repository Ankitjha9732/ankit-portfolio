/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        base: '#050505',
        'base-2': '#09090b',
        surface: '#0c0c0f',
        ink: '#F5F5F5',
        muted: '#A1A1AA',
        line: '#1f1f24',
        linebright: '#2c2c33',
        violet: {
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8B5CF6',
          600: '#7c3aed',
          700: '#6D28D9',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        mono: ['"SUSE Mono"', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        metawide: '0.3em',
        meta: '0.2em',
        label: '0.14em',
      },
      boxShadow: {
        glowline: '0 0 24px rgba(139, 92, 246, 0.22)',
        basevignette: '0 30px 80px rgba(0,0,0,0.6)',
      },
    },
  },
  plugins: [],
}