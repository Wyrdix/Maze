<script lang="ts">
  import MainByTree from "$lib/components/entries/by_tree/Main.svelte";
  import MainBySets from "$lib/components/entries/by_sets/Main.svelte";
  import { Button, Card } from "flowbite-svelte";

  let choice: "by_tree" | "by_sets" = $state("by_tree");
</script>

<div class="relative h-full max-w-none w-auto flex-1 m-10">
  <Card class="relative max-h-full w-full h-full max-w-none flex flex-row">
    <!-- Left empty div -->
    <div class="flex-1 flex-col p-5">
      <Card size="lg" class="p-4 text-center sm:p-8 md:p-10">
        <h5
          class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
        >
          By tree
        </h5>
        <p
          class="mb-3 leading-tight font-normal text-gray-700 dark:text-gray-400"
        >
          Generate a maze using a randomized depth first search, the root is
          picked randomly.
        </p>
        <Button
          class="bg-brand"
          onclick={() => (choice = "by_tree")}
          disabled={choice == "by_tree"}>Select</Button
        >
      </Card>
      <Card size="lg" class="p-4 text-center sm:p-8 md:p-10">
        <h5
          class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
        >
          By sets
        </h5>
        <p
          class="mb-3 leading-tight font-normal text-gray-700 dark:text-gray-400"
        >
          Generate a maze using a randomized union of sets, each cells starting
          it its own set.
        </p>
        <Button
          class="bg-brand"
          onclick={() => (choice = "by_sets")}
          disabled={choice == "by_sets"}>Select</Button
        >
      </Card>
    </div>
    {#if choice === "by_tree"}
      <MainByTree />
    {:else}
      <MainBySets />
    {/if}
  </Card>
</div>
