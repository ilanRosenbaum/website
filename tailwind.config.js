module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        'mono': ['"Courier New"', 'monospace'],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
