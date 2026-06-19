// @ts-check
import { defineConfig } from "astro/config";
import vue from "@astrojs/vue";
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  // View Transitions are enabled per-page via <ClientRouter /> in Layout.astro.
  integrations: [
    vue(),
    // We import the Tailwind entry (@tailwind directives) ourselves in
    // src/styles/global.css so we control the cascade, hence applyBaseStyles:false.
    tailwind({ applyBaseStyles: false }),
  ],
});
