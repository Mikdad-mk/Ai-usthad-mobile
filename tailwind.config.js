/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#fbf9f6",
        foreground: "#1e293b",
        card: "#ffffff",
        primary: "#d97706",
        "primary-foreground": "#fef3c7",
        secondary: "#f5f3f0",
        muted: "#f1ede8",
        accent: "#f59e0b",
        border: "#e7e0d8",
        amber: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
        },
        slate: {
          50: "#f8fafc",
          100: "#f1f5f9",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
        },
      },
    },
  },
  plugins: [],
}