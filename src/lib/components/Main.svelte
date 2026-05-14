<script lang="ts">
  import { buildMaze, DefaultMazeImplementation, type Maze } from "$lib/maze";
  import { Card } from "flowbite-svelte";
  import MazeViewer from "./GenericMazeViewer.svelte";
  import {
    Generator,
    type SpecializedGenerator,
    type SpecializedMaze,
    type State,
  } from "$lib/generators/generation_by_sets";
  import { generate } from "$lib/generator";

  const gen = Generator({});
  const initial: DefaultMazeImplementation<boolean, boolean> = buildMaze(
    [10, 10],
    () => false,
    () => false,
  );
  const mazes = generate<{}, State, SpecializedMaze, SpecializedGenerator>(
    gen,
    initial,
  ).map((v) => v.maze);
</script>

<Card class="relative w-full h-full max-w-none max-h-none flex flex-row">
  <div class="flex items-center p-10 mx-auto">
    <MazeViewer {mazes}>
      {#snippet cellViewer()}
        <div
          class="w-full h-full min-h-0 min-w-0 bg-gray-300 dark:bg-gray-700 rounded-md"
        ></div>
      {/snippet}
    </MazeViewer>
  </div>
</Card>
