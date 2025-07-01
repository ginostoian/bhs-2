import { NextResponse } from "next/server";
import connectMongoose from "@/libs/mongoose";
import Document from "@/models/Document";
import { requireAdmin } from "@/libs/requireAdmin";

/**
 * DELETE /api/documents/[id]
 * Delete a document (admin only)
 */
export async function DELETE(req, { params }) {
  try {
    // Verify admin access
    await requireAdmin(req);

    // Get document ID from params
    const { id } = params;

    // Connect to MongoDB
    await connectMongoose();

    // Check if document exists
    const existingDocument = await Document.findById(id);
    if (!existingDocument) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 },
      );
    }

    // Delete document
    await Document.findByIdAndDelete(id);

    return NextResponse.json({
      message: "Document deleted successfully",
    });
  } catch (error) {
    console.error("DELETE /api/documents/[id] error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete document" },
      { status: 500 },
    );
  }
}
