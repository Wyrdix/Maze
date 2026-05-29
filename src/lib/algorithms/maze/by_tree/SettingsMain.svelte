<script lang="ts">
  import { Accordion, AccordionItem, Button } from "flowbite-svelte";
  import { FilePlay, RefreshCcw } from "@lucide/svelte";

  import TreeBoolean from "../../../components/TreeBoolean.svelte";
  import type { Settings } from ".";
  import DimensionInput from "$lib/components/DimensionInput.svelte";

  let { settings = $bindable() }: { settings: Settings } = $props();
</script>

<DimensionInput
  bind:dimensions={
    () => settings.dimensions,
    (dimensions) => (settings = { ...settings, dimensions })
  }
/>

<div class="flex-1 overflow-hidden max-h-full flex flex-col">
  <Button
    class="m-2 flex flex-row gap-5"
    color="indigo"
    onclick={() => (settings = { ...settings, generating: true })}
    disabled={settings.generating}
    >Generate <RefreshCcw
      class={`${settings.generating ? "animate-spin" : ""}`}
    /></Button
  >
  <Accordion
    flush
    class="h-full **:outline-none **:select-none **:focus:ring-0 px-5"
  >
    <AccordionItem>
      {#snippet header()}
        <h3 class="**:inline *:align-text-bottom">
          <FilePlay /> Animation
        </h3>
      {/snippet}

      <TreeBoolean
        bind:filter={
          () => settings.animationsStepFilter,
          (v) => (settings = { ...settings, animationsStepFilter: v })
        }
        name={[
          "",
          {
            pop: "Cell pop",
            descend: "Cell descend",
          },
        ]}
      />
    </AccordionItem>
  </Accordion>
</div>
