import type { Maze } from "./maze";

export type MazeGenerator<Config, State, Cell, Wall> = {
  initial_state: (maze: Maze<Cell, Wall>) => State;
  config: Config;
  next: (
    maze: Maze<Cell, Wall>,
    state: State,
  ) => { maze: Maze<Cell, Wall>; state: State; done?: boolean }[];
};

export function generate<Config, State, Cell, Wall>(
  gen: MazeGenerator<Config, State, Cell, Wall>,
  maze: Maze<Cell, Wall>,
): { maze: Maze<Cell, Wall>; state: State }[] {
  const stack = [
    {
      maze: maze,
      state: gen.initial_state(maze),
    },
  ];

  let done = false;
  while (!done) {
    const last = stack[stack.length - 1];
    const next = gen.next(last.maze, last.state);
    done = next[next.length - 1].done ?? false;
    stack.push(...next.map((v) => ({ state: v.state, maze: v.maze })));
  }
  return stack;
}
