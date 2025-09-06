"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Dashboard Navigation Component
 * Provides tab navigation for different dashboard sections
 */
export default function DashboardNav() {
  const pathname = usePathname();

  // Navigation tabs configuration
  const tabs = [
    { name: "Old Quotes", href: "/dashboard", icon: "📋" },
    { name: "Quotes", href: "/dashboard/quotes", icon: "📄" },
    { name: "Moodboards", href: "/dashboard/moodboards", icon: "🎨" },
    { name: "Invoices", href: "/dashboard/invoices", icon: "💰" },
    { name: "Payments", href: "/dashboard/payments", icon: "💳" },
    { name: "Changes", href: "/dashboard/changes", icon: "🔄" },
    { name: "Instructions", href: "/dashboard/instructions", icon: "📋" },
    { name: "Photos", href: "/dashboard/photos", icon: "📸" },
    { name: "Tickets", href: "/dashboard/tickets", icon: "🎫" },
    { name: "Request Quote", href: "/dashboard/request-quote", icon: "➕" },
    {
      name: "Email Preferences",
      href: "/dashboard/email-preferences",
      icon: "✉️",
    },
  ];

  return (
    <div className="overflow-x-auto">
      <nav className="flex min-w-max space-x-2 pb-2">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;

          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={`flex items-center space-x-2 whitespace-nowrap rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-600/25"
                  : "text-gray-600 hover:bg-white hover:text-gray-900 hover:shadow-md"
              } `}
            >
              <span className="text-base">{tab.icon}</span>
              <span>{tab.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
