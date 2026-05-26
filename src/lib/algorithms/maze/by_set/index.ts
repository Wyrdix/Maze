import type { Algorithm } from "$lib/algorithms/algorithm";
import { Braces } from "@lucide/svelte";
import Main from "./Main.svelte";
import type { TreeValue } from "$lib/components/TreeBoolean.svelte";
import SettingsMain from "./SettingsMain.svelte";

export type Settings = {
  generating?: boolean;
  rows: number;
  columns: number;
  animationsStepFilter: TreeValue<boolean>;
};

export const MAZE_BY_SET: Algorithm<Settings> = {
  name: "Iterative randomized Kruskal's algorithm",
  description:
    "Generate a maze using a randomized union of sets, each cells starting it its own set.",
  path: "maze/by_set",
  initial_settings: {
    columns: 3,
    rows: 3,
    animationsStepFilter: [
      false,
      {
        selection: false,
        neighbour: false,
        "random neighbour": false,
        "randon neighbour entry": false,
        "clear wall": false,
      },
    ],
  },
  setting: SettingsMain,
  display: Main,
  icon: Braces,
};
