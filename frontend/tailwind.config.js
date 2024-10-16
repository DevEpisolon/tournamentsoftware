/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'tourney-navy1': '#2D3250',
        'tourney-navy2': '#424769',
        'tourney-navy3': '#7077A1',
        'tourney-orange': '#F6B17A',
      },
    },
  },
  plugins: [],
}
