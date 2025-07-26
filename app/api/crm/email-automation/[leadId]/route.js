import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import {
  getLeadAutomationDetails,
  initializeEmailAutomation,
  pauseEmailAutomation,
  resumeEmailAutomation,
} from "@/libs/crmEmailAutomation";

// GET - Get automation details for a specific lead
export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { leadId } = params;

    if (!leadId || leadId === "undefined") {
      return NextResponse.json({ error: "Invalid lead ID" }, { status: 400 });
    }

    const automation = await getLeadAutomationDetails(leadId);

    if (!automation) {
      return NextResponse.json(
        { error: "Automation not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      automation,
    });
  } catch (error) {
    console.error("Error getting lead automation details:", error);
    return NextResponse.json(
      { error: "Failed to get automation details" },
      { status: 500 },
    );
  }
}

// POST - Initialize or control automation for a specific lead
export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { leadId } = params;
    const body = await request.json();
    const { action, stage, reason } = body;

    if (!leadId || leadId === "undefined") {
      return NextResponse.json({ error: "Invalid lead ID" }, { status: 400 });
    }

    let result;

    switch (action) {
      case "initialize":
        result = await initializeEmailAutomation(leadId, stage);
        break;

      case "pause":
        if (!reason) {
          return NextResponse.json(
            { error: "Reason is required for pause action" },
            { status: 400 },
          );
        }
        await pauseEmailAutomation(leadId, reason);
        result = { message: "Automation paused successfully" };
        break;

      case "resume":
        await resumeEmailAutomation(leadId);
        result = { message: "Automation resumed successfully" };
        break;

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error("Error controlling lead automation:", error);
    return NextResponse.json(
      { error: "Failed to control automation" },
      { status: 500 },
    );
  }
}
