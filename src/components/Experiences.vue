<script setup lang="ts">
import { computed, ref } from "vue";
import { experiences } from "../data/site";
import { useReveal } from "../lib/useReveal";
import { useHoverThumb } from "../lib/useHoverThumb";

const rootEl = ref<HTMLElement | null>(null);
useReveal(rootEl);

const { thumb, active, enter, leave } = useHoverThumb();
const current = computed(() =>
  active.value === null ? null : experiences[active.value],
);
</script>

<template>
  <section
    id="experience"
    ref="rootEl"
    class="anchor-offset relative py-20 md:py-40"
  >
    <div class="shell">
      <div class="mb-10 flex items-baseline justify-between md:mb-14">
        <h2 class="eyebrow" data-reveal>(02) — Experience</h2>
        <p class="eyebrow hidden md:block" data-reveal>
          {{ experiences.length }} roles
        </p>
      </div>

      <ul class="index-list" @pointerleave="leave">
        <li
          v-for="(e, i) in experiences"
          :key="e.role + e.company"
          data-reveal
        >
          <div class="index-row" @pointerenter="enter(i)">
            <span class="idx-num">0{{ i + 1 }}</span>
            <span class="idx-title">{{ e.role }}</span>
            <span class="idx-sub">{{ e.company }}</span>
            <span class="idx-meta">{{ e.period }}</span>
          </div>
        </li>
      </ul>
    </div>

    <!-- Cursor-tracked hover thumbnail -->
    <div ref="thumb" class="hover-thumb" aria-hidden="true">
      <div
        v-if="current"
        class="thumb-card"
        :class="current.accent === 'accent' ? 'is-accent' : 'is-secondary'"
      >
        <span class="thumb-kicker">{{ current.period }}</span>
        <span class="thumb-title">{{ current.company }}</span>
        <span class="thumb-desc">{{ current.description }}</span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.index-list {
  border-top: 1px solid rgba(238, 238, 238, 0.1);
}
.index-row {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.5rem 1.5rem;
  padding: 1.75rem 0;
  border-bottom: 1px solid rgba(238, 238, 238, 0.1);
  cursor: default;
  transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}
@media (hover: hover) {
  .index-row:hover {
    transform: translateX(14px);
  }
}
.idx-num {
  width: 2rem;
  font-family: "Satoshi", ui-monospace, monospace;
  font-size: 0.8rem;
  color: #888888;
}
.idx-title {
  font-size: clamp(1.5rem, 3.2vw, 2.5rem);
  font-weight: 500;
  letter-spacing: -0.02em;
  transition: color 0.4s ease;
}
.index-row:hover .idx-title {
  color: #cb2957;
}
.idx-sub {
  color: #dddddd;
  margin-left: auto;
}
.idx-meta {
  font-family: "Satoshi", ui-monospace, monospace;
  font-size: 0.8rem;
  color: #888888;
  min-width: 8.5rem;
  text-align: right;
}
@media (max-width: 640px) {
  .index-row {
    display: grid;
    grid-template-columns: 2rem 1fr;
    align-items: baseline;
    gap: 0.15rem 0.75rem;
    padding: 1.25rem 0;
  }
  .idx-num {
    grid-column: 1;
    grid-row: 1;
  }
  .idx-title {
    grid-column: 2;
    grid-row: 1;
    font-size: 1.5rem;
  }
  .idx-sub {
    grid-column: 2;
    grid-row: 2;
    margin-left: 0;
  }
  .idx-meta {
    grid-column: 2;
    grid-row: 3;
    min-width: 0;
    text-align: left;
  }
}

/* Floating thumbnail */
.hover-thumb {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 30;
  width: 320px;
  pointer-events: none;
}
.thumb-card {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1.5rem;
  border-radius: 1.25rem;
  color: #eeeeee;
  border: 1px solid rgba(238, 238, 238, 0.12);
  box-shadow: 0 30px 60px -20px rgba(0, 0, 0, 0.6);
}
.thumb-card.is-accent {
  background:
    radial-gradient(120% 120% at 0% 0%, rgba(203, 41, 87, 0.55), transparent 60%),
    #0d0d0d;
}
.thumb-card.is-secondary {
  background:
    radial-gradient(120% 120% at 0% 0%, rgba(168, 31, 69, 0.55), transparent 60%),
    #0d0d0d;
}
.thumb-kicker {
  font-family: "Satoshi", ui-monospace, monospace;
  font-size: 0.7rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(238, 238, 238, 0.7);
}
.thumb-title {
  font-size: 1.5rem;
  font-weight: 600;
  letter-spacing: -0.02em;
}
.thumb-desc {
  font-size: 0.85rem;
  line-height: 1.5;
  color: rgba(238, 238, 238, 0.75);
}
@media (hover: none) {
  .hover-thumb {
    display: none;
  }
}
</style>
