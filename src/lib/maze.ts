export type Vector = { row: number; col: number };
export type Position = Vector;

export const direction = {
  north: { row: 1, col: 0 },
  east: { row: 0, col: 1 },
  south: { row: -1, col: 0 },
  west: { row: 0, col: -1 },
} as const;

export type DirectionMod = typeof direction;

export type Direction = keyof DirectionMod;

export interface Maze<Cell, Wall, T extends Maze<Cell, Wall, T>> {
  dimensions: [number, number];

  cell: (position: Position) => Cell;
  wall: (position: Position, direction: Direction) => Wall;

  set_cell: (position: Position, cell: Cell) => T;
  set_wall: (position: Position, direction: Direction, wall: Wall) => T;
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

export class DefaultMazeImplementation<Cell, Wall> implements Maze<
  Cell,
  Wall,
  DefaultMazeImplementation<Cell, Wall>
> {
  dimensions: [number, number];
  cells: Cell[][];
  walls: {
    horizontal: Wall[][];
    verical: Wall[][];
  };
  constructor(
    dimensions: Maze<Cell, Wall, any>["dimensions"],
    cells: Cell[][],
    walls: {
      horizontal: Wall[][];
      verical: Wall[][];
    },
  ) {
    const [rows, cols] = dimensions;
    this.dimensions = [rows, cols];
    this.cells = cells;
    this.walls = walls;
  }

  cell = (position: Position) => this.cells[position.row][position.col];

  wall = (position: Position, direction: Direction) => {
    switch (direction) {
      case "north":
        return this.walls.horizontal[position.row + 1][position.col];
      case "south":
        return this.walls.horizontal[position.row][position.col];
      case "east":
        return this.walls.verical[position.row][position.col + 1];
      case "west":
        return this.walls.verical[position.row][position.col];
    }
  };

  set_cell = (position: Position, cell: Cell) => {
    const newCells = [...this.cells];
    newCells[position.row] = [...newCells[position.row]];
    newCells[position.row][position.col] = cell;
    return new DefaultMazeImplementation(this.dimensions, newCells, this.walls);
  };
  set_wall = (position: Position, direction: Direction, wall: Wall) => {
    const newHorizontalWalls = this.walls.horizontal.map((row) => [...row]);
    const newVerticalWalls = this.walls.verical.map((row) => [...row]);

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

    return new DefaultMazeImplementation(this.dimensions, this.cells, {
      horizontal: newHorizontalWalls,
      verical: newVerticalWalls,
    });
  };
}

export function buildMaze<Cell, Wall>(
  dimensions: Maze<Cell, Wall, any>["dimensions"],
  initial_cell: (pos: Position) => Cell,
  initial_wall: (pos: Position, dir: Direction) => Wall,
): DefaultMazeImplementation<Cell, Wall> {
  const [rows, cols] = dimensions;

  return new DefaultMazeImplementation(
    dimensions,
    Array.from({ length: rows }, (_, row) =>
      Array.from({ length: cols }, (_, col) => initial_cell({ row, col })),
    ),
    {
      verical: Array.from({ length: rows }, (_, row) =>
        Array.from({ length: cols + 1 }, (_, col) =>
          col == cols
            ? initial_wall({ row, col }, "east")
            : initial_wall({ row, col }, "west"),
        ),
      ),
      horizontal: Array.from({ length: rows + 1 }, (_, row) =>
        Array.from({ length: cols }, (_, col) =>
          row == rows
            ? initial_wall({ row, col }, "north")
            : initial_wall({ row, col }, "south"),
        ),
      ),
    },
  );
}
