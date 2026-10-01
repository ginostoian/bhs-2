import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import { redirect } from "next/navigation";
import connectMongoose from "@/libs/mongoose";
import Employee from "@/models/Employee";
import User from "@/models/User";
import Attendance from "@/models/Attendance";
import { Task, Ticket } from "@/models/index.js";
import {
  LinkButton,
  PageHeader,
  Stat,
  StatGrid,
  formatMoney,
} from "@/components/admin/ui";
import EmployeesList from "./components/EmployeesList";
import AddEmployee from "./components/AddEmployee";

export const dynamic = "force-dynamic";

const countBy = (rows, keys) => {
  const map = new Map();
  rows.forEach((row) => {
    const ids = new Set(
      keys.flatMap((k) => [].concat(row[k] || [])).map(String),
    );
    ids.forEach((id) => map.set(id, (map.get(id) || 0) + 1));
  });
  return map;
};

/**
 * Team: everyone on the books with their current workload (open site tasks,
 * open tickets, days on site this month). Inactive staff stay listed under
 * their own tab so they can be reactivated; nothing is ever deleted here.
 */
export default async function AdminEmployeesPage() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin") {
    redirect("/dashboard");
  }

  await connectMongoose();
  const now = new Date();
  const monthStart = new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1));

  const [employeeDocs, users, tasks, tickets, attendance] = await Promise.all([
    Employee.find({}).sort({ name: 1 }),
    User.find({ role: { $nin: ["admin", "employee"] } })
      .select("name email projectStatus createdAt role")
      .sort({ name: 1 })
      .lean(),
    Task.find({ status: { $ne: "Done" } })
      .select("assignedTo assignedWorkers")
      .lean(),
    Ticket.find({ status: { $nin: ["Resolved", "Closed"] } })
      .select("assignedTo")
      .lean(),
    Attendance.find({ date: { $gte: monthStart }, status: "Present" })
      .select("worker")
      .lean(),
  ]);

  const openTasks = countBy(tasks, ["assignedTo", "assignedWorkers"]);
  const openTickets = countBy(tickets, ["assignedTo"]);
  const daysOnSite = countBy(attendance, ["worker"]);

  const employees = employeeDocs.map((doc) => {
    const e = doc.toJSON();
    return {
      id: String(e.id || doc._id),
      name: e.name || "",
      email: e.email || "",
      phone: e.phone || "",
      position: e.position || "",
      skills: e.skills || [],
      dayRate: e.dayRate ?? null,
      availability: e.availability || "available",
      isActive: e.isActive !== false,
      createdAt: e.createdAt ? new Date(e.createdAt).toISOString() : null,
      openTasks: openTasks.get(String(doc._id)) || 0,
      openTickets: openTickets.get(String(doc._id)) || 0,
      daysThisMonth: daysOnSite.get(String(doc._id)) || 0,
    };
  });

  const active = employees.filter((e) => e.isActive);
  const unassignedTasks = tasks.filter(
    (t) => !t.assignedTo && !(t.assignedWorkers || []).length,
  ).length;
  const labourThisMonth = active.reduce(
    (s, e) => s + (e.dayRate || 0) * e.daysThisMonth,
    0,
  );

  return (
    <div className="pb-12">
      <PageHeader
        eyebrow="Team"
        title="Employees"
        description="Who's on the team, what they're working on and how often they've been on site this month."
        actions={
          <>
            <LinkButton href="/admin/attendance">Attendance</LinkButton>
            <AddEmployee
              users={users.map((u) => ({
                ...u,
                id: String(u._id),
                _id: undefined,
                createdAt: u.createdAt ? String(u.createdAt) : null,
              }))}
            />
          </>
        }
      />
      <StatGrid>
        <Stat
          label="Active staff"
          value={active.length}
          hint={`${active.filter((e) => e.availability === "available").length} available now`}
          tone="olive"
        />
        <Stat
          label="Open site tasks"
          value={tasks.length}
          hint={
            unassignedTasks
              ? `${unassignedTasks} with nobody assigned`
              : "All assigned"
          }
          tone={unassignedTasks ? "warn" : "good"}
          href="/admin/projects"
        />
        <Stat
          label="Open tickets"
          value={tickets.length}
          hint={`${tickets.filter((t) => !t.assignedTo).length} unassigned`}
          tone="info"
          href="/admin/tickets"
        />
        <Stat
          label="Labour this month"
          value={formatMoney(labourThisMonth)}
          hint="Day rate × days present"
          tone="neutral"
          href="/admin/attendance"
        />
      </StatGrid>
      <EmployeesList employees={employees} />
    </div>
  );
}
