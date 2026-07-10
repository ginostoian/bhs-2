import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import { redirect } from "next/navigation";
import SignOutButton from "../dashboard/components/SignOutButton";
import NotificationBell from "./components/NotificationBell";
import AdminUtilitiesDropdown from "./components/AdminUtilitiesDropdown";
import SessionProvider from "./components/SessionProvider";
import PortalShell from "@/components/portal/PortalShell";

const adminNavigation = [
  {
    name: "",
    items: [{ name: "Overview", href: "/admin/dashboard", icon: "dashboard" }],
  },
  {
    name: "Management",
    defaultOpen: true,
    items: [
      { name: "Users", href: "/admin/users", icon: "users" },
      { name: "CRM", href: "/admin/crm", icon: "crm" },
      { name: "Calendar", href: "/admin/calendar", icon: "calendar" },
      { name: "Tickets", href: "/admin/tickets", icon: "tickets" },
    ],
  },
  {
    name: "Projects",
    defaultOpen: true,
    items: [
      { name: "Projects", href: "/admin/projects", icon: "projects" },
      {
        name: "Finished projects",
        href: "/admin/finished-projects",
        icon: "archive",
      },
      { name: "Moodboards", href: "/admin/moodboards", icon: "moodboards" },
    ],
  },
  {
    name: "Team",
    items: [
      { name: "Employees", href: "/admin/employees", icon: "employees" },
      { name: "Workers", href: "/admin/workers", icon: "workers" },
    ],
  },
  {
    name: "Finance",
    items: [
      { name: "Payments", href: "/admin/payments", icon: "payments" },
      { name: "Invoicing", href: "/admin/invoicing", icon: "invoices" },
    ],
  },
  {
    name: "Pricing & quotes",
    items: [
      { name: "Quoting", href: "/admin/quoting", icon: "quotes", exact: true },
      { name: "Create quote", href: "/admin/quoting/create", icon: "quote" },
      { name: "Rate cards", href: "/admin/quoting/rates", icon: "database" },
      {
        name: "Template services",
        href: "/admin/quoting/template-services",
        icon: "documents",
      },
      {
        name: "Quote templates",
        href: "/admin/quoting/templates",
        icon: "documents",
      },
      {
        name: "Renovation calculator rates",
        href: "/admin/renovation-calculator-rates",
        icon: "database",
      },
      {
        name: "Extension calculator rates",
        href: "/admin/extension-calculator-rates",
        icon: "database",
      },
      {
        name: "Quote history",
        href: "/admin/quoting/history",
        icon: "archive",
      },
    ],
  },
  {
    name: "Attendance & tasks",
    items: [
      { name: "Attendance", href: "/admin/attendance", icon: "attendance" },
      {
        name: "Attendance reports",
        href: "/admin/reports/attendance",
        icon: "crm",
      },
      {
        name: "Task status updates",
        href: "/admin/task-status-updates",
        icon: "tasks",
      },
    ],
  },
  {
    name: "Databases",
    items: [
      { name: "Products", href: "/admin/products", icon: "products" },
      { name: "Contractors", href: "/admin/contractors", icon: "contractors" },
      { name: "Partners", href: "/admin/partners", icon: "users" },
    ],
  },
  {
    name: "Content & files",
    items: [
      {
        name: "Instructions",
        href: "/admin/instructions",
        icon: "instructions",
      },
      { name: "Add document", href: "/admin/add-document", icon: "quote" },
      { name: "Files", href: "/admin/files", icon: "files" },
      {
        name: "Message templates",
        href: "/admin/template-messages",
        icon: "documents",
      },
    ],
  },
  {
    name: "Forms",
    items: [
      {
        name: "Contact submissions",
        href: "/admin/contact-submissions",
        icon: "forms",
      },
      {
        name: "Bathroom renovations",
        href: "/admin/bathroom-renovations",
        icon: "forms",
      },
      {
        name: "Kitchen renovations",
        href: "/admin/kitchen-renovations",
        icon: "forms",
      },
      {
        name: "Kitchen calculator leads",
        href: "/admin/kitchen-calculator-leads",
        icon: "crm",
      },
      {
        name: "General renovations",
        href: "/admin/general-renovations",
        icon: "forms",
      },
      {
        name: "Extension calculator leads",
        href: "/admin/extension-calculator-leads",
        icon: "crm",
      },
      {
        name: "Renovation calculator leads",
        href: "/admin/renovation-calculator-leads",
        icon: "crm",
      },
    ],
  },
  {
    name: "Communications",
    items: [
      {
        name: "Notification management",
        href: "/admin/notification-management",
        icon: "notifications",
      },
      {
        name: "Notifications",
        href: "/admin/notifications",
        icon: "notifications",
      },
      {
        name: "Test notifications",
        href: "/admin/test-notifications",
        icon: "notifications",
      },
      { name: "Email analytics", href: "/admin/email-analytics", icon: "crm" },
      {
        name: "Email automation",
        href: "/admin/email-automation",
        icon: "email",
      },
    ],
  },
];

/**
 * Admin Layout
 * Provides sidebar navigation and admin role verification
 */
export default async function AdminLayout({ children }) {
  // Check authentication and admin role
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  if (session.user.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <SessionProvider session={session}>
      <PortalShell
        navGroups={adminNavigation}
        user={session.user}
        workspaceLabel="Admin workspace"
        headerActions={
          <>
            <AdminUtilitiesDropdown />
            <NotificationBell />
            <SignOutButton compact />
          </>
        }
      >
        {children}
      </PortalShell>
    </SessionProvider>
  );
}
