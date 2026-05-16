import { generate } from "./generator";
import {
  Generator,
  type SpecializedGenerator,
  type SpecializedMaze,
  type State,
} from "./generators/generation_by_sets";
import { buildMaze, type DefaultMazeImplementation } from "./maze";

self.onmessage = (event) => {
  const data = event.data as { rows: number; cols: number };
  const gen = Generator({});
  const initial: DefaultMazeImplementation<
    "first" | "second" | "neighbour" | false,
    boolean
  > = buildMaze(
    [data.rows, data.cols],
    (): "first" | "second" | "neighbour" | false => false,
    () => false,
  );

  const mazes = generate<{}, State, SpecializedMaze, SpecializedGenerator>(
    gen,
    initial,
  );

  self.postMessage(
    mazes.map((v) => ({
      dimensions: v.maze.dimensions,
      cells: v.maze.cells,
      walls: v.maze.walls,
      state: v.state,
    })),
  );
};
