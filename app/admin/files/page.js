import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import { redirect } from "next/navigation";
import FileManagerClient from "./components/FileManagerClient";

/**
 * Admin Files Management Page
 * Allows admins to view, manage, and delete files uploaded by users
 */
export default async function AdminFilesPage() {
  // Check authentication and admin access
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  if (session.user.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">File Management</h1>
        <p className="mt-2 text-gray-600">
          Manage files uploaded by users across the platform
        </p>
      </div>

      <FileManagerClient />
    </div>
  );
}
