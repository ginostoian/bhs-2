import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import { redirect } from "next/navigation";
import DashboardNav from "./components/DashboardNav";
import SignOutButton from "./components/SignOutButton";
import ProfileImage from "./components/ProfileImage";
import NotificationBell from "./components/NotificationBell";
import { ProjectProvider } from "./components/ProjectContext";
import ProjectSelector from "./components/ProjectSelector";

/**
 * Dashboard Layout
 * Provides navigation and authentication check for dashboard pages
 */
export default async function DashboardLayout({ children }) {
  // Check authentication
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <ProjectProvider>
      <div className="min-h-screen">
        {/* Header */}
        <div className="mx-auto mt-10 max-w-[85%] rounded-lg bg-white shadow-sm ring-1 ring-gray-200">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-8">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                  Dashboard
                </h1>
                <p className="mt-1 text-lg text-gray-600">
                  Welcome back, {session.user.name || session.user.email}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                {/* Project Selector */}
                <ProjectSelector />

                {/* Notification Bell */}
                <NotificationBell
                  userProjectStatus={session.user.projectStatus}
                />

                {/* Profile Image */}
                <ProfileImage user={session.user} />

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
    </ProjectProvider>
  );
}
