import type { Algorithm } from "$lib/algorithms/algorithm";
import { Braces } from "@lucide/svelte";
import Main from "./Main.svelte";

export const MAZE_BY_SET: Algorithm = {
  name: "Iterative randomized Kruskal's algorithm",
  description:
    "Generate a maze using a randomized union of sets, each cells starting it its own set.",
  path: "maze/by_set",
  display: Main,
  icon: Braces,
};
