/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Нейтральная премиальная база (тёплый сдвиг вместо чистого ч/б)
        ink: {
          50: '#FAF8F4',
          100: '#F2EFE8',
          200: '#E4DFD3',
          300: '#C9C1AE',
          400: '#948B77',
          500: '#635C4E',
          600: '#443F35',
          700: '#2E2A24',
          800: '#1F1C18',
          900: '#141311',
          950: '#0B0A09',
        },
        // Акцент — вышивальная (кимешек/жегде) палитра
        garnet: {
          50: '#FBEFF1',
          100: '#F5D6DC',
          200: '#E8A6B3',
          300: '#D6708A',
          400: '#BE4463',
          500: '#A31E3D',
          600: '#8A1833',
          700: '#6F132A',
          800: '#560F21',
          900: '#400B19',
        },
        gold: {
          50: '#FBF6E7',
          100: '#F5E9C0',
          200: '#EAD183',
          300: '#DEB94F',
          400: '#C9A227',
          500: '#AD8A1F',
          600: '#8C6F19',
          700: '#6C5513',
          800: '#4D3D0D',
          900: '#332908',
        },
        // Псевдонимы для постепенной миграции старых классов
        sand: {
          50: '#FAF8F4', 100: '#F2EFE8', 200: '#E4DFD3', 300: '#C9C1AE',
          400: '#DEB94F', 500: '#C9A227', 600: '#AD8A1F', 700: '#8C6F19',
          800: '#6C5513', 900: '#4D3D0D',
        },
        terracotta: {
          50: '#FBEFF1', 100: '#F5D6DC', 200: '#E8A6B3', 300: '#D6708A',
          400: '#BE4463', 500: '#A31E3D', 600: '#8A1833', 700: '#6F132A',
          800: '#560F21', 900: '#400B19',
        },
        deepblue: {
          50: '#F2EFE8', 100: '#E4DFD3', 200: '#C9C1AE', 300: '#948B77',
          400: '#635C4E', 500: '#443F35', 600: '#2E2A24', 700: '#1F1C18',
          800: '#141311', 900: '#0B0A09', 950: '#050505',
        },
      },
      fontFamily: {
        sans: ['Manrope', 'system-ui', 'sans-serif'],
        display: ['Unbounded', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        tightest: '-0.02em',
      },
      boxShadow: {
        subtle: '0 1px 2px rgba(20,19,17,.04)',
        medium: '0 1px 2px rgba(20,19,17,.04), 0 8px 24px rgba(20,19,17,.08)',
        elevated: '0 2px 4px rgba(20,19,17,.06), 0 16px 48px rgba(20,19,17,.14)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'fade-up': 'fadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
        'slow-zoom': 'slowZoom 20s ease-in-out infinite alternate',
        'pulse-ring': 'pulseRing 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slowZoom: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.1)' },
        },
        pulseRing: {
          '0%': { transform: 'scale(0.9)', opacity: '0.7' },
          '70%': { transform: 'scale(1.3)', opacity: '0' },
          '100%': { transform: 'scale(1.3)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
};
