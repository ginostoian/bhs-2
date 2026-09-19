import connectMongoose from "@/libs/mongoose";
import Employee from "@/models/Employee";
import Task from "@/models/Task";
import Project from "@/models/Project";
import Attendance from "@/models/Attendance";
import Link from "next/link";

const DAY = 86400000;
const day = (value) => { const d = new Date(value); d.setUTCHours(0, 0, 0, 0); return d; };
const monday = (value) => { const d = day(value); d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7)); return d; };
const dateLabel = (value) => value.toLocaleDateString("en-GB", { timeZone: "UTC", day: "numeric", month: "short" });

export default async function WorkforcePage() {
  await connectMongoose();
  const start = monday(new Date());
  const end = new Date(start.getTime() + 28 * DAY);
  const previous = new Date(start.getTime() - 7 * DAY);
  const [workers, tasks, attendance] = await Promise.all([
    Employee.find({ isActive: { $ne: false } }).select("name position availability").sort({ name: 1 }).lean(),
    Task.find({ status: { $ne: "Done" }, plannedStartDate: { $lte: end } })
      .select("name project plannedStartDate estimatedDuration assignedTo assignedWorkers status")
      .populate("project", "name status").lean(),
    Attendance.find({ date: { $gte: previous, $lt: end } })
      .select("worker project date status hours").lean(),
  ]);
  const weeks = Array.from({ length: 4 }, (_, i) => new Date(start.getTime() + i * 7 * DAY));
  const cells = new Map();
  for (const worker of workers) {
    const id = String(worker._id);
    cells.set(id, weeks.map(() => ({ projects: new Map(), taskDays: new Map(), leave: [], recordedHours: 0 })));
  }
  for (const task of tasks) {
    if (task.project?.status !== "On Going" || !task.plannedStartDate) continue;
    const startDate = day(task.plannedStartDate).getTime();
    const duration = Math.max(1, Math.min(366, Number(task.estimatedDuration) || 1));
    const ids = new Set([...(task.assignedWorkers || []).map(String), ...(task.assignedTo ? [String(task.assignedTo)] : [])]);
    for (const id of ids) {
      const row = cells.get(id);
      if (!row) continue;
      for (let offset = 0; offset < duration; offset++) {
        const date = startDate + offset * DAY;
        const index = Math.floor((date - start.getTime()) / (7 * DAY));
        if (index < 0 || index >= 4) continue;
        const cell = row[index];
        const key = String(task.project._id);
        cell.projects.set(key, task.project.name);
        cell.taskDays.set(date, (cell.taskDays.get(date) || 0) + 1);
      }
    }
  }
  for (const entry of attendance) {
    const row = cells.get(String(entry.worker));
    if (!row) continue;
    const date = day(entry.date).getTime();
    if (date < start.getTime()) {
      if (entry.status === "Present") row[0].recordedHours += Number(entry.hours) || 0;
      continue;
    }
    const index = Math.floor((date - start.getTime()) / (7 * DAY));
    if (index >= 0 && index < 4 && entry.status !== "Present") row[index].leave.push(entry.status);
  }
  return <div className="space-y-6 pb-10">
    <div><p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Team planning</p><h1 className="text-3xl font-semibold text-slate-900">Workforce</h1><p className="mt-1 text-sm text-slate-600">Four weeks of task assignments, planned absence and last week&apos;s recorded hours. Task spans are calendar-day estimates.</p></div>
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="min-w-[900px] w-full text-left text-sm"><thead className="bg-slate-50 text-slate-600"><tr><th className="p-4">Worker</th>{weeks.map((week) => <th key={week.toISOString()} className="p-4">{dateLabel(week)} – {dateLabel(new Date(week.getTime() + 6 * DAY))}</th>)}</tr></thead>
        <tbody className="divide-y divide-slate-100">{workers.map((worker) => <tr key={worker._id} className="align-top"><th className="p-4 font-medium text-slate-900">{worker.name}<span className="block font-normal text-slate-500">{worker.position}</span><span className="block font-normal text-slate-500">{worker.availability} · {cells.get(String(worker._id))[0].recordedHours.toFixed(1)}h last week</span></th>{cells.get(String(worker._id)).map((cell, index) => {
          const conflictDays = [...cell.taskDays.values()].filter((count) => count > 1).length;
          return <td key={index} className="p-4"><div className="space-y-1">{[...cell.projects.entries()].map(([id, name]) => <Link key={id} href={`/admin/projects/${id}`} className="block text-blue-700 hover:underline">{name}</Link>)}{cell.projects.size === 0 && <span className="text-slate-400">No scheduled task</span>}{conflictDays > 0 && <p className="text-xs font-medium text-amber-700">{conflictDays} day{conflictDays > 1 ? "s" : ""} with overlapping tasks</p>}{cell.leave.length > 0 && <p className="text-xs font-medium text-red-700">{cell.leave.length} absence entr{cell.leave.length > 1 ? "ies" : "y"}</p>}</div></td>;
        })}</tr>)}{workers.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-slate-500">No active workers found.</td></tr>}</tbody></table>
    </div>
    <p className="text-xs text-slate-500">Assignments come from site tasks. Attendance is recorded time and absence, not a future roster. Check individual task dates before confirming a booking.</p>
  </div>;
}
