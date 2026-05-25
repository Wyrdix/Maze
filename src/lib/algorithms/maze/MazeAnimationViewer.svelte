<script lang="ts" generics="Cell,Wall">
  import GridAnimationViewer from "$lib/components/GridAnimationViewer.svelte";
  import {
    cell,
    wall,
    type Maze,
    type Position,
  } from "$lib/algorithms/maze/maze";
  import { type Snippet } from "svelte";

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

<GridAnimationViewer
  frames={mazes}
  {index}
  {speed}
  getDimension={(maze) => ({
    width: maze.dimensions.columns,
    height: maze.dimensions.rows,
  })}
>
  {#snippet gridCellViewer(maze, position)}
    <div
      class:border-l-1={wall(maze, position, "west")}
      class:border-t-1={wall(maze, position, "north")}
      class:border-r-1={wall(maze, position, "east")}
      class:border-b-1={wall(maze, position, "south")}
    >
      {@render cellViewer(maze, position, cell(maze, position))}
    </div>
  {/snippet}
</GridAnimationViewer>
