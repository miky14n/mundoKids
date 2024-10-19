/** @type {import('tailwindcss').Config} */
const { nextui } = require("@nextui-org/react");
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        customPink: "#EAC5E4",
        customPurple: "#4A226E",
      },
      fontFamily: {
        sans: ["Chivo", "sans-serif"], // Aquí defines la fuente
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
};
