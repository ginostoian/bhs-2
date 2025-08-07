import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongoose from "@/libs/mongoose";
import Lead from "@/models/Lead";
import User from "@/models/User";
import Project from "@/models/Project";
import EmailAutomation from "@/models/EmailAutomation";
import AdminTask from "@/models/AdminTask";
import { Ticket } from "@/models/index.js";
import { formatDistanceToNow } from "date-fns";

/**
 * Admin Dashboard Page
 * Comprehensive overview of the entire system
 */
export default async function AdminDashboardPage() {
  // Get admin session
  const session = await getServerSession(authOptions);

  // Connect to MongoDB
  await connectMongoose();

  // Fetch comprehensive data
  const [
    leads,
    users,
    projects,
    emailAutomations,
    overdueActivities,
    agingLeads,
    stageStats,
    recentActivities,
    adminTasks,
    activeTicketsCount,
    activeTicketsList,
  ] = await Promise.all([
    // All leads with activities
    Lead.find({ isActive: true, isArchived: false })
      .populate("assignedTo", "name email")
      .populate("activities.createdBy", "name email")
      .sort({ updatedAt: -1 })
      .lean(),

    // All users
    User.find({}, { name: 1, email: 1, role: 1, projectStatus: 1 })
      .sort({ name: 1 })
      .lean(),

    // Ongoing projects
    Project.find({ status: "On Going" })
      .populate("user", "name email")
      .populate("projectManager", "name email")
      .sort({ startDate: -1 })
      .lean(),

    // Email automation stats
    EmailAutomation.find({ isActive: true })
      .populate("leadId", "name email stage")
      .lean(),

    // Overdue activities - simplified query to catch all overdue activities
    Lead.find({
      isActive: true,
      isArchived: false,
      "activities.dueDate": { $lt: new Date() },
    })
      .populate("assignedTo", "name email")
      .populate("activities.createdBy", "name email")
      .lean(),

    // Aging leads (2+ days)
    Lead.find({
      isActive: true,
      isArchived: false,
      agingDays: { $gte: 2 },
      stage: { $nin: ["Won", "Lost"] },
      $or: [{ agingPaused: false }, { agingPaused: { $exists: false } }],
    })
      .populate("assignedTo", "name email")
      .sort({ agingDays: -1 })
      .lean(),

    // Stage statistics
    Lead.aggregate([
      { $match: { isActive: true, isArchived: false } },
      { $group: { _id: "$stage", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),

    // Recent activities (last 7 days)
    Lead.aggregate([
      { $match: { isActive: true, isArchived: false } },
      { $unwind: "$activities" },
      {
        $match: {
          "activities.date": {
            $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      },
      { $sort: { "activities.date": -1 } },
      { $limit: 20 },
      {
        $lookup: {
          from: "users",
          localField: "activities.createdBy",
          foreignField: "_id",
          as: "creator",
        },
      },
      {
        $project: {
          leadName: "$name",
          leadId: "$_id",
          activity: "$activities",
          creator: { $arrayElemAt: ["$creator", 0] },
        },
      },
    ]),

    // Admin tasks assigned to current user (excluding completed tasks)
    AdminTask.find({
      assignedTo: session.user.id,
      status: { $ne: "Done" },
    })
      .populate("project", "name type status")
      .sort({ dueDate: 1, priority: -1 })
      .lean(),

    // Active tickets: anything not Resolved or Closed
    Ticket.countDocuments({ status: { $nin: ["Resolved", "Closed"] } }),

    // List of recent active tickets
    Ticket.find({ status: { $nin: ["Resolved", "Closed"] } })
      .populate("user", "name email")
      .populate("assignedTo", "name position")
      .populate("project", "name type")
      .sort({ createdAt: -1 })
      .limit(5)
      .lean(),
  ]);

  // Calculate metrics
  const totalLeads = leads.length;
  const totalUsers = users.length;
  const activeAutomations = emailAutomations.length;
  const overdueActivitiesCount = overdueActivities.reduce((total, lead) => {
    return (
      total +
      lead.activities.filter(
        (activity) =>
          activity.dueDate &&
          new Date(activity.dueDate) < new Date() &&
          activity.status !== "done",
      ).length
    );
  }, 0);
  const agingLeadsCount = agingLeads.length;
  const ongoingProjects = projects.length;

  // Get ongoing projects
  const ongoingProjectsList = projects.slice(0, 5);

  // Get leads with overdue activities
  const leadsWithOverdueActivities = overdueActivities
    .filter((lead) => {
      const overdue = lead.activities.filter(
        (activity) =>
          activity.dueDate &&
          new Date(activity.dueDate) < new Date() &&
          activity.status !== "done",
      );
      return overdue.length > 0;
    })
    .slice(0, 5);

  // Get top aging leads
  const topAgingLeads = agingLeads.slice(0, 5);

  // Get admin tasks for current user
  const adminTasksList = adminTasks.slice(0, 5);

  // Format recent activities
  const formattedRecentActivities = recentActivities.map((item) => ({
    ...item,
    leadId: item.leadId.toString(),
    timeAgo: formatDistanceToNow(new Date(item.activity.date), {
      addSuffix: true,
    }),
  }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          Admin Dashboard
        </h1>
        <p className="text-gray-600">
          Welcome back, {session?.user?.name}! Here&apos;s what&apos;s happening
          in your system.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
                <svg
                  className="h-5 w-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Leads</p>
              <p className="text-2xl font-semibold text-gray-900">
                {totalLeads}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100">
                <svg
                  className="h-5 w-5 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Ongoing Projects
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {ongoingProjects}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-100">
                <svg
                  className="h-5 w-5 text-teal-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 7h18M3 12h18M3 17h18"
                  />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Active Tickets
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {activeTicketsCount}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100">
                <svg
                  className="h-5 w-5 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Overdue Activities
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {overdueActivitiesCount}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100">
                <svg
                  className="h-5 w-5 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Aging Leads</p>
              <p className="text-2xl font-semibold text-gray-900">
                {agingLeadsCount}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* 1. My Admin Tasks */}
        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              My Admin Tasks
            </h2>
            <a
              href="/admin/projects"
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              View all →
            </a>
          </div>
          {adminTasksList.length > 0 ? (
            <div className="space-y-3">
              {adminTasksList.map((task) => {
                const isOverdue =
                  task.dueDate && new Date(task.dueDate) < new Date();
                const getPriorityColor = (priority) => {
                  const colors = {
                    low: "bg-gray-100 text-gray-800",
                    medium: "bg-blue-100 text-blue-800",
                    high: "bg-orange-100 text-orange-800",
                    urgent: "bg-red-100 text-red-800",
                  };
                  return colors[priority] || colors.medium;
                };
                const getStatusColor = (status) => {
                  const colors = {
                    Scheduled: "bg-gray-100 text-gray-800",
                    "In Progress": "bg-blue-100 text-blue-800",
                    Done: "bg-green-100 text-green-800",
                  };
                  return colors[status] || colors.Scheduled;
                };
                return (
                  <a
                    key={task._id}
                    href={`/admin/projects/${task.project._id}?task=${task._id}`}
                    className={`flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-gray-50 ${
                      isOverdue
                        ? "border border-red-200 bg-red-50"
                        : "bg-gray-50"
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center space-x-2">
                        <p className="truncate font-medium text-gray-900">
                          {task.name}
                        </p>
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getPriorityColor(
                            task.priority,
                          )}`}
                        >
                          {task.priority}
                        </span>
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(
                            task.status,
                          )}`}
                        >
                          {task.status}
                        </span>
                      </div>
                      <p className="truncate text-sm text-gray-500">
                        {task.project?.name || "Unknown Project"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-sm font-medium ${
                          isOverdue ? "text-red-600" : "text-gray-900"
                        }`}
                      >
                        {task.dueDate
                          ? new Date(task.dueDate).toLocaleDateString("en-GB")
                          : "No due date"}
                      </p>
                      {isOverdue && (
                        <p className="text-xs text-red-600">Overdue</p>
                      )}
                    </div>
                  </a>
                );
              })}
            </div>
          ) : (
            <p className="py-4 text-center text-gray-500">
              No admin tasks assigned
            </p>
          )}
        </div>

        {/* 2. Ongoing Projects */}
        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Ongoing Projects
            </h2>
            <a
              href="/admin/projects"
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              View all →
            </a>
          </div>
          {ongoingProjectsList.length > 0 ? (
            <div className="space-y-3">
              {ongoingProjectsList.map((project) => (
                <a
                  key={project._id}
                  href={`/admin/projects/${project._id}`}
                  className="flex cursor-pointer items-center justify-between rounded-lg bg-gray-50 p-3 transition-colors hover:bg-gray-100"
                >
                  <div>
                    <p className="font-medium text-gray-900">{project.name}</p>
                    <p className="text-sm text-gray-500">
                      {project.user?.email || "No email"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      £{(project.budget || 0).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      {project.projectManager?.name || "Unassigned"}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <p className="py-4 text-center text-gray-500">
              No ongoing projects
            </p>
          )}
        </div>

        {/* 3. Aging Leads */}
        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Aging Leads</h2>
            <a
              href="/admin/crm"
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              View all →
            </a>
          </div>
          {topAgingLeads.length > 0 ? (
            <div className="space-y-3">
              {topAgingLeads.map((lead) => (
                <div
                  key={lead._id}
                  className="flex items-center justify-between rounded-lg border border-orange-200 bg-orange-50 p-3"
                >
                  <div>
                    <p className="font-medium text-gray-900">{lead.name}</p>
                    <p className="text-sm text-orange-600">
                      {lead.agingDays} days since last contact
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      {lead.assignedTo?.name || "Unassigned"}
                    </p>
                    <p className="text-xs text-gray-400">{lead.stage}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-4 text-center text-gray-500">No aging leads</p>
          )}
        </div>

        {/* 4. Overdue Activities */}
        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Overdue Activities
            </h2>
            <a
              href="/admin/crm"
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              View all →
            </a>
          </div>
          {leadsWithOverdueActivities.length > 0 ? (
            <div className="space-y-3">
              {leadsWithOverdueActivities.map((lead) => {
                const overdueActivities = lead.activities.filter(
                  (activity) =>
                    activity.dueDate &&
                    new Date(activity.dueDate) < new Date() &&
                    activity.status !== "done",
                );
                return (
                  <div
                    key={lead._id}
                    className="rounded-lg border border-red-200 bg-red-50 p-3"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{lead.name}</p>
                        <p className="text-sm text-red-600">
                          {overdueActivities.length} overdue activities
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">
                          {lead.assignedTo?.name || "Unassigned"}
                        </p>
                        <p className="text-xs text-gray-400">{lead.stage}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="py-4 text-center text-gray-500">
              No overdue activities
            </p>
          )}
        </div>

        {/* 5. Active Tickets */}
        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Active Tickets
            </h2>
            <a
              href="/admin/tickets"
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              View all →
            </a>
          </div>
          {activeTicketsList && activeTicketsList.length > 0 ? (
            <div className="space-y-3">
              {activeTicketsList.map((ticket) => (
                <a
                  key={ticket._id}
                  href={`/admin/tickets/${ticket._id}`}
                  className="flex cursor-pointer items-start justify-between rounded-lg bg-gray-50 p-3 transition-colors hover:bg-gray-100"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-gray-900">
                      {ticket.title}
                    </p>
                    <p className="truncate text-sm text-gray-500">
                      {ticket.ticketNumber} • {ticket.user?.name || "Unknown"} •{" "}
                      {new Date(ticket.createdAt).toLocaleDateString("en-GB")}
                    </p>
                    {ticket.description && (
                      <p className="mt-1 line-clamp-2 text-sm text-gray-600">
                        {ticket.description}
                      </p>
                    )}
                  </div>
                  <div className="ml-4 flex flex-col items-end space-y-1 text-right">
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800">
                      {ticket.category}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                      {ticket.priority}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
                      {ticket.status}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <p className="py-4 text-center text-gray-500">No active tickets</p>
          )}
        </div>

        {/* 6. Recent Activities */}
        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Activities
            </h2>
            <a
              href="/admin/crm"
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              View all →
            </a>
          </div>
          {formattedRecentActivities.length > 0 ? (
            <div className="space-y-3">
              {formattedRecentActivities.slice(0, 5).map((item, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 rounded-lg bg-gray-50 p-3"
                >
                  <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500"></div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {item.activity.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {item.leadName} • {item.creator?.name || "Unknown"} •{" "}
                      {item.timeAgo}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-4 text-center text-gray-500">
              No recent activities
            </p>
          )}
        </div>
      </div>

      {/* Stage Distribution */}
      <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Lead Stage Distribution
        </h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
          {stageStats.map((stage) => (
            <div
              key={stage._id}
              className="rounded-lg bg-gray-50 p-4 text-center"
            >
              <p className="text-2xl font-bold text-gray-900">{stage.count}</p>
              <p className="text-sm text-gray-500">{stage._id}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <a
            href="/admin/crm"
            className="flex items-center rounded-lg bg-blue-50 p-4 transition-colors hover:bg-blue-100"
          >
            <svg
              className="mr-3 h-6 w-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <span className="font-medium text-blue-900">CRM</span>
          </a>

          <a
            href="/admin/email-automation"
            className="flex items-center rounded-lg bg-green-50 p-4 transition-colors hover:bg-green-100"
          >
            <svg
              className="mr-3 h-6 w-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
            <span className="font-medium text-green-900">Email Automation</span>
          </a>

          <a
            href="/admin/users"
            className="flex items-center rounded-lg bg-purple-50 p-4 transition-colors hover:bg-purple-100"
          >
            <svg
              className="mr-3 h-6 w-6 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
              />
            </svg>
            <span className="font-medium text-purple-900">Users</span>
          </a>

          <a
            href="/admin/notifications"
            className="flex items-center rounded-lg bg-orange-50 p-4 transition-colors hover:bg-orange-100"
          >
            <svg
              className="mr-3 h-6 w-6 text-orange-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-5 5v-5zM4.19 4.19A4 4 0 004 6v10a4 4 0 004 4h10a4 4 0 004-4V6a4 4 0 00-4-4H8a4 4 0 00-2.81 1.19z"
              />
            </svg>
            <span className="font-medium text-orange-900">Notifications</span>
          </a>
        </div>
      </div>
    </div>
  );
}
