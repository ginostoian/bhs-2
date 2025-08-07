import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import connectMongoose from "@/libs/mongoose";
import { Ticket, User } from "@/models/index.js";

// POST /api/tickets/[ticketId]/notes - Add internal note
export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only admins can add internal notes
    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    await connectMongoose();

    const { ticketId } = params;
    const { note } = await request.json();

    if (!note || !note.trim()) {
      return NextResponse.json(
        { error: "Note content is required" },
        { status: 400 },
      );
    }

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    // Get admin user
    const adminUser = await User.findById(session.user.id);
    if (!adminUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Add internal note
    ticket.internalNotes.push({
      note: note.trim(),
      createdBy: adminUser._id,
    });

    await ticket.save();

    // Populate the new note for response
    const updatedTicket = await Ticket.findById(ticketId)
      .populate("internalNotes.createdBy", "name")
      .populate("user", "name email")
      .populate("assignedTo", "name position")
      .populate("project", "name type");

    // Internal notes are not emailed to the customer

    return NextResponse.json({
      message: "Internal note added successfully",
      ticket: updatedTicket,
    });
  } catch (error) {
    console.error("Error adding internal note:", error);
    return NextResponse.json(
      { error: "Failed to add internal note" },
      { status: 500 },
    );
  }
}
