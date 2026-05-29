<script lang="ts">
  import { Button, Dropzone, Input, Label, Modal } from "flowbite-svelte";
  import { WAVE_FUNCTION_COLLAPSE, type Settings } from ".";
  import {
    FileDown,
    FileUp,
    InspectionPanel,
    Plus,
    Trash,
  } from "@lucide/svelte";
  import TileSetting from "./TileSetting.svelte";
  import { fileToImageData, generate } from "./from_tileset";
  import DimensionInput from "$lib/components/DimensionInput.svelte";

  let { settings = $bindable() }: { settings: Settings } = $props();

  function insertEndingTile() {
    settings = {
      ...settings,
      tiles: [...settings.tiles, undefined],
    };
  }

  function onExport(name: string) {
    var element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," +
        encodeURIComponent(JSON.stringify(settings)),
    );
    if (!name.endsWith(".json")) name = name + ".json";
    element.setAttribute("download", name);

    element.style.display = "none";
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }

  function onImport(file: File) {
    if (file == null) return;
    const read = new FileReader();

    read.onloadend = function () {
      const result = read.result!;
      const decoder = new TextDecoder();

      const string =
        typeof result == "string" ? result : decoder.decode(result);
      settings = JSON.parse(string);
    };
    read.readAsArrayBuffer(file);
  }

  function onImportTileset() {
    if (tilefile == null) return;
    fileToImageData(tilefile)
      .then(async (data) => {
        return await generate(data, tileN);
      })
      .then((value) => {
        settings = {
          ...settings,
          rules: value.rules,
          tiles: value.tiles,
        };
      });
  }

  let selected = $state(-1);
  let fileName = $state("");
  let tilefile = $state(undefined as File | undefined);
  let tileN = $state(3);
  let exportModal = $state(false);
</script>

<Modal bind:open={exportModal}>
  <div class="flex flex-col space-y-6">
    <h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">
      Exporting settings...
    </h3>

    <Label class="space-y-2">
      <span>File name</span>
      <Input
        type="text"
        autocomplete="off"
        autosave="false"
        name="name"
        bind:value={fileName}
        required
      />
    </Label>

    <Button type="submit" value="download" onclick={() => onExport(fileName)}
      >Download</Button
    >
  </div>
</Modal>

<Modal
  bind:open={
    () => selected != -1,
    (v) => (selected = v ? (selected != -1 ? selected : 0) : -1)
  }
>
  <TileSetting
    bind:tile={
      () => settings.tiles[selected],
      (newTileValue) =>
        (settings = {
          ...settings,
          tiles: settings.tiles.map((v, i) =>
            i == selected ? newTileValue : v,
          ),
        })
    }
    bind:settings
    index={selected}
  />
</Modal>

<Modal
  bind:open={
    () => tilefile != null, (b) => (tilefile = b ? tilefile : undefined)
  }
>
  <div class="flex flex-col space-y-6">
    <h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">
      Importing settings...
    </h3>

    <Label class="space-y-2">
      <span>Grid dimension</span>
      <Input
        type="number"
        autocomplete="off"
        autosave="false"
        name="name"
        bind:value={tileN}
        required
      />
    </Label>

    <Button type="submit" value="download" onclick={() => onImportTileset()}
      >Download</Button
    >
  </div>
</Modal>

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
)}
  <Button class="flex p-0" {onclick}>
    {@render tileAsset(tile, index)}
  </Button>
{/snippet}

<div class="flex flex-row flex-wrap">
  {#each settings.tiles as tile, i (i)}
    {@render tileButton(tile, i, () => (selected = i))}
  {/each}

  <Button
    class="size-16 p-0 border **:stroke-gray-500 border-gray-500 hover:**:stroke-black hover:border-black dark:hover:**:stroke-white dark:hover:border-white"
    onclick={insertEndingTile}
  >
    <Plus color="black" />
  </Button>
</div>

<div class="flex flex-row justify-between gap-10 my-5">
  <Button
    class="inline-flex items-center gap-5 p-5 bg-stone-500"
    onclick={() => {
      exportModal = true;
      fileName = "wave_function_collapse_algorithm";
    }}
  >
    <FileDown />
    Export
  </Button>

  <DimensionInput
    bind:dimensions={
      () => settings.dimensions,
      (dimensions) => (settings = { ...settings, dimensions })
    }
  />

  <Dropzone
    class="inline-flex flex-row items-center gap-5 p-5 bg-stone-500 w-fit h-fit flex-nowrap"
    autocomplete="off"
    autosave="false"
    bind:files={() => null as FileList | null, (f) => onImport(f!.item(0)!)}
    multiple
    accept=".json"
  >
    <FileUp />
    Import
  </Dropzone>
</div>

<div class="flex flex-row my-5">
  <Dropzone
    class="inline-flex flex-row items-center p-5 gap-2 bg-brand h-fit flex-nowrap w-full"
    bind:files={() => null as FileList | null, (f) => (tilefile = f!.item(0)!)}
    autocomplete="off"
    autosave="false"
    multiple
    accept=".png"
  >
    <InspectionPanel />
    Import tileset
  </Dropzone>
  <Button
    class="bg-red-500 hover:bg-red-700"
    onclick={() => (settings = WAVE_FUNCTION_COLLAPSE.initial_settings)}
  >
    <Trash />
  </Button>
</div>
<Button
  class="bg-brand"
  onclick={() => (settings = { ...settings, generating: true })}
  >Generate</Button
>

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
