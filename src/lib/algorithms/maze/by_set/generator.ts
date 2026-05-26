import {
  getDirectionFromTo,
  getDirections,
  getNeighboursPosition,
  type Position,
} from "$lib/2d";
import type { MazeGenerator } from "$lib/algorithms/maze/generator";
import { set_cell, set_wall, type Maze } from "$lib/algorithms/maze/maze";

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

export type CellType = "first" | "second" | "neighbour" | false;

export type SpecializedMaze = Maze<CellType, boolean>;

export type SpecializedGenerator = MazeGenerator<
  Config,
  State,
  CellType,
  boolean
>;

export function Generator(config: Config): SpecializedGenerator {
  return {
    config,
    initial_state(maze) {
      return {
        entries: Array.from({ length: maze.dimensions.height })
          .flatMap((_, x) =>
            Array.from({ length: maze.dimensions.width }).map((_, y) => ({
              y: x,
              x: y,
            })),
          )
          .map((pos) => ({
            set: [pos],
            neighbours: getNeighboursPosition(maze, pos),
          })),
        phase: "initial",
      };
    },
    next(maze, state) {
      switch (state.phase) {
        case "initial":
          return [
            {
              maze: Array.from({ length: maze.dimensions.height })
                .flatMap((_, y) =>
                  Array.from({ length: maze.dimensions.width }).map((_, x) => ({
                    y,
                    x,
                  })),
                )
                .reduce((maze, pos) => {
                  return getDirections().reduce(
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
            entry.set.find((p) => p.x == destination.x && p.y == destination.y),
          )!;
          const second = state.entries[id_second];

          const origin = getNeighboursPosition(maze, destination).filter(
            (origin) =>
              first.set.find((p) => p.x == origin.x && p.y == origin.y),
          )[0];

          return [
            {
              maze: first.set.reduceRight(
                (maze, p) => set_cell(maze, p, "first" as CellType),
                maze,
              ),
              state: {
                ...state,
                subphase: "selection",
              },
            },

            {
              maze: first.neighbours.reduceRight(
                (maze, p) => set_cell(maze, p, "neighbour" as CellType),
                first.set.reduceRight(
                  (maze, p) => set_cell(maze, p, "first" as CellType),
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
                (maze, p) => set_cell(maze, p, "first" as CellType),
                set_cell(maze, destination, "neighbour" as CellType),
              ),
              state: {
                ...state,
                subphase: "random neighbour",
              },
            },
            {
              maze: second.set.reduceRight(
                (maze, p) => set_cell(maze, p, "second" as CellType),
                first.set.reduceRight(
                  (maze, p) => set_cell(maze, p, "first" as CellType),
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
                getDirectionFromTo(origin, destination)!,
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
                            (p) => p.x == neighbour.x && p.y == neighbour.y,
                          ) &&
                          !second.set.find(
                            (p) => p.x == neighbour.x && p.y == neighbour.y,
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
