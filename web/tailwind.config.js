/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "theme-orange": "#ff6524",
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        ".selection-transparent::selection": {
          "background-color": "transparent",
        },
      });
    },
  ],
};
