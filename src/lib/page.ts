/* Run `fn` once per page view for a script that belongs to one page/section.
 *
 * With <ClientRouter />, a page's bundled <script type="module"> can load AFTER
 * `astro:page-load` already fired, e.g. deep-link to /projects/x and then
 * navigate home: the home-only scripts (hero, projects, contact) are fetched
 * during that navigation and would miss the event, leaving their reveal-hidden
 * content invisible. So run immediately as well as on every page-load; a marker
 * on the section's root element (new DOM on every swap; <body> itself persists)
 * makes the second call a no-op. If the root is absent, nothing runs. */
export function onPageLoad(rootId: string, fn: () => void): void {
  const run = () => {
    const root = document.getElementById(rootId);
    if (!root || root.dataset.pageInit) return;
    root.dataset.pageInit = "1";
    fn();
  };
  document.addEventListener("astro:page-load", run);
  run();
}
