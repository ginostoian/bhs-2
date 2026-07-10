import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import Lead from "@/models/Lead";
import User from "@/models/User";
import { syncPartnerReferralFromLead } from "@/libs/referrals";
import LeadActivity from "@/models/LeadActivity";
import LeadNote from "@/models/LeadNote";
import LeadTask from "@/models/LeadTask";
import EmailAutomation from "@/models/EmailAutomation";
import { calculateLeadScore } from "@/libs/crmScoring";
import {
  crmHistoryFieldValuesEqual,
  normalizeCRMHistoryFieldValue,
} from "@/libs/crmHistory";
import { enrichCRMHistory } from "@/libs/crmHistoryServer";

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
      .populate("versionHistory.changedBy", "name email");

    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    const [activities, notes, tasks, automation] = await Promise.all([
      LeadActivity.find({ leadId: lead._id })
        .populate("createdBy", "name email")
        .sort({ occurredAt: -1 })
        .limit(100),
      LeadNote.find({ leadId: lead._id })
        .populate("createdBy", "name email")
        .sort({ pinned: -1, createdAt: -1 })
        .limit(100),
      LeadTask.find({ leadId: lead._id })
        .populate("assignedTo", "name email")
        .populate("createdBy", "name email")
        .sort({ status: 1, dueDate: 1 }),
      EmailAutomation.findOne({ leadId: lead._id }),
    ]);
    const leadObject = lead.toObject();
    leadObject.versionHistory = await enrichCRMHistory(
      leadObject.versionHistory,
    );
    leadObject.leadScore = calculateLeadScore(leadObject, automation);
    leadObject.emailAutomation = automation
      ? {
          isActive: automation.isActive,
          sequenceKey: automation.sequenceKey,
          sequenceStep: automation.sequenceStep,
          nextActionDue: automation.nextActionDue,
          pausedReason: automation.pausedReason,
          leadReplied: automation.leadReplied,
        }
      : null;
    return NextResponse.json({
      lead: { ...leadObject, activities, notes, tasks },
    });
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

    const requestedEmail = body.email?.trim().toLowerCase();
    const emailChanged = Boolean(
      requestedEmail && requestedEmail !== lead.email,
    );
    if (emailChanged) {
      const duplicate = await Lead.findOne({
        email: requestedEmail,
        _id: { $ne: lead._id },
        isActive: true,
        isArchived: false,
      });
      if (duplicate) {
        return NextResponse.json(
          {
            error: "A lead with this email already exists",
            existingLeadId: duplicate._id,
          },
          { status: 409 },
        );
      }
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
      "estimatedValue",
      "probability",
      "expectedCloseDate",
      "budget",
      "clientHealth",
      "source",
      "customSource",
      "projectTypes",
      "customProjectType",
      "assignedTo",
      "winLossReason",
      "referredBy",
      "referralSource",
      "marketingConsent",
      "lifecycleStatus",
      "attribution",
    ];

    trackedFields.forEach((field) => {
      const nextValue =
        field === "referralSource" ? body[field] || undefined : body[field];

      if (
        nextValue !== undefined &&
        !crmHistoryFieldValuesEqual(field, nextValue, lead[field])
      ) {
        oldValues[field] = normalizeCRMHistoryFieldValue(field, lead[field]);
        lead[field] = nextValue;
        changes.push({
          field,
          newValue: normalizeCRMHistoryFieldValue(field, nextValue),
        });
      }
    });

    // Handle special cases
    if (body.tags !== undefined) {
      lead.tags = body.tags;
    }

    // Keep the user link in sync when the email changes.
    if (emailChanged) {
      const existingUser = await User.findOne({ email: requestedEmail });
      if (existingUser) {
        lead.linkedUser = existingUser._id;
      } else {
        lead.linkedUser = null;
      }
    }

    // Add version history for changes
    changes.forEach(({ field, newValue }) => {
      lead.versionHistory.push({
        field,
        oldValue: oldValues[field],
        newValue,
        changedBy: session.user.id,
        comment: body.changeComment || `Updated ${field}`,
      });
    });

    await lead.save();
    await syncPartnerReferralFromLead(lead, {
      previousPartnerId: oldValues.referredBy || null,
    });

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
