<script setup lang="ts">
/* Content of the About "game" tile: copy on top, the
   MemojiDodge canvas filling the middle, the start/retry button below. The button is the keyboard- and
   screen-reader-friendly way to play (Space/Enter on it = flap); the canvas
   also takes taps. This is the only hydrated part of the About section. */
import { computed, ref } from "vue";
import { about } from "../data/site";
import MemojiDodge from "./MemojiDodge.vue";

const game = ref<InstanceType<typeof MemojiDodge> | null>(null);
const state = ref<"idle" | "playing" | "over">("idle");

const label = computed(() =>
  state.value === "over" ? "Retry" : state.value === "playing" ? "Flap" : "Tap to fly",
);
const arrow = computed(() => (state.value === "over" ? "↺" : "↑"));
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col gap-4">
    <div class="flex flex-col gap-2">
      <span class="mono text-mute">{{ about.game.label }}</span>
      <p class="m-0 max-w-[420px] text-[15px] leading-[1.5] text-mute">
        {{ about.game.description }}
      </p>
    </div>
    <div class="relative min-h-[240px] flex-1 overflow-hidden rounded-[10px] border border-line min-[860px]:min-h-[300px]">
      <MemojiDodge ref="game" @state="state = $event" />
    </div>
    <button
      type="button"
      class="btn inline-flex h-11 cursor-pointer items-center gap-2 self-start rounded-full border-0 bg-accent px-5 text-sm font-medium text-accent-on"
      @click="game?.flap()"
    >
      {{ label }}
      <span aria-hidden="true">{{ arrow }}</span>
    </button>
  </div>
</template>
