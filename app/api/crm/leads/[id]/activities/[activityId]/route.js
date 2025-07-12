import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import Lead from "@/models/Lead";

// PATCH - Update a single activity (e.g., mark as done)
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
    if (!params.activityId) {
      return NextResponse.json(
        { error: "Activity ID required" },
        { status: 400 },
      );
    }

    const body = await request.json();

    // First, let's see what's actually in the database
    const lead = await Lead.findById(params.id);
    const activity = lead.activities.id(params.activityId);
    console.log("Raw activity from DB:", JSON.stringify(activity, null, 2));
    console.log(
      "Activity has status field:",
      activity.hasOwnProperty("status"),
    );
    console.log("Activity status value:", activity.status);

    // Get the current activity
    const currentActivity = activity.toObject();
    console.log("Current activity:", currentActivity);

    // Create updated activity with status field
    const updatedActivityData = {
      ...currentActivity,
      status: body.status,
    };

    console.log("Updated activity data:", updatedActivityData);

    // Try a different approach - use $set with explicit field path
    const result = await Lead.updateOne(
      { _id: params.id, "activities._id": params.activityId },
      {
        $set: {
          "activities.$.status": body.status,
        },
      },
    );

    console.log("Update result:", result);

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Lead or activity not found" },
        { status: 404 },
      );
    }

    // Let's also try to verify the update worked by checking the database directly
    const verificationLead = await Lead.findById(params.id);
    const verificationActivity = verificationLead.activities.id(
      params.activityId,
    );
    console.log(
      "Verification - Activity status after update:",
      verificationActivity.status,
    );
    console.log(
      "Verification - Activity has status field:",
      verificationActivity.hasOwnProperty("status"),
    );

    // Re-fetch the lead to get the updated data
    const updatedLead = await Lead.findById(params.id).populate(
      "activities.createdBy",
      "name email",
    );
    const updatedActivity = updatedLead.activities.id(params.activityId);

    console.log("Updated activity status:", updatedActivity.status);
    console.log(
      "Updated activity raw:",
      JSON.stringify(updatedActivity, null, 2),
    );

    // Ensure the returned activity has the status field
    const activityWithStatus = {
      ...updatedActivity.toObject(),
      status: updatedActivity.status || "pending",
    };

    return NextResponse.json(
      { success: true, activity: activityWithStatus },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating activity:", error);
    return NextResponse.json(
      { error: "Failed to update activity" },
      { status: 500 },
    );
  }
}
