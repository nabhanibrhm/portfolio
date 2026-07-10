<script setup lang="ts">
/* Tap-to-float dodge — a tiny flappy-style game that lives inside the About
 * portrait card. Pure Canvas 2D, no deps. The memoji is the "bird"; pillars are
 * tinted with the site's --accent. Physics run in a fixed virtual coordinate
 * space (VH tall) and are scaled to whatever pixel size the card happens to be,
 * so it feels identical across breakpoints. */
import { onBeforeUnmount, onMounted, ref } from "vue";

const containerEl = ref<HTMLElement | null>(null);
const canvasEl = ref<HTMLCanvasElement | null>(null);

const state = ref<"idle" | "playing" | "over">("idle");
const score = ref(0);
const best = ref(0);
const liveMsg = ref("");

const BEST_KEY = "memoji-dodge-best";

// --- Virtual world (physics tuned for a 360-unit-tall play area) -------------
const VH = 360;
const G = 1500; // gravity (units/s²)
const FLAP = -410; // instant upward velocity on a tap
const V_MAX = 720; // terminal fall speed
const R = 22; // memoji hitbox radius (smaller than the sprite → forgiving)
const SPRITE_H = 72; // drawn memoji height
const PW = 52; // pillar width
const GAP = 132; // vertical gap between pillars
const SPACING = 210; // horizontal distance between pillars
const MARGIN = 34; // keep gaps clear of ceiling/floor

// --- Mutable game state (kept out of Vue reactivity — mutated every frame) ---
let ctx: CanvasRenderingContext2D | null = null;
let dpr = 1;
let scale = 1; // virtual → css px
let VW = 240; // virtual world width (derived from aspect ratio)
let birdX = 80;
let y = VH / 2;
let vy = 0;
let elapsed = 0; // for the idle bob
let pillars: { x: number; gapY: number; scored: boolean }[] = [];

let img: HTMLImageElement | null = null;
let imgReady = false;

let running = false;
let raf = 0;
let lastTime: number | null = null;
let reduce = false;

// Colours pulled from the live theme (re-read on light/dark toggle).
let pillarFill = "rgba(193,193,169,0.15)";
let pillarStroke = "rgba(193,193,169,0.34)";
let fallbackFill = "rgba(193,193,169,0.9)";

function readColors() {
  const cs = getComputedStyle(document.documentElement);
  const accent = cs.getPropertyValue("--accent").trim().split(/\s+/).map(Number);
  const [r, g, b] = accent.length === 3 ? accent : [193, 193, 169];
  pillarFill = `rgba(${r},${g},${b},0.15)`;
  pillarStroke = `rgba(${r},${g},${b},0.34)`;
  fallbackFill = `rgba(${r},${g},${b},0.9)`;
}

function resize() {
  const el = containerEl.value;
  const canvas = canvasEl.value;
  if (!el || !canvas) return;
  const rect = el.getBoundingClientRect();
  if (!rect.width || !rect.height) return;
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(rect.width * dpr);
  canvas.height = Math.round(rect.height * dpr);
  canvas.style.width = `${rect.width}px`;
  canvas.style.height = `${rect.height}px`;
  scale = rect.height / VH;
  VW = rect.width / scale;
  birdX = VW * 0.32;
}

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function spawnPillars() {
  // Fill from the current rightmost pillar until we're past the right edge.
  let lastX = pillars.length ? pillars[pillars.length - 1].x : VW - SPACING + 60;
  while (lastX < VW + SPACING) {
    lastX += SPACING;
    pillars.push({
      x: lastX,
      gapY: rand(GAP / 2 + MARGIN, VH - GAP / 2 - MARGIN),
      scored: false,
    });
  }
}

function start() {
  score.value = 0;
  y = VH / 2;
  vy = FLAP;
  pillars = [];
  spawnPillars();
  state.value = "playing";
  liveMsg.value = "Game started. Tap to keep the memoji airborne.";
  containerEl.value?.focus();
  startLoop();
}

function flap() {
  if (state.value === "playing") vy = FLAP;
  else start();
}

