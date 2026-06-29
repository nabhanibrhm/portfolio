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
        // Neutral surfaces & text are theme-driven: the RGB triples live in
        // global.css (:root = dark default, html.light = light overrides). The
        // rgb(var() / <alpha-value>) form keeps Tailwind opacity modifiers
        // (bg-background/95, border-foreground/10, …) working.
        background: {
          DEFAULT: "rgb(var(--bg) / <alpha-value>)",
          soft: "rgb(var(--bg-soft) / <alpha-value>)", // raised surfaces / cards
          elevated: "rgb(var(--bg-elevated) / <alpha-value>)", // hover surfaces
        },
        foreground: {
          DEFAULT: "rgb(var(--fg) / <alpha-value>)",
          muted: "rgb(var(--fg-muted) / <alpha-value>)", // secondary copy
          faint: "rgb(var(--fg-faint) / <alpha-value>)", // tertiary / metadata
        },
        // #CB2957 — PRIMARY accent (crimson): highlight "Nabhan" + primary CTAs
        accent: {
          DEFAULT: "#CB2957",
          soft: "#e0476f", // lighter (derived)
          deep: "#a81f45", // darker (derived)
        },
        // SECONDARY (deep-crimson): hover states + visual depth — mono palette,
        // derived from the accent so no second hue is introduced.
        secondary: {
          DEFAULT: "#a81f45",
          soft: "#cb2957",
          deep: "#7d1733",
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
