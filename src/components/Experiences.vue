<script setup lang="ts">
import { ref } from "vue";
import { experiences } from "../data/site";

// Scroll reveals for this section run from index.astro (an Astro-side script), not
// from this island, so rows never stay hidden if hydration fails or is slow.

// Accordion: one row open at a time (first by default); clicking the open row closes it.
const openIdx = ref<number | null>(0);
const toggle = (i: number) => {
  openIdx.value = openIdx.value === i ? null : i;
};
const bullets = (d: string | string[]) => (Array.isArray(d) ? d : [d]);
</script>

<template>
  <section
    id="experience"
    aria-labelledby="exp-h"
    class="anchor-offset wrap pt-24 md:pt-[160px]"
  >
    <div class="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 pb-6" data-reveal>
      <h2 id="exp-h" class="mono m-0 whitespace-nowrap text-mute">(02) — Experience</h2>
      <span class="mono whitespace-nowrap text-mute">{{ experiences.length }} roles</span>
    </div>

    <div class="border-b border-line">
      <div
        v-for="(e, i) in experiences"
        :key="e.role + e.company"
        class="border-t"
        :class="e.current ? 'border-accent' : 'border-line'"
        data-reveal
      >
        <h3 class="m-0">
          <button
            :id="`experience-btn-${i}`"
            type="button"
            class="exp-row"
            :aria-expanded="openIdx === i"
            :aria-controls="`experience-panel-${i}`"
            @click="toggle(i)"
          >
            <span class="exp-years mono text-mute">
              {{ e.period }}
              <span
                v-if="e.current"
                role="img"
                aria-label="Current role"
                class="h-1.5 w-1.5 rounded-full bg-accent"
              ></span>
            </span>
            <span class="exp-main">
              <span class="exp-head">
                <span class="exp-role" :class="{ acc: openIdx === i }">{{ e.role }}</span>
                <span class="text-[15px] text-mute">{{ e.company }}</span>
              </span>
              <span class="exp-summary">{{ e.summary }}</span>
            </span>
            <span class="exp-plus" :class="{ 'is-open': openIdx === i }" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round">
                <path d="M12 5v14M5 12h14"></path>
              </svg>
            </span>
          </button>
        </h3>

        <!-- Panel: grid-rows 0fr -> 1fr for a measurement-free height animation -->
        <div
          :id="`experience-panel-${i}`"
          role="region"
          :aria-labelledby="`experience-btn-${i}`"
          class="exp-panel"
          :class="{ 'is-open': openIdx === i }"
        >
          <div class="exp-panel-inner">
            <ul class="exp-bullets">
              <li v-for="(b, bi) in bullets(e.description)" :key="bi">
                <span class="dash" aria-hidden="true"></span>
                <span>{{ b }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.exp-row {
  display: grid;
  grid-template-columns: 220px minmax(0, 1fr) 44px;
  gap: 32px;
  align-items: start;
  width: 100%;
  padding: 32px 0;
  background: transparent;
  border: 0;
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;
}
.exp-years {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-top: 12px;
}
.exp-main {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 10px;
}
.exp-head {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 6px 20px;
}
.exp-role {
  font-size: clamp(26px, 3vw, 42px);
  font-weight: 500;
  line-height: 1.05;
  letter-spacing: -0.035em;
}
.exp-summary {
  max-width: 720px;
  font-size: 16px;
  line-height: 1.5;
  color: var(--mute);
}
.exp-plus {
  display: inline-flex;
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
  transition: transform 0.35s cubic-bezier(0.2, 0.7, 0.2, 1);
}
.exp-plus.is-open {
  transform: rotate(45deg);
}

.exp-panel {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.45s cubic-bezier(0.2, 0.7, 0.2, 1);
}
.exp-panel.is-open {
  grid-template-rows: 1fr;
}
.exp-panel-inner {
  min-height: 0;
  overflow: hidden;
}
/* Closed panels leave the accessibility tree / tab order once collapsed */
.exp-panel:not(.is-open) .exp-panel-inner {
  visibility: hidden;
  transition: visibility 0s 0.45s;
}
.exp-bullets {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 0;
  padding: 0 76px 36px 252px;
  list-style: none;
}
.exp-bullets li {
  display: grid;
  grid-template-columns: 20px minmax(0, 1fr);
  font-size: 16px;
  line-height: 1.55;
}
.dash {
  width: 10px;
  height: 1px;
  margin-top: 12px;
  background: #fca311;
}

@media (max-width: 859px) {
  .exp-row {
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 12px 16px;
    padding: 24px 0;
  }
  .exp-years {
    grid-column: 1 / -1;
    padding-top: 0;
  }
  .exp-plus {
    align-self: start;
  }
  .exp-bullets {
    padding: 0 0 28px 0;
  }
}
@media (prefers-reduced-motion: reduce) {
  .exp-panel,
  .exp-panel:not(.is-open) .exp-panel-inner,
  .exp-plus {
    transition: none;
  }
}
</style>
