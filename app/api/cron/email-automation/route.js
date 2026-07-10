import { NextResponse } from "next/server";
import { authorizeCronOrAdmin } from "@/libs/cronAuth";
import { processDueEmails } from "@/libs/crmEmailAutomation";

const run = async (request) => {
  if (!(await authorizeCronOrAdmin(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const result = await processDueEmails();
    return NextResponse.json({
      success: true,
      processed: result.processed,
      results: result.results,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Email automation cron failed", error);
    return NextResponse.json(
      { error: "Email automation cron failed" },
      { status: 500 },
    );
  }
};

export const GET = run;
export const POST = run;
