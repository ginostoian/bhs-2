import { authorizationServerMetadata, corsPreflight, oauthJson } from "@/libs/mcp/oauth";

export const dynamic = "force-dynamic";

/**
 * OAuth authorization server metadata (RFC 8414).
 * Served at /.well-known/oauth-authorization-server via a rewrite.
 */
export async function GET(req) {
  return oauthJson(authorizationServerMetadata(req));
}

export async function OPTIONS() {
  return corsPreflight();
}
