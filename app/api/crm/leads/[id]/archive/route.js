import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import Lead from "@/models/Lead";

// POST - Archive a lead
export async function POST(request, { params }) {
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

    // Archive the lead
    lead.isArchived = true;
    lead.archivedAt = new Date();
    lead.archivedBy = session.user.id;

    await lead.save();

    return NextResponse.json({
      success: true,
      message: "Lead archived successfully",
      lead,
    });
  } catch (error) {
    console.error("Error archiving lead:", error);
    return NextResponse.json(
      { error: "Failed to archive lead" },
      { status: 500 },
    );
  }
}

// DELETE - Unarchive a lead
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

    // Unarchive the lead
    lead.isArchived = false;
    lead.archivedAt = undefined;
    lead.archivedBy = undefined;

    await lead.save();

    return NextResponse.json({
      success: true,
      message: "Lead unarchived successfully",
      lead,
    });
  } catch (error) {
    console.error("Error unarchiving lead:", error);
    return NextResponse.json(
      { error: "Failed to unarchive lead" },
      { status: 500 },
    );
  }
}

