/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      /* ---------------------------------------------------------------------
       * BRAND PALETTE (strict adherence) — exactly three base colours:
       * black #000000, amber #FCA311, white #FFFFFF. Everything else is a mix
       * of those. Single source of truth — every component pulls from these
       * tokens, never raw hex.
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
        // Amber accent #FCA311 (triples in global.css), the same in both themes.
        // Highlights "Nabhan" + primary CTAs. soft = toward white, deep = toward
        // black (hover/pressed). `on` = text/icons drawn on an amber fill: always
        // black, since white on amber is ~2:1.
        accent: {
          DEFAULT: "rgb(var(--accent) / <alpha-value>)",
          soft: "rgb(var(--accent-soft) / <alpha-value>)",
          deep: "rgb(var(--accent-deep) / <alpha-value>)",
          on: "rgb(var(--on-accent) / <alpha-value>)",
        },
        // Redesign tokens: plain-colour CSS variables (theme values in global.css).
        // No alpha modifier support — they already carry their own alpha.
        line: "var(--line)", // hairlines / dividers
        chip: "var(--chip)", // chip + tag borders
        tile: "var(--tile)", // bento / card surface
        ghost: "var(--ghost)", // oversized faint wordmark
        ring: "var(--ring)", // focus ring
        mute: "var(--mute)", // secondary text (== foreground-muted)
      },
      fontFamily: {
        // Self-hosted variable Satoshi (see @font-face in global.css)
        sans: ["Satoshi", "Satoshi Fallback", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
        // Self-hosted Geist Mono — small uppercase metadata labels only
        mono: ['"Geist Mono"', '"Geist Mono Fallback"', "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
    },
  },
  plugins: [],
};
