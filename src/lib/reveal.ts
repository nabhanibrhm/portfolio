/* Reveal gate helpers. The pre-hidden states (opacity 0 / translated masks) only
 * exist while <html> has `reveal-on` (see global.css), which the inline head
 * script in Layout.astro sets and later *gives up* if GSAP never arrives. Per
 * section, `guard()` additionally makes sure that if the setup throws, that
 * section's elements end up visible. Plain DOM only in the fallback paths so
 * they work even when GSAP itself is what broke. */
import { gsap, ScrollTrigger } from "./gsap";
import { REVEAL, trigger } from "./motion";

/** False once the gate gave up (GSAP failed to load): skip animations, show everything. */
export const canReveal = () => (window as any).__revealOn !== false;

/** Force every reveal-hidden element under `root` visible (inline styles). */
export function showAll(root: ParentNode = document): void {
  root.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
    el.style.opacity = "1";
    el.style.visibility = "visible";
    el.style.transform = "none";
  });
  root.querySelectorAll<HTMLElement>("[data-mask] > *").forEach((el) => {
    el.style.transform = "none";
  });
}

/** Run a section's reveal setup; if the gate is off or the setup throws, leave its content visible. */
export function guard(rootOrId: Element | string, setup: (root: Element) => void): void {
  const root = typeof rootOrId === "string" ? document.getElementById(rootOrId) : rootOrId;
  if (!root) return;
  if (!canReveal()) {
    showAll(root);
    return;
  }
  try {
    setup(root);
  } catch (err) {
    console.error("[reveal] setup failed, showing content without animation", err);
    try {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.vars.id === "reveal" && t.trigger instanceof Node && root.contains(t.trigger)) t.kill();
      });
    } catch {
      /* ScrollTrigger itself may be what failed */
    }
    showAll(root);
  }
}

/** Generic once-per-element fade-up for every [data-reveal] in a section. */
export function revealItems(rootOrId: Element | string): void {
  guard(rootOrId, (root) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    root.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
      gsap.fromTo(el, REVEAL.from, { ...REVEAL.to, scrollTrigger: trigger(el, "top 90%") });
    });
    ScrollTrigger.refresh();
  });
}
