import type { Algorithm } from "$lib/algorithms/algorithm";
import { Split } from "@lucide/svelte";
import Main from "./Main.svelte";
import type { TreeValue } from "$lib/components/TreeBoolean.svelte";
import SettingsMain from "./SettingsMain.svelte";
import type { Dimensions } from "$lib/2d";

export type Settings = {
  generating?: boolean;
  dimensions: Dimensions;
  animationsStepFilter: TreeValue<boolean>;
};

export const MAZE_BY_TREE: Algorithm<Settings> = {
  name: "Randomized depth-first search",
  description:
    "Generate a maze using a randomized depth first search, the root is picked randomly.",
  path: "maze/by_tree",
  initial_settings: {
    dimensions: {
      height: 3,
      width: 3,
    },
    animationsStepFilter: [
      true,
      {
        pop: true,
        descend: true,
      },
    ],
  },
  display: Main,
  setting: SettingsMain,
  icon: Split,
};
