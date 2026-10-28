import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongoose from "@/libs/mongoose";
import McpAuditLog from "@/models/McpAuditLog";
import "@/models/User";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/mcp/audit
 * Recent AI agent activity (admin only)
 */
export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const page = Math.max(parseInt(searchParams.get("page")) || 1, 1);
  const limit = Math.min(parseInt(searchParams.get("limit")) || 50, 200);
  const writesOnly = searchParams.get("writesOnly") === "true";

  await connectMongoose();
  const query = writesOnly ? { readOnly: false } : {};
  const [entries, total] = await Promise.all([
    McpAuditLog.find(query)
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    McpAuditLog.countDocuments(query),
  ]);

  return NextResponse.json({
    entries: entries.map((e) => ({
      id: String(e._id),
      tool: e.tool,
      readOnly: e.readOnly,
      clientName: e.clientName,
      user: e.user ? { name: e.user.name, email: e.user.email } : null,
      method: e.method,
      path: e.path,
      input: e.input,
      status: e.status,
      ok: e.ok,
      error: e.error,
      durationMs: e.durationMs,
      createdAt: e.createdAt,
    })),
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
}
