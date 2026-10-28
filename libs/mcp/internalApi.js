import { encode } from "next-auth/jwt";
import apiCatalog from "./apiCatalog.json";
import { matchesCatalog } from "./catalogMatch.mjs";

// Lets MCP tools act through the app's existing API routes, so agents get
// exactly the same validation, side effects (emails, notifications, status
// recalculation) and permissions as an admin clicking in the dashboard.
//
// Each call carries a short-lived NextAuth session cookie minted for the admin
// who owns the agent's token, so routes using getServerSession, getToken or
// requireAdmin all see a normal admin session.

const SESSION_COOKIE_NAMES = [
  "next-auth.session-token",
  "__Secure-next-auth.session-token",
];
const SESSION_MAX_AGE_SECONDS = 5 * 60;
const MAX_TEXT_CHARS = 60000;

async function mintSessionCookie(user) {
  const jwt = await encode({
    token: {
      sub: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      viaMcp: true,
    },
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
  return SESSION_COOKIE_NAMES.map((name) => `${name}=${jwt}`).join("; ");
}

const buildUrl = (origin, method, path, query) => {
  // Every call — including ones built from agent-supplied IDs — must hit a
  // catalogued endpoint verbatim (no traversal, query or encoded tricks).
  if (
    !path.startsWith("/api/") ||
    /[?#\s]/.test(path) ||
    !matchesCatalog(apiCatalog, method, path)
  ) {
    throw new Error(`${method} ${path} is not an available endpoint`);
  }
  const url = new URL(path, origin);
  if (url.origin !== new URL(origin).origin || url.pathname !== path) {
    throw new Error(`${method} ${path} is not an available endpoint`);
  }
  for (const [key, value] of Object.entries(query || {})) {
    if (value === undefined || value === null || value === "") continue;
    if (Array.isArray(value)) {
      value.forEach((v) => url.searchParams.append(key, String(v)));
    } else {
      url.searchParams.set(key, String(value));
    }
  }
  return url;
};

async function buildMultipart(multipart) {
  const form = new FormData();
  for (const [key, value] of Object.entries(multipart.fields || {})) {
    if (value === undefined || value === null) continue;
    form.append(
      key,
      typeof value === "object" ? JSON.stringify(value) : String(value),
    );
  }
  for (const file of multipart.files || []) {
    let bytes;
    let contentType = file.contentType || "application/octet-stream";
    if (file.base64) {
      bytes = Buffer.from(file.base64, "base64");
    } else if (file.url) {
      if (new URL(file.url).protocol !== "https:") {
        throw new Error("File URLs must use https");
      }
      const res = await fetch(file.url, { redirect: "error" });
      if (!res.ok) throw new Error(`Could not download ${file.url}`);
      bytes = Buffer.from(await res.arrayBuffer());
      contentType = file.contentType || res.headers.get("content-type") || contentType;
    } else {
      throw new Error("Each file needs base64 or url");
    }
    form.append(
      file.field || "files",
      new Blob([bytes], { type: contentType }),
      file.filename || "upload",
    );
  }
  return form;
}

/**
 * Call one of the app's own API routes as the given admin user.
 * Returns { ok, status, contentType, data } where data is parsed JSON, text,
 * or (for binary responses) { base64, size }.
 */
export async function callInternalApi({
  origin,
  user,
  method = "GET",
  path,
  query,
  body,
  multipart,
}) {
  const baseUrl = process.env.MCP_INTERNAL_BASE_URL || origin;
  const url = buildUrl(baseUrl, method, path, query);
  const headers = {
    cookie: await mintSessionCookie(user),
    "user-agent": "BHS-MCP/1.0",
    "x-bhs-mcp": "1",
    accept: "application/json, */*",
  };

  let requestBody;
  if (multipart) {
    requestBody = await buildMultipart(multipart);
  } else if (body !== undefined && method !== "GET" && method !== "HEAD") {
    headers["content-type"] = "application/json";
    requestBody = JSON.stringify(body);
  }

  const res = await fetch(url, {
    method,
    headers,
    body: requestBody,
    redirect: "manual",
    cache: "no-store",
  });

  const contentType = res.headers.get("content-type") || "";
  let data;
  if (contentType.includes("application/json")) {
    data = await res.json().catch(() => null);
  } else if (
    contentType.startsWith("text/") ||
    contentType.includes("xml") ||
    contentType.includes("javascript")
  ) {
    const text = await res.text();
    data =
      text.length > MAX_TEXT_CHARS
        ? `${text.slice(0, MAX_TEXT_CHARS)}\n…[truncated]`
        : text;
  } else if (res.status >= 300 && res.status < 400) {
    data = { redirect: res.headers.get("location") };
  } else {
    const buffer = Buffer.from(await res.arrayBuffer());
    data = { base64: buffer.toString("base64"), size: buffer.length };
  }

  return { ok: res.ok, status: res.status, contentType, data };
}
