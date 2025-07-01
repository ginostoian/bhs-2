"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Admin Sidebar Component
 * Provides navigation for admin sections
 */
export default function AdminSidebar() {
  const pathname = usePathname();

  // Navigation items configuration
  const navItems = [
    { name: "Users", href: "/admin", icon: "👥" },
    { name: "Comments", href: "/admin/comments", icon: "💬" },
    { name: "Add Document", href: "/admin/add-document", icon: "📄" },
  ];

  return (
    <nav className="rounded-lg bg-white p-4 shadow">
      <div className="space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center space-x-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-blue-100 text-blue-700"
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
  );
}