function gameOver() {
  state.value = "over";
  if (score.value > best.value) {
    best.value = score.value;
    try {
      localStorage.setItem(BEST_KEY, String(best.value));
    } catch {
      /* private mode — best just won't persist */
    }
  }
  liveMsg.value = `Game over. Score ${score.value}. Best ${best.value}.`;
}

function circleHitsRect(cx: number, cy: number, rx: number, ry: number, rw: number, rh: number) {
  const nx = Math.max(rx, Math.min(cx, rx + rw));
  const ny = Math.max(ry, Math.min(cy, ry + rh));
  const dx = cx - nx;
  const dy = cy - ny;
  return dx * dx + dy * dy < R * R;
}

function update(dt: number) {
  elapsed += dt;

  if (state.value === "idle") {
    y = reduce ? VH / 2 : VH / 2 + Math.sin(elapsed * 2) * 10;
    return;
  }
  if (state.value !== "playing") return;

  // Speed ramps up gently as the score climbs.
  const speed = 135 + Math.min(score.value * 3, 95);

  vy = Math.min(vy + G * dt, V_MAX);
  y += vy * dt;

  // Ceiling clamps (friendlier than an instant death); floor is fatal.
  if (y - R < 0) {
    y = R;
    vy = 0;
  }
  if (y + R >= VH) {
    y = VH - R;
    gameOver();
    return;
  }

  for (const p of pillars) {
    p.x -= speed * dt;
    if (!p.scored && p.x + PW < birdX) {
      p.scored = true;
      score.value += 1;
    }
    const topH = p.gapY - GAP / 2;
    const botY = p.gapY + GAP / 2;
    if (
      circleHitsRect(birdX, y, p.x, 0, PW, topH) ||
      circleHitsRect(birdX, y, p.x, botY, PW, VH - botY)
    ) {
      gameOver();
      return;
    }
  }

  pillars = pillars.filter((p) => p.x + PW > -20);
  spawnPillars();
}

function roundRect(x: number, y2: number, w: number, h: number, r: number) {
  if (!ctx) return;
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y2);
  ctx.arcTo(x + w, y2, x + w, y2 + h, rr);
  ctx.arcTo(x + w, y2 + h, x, y2 + h, rr);
  ctx.arcTo(x, y2 + h, x, y2, rr);
  ctx.arcTo(x, y2, x + w, y2, rr);
  ctx.closePath();
}

