/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Rubik', 'sans-serif'],
        rubik: ['Rubik', 'sans-serif'],
      },
      colors: {
        navy: {
          DEFAULT: '#07070d',
          light: '#3a3b46',
          dark: '#25262f',
        },
        text: {
          light: '#c4c4c4',
          DEFAULT: '#949494',
          dark: '#767676',
        },
        accent: {
          light: '#5c5cde',
          DEFAULT: '#3c3abe',
          dark: '#2e2e94',
        },
        content: {
          DEFAULT: '#fcfcff',
          light: '#ffffff',
          dark: '#ebebef',
        },
      },
      animation: {
        'spin-slow': 'spin 20s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};