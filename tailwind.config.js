/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './public/**/*.html',
    './src/**/*.{js,jsx,ts,tsx,vue}',
  ],
  theme: {
    fontFamily: {
      sans: ['Avenir', 'Helvetica', 'Arial', 'sans-serif'],
    },
    extend: {
      colors: {
        black: '#000000',
        white: '#FFFFFF',
        gold: '#B39700',
        grey: {
          light: '#C4C4C4',
          dark: '#444444'
        },
      },
      screens: {
        'xs': '481px',
      },
    },
  },
  plugins: [],
}

