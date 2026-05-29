<script lang="ts">
  import type { Dimensions } from "$lib/2d";
  import { Minus, Plus } from "@lucide/svelte";
  import { Button, ButtonGroup, Input } from "flowbite-svelte";

  let { dimensions = $bindable() }: { dimensions: Dimensions } = $props();
</script>

<div class="flex flex-row items-center justify-center gap-10">
  <div class="relative flex w-fit gap-5 items-center">
    Width:
    <ButtonGroup>
      <Button
        type="button"
        id="decrement-button"
        onclick={() =>
          (dimensions = { ...dimensions, width: dimensions.width - 1 })}
      >
        <Minus />
      </Button>
      <Input
        bind:value={
          () => dimensions.width,
          (width) => {
            dimensions = {
              ...dimensions,
              width,
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
          (dimensions = { ...dimensions, width: dimensions.width + 1 })}
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
          (dimensions = { ...dimensions, height: dimensions.height - 1 })}
      >
        <Minus />
      </Button>
      <Input
        bind:value={
          () => dimensions.height,
          (height) => {
            dimensions = {
              ...dimensions,
              height,
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
          (dimensions = { ...dimensions, height: dimensions.height + 1 })}
      >
        <Plus />
      </Button>
    </ButtonGroup>
  </div>
</div>
