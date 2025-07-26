import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import {
  processDueEmails,
  getEmailAutomationStats,
} from "@/libs/crmEmailAutomation";

// POST - Process due emails (triggered by cron job or manual request)
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { action } = body;

    if (action === "process_due_emails") {
      const result = await processDueEmails();

      return NextResponse.json({
        success: true,
        message: `Processed ${result.processed} email automations`,
        result,
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Error processing email automation:", error);
    return NextResponse.json(
      { error: "Failed to process email automation" },
      { status: 500 },
    );
  }
}

// GET - Get email automation statistics
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const stats = await getEmailAutomationStats();

    return NextResponse.json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error("Error getting email automation stats:", error);
    return NextResponse.json(
      { error: "Failed to get email automation stats" },
      { status: 500 },
    );
  }
}
