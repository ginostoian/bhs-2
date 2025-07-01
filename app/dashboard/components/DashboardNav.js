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
    { name: "Invoices", href: "/dashboard/invoices", icon: "💰" },
    { name: "Comments", href: "/dashboard/comments", icon: "💬" },
    { name: "Photos", href: "/dashboard/photos", icon: "📸" },
    { name: "Request Quote", href: "/dashboard/request-quote", icon: "➕" },
  ];

  return (
    <nav className="flex space-x-8">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href;

        return (
          <Link
            key={tab.name}
            href={tab.href}
            className={`flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
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
  );
}
