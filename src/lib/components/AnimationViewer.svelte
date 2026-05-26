<script lang="ts" generics="T">
  import { Button, ButtonGroup, Modal, Range } from "flowbite-svelte";
  import GIF from "gif.js";
  import html2canvas from "html2canvas-pro";
  import {
    FastForward,
    Maximize,
    Minimize,
    Pause,
    Play,
    Rewind,
    SkipBack,
    SkipForward,
  } from "@lucide/svelte";
  import { tick, type Snippet } from "svelte";

  const SPEED = 200;
  const FAST_SPEED = 50;

  type Props = {
    index?: number;
    speed?: number;
    frames: T[];
    display: Snippet<[T]>;
  };

  let {
    frames,
    display,
    index = $bindable(0),
    speed = $bindable(0),
  }: Props = $props();

  let timeout: NodeJS.Timeout | null = null;

  function step() {
    index += Math.sign(speed);
    timeout = null;
    if (speed != 0) timeout = setTimeout(step, Math.abs(speed));
  }

  $effect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    frames;
    index = 0;
    speed = 0;
  });

  $effect(() => {
    if (timeout != null) clearTimeout(timeout);
    timeout = null;
    if (speed != 0) timeout = setTimeout(step, Math.abs(speed));
    return () => {
      if (timeout != null) clearTimeout(timeout);
    };
  });

  $effect(() => {
    if (speed > 0 && index >= frames.length - 1) speed = 0;
    if (speed < 0 && index <= 0) speed = 0;
  });

  let frame = $derived(
    frames[Math.max(0, Math.min(frames.length - 1, index))] ?? undefined,
  );

  // svelte-ignore non_reactive_update
  let frameDiv: HTMLDivElement;
  let isRecording = false;
  let gif; // GIF encoder instance

  async function onDownloadGif() {
    if (!frameDiv || isRecording) return;

    index = 0;
    await tick();
    let canvas: HTMLCanvasElement = await html2canvas(frameDiv, {
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

    for (let i = 0; i <= frames.length; i++) {
      // Update the value (e.g., progress)
      index = i;

      // Wait for Svelte to update the DOM
      await tick();

      // Capture the frame
      const canvas = await html2canvas(frameDiv, {
        width: width,
        height: frameDiv.getBoundingClientRect().height,
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

  let fullscreen = $state(false);
</script>

{#snippet content()}
  <div class="flex-1 flex flex-col w-full h-full items-center">
    {#key frame}
      <div bind:this={frameDiv} class="flex-1 flex flex-col size-full">
        {#if frame != null}
          {@render display(frame)}
        {/if}
      </div>
    {/key}

    <p class="my-2">
      {index} / {frames.length}
    </p>

    <Range
      id="range1"
      bind:value={index}
      min={0}
      max={frames.length}
      onmousedown={() => (speed = 0)}
    />
    <div class="flex flex-row w-full my-5 justify-center gap-5">
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
          disabled={index > frames.length - 1}
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
      <Button
        color="alternative"
        class="justify-self-end"
        onclick={() => (fullscreen = !fullscreen)}
        >{#if fullscreen}
          <Minimize />
        {:else}
          <Maximize />
        {/if}</Button
      >
    </div>
  </div>
{/snippet}

{#if !fullscreen}
  {@render content()}
{/if}

<Modal
  bind:open={fullscreen}
  fullscreen
  size="none"
  class="bg-gray-100"
  classes={{
    body: "flex flex-col flex-1 bg-gray-50 antialiased dark:bg-gray-900 dark:text-white",
  }}
>
  {@render content()}
</Modal>
