# Luthfi Nabhan Ibrahim — Portfolio

Minimalist, Awwwards-leaning portfolio built with **Astro · Vue · Tailwind · GSAP**.

- Dark brand theme (`#181818` / `#F7F7F7`) with orange `#FF5722` + purple `#673AB7` accents
- SPA-like page transitions (Astro View Transitions + GSAP fade/slide)
- GSAP `ScrollTrigger` scroll reveals, parallax depth, Lenis smooth scroll
- Expanding accordions for Experience & Projects — click a row to reveal its
  description (bullet list or paragraph), tags, and an optional repo link

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
    Hero.astro          # "Nabhan" highlighted, parallax orbs, masked intro
    About.vue           # ScrollTrigger reveal, toolkit chips
    Experiences.vue     # accordion — expands to a bulleted list of highlights
    Projects.vue        # accordion — expands to description, tags, optional repo link
    Contact.astro       # social links + footer
  lib/                  # gsap.ts, useReveal.ts
  pages/
    index.astro         # single-page site
```

Edit content in [`src/data/site.ts`](src/data/site.ts); brand tokens live in
[`tailwind.config.mjs`](tailwind.config.mjs).
