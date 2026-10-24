# AI model routing

> **AI AGENT INSTRUCTION:** Before a change, read this file, list the target files,
> and select the lowest approved tier for the active provider (Claude or OpenAI).
> Use the switching rules below; never claim a model switch that did not happen.

This is a static Astro site: there is no server and no stored data, so nothing here
can silently corrupt a record. What *can* go wrong is quieter and lands in production:
a dependency change that installs fine locally and breaks the clean install on Vercel
(the esbuild pin did exactly that), or a change to the transition / scroll orchestration
that only misbehaves after a View Transition navigation. The tiers below are weighted
for that: the toolchain and the shared animation plumbing route high regardless of how
small the diff is; copy and single-section styling route low.

## Models and effort

| Tier | Claude model / effort | OpenAI model / effort | Use for |
|---|---|---|---|
| T1 | Haiku 5.5 / default | GPT-6 Luna (`gpt-6-luna`) / low | Docs, copy and content in `site.ts`, brand-token values, static asset swaps |
| T2 | Sonnet 5.5 / medium | GPT-6.1 Sol (`gpt-6.1-sol`) / medium | One section component, markup and scoped styles, one `global.css` block, video creation or encoding |
| T3 | Sonnet 5.5 / high | GPT-6.1 Sol (`gpt-6.1-sol`) / high | GSAP / Lenis / View Transition orchestration, shared helpers, build and deploy config, changes spanning three or more files |
| T4 | Opus 5.5 / high | GPT-6 Astra (`gpt-6-astra`) / high | Dependencies and lockfile, audit handling, unexplained production build failures |
| T5 | Opus 5.5 / max | GPT-6 Astra (`gpt-6-astra`) / max | Astro 6 / Node 22 / Tailwind 4 migration, stack or architecture changes |

These are project routing choices, not claims of exact cross-provider equivalence
or pricing. OpenAI names and supported efforts were checked against the available
Codex host models on 25 Oct 2026. The efficiency-first approach follows
[OpenAI model-selection guidance](https://developers.openai.com/api/docs/guides/model-selection).
Use only models actually exposed by the current host; do not substitute invented IDs.
The Claude labels are retained from the original guide.

**How to switch.**
- **Session:** recommend the model and effort before implementation. If the current
  setting is higher, offer the lower setting without blocking authorized work.
  If it is lower than required, request the required setting before implementation;
  read-only investigation can continue. Use the app's model selector, or `/model`
  where supported. A recommendation does not change the running model.
- **Subagents:** this guide authorizes delegating a bounded implementation task to
  the listed provider model when model overrides are available. In Codex, use the
  exact ID above, `reasoning_effort`, and `fork_turns="none"`; include the task,
  target files, and applicable repository rules in the handoff. The parent reviews
  the result. Avoid delegation for trivial edits when coordination costs more.
- **Unavailable model:** report it and offer another available model at the same
  or higher tier. Do not block solely because the other provider is unavailable.
- **Routing-guide edits:** updating this guide is T1 and may be completed in the
  current session so outdated routing instructions do not block their own repair.

The Claude headings and shorthand below identify tiers for **both** providers:
Haiku = T1; Sonnet medium = T2; Sonnet high = T3; Opus high = T4;
Opus max = T5. Apply the OpenAI column when working in Codex/ChatGPT.

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
