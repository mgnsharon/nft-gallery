/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{tsx,jsx,js,ts}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Rubik", "sans-serif"],
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
