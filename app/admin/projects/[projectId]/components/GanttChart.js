"use client";

import { useState } from "react";
import { jsPDF } from "jspdf";
import GanttTimeline from "./GanttTimeline";
import { buildGanttLayout, formatGanttDate } from "@/libs/ganttTimeline.mjs";

export default function GanttChart({
  projectId,
  projectName,
  tasks,
  sections,
  milestones = [],
}) {
  const [shareLink, setShareLink] = useState("");
  const [busy, setBusy] = useState(false);

  const generateShareLink = async () => {
    setBusy(true);
    try {
      const response = await fetch(`/api/projects/${projectId}/gantt-share`, {
        method: "POST",
      });
      if (!response.ok) throw new Error("Could not create share link");
      const data = await response.json();
      setShareLink(data.shareUrl);
    } catch (error) {
      alert(error.message);
    } finally {
      setBusy(false);
    }
  };

  const exportPDF = () => {
    const layout = buildGanttLayout({ tasks, milestones });
    const pdf = new jsPDF();
    pdf.setFontSize(17);
    pdf.text(projectName, 15, 18);
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
    pdf.save(`project-schedule-${projectId}.pdf`);
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap justify-end gap-2">
        <button
          type="button"
          onClick={generateShareLink}
          disabled={busy}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          {busy ? "Creating link…" : "Share schedule"}
        </button>
        <button
          type="button"
          onClick={exportPDF}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Export schedule PDF
        </button>
      </div>
      {shareLink && (
        <div className="mb-4 rounded-md border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900">
          <label
            htmlFor="schedule-share-link"
            className="mb-1 block font-medium"
          >
            Schedule share link
          </label>
          <input
            id="schedule-share-link"
            readOnly
            value={shareLink}
            onFocus={(event) => event.target.select()}
            className="w-full rounded border border-blue-200 bg-white px-2 py-1.5"
          />
        </div>
      )}
      <GanttTimeline
        tasks={tasks}
        sections={sections}
        milestones={milestones}
      />
    </div>
  );
}
