import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import Lead from "@/models/Lead";
import EmailAutomation from "@/models/EmailAutomation";

// GET - Fetch archived leads
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongo();

    const { searchParams } = new URL(request.url);
    const assignedTo = searchParams.get("assignedTo");
    const source = searchParams.get("source");
    const projectType = searchParams.get("projectType");
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 20;
    const search = searchParams.get("search");

    // Build query for archived leads
    const query = { isActive: true, isArchived: true };

    if (assignedTo) query.assignedTo = assignedTo;
    if (source) query.source = source;
    if (projectType) query.projectTypes = projectType;

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { address: { $regex: search, $options: "i" } },
      ];
    }

    // Execute query with pagination
    const skip = (page - 1) * limit;
    const leads = await Lead.find(query)
      .populate("assignedTo", "name email")
      .populate("linkedUser", "name email")
      .populate("archivedBy", "name email")
      .sort({ archivedAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get email automation data for all leads
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
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching archived leads:", error);
    return NextResponse.json(
      { error: "Failed to fetch archived leads" },
      { status: 500 },
    );
  }
}

