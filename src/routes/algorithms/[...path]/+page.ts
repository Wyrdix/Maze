import { REGISTRY } from "$lib/algorithms/registry.js";
import { error } from "@sveltejs/kit";

export function load({ params }) {
  const value = REGISTRY.find((item) => item.path === params.path);
  if (value == null) {
    error(
      404,
      "The path: " + params.path + ", does not correspond to any algorithms.",
    );
  }
  return {
    algorithm: value,
  };
}
