# Portfolio — Astro + Vue + Tailwind + GSAP

Awwwards-style minimalist portfolio for Luthfi Nabhan Ibrahim. Migrated from
Next.js/React/Three.js to a static Astro site.

> **Model routing:** before writing code for any change request, read
> [`ai-routing.md`](ai-routing.md), list the target files and pick the tier it names.

## Stack

- **Astro 5** (static output) with `<ClientRouter />` View Transitions
- **Vue 3** islands for interactive sections (`@astrojs/vue`)
- **Tailwind CSS 3** via `@astrojs/tailwind` — brand palette lives in `tailwind.config.mjs`
- **GSAP 3** (`ScrollTrigger`) for page transitions and scroll reveals
- **Lenis** for smooth scroll, driven by the GSAP ticker

> Node 20 required (Astro 5). Astro 6 needs Node >=22.12 and drops `@astrojs/tailwind`.

## Conventions

- **Brand colors are tokens only.** Use `bg-accent`, `text-foreground`, etc. from
  `tailwind.config.mjs`; never hardcode hex in templates. (`.vue` scoped `<style>`
  blocks use raw hex to avoid relying on Tailwind processing inside SFC styles.)
- **Content** is centralized in `src/data/site.ts` — edit copy/projects there.
- **Reveals**: add `data-reveal` (fade-up) or wrap a line in `data-mask` (unmask).
  Every section (Hero, About, Experience, Projects, Contact, detail page) runs a small
  Astro-side GSAP script with the shared constants in `src/lib/motion.ts`, wrapped in
  `guard()` from `src/lib/reveal.ts` (if it throws, that section is shown un-animated).
  A `<noscript>` rule in `Layout.astro` reveals everything (and opens the accordion,
  shows nav links) if JS is off.
- **Reveal gate**: hidden states only apply under `html.reveal-on` (inline head script in
  `Layout.astro`; re-applied on `astro:after-swap`). It is dropped — content shows, no
  animations, preloader/scroll lock released — if GSAP never loads (script error, rejected
  import, or nothing ready 2.5 s after DOMContentLoaded); `lib/gsap.ts` sets `__revealReady`.
- **Parallax**: a `data-parallax="0.2"` handler still exists in `Layout.astro` but the
  minimal design uses none; don't add parallax stacks.
- **Theme tokens**: `--mute/--line/--chip/--tile/--ghost/--ring` (plain colours) plus
  the RGB triples; `.mono`, `.acc` (amber text on dark, black + amber underline on light —
  never use amber for text on white), `.ul`, `.wrap`, `.btn` are global helpers in `global.css`.
  `--chip` is tuned to >= 3:1 so outline buttons/chips meet WCAG 1.4.11.
- **Accessibility**: skip link + `<main id="swap-root" tabindex="-1">`, global `:focus-visible`
  ring, 44px tap targets, one `<h1>` per page, reduced-motion rule in `global.css`.
- **GSAP import**: `src/lib/gsap.ts` registers ScrollTrigger once. In `.vue` files
  import it dynamically inside `onMounted` (keeps it out of the SSR pass).

## Page transitions

`Layout.astro` drives a GSAP fade/slide on `#swap-root` via the `astro:*`
lifecycle events. The built-in root View Transition animation is disabled in
`global.css` so the two don't fight.

## Motion

- All reveals use the shared constants in `src/lib/motion.ts` (`REVEAL`, `MASK`, `trigger()`;
  ease `reveal` = cubic-bezier(.2,.7,.1,1), registered in `src/lib/gsap.ts`). They play once.
- The preloader runs only on the home page, first visit per browser session (flag
  `ln-preloaded` in sessionStorage, decided by an inline script in `Layout.astro`'s head),
  never with reduced motion; it takes <= 1.2 s. The hero waits for it only if it plays.
- `[data-magnetic]` (filled amber CTAs) gets a <= 6px pointer pull from `src/lib/magnetic.ts`.
- Fonts are preloaded and have metric-matched fallbacks (`Satoshi Fallback`, `Geist Mono Fallback`).

## About & Experience

- `About.astro` is a static bento fed by `site.ts` (`about`, `site.coordinates`, the `current`
  experience, `skills`); its only island is `GameTile.vue` (start/retry button + the
  `MemojiDodge.vue` canvas, which exposes `flap()`). The clock tile uses `[data-clock]`.
- `Experiences.vue` is the accordion (one open, first by default); each experience needs a
  `summary`, and `current`/`since` drive the amber rule and the "Currently" tile.

## Projects & detail pages

- `src/components/Projects.astro` renders the grid from `projects` in `site.ts`. A project
  with a `detail` block (+ `slug`) is the featured row and gets a static page at
  `/projects/<slug>` (`src/pages/projects/[slug].astro`); the others are non-link cards.
  Missing optional fields (`year`, `metric`, `summary`) simply don't render — see the
  `TODO(content)` comments in `site.ts`.
- The card media tile and the detail `<figure>` share a `transition:name` (`<slug>-media`,
  title `<slug>-title`) so they morph. `Layout.astro` skips its GSAP fade for those
  navigations (`morphNav`) and restores scroll position / `#hash` itself after swaps.
  Don't wrap named elements in `data-reveal`/opacity-0 containers.
- Scripts that belong to one page/section use `onPageLoad(rootId, fn)` from
  `src/lib/page.ts` (runs now *and* on `astro:page-load`), because a page's module can
  load after the event has fired. The Header is not persisted (it takes a `variant`).
- GSAP `[data-mask]` tweens must set `y: 0` alongside `yPercent` (the CSS pre-translates
  them, and GSAP would otherwise keep that offset as pixels).

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
