import { buildGanttLayout, utcDay } from "./ganttTimeline.mjs";

export function getProjectInsights({ tasks = [], adminTasks = [], milestones = [], changes = [] }, now = new Date()) {
  const today = utcDay(now);
  const schedule = buildGanttLayout({ tasks, milestones });
  const siteDone = tasks.filter((task) => task.status === "Done").length;
  const siteBlocked = tasks.filter((task) => task.status === "Blocked");
  const siteLate = schedule.scheduled.filter((task) => task.status !== "Done" && task.end < today);
  const officeOpen = adminTasks.filter((task) => task.status !== "Done");
  const officeLate = officeOpen.filter((task) => {
    const dueDate = utcDay(task.dueDate);
    return dueDate && dueDate < today;
  });
  const upcoming = schedule.milestones
    .filter((milestone) => milestone.status !== "Completed" && milestone.date >= today)
    .sort((a, b) => a.date - b.date)[0];
  const pendingChanges = changes.filter((change) => change.status === "Review");
  return { siteDone, siteBlocked, siteLate, officeOpen, officeLate, upcoming, pendingChanges };
}
