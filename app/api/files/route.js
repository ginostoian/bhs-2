import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongoose from "@/libs/mongoose";
import File from "@/models/File";
import Document from "@/models/Document";

// Force dynamic rendering for this route
export const dynamic = "force-dynamic";

/**
 * GET /api/files
 * Get files with optional filtering
 */
export async function GET(request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Connect to MongoDB
    await connectMongoose();

    const { searchParams } = new URL(request.url);
    const entityType = searchParams.get("entityType");
    const entityId = searchParams.get("entityId");
    const fileType = searchParams.get("fileType");
    const tags = searchParams.get("tags");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    // Build query
    let query = {};

    // Filter by user (users can only see their own files, admins can see all)
    if (session.user.role !== "admin") {
      // For regular users, show files they uploaded OR files associated with their documents
      const userDocuments = await Document.find({
        user: session.user.id,
      }).select("_id");
      const userDocumentIds = userDocuments.map((doc) => doc._id.toString());

      // Build the base conditions for user access
      const userConditions = [
        { uploadedBy: session.user.id }, // Files they uploaded directly
        {
          entityType: "document",
          entityId: { $in: userDocumentIds },
        }, // Files associated with their documents
      ];

      // Apply additional filters within the user conditions
      const additionalFilters = {};
      if (entityType) additionalFilters.entityType = entityType;
      if (entityId) additionalFilters.entityId = entityId;

      // If we have additional filters, apply them to each condition in the $or
      if (Object.keys(additionalFilters).length > 0) {
        query.$or = userConditions.map((condition) => ({
          ...condition,
          ...additionalFilters,
        }));
      } else {
        query.$or = userConditions;
      }
    } else {
      // For admins, apply filters directly
      if (entityType) {
        query.entityType = entityType;
      }
      if (entityId) {
        query.entityId = entityId;
      }
    }

    // Filter by file type
    if (fileType) {
      const extensions = {
        image: [
          ".jpg",
          ".jpeg",
          ".png",
          ".gif",
          ".webp",
          ".svg",
          ".bmp",
          ".tiff",
        ],
        document: [
          ".pdf",
          ".doc",
          ".docx",
          ".xls",
          ".xlsx",
          ".ppt",
          ".pptx",
          ".txt",
          ".rtf",
        ],
        video: [".mp4", ".avi", ".mov", ".wmv", ".flv", ".webm"],
        audio: [".mp3", ".wav", ".flac", ".aac"],
        archive: [".zip", ".rar", ".7z", ".tar", ".gz"],
      };

      if (extensions[fileType]) {
        query.extension = { $in: extensions[fileType] };
      }
    }

    // Filter by tags
    if (tags) {
      const tagArray = tags.split(",").map((t) => t.trim());
      query.tags = { $in: tagArray };
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    // Execute query
    const totalCount = await File.countDocuments(query);
    const files = await File.find(query)
      .populate("uploadedBy", "name email")
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // Convert to plain objects
    const filesWithIds = files.map((file) => ({
      ...file,
      id: file._id.toString(),
      _id: undefined,
      uploadedBy: file.uploadedBy
        ? {
            ...file.uploadedBy,
            id: file.uploadedBy._id.toString(),
            _id: undefined,
          }
        : file.uploadedBy,
    }));

    return NextResponse.json({
      files: filesWithIds,
      totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
    });
  } catch (error) {
    console.error("Error fetching files:", error);
    return NextResponse.json(
      { error: "Failed to fetch files" },
      { status: 500 },
    );
  }
}

/**
 * PUT /api/files
 * Update file metadata
 */
