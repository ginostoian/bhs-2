import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import connectMongoose from "@/libs/mongoose";
import { Ticket, User, Employee, Project } from "@/models/index.js";
import bunnyStorage from "@/libs/bunnyStorage";
import { sendEmailWithRetry } from "@/libs/emailService";

// GET /api/tickets/[ticketId] - Get specific ticket
export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongoose();

    const { ticketId } = params;

    // Validate ticketId
    if (!ticketId || ticketId === "undefined") {
      return NextResponse.json({ error: "Invalid ticket ID" }, { status: 400 });
    }

    const ticket = await Ticket.findById(ticketId)
      .populate("user", "name email phone")
      .populate("assignedTo", "name position phone")
      .populate("project", "name type status")
      .populate("internalNotes.createdBy", "name")
      .populate("customerUpdates.createdBy", "name")
      .populate("attachments.uploadedBy", "name")
      .populate("resolvedBy", "name");

    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    // Check if user has access to this ticket
    if (
      session.user.role !== "admin" &&
      ticket.user._id.toString() !== session.user.id
    ) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    console.log("Ticket data being returned:", {
      customerEmail: ticket.customerEmail,
      customerPhone: ticket.customerPhone,
      userEmail: ticket.user?.email,
      userPhone: ticket.user?.phone,
    }); // Debug log

    return NextResponse.json({ ticket });
  } catch (error) {
    console.error("Error fetching ticket:", error);
    return NextResponse.json(
      { error: "Failed to fetch ticket" },
      { status: 500 },
    );
  }
}

// PUT /api/tickets/[ticketId] - Update ticket
export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongoose();

    const { ticketId } = params;
    const body = await request.json();

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    // Only admins can update tickets
    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const updateData = {};

    // Fields that can be updated
    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined)
      updateData.description = body.description;
    if (body.category !== undefined) updateData.category = body.category;
    if (body.priority !== undefined) updateData.priority = body.priority;
    if (body.status !== undefined) updateData.status = body.status;
    if (body.scheduledDate !== undefined)
      updateData.scheduledDate = body.scheduledDate
        ? new Date(body.scheduledDate)
        : null;
    if (body.scheduledTime !== undefined)
      updateData.scheduledTime = body.scheduledTime;
    if (body.estimatedDuration !== undefined)
      updateData.estimatedDuration = body.estimatedDuration;
    if (body.resolution !== undefined) updateData.resolution = body.resolution;
    if (body.tags !== undefined) updateData.tags = body.tags;

    // Handle assignment
    if (body.assignedTo !== undefined) {
      if (body.assignedTo) {
        const employee = await Employee.findById(body.assignedTo);
        if (!employee) {
          return NextResponse.json(
            { error: "Employee not found" },
            { status: 404 },
          );
        }
        updateData.assignedTo = employee._id;
      } else {
        updateData.assignedTo = null;
      }
    }

    // Handle project assignment
    if (body.projectId !== undefined) {
      if (body.projectId) {
        const project = await Project.findById(body.projectId);
        if (!project) {
          return NextResponse.json(
            { error: "Project not found" },
            { status: 404 },
          );
        }
        updateData.project = project._id;
      } else {
        updateData.project = null;
      }
    }

    // Set resolvedBy if status is being changed to Resolved
    if (body.status === "Resolved" && ticket.status !== "Resolved") {
      updateData.resolvedBy = session.user.id;
    }

    // Update the ticket
    const updatedTicket = await Ticket.findByIdAndUpdate(ticketId, updateData, {
      new: true,
      runValidators: true,
    })
      .populate("user", "name email")
      .populate("assignedTo", "name position")
      .populate("project", "name type")
      .populate("resolvedBy", "name");

    // Send email notification to customer on status change
    if (
      body.status &&
      body.status !== ticket.status &&
      updatedTicket.user?.email
    ) {
      try {
        const { ticketStatusUpdateEmailTemplate } = await import(
          "@/libs/emailTemplates"
        );
        const tpl = ticketStatusUpdateEmailTemplate(
          updatedTicket.user.name,
          updatedTicket.ticketNumber,
          updatedTicket.title,
          ticket.status,
          updatedTicket.status,
          `${process.env.NEXTAUTH_URL}/dashboard/tickets/${updatedTicket._id}`,
        );

        await sendEmailWithRetry({
          to: updatedTicket.user.email,
          subject: tpl.subject,
          html: tpl.html,
          text: tpl.text,
          metadata: {
            type: "ticket_status_update",
            ticketId: updatedTicket._id.toString(),
            ticketNumber: updatedTicket.ticketNumber,
            oldStatus: ticket.status,
            newStatus: updatedTicket.status,
          },
        });

        if (updatedTicket.status === "Closed") {
          updatedTicket.emailNotifications.resolutionNotificationSent = true;
          await updatedTicket.save();
        }
      } catch (emailError) {
        console.error("Failed to send status notification:", emailError);
      }
    }

    return NextResponse.json({
      message: "Ticket updated successfully",
      ticket: updatedTicket,
    });
  } catch (error) {
    console.error("Error updating ticket:", error);
    return NextResponse.json(
      { error: "Failed to update ticket" },
      { status: 500 },
    );
  }
}

// DELETE /api/tickets/[ticketId] - Delete ticket
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongoose();

    const { ticketId } = params;

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    // Authorization: admins can delete any ticket; users can delete their own
    const isAdmin = session.user.role === "admin";
    const isOwner = ticket.user?.toString() === session.user.id;
    if (!isAdmin && !isOwner) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Delete associated files from bunny.net
    if (ticket.attachments && ticket.attachments.length > 0) {
      const deletePromises = ticket.attachments.map(async (attachment) => {
        try {
          await bunnyStorage.deleteFile(attachment.filePath);
        } catch (error) {
          console.error(`Failed to delete file ${attachment.filePath}:`, error);
        }
      });
      await Promise.all(deletePromises);
    }

    // Delete the ticket
    await Ticket.findByIdAndDelete(ticketId);

    return NextResponse.json({
      message: "Ticket deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting ticket:", error);
    return NextResponse.json(
      { error: "Failed to delete ticket" },
      { status: 500 },
    );
  }
}
