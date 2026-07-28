# Luthfi Nabhan Ibrahim — Portfolio

Minimalist, Awwwards-leaning portfolio built with **Astro · Vue · Tailwind · GSAP**.

- Warm monochrome theme (near-black `#141413` ⇄ cream `#e3e2c3`) with a tonal
  sage accent; light/dark toggle persisted in `localStorage` (no flash on load)
- SPA-like page transitions (Astro View Transitions + GSAP fade/slide)
- GSAP `ScrollTrigger` scroll reveals, parallax depth, Lenis smooth scroll
- Expanding accordions for Experience & Projects — click a row to reveal its
  description (bullet list or paragraph), tags, and an optional repo link
- A tap-to-play canvas mini-game tucked into the About portrait (`MemojiDodge`)

## Getting started

```bash
npm install
npm run dev      # http://localhost:4321
```

```bash
npm run build    # static output → dist/
npm run preview
```

> Requires **Node 20** (Astro 5).

## Structure

```
src/
  data/site.ts          # all content (name, about, skills, experience, projects)
  layouts/Layout.astro  # <head>, View Transitions, GSAP/Lenis orchestration
  components/
    Header.astro        # fixed nav, offset anchor scroll, scrollspy, mobile menu
    Preloader.astro     # first-visit counter intro
    Hero.astro          # masked grid backdrop, bouncing memoji, tagline + CTA
    About.vue           # ScrollTrigger reveal, toolkit chips, MemojiDodge game
    Experiences.vue     # accordion — expands to a bulleted list of highlights
    Projects.vue        # accordion — expands to description, tags, optional repo link
    Contact.astro       # social links + footer
  lib/                  # gsap.ts, useReveal.ts
  pages/
    index.astro         # single-page site
```

Edit content in [`src/data/site.ts`](src/data/site.ts); brand tokens live in
[`tailwind.config.mjs`](tailwind.config.mjs).
