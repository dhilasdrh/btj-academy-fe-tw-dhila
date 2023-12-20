/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      backgroundImage: {
        'custom-bg': "url('../src/img/bg.jpg')",
      },
      fontFamily: {
        sans: 'Inter var, sans-serif',
      },
      colors: {
        primary: {
          DEFAULT: '#4161d3',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};
