import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route.js";
import connectMongoose from "@/libs/mongoose";
import Milestone from "../../../../../models/Milestone.js";
import Project from "../../../../../models/Project.js";

// PUT /api/admin/milestones/[id]
export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 401 },
      );
    }

    await connectMongoose();
    const { id } = params;
    const body = await request.json();
    const { name, description, date, status, type, color, icon, notes, order } =
      body;

    // Find milestone and verify it exists
    const milestone = await Milestone.findById(id);
    if (!milestone) {
      return NextResponse.json(
        { error: "Milestone not found" },
        { status: 404 },
      );
    }

    // Verify project exists
    const project = await Project.findById(milestone.project);
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Update milestone
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (date !== undefined) updateData.date = new Date(date);
    if (status !== undefined) updateData.status = status;
    if (type !== undefined) updateData.type = type;
    if (color !== undefined) updateData.color = color;
    if (icon !== undefined) updateData.icon = icon;
    if (notes !== undefined) updateData.notes = notes;
    if (order !== undefined) updateData.order = order;

    const updatedMilestone = await Milestone.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    return NextResponse.json({ milestone: updatedMilestone });
  } catch (error) {
    console.error("Error updating milestone:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// DELETE /api/admin/milestones/[id]
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 401 },
      );
    }

    await connectMongoose();
    const { id } = params;

    // Find milestone and verify it exists
    const milestone = await Milestone.findById(id);
    if (!milestone) {
      return NextResponse.json(
        { error: "Milestone not found" },
        { status: 404 },
      );
    }

    // Verify project exists
    const project = await Project.findById(milestone.project);
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Delete milestone
    await Milestone.findByIdAndDelete(id);

    return NextResponse.json({ message: "Milestone deleted successfully" });
  } catch (error) {
    console.error("Error deleting milestone:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
