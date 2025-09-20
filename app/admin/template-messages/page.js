import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import { redirect } from "next/navigation";
import connectMongoose from "@/libs/mongoose";
import { TemplateMessage } from "@/models/index.js";
import TemplateMessagesClient from "./components/TemplateMessagesClient";

/**
 * Admin Template Messages Page
 * Main interface for managing template messages
 */
export default async function AdminTemplateMessagesPage() {
  // Check authentication and admin access
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "admin") {
    redirect("/dashboard");
  }

  // Connect to MongoDB
  await connectMongoose();

  // Fetch initial template messages
  const templates = await TemplateMessage.find({})
    .populate("createdBy", "name email")
    .populate("lastUpdatedBy", "name email")
    .sort({ createdAt: -1 })
    .limit(12)
    .lean()
    .then((docs) =>
      docs.map((doc) => ({
        ...doc,
        id: doc._id.toString(),
        _id: undefined,
        createdBy: doc.createdBy
          ? {
              id: doc.createdBy._id.toString(),
              name: doc.createdBy.name,
              email: doc.createdBy.email,
            }
          : null,
        lastUpdatedBy: doc.lastUpdatedBy
          ? {
              id: doc.lastUpdatedBy._id.toString(),
              name: doc.lastUpdatedBy.name,
              email: doc.lastUpdatedBy.email,
            }
          : null,
      })),
    );

  // Get category statistics
  const categoryStats = await TemplateMessage.aggregate([
    { $group: { _id: "$category", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          Template Messages
        </h1>
        <p className="text-gray-600">
          Manage reusable text snippets, messages, and information
        </p>
      </div>

      {/* Statistics */}
      <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
        <h3 className="mb-4 text-lg font-medium text-gray-900">Overview</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg bg-blue-50 p-4">
            <div className="text-2xl font-bold text-blue-600">
              {templates.length}
            </div>
            <div className="text-sm text-blue-600">Total Templates</div>
          </div>
          <div className="rounded-lg bg-green-50 p-4">
            <div className="text-2xl font-bold text-green-600">
              {templates.filter((t) => t.isActive).length}
            </div>
            <div className="text-sm text-green-600">Active Templates</div>
          </div>
          <div className="rounded-lg bg-purple-50 p-4">
            <div className="text-2xl font-bold text-purple-600">
              {categoryStats.length}
            </div>
            <div className="text-sm text-purple-600">Categories</div>
          </div>
          <div className="rounded-lg bg-orange-50 p-4">
            <div className="text-2xl font-bold text-orange-600">
              {templates.reduce((sum, t) => sum + (t.usageCount || 0), 0)}
            </div>
            <div className="text-sm text-orange-600">Total Uses</div>
          </div>
        </div>
      </div>

      {/* Category Statistics */}
      {categoryStats.length > 0 && (
        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
          <h3 className="mb-4 text-lg font-medium text-gray-900">
            Templates by Category
          </h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {categoryStats.map((stat) => (
              <div
                key={stat._id}
                className="flex items-center justify-between rounded-lg border border-gray-200 p-3"
              >
                <span className="text-sm font-medium text-gray-700">
                  {stat._id}
                </span>
                <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                  {stat.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Template Messages Client Component */}
      <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
        <TemplateMessagesClient initialTemplates={templates} />
      </div>
    </div>
  );
}
