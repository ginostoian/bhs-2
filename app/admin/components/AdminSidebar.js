"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

/**
 * Admin Sidebar Component
 * Provides navigation for admin sections with collapsible functionality
 */
export default function AdminSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);

  // Navigation items configuration
  const navItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: "🏠" },
    { name: "Users", href: "/admin", icon: "👥" },
    { name: "CRM", href: "/admin/crm", icon: "📈" },
    { name: "Projects", href: "/admin/projects", icon: "🏗️" },
    { name: "Finished Projects", href: "/admin/finished-projects", icon: "✅" },
    { name: "Employees", href: "/admin/employees", icon: "👷" },
    {
      name: "Task Status Updates",
      href: "/admin/task-status-updates",
      icon: "⏳",
    },
    { name: "Moodboards", href: "/admin/moodboards", icon: "🎨" },
    { name: "Product Database", href: "/admin/products", icon: "📦" },
    { name: "Contractor Database", href: "/admin/contractors", icon: "🧰" },
    { name: "Partners Database", href: "/admin/partners", icon: "🤝" },
    { name: "Instructions", href: "/admin/instructions", icon: "📋" },
    { name: "Payments", href: "/admin/payments", icon: "💳" },
    { name: "Tickets", href: "/admin/tickets", icon: "🎫" },
    { name: "Add Document", href: "/admin/add-document", icon: "📄" },
    { name: "Files", href: "/admin/files", icon: "📁" },
    {
      name: "Contact Submissions",
      href: "/admin/contact-submissions",
      icon: "📧",
    },
    {
      name: "Bathroom Renovations",
      href: "/admin/bathroom-renovations",
      icon: "🚿",
    },
    {
      name: "Notification Management",
      href: "/admin/notification-management",
      icon: "🔔",
    },
    { name: "Notifications", href: "/admin/notifications", icon: "🔔" },
    {
      name: "Test Notifications",
      href: "/admin/test-notifications",
      icon: "🧪",
    },
    { name: "Email Analytics", href: "/admin/email-analytics", icon: "📊" },
    { name: "Email Automation", href: "/admin/email-automation", icon: "🤖" },
  ];

  return (
    <div className="relative">
      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-4 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <svg
          className={`h-4 w-4 transition-transform ${
            isCollapsed ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      {/* Sidebar */}
      <nav
        className={`rounded-lg bg-white p-4 shadow transition-all duration-300 ease-in-out ${
          isCollapsed ? "w-16" : "w-64"
        }`}
      >
        <div className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <div key={item.name} className="relative">
                <Link
                  href={item.href}
                  className={`flex items-center space-x-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  } ${isCollapsed ? "justify-center space-x-0" : ""}`}
                  onMouseEnter={() => isCollapsed && setHoveredItem(item.name)}
                  onMouseLeave={() => isCollapsed && setHoveredItem(null)}
                >
                  <span className="text-lg">{item.icon}</span>
                  {!isCollapsed && <span>{item.name}</span>}
                </Link>

                {/* Tooltip for collapsed state */}
                {isCollapsed && hoveredItem === item.name && (
                  <div className="absolute left-full top-1/2 z-50 ml-2 -translate-y-1/2 rounded-md bg-gray-900 px-2 py-1 text-xs text-white shadow-lg">
                    {item.name}
                    {/* Tooltip arrow */}
                    <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
