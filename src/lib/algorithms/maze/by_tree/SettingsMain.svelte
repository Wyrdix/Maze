<script lang="ts">
  import {
    Accordion,
    AccordionItem,
    Button,
    Input,
    Label,
  } from "flowbite-svelte";
  import {
    Factory,
    FilePlay,
    RefreshCcw,
    Settings as SettingsI,
  } from "@lucide/svelte";

  import TreeBoolean from "../../../components/TreeBoolean.svelte";
  import type { Settings } from ".";

  let { settings = $bindable() }: { settings: Settings } = $props();
</script>

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
    class="h-full overflow-y-auto **:outline-none **:select-none **:focus:ring-0 px-5"
  >
    <AccordionItem>
      {#snippet header()}
        <h3 class="**:inline *:align-text-bottom">
          <SettingsI /> Settings
        </h3>
      {/snippet}
      <Accordion
        flush
        class="h-full **:outline-none **:select-none **:focus:ring-0 px-5"
      >
        <AccordionItem>
          {#snippet header()}
            <h3 class="**:inline *:align-text-bottom">
              <Factory /> Generator
            </h3>
          {/snippet}
          <form class="flex flex-col gap-5 **:[appearance:textfield]">
            <Label for="row">Rows:</Label>
            <Input
              type="number"
              id="row"
              aria-describedby="helper-text-explanation"
              placeholder="3"
              required
              bind:value={
                () => settings.rows,
                (v) => (settings = { ...settings, rows: v })
              }
            />
            <Label for="col">Cols:</Label>
            <Input
              type="number"
              id="col"
              aria-describedby="helper-text-explanation"
              placeholder="90210"
              required
              bind:value={
                () => settings.columns,
                (v) => (settings = { ...settings, columns: v })
              }
            />
          </form>
        </AccordionItem>
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
    </AccordionItem>
  </Accordion>
</div>
