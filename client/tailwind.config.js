/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
       colors: {
             'colorOne': '#FFFBDE',
             'colorTwo': '#90D1CA',
             'colorThree': '#129990',
             'colorFour': '#096B68'
           },
    },
  },
  plugins: [],
}