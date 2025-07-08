import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import { redirect } from "next/navigation";
import connectMongoose from "@/libs/mongoose";
import Task from "@/models/Task";
import TaskSection from "@/models/TaskSection";
import Project from "@/models/Project";
import Employee from "@/models/Employee";
import EmployeeDashboardClient from "./components/EmployeeDashboardClient";

/**
 * Employee Dashboard Page
 * Shows overview of employee's tasks and projects
 */
export default async function EmployeeDashboardPage() {
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

  // Get employee's tasks
  const tasks = await Task.find({ assignedTo: employee._id })
    .populate("project", "name type status location")
    .populate("section", "name color icon")
    .sort({ dueDate: 1, priority: -1 })
    .lean()
    .then((tasks) => {
      return tasks.map((task) => ({
        ...task,
        id: task._id.toString(),
        _id: undefined,
        project: task.project
          ? {
              ...task.project,
              id: task.project._id.toString(),
              _id: undefined,
            }
          : null,
        section: task.section
          ? {
              ...task.section,
              id: task.section._id.toString(),
              _id: undefined,
            }
          : null,
      }));
    });

  // Get employee's projects (unique projects from tasks)
  const projectIds = [
    ...new Set(tasks.map((task) => task.project?.id).filter(Boolean)),
  ];
  const projects = await Project.find({ _id: { $in: projectIds } })
    .populate("user", "name email")
    .lean()
    .then((projects) => {
      return projects.map((project) => ({
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
      }));
    });

  // Calculate statistics
  const stats = {
    totalTasks: tasks.length,
    scheduledTasks: tasks.filter((t) => t.status === "Scheduled").length,
    inProgressTasks: tasks.filter((t) => t.status === "In Progress").length,
    completedTasks: tasks.filter((t) => t.status === "Done").length,
    blockedTasks: tasks.filter((t) => t.status === "Blocked").length,
    totalProjects: projects.length,
    urgentTasks: tasks.filter((t) => t.priority === "urgent").length,
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {employee.name}!
        </h1>
        <p className="text-gray-600">
          Here&apos;s an overview of your current tasks and projects.
        </p>
      </div>

      <EmployeeDashboardClient
        tasks={tasks}
        projects={projects}
        stats={stats}
        employee={employee}
      />
    </div>
  );
}
