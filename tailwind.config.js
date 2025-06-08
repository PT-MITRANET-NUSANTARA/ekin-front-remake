/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      sans: ['Plus Jakarta Sans', 'arial', 'halvetica', ...defaultTheme.fontFamily.sans]
    },
    extend: {
      animation: {
        scroll: 'scroll 10s linear infinite',
        scroll2: 'scroll2 10s linear infinite'
      },
      keyframes: {
        scroll: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' }
        },
        scroll2: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0%)' }
        }
      },
    }
  },
  plugins: [],
}

