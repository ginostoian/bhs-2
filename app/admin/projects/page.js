import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongoose from "@/libs/mongoose";
import Project from "@/models/Project";
import User from "@/models/User";
import ProjectsList from "./components/ProjectsList";
import Task from "@/models/Task";

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
  const projectIds = projects.map((p) => p._id);

  // Fetch all tasks for these projects
  const allTasks = await Task.find({ project: { $in: projectIds } }).lean();

  // Group tasks by project and compute stats
  const tasksByProject = {};
  for (const task of allTasks) {
    const pid = task.project.toString();
    if (!tasksByProject[pid]) {
      tasksByProject[pid] = [];
    }
    tasksByProject[pid].push(task);
  }

  // Convert to plain objects and add user info and accurate stats
  const projectsWithUserInfo = projects.map((project) => {
    const pid = project._id.toString();
    const projectTasks = tasksByProject[pid] || [];
    return {
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
      tasksCount: projectTasks.length,
      completedTasksCount: projectTasks.filter((t) => t.status === "Done")
        .length,
      inProgressTasks: projectTasks.filter((t) => t.status === "In Progress")
        .length,
      scheduledTasks: projectTasks.filter((t) => t.status === "Scheduled")
        .length,
      blockedTasks: projectTasks.filter((t) => t.status === "Blocked").length,
    };
  });

  return (
    <div>
      <div className="mb-8">
        <h2 className="mb-2 text-2xl font-bold text-gray-900">
          Project Management
        </h2>
        <p className="text-gray-600">
          Manage ongoing renovation projects and track progress
        </p>
        <div className="mt-4 rounded-lg bg-blue-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-blue-400">ℹ️</span>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                <strong>Note:</strong> Finished projects are moved to the{" "}
                <a
                  href="/admin/finished-projects"
                  className="font-medium underline hover:text-blue-600"
                >
                  Finished Projects
                </a>{" "}
                section where you can review completed work and project
                outcomes.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Projects List */}
      <div>
        <ProjectsList projects={projectsWithUserInfo} />
      </div>
    </div>
  );
}
