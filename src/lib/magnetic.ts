/* Subtle magnetic pull for primary filled CTAs (`[data-magnetic]`): the button
 * drifts a few px toward the pointer while it is over it. Fine pointers only,
 * never under reduced motion, never on keyboard focus (it follows the pointer
 * only). Uses the individual `translate` property so it composes with the
 * `.btn` / hero-btn hover lift, which uses `transform`. Delegated listeners on
 * the document: nothing to re-init or clean up across View Transitions. */

const MAX_PX = 6;
const STRENGTH = 0.25; // fraction of the pointer's offset from the centre

const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

function target(e: PointerEvent): HTMLElement | null {
  if (e.pointerType !== "mouse" || !fine.matches || reduce.matches) return null;
  return (e.target as HTMLElement).closest?.<HTMLElement>("[data-magnetic]") ?? null;
}

const clamp = (n: number) => Math.max(-MAX_PX, Math.min(MAX_PX, n));

document.addEventListener(
  "pointermove",
  (e) => {
    const el = target(e);
    if (!el) return;
    const r = el.getBoundingClientRect();
    const dx = clamp((e.clientX - (r.left + r.width / 2)) * STRENGTH);
    const dy = clamp((e.clientY - (r.top + r.height / 2)) * STRENGTH);
    el.style.translate = `${dx.toFixed(1)}px ${dy.toFixed(1)}px`;
  },
  { passive: true },
);

document.addEventListener(
  "pointerout",
  (e) => {
    const el = (e.target as HTMLElement).closest?.<HTMLElement>("[data-magnetic]");
    if (el && !el.contains(e.relatedTarget as Node | null)) el.style.translate = "";
  },
  { passive: true },
);
