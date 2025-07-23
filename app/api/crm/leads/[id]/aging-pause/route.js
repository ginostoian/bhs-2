import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import Lead from "@/models/Lead";

// POST - Toggle aging pause state
export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongo();

    // Validate ID parameter
    if (!params.id || params.id === "undefined") {
      return NextResponse.json({ error: "Invalid lead ID" }, { status: 400 });
    }

    const { reason } = await request.json();

    const lead = await Lead.findById(params.id);
    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    // Toggle the aging pause state
    const newPauseState = !lead.agingPaused;
    lead.agingPaused = newPauseState;

    if (newPauseState) {
      // Pausing aging
      lead.agingPausedAt = new Date();
      lead.agingPausedReason = reason || "Aging paused by admin";
    } else {
      // Resuming aging
      lead.agingPausedAt = null;
      lead.agingPausedReason = null;
      // Reset aging to 0 when resuming
      lead.agingDays = 0;
      lead.lastContactDate = new Date();
    }

    await lead.save();

    return NextResponse.json({
      success: true,
      lead: {
        id: lead._id,
        agingPaused: lead.agingPaused,
        agingPausedAt: lead.agingPausedAt,
        agingPausedReason: lead.agingPausedReason,
        agingDays: lead.agingDays,
      },
      message: newPauseState
        ? "Aging timer paused successfully"
        : "Aging timer resumed successfully",
    });
  } catch (error) {
    console.error("Error toggling aging pause:", error);
    return NextResponse.json(
      { error: "Failed to toggle aging pause" },
      { status: 500 },
    );
  }
}
