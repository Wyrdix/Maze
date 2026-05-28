import type { Algorithm } from "$lib/algorithms/algorithm";
import { Split } from "@lucide/svelte";
import Main from "./Main.svelte";
import type { Rule } from "./grid";
import SettingsMain from "./SettingsMain.svelte";
import type { Dimensions } from "$lib/2d";

export type Settings = {
  dimensions: Dimensions;
  rules: Rule<number>[];
  tiles: (string | undefined)[];
  generating?: boolean;
};

export const WAVE_FUNCTION_COLLAPSE: Algorithm<Settings> = {
  name: "Wave function collapse algorithm",
  description: "Generate a 2d grid of cells based on cell neighbouring rules",
  path: "procedural_2d/wave_function_collapse",
  initial_settings: {
    dimensions: {
      height: 5,
      width: 5,
    },
    rules: [],
    tiles: [],
  },
  display: Main,
  setting: SettingsMain,
  icon: Split,
};
