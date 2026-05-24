import type { MazeGenerator } from "$lib/generator";
import {
  directions,
  getDirection,
  getNeighbours,
  set_cell,
  set_wall,
  type Maze,
  type Position,
} from "$lib/maze";

export type State = {
  phase: "initial" | "iteration" | "done";
  subphase?:
    | "selection"
    | "neighbour"
    | "random neighbour"
    | "randon neighbour entry"
    | "clear wall";
  entries: {
    set: Position[];
    neighbours: Position[];
  }[];
};

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type Config = {};

export type SpecializedMaze = Maze<
  "first" | "second" | "neighbour" | false,
  boolean
>;

export type SpecializedGenerator = MazeGenerator<
  Config,
  State,
  "first" | "second" | "neighbour" | false,
  boolean
>;

export function Generator(config: Config): SpecializedGenerator {
  return {
    config,
    initial_state(maze) {
      return {
        entries: Array.from({ length: maze.dimensions.rows })
          .flatMap((_, x) =>
            Array.from({ length: maze.dimensions.columns }).map((_, y) => ({
              row: x,
              col: y,
            })),
          )
          .map((pos) => ({
            set: [pos],
            neighbours: getNeighbours(maze, pos),
          })),
        phase: "initial",
      };
    },
    next(maze, state) {
      switch (state.phase) {
        case "initial":
          return [
            {
              maze: Array.from({ length: maze.dimensions.rows })
                .flatMap((_, row) =>
                  Array.from({ length: maze.dimensions.columns }).map(
                    (_, col) => ({
                      row,
                      col,
                    }),
                  ),
                )
                .reduce((maze, pos) => {
                  return directions.reduce(
                    (maze, dir) => set_wall(maze, pos, dir, true),
                    maze,
                  );
                }, maze),
              state: {
                ...state,
                phase: "iteration",
              },
            },
          ];
        case "iteration": {
          const id_first = Math.floor(Math.random() * state.entries.length);
          const first = state.entries[id_first];

          const destination =
            first.neighbours[
              Math.floor(Math.random() * first.neighbours.length)
            ];

          const id_second = state.entries.findIndex((entry) =>
            entry.set.find(
              (p) => p.col == destination.col && p.row == destination.row,
            ),
          )!;
          const second = state.entries[id_second];

          const origin = getNeighbours(maze, destination).filter((origin) =>
            first.set.find((p) => p.col == origin.col && p.row == origin.row),
          )[0];

          return [
            {
              maze: first.set.reduceRight(
                (maze, p) => set_cell(maze, p, "first"),
                maze,
              ),
              state: {
                ...state,
                subphase: "selection",
              },
            },

            {
              maze: first.neighbours.reduceRight(
                (maze, p) => set_cell(maze, p, "neighbour"),
                first.set.reduceRight(
                  (maze, p) => set_cell(maze, p, "first"),
                  maze,
                ),
              ),
              state: {
                ...state,
                subphase: "neighbour",
              },
            },

            {
              maze: first.set.reduceRight(
                (maze, p) => set_cell(maze, p, "first"),
                set_cell(maze, destination, "neighbour"),
              ),
              state: {
                ...state,
                subphase: "random neighbour",
              },
            },
            {
              maze: second.set.reduceRight(
                (maze, p) => set_cell(maze, p, "second"),
                first.set.reduceRight(
                  (maze, p) => set_cell(maze, p, "first"),
                  maze,
                ),
              ),
              state: {
                ...state,
                subphase: "randon neighbour entry",
              },
            },
            {
              maze: set_wall(
                maze,
                origin,
                getDirection(origin, destination)!,
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
                subphase: "clear wall",
              },
              done: state.entries.length == 2,
            },
          ];
        }
        case "done":
          return [{ maze, state, done: state.phase === "done" }];
      }
    },
  };
}
