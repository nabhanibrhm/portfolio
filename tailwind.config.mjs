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
        // Monochrome accent — theme-driven tonal grey (triples in global.css):
        // sage on the dark theme, mid-grey on light. Highlights "Nabhan" +
        // primary CTAs. No separate hue is introduced.
        accent: {
          DEFAULT: "rgb(var(--accent) / <alpha-value>)",
          soft: "rgb(var(--accent-soft) / <alpha-value>)",
          deep: "rgb(var(--accent-deep) / <alpha-value>)",
        },
        // SECONDARY: hover states + visual depth, one tone deeper than accent.
        secondary: {
          DEFAULT: "rgb(var(--secondary) / <alpha-value>)",
          soft: "rgb(var(--secondary-soft) / <alpha-value>)",
          deep: "rgb(var(--secondary-deep) / <alpha-value>)",
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
