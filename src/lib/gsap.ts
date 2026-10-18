/* Central GSAP entry. Importing this anywhere guarantees ScrollTrigger and the
 * shared "reveal" ease are registered exactly once (both are idempotent). The
 * window guard keeps it safe to import during Astro's SSR pass. */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, CustomEase);
  // cubic-bezier(.2,.7,.1,1): the single "expo-ish out" ease used by every reveal
  CustomEase.create("reveal", "M0,0 C0.2,0.7 0.1,1 1,1");
  // Tell the reveal gate (inline head script in Layout.astro) that GSAP really
  // loaded, so it won't give up and reveal everything without animation.
  (window as any).__revealReady = true;
}

export { gsap, ScrollTrigger };
