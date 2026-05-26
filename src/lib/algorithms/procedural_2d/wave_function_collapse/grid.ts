import type { Direction, Position } from "$lib/algorithms/maze/maze";

export type Cell<V> =
  | {
      type: "unknown";
    }
  | { type: "collapsed"; readonly value: V }
  | { type: "superposition"; readonly value: V[] };

export type Rule<V> = {
  readonly source: V;
  direction: Direction;
  readonly target: V;
};

export type Grid<V> = {
  dimensions: Dimension;
  cells: Cell<V>[][];
};

export type Dimension = { width: number; height: number };

export function cell<V>(grid: Grid<V>, position: Position): Cell<V> {
  return grid.cells[position.x]?.[position.y];
}
export function set_cell<V>(
  grid: Grid<V>,
  position: Position,
  cell: Cell<V>,
): Grid<V> {
  const newCells = [...grid.cells];
  newCells[position.x] = [...newCells[position.x]];
  newCells[position.x][position.y] = cell;
  return {
    ...grid,
    cells: newCells,
  };
}

export function createGrid<V>(dimensions: Dimension): Grid<V> {
  return {
    dimensions,
    cells: Array.from({ length: dimensions.width }, () =>
      Array.from({ length: dimensions.height }, () => ({
        type: "unknown",
      })),
    ),
  };
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
