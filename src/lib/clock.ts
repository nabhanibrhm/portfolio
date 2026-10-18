/* Live Asia/Jakarta clock. Fills every `[data-clock]` element with "HH:MM"
 * (24 h) and refreshes every 15 s. Reusable anywhere: render the element with
 * "--:--" as the server fallback and import this module once (Layout.astro
 * does) — it re-initialises on each `astro:page-load` and clears its interval
 * on `astro:before-swap`. Elements rendered later by a Vue island can call
 * `updateClocks()` from onMounted to avoid waiting for the next tick. */

const TZ = "Asia/Jakarta";
const TICK_MS = 15_000;

let formatter: Intl.DateTimeFormat | null = null;
let timer: number | undefined;

function format(d: Date): string {
  try {
    formatter ??= new Intl.DateTimeFormat("en-GB", {
      timeZone: TZ,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    return formatter.format(d);
  } catch {
    return "--:--";
  }
}

export function updateClocks(): void {
  const text = format(new Date());
  document.querySelectorAll<HTMLElement>("[data-clock]").forEach((el) => {
    if (el.textContent !== text) el.textContent = text;
  });
}

function start(): void {
  stop();
  updateClocks();
  timer = window.setInterval(updateClocks, TICK_MS);
}

function stop(): void {
  if (timer !== undefined) window.clearInterval(timer);
  timer = undefined;
}

document.addEventListener("astro:page-load", start);
document.addEventListener("astro:before-swap", stop);
