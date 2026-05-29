import {
  getAllPositionsInside,
  getDirections,
  getMovedAlongDirection,
  getNeighboursPosition,
  getOpposite,
  isInBound,
  type Dimensions,
  type Direction,
  type Position,
} from "$lib/2d";
import { GenericSet, type EqualityFn } from "$lib/set";
import { shuffle } from "$lib/utils";
import {
  cell as getCell,
  set_cell,
  type Cell,
  type Grid,
  type Rule,
  type WaveFunctionCollapseGenerator,
} from "./grid";

type Choice<Data> = {
  position: Position;
  snapshot: Grid<Data>;
  index: number;
  order: Data[];
};

export type State<Data> = {
  phase: "initial" | "iteration" | "done";
  suphase?: "updating";
  updatingQueue?: Position[];
  choices: Choice<Data>[];
};

export type Config<Data> = {
  dimensions: Dimensions;
  rules: Rule<Data>[];
  values: Data[];
};

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
    case "collapsed":
      return -Number.MAX_VALUE;
    case "superposition":
      return cell.value.length;
  }
}

function getAvailable<Data>(
  values: GenericSet<Data>,
  cell: Cell<Data>,
): GenericSet<Data> {
  return cell.type === "collapsed"
    ? GenericSet.from([cell.value], values.equalityFn)
    : GenericSet.from(cell.value, values.equalityFn);
}

export function Generator<Data>(
  config: Config<Data>,
  eqFn: EqualityFn<Data>,
): SpecializedGenerator<Data> {
  const stateSet = GenericSet.from(config.values, eqFn);

  return {
    initial_state() {
      return { phase: "initial", choices: [] };
    },
    config,
    next(grid, state) {
      if (state.phase === "done") return [{ grid, state, done: true }];

      if (state.suphase === "updating") {
        let currentGrid = grid;
        let toUpdate: GenericSet<Position> = GenericSet.of(
          (a, b) => a.x == b.x && a.y === b.y,
        );

        (state.updatingQueue ?? [])
          .filter((position) => getCell(grid, position).type !== "collapsed")
          .forEach((position) => {
            const possible = GenericSet.from(
              config.values.filter((data) => {
                const rules = [
                  ...config.rules,
                  ...config.rules.map((v) => ({
                    source: v.target,
                    target: v.source,
                    direction: getOpposite(v.direction),
                  })),
                ].filter((v) => eqFn(v.source, data));

                const available = new Map<Direction, boolean>(
                  getDirections().map((d) => [
                    d,
                    !isInBound(grid, getMovedAlongDirection(position, d)),
                  ]),
                );

                rules.forEach((rule) => {
                  if (available.get(rule.direction) == true) return;
                  const targetPosition = getMovedAlongDirection(
                    position,
                    rule.direction,
                  );

                  if (isInBound(grid, targetPosition)) {
                    const targetCell = getCell(currentGrid, targetPosition);
                    const targetAvailable = getAvailable(stateSet, targetCell);

                    if (targetAvailable.has(rule.target))
                      available.set(rule.direction, true);
                  }
                });
                return available.values().find((o) => !o) == null;
              }),
              eqFn,
            );

            const present = getAvailable(
              stateSet,
              getCell(currentGrid, position),
            );

            if (possible.intersect(present).size !== present.size) {
              toUpdate = toUpdate.add(
                ...getDirections()
                  .map((d) => getMovedAlongDirection(position, d))
                  .filter((v) => isInBound(grid, v)),
              );

              currentGrid = set_cell(
                currentGrid,
                position,
                possible.size === 1
                  ? { type: "collapsed", value: possible.values()[0] }
                  : ({
                      type: "superposition",
                      value: possible.values(),
                    } as Cell<Data>),
              );
            }
          });

        if (toUpdate.size == 0)
          return [
            {
              grid,
              state: { ...state, suphase: undefined, updatingQueue: undefined },
            },
          ];
        return [
          {
            grid: currentGrid,
            state: {
              ...state,
              updatingQueue: toUpdate.values(),
            },
          },
        ];
      }

      const positions = shuffle(getAllPositionsInside(grid).flat());

      const cells = positions.map((position) => ({
        position,
        cell: getCell(grid, position),
      }));

      const problem = cells.find(
        (o) => o.cell.type === "superposition" && o.cell.value.length === 0,
      )?.position;

      if (problem != null) {
        const choice = state.choices[0];
        if (choice == null) return [{ done: true, grid, state }];
        if (choice.index === choice.order.length - 1)
          return [
            {
              grid,
              state: {
                ...state,
                choices: [...state.choices.slice(1)],
                phase: "iteration",
                suphase: "updating",
              },
            },
          ];
        return [
          {
            grid: set_cell(choice.snapshot, choice.position, {
              type: "collapsed",
              value: choice.order[choice.index + 1],
            } as Cell<Data>),
            state: {
              ...state,
              choices: [
                { ...choice, index: choice.index + 1 },
                ...state.choices.slice(1),
              ],
              phase: "iteration",
              suphase: "updating",
              updatingQueue: getNeighboursPosition(grid, choice.position),
            },
          },
        ];
      }

      const entropy: {
        position: Position;
        entropy: number;
        cell: Cell<Data>;
      }[] = positions
        .map((position) => {
          const cell = getCell(grid, position);
          return {
            position,
            entropy: getEntropy(grid, position, cell),
            cell,
          };
        })
        .filter((v) => v.entropy >= 0)
        .toSorted((a, b) => a.entropy - b.entropy);

      if (entropy.length === 0)
        return [{ grid, state: { ...state, phase: "done" }, done: true }];

      const slice = entropy.slice(
        0,
        entropy.findLastIndex((o) => entropy[0].entropy === o.entropy) + 1,
      );
      const collapsingIndex = 0; //Math.floor(Math.random() * slice.length);

      const { position, cell: collapsedCell } = slice[collapsingIndex]!;
      const values = shuffle(getAvailable(stateSet, collapsedCell).values());
      const value = values[0];

      const newGrid = set_cell(grid, slice[collapsingIndex].position, {
        type: "collapsed",
        value,
      } as Cell<Data>);

      return [
        {
          grid: newGrid,
          state: {
            ...state,
            phase: "iteration",
            suphase: "updating",
            updatingQueue: getNeighboursPosition(grid, position),
            choices: [
              { index: 0, order: values, position, snapshot: grid },
              ...state.choices,
            ],
          },
        },
      ];
    },
  };
}
