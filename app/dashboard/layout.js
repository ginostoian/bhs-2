import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import { redirect } from "next/navigation";
import DashboardNav from "./components/DashboardNav";
import SignOutButton from "./components/SignOutButton";

/**
 * Dashboard Layout
 * Provides navigation and authentication check for dashboard pages
 */
export default async function DashboardLayout({ children }) {
  // Check authentication
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">
                Welcome back, {session.user.name || session.user.email}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                Role: {session.user.role}
              </span>
              <SignOutButton />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation and Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <DashboardNav />
        <main className="mt-8">{children}</main>
      </div>
    </div>
  );
}