function render() {
  if (!ctx) return;
  ctx.setTransform(dpr * scale, 0, 0, dpr * scale, 0, 0);
  ctx.clearRect(0, 0, VW, VH);

  if (state.value !== "idle") {
    ctx.lineWidth = 1.5;
    for (const p of pillars) {
      const topH = p.gapY - GAP / 2;
      const botY = p.gapY + GAP / 2;
      ctx.fillStyle = pillarFill;
      ctx.strokeStyle = pillarStroke;
      roundRect(p.x, -10, PW, topH + 10, 10);
      ctx.fill();
      ctx.stroke();
      roundRect(p.x, botY, PW, VH - botY + 10, 10);
      ctx.fill();
      ctx.stroke();
    }
  }

  // Memoji, tilted toward its velocity for that flappy feel.
  const tilt = Math.max(-0.35, Math.min(0.9, vy / 600));
  ctx.save();
  ctx.translate(birdX, y);
  if (state.value === "playing") ctx.rotate(tilt);
  if (imgReady && img) {
    const w = SPRITE_H * (img.naturalWidth / img.naturalHeight || 0.85);
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(img, -w / 2, -SPRITE_H / 2, w, SPRITE_H);
  } else {
    ctx.fillStyle = fallbackFill;
    ctx.beginPath();
    ctx.arc(0, 0, R, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function frame(t: number) {
  if (!running) return;
  raf = requestAnimationFrame(frame);
  if (lastTime == null) lastTime = t;
  const dt = Math.min((t - lastTime) / 1000, 1 / 30);
  lastTime = t;
  update(dt);
  render();
}

function startLoop() {
  if (running) return;
  running = true;
  lastTime = null;
  raf = requestAnimationFrame(frame);
}

function stopLoop() {
  running = false;
  cancelAnimationFrame(raf);
}

function onPointerDown(e: PointerEvent) {
  // Only intercept taps while playing so idle/over taps fall through to the
  // buttons and page scrolling past the card stays possible.
  if (state.value !== "playing") return;
  e.preventDefault();
  flap();
}

function onKey(e: KeyboardEvent) {
  if (e.code === "Space" || e.code === "ArrowUp" || e.code === "Enter") {
    e.preventDefault();
    flap();
  }
}

// --- Lifecycle ---------------------------------------------------------------
let io: IntersectionObserver | null = null;
let ro: ResizeObserver | null = null;
let mo: MutationObserver | null = null;
let onVisibility: (() => void) | null = null;
let visible = true;

function syncLoop() {
  if (visible && !document.hidden) startLoop();
  else stopLoop();
}

onMounted(() => {
  const canvas = canvasEl.value;
  if (!canvas) return;
  ctx = canvas.getContext("2d");
  reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  try {
    best.value = Number(localStorage.getItem(BEST_KEY)) || 0;
  } catch {
    /* ignore */
  }

  img = new Image();
  img.onload = () => {
    imgReady = true;
  };
  img.src = "/memoji-smile.webp";

  readColors();
  resize();
  render();

  ro = new ResizeObserver(() => {
    resize();
    if (!running) render();
  });
  ro.observe(containerEl.value!);

  // Pause the loop when the card scrolls out of view.
  io = new IntersectionObserver(
    ([entry]) => {
      visible = entry.isIntersecting;
      syncLoop();
    },
    { threshold: 0 },
  );
  io.observe(containerEl.value!);

  // Re-read theme colours when light/dark is toggled (html class changes).
  mo = new MutationObserver(readColors);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

  onVisibility = () => syncLoop();
  document.addEventListener("visibilitychange", onVisibility);
});

onBeforeUnmount(() => {
  stopLoop();
  io?.disconnect();
  ro?.disconnect();
  mo?.disconnect();
  if (onVisibility) document.removeEventListener("visibilitychange", onVisibility);
});
</script>

<template>
  <div
    ref="containerEl"
    class="relative h-[clamp(20rem,52vw,25rem)] w-full select-none outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
    :style="{ touchAction: state === 'playing' ? 'none' : 'auto' }"
    tabindex="0"
    role="application"
    aria-label="Mini game: tap or press space to keep the memoji airborne and dodge the pillars"
    @pointerdown="onPointerDown"
    @keydown="onKey"
  >
    <canvas ref="canvasEl" class="block h-full w-full"></canvas>

    <!-- Live score (during play) -->
    <div
      v-show="state === 'playing'"
      class="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-4 font-mono text-xs"
    >
      <span class="text-2xl font-semibold tabular-nums text-foreground">{{ score }}</span>
      <span class="text-foreground-faint">best {{ best }}</span>
    </div>

    <!-- Idle: memoji bobs; a real button starts the game -->
    <div
      v-show="state === 'idle'"
      class="pointer-events-none absolute inset-0 flex flex-col items-center justify-end gap-3 pb-6 text-center"
    >
      <p class="eyebrow">Bored? play a round</p>
      <button
        type="button"
        class="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-background transition-colors duration-300 ease-smooth hover:bg-accent-deep"
        @click="start"
      >
        Tap to fly
        <span aria-hidden="true">↑</span>
      </button>
    </div>

    <!-- Game over -->
    <div
      v-show="state === 'over'"
      class="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-background/55 text-center backdrop-blur-[2px]"
    >
      <p class="eyebrow">Game over</p>
      <p class="text-4xl font-semibold tabular-nums text-foreground">{{ score }}</p>
      <p class="mb-4 font-mono text-xs text-foreground-faint">best {{ best }}</p>
      <button
        type="button"
        class="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-background transition-colors duration-300 ease-smooth hover:bg-accent-deep"
        @click="start"
      >
        Retry
        <span aria-hidden="true">↺</span>
      </button>
    </div>

    <p class="sr-only" aria-live="polite">{{ liveMsg }}</p>
  </div>
</template>
