export type Vector = { row: number; col: number };
export type Position = Vector;

export const direction = {
  north: { row: 1, col: 0 },
  east: { row: 0, col: 1 },
  south: { row: -1, col: 0 },
  west: { row: 0, col: -1 },
} as const;

export type DirectionMod = typeof direction;

export type MazeDimension = {
  rows: number;
  columns: number;
};

export type Direction = keyof DirectionMod;

export const directions = Object.keys(direction) as Direction[];

export interface Maze<Cell, Wall> {
  dimensions: MazeDimension;
  cells: Cell[][];
  walls: {
    horizontal: Wall[][];
    verical: Wall[][];
  };
}

export function cell<Cell>(
  maze: Maze<Cell, unknown>,
  position: Position,
): Cell {
  return maze.cells[position.row][position.col];
}

export function wall<Wall>(
  maze: Maze<unknown, Wall>,
  position: Position,
  direction: Direction,
): Wall {
  switch (direction) {
    case "north":
      return maze.walls.horizontal[position.row + 1][position.col];
    case "south":
      return maze.walls.horizontal[position.row][position.col];
    case "east":
      return maze.walls.verical[position.row][position.col + 1];
    case "west":
      return maze.walls.verical[position.row][position.col];
  }
}

export function set_cell<Cell, Wall>(
  maze: Maze<Cell, Wall>,
  position: Position,
  cell: Cell,
): Maze<Cell, Wall> {
  const newCells = [...maze.cells];
  newCells[position.row] = [...newCells[position.row]];
  newCells[position.row][position.col] = cell;
  return {
    ...maze,
    cells: newCells,
  };
}

export function set_wall<Cell, Wall>(
  maze: Maze<Cell, Wall>,
  position: Position,
  direction: Direction,
  wall: Wall,
): Maze<Cell, Wall> {
  const newHorizontalWalls = maze.walls.horizontal.map((row) => [...row]);
  const newVerticalWalls = maze.walls.verical.map((row) => [...row]);

  switch (direction) {
    case "north":
      newHorizontalWalls[position.row + 1][position.col] = wall;
      break;
    case "south":
      newHorizontalWalls[position.row][position.col] = wall;
      break;
    case "east":
      newVerticalWalls[position.row][position.col + 1] = wall;
      break;
    case "west":
      newVerticalWalls[position.row][position.col] = wall;
      break;
  }

  return {
    ...maze,
    walls: {
      horizontal: newHorizontalWalls,
      verical: newVerticalWalls,
    },
  };
}

export function getOpposite(direction: Direction): Direction {
  switch (direction) {
    case "north":
      return "south";
    case "east":
      return "west";
    case "south":
      return "north";
    case "west":
      return "east";
  }
}

export function getDirectionFromMod(vector: Vector): Direction | undefined {
  return Object.entries(direction).find(
    ([, value]) => value.col == vector.col && value.row == vector.row,
  )?.[0] as Direction | undefined;
}

export function getDirection(
  from: Position,
  to: Position,
): Direction | undefined {
  const mod = { row: to.row - from.row, col: to.col - from.col };

  return (
    (Object.entries(direction).find(
      (value) => value[1].col == mod.col && value[1].row == mod.row,
    )?.[0] as Direction) ?? undefined
  );
}

export function applyDirection(pos: Position, normal: Vector): Position {
  return { row: pos.row + normal.row, col: pos.col + normal.col };
}

export function getNeighbours(
  maze: Maze<unknown, unknown>,
  position: Position,
): Position[] {
  return directions
    .map((dir) => applyDirection(position, direction[dir]))
    .filter(
      (v) =>
        v.col >= 0 &&
        v.row >= 0 &&
        v.row < maze.dimensions.rows &&
        v.col < maze.dimensions.columns,
    );
}

export function createMaze<Cell, Wall>(
  dimensions: Maze<Cell, Wall>["dimensions"],
  initial_cell: (pos: Position) => Cell,
  initial_wall: (pos: Position, dir: Direction) => Wall,
): Maze<Cell, Wall> {
  const { rows, columns } = dimensions;

  return {
    dimensions,
    cells: Array.from({ length: rows }, (_, row) =>
      Array.from({ length: columns }, (_, col) => initial_cell({ row, col })),
    ),
    walls: {
      verical: Array.from({ length: rows }, (_, row) =>
        Array.from({ length: columns + 1 }, (_, col) =>
          col == columns
            ? initial_wall({ row, col }, "east")
            : initial_wall({ row, col }, "west"),
        ),
      ),
      horizontal: Array.from({ length: rows + 1 }, (_, row) =>
        Array.from({ length: columns }, (_, col) =>
          row == rows
            ? initial_wall({ row, col }, "north")
            : initial_wall({ row, col }, "south"),
        ),
      ),
    },
  };
}
