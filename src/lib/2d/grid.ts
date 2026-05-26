import { getDirections, getMovedAlongDirection } from "./direction";
import { add, type Vector } from "./vector";

export type Dimensions = { width: number; height: number };

export type Grid<Data> = {
  readonly dimensions: Dimensions;
  readonly cells: Data[][];
};

export type Position = { x: number; y: number };

export function getMovedAlongVector(
  position: Position,
  vector: Vector,
): Position {
  return add(position, vector);
}

export function getNeighboursPosition(
  grid: Grid<unknown>,
  position: Position,
): Position[] {
  return getDirections()
    .map((direction) => getMovedAlongDirection(position, direction))
    .filter((v) => isInBound(grid, v));
}

export function isInBound(grid: Grid<unknown>, position: Position) {
  return (
    position.y >= 0 &&
    position.x >= 0 &&
    position.x < grid.dimensions.width &&
    position.y < grid.dimensions.height
  );
}

export function makeGrid<Data>(
  dimensions: Dimensions,
  initial: (position: Position) => Data,
): Grid<Data> {
  return {
    dimensions,
    cells: Array.from({ length: dimensions.width }, (_, x) =>
      Array.from({ length: dimensions.height }, (_, y) => initial({ x, y })),
    ),
  };
}

export function cell<Data>(grid: Grid<Data>, position: Position): Data {
  return grid.cells[position.x]?.[position.y];
}
export function set_cell<Data, GridE extends Grid<Data>>(
  grid: GridE,
  position: Position,
  cell: Data | ((value: Data) => Data),
): GridE {
  const newCells = [...grid.cells];
  newCells[position.x] = [...newCells[position.x]];

  const previous_value = newCells[position.x][position.y];

  newCells[position.x][position.y] =
    typeof cell === "function"
      ? (cell as (value: Data) => Data)(previous_value)
      : cell;

  return {
    ...grid,
    cells: newCells,
  };
}
