<script lang="ts" generics="Cell,Wall">
  import type { DefaultMazeImplementation, Position } from "$lib/maze";
  import { Button, ButtonGroup } from "flowbite-svelte";
  import type { Snippet } from "svelte";

  let {
    mazes,
    index = $bindable(0),
    cellViewer,
  }: {
    mazes: DefaultMazeImplementation<Cell, Wall>[];
    index?: number;
    cellViewer: Snippet<
      [DefaultMazeImplementation<Cell, Wall>, Position, Cell]
    >;
  } = $props();

  let maze = $derived(mazes[index]);
</script>

<div class="flex flex-col w-full h-full items-center">
  {#each Array.from({ length: maze.dimensions[0] }, (_, row) => maze.dimensions[0] - 1 - row) as row}
    <div class="flex flex-row" style:height={`${100 / maze.dimensions[0]}%`}>
      {#each Array.from({ length: maze.dimensions[1] }, (_, col) => col) as col}
        {@const position: Position = { row, col }}
        <div
          class="relative aspect-square border"
          style:max-width={`${100 / maze.dimensions[1]}%`}
          class:border-l-0={!maze.wall(position, "west")}
          class:border-t-0={!maze.wall(position, "north")}
          class:border-r-0={!maze.wall(position, "east")}
          class:border-b-0={!maze.wall(position, "south")}
        >
          {@render cellViewer(maze, position, maze.cell(position))}
        </div>
      {/each}
    </div>
  {/each}

  {index}
  <ButtonGroup class="flex-1 mt-5">
    <Button disabled={index <= 0} onclick={() => index--}>Previous</Button>
    <Button disabled={index >= mazes.length - 1} onclick={() => index++}
      >Next</Button
    >
  </ButtonGroup>
</div>
