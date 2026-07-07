import { DEFAULT_EXTENSION_CONFIG } from "./config.js";
import { deepMerge } from "@/app/renovation-calculator/lib/rates";

// Returns the effective extension config: defaults with any stored overrides merged on top.
export function getEffectiveConfig(overrides) {
  if (!overrides || typeof overrides !== "object" || Array.isArray(overrides)) {
    return DEFAULT_EXTENSION_CONFIG;
  }
  return deepMerge(DEFAULT_EXTENSION_CONFIG, overrides);
}
