import { NextResponse } from "next/server";
import connectMongoose from "@/libs/mongoose";
import Document from "@/models/Document";
import User from "@/models/User";
import { requireAdmin } from "@/libs/requireAdmin";
import Notification from "@/models/Notification";

/**
 * POST /api/documents
 * Create a new document (admin only)
 */
export async function POST(req) {
  try {
    // Verify admin access
    await requireAdmin(req);

    // Parse request body
    const { userId, type, content, status } = await req.json();

    // Validate required fields
    if (!userId || !type || !content) {
      return NextResponse.json(
        { error: "userId, type, and content are required" },
        { status: 400 },
      );
    }

    // Validate document type
    const validTypes = ["quote", "invoice", "comment", "photo"];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: "Invalid document type" },
        { status: 400 },
      );
    }

    // Validate status for invoices
    if (type === "invoice" && status && !["pending", "paid"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status for invoice" },
        { status: 400 },
      );
    }

    // Connect to MongoDB
    await connectMongoose();

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create document
    const document = await Document.create({
      user: userId,
      type,
      content,
      ...(type === "invoice" && status && { status }),
    });

    // Populate user info for response
    await document.populate("user", "name email");

    // Create notification for the user
    try {
      const documentName =
        type === "photo"
          ? "Photo"
          : type === "comment"
            ? "Comment"
            : type === "invoice"
              ? "Invoice"
              : "Quote";

      await Notification.createNotification({
        user: userId,
        type: "document_added",
        title: `New ${documentName} Added`,
        message: `A new ${type} "${documentName}" has been added to your project.`,
        relatedId: document._id,
        relatedModel: "Document",
        priority: "medium",
        metadata: {
          documentType: type,
          documentName,
        },
      });
    } catch (notificationError) {
      console.error("Failed to create notification:", notificationError);
      // Don't fail the document creation if notification fails
    }

    return NextResponse.json(
      {
        document: {
          id: document.id,
          type: document.type,
          content: document.content,
          status: document.status,
          user: document.user,
          createdAt: document.createdAt,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST /api/documents error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create document" },
      { status: 500 },
    );
  }
}
