<script lang="ts" generics="Cell,Wall">
  import { cell, createMaze, wall, type Maze, type Position } from "$lib/maze";
  import { Button, ButtonGroup, Range } from "flowbite-svelte";
  import html2canvas from "html2canvas-pro";
  import GIF from "gif.js";
  import {
    FastForward,
    Pause,
    Play,
    Rewind,
    SkipBack,
    SkipForward,
  } from "lucide-svelte";
  import { tick, type Snippet } from "svelte";

  const SPEED = 200;
  const FAST_SPEED = 50;

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

  $effect(() => {
    mazes;
    index = 0;
    speed = 0;
  });

  let timeout: NodeJS.Timeout | null = null;
  function step() {
    index += Math.sign(speed);
    timeout = null;
    if (speed != 0) timeout = setTimeout(step, Math.abs(speed));
  }
  $effect(() => {
    if (timeout != null) clearTimeout(timeout);
    timeout = null;
    if (speed != 0) timeout = setTimeout(step, Math.abs(speed));
    return () => {
      if (timeout != null) clearTimeout(timeout);
    };
  });

  $effect(() => {
    if (speed > 0 && index >= mazes.length - 1) speed = 0;
    if (speed < 0 && index <= 0) speed = 0;
  });

  let maze = $derived(
    mazes[Math.max(0, Math.min(mazes.length - 1, index))] ??
      createMaze(
        { rows: 1, columns: 1 },
        (): "first" | "second" | "neighbour" | false => false,
        () => false,
      ),
  );
  let mazeDiv: HTMLDivElement | undefined = $state();

  let isRecording = false;
  let gif; // GIF encoder instance

  async function onDownloadGif() {
    if (!mazeDiv || isRecording) return;

    index = 0;
    await tick();
    let canvas: HTMLCanvasElement = await html2canvas(mazeDiv, {
      logging: false,
    });

    const { width, height } = canvas;

    isRecording = true;
    gif = new GIF({
      repeat: 0,
      workers: 2,
      quality: 10,
      workerScript: "node_modules/gif.js/dist/gif.worker.js",
      width,
      height,
    });

    for (let i = 0; i <= mazes.length; i++) {
      // Update the value (e.g., progress)
      index = i;

      // Wait for Svelte to update the DOM
      await tick();

      // Capture the frame
      const canvas = await html2canvas(mazeDiv, {
        width: width,
        height: mazeDiv.getBoundingClientRect().height,
        logging: false,
      });
      gif.addFrame(canvas, { delay: 100, copy: true });
    }

    gif.on("finished", (blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "animation.gif";
      a.click();
      URL.revokeObjectURL(url);
      isRecording = false;
    });

    gif.render();
  }
</script>

<div class="flex flex-col w-full h-full items-center">
  {#key maze}
    <div bind:this={mazeDiv} class="flex flex-col h-full bg-stone-500">
      {#each Array.from({ length: maze.dimensions.rows }, (_, row) => maze.dimensions.rows - 1 - row) as row}
        <div
          class="flex flex-row"
          style:height={`${100 / maze.dimensions.rows}%`}
        >
          {#each Array.from({ length: maze.dimensions.columns }, (_, col) => col) as col}
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
    </div>
  {/key}

  <p class="my-2">
    {index} / {mazes.length}
  </p>

  <Range
    id="range1"
    bind:value={index}
    min={0}
    max={mazes.length}
    onmousedown={() => (speed = 0)}
  />
  <div
    class="flex flex-row flex-1 my-5 items-center align-middle justify-center gap-5"
  >
    <ButtonGroup>
      <Button
        disabled={index <= 0}
        onclick={() => (speed = -FAST_SPEED)}
        class="hover:*:fill-black dark:hover:*:fill-white hover:**:stroke-2"
      >
        <Rewind
          class={speed == -FAST_SPEED
            ? "fill-black dark:fill-white stroke-2"
            : ""}
        />
      </Button>
      <Button
        disabled={index <= 0}
        onclick={() => {
          index--;
          speed = 0;
        }}
        class="hover:*:fill-black dark:hover:*:fill-white hover:**:stroke-2"
      >
        <SkipBack />
      </Button>
      <Button
        onclick={() => (speed = speed != 0 ? 0 : SPEED)}
        class="hover:*:fill-black dark:hover:*:fill-white hover:**:stroke-2"
      >
        {#if speed == 0}
          <Play />
        {:else}
          <Pause />
        {/if}
      </Button>
      <Button
        disabled={index > mazes.length - 1}
        onclick={() => {
          index++;
          speed = 0;
        }}
        class="hover:*:fill-black dark:hover:*:fill-white hover:**:stroke-2"
      >
        <SkipForward />
      </Button>
      <Button
        onclick={() => (speed = FAST_SPEED)}
        class="hover:*:fill-black dark:hover:*:fill-white hover:**:stroke-2"
      >
        <FastForward
          class={speed == FAST_SPEED
            ? "fill-black dark:fill-white stroke-2"
            : ""}
        />
      </Button>
    </ButtonGroup>
    <Button color="alternative" onclick={onDownloadGif}
      ><h5>Save as Gif</h5></Button
    >
  </div>
</div>
