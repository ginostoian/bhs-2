/**
 * Generates libs/mcp/apiCatalog.json — the list of app API endpoints the MCP
 * server exposes to agents through the `list_api_endpoints` / `call_api` tools.
 *
 * Run with: npm run mcp-catalog
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const API_DIR = path.join(ROOT, "app", "api");
const OUT_FILE = path.join(ROOT, "libs", "mcp", "apiCatalog.json");

// Infrastructure endpoints agents should never call
const EXCLUDED_PREFIXES = [
  "/api/auth",
  "/api/cron",
  "/api/webhook",
  "/api/stripe",
  "/api/debug",
  "/api/mcp",
  "/api/admin/mcp",
  "/api/oauth",
  "/api/form-token",
  "/api/test-notifications",
  "/api/notifications/test",
  "/api/admin/migrate-",
  "/api/admin/check-",
  "/api/crm/leads/archived/test",
  "/api/crm/unsubscribe",
  "/api/quotes/{id}/track",
  "/api/users/change-password",
  // Public website forms (protected by form tokens, not meant for agents)
  "/api/bathroom-renovation",
  "/api/contact",
  "/api/general-renovation",
  "/api/kitchen-renovation",
  "/api/kitchen-calculator-leads",
  "/api/renovation-calculator-leads",
  "/api/lead",
];

// Exact method + path pairs to exclude (public form submissions)
const EXCLUDED_ENDPOINTS = new Set(["POST /api/leads"]);

const METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"];

function walk(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...walk(full));
    else if (entry.name === "route.js" || entry.name === "route.ts")
      results.push(full);
  }
  return results;
}

function toApiPath(file) {
  const rel = path.relative(path.join(ROOT, "app"), path.dirname(file));
  return (
    "/" +
    rel
      .split(path.sep)
      .map((seg) => seg.replace(/^\[\.\.\.(.+)\]$/, "{...$1}"))
      .map((seg) => seg.replace(/^\[(.+)\]$/, "{$1}"))
      .join("/")
  );
}

function cleanComment(comment) {
  return comment
    .replace(/^\/\*\*?/, "")
    .replace(/\*\/$/, "")
    .split("\n")
    .map((line) => line.replace(/^\s*\*\s?/, "").trim())
    .filter(
      (line) =>
        line &&
        !/^(GET|POST|PUT|PATCH|DELETE)\s+\/api\//.test(line) &&
        !line.startsWith("@returns"),
    )
    .join(" ")
    .trim();
}

function extractEndpoints(file) {
  const source = fs.readFileSync(file, "utf8");
  const endpoints = [];

  for (const method of METHODS) {
    const exportRe = new RegExp(
      `export\\s+(?:async\\s+function\\s+${method}\\b|const\\s+${method}\\s*=|function\\s+${method}\\b)`,
    );
    const match = exportRe.exec(source);
    if (!match) {
      // `export { handler as GET }` style
      if (new RegExp(`as\\s+${method}\\b`).test(source)) {
        endpoints.push({ method, description: "" });
      }
      continue;
    }

    // Look for a JSDoc / block comment immediately before the export
    const before = source.slice(0, match.index).trimEnd();
    let description = "";
    if (before.endsWith("*/")) {
      const start = before.lastIndexOf("/*");
      if (start !== -1) description = cleanComment(before.slice(start));
    }

    // Collect body fields destructured from req.json() inside the handler
    const nextExport = source
      .slice(match.index + 1)
      .search(/\nexport\s+(async\s+)?(function|const)/);
    const body =
      nextExport === -1
        ? source.slice(match.index)
        : source.slice(match.index, match.index + 1 + nextExport);
    const bodyFields = new Set();
    const destructureRe =
      /const\s*\{([^}]*)\}\s*=\s*(?:await\s+)?(?:req|request)\.json\(\)/g;
    let m;
    while ((m = destructureRe.exec(body))) {
      m[1]
        .split(",")
        .map((f) => f.split(/[:=]/)[0].replace("...", "").trim())
        .filter(Boolean)
        .forEach((f) => bodyFields.add(f));
    }
    const bodyVarRe =
      /(?:const|let)\s+(\w+)\s*=\s*await\s+(?:req|request)\.json\(\)/g;
    while ((m = bodyVarRe.exec(body))) {
      const accessRe = new RegExp(`\\b${m[1]}\\.(\\w+)`, "g");
      let a;
      while ((a = accessRe.exec(body))) bodyFields.add(a[1]);
      const spreadRe = new RegExp(
        `const\\s*\\{([^}]*)\\}\\s*=\\s*${m[1]}\\b`,
        "g",
      );
      while ((a = spreadRe.exec(body))) {
        a[1]
          .split(",")
          .map((f) => f.split(/[:=]/)[0].replace("...", "").trim())
          .filter(Boolean)
          .forEach((f) => bodyFields.add(f));
      }
    }
    const queryFields = new Set();
    const queryRe = /searchParams\.get\(\s*["'`]([^"'`]+)["'`]\s*\)/g;
    while ((m = queryRe.exec(body))) queryFields.add(m[1]);

    const usesFormData = /\.formData\(\)/.test(body);

    endpoints.push({
      method,
      description: description.slice(0, 400),
      ...(bodyFields.size ? { bodyFields: [...bodyFields] } : {}),
      ...(queryFields.size ? { queryParams: [...queryFields] } : {}),
      ...(usesFormData ? { multipart: true } : {}),
    });
  }
  return endpoints;
}

function main() {
  const catalog = [];
  for (const file of walk(API_DIR).sort()) {
    const apiPath = toApiPath(file);
    if (EXCLUDED_PREFIXES.some((prefix) => apiPath.startsWith(prefix)))
      continue;
    for (const endpoint of extractEndpoints(file)) {
      if (EXCLUDED_ENDPOINTS.has(`${endpoint.method} ${apiPath}`)) continue;
      catalog.push({ path: apiPath, ...endpoint });
    }
  }
  fs.writeFileSync(OUT_FILE, JSON.stringify(catalog, null, 2) + "\n");
  console.log(`Wrote ${catalog.length} endpoints to ${path.relative(ROOT, OUT_FILE)}`);
}

main();
