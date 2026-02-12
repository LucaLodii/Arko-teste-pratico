/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Roboto', 'sans-serif'],
        mono: ['"Fira Code"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        sage: {
          50: '#F4F7F3',
          100: '#E6EFE4',
          200: '#D2E0CE',
          300: '#BDD0B8',
          400: '#ACC8A2',
          500: '#8EB382',
          600: '#729866',
          700: '#58764E',
          800: '#405639',
          900: '#2B3926',
        },
        olive: {
          50: '#F2F3F2',
          100: '#E0E3DF',
          200: '#C2C8C0',
          300: '#A3ADA0',
          400: '#859281',
          500: '#687764',
          600: '#4E5A4B',
          700: '#353E33',
          800: '#1F251E',
          900: '#1A2517',
        },
        scenario: {
          cash: '#58764E',
          financed: '#C89F65',
          rental: '#64748B',
        },
        status: {
          success: '#4F8A58',
          error: '#D65A5A',
          warning: '#E3A048',
          info: '#5B8C9B',
        }
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(26, 37, 23, 0.08)',
        'glow': '0 0 0 4px rgba(172, 200, 162, 0.3)',
      },
      animation: {
        'slide-down': 'slideDown 300ms cubic-bezier(0.87, 0, 0.13, 1)',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        slideDown: {
          from: { height: '0', opacity: '0' },
          to: { height: 'var(--radix-accordion-content-height)', opacity: '1' },
        },
        shimmer: {
          from: { backgroundPosition: '0 0' },
          to: { backgroundPosition: '-200% 0' },
        },
      },
    },
  },
  plugins: [],
}
