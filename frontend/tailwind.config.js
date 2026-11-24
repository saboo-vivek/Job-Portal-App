/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./services/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          violet: '#6C5CE7',
          indigo: '#4338CA',
          cyan: '#38BDF8',
          dark: '#0B1020',
          darkSurface: '#121829',
          darkBorder: '#1E293B',
        },
        primary: {
          DEFAULT: '#6C5CE7',
          focus: '#5B4BC4',
          light: '#EEF0FD',
          dark: '#4D3DB5',
        },
        secondary: {
          DEFAULT: '#14B8A6',
          focus: '#0D9488',
          light: '#F0FDFA',
        },
        accent: {
          DEFAULT: '#38BDF8',
          focus: '#0284C7',
          light: '#F0F9FF',
          orange: '#F97316',
        },
        neutral: {
          DEFAULT: '#111827',
          secondary: '#64748B',
          border: '#E2E8F0',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          muted: '#F8FAFC',
          dark: '#121829',
        },
        border: {
          DEFAULT: '#E2E8F0',
          dark: '#1E293B',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(108, 92, 231, 0.08)',
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glow-violet': '0 0 25px -5px rgba(108, 92, 231, 0.3)',
        'glow-cyan': '0 0 25px -5px rgba(56, 189, 248, 0.3)',
        'interactive': '0 4px 14px 0 rgba(108, 92, 231, 0.08)',
        'interactive-lg': '0 12px 36px 0 rgba(108, 92, 231, 0.12)',
        'card-hover': '0 20px 40px -15px rgba(108, 92, 231, 0.12)',
      },
      animation: {
        'float-slow': 'float-slow 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
      },
      keyframes: {
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
