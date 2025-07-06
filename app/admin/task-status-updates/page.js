import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import { redirect } from "next/navigation";
import connectMongoose from "@/libs/mongoose";
import TaskStatusUpdate from "@/models/TaskStatusUpdate";
import TaskStatusUpdatesClient from "./components/TaskStatusUpdatesClient";

/**
 * Admin Task Status Updates Page
 * Shows pending task status update requests that need admin approval
 */
export default async function AdminTaskStatusUpdatesPage() {
  // Check authentication and admin access
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin") {
    redirect("/dashboard");
  }

  // Connect to MongoDB
  await connectMongoose();

  // Get pending status update requests and convert to plain objects
  const pendingRequests = await TaskStatusUpdate.getPendingRequests().lean();

  // Convert to plain objects with proper ID handling
  const requestsData = pendingRequests.map((request) => ({
    id: request._id.toString(),
    task: request.task
      ? {
          id: request.task._id.toString(),
          name: request.task.name,
          description: request.task.description,
          project: request.task.project,
        }
      : null,
    requestedBy: request.requestedBy
      ? {
          id: request.requestedBy._id.toString(),
          name: request.requestedBy.name,
          position: request.requestedBy.position,
        }
      : null,
    reviewedBy: request.reviewedBy
      ? {
          id: request.reviewedBy._id.toString(),
          name: request.reviewedBy.name,
        }
      : null,
    currentStatus: request.currentStatus,
    requestedStatus: request.requestedStatus,
    requestStatus: request.requestStatus,
    employeeNotes: request.employeeNotes,
    adminNotes: request.adminNotes,
    requestedAt: request.requestedAt,
    reviewedAt: request.reviewedAt,
    createdAt: request.createdAt,
    updatedAt: request.updatedAt,
  }));

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Task Status Update Requests
        </h1>
        <p className="text-gray-600">
          Review and approve/reject employee requests to update task statuses.
        </p>
      </div>

      <TaskStatusUpdatesClient pendingRequests={requestsData} />
    </div>
  );
}
