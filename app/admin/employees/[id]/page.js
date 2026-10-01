import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import mongoose from "mongoose";
import connectMongoose from "@/libs/mongoose";
import Employee from "@/models/Employee";
import Task from "@/models/Task";
import "@/models/TaskSection";
import Attendance from "@/models/Attendance";
import { Ticket } from "@/models/index.js";
import {
  Badge,
  LinkButton,
  PageHeader,
  Panel,
  Stat,
  StatGrid,
  Table,
  formatMoney,
  formatShortDate,
} from "@/components/admin/ui";
import EmployeeDetailClient from "./components/EmployeeDetailClient";

export const dynamic = "force-dynamic";

const plain = (value) => JSON.parse(JSON.stringify(value));

/**
 * Employee record: details and assigned site tasks (editable client part),
 * plus open tickets and recent attendance so a person's workload and time on
 * site are visible in one place.
 */
export default async function AdminEmployeeDetailPage({ params }) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin") {
    redirect("/dashboard");
  }
  if (!mongoose.isValidObjectId(params.id)) notFound();

  await connectMongoose();

  // lean() keeps email and createdAt, which the model's toJSON strips
  const employee = await Employee.findById(params.id).lean();
  if (!employee) notFound();

  const since = new Date();
  since.setDate(since.getDate() - 30);

  const [tasks, tickets, attendance] = await Promise.all([
    Task.find({
      $or: [{ assignedTo: employee._id }, { assignedWorkers: employee._id }],
    })
      .populate("project", "name type status")
      .populate("section", "name color icon")
      .sort({ dueDate: 1, priority: -1 })
      .lean(),
    Ticket.find({ assignedTo: employee._id })
      .select(
        "ticketNumber title status priority scheduledDate project createdAt",
      )
      .populate("project", "name")
      .sort({ createdAt: -1 })
      .limit(20)
      .lean(),
    Attendance.find({ worker: employee._id, date: { $gte: since } })
      .select("date status hours shiftType project projectName")
      .populate("project", "name")
      .sort({ date: -1 })
      .lean(),
  ]);

  const employeeData = plain({
    ...employee,
    id: String(employee._id),
    _id: undefined,
    __v: undefined,
    dayRate: employee.dayRate ?? null,
  });

  const tasksData = plain(
    tasks.map((task) => ({
      ...task,
      id: String(task._id),
      _id: undefined,
      project: task.project
        ? { ...task.project, id: String(task.project._id), _id: undefined }
        : null,
      section: task.section
        ? { ...task.section, id: String(task.section._id), _id: undefined }
        : null,
    })),
  );

  const present = attendance.filter((a) => a.status === "Present");
  const days = present.reduce(
    (s, a) => s + (a.shiftType === "half" ? 0.5 : 1),
    0,
  );
  const openTasks = tasks.filter((t) => t.status !== "Done").length;
  const openTickets = tickets.filter(
    (t) => !["Resolved", "Closed"].includes(t.status),
  ).length;

  return (
    <div className="pb-12">
      <PageHeader
        back={{ href: "/admin/employees", label: "Employees" }}
        eyebrow="Team"
        title={employee.name}
        description={[employee.position, employee.email, employee.phone]
          .filter(Boolean)
          .join(" · ")}
        meta={
          <>
            <Badge tone={employee.isActive === false ? "neutral" : "good"}>
              {employee.isActive === false ? "Inactive" : "Active"}
            </Badge>
            <Badge status={employee.availability}>
              {employee.availability || "available"}
            </Badge>
          </>
        }
        actions={<LinkButton href={`/admin/attendance`}>Attendance</LinkButton>}
      />
      <StatGrid>
        <Stat label="Open site tasks" value={openTasks} tone="olive" />
        <Stat
          label="Open tickets"
          value={openTickets}
          tone={openTickets ? "info" : "neutral"}
        />
        <Stat
          label="Days on site (30 days)"
          value={days}
          hint={`${attendance.length - present.length} days sick, holiday or unavailable`}
          tone="neutral"
        />
        <Stat
          label="Labour cost (30 days)"
          value={employee.dayRate ? formatMoney(days * employee.dayRate) : "—"}
          hint={
            employee.dayRate
              ? `£${employee.dayRate} day rate`
              : "No day rate set"
          }
          tone="neutral"
        />
      </StatGrid>

      <EmployeeDetailClient employee={employeeData} tasks={tasksData} />

      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        <Panel
          title="Tickets"
          description="Aftercare assigned to them"
          padded={false}
        >
          <Table
            rows={tickets}
            empty={
              <p className="px-5 py-6 text-sm text-[#7A807B]">
                No tickets assigned.
              </p>
            }
            columns={[
              {
                header: "Ticket",
                render: (t) => (
                  <Link
                    href={`/admin/tickets/${t._id}`}
                    className="font-medium hover:underline"
                  >
                    {t.title}
                    <span className="block text-xs font-normal text-[#7A807B]">
                      #{t.ticketNumber}
                      {t.project?.name ? ` · ${t.project.name}` : ""}
                    </span>
                  </Link>
                ),
              },
              {
                header: "Status",
                render: (t) => <Badge status={t.status}>{t.status}</Badge>,
              },
              {
                header: "Visit",
                render: (t) =>
                  t.scheduledDate ? formatShortDate(t.scheduledDate) : "—",
              },
            ]}
          />
        </Panel>
        <Panel title="Attendance" description="Last 30 days" padded={false}>
          <Table
            rows={attendance.slice(0, 15)}
            empty={
              <p className="px-5 py-6 text-sm text-[#7A807B]">
                Nothing recorded in the last 30 days.
              </p>
            }
            columns={[
              { header: "Date", render: (a) => formatShortDate(a.date) },
              {
                header: "Project",
                render: (a) =>
                  a.project?._id ? (
                    <Link
                      href={`/admin/projects/${a.project._id}`}
                      className="hover:underline"
                    >
                      {a.project.name}
                    </Link>
                  ) : (
                    a.projectName || "—"
                  ),
              },
              {
                header: "Status",
                render: (a) => (
                  <Badge tone={a.status === "Present" ? "good" : "neutral"}>
                    {a.status}
                    {a.status === "Present" && a.shiftType === "half"
                      ? " · half"
                      : ""}
                  </Badge>
                ),
              },
              {
                header: "Hours",
                align: "right",
                render: (a) => (a.hours ? `${a.hours}h` : "—"),
              },
            ]}
          />
        </Panel>
      </div>
    </div>
  );
}
