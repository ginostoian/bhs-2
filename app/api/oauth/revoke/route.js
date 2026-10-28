import { findActiveToken, revokeGrant } from "@/libs/mcp/auth";
import McpToken from "@/models/McpToken";
import { corsPreflight, readBody } from "@/libs/mcp/oauth";

export const dynamic = "force-dynamic";

/**
 * POST /api/oauth/revoke
 * Token revocation (RFC 7009). Revoking either token ends the whole grant.
 */
export async function POST(req) {
  const body = await readBody(req);
  const token = await findActiveToken(body.token, [
    "oauth_access",
    "oauth_refresh",
  ]);
  if (token) {
    if (token.grantId) await revokeGrant(token.grantId);
    else await McpToken.updateOne({ _id: token._id }, { revokedAt: new Date() });
  }
  // Always 200, even for unknown tokens (RFC 7009 §2.2)
  return new Response(null, {
    status: 200,
    headers: { "Access-Control-Allow-Origin": "*" },
  });
}

export async function OPTIONS() {
  return corsPreflight();
}
