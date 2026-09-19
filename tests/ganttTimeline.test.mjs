import test from "node:test";
import assert from "node:assert/strict";
import { buildGanttLayout, daysBetween } from "../libs/ganttTimeline.mjs";

test("schedule bars use real dated, inclusive durations across month boundaries", () => {
  const layout = buildGanttLayout({
    tasks: [
      {
        id: "a",
        plannedStartDate: "2026-09-30T00:00:00.000Z",
        estimatedDuration: 3,
      },
      {
        id: "b",
        plannedStartDate: "2026-09-27T00:00:00.000Z",
        estimatedDuration: 1,
      },
    ],
    zoom: "day",
  });
  const [first, second] = layout.scheduled;
  assert.equal(first.end.toISOString(), "2026-10-02T00:00:00.000Z");
  assert.equal(first.duration, 3);
  assert.equal(
    daysBetween(layout.start, first.start) >
      daysBetween(layout.start, second.start),
    true,
  );
  assert.equal(layout.width, layout.ticks.length * layout.dayWidth);
});

test("milestone only and unscheduled tasks remain visible without fake task dates", () => {
  const layout = buildGanttLayout({
    tasks: [{ id: "unscheduled", estimatedDuration: 2 }],
    milestones: [{ id: "handover", date: "2026-10-12" }],
  });
  assert.equal(layout.scheduled.length, 0);
  assert.equal(layout.undated.length, 1);
  assert.equal(layout.milestones.length, 1);
  assert.ok(layout.start <= layout.milestones[0].date);
});
