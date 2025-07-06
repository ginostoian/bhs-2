"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

/**
 * Employee Sidebar Component
 * Provides navigation for employee sections
 */
export default function EmployeeSidebar() {
  const pathname = usePathname();

  // Navigation items configuration
  const navItems = [
    { name: "Dashboard", href: "/employee", icon: "🏠" },
    { name: "My Projects", href: "/employee/projects", icon: "🏗️" },
    { name: "My Tasks", href: "/employee/tasks", icon: "📋" },
    { name: "Documents", href: "/employee/documents", icon: "📄" },
    { name: "Photos", href: "/employee/photos", icon: "📸" },
  ];

  return (
    <div className="h-screen bg-white shadow-lg">
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500 text-sm font-medium text-white">
            👷
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">
              Employee Portal
            </h1>
            <p className="text-sm text-gray-500">Task Management</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4">
        <div className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-green-100 text-green-700"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                } `}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 w-64 border-t border-gray-200 p-4">
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex w-full items-center space-x-3 rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        >
          <span className="text-lg">🚪</span>
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}
