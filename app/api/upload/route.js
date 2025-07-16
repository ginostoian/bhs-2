import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongoose from "@/libs/mongoose";
import File from "@/models/File";
import User from "@/models/User";

// Force dynamic rendering for this route
export const dynamic = "force-dynamic";

/**
 * POST /api/upload
 * Upload files to bunny.net storage
 */
export async function POST(request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Connect to MongoDB
    await connectMongoose();

    // Import bunnyStorage dynamically to avoid initialization errors
    let bunnyStorage;
    try {
      bunnyStorage = (await import("@/libs/bunnyStorage")).default;
    } catch (error) {
      console.warn("Bunny.net storage not configured:", error.message);
      bunnyStorage = null;
    }

    // Parse form data
    const formData = await request.formData();
    const files = formData.getAll("files");
    const folder = formData.get("folder") || "uploads";
    const maxSize = parseInt(formData.get("maxSize")) || 50 * 1024 * 1024; // 50MB default
    const allowedTypes = formData.get("allowedTypes")
      ? formData
          .get("allowedTypes")
          .split(",")
          .map((t) => t.trim())
      : [];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    // Check if bunny.net storage is configured
    if (!bunnyStorage || !bunnyStorage.isConfigured()) {
      return NextResponse.json(
        {
          error:
            "File storage is not configured. Please contact administrator.",
        },
        { status: 503 },
      );
    }

    const uploadResults = [];
    const errors = [];
    const savedFiles = [];

    // Get additional parameters
    const entityType = formData.get("entityType") || "other";
    const entityId = formData.get("entityId");
    const targetUserId = formData.get("targetUserId"); // For admin uploads to specific users
    const tags = formData.get("tags")
      ? formData
          .get("tags")
          .split(",")
          .map((t) => t.trim())
      : [];
    const description = formData.get("description") || "";

    // Determine target user for upload
    let targetUser = session.user;
    let uploadUserId = session.user.id;

    // If admin is uploading for a specific user, get that user's info
    if (targetUserId && session.user.role === "admin") {
      try {
        const user = await User.findById(targetUserId).select("_id name email");
        if (user) {
          targetUser = user;
          uploadUserId = user._id.toString();
        } else {
          return NextResponse.json(
            { error: `Target user not found: ${targetUserId}` },
            { status: 400 },
          );
        }
      } catch (error) {
        return NextResponse.json(
          { error: `Error finding target user: ${error.message}` },
          { status: 500 },
        );
      }
    }

    // Process each file
    for (const file of files) {
      try {
        // Validate file
        if (!file || !file.name || !file.size) {
          errors.push(`Invalid file: ${file?.name || "unknown"}`);
          continue;
        }

        // Convert file to buffer
        const buffer = Buffer.from(await file.arrayBuffer());

        // Validate file size and type
        const validation = bunnyStorage.validateFile(
          buffer,
          file.name,
          maxSize,
          allowedTypes,
        );
        if (!validation.isValid) {
          errors.push(`${file.name}: ${validation.errors.join(", ")}`);
          continue;
        }

        // Upload to bunny.net with user isolation
        const result = await bunnyStorage.uploadFile(
          buffer,
          file.name,
          folder,
          file.type,
          uploadUserId, // Use target user ID for file isolation
          targetUser.name, // Pass user name for folder identification
        );

        // Save file metadata to MongoDB
        const fileRecord = await File.createFromUpload(
          result,
          session.user.id,
          entityType,
          entityId || null,
        );

        // Add tags and description if provided
        if (tags.length > 0 || description) {
          fileRecord.tags = tags;
          fileRecord.description = description;
          await fileRecord.save();
        }

        const uploadResult = {
          id: fileRecord._id.toString(),
          originalName: file.name,
          fileName: result.fileName,
          filePath: result.filePath,
          url: result.url,
          size: result.size,
          contentType: result.contentType,
          uploadedAt: result.uploadedAt,
          entityType: fileRecord.entityType,
          entityId: fileRecord.entityId,
          tags: fileRecord.tags,
          description: fileRecord.description,
        };

        uploadResults.push(uploadResult);
        savedFiles.push(fileRecord);
      } catch (error) {
        console.error(`Error uploading ${file.name}:`, error);
        errors.push(`${file.name}: ${error.message}`);
      }
    }

    // Return results
    if (uploadResults.length === 0) {
      return NextResponse.json(
        {
          error: "No files were uploaded successfully",
          details: errors,
        },
        { status: 400 },
      );
    }

    return NextResponse.json({
      success: true,
      uploaded: uploadResults,
      errors: errors.length > 0 ? errors : undefined,
      message: `Successfully uploaded ${uploadResults.length} file(s)`,
    });
  } catch (error) {
    console.error("File upload error:", error);
    return NextResponse.json(
      { error: "File upload failed", details: error.message },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/upload
 * Delete files from bunny.net storage
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

    // Parse request body
    const { filePaths, fileIds } = await request.json();

    if (!filePaths || !Array.isArray(filePaths) || filePaths.length === 0) {
      return NextResponse.json(
        { error: "No file paths provided" },
        { status: 400 },
      );
    }

    const deleteResults = [];
    const errors = [];

    // Delete each file
    for (const filePath of filePaths) {
      try {
        // Delete from bunny.net storage
        const result = await bunnyStorage.deleteFile(filePath);

        // Delete from MongoDB if fileIds are provided
        if (fileIds && fileIds.length > 0) {
          const fileId = fileIds.find((id) => {
            // Find the file record that matches this filePath
            // This is a simplified approach - in production you might want to store filePath in the request
            return true; // For now, we'll delete all provided fileIds
          });

          if (fileId) {
            await File.findByIdAndDelete(fileId);
          }
        } else {
          // Try to find and delete by filePath
          await File.findOneAndDelete({ filePath: filePath });
        }

        deleteResults.push({
          filePath: filePath,
          success: true,
          result: result,
        });
      } catch (error) {
        console.error(`Error deleting ${filePath}:`, error);
        errors.push(`${filePath}: ${error.message}`);
        deleteResults.push({
          filePath: filePath,
          success: false,
          error: error.message,
        });
      }
    }

    // Return results
    if (deleteResults.filter((r) => r.success).length === 0) {
      return NextResponse.json(
        {
          error: "No files were deleted successfully",
          details: errors,
        },
        { status: 400 },
      );
    }

    return NextResponse.json({
      success: true,
      deleted: deleteResults.filter((r) => r.success),
      errors: errors.length > 0 ? errors : undefined,
      message: `Successfully deleted ${deleteResults.filter((r) => r.success).length} file(s)`,
    });
  } catch (error) {
    console.error("File deletion error:", error);
    return NextResponse.json(
      { error: "File deletion failed", details: error.message },
      { status: 500 },
    );
  }
}
