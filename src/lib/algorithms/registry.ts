import type { Algorithm } from "./algorithm";
import type { Group } from "./group";
import { MAZE_GROUP } from "./maze";
import { MAZE_BY_SET } from "./maze/by_set";
import { MAZE_BY_TREE } from "./maze/by_tree";

export const REGISTRY = [MAZE_BY_SET, MAZE_BY_TREE];

export const GROUPS = [MAZE_GROUP];

export function getGroupedRegistry(): { group: Group; entries: Algorithm[] }[] {
  const registryToGroup = REGISTRY.map((v) => ({
    entry: v,
    group: GROUPS.filter((o) => v.path.startsWith(o.path)).sort(
      (a, b) => a.path.length - b.path.length,
    )[0],
  }));

  return GROUPS.map((group) => ({
    group,
    entries: registryToGroup
      .filter((value) => value.group.path === group.path)
      .map((value) => value.entry),
  }));
}
