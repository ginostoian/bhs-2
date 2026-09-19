"use client";

import { jsPDF } from "jspdf";
import GanttTimeline from "@/app/admin/projects/[projectId]/components/GanttTimeline";
import { buildGanttLayout, formatGanttDate } from "@/libs/ganttTimeline.mjs";

export default function PublicGanttChart({
  project,
  tasks,
  sections,
  milestones = [],
}) {
  const exportPDF = () => {
    const layout = buildGanttLayout({ tasks, milestones });
    const pdf = new jsPDF();
    pdf.setFontSize(17);
    pdf.text(project.name, 15, 18);
    pdf.setFontSize(10);
    pdf.text("Project schedule", 15, 25);
    let y = 37;
    const rows = [
      ...layout.scheduled.map(
        (task) =>
          `${task.name}  |  ${formatGanttDate(task.start)} - ${formatGanttDate(task.end)}  |  ${task.status}`,
      ),
      ...layout.milestones.map(
        (milestone) =>
          `${milestone.name}  |  ${formatGanttDate(milestone.date)}  |  Milestone`,
      ),
    ];
    rows.forEach((row) => {
      if (y > 275) {
        pdf.addPage();
        y = 20;
      }
      const lines = pdf.splitTextToSize(row, 180);
      pdf.text(lines, 15, y);
      y += Math.max(8, lines.length * 5);
    });
    if (!rows.length) pdf.text("No dated tasks or milestones", 15, y);
    pdf.save(`project-schedule-${project.id}.pdf`);
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-blue-700">
              Better Homes · Shared project schedule
            </p>
            <h1 className="mt-1 text-2xl font-semibold text-slate-900">
              {project.name}
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              {project.location || project.type}
            </p>
          </div>
          <button
            type="button"
            onClick={exportPDF}
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Export schedule PDF
          </button>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 sm:p-6">
          <GanttTimeline
            tasks={tasks}
            sections={sections}
            milestones={milestones}
          />
        </div>
      </div>
    </main>
  );
}
