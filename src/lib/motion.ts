/* Shared reveal motion: one set of numbers for every section so the site moves
 * as one piece. Reveals play once (the ScrollTrigger fires `once`), never on the
 * way back up. The "reveal" ease is registered in ./gsap (cubic-bezier .2,.7,.1,1). */

/** Fade-up for [data-reveal] */
export const REVEAL = {
  from: { autoAlpha: 0, y: 40 },
  to: {
    autoAlpha: 1,
    y: 0,
    duration: 0.9,
    ease: "reveal",
    // Drop the residual inline transform so finished reveals don't keep a GPU layer
    clearProps: "transform",
  },
  /** Delay between siblings entering together */
  stagger: 0.07,
} as const;

/** Unmask (rise from behind a clipped edge) for [data-mask] > * lines.
 *  `y: 0` is required next to yPercent: the CSS pre-translates the lines and GSAP
 *  would otherwise keep that offset as pixels. */
export const MASK = {
  from: { yPercent: 110, y: 0 },
  to: { yPercent: 0, y: 0, duration: 1, ease: "reveal" },
  stagger: 0.07,
} as const;

/** ScrollTrigger defaults: tagged so Layout can kill them before a page swap; once only. */
export const trigger = (el: Element, start = "top 88%") => ({
  id: "reveal",
  trigger: el,
  start,
  once: true,
});
