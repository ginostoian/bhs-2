import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import Contact from "@/models/Contact";

/**
 * PATCH /api/admin/contact-submissions/[submissionId]
 * Update contact submission status (admin only)
 */
export async function PATCH(request, { params }) {
  try {
    // Verify admin access
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { submissionId } = params;
    const body = await request.json();
    const { status } = body;

    // Validate status
    if (!status || !["new", "read", "replied", "closed"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status value" },
        { status: 400 },
      );
    }

    // Connect to database
    await connectMongo();

    // Update submission
    const updatedSubmission = await Contact.findByIdAndUpdate(
      submissionId,
      { status },
      { new: true, runValidators: true },
    );

    if (!updatedSubmission) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      submission: updatedSubmission,
    });
  } catch (error) {
    console.error("Error updating contact submission:", error);
    return NextResponse.json(
      { error: "Failed to update submission" },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/admin/contact-submissions/[submissionId]
 * Delete contact submission (admin only)
 */
export async function DELETE(request, { params }) {
  try {
    // Verify admin access
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { submissionId } = params;

    // Connect to database
    await connectMongo();

    // Delete submission
    const deletedSubmission = await Contact.findByIdAndDelete(submissionId);

    if (!deletedSubmission) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Submission deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting contact submission:", error);
    return NextResponse.json(
      { error: "Failed to delete submission" },
      { status: 500 },
    );
  }
}

/**
 * GET /api/admin/contact-submissions/[submissionId]
 * Get single contact submission (admin only)
 */
export async function GET(request, { params }) {
  try {
    // Verify admin access
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { submissionId } = params;

    // Connect to database
    await connectMongo();

    // Get submission
    const submission = await Contact.findById(submissionId).lean();

    if (!submission) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      submission,
    });
  } catch (error) {
    console.error("Error fetching contact submission:", error);
    return NextResponse.json(
      { error: "Failed to fetch submission" },
      { status: 500 },
    );
  }
}
