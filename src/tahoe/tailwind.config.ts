import type { Config } from "tailwindcss";
import { fontSizes, layers } from "./app/lib/design-tokens";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "var(--font-sf)",
          "-apple-system",
          "BlinkMacSystemFont",
          "sans-serif",
        ],
        mono: ["var(--font-sf-mono)", "ui-monospace", "Menlo", "monospace"],
      },
      colors: {
        site: {
          bg: "var(--site-bg)",
          header: "var(--site-header)",
          surface: "var(--site-surface)",
          fg: "var(--site-fg)",
          muted: "var(--site-muted)",
          rule: "var(--site-rule)",
          accent: "var(--site-accent)",
        },
      },
      fontSize: fontSizes,
      zIndex: layers,
    },
  },
  plugins: [],
};
export default config;
