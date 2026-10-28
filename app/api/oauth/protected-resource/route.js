import { corsPreflight, oauthJson, protectedResourceMetadata } from "@/libs/mcp/oauth";

export const dynamic = "force-dynamic";

/**
 * OAuth protected resource metadata (RFC 9728) for /api/mcp.
 * Served at /.well-known/oauth-protected-resource via a rewrite.
 */
export async function GET(req) {
  return oauthJson(protectedResourceMetadata(req));
}

export async function OPTIONS() {
  return corsPreflight();
}
