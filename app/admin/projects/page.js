import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongoose from "@/libs/mongoose";
import Project from "@/models/Project";
import User from "@/models/User";
import Link from "next/link";
import ProjectsList from "./components/ProjectsList";
import Task from "@/models/Task";

/**
 * Admin Projects Page
 * Displays all ongoing projects for management
 */
export default async function AdminProjectsPage({ searchParams }) {
  // Get admin session
  const session = await getServerSession(authOptions);

  // Connect to MongoDB
  await connectMongoose();

  const page = parseInt(searchParams?.page) || 1;
  const limit = 10; // Set to 10 as per user preference

  // Fetch paginated ongoing projects with task statistics automatically included
  const { projects, pagination } = await Project.getOngoingProjectsPaginated({
    page,
    limit,
  });

  // Ensure data is plain serializable objects for Client Components
  // Using JSON serialization is the most robust way to handle all Mongoose-specific types in one go
  const projectsWithUserInfo = JSON.parse(JSON.stringify(projects));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Project Management
              </h1>
              <p className="mt-2 text-lg text-gray-600">
                Manage ongoing renovation projects and track progress
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600">
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Info Banner */}
        <div className="mb-8 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 p-6 shadow-sm ring-1 ring-blue-100">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500">
                <svg
                  className="h-4 w-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-blue-800">
                Project Management
              </h3>
              <p className="mt-1 text-sm text-blue-700">
                Finished projects are moved to the{" "}
                <Link
                  href="/admin/finished-projects"
                  className="font-medium underline hover:text-blue-600"
                >
                  Finished Projects
                </Link>{" "}
                section where you can review completed work and project
                outcomes.
              </p>
            </div>
          </div>
        </div>

        {/* Projects List */}
        <ProjectsList
          projects={projectsWithUserInfo}
          pagination={pagination}
        />
      </div>
    </div>
  );
}
