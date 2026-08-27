import { tailwindConfig, TailwindPlugins } from "@sv0/components/theme/tailwind.config.js";

export default tailwindConfig([TailwindPlugins.debugScreens], {
  content: ["./src/**/*.{svelte,ts}"],
  theme: { extend: {} }
});
