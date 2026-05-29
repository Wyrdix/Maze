<script lang="ts">
  import GridAnimationViewer from "$lib/components/GridAnimationViewer.svelte";
  import { onMount } from "svelte";
  import type { Settings } from ".";
  import { type Config, type State } from "./generator";
  import { cell as getCell, type Grid } from "./grid";
  import Worker from "./worker?worker";

  let { settings = $bindable() }: { settings: Settings } = $props();

  let worker: Worker;

  onMount(() => {
    worker = new Worker();
  });

  $effect(() => {
    if (settings.generating) generate();
  });

  function generate() {
    const config: Config<number> = JSON.parse(
      JSON.stringify({
        dimensions: settings.dimensions,
        rules: settings.rules,
        values: Array.from({ length: settings.tiles.length }).map((_, i) => i),
      }),
    );

    console.log(JSON.stringify(config));
    worker.postMessage(config);
    worker.onmessage = (event) => {
      grids = event.data as { grid: Grid<number>; state: State<number> }[];
      settings = { ...settings, generating: false };
    };
    worker.onerror = () => {
      settings = { ...settings, generating: false };
    };
  }

  let grids: { grid: Grid<number>; state: State<number> }[] = $state([]);
</script>

{#snippet tileAsset(
  tile: string | undefined,
  index: number,
  n: number = settings.tiles.length,
)}<div
    class="flex-none aspect-square relative p-0 flex justify-center items-center border border-black dark:border-white"
    style={`width: ${100 / n}%; height: ${100 / n}%;`}
  >
    {#if tile}
      <img class="absolute size-full" src={tile} alt={`Tile number ${index}`} />
    {:else}
      {index}
    {/if}
  </div>
{/snippet}

<GridAnimationViewer
  frames={grids.map((v) => v.grid)}
  getDimension={(v) => v.dimensions}
>
  {#snippet gridCellViewer(grid, position)}
    {@const cell = getCell(grid, position)}
    {#if cell.type === "superposition"}
      {@const grid_n = Math.ceil(Math.sqrt(cell.value.length))}
      <div
        class="superposition flex flex-row flex-wrap w-full h-full overflow-hidden gap-0"
      >
        {#each cell.value as v (v)}
          {@render tileAsset(settings.tiles[v], v, grid_n)}
        {/each}
      </div>
    {:else}
      {@render tileAsset(settings.tiles[cell.value], cell.value, 1)}
    {/if}
  {/snippet}
</GridAnimationViewer>
{#if grids.length == 0}
  <div
    class="absolute w-full h-full left-0 backdrop-blur-sm flex justify-center items-center flex-1"
  >
    <h2 class="center inline text-xl">No data</h2>
  </div>
{/if}

<style>
  img {
    image-rendering: optimizeSpeed; /* STOP SMOOTHING, GIVE ME SPEED  */
    image-rendering: -moz-crisp-edges; /* Firefox                        */
    image-rendering: -o-crisp-edges; /* Opera                          */
    image-rendering: -webkit-optimize-contrast; /* Chrome (and eventually Safari) */
    image-rendering: pixelated; /* Universal support since 2021   */
    image-rendering: optimize-contrast; /* CSS3 Proposed                  */
    -ms-interpolation-mode: nearest-neighbor; /* IE8+                           */
  }
</style>
