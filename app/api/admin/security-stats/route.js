import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import { formCollections } from "@/libs/formStore";

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
    const { receipts, reviews } = await formCollections();
    const stats = {
      storage: "MongoDB",
      recentDecisions: await receipts
        .aggregate([
          { $match: { state: { $exists: true }, expiresAt: { $gt: new Date() } } },
          {
            $group: {
              _id: { state: "$state", status: "$status" },
              count: { $sum: 1 },
            },
          },
        ])
        .toArray(),
      heldForReview: await reviews.countDocuments({
        expiresAt: { $gt: new Date() },
      }),
    };

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
