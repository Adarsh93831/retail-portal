/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fff8ec",
          100: "#ffe8c2",
          200: "#ffd691",
          300: "#ffc363",
          400: "#ffad2f",
          500: "#f18f01",
          600: "#cb7300",
          700: "#9f5803",
          800: "#7d460b",
          900: "#653b0f"
        }
      },
      boxShadow: {
        panel: "0 18px 60px -28px rgba(159, 88, 3, 0.35)"
      },
      borderRadius: {
        panel: "1.25rem"
      }
    }
  },
  plugins: [],
};
