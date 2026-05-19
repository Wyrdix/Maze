import { generate } from "../generator";
import { Generator, type SpecializedMaze } from "./generation_by_sets";
import { createMaze } from "../maze";

self.onmessage = (event) => {
  const data = event.data as { rows: number; columns: number };
  const gen = Generator({});
  const initial: SpecializedMaze = createMaze(
    { rows: data.rows, columns: data.columns },
    () => false,
    () => false,
  );

  const mazes = generate(gen, initial);

  self.postMessage(
    mazes.map((v) => ({
      dimensions: v.maze.dimensions,
      cells: v.maze.cells,
      walls: v.maze.walls,
      state: v.state,
    })),
  );
};
