import type { LucideIcon } from "@lucide/svelte";
import type { Component } from "svelte";

export type Algorithm = {
  name: string;
  path: string;
  description: string;
  display: Component;
  icon: LucideIcon;
};
