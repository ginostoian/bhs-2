import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import { redirect } from "next/navigation";
import connectMongoose from "@/libs/mongoose";
import Task from "@/models/Task";
import Project from "@/models/Project";
import Employee from "@/models/Employee";
import EmployeeProjectsClient from "./components/EmployeeProjectsClient";

/**
 * Employee Projects Page
 * Shows all projects the employee has tasks assigned to
 */
export default async function EmployeeProjectsPage() {
  // Check authentication and employee access
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/signin");
  }

  if (session.user.role !== "employee") {
    redirect("/dashboard");
  }

  // Connect to MongoDB
  await connectMongoose();

  // Find the employee record
  const employee = await Employee.findOne({ email: session.user.email });
  if (!employee) {
    redirect("/dashboard");
  }

  // Get employee's tasks to find associated projects
  const tasks = await Task.find({ assignedTo: employee._id })
    .populate("project", "name type status location startDate")
    .populate("section", "name color icon")
    .lean();

  // Get unique project IDs from tasks
  const projectIds = [
    ...new Set(tasks.map((task) => task.project?._id).filter(Boolean)),
  ];

  // Get projects with task counts and user info
  const projects = await Project.find({ _id: { $in: projectIds } })
    .populate("user", "name email")
    .lean()
    .then((projects) => {
      return projects.map((project) => {
        const projectTasks = tasks.filter(
          (task) => task.project?._id.toString() === project._id.toString(),
        );

        return {
          ...project,
          id: project._id.toString(),
          _id: undefined,
          user: project.user
            ? {
                ...project.user,
                id: project.user._id.toString(),
                _id: undefined,
              }
            : null,
          taskCount: projectTasks.length,
          completedTasks: projectTasks.filter((t) => t.status === "Done")
            .length,
          inProgressTasks: projectTasks.filter(
            (t) => t.status === "In Progress",
          ).length,
          scheduledTasks: projectTasks.filter((t) => t.status === "Scheduled")
            .length,
          blockedTasks: projectTasks.filter((t) => t.status === "Blocked")
            .length,
        };
      });
    });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Projects</h1>
        <p className="text-gray-600">
          View all projects you have tasks assigned to.
        </p>
      </div>

      <EmployeeProjectsClient projects={projects} />
    </div>
  );
}
