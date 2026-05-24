<script lang="ts" generics="Cell,Wall">
  import { cell, wall, type Maze, type Position } from "$lib/maze";
  import { type Snippet } from "svelte";
  import AnimationViewer from "./general/AnimationViewer.svelte";

  let {
    mazes,
    index = $bindable(0),
    speed = $bindable(0),
    cellViewer,
  }: {
    mazes: Maze<Cell, Wall>[];
    index?: number;
    speed?: number;
    cellViewer: Snippet<[Maze<Cell, Wall>, Position, Cell]>;
  } = $props();
</script>

<AnimationViewer frames={mazes} {index} {speed}>
  {#snippet display(maze)}
    {#each Array.from({ length: maze.dimensions.rows }, (_, row) => maze.dimensions.rows - 1 - row) as row (row)}
      <div
        class="flex flex-row"
        style:height={`${100 / maze.dimensions.rows}%`}
      >
        {#each Array.from({ length: maze.dimensions.columns }, (_, col) => col) as col (col)}
          {@const position: Position = { row, col }}
          <div
            class="relative aspect-square"
            style:max-width={`${100 / maze.dimensions.columns}%`}
            class:border-l-1={wall(maze, position, "west")}
            class:border-t-1={wall(maze, position, "north")}
            class:border-r-1={wall(maze, position, "east")}
            class:border-b-1={wall(maze, position, "south")}
          >
            {@render cellViewer(maze, position, cell(maze, position))}
          </div>
        {/each}
      </div>
    {/each}
  {/snippet}
</AnimationViewer>
