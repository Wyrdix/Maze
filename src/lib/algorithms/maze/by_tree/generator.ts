/* eslint-disable @typescript-eslint/no-empty-object-type */
import {
  getDirectionFromTo,
  getNeighboursPosition,
  getOpposite,
  type Direction,
  type Position,
} from "$lib/2d";
import type { MazeGenerator } from "$lib/algorithms/maze/generator";
import { cell, set_cell, set_wall, type Maze } from "$lib/algorithms/maze/maze";

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
          x: Math.floor(Math.random() * maze.dimensions.width),
          y: Math.floor(Math.random() * maze.dimensions.height),
        };
        const randomCell = cell(maze, randomPos);

        return [
          {
            maze: set_cell(maze, randomPos, {
              ...randomCell,
              top: true,
            } as Cell),
            state: { stack: [randomPos], phase: "iteration" },
          },
        ];
      }

      const top = stack[0]!;

      const neighbours = getNeighboursPosition(maze, top).filter(
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
              } as Cell),
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
                } as Cell),
                top,
                {
                  ...cell(maze, top),
                  top: false,
                  unstack: true,
                } as Cell,
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

      const direction = getDirectionFromTo(top, randomNeighbour)!;

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
              } as Cell),
              randomNeighbour,
              {
                ...cell(maze, randomNeighbour),
                parent: getOpposite(direction),
                top: true,
                highlight: getOpposite(direction),
                visited: true,
              } as Cell,
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
              } as Cell),
              randomNeighbour,
              {
                ...cell(maze, randomNeighbour),
                parent: getOpposite(direction),
                top: true,
                visited: true,
              } as Cell,
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
