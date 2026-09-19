import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongoose from "@/libs/mongoose";
import Lead from "@/models/Lead";
import LeadActivity from "@/models/LeadActivity";
import User from "@/models/User";
import Project from "@/models/Project";
import EmailAutomation from "@/models/EmailAutomation";
import AdminTask from "@/models/AdminTask";
import Task from "@/models/Task";
import ProjectChange from "@/models/ProjectChange";
import Payment from "@/models/Payment";
import ProjectWeeklyUpdate from "@/models/ProjectWeeklyUpdate";
import { Ticket } from "@/models/index.js";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

async function getProjectAttention(now) {
  const projects = await Project.find({ status: "On Going" })
    .select("name projectedFinishDate projectManager")
    .populate("projectManager", "name")
    .sort({ startDate: -1 }).lean();
  const ids = projects.map((project) => project._id);
  if (!ids.length) return [];
  const [tasks, changes, payments, updates] = await Promise.all([
    Task.find({ project: { $in: ids }, status: { $ne: "Done" } }).select("project status plannedStartDate estimatedDuration").lean(),
    ProjectChange.find({ project: { $in: ids }, status: "Review" }).select("project").lean(),
    Payment.find({ project: { $in: ids }, status: { $ne: "Paid" }, dueDate: { $lt: now } }).select("project").lean(),
    ProjectWeeklyUpdate.find({ project: { $in: ids } }).select("project weekStart scheduleImpact costImpact").sort({ weekStart: -1 }).lean(),
  ]);
  const rows = new Map(projects.map((project) => [String(project._id), { project, blocked: 0, late: 0, changes: 0, payments: 0, update: null }]));
  for (const task of tasks) {
    const row = rows.get(String(task.project));
    if (!row) continue;
    if (task.status === "Blocked") row.blocked++;
    if (task.plannedStartDate && new Date(task.plannedStartDate).getTime() + Math.max(1, Number(task.estimatedDuration) || 1) * 86400000 < now.getTime()) row.late++;
  }
  for (const change of changes) { const row = rows.get(String(change.project)); if (row) row.changes++; }
  for (const payment of payments) { const row = rows.get(String(payment.project)); if (row) row.payments++; }
  for (const update of updates) { const row = rows.get(String(update.project)); if (row && !row.update) row.update = update; }
  return [...rows.values()].map((row) => ({ ...row,
    updateDue: !row.update || new Date(row.update.weekStart).getTime() < now.getTime() - 8 * 86400000,
    finishLate: row.project.projectedFinishDate && new Date(row.project.projectedFinishDate) < now,
  })).sort((a, b) => (Number(b.finishLate) + b.late + b.blocked + b.changes + b.payments + Number(b.updateDue)) - (Number(a.finishLate) + a.late + a.blocked + a.changes + a.payments + Number(a.updateDue)));
}

async function countOverdueLeadActivities(now) {
  const rows = await LeadActivity.aggregate([
    { $match: { dueDate: { $lt: now }, status: { $ne: "done" } } },
    { $lookup: { from: "leads", localField: "leadId", foreignField: "_id", as: "lead" } },
    { $unwind: "$lead" },
    { $match: { "lead.isActive": true, "lead.isArchived": false } },
    { $count: "count" },
  ]);
  return rows[0]?.count || 0;
}

/**
 * Admin Dashboard Page
 * Optimized for performance with server-side aggregations
 */
