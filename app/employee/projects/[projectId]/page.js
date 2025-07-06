import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import { redirect } from "next/navigation";
import connectMongoose from "@/libs/mongoose";
import Task from "@/models/Task";
import Project from "@/models/Project";
import Employee from "@/models/Employee";
import TaskSection from "@/models/TaskSection";
import Document from "@/models/Document";
import EmployeeProjectClient from "./components/EmployeeProjectClient";

/**
 * Employee Individual Project Page
 * Shows project details and tasks assigned to the employee
 */
export default async function EmployeeProjectPage({ params }) {
  // Check authentication and employee access
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/api/auth/signin");
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

  const { projectId } = params;

  // Get project details
  const project = await Project.findById(projectId)
    .populate("user", "name email")
    .lean();

  if (!project) {
    redirect("/employee/projects");
  }

  // Check if employee has tasks in this project
  const employeeTasks = await Task.find({
    project: projectId,
    assignedTo: employee._id,
  }).lean();

  if (employeeTasks.length === 0) {
    redirect("/employee/projects");
  }

  // Get all sections for this project
  const sections = await TaskSection.find({ project: projectId })
    .sort({ order: 1 })
    .lean();

  // Get all tasks for this project (employee can see all tasks but only update their own)
  const allTasks = await Task.find({ project: projectId })
    .populate("assignedTo", "name position")
    .populate("section", "name color icon")
    .sort({ "section.order": 1, order: 1 })
    .lean();

  // Get project documents (excluding price information)
  const documents = await Document.find({ user: project.user._id }).lean();

  // Filter out price-sensitive documents for employees
  const filteredDocuments = documents.filter((doc) => {
    if (doc.type === "quote" || doc.type === "invoice") {
      // Remove price information from quotes and invoices
      const content = doc.content;
      if (typeof content === "object" && content.total) {
        return {
          ...doc,
          content: {
            ...content,
            total: "***",
            breakdown: content.breakdown ? "***" : undefined,
          },
        };
      }
    }
    return doc;
  });

  // Convert to plain objects
  const projectData = {
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
  };

  const sectionsData = sections.map((section) => ({
    ...section,
    id: section._id.toString(),
    _id: undefined,
  }));

  const tasksData = allTasks.map((task) => ({
    ...task,
    id: task._id.toString(),
    _id: undefined,
    project: task.project ? task.project.toString() : null,
    section: task.section
      ? {
          ...task.section,
          id: task.section._id.toString(),
          _id: undefined,
        }
      : null,
    assignedTo: task.assignedTo
      ? {
          ...task.assignedTo,
          id: task.assignedTo._id.toString(),
          _id: undefined,
        }
      : null,
  }));

  const documentsData = filteredDocuments.map((doc) => ({
    ...doc,
    id: doc._id.toString(),
    _id: undefined,
    user: doc.user ? doc.user.toString() : null,
  }));

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{projectData.name}</h1>
        <p className="text-gray-600">
          {projectData.type} • {projectData.location}
        </p>
      </div>

      <EmployeeProjectClient
        project={projectData}
        sections={sectionsData}
        tasks={tasksData}
        documents={documentsData}
        employee={employee}
      />
    </div>
  );
}
