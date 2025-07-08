import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import { redirect } from "next/navigation";
import connectMongoose from "@/libs/mongoose";
import Task from "@/models/Task";
import TaskSection from "@/models/TaskSection";
import Employee from "@/models/Employee";
import EmployeeTasksClient from "./components/EmployeeTasksClient";

/**
 * Employee Tasks Page
 * Shows all tasks assigned to the employee
 */
export default async function EmployeeTasksPage() {
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

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>
        <p className="text-gray-600">
          View and manage all tasks assigned to you.
        </p>
      </div>

      <EmployeeTasksClient tasks={tasks} />
    </div>
  );
}
