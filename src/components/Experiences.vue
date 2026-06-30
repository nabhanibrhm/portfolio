<script setup lang="ts">
import { ref } from "vue";
import { experiences } from "../data/site";
import { useReveal } from "../lib/useReveal";

const rootEl = ref<HTMLElement | null>(null);
useReveal(rootEl);
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

      <ul class="index-list">
        <li
          v-for="(e, i) in experiences"
          :key="e.role + e.company"
          data-reveal
        >
          <div class="index-row">
            <span class="idx-num">0{{ i + 1 }}</span>
            <span class="idx-title">{{ e.role }}</span>
            <span class="idx-sub">{{ e.company }}</span>
            <span class="idx-meta">{{ e.period }}</span>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.index-list {
  border-top: 1px solid rgb(var(--fg) / 0.1);
}
.index-row {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.5rem 1.5rem;
  padding: 1.75rem 0;
  border-bottom: 1px solid rgb(var(--fg) / 0.1);
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
  color: rgb(var(--fg-faint));
}
.idx-title {
  font-size: clamp(1.5rem, 3.2vw, 2.5rem);
  font-weight: 500;
  letter-spacing: -0.02em;
  transition: color 0.4s ease;
}
.index-row:hover .idx-title {
  color: rgb(var(--accent));
}
.idx-sub {
  color: rgb(var(--fg-muted));
  margin-left: auto;
}
.idx-meta {
  font-family: "Satoshi", ui-monospace, monospace;
  font-size: 0.8rem;
  color: rgb(var(--fg-faint));
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
</style>
