/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { LucideIcon } from "@lucide/svelte";
import type { Component } from "svelte";

export type Algorithm<Settings extends Record<string, any> = {}> = {
  name: string;
  path: string;
  description: string;
  initial_settings: Settings;
  display: Component<{ settings: Settings }, {}, "settings">;
  setting?: Component<{ settings: Settings }, {}, "settings">;
  icon: LucideIcon;
};
