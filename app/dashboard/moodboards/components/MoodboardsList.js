"use client";

import Link from "next/link";
import { ArrowRight, CalendarDays, Paintbrush } from "lucide-react";

function formatDate(value) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function statusStyles(status) {
  if (status === "approved" || status === "completed") {
    return "border-[#b8d9c5] bg-[#edf8f1] text-[#267448]";
  }
  if (status === "shared") {
    return "border-[#c9d6f7] bg-[#f0f4ff] text-[#2455b8]";
  }
  return "border-[#d8d4ca] bg-[#f3f1eb] text-[#5f6b66]";
}

export default function MoodboardsList({ moodboards }) {
  return (
    <div className="divide-y divide-[#dedbd2] border-y border-[#dedbd2] bg-[#fbfaf7]">
      {moodboards.map((moodboard) => (
        <Link
          key={moodboard.id}
          href={`/dashboard/moodboards/${moodboard.id}`}
          className="group flex flex-col gap-4 px-5 py-5 text-[#17231f] transition-colors hover:bg-[#f5f3ed] hover:text-[#17231f] sm:flex-row sm:items-center sm:px-6"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center bg-[#efede6] text-[#43504b]">
            <Paintbrush
              aria-hidden="true"
              className="h-5 w-5"
              strokeWidth={1.6}
            />
          </span>
          <span className="min-w-0 flex-1">
            <span className="flex flex-wrap items-center gap-2.5">
              <span className="truncate text-sm font-semibold text-[#17231f]">
                {moodboard.name}
              </span>
              <span
                className={`min-h-6 inline-flex items-center rounded-full border px-2 text-[10px] font-semibold capitalize ${statusStyles(moodboard.status)}`}
              >
                {moodboard.status}
              </span>
            </span>
            {moodboard.description ? (
              <span className="mt-1.5 line-clamp-1 block text-xs text-[#66716d]">
                {moodboard.description}
              </span>
            ) : null}
            <span className="mt-2 flex items-center gap-1.5 text-[11px] text-[#89918e]">
              <CalendarDays aria-hidden="true" className="h-3.5 w-3.5" />
              Updated {formatDate(moodboard.updatedAt)}
              {moodboard.projectType ? ` · ${moodboard.projectType}` : ""}
            </span>
          </span>
          <span className="inline-flex shrink-0 items-center gap-2 text-xs font-semibold text-[#1559d6]">
            Open moodboard
            <ArrowRight
              aria-hidden="true"
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
            />
          </span>
        </Link>
      ))}
    </div>
  );
}
