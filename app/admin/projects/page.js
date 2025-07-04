import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongoose from "@/libs/mongoose";
import Project from "@/models/Project";
import User from "@/models/User";
import ProjectsList from "./components/ProjectsList";

/**
 * Admin Projects Page
 * Displays all ongoing projects for management
 */
export default async function AdminProjectsPage() {
  // Get admin session
  const session = await getServerSession(authOptions);

  // Connect to MongoDB
  await connectMongoose();

  // Fetch all ongoing projects with populated user data
  const projects = await Project.getOngoingProjects();

  // Convert to plain objects and add user info
  const projectsWithUserInfo = projects.map((project) => ({
    id: project._id.toString(),
    name: project.name,
    type: project.type,
    status: project.status,
    priority: project.priority,
    progress: project.progress,
    startDate: project.startDate,
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
          Project Management
        </h2>
        <p className="text-gray-600">
          Manage ongoing renovation projects and track progress
        </p>
      </div>

      {/* Projects List */}
      <div>
        <ProjectsList projects={projectsWithUserInfo} />
      </div>
    </div>
  );
}
