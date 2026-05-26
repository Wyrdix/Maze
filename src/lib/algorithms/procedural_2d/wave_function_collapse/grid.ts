import {
  makeGrid as makeGrid_general,
  type Dimensions,
  type Direction,
  type Grid as Grid_general,
  type Position,
} from "$lib/2d";

export type Cell<V> =
  | { type: "collapsed"; readonly value: V }
  | { type: "superposition"; readonly value: V[] };

export type Rule<V> = {
  readonly source: V;
  direction: Direction;
  readonly target: V;
};

export type Grid<Data> = Grid_general<Cell<Data>>;

export { cell, set_cell } from "$lib/2d";

export function makeGrid<Data>(
  dimensions: Dimensions,
  initial: (position: Position) => Cell<Data>,
): Grid<Data> {
  return makeGrid_general(dimensions, initial);
}

export type WaveFunctionCollapseGenerator<Config, State, Data> = {
  initial_state: (maze: Grid<Data>) => State;
  config: Config;
  next: (
    grid: Grid<Data>,
    state: State,
  ) => { grid: Grid<Data>; state: State; done?: boolean }[];
};

export function generate<Config, State, Data>(
  gen: WaveFunctionCollapseGenerator<Config, State, Data>,
  grid: Grid<Data>,
  max_iterations = Number.MAX_VALUE,
): { grid: Grid<Data>; state: State }[] {
  const stack = [
    {
      grid: grid,
      state: gen.initial_state(grid),
    },
  ];

  let done = false;
  let iteration = 0;
  while (!done && iteration < max_iterations) {
    const last = stack[stack.length - 1];
    const next = gen.next(last.grid, last.state);
    done = next[next.length - 1].done ?? false;
    stack.push(...next.map((v) => ({ state: v.state, grid: v.grid })));
    iteration++;
  }
  return stack;
}
