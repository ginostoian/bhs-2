import connectMongoose from "@/libs/mongoose";
import McpOAuthClient from "@/models/McpOAuthClient";
import { hashSecret, randomSecret } from "@/libs/mcp/auth";
import {
  corsPreflight,
  isAllowedRedirectUri,
  oauthError,
  oauthJson,
} from "@/libs/mcp/oauth";

export const dynamic = "force-dynamic";

/**
 * POST /api/oauth/register
 * Dynamic client registration (RFC 7591) so Claude, ChatGPT and other MCP
 * clients can register themselves. Registering grants nothing on its own —
 * an admin still has to sign in and approve the connection.
 */
export async function POST(req) {
  const body = await req.json().catch(() => null);
  if (!body) return oauthError("invalid_client_metadata", "JSON body required");

  const redirectUris = Array.isArray(body.redirect_uris)
    ? body.redirect_uris.map(String).slice(0, 20)
    : [];
  if (!redirectUris.length || !redirectUris.every(isAllowedRedirectUri)) {
    return oauthError("invalid_redirect_uri", "Provide valid redirect_uris");
  }

  const authMethod = [
    "none",
    "client_secret_post",
    "client_secret_basic",
  ].includes(body.token_endpoint_auth_method)
    ? body.token_endpoint_auth_method
    : "none";

  await connectMongoose();
  const clientId = `bhs_client_${randomSecret(16)}`;
  const clientSecret = authMethod === "none" ? null : randomSecret(32);
  await McpOAuthClient.create({
    clientId,
    clientName: String(body.client_name || "AI connector").slice(0, 100),
    redirectUris,
    tokenEndpointAuthMethod: authMethod,
    clientSecretHash: clientSecret ? hashSecret(clientSecret) : null,
  });

  return oauthJson(
    {
      client_id: clientId,
      ...(clientSecret
        ? { client_secret: clientSecret, client_secret_expires_at: 0 }
        : {}),
      client_id_issued_at: Math.floor(Date.now() / 1000),
      client_name: body.client_name || "AI connector",
      redirect_uris: redirectUris,
      grant_types: ["authorization_code", "refresh_token"],
      response_types: ["code"],
      token_endpoint_auth_method: authMethod,
    },
    201,
  );
}

export async function OPTIONS() {
  return corsPreflight();
}
