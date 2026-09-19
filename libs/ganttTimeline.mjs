const DAY = 24 * 60 * 60 * 1000;

export function utcDay(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
}

export function addDays(date, days) {
  return new Date(date.getTime() + days * DAY);
}

export function daysBetween(start, end) {
  return Math.round((end.getTime() - start.getTime()) / DAY);
}

export function formatGanttDate(date, options = {}) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
    ...options,
  }).format(date);
}

export function buildGanttLayout({
  tasks = [],
  milestones = [],
  zoom = "week",
}) {
  const scheduled = tasks.flatMap((task) => {
    const start = utcDay(task.plannedStartDate);
    if (!start) return [];
    const duration = Math.max(
      1,
      Math.ceil(Number(task.estimatedDuration) || 1),
    );
    return [{ ...task, start, duration, end: addDays(start, duration - 1) }];
  });
  const undated = tasks.filter((task) => !utcDay(task.plannedStartDate));
  const datedMilestones = milestones.flatMap((milestone) => {
    const date = utcDay(milestone.date);
    return date ? [{ ...milestone, date }] : [];
  });
  const dates = [
    ...scheduled.flatMap((task) => [task.start, task.end]),
    ...datedMilestones.map((milestone) => milestone.date),
  ];
  if (!dates.length)
    return {
      scheduled,
      undated,
      milestones: datedMilestones,
      ticks: [],
      start: null,
      end: null,
      width: 0,
      dayWidth: zoom === "day" ? 42 : 13,
    };

  const earliest = new Date(Math.min(...dates.map((date) => date.getTime())));
  const latest = new Date(Math.max(...dates.map((date) => date.getTime())));
  let start = addDays(earliest, -3);
  let end = addDays(latest, 7);
  if (zoom === "week") {
    start = addDays(start, -((start.getUTCDay() + 6) % 7));
    end = addDays(end, 6 - ((end.getUTCDay() + 6) % 7));
  }
  const dayWidth = zoom === "day" ? 42 : 13;
  const step = zoom === "day" ? 1 : 7;
  const ticks = [];
  for (let date = start; date <= end; date = addDays(date, step)) {
    ticks.push(date);
  }
  return {
    scheduled,
    undated,
    milestones: datedMilestones,
    ticks,
    start,
    end,
    dayWidth,
    width: (daysBetween(start, end) + 1) * dayWidth,
  };
}
