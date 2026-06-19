/* Composable powering the gallery-index hover interaction:
 * a single floating thumbnail that lerp-follows the cursor (GSAP quickTo) and
 * fades/scales in while a row is hovered. Shared by Experiences + Projects.
 *
 * GSAP is dynamically imported on mount so this never touches the DOM during
 * Astro's SSR pass. */
import { onBeforeUnmount, onMounted, ref } from "vue";

export function useHoverThumb() {
  const thumb = ref<HTMLElement | null>(null);
  const active = ref<number | null>(null);

  let xTo: ((v: number) => void) | null = null;
  let yTo: ((v: number) => void) | null = null;
  let g: typeof import("./gsap").gsap | null = null;
  let reduce = false;

  const onMove = (e: PointerEvent) => {
    xTo?.(e.clientX);
    yTo?.(e.clientY);
  };

  onMounted(async () => {
    reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !thumb.value) return;
    const mod = await import("./gsap");
    g = mod.gsap;
    g.set(thumb.value, { xPercent: -50, yPercent: -50, opacity: 0, scale: 0.8 });
    xTo = g.quickTo(thumb.value, "x", { duration: 0.55, ease: "power3" });
    yTo = g.quickTo(thumb.value, "y", { duration: 0.55, ease: "power3" });
    window.addEventListener("pointermove", onMove, { passive: true });
  });

  onBeforeUnmount(() => window.removeEventListener("pointermove", onMove));

  const enter = (i: number) => {
    active.value = i;
    if (!g || !thumb.value) return;
    g.to(thumb.value, { opacity: 1, scale: 1, duration: 0.45, ease: "power3.out" });
  };

  const leave = () => {
    active.value = null;
    if (!g || !thumb.value) return;
    g.to(thumb.value, { opacity: 0, scale: 0.8, duration: 0.3, ease: "power2.out" });
  };

  return { thumb, active, enter, leave };
}
