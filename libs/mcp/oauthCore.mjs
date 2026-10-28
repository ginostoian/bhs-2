import crypto from "crypto";

// Pure OAuth helpers for the admin MCP server (no database or app aliases),
// kept separate so they can be unit tested directly.

export const DEFAULT_SCOPES = ["read", "write"];
export const SUPPORTED_SCOPES = ["read", "write"];

/** Parse a space- or comma-separated scope string into supported scopes. */
export const parseScopes = (scope) => {
  if (!scope) return [...DEFAULT_SCOPES];
  const requested = String(scope)
    .split(/[\s,]+/)
    .map((s) => s.trim())
    .filter(Boolean);
  const scopes = requested.filter((s) => SUPPORTED_SCOPES.includes(s));
  // "write" without "read" makes no sense for an agent
  if (scopes.includes("write") && !scopes.includes("read")) scopes.push("read");
  return scopes.length ? scopes : [...DEFAULT_SCOPES];
};

const LOOPBACK_HOSTS = new Set(["localhost", "127.0.0.1", "[::1]"]);

/** Redirect URIs must be https, http loopback, or an app's private scheme. */
export function isAllowedRedirectUri(uri) {
  let url;
  try {
    url = new URL(uri);
  } catch {
    return false;
  }
  if (url.hash) return false;
  if (url.protocol === "https:") return true;
  if (url.protocol === "http:") return LOOPBACK_HOSTS.has(url.hostname);
  return !["javascript:", "data:", "file:", "vbscript:", "blob:"].includes(
    url.protocol,
  );
}

/**
 * Exact match against the registered URIs, except loopback URIs may use any
 * port (RFC 8252 §7.3) because native apps pick a free port at runtime.
 */
export function redirectUriMatches(registered, candidate) {
  if (registered.includes(candidate)) return true;
  let target;
  try {
    target = new URL(candidate);
  } catch {
    return false;
  }
  if (target.protocol !== "http:" || !LOOPBACK_HOSTS.has(target.hostname)) {
    return false;
  }
  return registered.some((uri) => {
    try {
      const reg = new URL(uri);
      return (
        reg.protocol === "http:" &&
        reg.hostname === target.hostname &&
        reg.pathname === target.pathname &&
        reg.search === target.search
      );
    } catch {
      return false;
    }
  });
}

export function buildRedirect(redirectUri, values) {
  const url = new URL(redirectUri);
  for (const [key, value] of Object.entries(values)) {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, value);
    }
  }
  return url.toString();
}

export function verifyPkce(verifier, challenge) {
  if (!verifier || !challenge) return false;
  const computed = crypto
    .createHash("sha256")
    .update(verifier)
    .digest("base64url");
  return computed === challenge;
}
