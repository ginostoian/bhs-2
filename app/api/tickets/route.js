import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import connectMongoose from "@/libs/mongoose";
import { Ticket, User, Project, Employee } from "@/models/index.js";
import bunnyStorage from "@/libs/bunnyStorage";
import { sendEmail } from "@/libs/emailService";

// GET /api/tickets - List tickets (admin only or user's own tickets)
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongoose();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const category = searchParams.get("category");
    const priority = searchParams.get("priority");
    const assignedTo = searchParams.get("assignedTo");
    const project = searchParams.get("project");
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 20;
    const skip = (page - 1) * limit;

    // Build query
    let query = {};

    // If user is not admin, only show their tickets
    if (session.user.role !== "admin") {
      query.user = session.user.id;
    }

    if (status) query.status = status;
    if (category) query.category = category;
    if (priority) query.priority = priority;
    if (assignedTo) query.assignedTo = assignedTo;
    if (project) query.project = project;

    // Get tickets with pagination
    const tickets = await Ticket.find(query)
      .populate("user", "name email")
      .populate("assignedTo", "name position")
      .populate("project", "name type")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await Ticket.countDocuments(query);

    // Convert tickets to JSON and ensure _id is a string
    const ticketsJson = tickets.map((ticket) => ({
      ...ticket.toJSON(),
      _id: ticket._id.toString(),
    }));

    return NextResponse.json({
      tickets: ticketsJson,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return NextResponse.json(
      { error: "Failed to fetch tickets" },
      { status: 500 },
    );
  }
}

// POST /api/tickets - Create new ticket
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongoose();

    const formData = await request.formData();
    const title = formData.get("title");
    const description = formData.get("description");
    const category = formData.get("category");
    const priority = formData.get("priority");
    const scheduledDate = formData.get("scheduledDate");
    const scheduledTime = formData.get("scheduledTime");
    const tags = formData.get("tags");
    const customerPhone = formData.get("customerPhone");
    const customerEmail = formData.get("customerEmail");

    // Validate required fields
    if (!title || !description || !category) {
      return NextResponse.json(
        { error: "Title, description, and category are required" },
        { status: 400 },
      );
    }

    // Get user
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Generate ticket number
    const ticketCount = await Ticket.countDocuments();
    const ticketNumber = `TKT-${String(ticketCount + 1).padStart(6, "0")}`;

    // Create ticket
    const ticketData = {
      ticketNumber,
      title,
      description,
      category,
      priority: priority || "Medium",
      user: user._id,
      scheduledDate: scheduledDate ? new Date(scheduledDate) : null,
      scheduledTime,
      tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
      customerPhone: customerPhone || null,
      customerEmail: customerEmail || null,
    };

    console.log("Creating ticket with data:", ticketData); // Debug log

    const ticket = new Ticket(ticketData);
    await ticket.save();

    // Handle file uploads if any
    const files = formData.getAll("files");
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
          isCustomerSubmitted: true,
        };
      });

      const uploadedFiles = (await Promise.all(uploadPromises)).filter(Boolean);
      if (uploadedFiles.length > 0) {
        ticket.attachments.push(...uploadedFiles);
        await ticket.save();
      }
    }

    // Send email notification to admins (delayed)
    setTimeout(async () => {
      try {
        const adminUsers = await User.find({ role: "admin" });
        const adminEmails = adminUsers.map((admin) => admin.email);

        if (adminEmails.length > 0) {
          await sendEmail({
            to: adminEmails,
            subject: `New Ticket Created: ${ticket.ticketNumber}`,
            template: "new-ticket-notification",
            data: {
              ticketNumber: ticket.ticketNumber,
              title: ticket.title,
              category: ticket.category,
              priority: ticket.priority,
              customerName: user.name,
              customerEmail: user.email,
              description: ticket.description,
              ticketUrl: `${process.env.NEXTAUTH_URL}/admin/tickets/${ticket._id}`,
            },
          });
        }
      } catch (emailError) {
        console.error("Failed to send admin notification:", emailError);
      }
    }, 2000); // 2 second delay

    // Mark admin notification as sent
    ticket.emailNotifications.adminNotificationSent = true;
    await ticket.save();

    return NextResponse.json({
      message: "Ticket created successfully",
      ticket: {
        id: ticket._id.toString(),
        ticketNumber: ticket.ticketNumber,
        title: ticket.title,
        status: ticket.status,
      },
    });
  } catch (error) {
    console.error("Error creating ticket:", error);
    return NextResponse.json(
      { error: "Failed to create ticket" },
      { status: 500 },
    );
  }
}
