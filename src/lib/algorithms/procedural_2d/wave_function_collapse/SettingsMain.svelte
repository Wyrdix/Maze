<script lang="ts">
  import {
    Button,
    ButtonGroup,
    Dropzone,
    Input,
    Label,
    Modal,
  } from "flowbite-svelte";
  import type { Settings } from ".";
  import { FileDown, FileUp, Minus, Plus } from "@lucide/svelte";
  import TileSetting from "./TileSetting.svelte";

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

  let selected = $state(-1);

  let exportModal = $state(false);
</script>

<Modal
  bind:open={exportModal}
  onaction={({ data }) => onExport(data.get("name")!.toString())}
>
  <div class="flex flex-col space-y-6">
    <h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">
      Exporting settings...
    </h3>

    <Label class="space-y-2">
      <span>File name</span>
      <Input type="text" name="name" value="wave_function_collapse" required />
    </Label>

    <Button type="submit" value="download">Login to your account</Button>
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
    onclick={() => (exportModal = true)}
  >
    <FileDown />
    Export
  </Button>

  <div class="flex flex-row items-center justify-center gap-10">
    <div class="relative flex w-fit gap-5 items-center">
      Width:
      <ButtonGroup>
        <Button
          type="button"
          id="decrement-button"
          onclick={() =>
            (settings = {
              ...settings,
              dimensions: {
                ...settings.dimensions,
                width: settings.dimensions.width - 1,
              },
            })}
        >
          <Minus />
        </Button>
        <Input
          bind:value={
            () => settings.dimensions.width,
            (width) => {
              settings = {
                ...settings,
                dimensions: {
                  ...settings.dimensions,
                  width,
                },
              };
            }
          }
          type="number"
          id="quantity-input"
          aria-describedby="helper-text-explanation"
          placeholder="999"
          required
          class="w-16! text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <Button
          type="button"
          id="increment-button"
          onclick={() =>
            (settings = {
              ...settings,
              dimensions: {
                ...settings.dimensions,
                width: settings.dimensions.width + 1,
              },
            })}
        >
          <Plus />
        </Button>
      </ButtonGroup>
    </div>

    <div class="relative flex w-fit gap-5 items-center">
      Height:
      <ButtonGroup>
        <Button
          type="button"
          id="decrement-button"
          onclick={() =>
            (settings = {
              ...settings,
              dimensions: {
                ...settings.dimensions,
                height: settings.dimensions.height - 1,
              },
            })}
        >
          <Minus />
        </Button>
        <Input
          bind:value={
            () => settings.dimensions.height,
            (height) => {
              settings = {
                ...settings,
                dimensions: {
                  ...settings.dimensions,
                  height,
                },
              };
            }
          }
          type="number"
          id="quantity-input"
          aria-describedby="helper-text-explanation"
          placeholder="999"
          required
          class="w-16! text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <Button
          type="button"
          id="increment-button"
          onclick={() =>
            (settings = {
              ...settings,
              dimensions: {
                ...settings.dimensions,
                height: settings.dimensions.height + 1,
              },
            })}
        >
          <Plus />
        </Button>
      </ButtonGroup>
    </div>
  </div>

  <Dropzone
    class="inline-flex flex-row items-center gap-5 p-5 bg-stone-500 w-fit h-fit flex-nowrap"
    bind:files={() => null as FileList | null, (f) => onImport(f!.item(0)!)}
    multiple
    accept=".json"
  >
    <FileUp />
    Import
  </Dropzone>
</div>

<Button
  class="bg-brand"
  onclick={() => (settings = { ...settings, generating: true })}
  >Generate</Button
>
