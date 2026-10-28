import connectMongoose from "@/libs/mongoose";
import McpOAuthClient from "@/models/McpOAuthClient";
import { getPublicOrigin, parseScopes, SUPPORTED_SCOPES } from "./auth";
import { redirectUriMatches } from "./oauthCore.mjs";

export {
  buildRedirect,
  isAllowedRedirectUri,
  verifyPkce,
} from "./oauthCore.mjs";

// OAuth 2.1 helpers for connecting AI clients (Claude, ChatGPT) to /api/mcp.
// Authorization code flow with PKCE (S256), dynamic client registration and
// rotating refresh tokens. The consent screen lives at /oauth/authorize.

export const AUTH_CODE_TTL_SECONDS = 5 * 60;

export function authorizationServerMetadata(req) {
  const origin = getPublicOrigin(req);
  return {
    issuer: origin,
    authorization_endpoint: `${origin}/oauth/authorize`,
    token_endpoint: `${origin}/api/oauth/token`,
    registration_endpoint: `${origin}/api/oauth/register`,
    revocation_endpoint: `${origin}/api/oauth/revoke`,
    response_types_supported: ["code"],
    grant_types_supported: ["authorization_code", "refresh_token"],
    code_challenge_methods_supported: ["S256"],
    token_endpoint_auth_methods_supported: [
      "none",
      "client_secret_post",
      "client_secret_basic",
    ],
    scopes_supported: SUPPORTED_SCOPES,
    service_documentation: `${origin}/admin/ai-agents`,
  };
}

export function protectedResourceMetadata(req) {
  const origin = getPublicOrigin(req);
  return {
    resource: `${origin}/api/mcp`,
    authorization_servers: [origin],
    scopes_supported: SUPPORTED_SCOPES,
    bearer_methods_supported: ["header"],
    resource_name: "Better Homes Studio Admin",
  };
}

/**
 * Validate the parameters of an authorization request.
 * Returns { client, params } or { error, redirectable } — errors are only
 * redirected back to the client once client_id + redirect_uri are trusted.
 */
export async function validateAuthorizeRequest(input) {
  const params = {
    responseType: input.response_type,
    clientId: input.client_id,
    redirectUri: input.redirect_uri,
    state: input.state || "",
    codeChallenge: input.code_challenge,
    codeChallengeMethod: input.code_challenge_method || "plain",
    scopes: parseScopes(input.scope),
    resource: input.resource || null,
  };

  if (!params.clientId) {
    return { error: "Missing client_id", redirectable: false, params };
  }
  await connectMongoose();
  const client = await McpOAuthClient.findOne({
    clientId: params.clientId,
  }).lean();
  if (!client) {
    return {
      error: "This connector isn't registered. Remove it and add it again.",
      redirectable: false,
      params,
    };
  }
  if (
    !params.redirectUri ||
    !redirectUriMatches(client.redirectUris, params.redirectUri)
  ) {
    return {
      error: "The redirect address doesn't match this connector.",
      redirectable: false,
      params,
    };
  }
  if (params.responseType !== "code") {
    return { error: "unsupported_response_type", redirectable: true, params, client };
  }
  if (!params.codeChallenge || params.codeChallengeMethod !== "S256") {
    return {
      error: "invalid_request",
      description: "PKCE with S256 is required",
      redirectable: true,
      params,
      client,
    };
  }
  return { client, params };
}

export const oauthError = (error, description, status = 400) =>
  Response.json(
    { error, ...(description ? { error_description: description } : {}) },
    {
      status,
      headers: {
        "Cache-Control": "no-store",
        "Access-Control-Allow-Origin": "*",
      },
    },
  );

export const oauthJson = (body, status = 200) =>
  Response.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "Access-Control-Allow-Origin": "*",
    },
  });

export const corsPreflight = () =>
  new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Authorization, Content-Type, Mcp-Protocol-Version",
    },
  });

/** Read form-encoded or JSON bodies, as OAuth clients send either. */
export async function readBody(req) {
  const type = req.headers.get("content-type") || "";
  if (type.includes("application/json")) {
    return (await req.json().catch(() => ({}))) || {};
  }
  const text = await req.text();
  return Object.fromEntries(new URLSearchParams(text));
}
