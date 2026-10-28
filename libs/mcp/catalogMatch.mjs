// Checks that call_api only reaches endpoints listed in apiCatalog.json.

const escapeRegex = (s) => s.replace(/[.*+?^$()|[\]\\]/g, "\\$&");

const toPattern = (path) =>
  new RegExp(
    "^" +
      path
        .split(/(\{[^}]+\})/)
        .map((part) => {
          if (/^\{\.\.\.[^}]+\}$/.test(part)) return ".+";
          if (/^\{[^}]+\}$/.test(part)) return "[^/]+";
          return escapeRegex(part);
        })
        .join("") +
      "$",
  );

/** True when `method path` matches an endpoint in the catalog. */
export function matchesCatalog(catalog, method, path) {
  // Reject traversal and encoded separators outright
  if (/(^|\/)\.\.?(\/|$)|%2e|%2f|%5c|\\/i.test(path)) return false;
  return catalog.some(
    (entry) => entry.method === method && toPattern(entry.path).test(path),
  );
}
