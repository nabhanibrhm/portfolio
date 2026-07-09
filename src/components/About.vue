<script setup lang="ts">
import { ref } from "vue";
import { about, skills, site } from "../data/site";
import { useReveal } from "../lib/useReveal";

const rootEl = ref<HTMLElement | null>(null);
useReveal(rootEl);
</script>

<template>
  <section
    id="about"
    ref="rootEl"
    class="anchor-offset relative py-16 md:py-24"
  >
    <div class="shell">
      <div class="mb-14 flex items-baseline justify-between md:mb-20">
        <p class="eyebrow" data-reveal>(01) — About</p>
      </div>

      <div class="grid gap-14 md:grid-cols-12 md:gap-10">
        <!-- Lead + body -->
        <div class="md:col-span-7">
          <h2
            class="text-3xl font-semibold leading-[1.1] tracking-tight md:text-[2.75rem]"
          >
            <span class="block overflow-hidden" data-mask>
              <span class="block">{{ about.lead }}</span>
            </span>
          </h2>

          <div class="mt-8 max-w-prose space-y-5 text-lg text-foreground-muted">
            <p v-for="(para, i) in about.body" :key="i" data-reveal>
              {{ para }}
            </p>
          </div>
        </div>

        <!-- Portrait + toolkit -->
        <div class="md:col-span-5 md:pl-10">
          <div
            class="overflow-hidden rounded-3xl border border-foreground/10 bg-gradient-to-b from-background-soft to-background"
            data-reveal
          >
            <img
              src="/memoji-smile.webp"
              alt="Luthfi Nabhan Ibrahim"
              width="600"
              height="800"
              class="mx-auto h-72 w-auto object-contain p-6"
              data-parallax="-0.08"
            />
          </div>

          <div class="mt-8" data-reveal>
            <p class="eyebrow mb-4">Toolkit</p>
            <ul class="flex flex-wrap gap-2">
              <li
                v-for="s in skills"
                :key="s"
                class="rounded-full border border-foreground/15 px-3.5 py-1.5 font-mono text-xs text-foreground-muted transition-colors duration-300 hover:border-accent hover:text-accent"
              >
                {{ s }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
