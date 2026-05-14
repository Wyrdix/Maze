import type { Maze as MazeType } from "./maze";

export type MazeGenerator<
  Config,
  State,
  Maze extends MazeType<any, any, Maze>,
> = {
  initial_state: (maze: Maze) => State;
  config: Config;
  next: (
    maze: Maze,
    state: State,
  ) => { maze: Maze; state: State; done?: boolean }[];
};

export function generate<
  Config,
  State,
  Maze extends MazeType<any, any, Maze>,
  Generator extends MazeGenerator<Config, State, Maze>,
>(gen: Generator, maze: Maze): { maze: Maze; state: State }[] {
  let stack = [
    {
      maze: maze,
      state: gen.initial_state(maze),
    },
  ];

  let done = false;
  while (!done) {
    let last = stack[stack.length - 1];
    let next = gen.next(last.maze, last.state);
    done = next[next.length - 1].done ?? false;
    stack.push(...next.map((v) => ({ state: v.state, maze: v.maze })));
  }
  return stack;
}
