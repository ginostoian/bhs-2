import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import Lead from "@/models/Lead";
import User from "@/models/User";
import EmailAutomation from "@/models/EmailAutomation";

// GET - Fetch all leads with filtering and pagination
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongo();

    const { searchParams } = new URL(request.url);
    const stage = searchParams.get("stage");
    const assignedTo = searchParams.get("assignedTo");
    const source = searchParams.get("source");
    const projectType = searchParams.get("projectType");
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 20;
    const search = searchParams.get("search");

    // Build query
    const query = { isActive: true, isArchived: false };

    if (stage) query.stage = stage;
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
      .sort({ updatedAt: -1 })
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
    console.error("Error fetching leads:", error);
    return NextResponse.json(
      { error: "Failed to fetch leads" },
      { status: 500 },
    );
  }
}

// POST - Create a new lead
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongo();

    const body = await request.json();
    const {
      name,
      email,
      phone,
      address,
      stage,
      value,
      budget,
      clientHealth,
      source,
      customSource,
      projectTypes,
      customProjectType,
      assignedTo,
      tags,
    } = body;

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 },
      );
    }

    // Check if lead with this email already exists
    const existingLead = await Lead.findOne({ email, isActive: true });
    if (existingLead) {
      return NextResponse.json(
        { error: "A lead with this email already exists" },
        { status: 400 },
      );
    }

    // Check if user exists with this email and link them
    let linkedUser = null;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      linkedUser = existingUser._id;
    }

    // Create lead data
    const leadData = {
      name,
      email,
      phone,
      address,
      stage: stage || "Lead",
      value: value || 0,
      budget: budget || "£",
      clientHealth: clientHealth || "Unknown",
      source: source || "Other",
      customSource: source === "Other" ? customSource : undefined,
      projectTypes: projectTypes || [],
      customProjectType,
      assignedTo:
        assignedTo && assignedTo.trim() !== "" ? assignedTo : undefined, // Convert empty string to undefined
      linkedUser,
      tags: tags || [],
    };

    const lead = await Lead.create(leadData);

    // Add version history for creation
    lead.versionHistory.push({
      field: "created",
      oldValue: null,
      newValue: "Lead created",
      changedBy: session.user.id,
      comment: "Lead created manually",
    });

    await lead.save();

    // Populate references
    await lead.populate("assignedTo", "name email");
    await lead.populate("linkedUser", "name email");

    // Initialize email automation for new lead
    try {
      const { initializeEmailAutomation } = await import(
        "@/libs/crmEmailAutomation"
      );
      await initializeEmailAutomation(lead._id, lead.stage);
    } catch (error) {
      console.error("Error initializing email automation for new lead:", error);
      // Don't fail the lead creation if automation fails
    }

    return NextResponse.json({ success: true, lead }, { status: 201 });
  } catch (error) {
    console.error("Error creating lead:", error);
    return NextResponse.json(
      { error: "Failed to create lead" },
      { status: 500 },
    );
  }
}
