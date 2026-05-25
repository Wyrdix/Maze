<script lang="ts">
  import {
    Navbar,
    NavBrand,
    NavUl,
    NavHamburger,
    DarkMode,
    Button,
    Modal,
  } from "flowbite-svelte";
  import AlgorithmPicker from "./AlgorithmPicker.svelte";
  import { page } from "$app/state";

  let pickingModal = $state(false);
  let url = $derived(page.url.pathname);

  $effect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    url;
    pickingModal = false;
  });
</script>

<Navbar
  class="px-0 py-1 sm:px-0 sm:py-0.5"
  navContainerClass="px-20 max-w-full"
>
  <NavBrand>
    <Button class="cursor-pointer" onclick={() => (pickingModal = true)}>
      <h1 class="h5">Visualizations</h1>
    </Button>
  </NavBrand>
  <div class="flex md:order-2">
    <DarkMode />
    <NavHamburger />
  </div>
  <NavUl classes={{ ul: "py-0" }}></NavUl>
</Navbar>

<Modal
  class="w-full h-full max-w-full"
  title="Visualizations"
  autoclose
  bind:open={pickingModal}
>
  <AlgorithmPicker />
</Modal>
