<script lang="ts">
  import { buildMaze, DefaultMazeImplementation, type Maze } from "$lib/maze";
  import {
    Accordion,
    AccordionItem,
    Card,
    Input,
    Label,
  } from "flowbite-svelte";
  import MazeViewer from "./GenericMazeViewer.svelte";
  import {
    Generator,
    type SpecializedGenerator,
    type SpecializedMaze,
    type State,
  } from "$lib/generators/generation_by_sets";
  import { generate } from "$lib/generator";
  import { Factory, FilePlay, Settings } from "lucide-svelte";
  import type { TreeValue } from "./TreeBoolean.svelte";
  import TreeBoolean from "./TreeBoolean.svelte";

  let rows = $state(3);
  let cols = $state(3);

  const gen = Generator({});
  const initial: DefaultMazeImplementation<
    "first" | "second" | "neighbour" | false,
    boolean
  > = buildMaze(
    [3, 3],
    (): "first" | "second" | "neighbour" | false => false,
    () => false,
  );
  const mazes = generate<{}, State, SpecializedMaze, SpecializedGenerator>(
    gen,
    initial,
  ).map((v) => v.maze);

  let animationsStepFilter: TreeValue<boolean> = $state([
    false,
    {
      selection: false,
      neighbour: false,
      "random neighbour": false,
      "randon neighbour entry": false,
      "clear wall": false,
    },
  ]);

  let animationsStepText: TreeValue<string> = [
    "",
    {
      selection: "Cell selection",
      neighbour: "Neighbour lookup",
      "random neighbour": "Neighbour pick",
      "randon neighbour entry": "Neighbour set lookup",
      "clear wall": "Fusion",
    },
  ];
</script>

<Card class="relative max-h-full w-full h-full max-w-none flex flex-row">
  <!-- Left empty div -->
  <div class="flex-1"></div>

  <!-- Center MazeViewer -->
  <div class="relative mx-auto flex-1">
    <div class="flex items-center p-10 h-full w-full">
      <MazeViewer {mazes}>
        {#snippet cellViewer(maze, pos, cell)}
          <div
            class="w-full h-full min-h-0 min-w-0 bg-gray-300 dark:bg-gray-700 rounded-md"
          >
            <div
              class="w-full h-full transition-all"
              class:bg-blue-400={cell == "first"}
              class:bg-red-400={cell == "second"}
              class:bg-yellow-400={cell == "neighbour"}
            ></div>
          </div>
        {/snippet}
      </MazeViewer>
      <div
        class="absolute w-full h-full left-0 backdrop-blur-sm flex justify-center items-center"
      >
        <h2 class="center inline text-xl">No data</h2>
      </div>
    </div>
  </div>

  <!-- Right Accordion -->
  <div class="flex-1 overflow-hidden max-h-full">
    <Accordion
      flush
      class="h-full overflow-y-auto **:outline-none **:select-none **:focus:ring-0 px-5"
    >
      <AccordionItem>
        {#snippet header()}
          <h3 class="**:inline *:align-text-bottom">
            <Settings /> Settings
          </h3>
        {/snippet}
        <Accordion
          flush
          multiple
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
                bind:value={rows}
              />
              <Label for="col">Cols:</Label>
              <Input
                type="number"
                id="col"
                aria-describedby="helper-text-explanation"
                placeholder="90210"
                required
                bind:value={cols}
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
              bind:filter={animationsStepFilter}
              name={animationsStepText}
            />
          </AccordionItem>
        </Accordion>
      </AccordionItem>
    </Accordion>
  </div>
</Card>
