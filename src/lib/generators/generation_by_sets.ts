import type { MazeGenerator } from "$lib/generator";
import {
  applyDirection,
  DefaultMazeImplementation,
  direction,
  getDirection,
  type Direction,
  type Maze as MazeType,
  type Position,
} from "$lib/maze";

export type State = {
  phase: "initial" | "iteration" | "done";
  entries: {
    set: Position[];
    neighbours: Position[];
  }[];
};

export type Config = {};

export type SpecializedMaze = DefaultMazeImplementation<boolean, boolean>;

export type SpecializedGenerator = MazeGenerator<
  Config,
  State,
  SpecializedMaze
>;

export function Generator(config: Config): SpecializedGenerator {
  return {
    config,
    initial_state(maze) {
      return {
        entries: Array.from({ length: maze.dimensions[0] })
          .flatMap((_, x) =>
            Array.from({ length: maze.dimensions[1] }).map((_, y) => ({
              row: x,
              col: y,
            })),
          )
          .map((pos) => ({
            set: [pos],
            neighbours: (Object.keys(direction) as Direction[])
              .map((dir) => applyDirection(pos, direction[dir]))
              .filter(
                (v) =>
                  v.col >= 0 &&
                  v.row >= 0 &&
                  v.row < maze.dimensions[0] &&
                  v.col < maze.dimensions[1],
              ),
          })),
        phase: "initial",
      };
    },
    next(maze, state) {
      switch (state.phase) {
        case "initial":
          return {
            maze: Array.from({ length: maze.dimensions[0] })
              .flatMap((_, row) =>
                Array.from({ length: maze.dimensions[1] }).map((_, col) => ({
                  row,
                  col,
                })),
              )
              .reduce((maze, pos) => {
                return (Object.keys(direction) as Direction[]).reduce(
                  (maze, dir) => maze.set_wall(pos, dir, true),
                  maze,
                );
              }, maze),
            state: {
              ...state,
              phase: "iteration",
            },
          };
        case "iteration":
          let id_first = Math.floor(Math.random() * state.entries.length);
          let first = state.entries[id_first];

          let destination =
            first.neighbours[
              Math.floor(Math.random() * first.neighbours.length)
            ];

          let id_second = state.entries.findIndex((entry) =>
            entry.set.find(
              (p) => p.col == destination.col && p.row == destination.row,
            ),
          )!!;
          let second = state.entries[id_second];

          let origin = (Object.keys(direction) as Direction[])
            .map((dir) => applyDirection(destination, direction[dir]))
            .filter((origin) =>
              first.set.find((p) => p.col == origin.col && p.row == origin.row),
            )[0];

          return {
            maze: maze.set_wall(
              origin,
              getDirection(origin, destination)!!,
              false,
            ),
            state: {
              phase: state.entries.length == 2 ? "done" : "iteration",
              entries: state.entries
                .filter((_, o) => o != id_first && o != id_second)
                .concat([
                  {
                    set: [...first.set, ...second.set],
                    neighbours: [
                      ...first.neighbours,
                      ...second.neighbours,
                    ].filter(
                      (neighbour) =>
                        !first.set.find(
                          (p) =>
                            p.col == neighbour.col && p.row == neighbour.row,
                        ) &&
                        !second.set.find(
                          (p) =>
                            p.col == neighbour.col && p.row == neighbour.row,
                        ),
                    ),
                  },
                ]),
            },
            done: state.entries.length == 2,
          };

        case "done":
          return { maze, state, done: state.phase === "done" };
      }
    },
  };
}
