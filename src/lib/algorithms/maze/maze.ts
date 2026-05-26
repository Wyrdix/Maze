import type { Grid, Position, Direction, Dimensions } from "$lib/2d";

export interface Maze<Cell, Wall> extends Grid<Cell> {
  walls: {
    horizontal: Wall[][];
    verical: Wall[][];
  };
}

export { cell, set_cell } from "$lib/2d";

export function wall<Wall>(
  maze: Maze<unknown, Wall>,
  position: Position,
  direction: Direction,
): Wall {
  switch (direction) {
    case "north":
      return maze.walls.horizontal[position.y + 1][position.x];
    case "south":
      return maze.walls.horizontal[position.y][position.x];
    case "east":
      return maze.walls.verical[position.y][position.x + 1];
    case "west":
      return maze.walls.verical[position.y][position.x];
  }
}

export function set_wall<Cell, Wall>(
  maze: Maze<Cell, Wall>,
  position: Position,
  direction: Direction,
  wall: Wall,
): Maze<Cell, Wall> {
  const newHorizontalWalls = maze.walls.horizontal.map((y) => [...y]);
  const newVerticalWalls = maze.walls.verical.map((y) => [...y]);

  switch (direction) {
    case "north":
      newHorizontalWalls[position.y + 1][position.x] = wall;
      break;
    case "south":
      newHorizontalWalls[position.y][position.x] = wall;
      break;
    case "east":
      newVerticalWalls[position.y][position.x + 1] = wall;
      break;
    case "west":
      newVerticalWalls[position.y][position.x] = wall;
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

export function createMaze<Cell, Wall>(
  dimensions: Dimensions,
  initial_cell: (pos: Position) => Cell,
  initial_wall: (pos: Position, dir: Direction) => Wall,
): Maze<Cell, Wall> {
  const { height, width } = dimensions;

  return {
    dimensions,
    cells: Array.from({ length: height }, (_, y) =>
      Array.from({ length: width }, (_, x) => initial_cell({ y: y, x: x })),
    ),
    walls: {
      verical: Array.from({ length: height }, (_, y) =>
        Array.from({ length: width + 1 }, (_, x) =>
          x == width
            ? initial_wall({ y: y, x: x }, "east")
            : initial_wall({ y: y, x: x }, "west"),
        ),
      ),
      horizontal: Array.from({ length: height + 1 }, (_, y) =>
        Array.from({ length: width }, (_, x) =>
          y == height
            ? initial_wall({ y: y, x: x }, "north")
            : initial_wall({ y: y, x: x }, "south"),
        ),
      ),
    },
  };
}
