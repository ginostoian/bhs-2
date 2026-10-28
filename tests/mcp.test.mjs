import test from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import { readFileSync } from "node:fs";
import mongoose from "mongoose";
import {
  isAllowedRedirectUri,
  parseScopes,
  redirectUriMatches,
  verifyPkce,
} from "../libs/mcp/oauthCore.mjs";
import {
  assertSafe,
  redact,
  reviveExtendedJson,
} from "../libs/mcp/queryGuards.mjs";
import { matchesCatalog } from "../libs/mcp/catalogMatch.mjs";

const catalog = JSON.parse(
  readFileSync(new URL("../libs/mcp/apiCatalog.json", import.meta.url)),
);

test("redirect URIs: https, loopback and app schemes only", () => {
  assert.ok(isAllowedRedirectUri("https://claude.ai/api/mcp/auth_callback"));
  assert.ok(isAllowedRedirectUri("http://localhost:6274/oauth/callback"));
  assert.ok(isAllowedRedirectUri("http://127.0.0.1:33418/callback"));
  assert.ok(!isAllowedRedirectUri("http://evil.example/callback"));
  assert.ok(!isAllowedRedirectUri("javascript:alert(1)"));
  assert.ok(!isAllowedRedirectUri("https://claude.ai/cb#fragment"));
  assert.ok(!isAllowedRedirectUri("not a url"));
});

test("redirect URI matching is exact, except loopback ports", () => {
  const registered = [
    "https://chatgpt.com/connector_platform_oauth_redirect",
    "http://localhost:3000/callback",
  ];
  assert.ok(redirectUriMatches(registered, registered[0]));
  assert.ok(redirectUriMatches(registered, "http://localhost:51234/callback"));
  assert.ok(!redirectUriMatches(registered, "http://localhost:51234/other"));
  assert.ok(
    !redirectUriMatches(
      registered,
      "https://chatgpt.com/connector_platform_oauth_redirect/../x",
    ),
  );
  assert.ok(!redirectUriMatches(registered, "https://evil.example/callback"));
});

test("PKCE S256 verification", () => {
  const verifier = crypto.randomBytes(32).toString("base64url");
  const challenge = crypto
    .createHash("sha256")
    .update(verifier)
    .digest("base64url");
  assert.ok(verifyPkce(verifier, challenge));
  assert.ok(!verifyPkce("wrong", challenge));
  assert.ok(!verifyPkce(undefined, challenge));
});

test("scopes default to read+write and write implies read", () => {
  assert.deepEqual(parseScopes(), ["read", "write"]);
  assert.deepEqual(parseScopes("read"), ["read"]);
  assert.deepEqual(parseScopes("write"), ["write", "read"]);
  assert.deepEqual(parseScopes("admin superuser"), ["read", "write"]);
});

test("query guards block code execution, writes and credential lookups", () => {
  assert.doesNotThrow(() => assertSafe({ status: { $in: ["Due"] } }));
  assert.throws(() => assertSafe({ $where: "true" }), /not allowed/);
  assert.throws(
    () => assertSafe({ $expr: { $function: { body: "" } } }),
    /not allowed/,
  );
  assert.throws(() => assertSafe([{ $merge: "x" }], "pipeline"), /not allowed/);
  assert.throws(
    () => assertSafe([{ $lookup: { from: "accounts", as: "a" } }], "pipeline"),
    /not readable/,
  );
  assert.throws(
    () => assertSafe([{ $unionWith: "mcptokens" }], "pipeline"),
    /not readable/,
  );
  assert.doesNotThrow(() =>
    assertSafe([{ $lookup: { from: "projects", as: "p" } }], "pipeline"),
  );
});

test("redact strips secrets at any depth", () => {
  const id = new mongoose.Types.ObjectId();
  const out = redact({
    _id: id,
    password: "hash",
    nested: [{ refresh_token: "x", name: "ok" }],
    __v: 0,
  });
  assert.deepEqual(out, { _id: id.toString(), nested: [{ name: "ok" }] });
});

test("extended JSON ObjectIds and dates are revived for pipelines", () => {
  const hex = "65f0c0ffee00000000000000";
  const out = reviveExtendedJson({
    user: { $oid: hex },
    dueDate: { $lt: { $date: "2026-01-01" } },
  });
  assert.ok(out.user instanceof mongoose.Types.ObjectId);
  assert.equal(out.user.toString(), hex);
  assert.ok(out.dueDate.$lt instanceof Date);
});

test("call_api only reaches catalogued endpoints", () => {
  assert.ok(matchesCatalog(catalog, "PUT", "/api/payments/65f0c0ffee00000000000000"));
  assert.ok(matchesCatalog(catalog, "GET", "/api/admin/quoting"));
  assert.ok(!matchesCatalog(catalog, "GET", "/api/cron/morning-brief"));
  assert.ok(!matchesCatalog(catalog, "POST", "/api/admin/mcp/tokens"));
  assert.ok(!matchesCatalog(catalog, "POST", "/api/oauth/token"));
  assert.ok(
    !matchesCatalog(catalog, "POST", "/api/projects/../admin/mcp/tokens/sections"),
  );
  assert.ok(!matchesCatalog(catalog, "PUT", "/api/payments/%2e%2e"));
  assert.ok(!matchesCatalog(catalog, "PUT", "/api/payments/a/b"));
});

test("catalog never exposes infrastructure endpoints", () => {
  const blocked = ["/api/auth", "/api/cron", "/api/webhook", "/api/mcp", "/api/oauth", "/api/admin/mcp"];
  for (const entry of catalog) {
    assert.ok(
      !blocked.some((prefix) => entry.path.startsWith(prefix)),
      `${entry.method} ${entry.path} should not be in the catalog`,
    );
  }
});
