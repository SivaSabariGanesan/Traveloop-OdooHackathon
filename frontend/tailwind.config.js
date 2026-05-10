/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#C65D3A",
        secondary: "#E6D3B3",
        accent: "#D4A373",
        background: "#FAF6F0",
        card: "#F3E9DC",
        text: "#3B2F2F",
        "dark-bg": "#1C1612",
        "dark-card": "#2A211A",
        "dark-text": "#F0E6D3",
        "dark-border": "#3D2E22",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
}
