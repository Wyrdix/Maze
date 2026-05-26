<script lang="ts">
  import { directions } from "$lib/algorithms/maze/maze";
  import GridAnimationViewer from "$lib/components/GridAnimationViewer.svelte";
  import { Generator, type Config } from "./generator";
  import { cell as getCell, createGrid, generate } from "./grid";

  const config: Config<number> = {
    rules: [
      ...directions.map((dir) => ({ source: 1, target: 1, direction: dir })),
      ...directions.map((dir) => ({ source: 1, target: 2, direction: dir })),
      ...directions.map((dir) => ({ source: 2, target: 3, direction: dir })),
    ],
  };
  const generator = Generator<number>(config);
  const grid = createGrid<number>({ width: 3, height: 3 });
  const value = generate(generator, grid, 20);
  $inspect(value);
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
