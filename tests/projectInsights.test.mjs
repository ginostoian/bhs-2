import test from "node:test";
import assert from "node:assert/strict";
import { getProjectInsights } from "../libs/projectInsights.mjs";

test("project summary counts pending changes without crashing on the overview", () => {
  const insight = getProjectInsights({
    tasks: [],
    adminTasks: [],
    milestones: [],
    changes: [{ status: "Review" }, { status: "Accepted" }],
  }, new Date("2026-09-20T12:00:00Z"));
  assert.equal(insight.pendingChanges.length, 1);
  assert.equal(insight.siteDone, 0);
});

test("older projects without change records still render a summary", () => {
  assert.equal(getProjectInsights({ tasks: [], adminTasks: [], milestones: [] }).pendingChanges.length, 0);
});
