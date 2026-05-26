import type { Algorithm } from "$lib/algorithms/algorithm";
import { Split } from "@lucide/svelte";
import Main from "./Main.svelte";
import type { TreeValue } from "$lib/components/TreeBoolean.svelte";
import SettingsMain from "./SettingsMain.svelte";

export type Settings = {
  generating?: boolean;
  rows: number;
  columns: number;
  animationsStepFilter: TreeValue<boolean>;
};

export const MAZE_BY_TREE: Algorithm<Settings> = {
  name: "Randomized depth-first search",
  description:
    "Generate a maze using a randomized depth first search, the root is picked randomly.",
  path: "maze/by_tree",
  initial_settings: {
    rows: 3,
    columns: 3,
    animationsStepFilter: [
      false,
      {
        pop: false,
        descend: false,
      },
    ],
  },
  display: Main,
  setting: SettingsMain,
  icon: Split,
};
