import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import { redirect } from "next/navigation";
import connectMongoose from "@/libs/mongoose";
import Employee from "@/models/Employee";
import Task from "@/models/Task";
import EmployeeDetailClient from "./components/EmployeeDetailClient";

/**
 * Admin Employee Detail Page
 * Shows detailed information about a specific employee
 */
export default async function AdminEmployeeDetailPage({ params }) {
  // Check authentication and admin access
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin") {
    redirect("/dashboard");
  }

  // Connect to MongoDB
  await connectMongoose();

  const { id } = params;

  // Get employee details
  const employee = await Employee.findById(id).lean();
  if (!employee) {
    redirect("/admin/employees");
  }

  // Get employee's tasks
  const tasks = await Task.find({ assignedTo: employee._id })
    .populate("project", "name type status")
    .populate("section", "name color icon")
    .sort({ dueDate: 1, priority: -1 })
    .lean();

  // Convert to plain objects
  const employeeData = {
    ...employee,
    id: employee._id.toString(),
    _id: undefined,
  };

  const tasksData = tasks.map((task) => ({
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

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          {employeeData.name}
        </h1>
        <p className="text-gray-600">
          Employee Details • {employeeData.position}
        </p>
      </div>

      <EmployeeDetailClient employee={employeeData} tasks={tasksData} />
    </div>
  );
}
