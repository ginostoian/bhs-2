import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import { redirect } from "next/navigation";
import SignOutButton from "./components/SignOutButton";
import ProfileImage from "./components/ProfileImage";
import NotificationBell from "./components/NotificationBell";
import { ProjectProvider } from "./components/ProjectContext";
import ProjectSelector from "./components/ProjectSelector";
import PortalShell from "@/components/portal/PortalShell";

const clientNavigation = [
  {
    name: "",
    items: [
      { name: "Quote archive", href: "/dashboard", icon: "archive" },
      { name: "Quotes", href: "/dashboard/quotes", icon: "quotes" },
      { name: "Moodboards", href: "/dashboard/moodboards", icon: "moodboards" },
      { name: "Invoices", href: "/dashboard/invoices", icon: "invoices" },
      { name: "Payments", href: "/dashboard/payments", icon: "payments" },
      { name: "Changes", href: "/dashboard/changes", icon: "changes" },
      {
        name: "Instructions",
        href: "/dashboard/instructions",
        icon: "instructions",
      },
      { name: "Photos", href: "/dashboard/photos", icon: "photos" },
      { name: "Tickets", href: "/dashboard/tickets", icon: "tickets" },
      {
        name: "Request a quote",
        href: "/dashboard/request-quote",
        icon: "quote",
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
      <PortalShell
        navGroups={clientNavigation}
        user={session.user}
        workspaceLabel="Client portal"
        headerActions={
          <>
            <ProjectSelector />
            <NotificationBell userProjectStatus={session.user.projectStatus} />
            <ProfileImage user={session.user} />
            <SignOutButton compact />
          </>
        }
      >
        {children}
      </PortalShell>
    </ProjectProvider>
  );
}