export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);
  await connectMongoose();

  const now = new Date();

  // Parallel Data Fetching with Optimized Queries
  const [
    stats,
    urgentItems,
    recentActivities,
    ongoingProjects,
    adminTasks,
    projectAttention,
  ] = await Promise.all([
    
    // 1. High-Level Stats (Counts only)
    Promise.all([
       Lead.countDocuments({ isActive: true, isArchived: false }),
       Project.countDocuments({ status: "On Going" }),
       Ticket.countDocuments({ status: { $nin: ["Resolved", "Closed"] } }),
       countOverdueLeadActivities(now),
       // Aging Leads Count
       Lead.countDocuments({ 
          isActive: true, 
          isArchived: false, 
          agingDays: { $gte: 2 },
          stage: { $nin: ["Won", "Lost"] },
          $or: [{ agingPaused: false }, { agingPaused: { $exists: false } }]
       })
    ]),

    // 2. Urgent Attention Items (Unified Feed)
    Promise.all([
      // A. Critical Tickets
      Ticket.find({ status: { $nin: ["Resolved", "Closed"] }, priority: "High" })
        .limit(3)
        .populate("user", "name")
        .lean(),
      // B. Overdue Admin Tasks
      AdminTask.find({ 
        assignedTo: session.user.id, 
        status: { $ne: "Done" },
        dueDate: { $lt: now }
      }).limit(3).lean(),
      // C. Top Aging Leads
      Lead.find({
        isActive: true,
        isArchived: false,
        agingDays: { $gte: 7 }, // Only show very old ones in urgent
        stage: { $nin: ["Won", "Lost"] },
        $or: [{ agingPaused: false }, { agingPaused: { $exists: false } }]
      })
      .select("name agingDays stage assignedTo")
      .populate("assignedTo", "name")
      .sort({ agingDays: -1 })
      .limit(3)
      .lean()
    ]),

    // 3. Recent Activities (Optimized Aggregation)
    LeadActivity.find({ occurredAt: { $gte: new Date(now - 7 * 24 * 60 * 60 * 1000) } })
      .sort({ occurredAt: -1 })
      .limit(10)
      .populate("leadId", "name isActive isArchived")
      .populate("createdBy", "name")
      .lean()
      .then((activities) => activities
        .filter((activity) => activity.leadId?.isActive && !activity.leadId?.isArchived)
        .map((activity) => ({
          leadName: activity.leadId.name,
          leadId: activity.leadId._id,
          activity: { ...activity, date: activity.occurredAt },
          creator: activity.createdBy?.name,
        }))),

    // 4. Ongoing Projects List
    Project.find({ status: "On Going" })
      .select("name user projectManager budget startDate")
      .populate("user", "name email")
      .populate("projectManager", "name")
      .sort({ startDate: -1 })
      .limit(5)
      .lean(),

    // 5. My Admin Tasks
    AdminTask.find({ assignedTo: session.user.id, status: { $ne: "Done" } })
      .populate("project", "name")
      .sort({ dueDate: 1, priority: -1 }) // Soonest due first
      .limit(5)
      .lean(),
    getProjectAttention(now),
  ]);

  const [totalLeads, totalProjects, activeTickets, overdueActivitiesCount, agingLeadsCount] = stats;
  const [criticalTickets, overdueTasks, agingLeadsList] = urgentItems;

  // Unified "Urgent" List
  const urgentList = [
    ...criticalTickets.map(t => ({ type: 'ticket', data: t, date: t.createdAt })),
    ...overdueTasks.map(t => ({ type: 'task', data: t, date: t.dueDate })),
    ...agingLeadsList.map(l => ({ type: 'lead', data: l, date: new Date() })) // Date irrelevant, just need sorting capacity if needed
  ].slice(0, 6); // Cap at 6 items

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
          <p className="text-gray-500">Overview of system performance and urgent items.</p>
        </div>
        <div className="text-sm font-medium text-gray-400">
          {now.toLocaleDateString("en-GB", { weekday: 'long', day: 'numeric', month: 'long' })}
        </div>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-6 py-5"><div><h2 className="text-lg font-semibold text-slate-900">Projects needing attention</h2><p className="text-sm text-slate-500">Live task, change, payment and weekly update signals for active projects.</p></div><Link href="/admin/workforce" className="text-sm font-medium text-blue-700 hover:underline">Plan workforce</Link></div>
        <div className="divide-y divide-slate-100">{projectAttention.slice(0, 8).map((row) => <Link key={row.project._id} href={`/admin/projects/${row.project._id}`} className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 hover:bg-slate-50"><div><span className="font-medium text-slate-900">{row.project.name}</span><span className="ml-2 text-xs text-slate-500">{row.project.projectManager?.name || "No PM"}</span></div><div className="flex flex-wrap gap-2 text-xs">{row.finishLate && <span className="rounded bg-red-50 px-2 py-1 text-red-700">Finish date passed</span>}{row.late > 0 && <span className="rounded bg-red-50 px-2 py-1 text-red-700">{row.late} late site tasks</span>}{row.blocked > 0 && <span className="rounded bg-amber-50 px-2 py-1 text-amber-700">{row.blocked} blocked</span>}{row.changes > 0 && <span className="rounded bg-amber-50 px-2 py-1 text-amber-700">{row.changes} changes to review</span>}{row.payments > 0 && <span className="rounded bg-amber-50 px-2 py-1 text-amber-700">{row.payments} overdue payment plan items</span>}{row.updateDue && <span className="rounded bg-slate-100 px-2 py-1 text-slate-700">Weekly update due</span>}{!row.finishLate && !row.late && !row.blocked && !row.changes && !row.payments && !row.updateDue && <span className="text-emerald-700">No flags</span>}</div></Link>)}{projectAttention.length === 0 && <p className="px-6 py-8 text-sm text-slate-500">No active projects.</p>}</div>
      </section>

      {/* Hero Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
            title="Total Leads" 
            value={totalLeads} 
            icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />}
            color="blue"
            href="/admin/crm"
        />
        <StatCard 
            title="Ongoing Projects" 
            value={totalProjects} 
            icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />}
            color="green"
            href="/admin/projects"
        />
        <StatCard 
            title="Active Tickets" 
            value={activeTickets} 
            icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />}
            color="teal"
            href="/admin/tickets"
        />
        <StatCard 
            title="Action Needed" 
            value={overdueActivitiesCount + agingLeadsCount} 
            subtitle={`${overdueActivitiesCount} Overdue / ${agingLeadsCount} Aging`}
            icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />}
            color="orange"
            href="/admin/crm"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-8">
            
            {/* Urgent Attention Section */}
            {(urgentList.length > 0) && (
                <div className="rounded-2xl border border-red-100 bg-red-50/50 p-6">
                    <h2 className="text-lg font-bold text-red-900 mb-4 flex items-center gap-2">
                         <svg className="w-5 h-5 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
                         Urgent Attention
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {urgentList.map((item, i) => (
                            <UrgentCard key={i} type={item.type} data={item.data} />
                        ))}
                    </div>
                </div>
            )}

            {/* Ongoing Projects - Moved Up */}
             <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-gray-900">Active Projects</h2>
                    <Link href="/admin/projects" className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</Link>
                </div>
                <div className="divide-y divide-gray-50">
                    {ongoingProjects.map(project => (
                        <Link key={project._id} href={`/admin/projects/${project._id}`} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between block group">
                            <div>
                                <p className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{project.name}</p>
                                <p className="text-xs text-gray-500">{project.user?.name || "Unknown Client"}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-bold text-gray-900">£{(project.budget || 0).toLocaleString()}</p>
                                <p className="text-xs text-gray-500">{project.projectManager?.name || "No PM"}</p>
                            </div>
                        </Link>
                    ))}
                     {ongoingProjects.length === 0 && (
                        <div className="p-8 text-center text-gray-400">No ongoing projects</div>
                    )}
                </div>
            </div>

            {/* Admin Tasks */}
             <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-gray-900">My Tasks</h2>
                    <Link href="/admin/projects" className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</Link>
                </div>
                <div className="divide-y divide-gray-50">
                    {adminTasks.length > 0 ? adminTasks.map(task => (
                         <div key={task._id} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between group">
                            <div className="flex items-center gap-3">
                                <div className={`w-2 h-2 rounded-full ${task.priority === 'High' ? 'bg-orange-500' : 'bg-blue-500'}`}></div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{task.name}</p>
                                    <p className="text-xs text-gray-500">{task.project?.name || "No Project"}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-full">{task.status}</p>
                            </div>
                         </div>
                    )) : (
                        <div className="p-8 text-center text-gray-400">No pending tasks</div>
                    )}
                </div>
            </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
            {/* Quick Actions */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 gap-3">
                    <QuickAction href="/admin/crm" icon="📊" label="CRM" color="blue" />
                    <QuickAction href="/admin/quoting" icon="📜" label="Quotes" color="orange" />
                    <QuickAction href="/admin/payments" icon="💳" label="Payments" color="green" />
                    <QuickAction href="/admin/users" icon="👥" label="Users" color="purple" />
                    <QuickAction href="/admin/extension-calculator-leads" icon="🧮" label="Ext Leads" color="blue" />
                    <QuickAction href="/admin/renovation-calculator-leads" icon="🏚️" label="Renov Leads" color="orange" />
                    <QuickAction href="/admin/kitchen-calculator-leads" icon="🍽️" label="Kitchen Leads" color="green" />
                </div>
            </div>

            {/* Recent Activity Feed */}
            <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
                </div>
                <div className="max-h-[400px] overflow-y-auto">
                    {recentActivities.map((item, i) => (
                        <div key={i} className="p-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                            <div className="flex gap-3">
                                <div className="mt-1 w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 text-xs font-bold flex-shrink-0">
                                    {(item.creator?.[0] || "S").toUpperCase()}
                                </div>
                                <div>
                                    <p className="text-sm text-gray-900"><span className="font-semibold">{item.creator || "System"}</span> {item.activity.title.toLowerCase()}</p>
                                    <p className="text-xs text-blue-600 font-medium mt-0.5">{item.leadName}</p>
                                    <p className="text-[10px] text-gray-400 mt-1">{formatDistanceToNow(new Date(item.activity.date), { addSuffix: true })}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                    {recentActivities.length === 0 && (
                        <div className="p-8 text-center text-gray-400">No recent activity</div>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

// --- Components ---

function StatCard({ title, value, subtitle, icon, color, href }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600 ring-blue-100",
    green: "bg-green-50 text-green-600 ring-green-100",
    teal: "bg-teal-50 text-teal-600 ring-teal-100",
    orange: "bg-orange-50 text-orange-600 ring-orange-100",
  };
  
  return (
    <Link href={href} className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-900/5 transition-all hover:-translate-y-1 hover:shadow-md">
      <div className={`absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity`}>
         <svg className={`w-20 h-20 ${colors[color].split(" ")[1]}`} fill="currentColor" viewBox="0 0 24 24">{icon}</svg>
      </div>
      <div className="flex items-center gap-4 mb-4">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${colors[color]} ring-1 ring-inset`}>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">{icon}</svg>
        </div>
      </div>
      <p className="text-sm font-semibold text-gray-500">{title}</p>
      <div className="flex items-baseline gap-2">
         <p className="text-3xl font-bold text-gray-900">{value}</p>
         {subtitle && <span className="text-xs font-medium text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded-full">{subtitle}</span>}
      </div>
    </Link>
  );
}

function UrgentCard({ type, data }) {
    if (type === 'ticket') {
        return (
            <Link href={`/admin/tickets/${data._id}`} className="block p-4 rounded-xl bg-white border border-red-100 shadow-sm hover:border-red-300 transition-all">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">Critical Ticket</span>
                </div>
                <p className="text-sm font-bold text-gray-900 line-clamp-1">{data.ticketNumber} - {data.title}</p>
                <p className="text-xs text-gray-500 mt-1">From: {data.user?.name || "Unknown"}</p>
            </Link>
        )
    }
    if (type === 'task') {
         return (
            <Link href={`/admin/projects/${data.project}?task=${data._id}`} className="block p-4 rounded-xl bg-white border border-orange-100 shadow-sm hover:border-orange-300 transition-all">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">Overdue Task</span>
                </div>
                <p className="text-sm font-bold text-gray-900 line-clamp-1">{data.name}</p>
                 <p className="text-xs text-red-500 mt-1 font-medium">Due: {new Date(data.dueDate).toLocaleDateString('en-GB')}</p>
            </Link>
        )
    }
    if (type === 'lead') {
         return (
            <Link href="/admin/crm" className="block p-4 rounded-xl bg-white border border-gray-200 shadow-sm hover:border-blue-300 transition-all">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">Aging Lead</span>
                </div>
                <p className="text-sm font-bold text-gray-900 line-clamp-1">{data.name}</p>
                <p className="text-xs text-orange-600 mt-1 font-medium">{data.agingDays} days (Stage: {data.stage})</p>
            </Link>
        )
    }
    return null;
}

function QuickAction({ href, icon, label, color }) {
    const colors = {
        blue: "bg-blue-50 text-blue-700 hover:bg-blue-100",
        green: "bg-green-50 text-green-700 hover:bg-green-100",
        purple: "bg-purple-50 text-purple-700 hover:bg-purple-100",
        orange: "bg-orange-50 text-orange-700 hover:bg-orange-100",
    };
    return (
        <Link href={href} className={`flex flex-col items-center justify-center p-4 rounded-xl ${colors[color]} transition-colors`}>
            <span className="text-2xl mb-1">{icon}</span>
            <span className="text-xs font-bold">{label}</span>
        </Link>
    )
}
