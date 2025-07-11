/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        hibiscus: {
          '50': '#fcf3f8',
          '100': '#fbe8f3',
          '200': '#f8d2e8',
          '300': '#f4add4',
          '400': '#ec7ab6',
          '500': '#e25299',
          '600': '#d03278',
          '700': '#c52567',
          '800': '#951f4f',
          '900': '#7d1e44',
          '950': '#4c0b25',
        },
      },
    },
  },
  plugins: [],
}
