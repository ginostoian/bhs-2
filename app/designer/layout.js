import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import { redirect } from "next/navigation";
import DesignerSidebar from "./components/DesignerSidebar";
import SignOutButton from "../dashboard/components/SignOutButton";
import SessionProvider from "./components/SessionProvider";

/**
 * Designer Layout
 * Provides sidebar navigation and designer role verification
 */
export default async function DesignerLayout({ children }) {
  // Check authentication and designer role
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  if (session.user.role !== "designer") {
    redirect("/dashboard");
  }

  return (
    <SessionProvider session={session}>
      <div className="mx-auto mt-10 min-h-screen max-w-[85%] bg-gray-50">
        <div className="flex">
          {/* Sidebar */}
          <DesignerSidebar />

          {/* Main Content */}
          <div className="flex flex-1 flex-col">
            {/* Header */}
            <header className="border-b border-gray-200 bg-white shadow-sm">
              <div className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-xl font-semibold text-gray-900">
                      Designer Dashboard
                    </h1>
                    <p className="text-sm text-gray-600">
                      Welcome back, {session.user.name || session.user.email}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <SignOutButton />
                  </div>
                </div>
              </div>
            </header>

            {/* Page Content */}
            <main className="flex-1 p-6">{children}</main>
          </div>
        </div>
      </div>
    </SessionProvider>
  );
}
