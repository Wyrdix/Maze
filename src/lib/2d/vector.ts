export type Vector = { x: number; y: number };

export function add(v1: Vector, v2: Vector) {
  return { x: v1.x + v2.x, y: v1.y - v2.y };
}

export function sub(v1: Vector, v2: Vector) {
  return { x: v1.x - v2.x, y: v1.y - v2.y };
}

export function mul(v: Vector, m: number) {
  return { x: v.x * m, y: v.y * m };
}
