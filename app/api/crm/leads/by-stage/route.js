import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import Lead from "@/models/Lead";
import EmailAutomation from "@/models/EmailAutomation";

// GET - Fetch leads for a specific stage with pagination
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongo();

    const { searchParams } = new URL(request.url);
    const stage = searchParams.get("stage");
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const search = searchParams.get("search");

    if (!stage) {
      return NextResponse.json(
        { error: "Stage parameter is required" },
        { status: 400 },
      );
    }

    // Build query
    const query = {
      stage,
      isActive: true,
      isArchived: false,
    };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    // Execute query with pagination
    const skip = (page - 1) * limit;
    const leads = await Lead.find(query)
      .populate("assignedTo", "name email")
      .populate("linkedUser", "name email")
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get email automation data
    const leadIds = leads.map((lead) => lead._id);
    const automations = await EmailAutomation.find({
      leadId: { $in: leadIds },
    });

    // Create a map of leadId to automation data
    const automationMap = {};
    automations.forEach((automation) => {
      automationMap[automation.leadId.toString()] = {
        isActive: automation.isActive,
        currentStage: automation.currentStage,
        leadReplied: automation.leadReplied,
        pausedAt: automation.pausedAt,
        pausedReason: automation.pausedReason,
      };
    });

    // Add automation data to leads
    const leadsWithAutomation = leads.map((lead) => {
      const leadObj = lead.toObject();
      leadObj.emailAutomation = automationMap[lead._id.toString()] || null;
      return leadObj;
    });

    const total = await Lead.countDocuments(query);

    return NextResponse.json({
      leads: leadsWithAutomation,
      pagination: {
        page,
        limit,
        total,
        hasMore: skip + leads.length < total,
      },
    });
  } catch (error) {
    console.error("Error fetching leads by stage:", error);
    return NextResponse.json(
      { error: "Failed to fetch leads" },
      { status: 500 },
    );
  }
}
