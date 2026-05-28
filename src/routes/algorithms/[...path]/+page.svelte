<script lang="ts" generics="T extends Record<string, unknown>">
  /* eslint-disable @typescript-eslint/no-explicit-any */
  import type { Algorithm } from "$lib/algorithms/algorithm";
  import { Card } from "flowbite-svelte";
  import { onMount } from "svelte";
  let { data }: { data: { algorithm: Algorithm<T> } } = $props();

  // svelte-ignore state_referenced_locally
  let settings = $state(data.algorithm.initial_settings);

  let Display = $derived(data.algorithm.display);
  let Setting = $derived(data.algorithm.setting);

  let div: HTMLDivElement | undefined = $state();

  onMount(() => {
    div?.scrollIntoView({ behavior: "smooth" });
  });
</script>

<div
  bind:this={div}
  class="relative h-dvh min-h-dvh flex-col max-w-none flex-1 p-10 flex gap-5"
>
  <Card class="relative w-full h-full flex-1 p-10 pb-0 max-w-none">
    <Display bind:settings={settings as any} />
  </Card>
</div>

{#if Setting}
  <div class="relative flex-col max-w-none flex-1 p-10 flex gap-5">
    <Card class="relative w-full h-full flex-1 p-10 max-w-none">
      <Setting bind:settings={settings as any} />
    </Card>
  </div>
{/if}
