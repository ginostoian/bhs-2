import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import Lead from "@/models/Lead";

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongo();

    // 1. Leads with no activity for > 7 days (Aging)
    // We can use the static method findAgingLeads or build a custom query count
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const agingCount = await Lead.countDocuments({
      agingDays: { $gte: 7 },
      stage: { $nin: ["Won", "Lost"] },
      isActive: true,
      isArchived: false,
      $or: [{ agingPaused: false }, { agingPaused: { $exists: false } }],
    });

    // 2. Leads in "Lead" stage for > 14 days (Stagnant)
    // We need to check when they were created or last stage change?
    // The requirement says "Status 'Lead' for > 14 days without qualification".
    // Assuming if they are still in "Lead" stage and created > 14 days ago.
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

    const stagnantCount = await Lead.countDocuments({
      stage: "Lead",
      createdAt: { $lt: fourteenDaysAgo },
      isActive: true,
      isArchived: false,
    });

    return NextResponse.json({
      agingCount,
      stagnantCount,
    });
  } catch (error) {
    console.error("Error fetching CRM stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 },
    );
  }
}
