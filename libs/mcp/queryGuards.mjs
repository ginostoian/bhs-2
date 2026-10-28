import mongoose from "mongoose";

// Guards for the agent read-only database tools: block code execution,
// writes and credential collections, and strip secrets from results.
// Kept free of app path aliases so it can be unit tested directly.

// Credential collections agents may never read
export const HIDDEN_MODELS = new Set(["McpToken", "McpAuthCode", "McpOAuthClient"]);
const HIDDEN_COLLECTIONS = new Set([
  "mcptokens",
  "mcpauthcodes",
  "mcpoauthclients",
  // NextAuth adapter collections hold Google OAuth tokens and sessions
  "accounts",
  "sessions",
  "verification_tokens",
]);

// Field names stripped from every result, wherever they appear
export const SENSITIVE_KEYS = new Set([
  "password",
  "tokenHash",
  "codeHash",
  "clientSecretHash",
  "access_token",
  "refresh_token",
  "id_token",
  "sessionToken",
]);

// Operators that run code or write data
const FORBIDDEN_OPERATORS = new Set([
  "$where",
  "$function",
  "$accumulator",
  "$out",
  "$merge",
]);
const LOOKUP_STAGES = ["$lookup", "$graphLookup", "$unionWith"];

export function assertSafe(value, path = "filter") {
  if (Array.isArray(value)) {
    value.forEach((v, i) => assertSafe(v, `${path}[${i}]`));
    return;
  }
  if (!value || typeof value !== "object") return;
  for (const [key, inner] of Object.entries(value)) {
    if (FORBIDDEN_OPERATORS.has(key)) {
      throw new Error(`Operator ${key} is not allowed (${path})`);
    }
    if (LOOKUP_STAGES.includes(key)) {
      const from = typeof inner === "string" ? inner : inner?.from || inner?.coll;
      if (from && HIDDEN_COLLECTIONS.has(String(from).toLowerCase())) {
        throw new Error(`Collection "${from}" is not readable`);
      }
    }
    assertSafe(inner, `${path}.${key}`);
  }
}

/** Remove credential fields from any result shape. */
export function redact(value) {
  if (Array.isArray(value)) return value.map(redact);
  if (value instanceof mongoose.Types.ObjectId) return value.toString();
  if (value instanceof Date) return value.toISOString();
  if (Buffer.isBuffer(value)) return `<binary ${value.length} bytes>`;
  if (value && typeof value === "object") {
    if (value._bsontype === "ObjectId" || value._bsontype === "ObjectID") {
      return value.toString();
    }
    const out = {};
    for (const [key, inner] of Object.entries(value)) {
      if (SENSITIVE_KEYS.has(key) || key === "__v") continue;
      out[key] = redact(inner);
    }
    return out;
  }
  return value;
}

// Agents write ObjectIds and dates as {"$oid": "..."} / {"$date": "..."}.
// find() casts plain strings via the schema, but aggregate() does not.
export function reviveExtendedJson(value) {
  if (Array.isArray(value)) return value.map(reviveExtendedJson);
  if (!value || typeof value !== "object") return value;
  const keys = Object.keys(value);
  if (keys.length === 1 && keys[0] === "$oid") {
    return new mongoose.Types.ObjectId(String(value.$oid));
  }
  if (keys.length === 1 && keys[0] === "$date") {
    return new Date(value.$date);
  }
  const out = {};
  for (const [key, inner] of Object.entries(value)) {
    out[key] = reviveExtendedJson(inner);
  }
  return out;
}
