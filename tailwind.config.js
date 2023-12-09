/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      variantConfiguration: ["responsive"],
      colors: {
        primary: "#e8ddcb",
      },
      fontFamily: {
        quranfont: ["QuranFont"],
        iranyekan: ["IranYekan"],
      },
    },
  },
  plugins: [],
};
