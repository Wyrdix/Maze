<script lang="ts" generics="Grid">
  import { type Snippet } from "svelte";
  import AnimationViewer from "./AnimationViewer.svelte";
  import type { Position } from "$lib/2d";

  let {
    frames: grids,
    index = $bindable(0),
    speed = $bindable(0),
    getDimension,
    gridCellViewer: gridCellViewer,
  }: {
    frames: Grid[];
    getDimension: (v: Grid) => { width: number; height: number };
    index?: number;
    speed?: number;
    gridCellViewer: Snippet<[Grid, Position]>;
  } = $props();
</script>

<AnimationViewer frames={grids} {index} {speed}>
  {#snippet display(grid)}
    {@const { width, height } = getDimension(grid)}
    <div class="flex-1 flex flex-col aspect-square mx-auto bg-stone-500">
      {#each Array.from({ length: height }, (_, row) => height - 1 - row) as row (row)}
        <div class="flex flex-row" style:height={`${100 / height}%`}>
          {#each Array.from({ length: width }, (_, col) => col) as col (col)}
            {@const position: Position = { y: row, x: col }}
            <div
              class="relative aspect-square *:w-full *:h-full"
              style:max-width={`${100 / width}%`}
            >
              {@render gridCellViewer(grid, position)}
            </div>
          {/each}
        </div>
      {/each}
    </div>
  {/snippet}
</AnimationViewer>
