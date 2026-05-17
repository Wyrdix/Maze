<script lang="ts">
  import {
    Navbar,
    NavBrand,
    NavUl,
    NavHamburger,
    DarkMode,
  } from "flowbite-svelte";
</script>

<Navbar
  class="px-0 py-1 sm:px-0 sm:py-0.5"
  navContainerClass="px-20 max-w-full"
>
  <NavBrand>
    <h1 class="h5">Maze</h1>
  </NavBrand>
  <div class="flex md:order-2">
    <DarkMode />
    <NavHamburger />
  </div>
  <NavUl classes={{ ul: "py-0" }}></NavUl>
</Navbar>
