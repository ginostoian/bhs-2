import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongoose from "@/libs/mongoose";
import Project from "@/models/Project";
import User from "@/models/User";
import Document from "@/models/Document";
import Payment from "@/models/Payment";
import { notFound } from "next/navigation";
import ProjectDetailClient from "./components/ProjectDetailClient";

/**
 * Individual Project Detail Page
 * Displays project information with tabs for different views
 */
export default async function ProjectDetailPage({ params, searchParams }) {
  // Get admin session
  const session = await getServerSession(authOptions);

  // Connect to MongoDB
  await connectMongoose();

  // Get project ID from params
  const { projectId } = params;
  const activeTab = searchParams.tab || "overview";

  // Fetch project with populated data
  const project = await Project.findById(projectId)
    .populate("user", "name email projectStatus")
    .populate("projectManager", "name position email")
    .lean();

  if (!project) {
    notFound();
  }

  // Fetch user's documents
  const documents = await Document.find({ user: project.user._id })
    .sort({ createdAt: -1 })
    .lean();

  // Group documents by type
  const documentsByType = documents.reduce((acc, doc) => {
    if (!acc[doc.type]) {
      acc[doc.type] = [];
    }
    acc[doc.type].push({
      id: doc._id.toString(),
      type: doc.type,
      content: doc.content,
      status: doc.status,
      createdAt: doc.createdAt,
    });
    return acc;
  }, {});

  // Fetch user's payments
  const payments = await Payment.find({ user: project.user._id })
    .sort({ order: 1 })
    .lean()
    .then((docs) =>
      docs.map((doc) => ({
        id: doc._id.toString(),
        user: doc.user.toString(),
        name: doc.name,
        dueDate: doc.dueDate,
        amount: doc.amount,
        status: doc.status,
        order: doc.order,
        paymentNumber: doc.paymentNumber,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
        statusChangeEmailSent: doc.statusChangeEmailSent,
      })),
    );

  // Convert project to plain object
  const projectData = {
    id: project._id.toString(),
    name: project.name,
    description: project.description,
    type: project.type,
    status: project.status,
    priority: project.priority,
    progress: project.progress,
    startDate: project.startDate,
    projectedFinishDate: project.projectedFinishDate,
    completionDate: project.completionDate,
    location: project.location,
    budget: project.budget,
    notes: project.notes,
    tags: project.tags,
    projectManager: project.projectManager
      ? {
          id: project.projectManager._id.toString(),
          name: project.projectManager.name,
          position: project.projectManager.position,
          email: project.projectManager.email,
        }
      : null,
    user: {
      id: project.user._id.toString(),
      name: project.user.name,
      email: project.user.email,
      projectStatus: project.user.projectStatus,
    },
    tasksCount: project.tasksCount || 0,
    completedTasksCount: project.completedTasksCount || 0,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ProjectDetailClient
        project={projectData}
        documentsByType={documentsByType}
        payments={payments}
        activeTab={activeTab}
      />
    </div>
  );
}
