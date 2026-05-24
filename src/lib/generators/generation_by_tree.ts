/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { MazeGenerator } from "$lib/generator";
import {
  cell,
  getDirection,
  getNeighbours,
  getOpposite,
  set_cell,
  set_wall,
  type Direction,
  type Maze,
  type Position,
} from "$lib/maze";

export type State = {
  phase: "initial" | "iteration" | "done";
  subphase?: "pop" | "descend";
  stack: Position[];
};

export type Config = {};

export type Cell = {
  parent?: Direction;
  children?: Direction[];
  highlight?: Direction;
  visited: boolean;
  top?: boolean;
  unstack?: boolean;
};

export type Wall = boolean;

export type SpecializedMaze = Maze<Cell, Wall>;

export type SpecializedGenerator = MazeGenerator<Config, State, Cell, Wall>;

export function Generator(config: Config): SpecializedGenerator {
  return {
    config,
    initial_state() {
      return { phase: "initial", stack: [] };
    },
    next(maze, { phase, stack }) {
      if (stack.length == 0 && phase != "initial")
        return [{ maze, state: { stack, phase: "done" }, done: true }];

      if (stack.length == 0) {
        const randomPos: Position = {
          col: Math.floor(Math.random() * maze.dimensions.columns),
          row: Math.floor(Math.random() * maze.dimensions.rows),
        };
        const randomCell = cell(maze, randomPos);

        return [
          {
            maze: set_cell(maze, randomPos, { ...randomCell, top: true }),
            state: { stack: [randomPos], phase: "iteration" },
          },
        ];
      }

      const top = stack[0]!;

      const neighbours = getNeighbours(maze, top).filter(
        (position) => !cell(maze, position).visited,
      );

      if (neighbours.length == 0) {
        if (stack.length == 1)
          return [
            {
              maze: set_cell(maze, top, {
                ...cell(maze, top),
                top: false,
                unstack: true,
              }),
              state: {
                subphase: "pop",
                phase: "iteration",
                stack: stack.slice(1),
              },
            },
          ];
        else {
          const stackE = cell(maze, stack[1]);

          return [
            {
              maze: set_cell(
                set_cell(maze, stack[1], {
                  ...stackE,
                  top: true,
                }),
                top,
                {
                  ...cell(maze, top),
                  top: false,
                  unstack: true,
                },
              ),
              state: {
                subphase: "pop",
                phase: "iteration",
                stack: stack.slice(1),
              },
            },
          ];
        }
      }

      const randomNeighbour =
        neighbours[Math.floor(Math.random() * neighbours.length)];

      const direction = getDirection(top, randomNeighbour)!;

      const topCell = cell(maze, top);
      return [
        {
          maze: set_wall(
            set_cell(
              set_cell(maze, top, {
                ...topCell,
                children: [...(topCell.children ?? []), direction],
                top: false,
                visited: true,
              }),
              randomNeighbour,
              {
                ...cell(maze, randomNeighbour),
                parent: getOpposite(direction),
                top: true,
                highlight: getOpposite(direction),
                visited: true,
              },
            ),
            top,
            direction,
            false,
          ),
          state: {
            phase: "iteration",
            stack: [randomNeighbour, ...stack],
            subphase: "descend",
          },
        },
        {
          maze: set_wall(
            set_cell(
              set_cell(maze, top, {
                ...topCell,
                children: [...(topCell.children ?? []), direction],
                top: false,
                visited: true,
              }),
              randomNeighbour,
              {
                ...cell(maze, randomNeighbour),
                parent: getOpposite(direction),
                top: true,
                visited: true,
              },
            ),
            top,
            direction,
            false,
          ),
          state: {
            phase: "iteration",
            stack: [randomNeighbour, ...stack],
            subphase: undefined,
          },
        },
      ];
    },
  };
}
