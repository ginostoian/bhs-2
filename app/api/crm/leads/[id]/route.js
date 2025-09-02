import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import Lead from "@/models/Lead";
import User from "@/models/User";

// GET - Fetch a specific lead
export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongo();

    // Validate ID parameter
    if (!params.id || params.id === "undefined") {
      return NextResponse.json({ error: "Invalid lead ID" }, { status: 400 });
    }

    const lead = await Lead.findById(params.id)
      .populate("assignedTo", "name email")
      .populate("linkedUser", "name email")
      .populate("activities.createdBy", "name email")
      .populate("notes.createdBy", "name email")
      .populate("tasks.assignedTo", "name email")
      .populate("tasks.createdBy", "name email")
      .populate("versionHistory.changedBy", "name email");

    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    return NextResponse.json({ lead });
  } catch (error) {
    console.error("Error fetching lead:", error);
    return NextResponse.json(
      { error: "Failed to fetch lead" },
      { status: 500 },
    );
  }
}

// PUT - Update a lead
export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongo();

    // Validate ID parameter
    if (!params.id || params.id === "undefined" || params.id === "null") {
      return NextResponse.json({ error: "Invalid lead ID" }, { status: 400 });
    }

    const body = await request.json();
    const lead = await Lead.findById(params.id);

    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    // Track changes for version history
    const changes = [];
    const oldValues = {};

    // Check for changes in tracked fields
    const trackedFields = [
      "name",
      "email",
      "phone",
      "address",
      "stage",
      "value",
      "budget",
      "clientHealth",
      "source",
      "customSource",
      "projectTypes",
      "customProjectType",
      "assignedTo",
      "winLossReason",
    ];

    trackedFields.forEach((field) => {
      if (body[field] !== undefined && body[field] !== lead[field]) {
        oldValues[field] = lead[field];
        lead[field] = body[field];
        changes.push(field);
      }
    });

    // Handle special cases
    if (body.tags !== undefined) {
      lead.tags = body.tags;
    }

    // Check if user exists with this email and link them
    if (body.email && body.email !== lead.email) {
      // First check if another lead already has this email
      const existingLead = await Lead.findOne({
        email: body.email,
        _id: { $ne: params.id }, // Exclude the current lead
      });

      if (existingLead) {
        if (existingLead.isArchived) {
          return NextResponse.json(
            {
              error: "A lead with this email already exists in archived leads",
              suggestion:
                "Please unarchive the existing lead instead of updating this one",
              existingLeadId: existingLead._id,
            },
            { status: 400 },
          );
        } else {
          return NextResponse.json(
            { error: "A lead with this email already exists" },
            { status: 400 },
          );
        }
      }

      const existingUser = await User.findOne({ email: body.email });
      if (existingUser) {
        lead.linkedUser = existingUser._id;
      } else {
        lead.linkedUser = null;
      }
    }

    // Add version history for changes
    changes.forEach((field) => {
      lead.versionHistory.push({
        field,
        oldValue: oldValues[field],
        newValue: lead[field],
        changedBy: session.user.id,
        comment: body.changeComment || `Updated ${field}`,
      });
    });

    await lead.save();

    // Populate references including version history
    await lead.populate("assignedTo", "name email");
    await lead.populate("linkedUser", "name email");
    await lead.populate("versionHistory.changedBy", "name email");

    return NextResponse.json({ success: true, lead });
  } catch (error) {
    console.error("Error updating lead:", error);
    return NextResponse.json(
      { error: "Failed to update lead" },
      { status: 500 },
    );
  }
}

// DELETE - Delete a lead (hard delete)
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongo();

    // Validate ID parameter
    if (!params.id || params.id === "undefined" || params.id === "null") {
      return NextResponse.json({ error: "Invalid lead ID" }, { status: 400 });
    }

    const lead = await Lead.findById(params.id);

    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    // Hard delete - permanently remove the lead
    await Lead.findByIdAndDelete(params.id);

    return NextResponse.json({
      success: true,
      message: "Lead deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting lead:", error);
    return NextResponse.json(
      { error: "Failed to delete lead" },
      { status: 500 },
    );
  }
}
