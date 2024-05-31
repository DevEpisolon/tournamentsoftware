module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'custom-border': '#F6B17A',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}

