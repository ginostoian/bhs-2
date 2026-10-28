import crypto from "crypto";
import connectMongoose from "@/libs/mongoose";
import User from "@/models/User";
import McpToken from "@/models/McpToken";
import "@/models/McpOAuthClient";
import { DEFAULT_SCOPES, parseScopes, SUPPORTED_SCOPES } from "./oauthCore.mjs";

// Helpers for the credentials AI agents use to reach the admin MCP server.

export const ACCESS_TOKEN_TTL_SECONDS = 60 * 60; // 1 hour
export const REFRESH_TOKEN_TTL_SECONDS = 60 * 60 * 24 * 90; // 90 days
export { DEFAULT_SCOPES, SUPPORTED_SCOPES, parseScopes };

const TOKEN_PREFIXES = {
  personal: "bhs_pat_",
  oauth_access: "bhs_at_",
  oauth_refresh: "bhs_rt_",
};

export const hashSecret = (value) =>
  crypto.createHash("sha256").update(String(value)).digest("hex");

export const randomSecret = (bytes = 32) =>
  crypto.randomBytes(bytes).toString("base64url");

export const safeEqual = (a, b) => {
  const left = Buffer.from(String(a));
  const right = Buffer.from(String(b));
  return left.length === right.length && crypto.timingSafeEqual(left, right);
};

/**
 * Create and store a new token. Returns the plaintext token (shown once) and
 * the saved document.
 */
export async function createToken({
  kind,
  userId,
  name = "",
  scopes = DEFAULT_SCOPES,
  clientId = null,
  grantId = null,
  ttlSeconds = null,
}) {
  await connectMongoose();
  const token = `${TOKEN_PREFIXES[kind]}${randomSecret(32)}`;
  const doc = await McpToken.create({
    name,
    kind,
    tokenHash: hashSecret(token),
    prefix: token.slice(0, TOKEN_PREFIXES[kind].length + 6),
    user: userId,
    scopes,
    client: clientId,
    grantId,
    expiresAt: ttlSeconds ? new Date(Date.now() + ttlSeconds * 1000) : null,
  });
  return { token, doc };
}

/** Issue an OAuth access + refresh token pair for one grant. */
export async function issueOAuthTokens({ userId, clientId, scopes, grantId }) {
  const grant = grantId || randomSecret(16);
  const [access, refresh] = await Promise.all([
    createToken({
      kind: "oauth_access",
      userId,
      scopes,
      clientId,
      grantId: grant,
      ttlSeconds: ACCESS_TOKEN_TTL_SECONDS,
    }),
    createToken({
      kind: "oauth_refresh",
      userId,
      scopes,
      clientId,
      grantId: grant,
      ttlSeconds: REFRESH_TOKEN_TTL_SECONDS,
    }),
  ]);
  return {
    access_token: access.token,
    token_type: "Bearer",
    expires_in: ACCESS_TOKEN_TTL_SECONDS,
    refresh_token: refresh.token,
    scope: scopes.join(" "),
  };
}

/** Find a live (not revoked, not expired) token document by its plaintext. */
export async function findActiveToken(token, kinds) {
  if (!token) return null;
  await connectMongoose();
  const doc = await McpToken.findOne({
    tokenHash: hashSecret(token),
    kind: { $in: kinds },
    revokedAt: null,
  }).populate("client", "clientName");
  if (!doc) return null;
  if (doc.expiresAt && doc.expiresAt < new Date()) return null;
  return doc;
}

/**
 * Authenticate an MCP request from its `Authorization: Bearer` header.
 * Returns the agent context or null. The token owner must still be an admin,
 * so demoting a user immediately cuts off their agents.
 */
export async function authenticateMcpRequest(req) {
  const header = req.headers.get("authorization") || "";
  const match = header.match(/^Bearer\s+(.+)$/i);
  if (!match) return null;

  const tokenDoc = await findActiveToken(match[1].trim(), [
    "personal",
    "oauth_access",
  ]);
  if (!tokenDoc) return null;

  const user = await User.findById(tokenDoc.user)
    .select("name email role")
    .lean();
  if (!user || user.role !== "admin") return null;

  // Throttle lastUsedAt writes to once a minute
  if (!tokenDoc.lastUsedAt || Date.now() - tokenDoc.lastUsedAt > 60 * 1000) {
    McpToken.updateOne(
      { _id: tokenDoc._id },
      { lastUsedAt: new Date() },
    ).catch(() => {});
  }

  return {
    tokenId: tokenDoc._id,
    scopes: tokenDoc.scopes || [],
    clientName:
      tokenDoc.client?.clientName ||
      (tokenDoc.kind === "personal" ? `Token: ${tokenDoc.name}` : "AI agent"),
    user: {
      id: String(user._id),
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
}

/** Revoke every token belonging to an OAuth grant. */
export async function revokeGrant(grantId) {
  if (!grantId) return;
  await connectMongoose();
  await McpToken.updateMany(
    { grantId, revokedAt: null },
    { revokedAt: new Date() },
  );
}

/** Public origin of the app, used in OAuth metadata and internal API calls. */
export function getPublicOrigin(req) {
  if (process.env.MCP_PUBLIC_URL) {
    return process.env.MCP_PUBLIC_URL.replace(/\/$/, "");
  }
  const url = new URL(req.url);
  const forwardedHost = req.headers.get("x-forwarded-host");
  const forwardedProto = req.headers.get("x-forwarded-proto");
  const host = forwardedHost || req.headers.get("host") || url.host;
  const proto =
    forwardedProto?.split(",")[0] ||
    (host.startsWith("localhost") || host.startsWith("127.")
      ? "http"
      : url.protocol.replace(":", ""));
  return `${proto}://${host}`;
}
