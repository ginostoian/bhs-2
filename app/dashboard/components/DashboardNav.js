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
    { name: "Quotes", href: "/dashboard", icon: "📋" },
    { name: "Moodboards", href: "/dashboard/moodboards", icon: "🎨" },
    { name: "Invoices", href: "/dashboard/invoices", icon: "💰" },
    { name: "Payments", href: "/dashboard/payments", icon: "💳" },
    { name: "Instructions", href: "/dashboard/instructions", icon: "📋" },
    { name: "Photos", href: "/dashboard/photos", icon: "📸" },
    { name: "Request Quote", href: "/dashboard/request-quote", icon: "➕" },
    {
      name: "Email Preferences",
      href: "/dashboard/email-preferences",
      icon: "✉️",
    },
  ];

  return (
    <div className="overflow-x-auto">
      <nav className="flex min-w-max space-x-8 pb-2">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;

          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={`flex items-center space-x-2 whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "border-b-2 border-blue-700 bg-blue-100 text-blue-700"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              } `}
            >
              <span>{tab.icon}</span>
              <span>{tab.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
