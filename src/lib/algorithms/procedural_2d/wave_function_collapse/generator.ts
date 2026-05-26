import {
  applyDirection,
  direction,
  directions,
  getOpposite,
  type Direction,
  type Position,
} from "$lib/algorithms/maze/maze";
import {
  cell as getCell,
  set_cell,
  type Cell,
  type Grid,
  type Rule,
  type WaveFunctionCollapseGenerator,
} from "./grid";

export type State<V> = {
  phase: "initial" | "iteration" | "done";
  suphase?: "updating";
  toUpdate?: Position[];
  values: V[];
};

export type Config<V> = { rules: Rule<V>[] };

export type SpecializedGenerator<Data> = WaveFunctionCollapseGenerator<
  Config<Data>,
  State<Data>,
  Data
>;

function getEntropy(
  _grid: Grid<unknown>,
  _position: Position,
  cell: Cell<unknown>,
) {
  switch (cell.type) {
    case "unknown":
      return Number.MAX_VALUE;
    case "collapsed":
      return -Number.MAX_VALUE;
    case "superposition":
      return cell.value.length;
  }
}

function getAvailable<Data>(state: State<Data>, cell: Cell<Data>): Data[] {
  return cell.type === "collapsed"
    ? [cell.value]
    : cell.type === "unknown"
      ? state.values
      : cell.value;
}

export function Generator<Data>(
  config: Config<Data>,
): SpecializedGenerator<Data> {
  return {
    initial_state() {
      const values: Data[] = [];

      config.rules
        .flatMap((v) => [v.source, v.target])
        .forEach((value) => {
          if (values.includes(value)) return;
          values.push(value);
        });

      return { phase: "initial", values };
    },
    config,
    next(grid, state) {
      if (state.phase === "done") return [{ grid, state, done: true }];

      if (state.suphase === "updating") {
        let currentGrid = grid;
        const toUpdate: Position[] = [];

        (state.toUpdate ?? [])
          .filter((position) => getCell(grid, position).type !== "collapsed")
          .forEach((position) => {
            const available = state.values.map(
              (data): { data: Data; found: Direction[] } => ({
                data,
                found: [],
              }),
            );

            config.rules
              .flatMap((rule): Rule<Data>[] => [
                rule,
                {
                  source: rule.target,
                  target: rule.source,
                  direction: getOpposite(rule.direction),
                },
              ])
              .filter(
                (rule) => available.find((a) => a.data === rule.source) != null,
              )
              .forEach((rule) => {
                const neighbour = getCell(
                  grid,
                  applyDirection(position, direction[rule.direction]),
                );

                if (neighbour == null) {
                  available
                    .find((a) => a.data === rule.source)!
                    .found.push(rule.direction);
                } else {
                  if (
                    getAvailable(state, neighbour).find((o) => o == rule.target)
                  ) {
                    available
                      .find((a) => a.data === rule.source)!
                      .found.push(rule.direction);
                  }
                }
              });

            const filtered = available.filter(
              (v) => directions.find((o) => !v.found.includes(o)) == null,
            );

            const present = getAvailable(state, getCell(grid, position));

            if (
              filtered.length !== available.length &&
              (present.length != filtered.length ||
                present.find(
                  (o) => filtered.find((q) => q.data == o) == null,
                ) != null)
            ) {
              toUpdate.push(
                ...directions
                  .map((v) => direction[v])
                  .map((d) => applyDirection(position, d))
                  .filter(
                    (v) =>
                      v.x >= 0 &&
                      v.y >= 0 &&
                      v.y < grid.dimensions.height &&
                      v.x < grid.dimensions.width,
                  ),
              );

              currentGrid = set_cell(
                currentGrid,
                position,
                filtered.length === 1
                  ? { type: "collapsed", value: filtered[0].data }
                  : {
                      type: "superposition",
                      value: filtered.map((v) => v.data),
                    },
              );
            }
          });

        if (toUpdate.length == 0)
          return [
            {
              grid,
              state: { ...state, suphase: undefined, toUpdate: undefined },
            },
          ];
        return [
          {
            grid: currentGrid,
            state: {
              ...state,
              toUpdate: toUpdate.reduceRight(
                (a, b) =>
                  a.find((o) => o.y === b.y && o.x === b.x) ? a : [...a, b],

                [] as Position[],
              ),
            },
          },
        ];
      }

      const entropy: {
        position: Position;
        entropy: number;
        cell: Cell<Data>;
      }[] = grid.cells
        .flatMap((column, x) =>
          column.map((cell, y) => ({
            position: { row: y, col: x },
            entropy: getEntropy(grid, { x: y, y: x }, cell),
            cell,
          })),
        )
        .filter((v) => v.entropy >= 0)
        .toSorted((a, b) => a.entropy - b.entropy);

      if (entropy.length === 0) throw Error("TODO");

      const slice = entropy.slice(
        0,
        entropy.findLastIndex((o) => entropy[0].entropy === o.entropy) + 1,
      );
      const collapsingIndex = 0; //Math.floor(Math.random() * slice.length);

      const { position, cell: collapsedCell } = slice[collapsingIndex]!;
      const values = getAvailable(state, collapsedCell);
      const index = Math.floor(Math.random() * values.length);
      const value = values[index];

      const newGrid = set_cell(grid, slice[collapsingIndex].position, {
        type: "collapsed",
        value,
      });

      return [
        {
          grid: newGrid,
          state: {
            ...state,
            phase: "iteration",
            suphase: "updating",
            toUpdate: directions
              .map((v) => direction[v])
              .map((d) => applyDirection(position, d))
              .filter(
                (v) =>
                  v.x >= 0 &&
                  v.y >= 0 &&
                  v.y < grid.dimensions.height &&
                  v.x < grid.dimensions.width,
              ),
          },
        },
      ];
    },
  };
}
