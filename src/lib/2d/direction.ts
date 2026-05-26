import type { Position } from "./grid";
import { add, sub, type Vector } from "./vector";

const directionObj = {
  north: { x: 0, y: 1 },
  east: { x: 1, y: 0 },
  south: { x: 0, y: -1 },
  west: { x: -1, y: 0 },
} as const;

export type Direction = keyof typeof directionObj;
export type DirectionMod = (typeof directionObj)[Direction] & Vector;

export function getMovedAlongDirection(
  position: Position,
  direction: Direction,
): Position {
  return add(position, directionObj[direction]);
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

export function getDirectionFromVector(vector: Vector): Direction | undefined {
  return Object.entries(directionObj).find(
    ([, value]) => value.x == vector.x && value.y == vector.y,
  )?.[0] as Direction | undefined;
}

export function getVectorFromDirection(direction: Direction): Vector {
  return directionObj[direction];
}

export function getDirectionFromTo(
  initial: Position,
  target: Position,
): Direction | undefined {
  return getDirectionFromVector(sub(target, initial));
}

export function getDirections(): Direction[] {
  return Object.keys(directionObj).map((v) => v as Direction);
}
