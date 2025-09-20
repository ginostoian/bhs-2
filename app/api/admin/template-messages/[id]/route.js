import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongoose from "@/libs/mongoose";
import { TemplateMessage } from "@/models/index.js";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

/**
 * Individual Template Message API Routes
 * Handles GET, PUT, DELETE operations for specific template messages
 */

// GET /api/admin/template-messages/[id] - Get single template message
export async function GET(request, { params }) {
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

    const template = await TemplateMessage.findById(id)
      .populate("createdBy", "name email")
      .populate("lastUpdatedBy", "name email")
      .lean();

    if (!template) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 },
      );
    }

    // Convert to response format
    const responseTemplate = {
      ...template,
      id: template._id.toString(),
      _id: undefined,
      createdBy: template.createdBy
        ? {
            id: template.createdBy._id.toString(),
            name: template.createdBy.name,
            email: template.createdBy.email,
          }
        : null,
      lastUpdatedBy: template.lastUpdatedBy
        ? {
            id: template.lastUpdatedBy._id.toString(),
            name: template.lastUpdatedBy.name,
            email: template.lastUpdatedBy.email,
          }
        : null,
    };

    return NextResponse.json(responseTemplate);
  } catch (error) {
    console.error("Error fetching template message:", error);
    return NextResponse.json(
      { error: "Failed to fetch template message" },
      { status: 500 },
    );
  }
}

// PUT /api/admin/template-messages/[id] - Update template message
export async function PUT(request, { params }) {
  try {
    // Check authentication and admin role
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongoose();

    const { id } = params;
    const body = await request.json();
    const { title, content, category, tags, description, isActive } = body;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid template ID" },
        { status: 400 },
      );
    }

    // Find and update template
    const template = await TemplateMessage.findById(id);
    if (!template) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 },
      );
    }

    // Update fields
    if (title !== undefined) template.title = title;
    if (content !== undefined) template.content = content;
    if (category !== undefined) template.category = category;
    if (tags !== undefined) template.tags = tags;
    if (description !== undefined) template.description = description;
    if (isActive !== undefined) template.isActive = isActive;

    // Update version and lastUpdatedBy
    template.version += 1;
    template.lastUpdatedBy = session.user.id;

    await template.save();

    // Populate user data
    await template.populate("createdBy", "name email");
    await template.populate("lastUpdatedBy", "name email");

    // Convert to response format
    const responseTemplate = {
      ...template.toJSON(),
      id: template._id.toString(),
      _id: undefined,
      createdBy: {
        id: template.createdBy._id.toString(),
        name: template.createdBy.name,
        email: template.createdBy.email,
      },
      lastUpdatedBy: {
        id: template.lastUpdatedBy._id.toString(),
        name: template.lastUpdatedBy.name,
        email: template.lastUpdatedBy.email,
      },
    };

    return NextResponse.json(responseTemplate);
  } catch (error) {
    console.error("Error updating template message:", error);
    return NextResponse.json(
      { error: "Failed to update template message" },
      { status: 500 },
    );
  }
}

// DELETE /api/admin/template-messages/[id] - Delete template message
export async function DELETE(request, { params }) {
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

    const template = await TemplateMessage.findByIdAndDelete(id);
    if (!template) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ message: "Template deleted successfully" });
  } catch (error) {
    console.error("Error deleting template message:", error);
    return NextResponse.json(
      { error: "Failed to delete template message" },
      { status: 500 },
    );
  }
}
