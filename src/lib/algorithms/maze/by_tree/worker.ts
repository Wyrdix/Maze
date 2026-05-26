import { generate } from "$lib/algorithms/maze/generator";
import { Generator, type SpecializedMaze } from "./generator";
import { createMaze } from "$lib/algorithms/maze/maze";

self.onmessage = (event) => {
  const data = event.data as { height: number; width: number };
  const gen = Generator({});
  const initial: SpecializedMaze = createMaze(
    { height: data.height, width: data.width },
    () => ({
      visited: false,
      parent: undefined,
      children: undefined,
      top: undefined,
    }),
    () => true,
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
