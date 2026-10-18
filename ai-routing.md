# AI model routing

> **AI AGENT INSTRUCTION:** Whenever a new change request is received, you must first read this file, identify the target files for the request, and switch to the cheapest approved model listed below before writing any code.

This is a static Astro site: there is no server and no stored data, so nothing here
can silently corrupt a record. What *can* go wrong is quieter and lands in production:
a dependency change that installs fine locally and breaks the clean install on Vercel
(the esbuild pin did exactly that), or a change to the transition / scroll orchestration
that only misbehaves after a View Transition navigation. The tiers below are weighted
for that: the toolchain and the shared animation plumbing route high regardless of how
small the diff is; copy and single-section styling route low.

## Models and effort

| Model | Effort | Use for |
|---|---|---|
| **Haiku 5.5** | default | Docs, copy and content in `site.ts`, brand-token values, static assets |
| **Sonnet 5.5** · medium | medium | One section component, its markup and scoped styles, one `global.css` block |
| **Sonnet 5.5** · high | high | The layout's GSAP / Lenis / View Transition orchestration, shared helpers in `src/lib/`, build and deploy config, anything spanning three or more files |
| **Opus 5.5** · high | high | Dependencies and the lockfile, `npm audit` handling, a production build that fails with no known cause |
| **Opus 5.5** · max | xhigh / max | The Astro 6 / Node 22 / Tailwind 4 migration, a stack or architecture change |

**How to switch.**
- **Session:** if the current model or effort is higher than needed, say so in one line and ask the user to switch with `/model`. If it's lower, stop and ask for the higher one before writing code.
- **Subagents:** set `model` (`haiku`, `sonnet` or `opus`) and `effort` on the agent call to match the table. Delegating cheap work this way is preferred over switching the whole session.

---

## Routing map

Paths are relative to the repo root. Where several rows match a file, the first one wins.

### Opus 5.5

| Path / pattern | Effort | Why |
|---|---|---|
| `package.json` `dependencies` / `devDependencies` / `overrides`, `package-lock.json` | high | Version ranges decide which esbuild native binary gets hoisted. A pin outside astro's declared range broke clean Vercel installs with bogus "Transforming destructuring … is not supported yet" errors. |
| `npm audit` triage, any advisory fix | high | The accepted advisories in `AGENTS.md` are a reasoned decision; `npm audit fix --force` installs Astro 6 and breaks the Node 20 toolchain. |
| A build that passes locally and fails on Vercel, or fails with no known cause | high | Usually a lockfile / native-binary / Node-version mismatch, not the code in the error message. |
| Migrating to Astro 6, Node ≥22.12, Tailwind 4 / `@tailwindcss/vite` | max | Drops `@astrojs/tailwind`, changes the config model and re-opens every accepted advisory. |
| Replacing a stack piece (router, scroll library, animation library, framework islands) | max | |

### Sonnet 5.5 · high

| Path / pattern |
|---|
| `src/layouts/Layout.astro` — the inline theme script (no flash on load), Lenis on the GSAP ticker, the global `data-parallax` handler, the `astro:*` page-transition lifecycle and ScrollTrigger cleanup |
| `src/lib/gsap.ts`, `src/lib/useReveal.ts` (shared by every Vue section) |
| `src/styles/global.css` — the disabled root View Transition, the `<noscript>` reveal rule, `@font-face`, base / theme variables |
| `astro.config.mjs`, `tailwind.config.mjs` structure (`content` paths, plugins, `darkMode`), `tsconfig.json` |
| `vercel.json` (build command, output directory, cache headers) |
| `package.json` `scripts` |
| `src/components/Preloader.astro` (runs on first paint and gates the hero intro) |

### Sonnet 5.5 · medium

| Path / pattern |
|---|
| One section: `src/components/` `Header.astro`, `Hero.astro`, `About.vue`, `Experiences.vue`, `Projects.vue`, `Contact.astro` |
| `src/components/MemojiDodge.vue` (self-contained canvas game) |
| A section-specific block in `src/styles/global.css` |
| `src/pages/index.astro` (section order, page `<head>` props) |
| A new field in `site.ts` that a component must render (e.g. `video`, `apk`) — together with that component |

### Haiku 5.5

| Path / pattern |
|---|
| `**/*.md` — `README.md`, `AGENTS.md`, `CLAUDE.md`, this file |
| Copy and content in `src/data/site.ts` using fields that already exist — about text, skills, experience bullets, project entries, links |
| Brand-token **values** in `tailwind.config.mjs` (a new token, or a change to how tokens are wired, is Sonnet · high) |
| `public/**` asset swaps — memoji images, favicon, the promo video and its poster (re-encoding or a new format is Sonnet · medium) |
| `.gitignore`, `src/env.d.ts`, a `package.json` `version` bump on its own |

**Generated, don't edit:** `.astro/` and `dist/`. They come from `astro sync` / `npm run build`.

---

## Cross-tier rules

1. **Highest wins.** A request touching several rows runs at the highest model and effort among them.
2. **Route on files, not wording.** List the target files first. "Make the project rows open faster" is Sonnet · medium (`Projects.vue`); "reveals stop firing after navigating back" is Sonnet · high (`Layout.astro`, `useReveal.ts`).
3. **The kind of change can only raise the level.**
   - Anything that changes **what npm installs** — a version range, an `overrides` entry, the lockfile, the Node version: **Opus**.
   - Anything that changes **what runs before first paint** — the inline theme script, the preloader, font loading: at least **Sonnet · high**.
   - Anything that touches **ScrollTrigger lifetimes, Lenis, or the `astro:*` events** from any file: at least **Sonnet · high**.
   - Anything that removes or weakens a **fallback** — `prefers-reduced-motion`, the `<noscript>` reveal, keyboard access to the accordions: at least **Sonnet · high**.
4. **Paired files go together.** A `site.ts` field and the component that renders it; a token in `tailwind.config.mjs` and the templates that use it; `package.json` and `package-lock.json` — one batch, at the higher of the two rows.
5. **Scope grows, stop.** If the work needs a higher row mid-task, say so and continue only at that level.
6. **Read-only work drops one level.** Questions, searches and explanations: Haiku, or Sonnet · medium for Opus areas. No code written.
7. **Reviews match the code**, one level up for Opus areas (high -> xhigh).
8. **Unsure, go one level up** and say why in one line.

## Rules that outrank this file

These come from `AGENTS.md` and apply at every tier:

- **Never run `npm audit fix --force`.** It installs Astro 6, which needs Node ≥22.12.
- **Never re-add an `overrides` pin for esbuild.** Let astro (`0.27.x`) and vite (`0.25.x`) each resolve their own.
- **Node 20.** Don't move the toolchain off Node 20 without the Astro 6 migration above.
- **Brand colours are tokens only** in templates; content lives in `src/data/site.ts`.
- **`npm run build` clean** before handing off. A dependency change also needs a fresh install (delete `node_modules`, then `npm install`) followed by a build, because Vercel installs from scratch (`vercel.json` `installCommand`).

---

_Adapted on 18 Oct 2026 from the ThrottlePath app's `ai-routing.md`; tiers and paths re-derived for this repo._
