import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import { redirect } from "next/navigation";
import AdminSidebar from "./components/AdminSidebar";
import SignOutButton from "../dashboard/components/SignOutButton";
import NotificationBell from "./components/NotificationBell";
import AdminUtilitiesDropdown from "./components/AdminUtilitiesDropdown";
import SessionProvider from "./components/SessionProvider";

/**
 * Admin Layout
 * Provides sidebar navigation and admin role verification
 */
export default async function AdminLayout({ children }) {
  // Check authentication and admin role
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  if (session.user.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <SessionProvider session={session}>
      <div className="min-h-screen pt-6">
        {/* Header */}
        <div className="mx-auto max-w-[85%] rounded-2xl bg-white shadow">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                  Admin Dashboard
                </h1>
                <p className="text-gray-600">Manage users and documents</p>
              </div>
              <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:space-x-4">
                <span className="text-sm text-gray-500">
                  Admin: {session.user.name || session.user.email}
                </span>
                <AdminUtilitiesDropdown />
                <NotificationBell />
                <SignOutButton />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="mx-auto max-w-[85%] px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8 lg:flex-row">
            {/* Sidebar */}
            <div className="lg:flex-shrink-0">
              <AdminSidebar />
            </div>

            {/* Main Content */}
            <div className="flex-1">{children}</div>
          </div>
        </div>
      </div>
    </SessionProvider>
  );
}
