<script lang="ts">
  import MazeViewer from "../MazeAnimationViewer.svelte";
  import { type SpecializedMaze, type State } from "./generator";
  import { lookup } from "../../../components/TreeBoolean.svelte";

  import { onMount } from "svelte";
  import Worker from "./worker?worker";
  import type { Settings } from ".";

  let { settings = $bindable() }: { settings: Settings } = $props();

  let worker: Worker;

  onMount(() => {
    worker = new Worker();
  });

  let mazes: { maze: SpecializedMaze; state: State }[] = $state([]);

  $effect(() => {
    if (settings.generating) {
      generateMaze();
    }
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

      settings.generating = false;
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
    <div
      class="w-full h-full min-h-0 min-w-0 bg-gray-300 dark:bg-gray-700 rounded-md"
    >
      <div
        class="w-full h-full transition-all"
        class:bg-blue-400={cell == "first"}
        class:bg-red-400={cell == "second"}
        class:bg-yellow-400={cell == "neighbour"}
      ></div>
    </div>
  {/snippet}
</MazeViewer>
{#if mazes.length == 0}
  <div
    class="absolute w-full h-full left-0 backdrop-blur-sm flex justify-center items-center"
  >
    <h2 class="center inline text-xl">No data</h2>
  </div>
{/if}
