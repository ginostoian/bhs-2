import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongoose from "@/libs/mongoose";
import { TemplateMessage } from "@/models/index.js";
import { NextResponse } from "next/server";

/**
 * Template Messages API Routes
 * Handles CRUD operations for template messages
 */

// GET /api/admin/template-messages - List all template messages
export async function GET(request) {
  try {
    // Check authentication and admin role
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongoose();

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 12;
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    // Build query
    let query = {};

    if (category && category !== "All") {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute query
    const [templates, totalCount] = await Promise.all([
      TemplateMessage.find(query)
        .populate("createdBy", "name email")
        .populate("lastUpdatedBy", "name email")
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      TemplateMessage.countDocuments(query),
    ]);

    // Convert ObjectIds to strings
    const processedTemplates = templates.map((template) => ({
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
    }));

    return NextResponse.json({
      templates: processedTemplates,
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
    });
  } catch (error) {
    console.error("Error fetching template messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch template messages" },
      { status: 500 },
    );
  }
}

// POST /api/admin/template-messages - Create new template message
export async function POST(request) {
  try {
    // Check authentication and admin role
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongoose();

    const body = await request.json();
    const { title, content, category, tags, description } = body;

    // Validate required fields
    if (!title || !content || !category) {
      return NextResponse.json(
        { error: "Title, content, and category are required" },
        { status: 400 },
      );
    }

    // Create new template message
    const templateMessage = new TemplateMessage({
      title,
      content,
      category,
      tags: tags || [],
      description,
      createdBy: session.user.id,
      lastUpdatedBy: session.user.id,
    });

    await templateMessage.save();

    // Populate user data
    await templateMessage.populate("createdBy", "name email");

    // Convert to response format
    const responseTemplate = {
      ...templateMessage.toJSON(),
      id: templateMessage._id.toString(),
      _id: undefined,
      createdBy: {
        id: templateMessage.createdBy._id.toString(),
        name: templateMessage.createdBy.name,
        email: templateMessage.createdBy.email,
      },
    };

    return NextResponse.json(responseTemplate, { status: 201 });
  } catch (error) {
    console.error("Error creating template message:", error);
    return NextResponse.json(
      { error: "Failed to create template message" },
      { status: 500 },
    );
  }
}
