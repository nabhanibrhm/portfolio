# Portfolio — Astro + Vue + Tailwind + GSAP

Awwwards-style minimalist portfolio for Luthfi Nabhan Ibrahim. Migrated from
Next.js/React/Three.js to a static Astro site.

## Stack

- **Astro 5** (static output) with `<ClientRouter />` View Transitions
- **Vue 3** islands for interactive sections (`@astrojs/vue`)
- **Tailwind CSS 3** via `@astrojs/tailwind` — brand palette lives in `tailwind.config.mjs`
- **GSAP 3** (`ScrollTrigger`) for page transitions, scroll reveals, parallax
- **Lenis** for smooth scroll, driven by the GSAP ticker

> Node 20 required (Astro 5). Astro 6 needs Node >=22.12 and drops `@astrojs/tailwind`.

## Conventions

- **Brand colors are tokens only.** Use `bg-accent`, `text-foreground`, etc. from
  `tailwind.config.mjs`; never hardcode hex in templates. (`.vue` scoped `<style>`
  blocks use raw hex to avoid relying on Tailwind processing inside SFC styles.)
- **Content** is centralized in `src/data/site.ts` — edit copy/projects there.
- **Reveals**: add `data-reveal` (fade-up) or wrap a line in `data-mask` (unmask).
  Vue sections animate these via `src/lib/useReveal.ts`; Astro sections (Hero,
  Contact) run their own small GSAP script. A `<noscript>` rule reveals everything
  if JS is off.
- **Parallax**: add `data-parallax="0.2"` (fraction of travel) to any element; the
  global handler in `Layout.astro` wires the ScrollTrigger.
- **GSAP import**: `src/lib/gsap.ts` registers ScrollTrigger once. In `.vue` files
  import it dynamically inside `onMounted` (keeps it out of the SSR pass).

## Page transitions

`Layout.astro` drives a GSAP fade/slide on `#swap-root` via the `astro:*`
lifecycle events. The built-in root View Transition animation is disabled in
`global.css` so the two don't fight.

## Security / npm audit

`npm audit` reports **3 Astro-core advisories** (XSS via `define:vars` / slot name /
spread props; server-island replay; host-header SSRF). These are **knowingly
accepted**:

- They are only patched in **Astro 6**, which requires **Node ≥22.12** (this project
  targets Node 20). `5.18.2` is the latest Astro 5 — no 5.x patch exists.
- None are reachable here: static output (no runtime server → no SSRF), no
  `server:defer` islands, and no untrusted input flows through `define:vars`,
  dynamic slot names, or spread-prop attribute names. Content is hardcoded in
  `src/data/site.ts`.

**Do NOT run `npm audit fix --force`** — it force-installs Astro 6 and breaks the
Node 20 toolchain. Revisit when moving to Node 22 (then migrate to Astro 6 +
Tailwind 4 / `@tailwindcss/vite`), or if Astro backports fixes to 5.x.

`npm audit` also reports the **esbuild dev-server advisory** (GHSA-g7r4-m6w7-qqqr,
arbitrary file read via the dev server on Windows; affects `0.27.3`–`0.28.0`, which
is astro 5.18.2's declared range → `0.27.7`). This is **knowingly accepted**: it is
dev-server-only and Windows-only, so it is unreachable in the static production
build (Vercel/Linux, no dev server exposed).

**Do NOT re-add an `overrides` pin for esbuild** (e.g. `esbuild@0.28.1`). The pin
was removed because forcing esbuild outside astro's declared `^0.27.3` range hoists
a mismatched native binary that Vite's own `esbuild@0.25.x` JS wrapper then loads,
breaking clean installs (Vercel) with bogus "Transforming destructuring … is not
supported yet" errors. Let astro (`0.27.x`) and vite (`0.25.x`) each resolve their
own tested esbuild.

## Commands

- `npm run dev` — dev server
- `npm run build` — static build to `dist/`
- `npm run preview` — preview the build
