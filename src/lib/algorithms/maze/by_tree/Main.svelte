<script lang="ts">
  import MazeViewer from "../MazeAnimationViewer.svelte";
  import { type SpecializedMaze, type State } from "./generator";
  import { Circle, Cross } from "@lucide/svelte";

  import { onMount } from "svelte";
  import Worker from "./worker?worker";
  import { lookup } from "../../../components/TreeBoolean.svelte";
  import { getDirectionFromVector } from "$lib/2d";
  import type { Settings } from ".";

  let { settings = $bindable() }: { settings: Settings } = $props();

  let worker: Worker;

  onMount(() => {
    worker = new Worker();
  });

  let mazes: { maze: SpecializedMaze; state: State }[] = $state([]);

  $effect(() => {
    if (settings.generating) generateMaze();
  });

  function generateMaze() {
    worker.postMessage({ ...settings.dimensions });
    worker.onmessage = (event) => {
      const data = event.data as (Pick<
        SpecializedMaze,
        "dimensions" | "walls" | "cells"
      > & { state: State })[];
      mazes = data.map((v) => ({
        maze: {
          dimensions: v.dimensions,
          cells: v.cells,
          walls: v.walls,
        } satisfies SpecializedMaze,
        state: v.state,
      }));
      settings = { ...settings, generating: false };
    };
    worker.onerror = () => (settings = { ...settings, generating: false });
  }

  let filtered_mazes = $derived(
    mazes.filter(
      (v) =>
        v.state.phase != "iteration" ||
        v.state.subphase == null ||
        lookup(settings.animationsStepFilter, [v.state.subphase]),
    ),
  );
</script>

<MazeViewer mazes={filtered_mazes.map((v) => v.maze)}>
  {#snippet cellViewer(_maze, _pos, cell)}
    {@const paths = [
      ...(cell.children || []),
      ...(cell.parent ? [cell.parent] : []),
    ]}
    <div
      class="w-full h-full min-h-0 min-w-0 bg-gray-300 dark:bg-gray-700 rounded-md relative"
    >
      <div class="absolute w-full h-full grid grid-cols-3 grid-rows-3">
        {#each [1, 0, -1] as ymod (ymod)}
          {#each [-1, 0, 1] as xmod (xmod)}
            {@const dir = getDirectionFromVector({ y: ymod, x: xmod })}
            <div
              class={`${(dir != null && paths.find((o) => o == dir) != null) || ((paths.length != 0 || cell.top) && ymod == 0 && xmod == 0) ? (cell.highlight != null && paths.includes(cell.highlight) ? "bg-stone-800" : "bg-white") : ""}`}
            ></div>
          {/each}
        {/each}
      </div>
      <div
        class="absolute w-full h-full transition-all flex items-center justify-center"
      >
        {#if cell.top}
          <Circle class="fill-brand **:size-5" />
        {:else if cell.unstack}
          <Cross class="fill-brand-soft rotate-45 **:size-5" />
        {/if}
      </div>
    </div>
  {/snippet}
</MazeViewer>
{#if mazes.length == 0}
  <div
    class="absolute w-full h-full left-0 backdrop-blur-sm flex justify-center items-center flex-1"
  >
    <h2 class="center inline text-xl">No data</h2>
  </div>
{/if}
