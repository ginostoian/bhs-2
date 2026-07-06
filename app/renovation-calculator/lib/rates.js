import { DEFAULT_RENOVATION_CONFIG } from "./config.js";

// Deep-merge a partial override object over a base config. Only plain objects are
// merged recursively; everything else (numbers, strings, arrays) is replaced.
function isPlainObject(value) {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value)
  );
}

export function deepMerge(base, override) {
  if (!isPlainObject(override)) return base;
  const result = Array.isArray(base) ? [...base] : { ...base };

  for (const key of Object.keys(override)) {
    const baseValue = base ? base[key] : undefined;
    const overrideValue = override[key];

    if (isPlainObject(baseValue) && isPlainObject(overrideValue)) {
      result[key] = deepMerge(baseValue, overrideValue);
    } else if (overrideValue !== undefined) {
      result[key] = overrideValue;
    }
  }

  return result;
}

// Returns the effective config: defaults with any stored overrides merged on top.
export function getEffectiveConfig(overrides) {
  if (!overrides || !isPlainObject(overrides)) {
    return DEFAULT_RENOVATION_CONFIG;
  }
  return deepMerge(DEFAULT_RENOVATION_CONFIG, overrides);
}
