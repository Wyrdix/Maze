<script lang="ts">
  import {
    Accordion,
    AccordionItem,
    Button,
    Input,
    Label,
  } from "flowbite-svelte";
  import MazeViewer from "../../GenericMazeViewer.svelte";
  import {
    type SpecializedMaze,
    type State,
  } from "$lib/generators/generation_by_tree";
  import { Circle, Cross, Factory, RefreshCcw, Settings } from "lucide-svelte";
  import type { TreeValue } from "../../general/TreeBoolean.svelte";

  import { onMount } from "svelte";
  import Worker from "$lib/generators/maze_generation_by_tree.worker?worker";
  import { getDirectionFromMod } from "$lib/maze";

  let rows = $state(3);
  let columns = $state(3);

  let worker: Worker;

  onMount(() => {
    worker = new Worker();
  });

  let animationsStepFilter: TreeValue<boolean> = $state([
    false,
    {
      selection: false,
      neighbour: false,
      "random neighbour": false,
      "randon neighbour entry": false,
      "clear wall": false,
    },
  ] as const);

  let mazes: { maze: SpecializedMaze; state: State }[] = $state([]);
  let generating = $state(false);
  function generateMaze() {
    worker.postMessage({ rows, columns });
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
    };
  }
</script>

<!-- Center MazeViewer -->
<div class="relative mx-auto flex-1">
  <div class="flex items-center p-10 h-full w-full">
    <MazeViewer mazes={mazes.map((v) => v.maze)}>
      {#snippet cellViewer(maze, pos, cell)}
        {@const paths = [
          ...(cell.children || []),
          ...(cell.parent ? [cell.parent] : []),
        ]}
        <div
          class="w-full h-full min-h-0 min-w-0 bg-gray-300 dark:bg-gray-700 rounded-md relative"
        >
          <div class="absolute w-full h-full grid grid-cols-3 grid-rows-3">
            {#each [1, 0, -1] as ymod}
              {#each [-1, 0, 1] as xmod}
                {@const dir = getDirectionFromMod({ row: ymod, col: xmod })}
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
              <Circle class="fill-brand" />
            {:else if cell.unstack}
              <Cross class="fill-brand-soft rotate-45" />
            {/if}
          </div>
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
  </div>
</div>

<!-- Right Accordion -->
<div class="flex-1 overflow-hidden max-h-full flex flex-col">
  <Button
    class="m-2 flex flex-row gap-5"
    color="indigo"
    disabled={generating}
    onclick={() => generateMaze()}
    >Generate <RefreshCcw
      class={`${generating ? "animate-spin" : ""}`}
    /></Button
  >
  <Accordion
    flush
    class="h-full overflow-y-auto **:outline-none **:select-none **:focus:ring-0 px-5"
  >
    <AccordionItem>
      {#snippet header()}
        <h3 class="**:inline *:align-text-bottom">
          <Settings /> Settings
        </h3>
      {/snippet}
      <Accordion
        flush
        class="h-full **:outline-none **:select-none **:focus:ring-0 px-5"
      >
        <AccordionItem>
          {#snippet header()}
            <h3 class="**:inline *:align-text-bottom">
              <Factory /> Generator
            </h3>
          {/snippet}
          <form class="flex flex-col gap-5 **:[appearance:textfield]">
            <Label for="row">Rows:</Label>
            <Input
              type="number"
              id="row"
              aria-describedby="helper-text-explanation"
              placeholder="3"
              required
              bind:value={rows}
            />
            <Label for="col">Cols:</Label>
            <Input
              type="number"
              id="col"
              aria-describedby="helper-text-explanation"
              placeholder="90210"
              required
              bind:value={columns}
            />
          </form>
        </AccordionItem>
      </Accordion>
    </AccordionItem>
  </Accordion>
</div>
