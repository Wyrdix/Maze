<script lang="ts">
  /* eslint-disable @typescript-eslint/no-unused-vars */
  import { Button, Dropzone, Fileupload, Label } from "flowbite-svelte";
  import type { Settings } from ".";
  import { getDirections, getOpposite, type Direction } from "$lib/2d";

  let {
    tile = $bindable(),
    index,
    settings = $bindable(),
  }: {
    tile: string | undefined;
    index: number;
    settings: Settings;
  } = $props();

  function onFileUpload(file: File) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      tile = reader.result?.toString();
    };
    reader.onerror = function (error) {
      console.log("Error: ", error);
    };
  }

  function isRulePresent(direction: Direction, target: number) {
    return settings.rules.find(
      (rule) =>
        (rule.direction === direction &&
          rule.source == index &&
          rule.target == target) ||
        (rule.direction === getOpposite(direction) &&
          rule.source == target &&
          rule.target == index),
    );
  }

  function toggleRule(direction: Direction, target: number) {
    const previously = isRulePresent(direction, target);

    const newRules = settings.rules.filter(
      (rule) =>
        !(
          (rule.direction === direction &&
            rule.source == index &&
            rule.target == target) ||
          (rule.direction === getOpposite(direction) &&
            rule.source == target &&
            rule.target == index)
        ),
    );

    if (!previously) newRules.push({ source: index, target, direction });

    settings = { ...settings, rules: newRules };
  }
</script>

{#snippet tileAsset(tile: string | undefined, index: number)}
  {#if tile}
    <img class="size-16" src={tile} alt={`Tile number ${index}`} />
  {:else}
    <div
      class="size-16 p-0 flex justify-center items-center border **:stroke-gray-500 border-gray-500 hover:**:stroke-black hover:border-black dark:hover:**:stroke-white dark:hover:border-white"
    >
      {index}
    </div>
  {/if}
{/snippet}

{#snippet tileButton(
  tile: string | undefined,
  index: number,
  onclick: () => void,
  clazz: string = "",
)}
  <Button class={"flex p-0 " + clazz} {onclick}>
    {@render tileAsset(tile, index)}
  </Button>
{/snippet}

<div class="flex flex-col gap-6">
  <!-- Selected tile -->
  <div class="flex items-center gap-4">
    <Dropzone
      class="inline-flex flex-row items-center gap-5 p-0 bg-stone-500 w-fit h-fit flex-nowrap"
      multiple
      autocomplete="off"
      autosave="false"
      accept=".png"
      bind:files={
        () => null as FileList | null,
        (files) => {
          console.log("hhh");
          onFileUpload(files!.item(0)!);
        }
      }
    >
      {@render tileAsset(tile, index)}
    </Dropzone>
    <div>
      <div class="text-lg font-semibold">
        Tile no {index}
      </div>

      <div class="text-sm text-gray-500">Configure adjacency rules</div>
    </div>
  </div>

  <!-- Direction grids -->
  <div class="grid grid-cols-2 gap-6">
    {#each getDirections() as direction (direction)}
      <div class="rounded-xl border p-4">
        <div class="mb-3 text-sm font-semibold uppercase tracking-wide">
          {direction}
        </div>

        <div class="grid grid-cols-4 gap-2">
          {#each settings.tiles as tile, i (i)}
            {@const present = isRulePresent(direction, i)}

            {@render tileButton(
              tile,
              i,
              () => toggleRule(direction, i),
              [
                "overflow-hidden rounded-lg border transition-all",
                present
                  ? "border-blue-500 opacity-100"
                  : "border-gray-300 opacity-30 grayscale",
              ].join(" "),
            )}
          {/each}
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  img {
    image-rendering: optimizeSpeed; /* STOP SMOOTHING, GIVE ME SPEED  */
    image-rendering: -moz-crisp-edges; /* Firefox                        */
    image-rendering: -o-crisp-edges; /* Opera                          */
    image-rendering: -webkit-optimize-contrast; /* Chrome (and eventually Safari) */
    image-rendering: pixelated; /* Universal support since 2021   */
    image-rendering: optimize-contrast; /* CSS3 Proposed                  */
    -ms-interpolation-mode: nearest-neighbor; /* IE8+                           */
  }
</style>
