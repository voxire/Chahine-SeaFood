import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cs: {
          bg: "var(--cs-bg)",
          surface: "var(--cs-surface)",
          "surface-2": "var(--cs-surface-2)",
          "brand-navy": "var(--cs-brand-navy)",
          gold: "var(--cs-gold)",
          "gold-soft": "var(--cs-gold-soft)",
          text: "var(--cs-text)",
          "text-muted": "var(--cs-text-muted)",
          "accent-coral": "var(--cs-accent-coral)",
        },
      },
      borderRadius: {
        DEFAULT: "var(--cs-radius)",
        sm: "var(--cs-radius-sm)",
        pill: "var(--cs-radius-pill)",
      },
      transitionTimingFunction: {
        cs: "var(--cs-ease)",
        "cs-in": "var(--cs-ease-in)",
      },
      maxWidth: {
        container: "1280px",
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-sans-serif", "sans-serif"],
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        arabic: ["var(--font-arabic)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      spacing: {
        "section-y": "clamp(72px, 8vw, 120px)",
      },
    },
  },
  plugins: [],
};

export default config;
