"use client";

import {
  crmHistoryFieldValuesEqual,
  describeCRMHistoryChange,
  isAutomaticHistoryComment,
} from "@/libs/crmHistory";

export default function HistoryTab({ history = [], users = [] }) {
  const userNames = Object.fromEntries(
    users.map((user) => [String(user.id || user._id), user.name || user.email]),
  );
  const visibleHistory = history.filter(
    (change) =>
      !crmHistoryFieldValuesEqual(
        change.field,
        change.oldValue,
        change.newValue,
      ),
  );
  return (
    <div className="space-y-3">
      {[...visibleHistory].reverse().map((change, index) => {
        const description =
          change.title && change.body
            ? { title: change.title, body: change.body }
            : describeCRMHistoryChange(change, userNames);
        return (
          <article
            key={change.id || change._id || index}
            className="rounded-xl border border-slate-200 bg-white p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-sm font-semibold text-slate-900">
                {description.title}
              </h3>
              <time className="text-xs text-slate-400">
                {new Date(change.changedAt).toLocaleString("en-GB")}
              </time>
            </div>
            <p className="mt-2 whitespace-pre-wrap text-sm text-slate-600">
              {description.body}
            </p>
            {!isAutomaticHistoryComment(change.comment) ? (
              <p className="mt-2 text-xs text-slate-500">{change.comment}</p>
            ) : null}
            <p className="mt-1 text-xs text-slate-400">
              Changed by {change.changedBy?.name || "the system"}
            </p>
          </article>
        );
      })}
      {!visibleHistory.length ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
          No recorded changes
        </div>
      ) : null}
    </div>
  );
}
