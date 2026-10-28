import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import { createToken, parseScopes } from "@/libs/mcp/auth";

export const dynamic = "force-dynamic";

/**
 * POST /api/admin/mcp/tokens
 * Create a personal access token for the signed-in admin. The token is only
 * returned once.
 */
export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { name, scopes } = await request.json();
  if (!name?.trim()) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }
  const { token, doc } = await createToken({
    kind: "personal",
    userId: session.user.id,
    name: name.trim().slice(0, 80),
    scopes: parseScopes(Array.isArray(scopes) ? scopes.join(" ") : scopes),
  });
  return NextResponse.json({
    token,
    id: String(doc._id),
    prefix: doc.prefix,
    scopes: doc.scopes,
  });
}
