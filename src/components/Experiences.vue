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

<style scoped>
.index-list {
  border-top: 1px solid rgb(var(--fg) / 0.1);
}
.index-list > li {
  border-bottom: 1px solid rgb(var(--fg) / 0.1);
}
.index-row {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.5rem 1.5rem;
  width: 100%;
  padding: 1.75rem 0;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  color: inherit;
  font: inherit;
  transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}
@media (hover: hover) {
  .index-row:not(.is-open):hover {
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
.index-row:hover .idx-title,
.index-row.is-open .idx-title {
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
.idx-toggle {
  font-size: 1.5rem;
  line-height: 1;
  color: rgb(var(--fg-faint));
  transition:
    transform 0.4s cubic-bezier(0.22, 1, 0.36, 1),
    color 0.4s ease;
}
.index-row:hover .idx-toggle {
  color: rgb(var(--accent));
}
.index-row.is-open .idx-toggle {
  transform: rotate(45deg);
  color: rgb(var(--accent));
}

/* Collapsible panel — animate grid-template-rows for a measurement-free reveal */
.panel {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}
.panel.is-open {
  grid-template-rows: 1fr;
}
.panel-inner {
  overflow: hidden;
  min-height: 0;
}
.panel-content {
  padding: 0 0 2rem 3.5rem;
  opacity: 0;
  transform: translateY(8px);
  transition:
    opacity 0.4s ease 0.1s,
    transform 0.4s ease 0.1s;
}
.panel.is-open .panel-content {
  opacity: 1;
  transform: translateY(0);
}
.panel-desc {
  max-width: none;
  font-size: clamp(1rem, 1.6vw, 1.25rem);
  line-height: 1.6;
  color: rgb(var(--fg-muted));
}
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
@media (prefers-reduced-motion: reduce) {
  .panel,
  .panel-content,
  .index-row,
  .idx-toggle {
    transition: none;
  }
}
@media (max-width: 640px) {
  .index-row {
    display: grid;
    grid-template-columns: 2rem 1fr auto;
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
  .idx-toggle {
    grid-column: 3;
    grid-row: 1;
  }
  .panel-content {
    padding-left: 2.75rem;
  }
}
</style>
