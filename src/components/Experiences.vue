<script setup lang="ts">
import { ref } from "vue";
import { experiences } from "../data/site";
import { useReveal } from "../lib/useReveal";

const rootEl = ref<HTMLElement | null>(null);
useReveal(rootEl);

// Accordion: index of the currently open role, or null when all closed.
const openIdx = ref<number | null>(null);
const toggle = (i: number) => {
  openIdx.value = openIdx.value === i ? null : i;
};
</script>

<template>
  <section
    id="experience"
    ref="rootEl"
    class="anchor-offset relative py-16 md:py-24"
  >
    <div class="shell">
      <div class="mb-10 flex items-baseline justify-between md:mb-14">
        <h2 class="eyebrow" data-reveal>(02) — Experience</h2>
        <p class="eyebrow hidden md:block" data-reveal>
          {{ experiences.length }} roles
        </p>
      </div>

      <ul class="index-list">
        <li
          v-for="(e, i) in experiences"
          :key="e.role + e.company"
          data-reveal
        >
          <button
            type="button"
            class="index-row group"
            :class="{ 'is-open': openIdx === i }"
            :aria-expanded="openIdx === i"
            :aria-controls="`experience-panel-${i}`"
            @click="toggle(i)"
          >
            <span class="idx-num">0{{ i + 1 }}</span>
            <span class="idx-title">{{ e.role }}</span>
            <span class="idx-sub">{{ e.company }}</span>
            <span class="idx-meta">{{ e.period }}</span>
            <span class="idx-toggle" aria-hidden="true">+</span>
          </button>

          <!-- Expanding panel: grid-rows 0fr→1fr for a smooth, JS-free height reveal -->
          <div
            :id="`experience-panel-${i}`"
            class="panel"
            :class="{ 'is-open': openIdx === i }"
            role="region"
          >
            <div class="panel-inner">
              <div class="panel-content">
                <ul v-if="Array.isArray(e.description)" class="panel-list">
                  <li v-for="(d, di) in e.description" :key="di">{{ d }}</li>
                </ul>
                <p v-else class="panel-desc">{{ e.description }}</p>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<!-- Shared accordion chrome (.index-list / .index-row / .idx-* / .panel*) lives
     in global.css. Only the bulleted-highlights styling is section-specific. -->
<style scoped>
.panel-list {
  display: grid;
  gap: 0.6rem;
  max-width: none;
}
.panel-list > li {
  position: relative;
  padding-left: 1.25rem;
  font-size: clamp(1rem, 1.6vw, 1.25rem);
  line-height: 1.55;
  color: rgb(var(--fg-muted));
}
/* Accent tick as the bullet marker */
.panel-list > li::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0.65em;
  width: 0.5rem;
  height: 1px;
  background: rgb(var(--accent));
}
</style>
