import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import { processDueEmails } from "@/libs/crmEmailAutomation";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log(
      "🔄 Processing due emails initiated by admin:",
      session.user.email,
    );

    const result = await processDueEmails();

    console.log("✅ Due emails processing completed:", result);

    return NextResponse.json({
      success: true,
      message: `Processed ${result.processed} email automations`,
      details: result,
    });
  } catch (error) {
    console.error("❌ Error processing due emails:", error);
    return NextResponse.json(
      { error: "Failed to process due emails" },
      { status: 500 },
    );
  }
}
