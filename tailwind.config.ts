import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        surface: "#f7f8f5",
        ink: "#172033",
        leaf: "#2f7d5b",
        tomato: "#c74432",
        honey: "#c8891f"
      },
      boxShadow: {
        soft: "0 12px 30px rgba(23, 32, 51, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
