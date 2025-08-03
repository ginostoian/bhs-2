import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import connectMongoose from "@/libs/mongoose";
import { Ticket, User } from "@/models/index.js";
import bunnyStorage from "@/libs/bunnyStorage";

// POST /api/tickets/[ticketId]/updates - Add customer update
export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongoose();

    const { ticketId } = params;
    const formData = await request.formData();
    const update = formData.get("update");
    const files = formData.getAll("files");

    if (!update || !update.trim()) {
      return NextResponse.json(
        { error: "Update content is required" },
        { status: 400 },
      );
    }

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    // Check if user has access to this ticket
    if (
      session.user.role !== "admin" &&
      ticket.user.toString() !== session.user.id
    ) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Get user
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Add customer update
    ticket.customerUpdates.push({
      update: update.trim(),
      createdBy: user._id,
    });

    // Handle file uploads if any
    if (files && files.length > 0) {
      const uploadPromises = files.map(async (file) => {
        if (file.size === 0) return null;

        const fileBuffer = await file.arrayBuffer();
        const fileName = file.name;
        const contentType = file.type;

        // Upload to bunny.net
        const uploadResult = await bunnyStorage.uploadFile(
          Buffer.from(fileBuffer),
          fileName,
          `tickets/${ticket.ticketNumber}`,
          contentType,
          user._id,
          user.name,
        );

        return {
          fileName: uploadResult.originalName,
          filePath: uploadResult.filePath,
          fileUrl: uploadResult.url,
          fileSize: uploadResult.size,
          contentType: uploadResult.contentType,
          uploadedBy: user._id,
          isCustomerSubmitted: session.user.role !== "admin",
        };
      });

      const uploadedFiles = (await Promise.all(uploadPromises)).filter(Boolean);
      if (uploadedFiles.length > 0) {
        ticket.attachments.push(...uploadedFiles);
      }
    }

    await ticket.save();

    // Populate the updated ticket for response
    const updatedTicket = await Ticket.findById(ticketId)
      .populate("customerUpdates.createdBy", "name")
      .populate("attachments.uploadedBy", "name")
      .populate("user", "name email")
      .populate("assignedTo", "name position")
      .populate("project", "name type");

    return NextResponse.json({
      message: "Update added successfully",
      ticket: updatedTicket,
    });
  } catch (error) {
    console.error("Error adding update:", error);
    return NextResponse.json(
      { error: "Failed to add update" },
      { status: 500 },
    );
  }
}
