import { NextResponse } from "next/server";
import connectMongoose from "@/libs/mongoose";
import Project from "@/models/Project";
import GanttShare from "@/models/GanttShare";
import { requireAdmin } from "@/libs/requireAdmin";

/**
 * POST /api/projects/[projectId]/gantt-share
 * Generate a new share link for a project's Gantt chart (admin only)
 */
export async function POST(req, { params }) {
  try {
    await requireAdmin(req);
    await connectMongoose();
    const { projectId } = params;

    // Verify project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Get current user from session
    const session = await requireAdmin(req);

    // Generate unique token
    let token;
    let isUnique = false;
    while (!isUnique) {
      token = GanttShare.generateToken();
      const existingShare = await GanttShare.findOne({ token });
      if (!existingShare) {
        isUnique = true;
      }
    }

    // Create share record
    const share = await GanttShare.create({
      project: projectId,
      token,
      createdBy: session.user.id,
    });

    // Generate share URL
    const shareUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/gantt/${token}`;

    return NextResponse.json({
      shareUrl,
      share: {
        id: share.id,
        token: share.token,
        createdAt: share.createdAt,
        expiresAt: share.expiresAt,
      },
    });
  } catch (error) {
    console.error("Error creating Gantt share:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create share link" },
      { status: 500 },
    );
  }
}

/**
 * GET /api/projects/[projectId]/gantt-share
 * Get all share links for a project (admin only)
 */
export async function GET(req, { params }) {
  try {
    await requireAdmin(req);
    await connectMongoose();
    const { projectId } = params;

    // Verify project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Get all shares for this project
    const shares = await GanttShare.getProjectShares(projectId);

    // Generate share URLs
    const sharesWithUrls = shares.map((share) => ({
      id: share.id,
      token: share.token,
      isActive: share.isActive,
      expiresAt: share.expiresAt,
      viewCount: share.viewCount,
      lastViewedAt: share.lastViewedAt,
      createdAt: share.createdAt,
      createdBy: share.createdBy,
      shareUrl: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/gantt/${share.token}`,
    }));

    return NextResponse.json({ shares: sharesWithUrls });
  } catch (error) {
    console.error("Error fetching Gantt shares:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch share links" },
      { status: 500 },
    );
  }
}
