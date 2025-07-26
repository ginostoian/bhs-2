import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongoose from "@/libs/mongoose";
import Lead from "@/models/Lead";
import EmailAutomation from "@/models/EmailAutomation";
import { resumeEmailAutomation } from "@/libs/crmEmailAutomation";

// POST - Resume email automation
export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongoose();

    const { id: leadId } = params;
    const body = await request.json();
    const { reason } = body;

    // Find the lead
    const lead = await Lead.findById(leadId);
    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    // Resume the email automation
    const automation = await resumeEmailAutomation(leadId, reason);

    // Add activity to lead
    await lead.addActivity({
      type: "email",
      title: "Email automation resumed",
      description: `Email automation manually resumed by admin: ${reason}`,
      status: "done",
      contactMade: false,
      createdBy: session.user.id,
      metadata: {
        emailType: "automation_resumed",
        reason,
        automated: false,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Email automation resumed successfully",
      leadId: lead._id,
      leadName: lead.name,
      automation,
    });
  } catch (error) {
    console.error("Error resuming email automation:", error);
    return NextResponse.json(
      { error: "Failed to resume email automation" },
      { status: 500 },
    );
  }
}
