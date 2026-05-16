<script lang="ts" module>
  export type TreeValue<T> = T | [T, { [key: string]: TreeValue<T> }];

  type TreeInternalNodeValue<T> = [T, { [key: string]: TreeValue<T> }];

  function deepReplace<T>(root: T, oldV: unknown, newV: unknown): T {
    if (root === oldV) return newV as T;
    if (typeof root !== "object") return root;
    return Object.fromEntries(
      Object.entries(root as {}).map(([k, v]): [string, any] => [
        k,
        deepReplace(v, oldV, newV),
      ]),
    ) as T;
  }

  function deepSearch(root: any, value: unknown): boolean {
    if (root === value) return true;
    if (typeof root !== "object") return false;
    return Object.values(root as {}).find((v) => deepSearch(v, value)) != null;
  }
</script>

<script lang="ts">
  import { Accordion, AccordionItem, Checkbox, Input } from "flowbite-svelte";
  import StepFilter from "./TreeBoolean.svelte";

  let {
    name,
    filter = $bindable(),
    parentIsGroup = false,
  }: {
    name: TreeValue<string>;
    filter: TreeValue<boolean>;
    parentIsGroup?: boolean;
  } = $props();
</script>

{#if typeof name == "string" || typeof filter == "boolean"}
  <Checkbox
    inline
    bind:checked={filter as boolean}
    onmousedown={(e) => e.stopPropagation()}
  >
    {name}</Checkbox
  >
{:else}
  <Accordion flush>
    {#each Object.keys(filter[1]) as key}
      {@const name_value = name[1][key]}
      {@const filter_value = filter[1][key]}

      {#if typeof name_value == "string" || typeof filter_value == "boolean"}
        <div
          class="flex items-center justify-between w-full font-medium text-left py-4 my-1 text-gray-500 dark:text-gray-400"
        >
          <StepFilter
            name={name_value}
            bind:filter={
              () => filter_value,
              (newFilter) => {
                let parentNewFilter: TreeValue<boolean> = [
                  (filter as TreeInternalNodeValue<boolean>)[0],
                  { ...(filter as TreeInternalNodeValue<boolean>)[1] },
                ];
                parentNewFilter[1][key] = newFilter;
                filter = parentNewFilter;
              }
            }
            {parentIsGroup}
          />
        </div>
      {:else}
        <AccordionItem>
          {#snippet header()}
            <StepFilter
              name={name_value[0]}
              bind:filter={
                () => filter_value[0],
                (newFilter) => {
                  let parentNewFilter: TreeValue<boolean> = [
                    (filter as TreeInternalNodeValue<boolean>)[0],
                    { ...(filter as TreeInternalNodeValue<boolean>)[1] },
                  ];
                  parentNewFilter[1][key] = [
                    newFilter,
                    parentIsGroup
                      ? deepReplace(
                          filter_value[1],
                          filter_value[0],
                          newFilter as boolean,
                        )
                      : filter_value[1],
                  ];

                  filter = parentNewFilter;
                }
              }
              {parentIsGroup}
            />
          {/snippet}
          <StepFilter
            name={name_value}
            bind:filter={
              () => filter_value,
              (newFilter) => {
                let parentNewFilter: TreeValue<boolean> = [
                  (filter as TreeInternalNodeValue<boolean>)[0],
                  { ...(filter as TreeInternalNodeValue<boolean>)[1] },
                ];
                parentNewFilter[1][key] = [
                  deepSearch(newFilter, true),
                  newFilter[1],
                ];
                filter = parentNewFilter;
              }
            }
            {parentIsGroup}
          />
        </AccordionItem>
      {/if}
    {/each}
  </Accordion>
{/if}
