/* Scroll-reveal composable shared by the Vue sections.
 * Animates two patterns within a section as it enters the viewport:
 *   [data-reveal]      → fade + slide up
 *   [data-mask] > *    → "unmask" (slide up from behind a clipped edge)
 *
 * Each component owns its own gsap.context, so its ScrollTriggers are reverted
 * cleanly on unmount (which is what View Transitions trigger on navigation).
 * GSAP is imported dynamically to stay out of Astro's SSR pass. */
import { onBeforeUnmount, onMounted, type Ref } from "vue";

export function useReveal(rootEl: Ref<HTMLElement | null>) {
  let ctx: { revert: () => void } | null = null;

  onMounted(async () => {
    const el = rootEl.value;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      el.querySelectorAll<HTMLElement>("[data-reveal]").forEach(
        (n) => (n.style.opacity = "1"),
      );
      el.querySelectorAll<HTMLElement>("[data-mask] > *").forEach(
        (n) => (n.style.transform = "none"),
      );
      return;
    }

    const { gsap, ScrollTrigger } = await import("./gsap");

    ctx = gsap.context((self) => {
      const masks = self.selector!("[data-mask] > *");
      const reveals = self.selector!("[data-reveal]");

      if (masks.length) {
        gsap.fromTo(
          masks,
          { yPercent: 110 },
          {
            yPercent: 0,
            duration: 1,
            ease: "power4.out",
            stagger: 0.1,
            scrollTrigger: { trigger: el, start: "top 78%" },
          },
        );
      }

      if (reveals.length) {
        gsap.fromTo(
          reveals,
          { autoAlpha: 0, y: 40 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.07,
            // Drop residual inline transform so finished reveals don't keep a
            // GPU layer (mobile repaint/ghosting source).
            clearProps: "transform",
            scrollTrigger: { trigger: el, start: "top 72%" },
          },
        );
      }
    }, el);

    ScrollTrigger.refresh();
  });

  onBeforeUnmount(() => ctx?.revert());
}
