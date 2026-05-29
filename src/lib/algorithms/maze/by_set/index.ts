import type { Algorithm } from "$lib/algorithms/algorithm";
import { Braces } from "@lucide/svelte";
import Main from "./Main.svelte";
import type { TreeValue } from "$lib/components/TreeBoolean.svelte";
import SettingsMain from "./SettingsMain.svelte";
import type { Dimensions } from "$lib/2d";

export type Settings = {
  generating?: boolean;
  dimensions: Dimensions;
  animationsStepFilter: TreeValue<boolean>;
};

export const MAZE_BY_SET: Algorithm<Settings> = {
  name: "Iterative randomized Kruskal's algorithm",
  description:
    "Generate a maze using a randomized union of sets, each cells starting it its own set.",
  path: "maze/by_set",
  initial_settings: {
    dimensions: {
      height: 3,
      width: 3,
    },
    animationsStepFilter: [
      true,
      {
        selection: true,
        neighbour: true,
        "random neighbour": true,
        "randon neighbour entry": true,
        "clear wall": true,
      },
    ],
  },
  setting: SettingsMain,
  display: Main,
  icon: Braces,
};
