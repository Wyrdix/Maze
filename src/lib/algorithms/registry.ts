import type { Algorithm } from "./algorithm";
import type { Group } from "./group";
import { MAZE_GROUP } from "./maze";
import { MAZE_BY_SET } from "./maze/by_set";
import { MAZE_BY_TREE } from "./maze/by_tree";
import { WAVE_FUNCTION_COLLAPSE } from "./procedural_2d/wave_function_collapse";

export const ROOT_GROUP: Group = {
  name: "Algorithms",
  path: "",
};

export const REGISTRY = [MAZE_BY_SET, MAZE_BY_TREE, WAVE_FUNCTION_COLLAPSE];

export const GROUPS = [ROOT_GROUP, MAZE_GROUP];

export function getGroupedRegistry(): { group: Group; entries: Algorithm[] }[] {
  const registryToGroup = REGISTRY.map((v) => ({
    entry: v,
    group: GROUPS.filter((o) => v.path.startsWith(o.path)).sort(
      (a, b) => b.path.length - a.path.length,
    )[0],
  }));

  return GROUPS.map((group) => ({
    group,
    entries: registryToGroup
      .filter((value) => value.group.path === group.path)
      .map((value) => value.entry),
  }));
}
