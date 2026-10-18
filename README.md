# Luthfi Nabhan Ibrahim — Portfolio

Minimalist, editorial portfolio built with **Astro · Vue · Tailwind · GSAP**.

- Black / white / amber (`#000` ⇄ `#FFF`, accent `#FCA311`) with a light/dark toggle
  persisted in `localStorage` (no flash on load). Satoshi for type, Geist Mono for small
  uppercase metadata labels (both self-hosted)
- Oversized hero headline, sticky header with a scroll-progress line and a full-screen
  mobile menu
- About as a hairline bento: bio, "Currently", live Asia/Jakarta clock, a tap-to-play
  canvas mini-game, toolkit
- Experience as a one-open-at-a-time accordion with an always-visible summary
- Projects as a card grid with a featured ThrottlePath row (hover-play demo clip) that
  links to a case-study page (`/projects/throttlepath`) with a shared-element view transition
- Contact with copy-email + toast, social text links, ghost wordmark footer
- Astro View Transitions + GSAP reveals (shared motion constants), Lenis smooth scroll,
  a <= 1.2 s first-visit-per-session preloader; everything honours `prefers-reduced-motion`
  and the content is readable without JS

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
  data/site.ts            # all content (name, about, skills, experience, projects, contact)
  layouts/Layout.astro    # <head>, theme + preloader gates, View Transitions, GSAP/Lenis
  components/
    Header.astro          # sticky nav (home / project variants), scrollspy, mobile menu
    Preloader.astro       # first-visit counter (inline script, <= 1.2 s)
    Hero.astro            # headline, avatar row, CTAs, index bar
    About.astro           # bento; GameTile.vue + MemojiDodge.vue are the only island
    Experiences.vue       # accordion
    Projects.astro        # project grid + featured row
    Contact.astro         # headline, copy email, socials, toast
    Footer.astro          # home / project variants (+ ghost wordmark)
  lib/                    # gsap, motion (shared reveal constants), reveal (gate helpers), clock,
                          # magnetic, page (onPageLoad helper)
  pages/
    index.astro           # single-page site
    projects/[slug].astro # project detail pages (projects with a `detail` block)
```

Edit content in [`src/data/site.ts`](src/data/site.ts); brand tokens live in
[`tailwind.config.mjs`](tailwind.config.mjs) and [`src/styles/global.css`](src/styles/global.css).
