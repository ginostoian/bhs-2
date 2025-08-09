import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import connectMongoose from "@/libs/mongoose";
import { Ticket, Project, User } from "@/models/index.js";

// GET /api/calendar - Get calendar events (tickets and projects)
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongoose();

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const type = searchParams.get("type"); // "tickets", "projects", or "all"

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: "startDate and endDate are required" },
        { status: 400 },
      );
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    const events = [];

    // Get scheduled tickets
    if (type !== "projects") {
      const scheduledTickets = await Ticket.find({
        scheduledDate: {
          $gte: start,
          $lte: end,
        },
      })
        .populate("user", "name email")
        .populate("assignedTo", "name position")
        .populate("project", "name type")
        .sort({ scheduledDate: 1, scheduledTime: 1 });

      scheduledTickets.forEach((ticket) => {
        events.push({
          id: `ticket-${ticket._id}`,
          title: `${ticket.ticketNumber}: ${ticket.title}`,
          start: ticket.scheduledDate,
          end: ticket.scheduledDate, // You could calculate end based on estimatedDuration
          allDay: false,
          type: "ticket",
          ticketNumber: ticket.ticketNumber,
          category: ticket.category,
          priority: ticket.priority,
          status: ticket.status,
          customerName: ticket.user?.name || "Unknown",
          assignedTo: ticket.assignedTo?.name || "Unassigned",
          projectName: ticket.project?.name || null,
          description: ticket.description,
          color: getTicketColor(ticket.priority, ticket.status),
          extendedProps: {
            ticketId: ticket._id,
            customerEmail: ticket.user?.email,
            estimatedDuration: ticket.estimatedDuration,
            scheduledTime: ticket.scheduledTime,
          },
        });
      });
    }

    // Get projects overlapping the requested window. If a project has a projectedFinishDate,
    // include it for every day between startDate and projectedFinishDate. If it does not,
    // show it on its startDate only.
    if (type !== "tickets") {
      const projects = await Project.find({
        $or: [
          // Projects with a projected finish that overlap the window
          {
            startDate: { $lte: end },
            projectedFinishDate: { $exists: true, $ne: null, $gte: start },
          },
          // Projects without a projected finish (null or missing); show only if the start is in the window
          {
            $and: [
              {
                $or: [
                  { projectedFinishDate: { $exists: false } },
                  { projectedFinishDate: null },
                ],
              },
              { startDate: { $gte: start, $lte: end } },
            ],
          },
        ],
      })
        .populate("user", "name email")
        .populate("projectManager", "name position")
        .sort({ startDate: 1 });

      projects.forEach((project) => {
        const startValue = project.startDate;
        const endValue = project.projectedFinishDate || project.startDate;
        events.push({
          id: `project-${project._id}`,
          title: `Project: ${project.name}`,
          start: startValue,
          end: endValue,
          allDay: true,
          type: "project",
          projectName: project.name,
          projectType: project.type,
          status: project.status,
          customerName: project.user?.name || "Unknown",
          projectManager: project.projectManager?.name || "Unassigned",
          description: project.description,
          color: getProjectColor(project.status),
          extendedProps: {
            projectId: project._id,
            customerEmail: project.user?.email,
            location: project.location,
            budget: project.budget,
          },
        });
      });
    }

    return NextResponse.json({ events });
  } catch (error) {
    console.error("Error fetching calendar events:", error);
    return NextResponse.json(
      { error: "Failed to fetch calendar events" },
      { status: 500 },
    );
  }
}

// Helper function to get ticket color based on priority and status
function getTicketColor(priority, status) {
  if (status === "Closed") return "#6B7280"; // Gray
  if (status === "Resolved") return "#10B981"; // Green

  switch (priority) {
    case "Critical":
      return "#EF4444"; // Red
    case "High":
      return "#F59E0B"; // Orange
    case "Medium":
      return "#3B82F6"; // Blue
    case "Low":
      return "#8B5CF6"; // Purple
    default:
      return "#6B7280"; // Gray
  }
}

// Helper function to get project color based on status
function getProjectColor(status) {
  switch (status) {
    case "On Going":
      return "#3B82F6"; // Blue
    case "Finished":
      return "#10B981"; // Green
    default:
      return "#6B7280"; // Gray
  }
}
