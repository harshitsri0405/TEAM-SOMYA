/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        base: {
          950: '#f4f5f7',
          900: '#ffffff',
          850: '#ffffff',
          800: '#f1f2f5',
          700: '#e7e9ee',
          600: '#d6d9e0',
          border: '#e5e7eb'
        },
        risk: {
          veryhigh: '#dc2626',
          high: '#ea9c1a',
          moderate: '#eab308',
          low: '#16a34a',
          verylow: '#94a3b8'
        },
        accent: {
          blue: '#2563eb',
          teal: '#0d9488'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      }
    }
  },
  plugins: []
};