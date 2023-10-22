/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        mainColor: "#2563eb",
        secondaryColor: "#EEF2FF",
        thirdColor: "#f8fa ff",
        accentColor: "#7447EB",
      },
    },
  },
  plugins: [],
};
