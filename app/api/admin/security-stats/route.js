import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import { getRateLimitStats } from "@/libs/rateLimiter";

/**
 * GET /api/admin/security-stats
 * Get security statistics for admin monitoring
 */
export async function GET(request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get rate limiting statistics
    const stats = getRateLimitStats();

    return NextResponse.json({
      success: true,
      data: {
        rateLimiting: stats,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error fetching security stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch security statistics" },
      { status: 500 },
    );
  }
}
