<script>
  import { resolve } from "$app/paths";
  import { getGroupedRegistry } from "$lib/algorithms/registry";
  import { Card, Tooltip } from "flowbite-svelte";
</script>

<Card class="relative max-h-full w-full h-full max-w-none flex flex-col p-5">
  {#each getGroupedRegistry() as { group, entries } (group.path)}
    <div class="flex flex-col">
      <h3 class="text-xl">{group.name}</h3>
      {#each entries as { icon: Icon, description, name, path } (path)}
        <a
          id={path}
          class="hover:dark:bg-gray-900 py-2 px-3 w-fit"
          href={resolve("/algorithms/[...path]", { path })}
        >
          <h5 class="inline-block text-sm">
            <span class="inline-flex items-center gap-5">
              <Icon class="stroke-brand dark:stroke-brand-strong" />
              {name}
            </span>
          </h5>
        </a>
        <Tooltip placement="bottom-end">{description}</Tooltip>
      {/each}
    </div>
  {/each}
</Card>
