import { NextResponse } from "next/server";
import connectMongoose from "@/libs/mongoose";
import Document from "@/models/Document";
import { requireAuth } from "@/libs/requireAdmin";

/**
 * GET /api/documents/user
 * Get documents for the authenticated user
 */
export async function GET(req) {
  try {
    // Verify authentication
    const session = await requireAuth(req);

    // Connect to MongoDB
    await connectMongoose();

    // Get query parameters for filtering
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const status = searchParams.get("status");

    // Build query filter
    const filter = { user: session.user.id };
    if (type) filter.type = type;
    if (status) filter.status = status;

    // Fetch user's documents
    const documents = await Document.find(filter)
      .sort({ createdAt: -1 })
      .populate("user", "name email");

    return NextResponse.json({ documents });
  } catch (error) {
    console.error("GET /api/documents/user error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch documents" },
      { status: 401 },
    );
  }
}

/**
 * POST /api/documents/user
 * Create a document for the authenticated user (for quotes and comments)
 */
export async function POST(req) {
  try {
    // Verify authentication
    const session = await requireAuth(req);

    // Parse request body
    const { type, content } = await req.json();

    // Validate required fields
    if (!type || !content) {
      return NextResponse.json(
        { error: "type and content are required" },
        { status: 400 },
      );
    }

    // Only allow users to create quotes and comments
    const allowedTypes = ["quote", "comment"];
    if (!allowedTypes.includes(type)) {
      return NextResponse.json(
        { error: "Users can only create quotes and comments" },
        { status: 400 },
      );
    }

    // Connect to MongoDB
    await connectMongoose();

    // Create document
    const document = await Document.create({
      user: session.user.id,
      type,
      content,
    });

    // Populate user info for response
    await document.populate("user", "name email");

    return NextResponse.json(
      {
        document: {
          id: document._id,
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
    console.error("POST /api/documents/user error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create document" },
      { status: 500 },
    );
  }
}
