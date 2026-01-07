import { NextResponse } from "next/server";
import connectMongoose from "@/libs/mongoose";
import Document from "@/models/Document";
import User from "@/models/User";
import EmailPreference from "@/models/EmailPreference";
import { requireAdmin } from "@/libs/requireAdmin";
import { sendDocumentAddedEmail } from "@/libs/emailService";
import { notifyDocumentAdded } from "@/libs/notificationService";

/**
 * POST /api/documents
 * Create a new document (admin only)
 */
export async function POST(req) {
  try {
    // Verify admin access
    await requireAdmin(req);

    // Parse request body
    const { userId, type, content, status, project } = await req.json();

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
      project: project || null,
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

      await notifyDocumentAdded(userId, {
        _id: document._id,
        title: documentName,
        type: type,
        content: content,
      });
    } catch (notificationError) {
      console.error("Failed to create notification:", notificationError);
      // Don't fail the document creation if notification fails
    }

    // Send email notification to the user (async, don't wait for it)
    try {
      // Check if user has email notifications enabled for documents
      const emailEnabled = await EmailPreference.isEmailEnabled(
        userId,
        "documents",
      );

      if (emailEnabled) {
        const documentName =
          type === "photo"
            ? "Photo"
            : type === "comment"
              ? "Comment"
              : type === "invoice"
                ? "Invoice"
                : "Quote";

        await sendDocumentAddedEmail(
          user.email,
          user.name,
          type,
          documentName,
          content,
          document._id.toString(),
        );
        console.log(`✅ Document notification email sent to ${user.email}`);
      }
    } catch (emailError) {
      console.error("Failed to send document notification email:", emailError);
      // Don't fail the document creation if email fails
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
