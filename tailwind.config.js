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
        gov: {
          50: '#F0F5FA',
          100: '#E1EDF7',
          200: '#C2DCF0',
          300: '#8FBFE4',
          400: '#4F9CD3',
          500: '#1C7BC2',
          600: '#005FA8',
          700: '#003D7C', // UIDAI Primary Navy
          800: '#002856', // UIDAI Dark Navy
          900: '#001A3A',
          950: '#001026',
        },
        'gov-navy': {
          DEFAULT: '#003D7C',
          dark: '#002856',
          light: '#005FA8',
          deep: '#001A3A',
        },
        'gov-saffron': {
          DEFAULT: '#FF9933',
          dark: '#D97706',
          light: '#FFF3E0',
          border: '#FDBA74',
        },
        'gov-green': {
          DEFAULT: '#138808',
          dark: '#0E6006',
          light: '#E8F5E9',
          border: '#86EFAC',
        },
        'gov-ashoka': '#000080',
        'gov-surface': {
          DEFAULT: '#FFFFFF',
          alt: '#F4F6F9',
          border: '#D0D7DE',
          subtle: '#EAEFF5',
        },
        navy: {
          800: '#002856',
          900: '#001A3A',
          950: '#001026',
        },
        saffron: {
          50: '#FFF8E1',
          100: '#FFECB3',
          500: '#FF9933',
          600: '#E65100',
          700: '#BF360C',
        },
        risk: {
          low: '#138808',
          medium: '#D97706',
          high: '#EA580C',
          critical: '#DC2626',
        }
      },
      fontFamily: {
        sans: ['Noto Sans', 'Inter', 'Noto Sans Devanagari', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        devanagari: ['Noto Sans Devanagari', 'Noto Sans', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'gov-sm': '0 1px 2px 0 rgba(0, 40, 86, 0.05)',
        'gov': '0 1px 3px 0 rgba(0, 40, 86, 0.08), 0 1px 2px -1px rgba(0, 40, 86, 0.08)',
        'gov-md': '0 4px 6px -1px rgba(0, 40, 86, 0.08), 0 2px 4px -2px rgba(0, 40, 86, 0.08)',
        'gov-lg': '0 10px 15px -3px rgba(0, 40, 86, 0.08), 0 4px 6px -4px rgba(0, 40, 86, 0.08)',
        'gov-card': '0 0 0 1px #D0D7DE, 0 1px 3px rgba(0, 40, 86, 0.06)',
      }
    },
  },
  plugins: [],
}
