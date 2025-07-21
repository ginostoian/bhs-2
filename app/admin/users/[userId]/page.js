import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongoose from "@/libs/mongoose";
import User from "@/models/User";
import Document from "@/models/Document";
import Payment from "@/models/Payment";
import Project from "@/models/Project";
import Moodboard from "@/models/Moodboard";
import UserDetailClient from "./components/UserDetailClient";

/**
 * User Detail Page
 * Shows all documents for a specific user with management capabilities
 */
export default async function AdminUserDetailPage({ params }) {
  const session = await getServerSession(authOptions);
  await connectMongoose();
  const user = await User.findById(params.userId).lean();
  if (!user) return <div className="p-8">User not found.</div>;

  // Convert user to plain object
  const userData = {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: user.address,
    source: user.source,
    leftReview: user.leftReview,
    role: user.role,
    projectStatus: user.projectStatus,
    image: user.image,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    emailVerified: user.emailVerified,
  };

  // Fetch all documents for this user
  let documents = [];
  try {
    documents = await Document.find({ user: params.userId })
      .sort({ createdAt: -1 })
      .populate("user", "name email")
      .lean()
      .then((docs) =>
        docs.map((doc) => ({
          id: doc._id.toString(),
          type: doc.type,
          content: doc.content,
          status: doc.status,
          createdAt: doc.createdAt,
          updatedAt: doc.updatedAt,
          user: doc.user
            ? {
                id: doc.user._id.toString(),
                name: doc.user.name,
                email: doc.user.email,
              }
            : null,
        })),
      );
  } catch (error) {
    console.error("Error fetching documents:", error);
    documents = [];
  }

  // Fetch all payments for this user
  let payments = [];
  try {
    payments = await Payment.find({ user: params.userId })
      .sort({ order: 1 })
      .populate("user", "name email")
      .lean()
      .then((docs) =>
        docs.map((doc) => ({
          id: doc._id.toString(),
          name: doc.name,
          amount: doc.amount,
          dueDate: doc.dueDate,
          status: doc.status,
          paymentNumber: doc.order,
          order: doc.order,
          user: doc.user
            ? {
                id: doc.user._id.toString(),
                name: doc.user.name,
                email: doc.user.email,
              }
            : null,
        })),
      );
  } catch (error) {
    console.error("Error fetching payments:", error);
    payments = [];
  }

  // Fetch all projects for this user
  let projects = [];
  try {
    projects = await Project.find({ user: params.userId })
      .sort({ createdAt: -1 })
      .populate("user", "name email")
      .populate("projectManager", "name position")
      .lean()
      .then((docs) =>
        docs.map((doc) => ({
          id: doc._id.toString(),
          name: doc.name,
          description: doc.description,
          type: doc.type,
          status: doc.status,
          startDate: doc.startDate,
          completionDate: doc.completionDate,
          location: doc.location,
          budget: doc.budget,
          priority: doc.priority,
          progress: doc.progress,
          projectedFinishDate: doc.projectedFinishDate,
          createdAt: doc.createdAt,
          updatedAt: doc.updatedAt,
          user: doc.user
            ? {
                id: doc.user._id.toString(),
                name: doc.user.name,
                email: doc.user.email,
              }
            : null,
          projectManager: doc.projectManager
            ? {
                id: doc.projectManager._id.toString(),
                name: doc.projectManager.name,
                position: doc.projectManager.position,
              }
            : null,
        })),
      );
  } catch (error) {
    console.error("Error fetching projects:", error);
    projects = [];
  }

  // Fetch all moodboards for this user
  let moodboards = [];
  try {
    moodboards = await Moodboard.find({ user: params.userId })
      .sort({ createdAt: -1 })
      .populate("user", "name email")
      .lean()
      .then((docs) =>
        docs.map((doc) => ({
          id: doc._id.toString(),
          name: doc.name,
          description: doc.description,
          isActive: doc.isActive,
          status: doc.status,
          projectType: doc.projectType,
          notes: doc.notes,
          createdAt: doc.createdAt,
          updatedAt: doc.updatedAt,
          user: doc.user
            ? {
                id: doc.user._id.toString(),
                name: doc.user.name,
                email: doc.user.email,
              }
            : null,
        })),
      );
  } catch (error) {
    console.error("Error fetching moodboards:", error);
    moodboards = [];
  }

  // Group documents by type
  const documentsByType = {
    photo: documents.filter((doc) => doc.type === "photo") || [],
    comment: documents.filter((doc) => doc.type === "comment") || [],
    quote: documents.filter((doc) => doc.type === "quote") || [],
    invoice: documents.filter((doc) => doc.type === "invoice") || [],
  };

  return (
    <UserDetailClient
      user={userData}
      documentsByType={documentsByType}
      payments={payments}
      projects={projects}
      moodboards={moodboards}
    />
  );
}
