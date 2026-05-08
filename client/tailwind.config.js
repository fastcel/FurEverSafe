/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#e12e92",
        secondary: "#bfb5a5",
        success: "#6abf45",
      },
    },
  },
  plugins: [],
};