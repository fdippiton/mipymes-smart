/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        tradewind: "#4CAF50",
        verdementa: "#1ABC9C",
      },
    },
    fontSize: {
      xs: "0.77rem",
      sm: "0.85rem",
      base: "1rem",
      xl: "1.25rem",
      "2xl": "1.563rem",
      "3xl": "1.953rem",
      "4xl": "2.441rem",
      "5xl": "3.052rem",
      "14xs": "0.875rem",
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
