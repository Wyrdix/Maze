<script lang="ts">
  import type { Algorithm } from "$lib/algorithms/algorithm";
  import { Card } from "flowbite-svelte";
  let { data }: { data: { algorithm: Algorithm } } = $props();

  let Display = $derived(data.algorithm.display);
</script>

<div class="relative h-full max-w-none w-auto flex-1 m-10">
  <Card class="relative max-h-full w-full h-full max-w-none flex flex-row">
    <div class="flex-1 flex-col p-5"></div>
    <Display />
  </Card>
</div>
