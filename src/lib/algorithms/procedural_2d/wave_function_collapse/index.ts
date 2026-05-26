import type { Algorithm } from "$lib/algorithms/algorithm";
import { Split } from "@lucide/svelte";
import Main from "./Main.svelte";

export const WAVE_FUNCTION_COLLAPSE: Algorithm = {
  name: "Wave function collapse algorithm",
  description: "Generate a 2d grid of cells based on cell neighbouring rules",
  path: "procedural_2d/wave_function_collapse",
  display: Main,
  icon: Split,
};
