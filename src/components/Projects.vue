<script setup lang="ts">
import { ref } from "vue";
import { projects } from "../data/site";
import { useReveal } from "../lib/useReveal";

const rootEl = ref<HTMLElement | null>(null);
useReveal(rootEl);

// Accordion: index of the currently open project, or null when all closed.
const openIdx = ref<number | null>(null);
const toggle = (i: number) => {
  openIdx.value = openIdx.value === i ? null : i;
};
</script>

<template>
  <section id="work" ref="rootEl" class="anchor-offset relative py-16 md:py-24">
    <div class="shell">
      <div class="mb-10 flex items-baseline justify-between md:mb-14">
        <h2 class="eyebrow" data-reveal>(03) — Projects</h2>
        <p class="eyebrow hidden md:block" data-reveal>
          {{ projects.length }} projects
        </p>
      </div>

      <ul class="index-list">
        <li v-for="(p, i) in projects" :key="p.title" data-reveal>
          <button
            type="button"
            class="index-row group"
            :class="{ 'is-open': openIdx === i }"
            :aria-expanded="openIdx === i"
            :aria-controls="`project-panel-${i}`"
            @click="toggle(i)"
          >
            <span class="idx-num">0{{ i + 1 }}</span>
            <span class="idx-title">{{ p.title }}</span>
            <span class="idx-sub">{{ p.category }}</span>
            <span class="idx-toggle" aria-hidden="true">+</span>
          </button>

          <!-- Expanding panel: grid-rows 0fr→1fr for a smooth, JS-free height reveal -->
          <div
            :id="`project-panel-${i}`"
            class="panel"
            :class="{ 'is-open': openIdx === i }"
            role="region"
          >
            <div class="panel-inner">
              <div class="panel-content">
                <p class="panel-desc">{{ p.description }}</p>
                <ul class="panel-tags">
                  <li v-for="t in p.tags" :key="t" class="panel-tag">{{ t }}</li>
                </ul>
                <a
                  v-if="p.href"
                  :href="p.href"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="panel-link"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true" class="panel-link-icon" fill="currentColor">
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"></path>
                  </svg>
                  <span>View repository</span>
                </a>
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
  display: grid;
  gap: 1.5rem;
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
.panel-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.panel-tag {
  border: 1px solid rgb(var(--fg) / 0.15);
  border-radius: 999px;
  padding: 0.35rem 0.85rem;
  font-family: "Satoshi", ui-monospace, monospace;
  font-size: 0.75rem;
  color: rgb(var(--fg-muted));
}
.panel-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  justify-self: start;
  font-size: 0.9rem;
  color: rgb(var(--fg-muted));
  transition: color 0.3s ease;
}
.panel-link:hover {
  color: rgb(var(--accent));
}
.panel-link-icon {
  width: 1.1rem;
  height: 1.1rem;
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
  .idx-toggle {
    grid-column: 3;
    grid-row: 1;
  }
  .panel-content {
    padding-left: 2.75rem;
  }
}
</style>
