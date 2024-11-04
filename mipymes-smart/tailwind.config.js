/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        tradewind: "#6ba8b3",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