export async function PUT(request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Connect to MongoDB
    await connectMongoose();

    const body = await request.json();
    const { fileId, tags, description, isPublic } = body;

    if (!fileId) {
      return NextResponse.json(
        { error: "File ID is required" },
        { status: 400 },
      );
    }

    // Find the file
    const file = await File.findById(fileId);
    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Check permissions (users can only update their own files or files associated with their documents, admins can update any)
    if (session.user.role !== "admin") {
      const isOwner = file.uploadedBy.toString() === session.user.id;

      // Check if file is associated with user's document
      let isAssociatedWithUserDocument = false;
      if (file.entityType === "document" && file.entityId) {
        const document = await Document.findById(file.entityId);
        isAssociatedWithUserDocument =
          document && document.user.toString() === session.user.id;
      }

      if (!isOwner && !isAssociatedWithUserDocument) {
        return NextResponse.json(
          { error: "Permission denied" },
          { status: 403 },
        );
      }
    }

    // Update fields
    if (tags !== undefined) {
      file.tags = Array.isArray(tags) ? tags : [];
    }
    if (description !== undefined) {
      file.description = description;
    }
    if (isPublic !== undefined) {
      file.isPublic = isPublic;
    }

    await file.save();

    // Populate user info for response
    await file.populate("uploadedBy", "name email");

    return NextResponse.json({
      file: {
        ...file.toJSON(),
        id: file._id.toString(),
        _id: undefined,
        uploadedBy: file.uploadedBy
          ? {
              ...file.uploadedBy.toJSON(),
              id: file.uploadedBy._id.toString(),
              _id: undefined,
            }
          : file.uploadedBy,
      },
    });
  } catch (error) {
    console.error("Error updating file:", error);
    return NextResponse.json(
      { error: "Failed to update file" },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/files
 * Delete files (both from storage and database)
 */
export async function DELETE(request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Connect to MongoDB
    await connectMongoose();

    const body = await request.json();
    const { fileIds } = body;

    if (!fileIds || !Array.isArray(fileIds) || fileIds.length === 0) {
      return NextResponse.json(
        { error: "File IDs are required" },
        { status: 400 },
      );
    }

    // Find files
    const files = await File.find({ _id: { $in: fileIds } });

    // Check permissions
    if (session.user.role !== "admin") {
      // Get user's documents for permission checking
      const userDocuments = await Document.find({
        user: session.user.id,
      }).select("_id");
      const userDocumentIds = userDocuments.map((doc) => doc._id.toString());

      const unauthorizedFiles = files.filter((file) => {
        const isOwner = file.uploadedBy.toString() === session.user.id;
        const isAssociatedWithUserDocument =
          file.entityType === "document" &&
          file.entityId &&
          userDocumentIds.includes(file.entityId.toString());

        return !isOwner && !isAssociatedWithUserDocument;
      });

      if (unauthorizedFiles.length > 0) {
        return NextResponse.json(
          { error: "Permission denied for some files" },
          { status: 403 },
        );
      }
    }

    const deleteResults = [];
    const errors = [];

    // Delete each file
    for (const file of files) {
      try {
        // Delete from bunny.net storage
        const bunnyStorage = (await import("@/libs/bunnyStorage")).default;
        await bunnyStorage.deleteFile(file.filePath);

        // Delete from database
        await File.findByIdAndDelete(file._id);

        deleteResults.push({
          fileId: file._id.toString(),
          fileName: file.originalName,
          success: true,
        });
      } catch (error) {
        console.error(`Error deleting file ${file.originalName}:`, error);
        errors.push(`${file.originalName}: ${error.message}`);
        deleteResults.push({
          fileId: file._id.toString(),
          fileName: file.originalName,
          success: false,
          error: error.message,
        });
      }
    }

    return NextResponse.json({
      success: true,
      deleted: deleteResults.filter((r) => r.success),
      errors: errors.length > 0 ? errors : undefined,
      message: `Successfully deleted ${deleteResults.filter((r) => r.success).length} file(s)`,
    });
  } catch (error) {
    console.error("Error deleting files:", error);
    return NextResponse.json(
      { error: "Failed to delete files" },
      { status: 500 },
    );
  }
}
