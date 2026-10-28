import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongoose from "@/libs/mongoose";
import McpToken from "@/models/McpToken";
import { revokeGrant } from "@/libs/mcp/auth";

export const dynamic = "force-dynamic";

/**
 * DELETE /api/admin/mcp/tokens/[id]
 * Revoke a personal token, or disconnect an AI app (its whole OAuth grant).
 */
export async function DELETE(request, { params }) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectMongoose();
  const token = await McpToken.findById(params.id).catch(() => null);
  if (!token) {
    return NextResponse.json({ error: "Token not found" }, { status: 404 });
  }
  if (token.grantId) {
    await revokeGrant(token.grantId);
  } else {
    token.revokedAt = new Date();
    await token.save();
  }
  return NextResponse.json({ success: true });
}
