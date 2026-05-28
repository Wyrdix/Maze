import { Generator, type Config } from "./generator";
import { generate, makeGrid } from "./grid";

self.onmessage = (event) => {
  const config = event.data as Config<number>;
  const gen = Generator(config, (a, b) => a == b);
  const initial = makeGrid<number>(config.dimensions, () => ({
    type: "superposition",
    value: [...config.values],
  }));

  const grids = generate(gen, initial);

  self.postMessage(grids);
};
