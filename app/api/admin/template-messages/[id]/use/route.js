import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongoose from "@/libs/mongoose";
import { TemplateMessage } from "@/models/index.js";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

/**
 * Template Usage Tracking API
 * Tracks when templates are used for analytics
 */

// POST /api/admin/template-messages/[id]/use - Track template usage
export async function POST(request, { params }) {
  try {
    // Check authentication and admin role
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongoose();

    const { id } = params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid template ID" },
        { status: 400 },
      );
    }

    // Find template and increment usage
    const template = await TemplateMessage.findById(id);
    if (!template) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 },
      );
    }

    // Increment usage count and update last used date
    await template.incrementUsage();

    return NextResponse.json({
      message: "Usage tracked successfully",
      usageCount: template.usageCount,
      lastUsed: template.lastUsed,
    });
  } catch (error) {
    console.error("Error tracking template usage:", error);
    return NextResponse.json(
      { error: "Failed to track template usage" },
      { status: 500 },
    );
  }
}
