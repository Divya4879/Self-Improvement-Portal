// tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}", "./pages/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        purpleTheme: {
          light: "#D6BBFB",
          DEFAULT: "#8B5CF6",
          dark: "#5B21B6",
        },
      },
    },
  },
  plugins: [],
};

