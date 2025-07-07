import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import { redirect } from "next/navigation";
import connectMongoose from "@/libs/mongoose";
import Employee from "@/models/Employee";
import User from "@/models/User";
import EmployeeSidebar from "./components/EmployeeSidebar";
import NotificationBell from "./components/NotificationBell";
import SignOutButton from "../dashboard/components/SignOutButton";

/**
 * Employee Dashboard Layout
 * Provides navigation and restricts access to employees only
 */
export default async function EmployeeLayout({ children }) {
  // Check authentication and employee access
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/signin");
  }

  if (session.user.role !== "employee") {
    redirect("/dashboard");
  }

  // Connect to MongoDB
  await connectMongoose();

  // Check if Employee record exists, create if missing
  let employee = await Employee.findOne({ email: session.user.email });
  if (!employee) {
    // Employee record doesn't exist, create one from User data
    const user = await User.findOne({ email: session.user.email });
    if (user) {
      try {
        employee = await Employee.create({
          name: user.name || "Employee",
          email: user.email,
          image: user.image,
          phone: user.phone,
          position: "Employee", // Default position
          skills: [],
          isActive: true,
          availability: "available",
          notes: "Auto-created from user conversion",
        });
      } catch (error) {
        console.error("Error creating employee record:", error);
        redirect("/dashboard");
      }
    } else {
      redirect("/dashboard");
    }
  }

  return (
    <div className="mx-auto min-h-screen max-w-[85%] pb-10 pt-10">
      {/* Header */}
      <div className="mb-6 rounded-2xl bg-white p-6 shadow">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Employee Dashboard
            </h1>
            <p className="text-gray-600">Manage your tasks and projects</p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              Employee: {session.user.name || session.user.email}
            </span>
            <NotificationBell />
            <SignOutButton />
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 flex-shrink-0">
          <EmployeeSidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <main className="p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
