export const metadata = { robots: { index: false, follow: false } };
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import { redirect } from "next/navigation";
import ProfileImage from "./components/ProfileImage";
import NotificationBell from "./components/NotificationBell";
import { ProjectProvider } from "./components/ProjectContext";
import ProjectSelector from "./components/ProjectSelector";
import ClientPortalShell from "@/components/client-portal/ClientPortalShell";

const clientNavigation = [
  {
    name: "",
    items: [
      { name: "Overview", href: "/dashboard", icon: "dashboard", exact: true },
    ],
  },
  {
    name: "Your project",
    defaultOpen: true,
    items: [
      { name: "Project details", href: "/dashboard/project", icon: "project" },
      { name: "Quotes", href: "/dashboard/quotes", icon: "quotes" },
      { name: "Moodboards", href: "/dashboard/moodboards", icon: "moodboards" },
      { name: "Project changes", href: "/dashboard/changes", icon: "changes" },
      {
        name: "Instructions",
        href: "/dashboard/instructions",
        icon: "instructions",
      },
      { name: "Photos", href: "/dashboard/photos", icon: "photos" },
    ],
  },
  {
    name: "Finance",
    defaultOpen: true,
    items: [
      { name: "Invoices", href: "/dashboard/invoices", icon: "invoices" },
      { name: "Payments", href: "/dashboard/payments", icon: "payments" },
      {
        name: "Quote archive",
        href: "/dashboard/quote-archive",
        icon: "archive",
      },
    ],
  },
  {
    name: "Help",
    defaultOpen: true,
    items: [
      { name: "Support", href: "/dashboard/tickets", icon: "support" },
      {
        name: "Request a quote",
        href: "/dashboard/request-quote",
        icon: "quote",
        emphasis: true,
      },
    ],
  },
  {
    name: "Account",
    defaultOpen: true,
    items: [
      {
        name: "Email preferences",
        href: "/dashboard/email-preferences",
        icon: "email",
      },
      {
        name: "Account settings",
        href: "/dashboard/account-settings",
        icon: "settings",
      },
    ],
  },
];

/**
 * Dashboard Layout
 * Provides navigation and authentication check for dashboard pages
 */
export default async function DashboardLayout({ children }) {
  // Check authentication
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  if (session.user.role === "referrer") {
    redirect("/referrer");
  }

  return (
    <ProjectProvider>
      <ClientPortalShell
        navGroups={clientNavigation}
        user={session.user}
        projectSelector={<ProjectSelector />}
        notificationBell={
          <NotificationBell
            clientTone
            userProjectStatus={session.user.projectStatus}
          />
        }
        profileImage={<ProfileImage user={session.user} />}
      >
        {children}
      </ClientPortalShell>
    </ProjectProvider>
  );
}
