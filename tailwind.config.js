/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#69ae14',
        white: '#fff',
        black: '#222',
        grey1: '#3a3b3c',
        grey2: '#828282',
      },
      fontFamily: {
        sans: ['Open Sans', 'sans-serif'],
      },
      maxWidth: {
        '114': '114rem',
        '130': '130rem',
      },
      fontSize: {
        'base': '1.6rem',
        'xl': '1.8rem',
        '2xl': '2rem',
        '3xl': '3rem',
        '4xl': '4rem',
        '5xl': '5rem',
      },
      height: {
        '8': '8rem',
        '10': '10rem',
        '45': '45rem',
      },
      lineHeight: {
        '8': '8rem',
        '3': '3rem',
        '4.5': '4.5rem',
        '5': '5rem',
      },
    },
  },
  plugins: [],
}