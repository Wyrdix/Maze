import { getDirections, getVectorFromDirection } from "$lib/2d";
import type { Settings } from ".";
import type { Rule } from "./grid";

export async function fileToImageData(file: File): Promise<ImageData> {
  const bitmap = await createImageBitmap(file);

  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;

  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(bitmap, 0, 0);

  return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

export async function generate(
  data: ImageData,
  N: number,
): Promise<Pick<Settings, "rules" | "tiles">> {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;

  const tilesX = Math.floor(data.width / N);
  const tilesY = Math.floor(data.height / N);

  canvas.width = tilesX;
  canvas.height = tilesY;

  const tileMap = new Map<string, number>();
  const cells: number[][] = [];

  let nextId = 0;

  function extractTile(x: number, y: number): string {
    // draw full image into temp canvas
    const full = document.createElement("canvas");
    full.width = data.width;
    full.height = data.height;

    const fctx = full.getContext("2d")!;
    fctx.putImageData(data, 0, 0);

    // copy region into N×N canvas
    ctx.clearRect(0, 0, tilesX, tilesY);
    ctx.drawImage(
      full,
      x * tilesX,
      y * tilesY,
      tilesX,
      tilesY,
      0,
      0,
      tilesX,
      tilesY,
    );

    return canvas.toDataURL("image/png");
  }

  for (let y = 0; y < tilesY; y++) {
    const row: number[] = [];

    for (let x = 0; x < tilesX; x++) {
      const img = extractTile(x, y);

      let id = tileMap.get(img);

      if (id == null) {
        id = nextId++;
        tileMap.set(img, id);
      }

      row.push(id);
    }

    cells.push(row);
  }

  const rules: Rule<number>[] = [];

  const dirs = getDirections();

  for (let y = 0; y < tilesY; y++) {
    for (let x = 0; x < tilesX; x++) {
      const source = cells[y][x];

      for (const dir of dirs) {
        const nx = x + getVectorFromDirection(dir).x;
        const ny = y + getVectorFromDirection(dir).y;

        if (nx < 0 || ny < 0 || nx >= tilesX || ny >= tilesY) continue;

        rules.push({
          source,
          direction: dir,
          target: cells[ny][nx],
        });
      }
    }
  }

  return {
    tiles: [...tileMap.keys()],
    rules,
  };
}
