/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#C65D3A",       // Burnt Terracotta
        secondary: "#E6D3B3",     // Warm Sand
        accent: "#D4A373",        // Muted Gold
        background: "#FAF6F0",    // Cream White
        card: "#F3E9DC",          // Soft Beige
        text: "#3B2F2F",          // Dark Cocoa
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
}
