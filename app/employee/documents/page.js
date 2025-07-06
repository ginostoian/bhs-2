import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import { redirect } from "next/navigation";
import connectMongoose from "@/libs/mongoose";
import Task from "@/models/Task";
import Document from "@/models/Document";
import Employee from "@/models/Employee";
import EmployeeDocumentsClient from "./components/EmployeeDocumentsClient";

/**
 * Employee Documents Page
 * Shows documents from projects the employee has tasks assigned to
 */
export default async function EmployeeDocumentsPage() {
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

  // Get employee's tasks to find associated projects
  const tasks = await Task.find({ assignedTo: employee._id })
    .populate("project", "user")
    .lean();

  // Get unique user IDs from projects
  const userIds = [
    ...new Set(tasks.map((task) => task.project?.user).filter(Boolean)),
  ];

  // Get documents from those users (excluding price information)
  const documents = await Document.find({ user: { $in: userIds } })
    .lean()
    .then((docs) => {
      return docs.map((doc) => {
        // Remove price information from quotes and invoices
        if (doc.type === "quote" || doc.type === "invoice") {
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
    });

  // Convert to plain objects
  const documentsData = documents.map((doc) => ({
    ...doc,
    id: doc._id.toString(),
    _id: undefined,
    user: doc.user ? doc.user.toString() : null,
  }));

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
        <p className="text-gray-600">
          View documents from projects you have tasks assigned to.
        </p>
      </div>

      <EmployeeDocumentsClient documents={documentsData} />
    </div>
  );
}
