import type { Algorithm } from "$lib/algorithms/algorithm";
import { Split } from "@lucide/svelte";
import Main from "./Main.svelte";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export const WAVE_FUNCTION_COLLAPSE: Algorithm<{}> = {
  name: "Wave function collapse algorithm",
  description: "Generate a 2d grid of cells based on cell neighbouring rules",
  path: "procedural_2d/wave_function_collapse",
  initial_settings: {},
  display: Main,
  icon: Split,
};
