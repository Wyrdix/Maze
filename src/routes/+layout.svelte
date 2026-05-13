<script lang="ts">
  import "./layout.css";
  import favicon from "$lib/assets/favicon.svg";
  import {
    DarkMode,
    Navbar,
    NavBrand,
    NavLi,
    NavUl,
    ToolbarButton,
  } from "flowbite-svelte";
  import NavigationBar from "$lib/components/NavigationBar.svelte";

  let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<div class="h-dvh flex flex-col">
  <NavigationBar />
  {@render children()}
</div>
