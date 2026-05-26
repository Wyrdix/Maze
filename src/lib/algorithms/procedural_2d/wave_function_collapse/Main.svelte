<script lang="ts">
  import { getDirections } from "$lib/2d";
  import GridAnimationViewer from "$lib/components/GridAnimationViewer.svelte";
  import { Generator, type Config } from "./generator";
  import { cell as getCell, makeGrid, generate } from "./grid";

  const config: Config<number> = {
    values: [1, 2, 3],
    rules: [
      ...getDirections().map((dir) => ({
        source: 1,
        target: 1,
        direction: dir,
      })),
      ...getDirections().map((dir) => ({
        source: 1,
        target: 2,
        direction: dir,
      })),
      ...getDirections().map((dir) => ({
        source: 2,
        target: 2,
        direction: dir,
      })),
      ...getDirections().map((dir) => ({
        source: 2,
        target: 3,
        direction: dir,
      })),
    ],
  };
  const generator = Generator<number>(config, (a, b) => a == b);
  const grid = makeGrid<number>({ width: 10, height: 10 }, () => ({
    type: "superposition",
    value: [1, 2, 3],
  }));
  const value = generate(generator, grid, 10000);
</script>

<GridAnimationViewer
  frames={value.map((v) => v.grid)}
  getDimension={(v) => v.dimensions}
>
  {#snippet gridCellViewer(grid, position)}
    {@const cell = getCell(grid, position)}
    {#if cell.type === "superposition"}
      <div class="superposition flex flex-row flex-wrap">
        {#each cell.value as v (v)}
          <div>{v}</div>
        {/each}
      </div>
    {:else if cell.type === "collapsed"}
      <div
        class="collapsed"
        class:bg-red-500={cell.value === 3}
        class:bg-orange-500={cell.value === 2}
        class:bg-yellow-500={cell.value === 1}
      >
        {cell.value}
      </div>
    {:else}
      <div class="unknown">U</div>
    {/if}
  {/snippet}
</GridAnimationViewer>
