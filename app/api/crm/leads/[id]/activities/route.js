import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import Lead from "@/models/Lead";

// GET - Fetch activities for a lead
export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongo();

    // Validate ID parameter
    if (!params.id || params.id === "undefined") {
      return NextResponse.json({ error: "Invalid lead ID" }, { status: 400 });
    }

    const lead = await Lead.findById(params.id)
      .populate("activities.createdBy", "name email")
      .select("activities");

    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    // Debug: Log raw activities from database
    console.log(
      "Raw activities from DB:",
      lead.activities.map((a) => ({
        id: a._id,
        title: a.title,
        status: a.status,
        hasStatus: a.hasOwnProperty("status"),
      })),
    );

    // Ensure all activities have a status field
    const activitiesWithStatus = lead.activities.map((activity) => {
      const activityObj = activity.toObject();
      console.log(
        `Activity ${activity._id} - Raw status:`,
        activity.status,
        "Has status field:",
        activity.hasOwnProperty("status"),
      );
      return {
        ...activityObj,
        status: activity.status || "pending",
      };
    });

    console.log(
      "Activities with status:",
      activitiesWithStatus.map((a) => ({
        id: a._id,
        title: a.title,
        status: a.status,
      })),
    );

    return NextResponse.json({ activities: activitiesWithStatus });
  } catch (error) {
    console.error("Error fetching activities:", error);
    return NextResponse.json(
      { error: "Failed to fetch activities" },
      { status: 500 },
    );
  }
}

// POST - Add a new activity to a lead
export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongo();

    // Validate ID parameter
    if (!params.id || params.id === "undefined" || params.id === "null") {
      return NextResponse.json({ error: "Invalid lead ID" }, { status: 400 });
    }

    const body = await request.json();
    const { type, title, description, attachments, metadata, contactMade } =
      body;

    if (!type || !title) {
      return NextResponse.json(
        { error: "Activity type and title are required" },
        { status: 400 },
      );
    }

    const lead = await Lead.findById(params.id);
    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    const activity = {
      type,
      title,
      description,
      contactMade: contactMade || false,
      date: new Date(),
      createdBy: session.user.id,
      attachments: attachments || [],
      metadata: metadata || {},
    };

    await lead.addActivity(activity);

    // Populate the new activity
    await lead.populate("activities.createdBy", "name email");

    const newActivity = lead.activities[lead.activities.length - 1];

    return NextResponse.json(
      { success: true, activity: newActivity },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error adding activity:", error);
    return NextResponse.json(
      { error: "Failed to add activity" },
      { status: 500 },
    );
  }
}

// PATCH - Update an activity (e.g., mark as done)
export async function PATCH(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongo();

    // Validate ID parameter
    if (!params.id || params.id === "undefined" || params.id === "null") {
      return NextResponse.json({ error: "Invalid lead ID" }, { status: 400 });
    }
    const { activityId } = params;
    if (!activityId) {
      return NextResponse.json(
        { error: "Activity ID required" },
        { status: 400 },
      );
    }

    const body = await request.json();
    const lead = await Lead.findById(params.id);
    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }
    const activity = lead.activities.id(activityId);
    if (!activity) {
      return NextResponse.json(
        { error: "Activity not found" },
        { status: 404 },
      );
    }
    if (body.status) {
      activity.status = body.status;
    }
    await lead.save();
    await lead.populate("activities.createdBy", "name email");
    return NextResponse.json({ success: true, activity }, { status: 200 });
  } catch (error) {
    console.error("Error updating activity:", error);
    return NextResponse.json(
      { error: "Failed to update activity" },
      { status: 500 },
    );
  }
}
