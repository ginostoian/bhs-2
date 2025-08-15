import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import Lead from "@/models/Lead";

// GET - Test endpoint to debug archived leads
export async function GET(request) {
  try {
    await connectMongo();

    // Check total leads
    const totalLeads = await Lead.countDocuments({});

    // Check archived leads
    const archivedLeads = await Lead.countDocuments({ isArchived: true });

    // Check active leads
    const activeLeads = await Lead.countDocuments({ isActive: true });

    // Check leads with both flags
    const bothFlags = await Lead.countDocuments({
      isActive: true,
      isArchived: true,
    });

    // Get a sample of archived leads
    const sampleArchived = await Lead.find({ isArchived: true })
      .limit(5)
      .lean();

    // Get a sample of all leads to see their structure
    const sampleAll = await Lead.find({}).limit(5).lean();

    return NextResponse.json({
      success: true,
      counts: {
        totalLeads,
        archivedLeads,
        activeLeads,
        bothFlags,
      },
      sampleArchived,
      sampleAll,
    });
  } catch (error) {
    console.error("Error in test endpoint:", error);
    return NextResponse.json(
      { error: "Test failed", details: error.message },
      { status: 500 },
    );
  }
}
