import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}", // ← must have this
    "./lib/**/*.{js,ts,jsx,tsx,mdx}", // ← must have this
    "./src/**/*.{js,ts,jsx,tsx,mdx}", // ← must have this
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
export default config;
