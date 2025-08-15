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

    console.log("Connecting to MongoDB...");
    await connectMongo();
    console.log("MongoDB connected successfully");

    const { searchParams } = new URL(request.url);
    const assignedTo = searchParams.get("assignedTo");
    const source = searchParams.get("source");
    const projectType = searchParams.get("projectType");
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 20;
    const search = searchParams.get("search");

    // Build query for archived leads
    const query = { isArchived: true };

    console.log("Lead model imported successfully:", !!Lead);
    console.log("Query being used:", query);

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

    // First, let's check if there are any archived leads at all
    const totalArchived = await Lead.countDocuments({ isArchived: true });
    console.log(`Total archived leads found: ${totalArchived}`);

    const leads = await Lead.find(query)
      .populate("assignedTo", "name email")
      .populate("linkedUser", "name email")
      .populate("archivedBy", "name email")
      .sort({ archivedAt: -1, updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Log the actual leads found for debugging
    console.log(
      "Leads found:",
      leads.map((lead) => ({
        id: lead._id,
        name: lead.name,
        isArchived: lead.isArchived,
        isActive: lead.isActive,
        archivedAt: lead.archivedAt,
        updatedAt: lead.updatedAt,
      })),
    );

    console.log(`Leads retrieved: ${leads.length}`);

    // Get email automation data for all leads
    let automations = [];
    try {
      const leadIds = leads.map((lead) => lead._id);
      if (leadIds.length > 0) {
        automations = await EmailAutomation.find({
          leadId: { $in: leadIds },
        }).lean();
      }
    } catch (automationError) {
      console.error("Error fetching email automations:", automationError);
      // Continue without automation data rather than failing the entire request
    }

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
      const leadObj = { ...lead };
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
      debug: {
        totalArchived,
        queryUsed: query,
      },
    });
  } catch (error) {
    console.error("Error fetching archived leads:", error);

    // Log more detailed error information
    if (error.name === "MongoError") {
      console.error("MongoDB Error:", error.code, error.message);
    } else if (error.name === "ValidationError") {
      console.error("Validation Error:", error.message);
    }

    return NextResponse.json(
      {
        error: "Failed to fetch archived leads",
        details: error.message,
        name: error.name,
      },
      { status: 500 },
    );
  }
}
