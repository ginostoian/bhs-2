import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongoose from "@/libs/mongoose";
import { ProjectChange, Project } from "@/models/index.js";
import UserChangesClient from "./components/UserChangesClient";

/**
 * User Changes Dashboard Page
 * Displays all project changes for the current user
 */
export default async function UserChangesPage() {
  // Get user session
  const session = await getServerSession(authOptions);

  // Connect to MongoDB
  await connectMongoose();

  // Fetch user's changes and convert to plain objects
  const changes = await ProjectChange.find({ user: session.user.id })
    .sort({ order: 1 })
    .populate("project", "name")
    .populate("decidedBy", "name")
    .lean()
    .then((docs) =>
      docs.map((doc) => ({
        id: doc._id.toString(),
        project: doc.project
          ? {
              id: doc.project._id.toString(),
              name: doc.project.name,
            }
          : null,
        changeNumber: doc.changeNumber,
        name: doc.name,
        description: doc.description,
        cost: doc.cost,
        status: doc.status,
        includedInPaymentPlan: doc.includedInPaymentPlan,
        type: doc.type,
        order: doc.order,
        adminNotes: doc.adminNotes,
        requestedDate: doc.requestedDate,
        decisionDate: doc.decisionDate,
        decidedBy: doc.decidedBy
          ? {
              id: doc.decidedBy._id.toString(),
              name: doc.decidedBy.name,
            }
          : null,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      })),
    );

  return (
    <div>
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Project Changes
            </h2>
            <p className="mt-2 text-lg text-gray-600">
              Review and respond to project change requests
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
              <div className="flex items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500">
                  <svg
                    className="h-5 w-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-blue-600">
                    Total Changes
                  </p>
                  <p className="text-2xl font-bold text-blue-900">
                    {changes.length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <UserChangesClient changes={changes} />
    </div>
  );
}
