<script setup lang="ts">
import { computed, ref } from "vue";
import { projects } from "../data/site";
import { useReveal } from "../lib/useReveal";
import { useHoverThumb } from "../lib/useHoverThumb";

const rootEl = ref<HTMLElement | null>(null);
useReveal(rootEl);

const { thumb, active, enter, leave } = useHoverThumb();
const current = computed(() =>
  active.value === null ? null : projects[active.value],
);
</script>

<template>
  <section id="work" ref="rootEl" class="anchor-offset relative py-20 md:py-40">
    <div class="shell">
      <div class="mb-10 flex items-baseline justify-between md:mb-14">
        <h2 class="eyebrow" data-reveal>(03) — Selected Work</h2>
        <p class="eyebrow hidden md:block" data-reveal>
          {{ projects.length }} projects
        </p>
      </div>

      <ul class="index-list" @pointerleave="leave">
        <li v-for="(p, i) in projects" :key="p.slug" data-reveal>
          <a
            :href="`/work/${p.slug}`"
            class="index-row group"
            @pointerenter="enter(i)"
          >
            <span class="idx-num">0{{ i + 1 }}</span>
            <span class="idx-title">{{ p.title }}</span>
            <span class="idx-sub">{{ p.category }}</span>
            <span class="idx-arrow" aria-hidden="true">↗</span>
          </a>
        </li>
      </ul>
    </div>

    <!-- Cursor-tracked cover thumbnail (rich-media stand-in built from brand colors) -->
    <div ref="thumb" class="hover-thumb" aria-hidden="true">
      <div
        v-if="current"
        class="thumb-cover"
        :class="current.accent === 'accent' ? 'is-accent' : 'is-secondary'"
      >
        <span class="thumb-cover__index">0{{ (active ?? 0) + 1 }}</span>
        <div class="thumb-cover__meta">
          <span class="thumb-cover__cat">{{ current.category }}</span>
          <span class="thumb-cover__tags">{{ current.tags.join(" · ") }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.index-list {
  border-top: 1px solid rgba(247, 247, 247, 0.1);
}
.index-row {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.5rem 1.5rem;
  padding: 1.75rem 0;
  border-bottom: 1px solid rgba(247, 247, 247, 0.1);
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
  color: #6b6b6b;
}
.idx-title {
  font-size: clamp(1.5rem, 3.2vw, 2.5rem);
  font-weight: 500;
  letter-spacing: -0.02em;
  transition: color 0.4s ease;
}
.index-row:hover .idx-title {
  color: #ff5722;
}
.idx-sub {
  color: #a3a3a3;
  margin-left: auto;
}
.idx-arrow {
  font-size: 1.25rem;
  color: #6b6b6b;
  opacity: 0;
  transform: translate(-8px, 4px);
  transition:
    opacity 0.4s ease,
    transform 0.4s cubic-bezier(0.22, 1, 0.36, 1),
    color 0.4s ease;
}
.index-row:hover .idx-arrow {
  opacity: 1;
  transform: translate(0, 0);
  color: #ff5722;
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
  .idx-arrow {
    display: none;
  }
}

/* Floating cover */
.hover-thumb {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 30;
  width: 340px;
  pointer-events: none;
}
.thumb-cover {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  aspect-ratio: 4 / 3;
  padding: 1.5rem;
  border-radius: 1.25rem;
  overflow: hidden;
  color: #f7f7f7;
  border: 1px solid rgba(247, 247, 247, 0.12);
  box-shadow: 0 30px 60px -20px rgba(0, 0, 0, 0.6);
}
.thumb-cover.is-accent {
  background:
    radial-gradient(130% 130% at 100% 0%, rgba(255, 87, 34, 0.85), transparent 55%),
    linear-gradient(160deg, #2a1810, #181818);
}
.thumb-cover.is-secondary {
  background:
    radial-gradient(130% 130% at 100% 0%, rgba(103, 58, 183, 0.85), transparent 55%),
    linear-gradient(160deg, #1d1530, #181818);
}
.thumb-cover__index {
  font-size: 3.5rem;
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.04em;
  color: rgba(247, 247, 247, 0.95);
}
.thumb-cover__meta {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.thumb-cover__cat {
  font-size: 1.05rem;
  font-weight: 600;
}
.thumb-cover__tags {
  font-family: "Satoshi", ui-monospace, monospace;
  font-size: 0.72rem;
  letter-spacing: 0.04em;
  color: rgba(247, 247, 247, 0.7);
}
@media (hover: none) {
  .hover-thumb {
    display: none;
  }
}
</style>
