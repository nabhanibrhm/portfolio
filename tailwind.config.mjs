/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      /* ---------------------------------------------------------------------
       * BRAND PALETTE (strict adherence)
       * Single source of truth — every component pulls from these tokens,
       * never raw hex. Overrides the old cream/black theme.
       * ------------------------------------------------------------------- */
      colors: {
        // #181818 — dark theme base
        background: {
          DEFAULT: "#181818",
          soft: "#1f1f1f", // raised surfaces / cards
          elevated: "#262626", // hover surfaces
        },
        // #F7F7F7 — high-contrast off-white
        foreground: {
          DEFAULT: "#F7F7F7",
          muted: "#a3a3a3", // secondary copy
          faint: "#6b6b6b", // tertiary / metadata
        },
        // #FF5722 — PRIMARY accent (orange): highlight "Nabhan" + primary CTAs
        accent: {
          DEFAULT: "#FF5722",
          soft: "#ff7a52",
          deep: "#e64a19",
        },
        // #673AB7 — SECONDARY accent (purple): hover states + visual depth
        secondary: {
          DEFAULT: "#673AB7",
          soft: "#8159d1",
          deep: "#512da8",
        },
      },
      fontFamily: {
        // Self-hosted variable Satoshi (see @font-face in global.css)
        sans: ["Satoshi", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
        mono: ["Satoshi", "ui-monospace", "monospace"],
      },
      letterSpacing: {
        tightest: "-0.04em",
        kicker: "0.3em",
      },
      maxWidth: {
        shell: "1600px",
        prose: "640px",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.22, 1, 0.36, 1)",
        "smooth-inout": "cubic-bezier(0.76, 0, 0.24, 1)",
      },
      keyframes: {
        "float-slow": {
          "0%, 100%": { transform: "translate3d(0, 0, 0)" },
          "50%": { transform: "translate3d(0, -18px, 0)" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "float-slow": "float-slow 7s ease-in-out infinite",
        marquee: "marquee 30s linear infinite",
      },
    },
  },
  plugins: [],
};
