import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongoose from "@/libs/mongoose";
import McpToken from "@/models/McpToken";
import "@/models/McpOAuthClient";
import "@/models/User";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/mcp
 * Personal access tokens and connected AI apps (admin only)
 */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectMongoose();

  const now = new Date();
  const [personal, oauth] = await Promise.all([
    McpToken.find({ kind: "personal", revokedAt: null })
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .lean(),
    // Each live grant is represented by its refresh token
    McpToken.find({
      kind: "oauth_refresh",
      revokedAt: null,
      expiresAt: { $gt: now },
    })
      .populate("user", "name email")
      .populate("client", "clientName")
      .sort({ createdAt: -1 })
      .lean(),
  ]);

  // Access tokens carry the latest use of each grant
  const accessTokens = await McpToken.find({
    grantId: { $in: oauth.map((t) => t.grantId) },
    kind: "oauth_access",
  })
    .select("grantId lastUsedAt createdAt")
    .lean();
  const lastUsedByGrant = {};
  for (const t of accessTokens) {
    const used = t.lastUsedAt || t.createdAt;
    if (!lastUsedByGrant[t.grantId] || used > lastUsedByGrant[t.grantId]) {
      lastUsedByGrant[t.grantId] = used;
    }
  }

  const shape = (t) => ({
    id: String(t._id),
    name: t.name,
    prefix: t.prefix,
    scopes: t.scopes,
    user: t.user ? { name: t.user.name, email: t.user.email } : null,
    createdAt: t.createdAt,
    lastUsedAt: t.lastUsedAt,
  });

  return NextResponse.json({
    tokens: personal.map(shape),
    connections: oauth.map((t) => ({
      ...shape(t),
      clientName: t.client?.clientName || "AI connector",
      lastUsedAt: lastUsedByGrant[t.grantId] || t.lastUsedAt,
    })),
  });
}
