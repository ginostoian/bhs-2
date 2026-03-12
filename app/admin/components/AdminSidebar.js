"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

/**
 * Admin Sidebar Component
 * Provides navigation for admin sections with collapsible functionality and grouped navigation
 */
export default function AdminSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [expandedGroups, setExpandedGroups] = useState(
    new Set(["core", "projects"]),
  ); // Default expanded groups

  // Navigation groups configuration
  const navGroups = [
    {
      id: "core",
      name: "Management",
      icon: "⚙️",
      items: [
        { name: "Dashboard", href: "/admin/dashboard", icon: "🏠" },
        { name: "Users", href: "/admin/users", icon: "👥" },
        { name: "CRM", href: "/admin/crm", icon: "📈" },
        { name: "Calendar", href: "/admin/calendar", icon: "📅" },
        { name: "Tickets", href: "/admin/tickets", icon: "🎫" },
      ],
    },
    {
      id: "projects",
      name: "Projects",
      icon: "🏗️",
      items: [
        { name: "Projects", href: "/admin/projects", icon: "🏗️" },
        {
          name: "Finished Projects",
          href: "/admin/finished-projects",
          icon: "✅",
        },
        { name: "Moodboards", href: "/admin/moodboards", icon: "🎨" },
      ],
    },
    {
      id: "personnel",
      name: "Personnel",
      icon: "👥",
      items: [
        { name: "Employees", href: "/admin/employees", icon: "👷" },
        { name: "Workers", href: "/admin/workers", icon: "🧑‍🔧" },
      ],
    },
    {
      id: "financial",
      name: "Financial",
      icon: "💰",
      items: [
        { name: "Payments", href: "/admin/payments", icon: "💳" },
        { name: "Invoicing", href: "/admin/invoicing", icon: "📄" },
      ],
    },
    {
      id: "quoting",
      name: "Pricing & Quotes",
      icon: "📋",
      items: [
        { name: "Quoting Dashboard", href: "/admin/quoting", icon: "📊" },
        { name: "Create Quote", href: "/admin/quoting/create", icon: "➕" },
        {
          name: "Rate Cards",
          href: "/admin/quoting/rates",
          icon: "🧮",
          current: pathname === "/admin/quoting/rates",
        },
        {
          name: "Template Services",
          href: "/admin/quoting/template-services",
          icon: "📄",
          current: pathname === "/admin/quoting/template-services",
        },
        {
          name: "Quote Templates",
          href: "/admin/quoting/templates",
          icon: "📄",
          current: pathname === "/admin/quoting/templates",
        },
        { name: "Quote History", href: "/admin/quoting/history", icon: "📚" },
      ],
    },
    {
      id: "attendance",
      name: "Attendance & Tasks",
      icon: "📊",
      items: [
        { name: "Attendance", href: "/admin/attendance", icon: "🗓️" },
        {
          name: "Attendance Reports",
          href: "/admin/reports/attendance",
          icon: "📈",
        },
        {
          name: "Task Status Updates",
          href: "/admin/task-status-updates",
          icon: "⏳",
        },
      ],
    },
    {
      id: "database",
      name: "Database",
      icon: "🗄️",
      items: [
        { name: "Product Database", href: "/admin/products", icon: "📦" },
        { name: "Contractor Database", href: "/admin/contractors", icon: "🧰" },
        { name: "Partners Database", href: "/admin/partners", icon: "🤝" },
      ],
    },
    {
      id: "content",
      name: "Content & Files",
      icon: "📁",
      items: [
        { name: "Instructions", href: "/admin/instructions", icon: "📋" },
        { name: "Add Document", href: "/admin/add-document", icon: "📄" },
        { name: "Files", href: "/admin/files", icon: "📁" },
        {
          name: "Template Messages",
          href: "/admin/template-messages",
          icon: "📝",
        },
      ],
    },
    {
      id: "forms",
      name: "Forms",
      icon: "📧",
      items: [
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
          name: "Kitchen Renovations",
          href: "/admin/kitchen-renovations",
          icon: "🍳",
        },
        {
          name: "General Renovations",
          href: "/admin/general-renovations",
          icon: "🏠",
        },
        {
          name: "Extension Calculator Leads",
          href: "/admin/extension-calculator-leads",
          icon: "🧮",
        },
        {
          name: "Renovation Calculator Leads",
          href: "/admin/renovation-calculator-leads",
          icon: "🏚️",
        },
      ],
    },
    {
      id: "notifications",
      name: "Notifications",
      icon: "🔔",
      items: [
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
      ],
    },
    {
      id: "email",
      name: "Email & Analytics",
      icon: "📊",
      items: [
        { name: "Email Analytics", href: "/admin/email-analytics", icon: "📊" },
        {
          name: "Email Automation",
          href: "/admin/email-automation",
          icon: "🤖",
        },
      ],
    },
  ];

  const toggleGroup = (groupId) => {
    const newExpandedGroups = new Set(expandedGroups);
    if (newExpandedGroups.has(groupId)) {
      newExpandedGroups.delete(groupId);
    } else {
      newExpandedGroups.add(groupId);
    }
    setExpandedGroups(newExpandedGroups);
  };

  const isGroupExpanded = (groupId) => expandedGroups.has(groupId);

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
          {navGroups.map((group) => (
            <div key={group.id} className="space-y-1">
              {/* Group Header */}
              <button
                onClick={() => toggleGroup(group.id)}
                className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-semibold transition-colors ${
                  isCollapsed ? "justify-center" : ""
                } ${
                  isGroupExpanded(group.id)
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
                title={isCollapsed ? group.name : ""}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{group.icon}</span>
                  {!isCollapsed && <span>{group.name}</span>}
                </div>
                {!isCollapsed && (
                  <svg
                    className={`h-4 w-4 transition-transform ${
                      isGroupExpanded(group.id) ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                )}
              </button>

              {/* Group Items */}
              {isGroupExpanded(group.id) && (
                <div className="ml-4 space-y-1">
                  {group.items.map((item) => {
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
                          onMouseEnter={() =>
                            isCollapsed && setHoveredItem(item.name)
                          }
                          onMouseLeave={() =>
                            isCollapsed && setHoveredItem(null)
                          }
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
              )}
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
}
