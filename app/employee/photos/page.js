import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import { redirect } from "next/navigation";
import connectMongoose from "@/libs/mongoose";
import Task from "@/models/Task";
import Document from "@/models/Document";
import Employee from "@/models/Employee";
import EmployeePhotosClient from "./components/EmployeePhotosClient";

/**
 * Employee Photos Page
 * Shows photos from projects the employee has tasks assigned to
 */
export default async function EmployeePhotosPage() {
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

  // Get photos from those users
  const photos = await Document.find({
    user: { $in: userIds },
    type: "photo",
  }).lean();

  // Convert to plain objects
  const photosData = photos.map((photo) => ({
    ...photo,
    id: photo._id.toString(),
    _id: undefined,
    user: photo.user ? photo.user.toString() : null,
  }));

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Photos</h1>
        <p className="text-gray-600">
          View photos from projects you have tasks assigned to.
        </p>
      </div>

      <EmployeePhotosClient photos={photosData} />
    </div>
  );
}
