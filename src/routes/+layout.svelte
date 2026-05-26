<script lang="ts">
  import "./layout.css";
  import favicon from "$lib/assets/favicon.svg";
  import NavigationBar from "$lib/components/NavigationBar.svelte";

  let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<div class="min-h-dvh flex flex-col">
  <NavigationBar />
  {@render children()}
</div>
