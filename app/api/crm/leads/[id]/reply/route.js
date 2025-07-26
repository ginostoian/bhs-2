import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongoose from "@/libs/mongoose";
import Lead from "@/models/Lead";
import EmailAutomation from "@/models/EmailAutomation";
import { handleLeadReply } from "@/libs/crmEmailAutomation";

// POST - Mark lead as replied
export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongoose();

    const { id: leadId } = params;
    const body = await request.json();
    const { replySubject, replyContent, replyDate } = body;

    // Find the lead
    const lead = await Lead.findById(leadId);
    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    // Find the email automation
    const automation = await EmailAutomation.findOne({
      leadId: lead._id,
      isActive: true,
    });

    if (!automation) {
      return NextResponse.json(
        {
          error: "No active email automation found for this lead",
        },
        { status: 404 },
      );
    }

    // Handle the lead reply
    const result = await handleLeadReply(
      lead._id,
      lead.email,
      replySubject || "Lead replied to automated email",
      replyContent || "Lead replied to automated email",
      automation,
    );

    if (!result.success) {
      return NextResponse.json(
        {
          error: result.error || "Failed to process lead reply",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Lead reply processed successfully",
      leadId: lead._id,
      leadName: lead.name,
      result,
    });
  } catch (error) {
    console.error("Error processing manual lead reply:", error);
    return NextResponse.json(
      { error: "Failed to process lead reply" },
      { status: 500 },
    );
  }
}
