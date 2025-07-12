import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import Lead from "@/models/Lead";

// PUT - Update lead stage
export async function PUT(request, { params }) {
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

    const body = await request.json();
    const { stage, comment } = body;

    if (!stage) {
      return NextResponse.json({ error: "Stage is required" }, { status: 400 });
    }

    const validStages = [
      "Lead",
      "Never replied",
      "Qualified",
      "Proposal Sent",
      "Negotiations",
      "Won",
      "Lost",
    ];
    if (!validStages.includes(stage)) {
      return NextResponse.json({ error: "Invalid stage" }, { status: 400 });
    }

    const lead = await Lead.findById(params.id);
    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    // Update stage with version history
    await lead.updateStage(stage, session.user.id, comment);

    // Populate references including version history
    await lead.populate("assignedTo", "name email");
    await lead.populate("linkedUser", "name email");
    await lead.populate("versionHistory.changedBy", "name email");

    return NextResponse.json({ success: true, lead });
  } catch (error) {
    console.error("Error updating lead stage:", error);
    return NextResponse.json(
      { error: "Failed to update lead stage" },
      { status: 500 },
    );
  }
}
