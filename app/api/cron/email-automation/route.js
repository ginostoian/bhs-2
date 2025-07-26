import { NextResponse } from "next/server";
import { processDueEmails } from "@/libs/crmEmailAutomation";

// POST - Cron job to process due emails
export async function POST(request) {
  try {
    console.log("🕐 Email automation cron job started");

    const result = await processDueEmails();

    console.log(
      `✅ Email automation cron job completed: ${result.processed} emails processed`,
    );

    return NextResponse.json({
      success: true,
      message: `Email automation cron job completed successfully`,
      processed: result.processed,
      results: result.results,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Email automation cron job failed:", error);
    return NextResponse.json(
      {
        error: "Email automation cron job failed",
        details: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}

// GET - Health check for email automation cron job
export async function GET(request) {
  try {
    return NextResponse.json({
      success: true,
      message: "Email automation cron job endpoint is healthy",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error in email automation health check:", error);
    return NextResponse.json({ error: "Health check failed" }, { status: 500 });
  }
}
