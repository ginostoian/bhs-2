import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongoose from "@/libs/mongoose";
import Project from "@/models/Project";
import FinishedProjectsList from "./components/FinishedProjectsList";

/**
 * Admin Finished Projects Page
 * Displays all finished projects for review and reference
 */
export default async function AdminFinishedProjectsPage() {
  // Get admin session
  const session = await getServerSession(authOptions);

  // Connect to MongoDB
  await connectMongoose();

  // Fetch all finished projects with populated user data
  const projects = await Project.getFinishedProjects();

  // Convert to plain objects and add user info
  const projectsWithUserInfo = projects.map((project) => ({
    id: project._id.toString(),
    name: project.name,
    type: project.type,
    status: project.status,
    priority: project.priority,
    progress: project.progress,
    startDate: project.startDate,
    completionDate: project.completionDate,
    location: project.location,
    budget: project.budget,
    projectManager: project.projectManager,
    user: {
      id: project.user._id.toString(),
      name: project.user.name,
      email: project.user.email,
    },
    tasksCount: project.tasksCount || 0,
    completedTasksCount: project.completedTasksCount || 0,
  }));

  return (
    <div>
      <div className="mb-8">
        <h2 className="mb-2 text-2xl font-bold text-gray-900">
          Finished Projects
        </h2>
        <p className="text-gray-600">
          Review completed renovation projects and their final outcomes
        </p>
      </div>

      {/* Finished Projects List */}
      <div>
        <FinishedProjectsList projects={projectsWithUserInfo} />
      </div>
    </div>
  );
}
