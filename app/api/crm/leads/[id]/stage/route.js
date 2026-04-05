import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import Lead from "@/models/Lead";
import { syncPartnerReferralFromLead } from "@/libs/referrals";

// PUT - Update lead stage
export async function PUT(request, { params }) {
  try {
    console.log("🔄 Stage update request received for lead:", params.id);

    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      console.log("❌ Unauthorized access attempt");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongo();

    // Validate ID parameter
    if (!params.id || params.id === "undefined") {
      console.log("❌ Invalid lead ID:", params.id);
      return NextResponse.json({ error: "Invalid lead ID" }, { status: 400 });
    }

    const body = await request.json();
    const { stage, comment } = body;

    console.log("📝 Stage update data:", { leadId: params.id, stage, comment });

    if (!stage) {
      console.log("❌ Stage is required");
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
      console.log("❌ Invalid stage:", stage);
      return NextResponse.json({ error: "Invalid stage" }, { status: 400 });
    }

    const lead = await Lead.findById(params.id);
    if (!lead) {
      console.log("❌ Lead not found:", params.id);
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    console.log("✅ Lead found:", lead.name, "Current stage:", lead.stage);

    // Update stage with version history
    console.log("🔄 Updating stage from", lead.stage, "to", stage);
    await lead.updateStage(stage, session.user.id, comment);
    await syncPartnerReferralFromLead(lead);
    console.log("✅ Stage updated successfully");

    // Update email automation stage
    try {
      console.log("🔄 Updating email automation stage");
      const { updateEmailAutomationStage } = await import(
        "@/libs/crmEmailAutomation"
      );
      await updateEmailAutomationStage(params.id, stage, session.user.id);
      console.log("✅ Email automation stage updated");
    } catch (error) {
      console.error("❌ Error updating email automation stage:", error);
      // Don't fail the stage update if automation fails
      console.log(
        "⚠️ Continuing with stage update despite email automation error",
      );
    }

    // Populate references including version history
    console.log("🔄 Populating references");
    await lead.populate("assignedTo", "name email");
    await lead.populate("linkedUser", "name email");
    await lead.populate("versionHistory.changedBy", "name email");
    console.log("✅ References populated");

    console.log("✅ Stage update completed successfully");
    console.log("📤 Returning lead data:", {
      leadId: lead.id || lead._id,
      stage: lead.stage,
      name: lead.name,
    });
    return NextResponse.json({ success: true, lead });
  } catch (error) {
    console.error("❌ Error updating lead stage:", error);
    return NextResponse.json(
      { error: "Failed to update lead stage" },
      { status: 500 },
    );
  }
}
