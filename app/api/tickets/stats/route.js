import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import connectMongoose from "@/libs/mongoose";
import { Ticket } from "@/models/index.js";

// GET /api/tickets/stats - Get ticket statistics
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only admins can view statistics
    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    await connectMongoose();

    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "30"; // days
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // Calculate date range
    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter = {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      };
    } else {
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - parseInt(period));
      dateFilter = {
        createdAt: { $gte: daysAgo },
      };
    }

    // Basic statistics
    const totalTickets = await Ticket.countDocuments(dateFilter);
    const newTickets = await Ticket.countDocuments({
      ...dateFilter,
      status: "New",
    });
    const inProgressTickets = await Ticket.countDocuments({
      ...dateFilter,
      status: "In Progress",
    });
    const resolvedTickets = await Ticket.countDocuments({
      ...dateFilter,
      status: "Resolved",
    });
    const closedTickets = await Ticket.countDocuments({
      ...dateFilter,
      status: "Closed",
    });

    // Overdue tickets
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const overdueTickets = await Ticket.countDocuments({
      status: "New",
      createdAt: { $lt: sevenDaysAgo },
    });

    // Category breakdown
    let categoryStats = [];
    try {
      categoryStats = await Ticket.aggregate([
        { $match: dateFilter },
        {
          $group: {
            _id: "$category",
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
      ]);
    } catch (error) {
      console.error("Error in category stats aggregation:", error);
    }

    // Priority breakdown
    let priorityStats = [];
    try {
      priorityStats = await Ticket.aggregate([
        { $match: dateFilter },
        {
          $group: {
            _id: "$priority",
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
      ]);
    } catch (error) {
      console.error("Error in priority stats aggregation:", error);
    }

    // Status breakdown
    let statusStats = [];
    try {
      statusStats = await Ticket.aggregate([
        { $match: dateFilter },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
      ]);
    } catch (error) {
      console.error("Error in status stats aggregation:", error);
    }

    // Daily ticket creation trend
    let dailyTrend = [];
    try {
      dailyTrend = await Ticket.aggregate([
        { $match: dateFilter },
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$createdAt",
              },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]);
    } catch (error) {
      console.error("Error in daily trend aggregation:", error);
    }

    // Average resolution time (for resolved tickets)
    let resolutionTimeStats = [];
    try {
      resolutionTimeStats = await Ticket.aggregate([
        {
          $match: {
            ...dateFilter,
            status: { $in: ["Resolved", "Closed"] },
            resolvedAt: { $exists: true },
          },
        },
        {
          $addFields: {
            resolutionTime: {
              $divide: [
                { $subtract: ["$resolvedAt", "$createdAt"] },
                1000 * 60 * 60 * 24, // Convert to days
              ],
            },
          },
        },
        {
          $group: {
            _id: null,
            avgResolutionTime: { $avg: "$resolutionTime" },
            minResolutionTime: { $min: "$resolutionTime" },
            maxResolutionTime: { $max: "$resolutionTime" },
          },
        },
      ]);
    } catch (error) {
      console.error("Error in resolution time aggregation:", error);
    }

    // Top assigned employees
    let employeeStats = [];
    try {
      employeeStats = await Ticket.aggregate([
        { $match: { ...dateFilter, assignedTo: { $exists: true } } },
        {
          $lookup: {
            from: "employees",
            localField: "assignedTo",
            foreignField: "_id",
            as: "employee",
          },
        },
        { $unwind: "$employee" },
        {
          $group: {
            _id: "$assignedTo",
            employeeName: { $first: "$employee.name" },
            ticketCount: { $sum: 1 },
            resolvedCount: {
              $sum: {
                $cond: [{ $in: ["$status", ["Resolved", "Closed"]] }, 1, 0],
              },
            },
          },
        },
        { $sort: { ticketCount: -1 } },
        { $limit: 10 },
      ]);
    } catch (error) {
      console.error("Error in employee stats aggregation:", error);
    }

    // Project-linked tickets
    let projectStats = [];
    try {
      projectStats = await Ticket.aggregate([
        { $match: { ...dateFilter, project: { $exists: true } } },
        {
          $lookup: {
            from: "projects",
            localField: "project",
            foreignField: "_id",
            as: "project",
          },
        },
        { $unwind: "$project" },
        {
          $group: {
            _id: "$project",
            projectName: { $first: "$project.name" },
            projectType: { $first: "$project.type" },
            ticketCount: { $sum: 1 },
          },
        },
        { $sort: { ticketCount: -1 } },
        { $limit: 10 },
      ]);
    } catch (error) {
      console.error("Error in project stats aggregation:", error);
    }

    return NextResponse.json({
      overview: {
        total: totalTickets,
        new: newTickets,
        inProgress: inProgressTickets,
        resolved: resolvedTickets,
        closed: closedTickets,
        overdue: overdueTickets,
      },
      categories: categoryStats,
      priorities: priorityStats,
      statuses: statusStats,
      dailyTrend,
      resolutionTime: resolutionTimeStats[0] || {
        avgResolutionTime: 0,
        minResolutionTime: 0,
        maxResolutionTime: 0,
      },
      topEmployees: employeeStats,
      topProjects: projectStats,
    });
  } catch (error) {
    console.error("Error fetching ticket statistics:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 },
    );
  }
}
