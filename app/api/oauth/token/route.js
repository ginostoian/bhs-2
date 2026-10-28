import connectMongoose from "@/libs/mongoose";
import McpAuthCode from "@/models/McpAuthCode";
import McpOAuthClient from "@/models/McpOAuthClient";
import McpToken from "@/models/McpToken";
import User from "@/models/User";
import {
  findActiveToken,
  hashSecret,
  issueOAuthTokens,
  parseScopes,
  revokeGrant,
  safeEqual,
} from "@/libs/mcp/auth";
import {
  corsPreflight,
  oauthError,
  oauthJson,
  readBody,
  verifyPkce,
} from "@/libs/mcp/oauth";

export const dynamic = "force-dynamic";

/** Identify the client from Basic auth or the request body. */
async function authenticateClient(req, body) {
  let clientId = body.client_id;
  let clientSecret = body.client_secret;
  const header = req.headers.get("authorization") || "";
  if (header.startsWith("Basic ")) {
    const decoded = Buffer.from(header.slice(6), "base64").toString();
    const sep = decoded.indexOf(":");
    clientId = decodeURIComponent(decoded.slice(0, sep));
    clientSecret = decodeURIComponent(decoded.slice(sep + 1));
  }
  if (!clientId) return null;
  const client = await McpOAuthClient.findOne({ clientId }).select(
    "+clientSecretHash",
  );
  if (!client) return null;
  if (client.tokenEndpointAuthMethod !== "none") {
    if (
      !clientSecret ||
      !safeEqual(hashSecret(clientSecret), client.clientSecretHash)
    ) {
      return null;
    }
  }
  return client;
}

/**
 * POST /api/oauth/token
 * Exchanges an authorization code (with PKCE verifier) or a refresh token for
 * an access token to /api/mcp.
 */
export async function POST(req) {
  const body = await readBody(req);
  await connectMongoose();

  const client = await authenticateClient(req, body);
  if (!client) return oauthError("invalid_client", "Unknown client", 401);

  if (body.grant_type === "authorization_code") {
    // Single use: claim the code atomically
    const code = await McpAuthCode.findOneAndUpdate(
      { codeHash: hashSecret(body.code || ""), usedAt: null },
      { usedAt: new Date() },
    );
    if (
      !code ||
      code.expiresAt < new Date() ||
      String(code.client) !== String(client._id)
    ) {
      return oauthError("invalid_grant", "Invalid or expired code");
    }
    if (body.redirect_uri && body.redirect_uri !== code.redirectUri) {
      return oauthError("invalid_grant", "redirect_uri mismatch");
    }
    if (!verifyPkce(body.code_verifier, code.codeChallenge)) {
      return oauthError("invalid_grant", "PKCE verification failed");
    }
    const user = await User.findById(code.user).select("role").lean();
    if (user?.role !== "admin") {
      return oauthError("invalid_grant", "User is no longer an admin");
    }
    return oauthJson(
      await issueOAuthTokens({
        userId: code.user,
        clientId: client._id,
        scopes: code.scopes,
      }),
    );
  }

  if (body.grant_type === "refresh_token") {
    const refresh = await findActiveToken(body.refresh_token, ["oauth_refresh"]);
    if (!refresh || String(refresh.client?._id) !== String(client._id)) {
      return oauthError("invalid_grant", "Invalid refresh token");
    }
    const user = await User.findById(refresh.user).select("role").lean();
    if (user?.role !== "admin") {
      await revokeGrant(refresh.grantId);
      return oauthError("invalid_grant", "User is no longer an admin");
    }
    // Rotate: retire the old pair, issue a new one on the same grant
    await McpToken.updateMany(
      { grantId: refresh.grantId, revokedAt: null },
      { revokedAt: new Date() },
    );
    const scopes = body.scope
      ? parseScopes(body.scope).filter((s) => refresh.scopes.includes(s))
      : refresh.scopes;
    return oauthJson(
      await issueOAuthTokens({
        userId: refresh.user,
        clientId: client._id,
        scopes,
        grantId: refresh.grantId,
      }),
    );
  }

  return oauthError("unsupported_grant_type");
}

export async function OPTIONS() {
  return corsPreflight();
}
