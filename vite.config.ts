import tailwindcss from "@tailwindcss/vite";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import { DynamicPublicDirectory } from "vite-multiple-assets";

export default defineConfig({
  plugins: [
    tailwindcss(),
    sveltekit(),
    DynamicPublicDirectory(["node_modules/gif.js/dist"]),
  ],
});
