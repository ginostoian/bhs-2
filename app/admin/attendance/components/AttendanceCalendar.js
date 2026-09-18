import { CalendarPlus } from "lucide-react";

const STATUS_DOT = {
  Present: "bg-emerald-500",
  Sick: "bg-red-500",
  Holiday: "bg-amber-500",
  Unavailable: "bg-slate-400",
};

function dateKey(date) {
  return date.toISOString().slice(0, 10);
}

function monthCells(month) {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const first = new Date(Date.UTC(year, monthIndex, 1));
  const mondayOffset = (first.getUTCDay() + 6) % 7;
  const start = new Date(first);
  start.setUTCDate(first.getUTCDate() - mondayOffset);

  return Array.from({ length: 42 }, (_, index) => {
    const cell = new Date(start);
    cell.setUTCDate(start.getUTCDate() + index);
    return cell;
  });
}

export default function AttendanceCalendar({
  month,
  entries,
  selectedDate,
  onSelectDate,
  onAddEntry,
  onOpenEmployee,
}) {
  const cells = monthCells(month);
  const selectedKey = dateKey(selectedDate);
  const todayKey = dateKey(new Date());
  const entriesByDate = new Map();

  entries.forEach((entry) => {
    const key = dateKey(new Date(entry.date));
    const existing = entriesByDate.get(key) || [];
    existing.push(entry);
    entriesByDate.set(key, existing);
  });

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <div className="min-w-[820px]">
        <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50/80">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
            (day) => (
              <div
                key={day}
                className="px-3 py-2.5 text-xs font-semibold uppercase tracking-[0.08em] text-slate-500"
              >
                {day}
              </div>
            ),
          )}
        </div>

        <div className="grid grid-cols-7">
          {cells.map((cell) => {
            const key = dateKey(cell);
            const dayEntries = entriesByDate.get(key) || [];
            const inMonth = cell.getUTCMonth() === month.getMonth();
            const selected = key === selectedKey;
            const totalHours = dayEntries.reduce(
              (sum, entry) => sum + Number(entry.hours || 0),
              0,
            );

            return (
              <div
                key={key}
                className={`group min-h-36 border-b border-r border-slate-200 p-2.5 transition-colors ${
                  selected
                    ? "bg-emerald-50/70 ring-1 ring-inset ring-emerald-700"
                    : inMonth
                      ? "bg-white hover:bg-slate-50/70"
                      : "bg-slate-50/60"
                }`}
              >
                <div className="mb-2 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => onSelectDate(cell)}
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold ${
                      key === todayKey
                        ? "bg-emerald-800 text-white"
                        : inMonth
                          ? "text-slate-800 hover:bg-slate-100"
                          : "text-slate-400"
                    }`}
                    aria-label={`Select ${cell.toLocaleDateString("en-GB")}`}
                  >
                    {cell.getUTCDate()}
                  </button>
                  {inMonth ? (
                    <button
                      type="button"
                      onClick={() => onAddEntry(cell)}
                      className="rounded-md p-1 text-slate-300 opacity-0 transition hover:bg-emerald-50 hover:text-emerald-800 focus:opacity-100 group-hover:opacity-100"
                      aria-label={`Log time for ${cell.toLocaleDateString("en-GB")}`}
                    >
                      <CalendarPlus className="h-4 w-4" />
                    </button>
                  ) : null}
                </div>

                {dayEntries.length > 0 ? (
                  <>
                    <div className="mb-1 flex items-center justify-between text-[11px] text-slate-500">
                      <span>
                        {dayEntries.length} entr{dayEntries.length === 1 ? "y" : "ies"}
                      </span>
                      <span className="font-medium text-slate-700">
                        {totalHours.toLocaleString("en-GB")}h
                      </span>
                    </div>
                    <div className="space-y-1">
                      {dayEntries.slice(0, 3).map((entry) => (
                        <button
                          key={entry._id || entry.id}
                          type="button"
                          onClick={() => onOpenEmployee(entry.worker)}
                          className="flex w-full items-center gap-1.5 rounded px-1 py-0.5 text-left text-xs text-slate-700 hover:bg-white hover:text-emerald-900"
                        >
                          <span
                            className={`h-1.5 w-1.5 shrink-0 rounded-full ${STATUS_DOT[entry.status] || STATUS_DOT.Unavailable}`}
                          />
                          <span className="min-w-0 flex-1 truncate">
                            {entry.worker?.name || "Unknown employee"}
                          </span>
                          <span className="tabular-nums text-slate-500">
                            {Number(entry.hours || 0)}h
                          </span>
                        </button>
                      ))}
                      {dayEntries.length > 3 ? (
                        <button
                          type="button"
                          onClick={() => onSelectDate(cell)}
                          className="px-1 text-[11px] font-medium text-emerald-800 hover:underline"
                        >
                          +{dayEntries.length - 3} more
                        </button>
                      ) : null}
                    </div>
                  </>
                ) : inMonth ? (
                  <button
                    type="button"
                    onClick={() => onAddEntry(cell)}
                    className="flex h-20 w-full items-center justify-center text-xs text-slate-300 opacity-0 transition hover:text-emerald-700 group-hover:opacity-100"
                  >
                    Log time
                  </button>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
