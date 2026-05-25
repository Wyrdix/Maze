import type { Algorithm } from "$lib/algorithms/algorithm";
import { Split } from "@lucide/svelte";
import Main from "./Main.svelte";

export const MAZE_BY_TREE: Algorithm = {
  name: "Randomized depth-first search",
  description:
    "Generate a maze using a randomized depth first search, the root is picked randomly.",
  path: "maze/by_tree",
  display: Main,
  icon: Split,
};
