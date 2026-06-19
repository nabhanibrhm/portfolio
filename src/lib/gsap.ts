/* Central GSAP entry. Importing this anywhere guarantees ScrollTrigger is
 * registered exactly once (registerPlugin is idempotent). The window guard
 * keeps it safe to import during Astro's SSR pass. */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };
