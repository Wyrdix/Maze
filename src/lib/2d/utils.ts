import type { Grid, Position } from "./grid";

export function getAllPositionsInside(grid: Grid<unknown>): Position[][] {
  return grid.cells.map((column, x) => column.map((_cell, y) => ({ x, y })));
}
