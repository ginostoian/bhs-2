"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, ChevronsUpDown, Search, X } from "lucide-react";
import { EmptyState, cx } from "./ui";

// ─────────────────────────────────────────────────────────────────────────────
// Admin design system — interactive pieces (client components).
// ─────────────────────────────────────────────────────────────────────────────

const getValue = (row, column) =>
  column.sortValue
    ? column.sortValue(row)
    : column.key
      ? row[column.key]
      : undefined;

const compare = (a, b) => {
  if (a === b) return 0;
  if (a === null || a === undefined || a === "") return 1;
  if (b === null || b === undefined || b === "") return -1;
  if (a instanceof Date || b instanceof Date) return new Date(a) - new Date(b);
  if (typeof a === "number" && typeof b === "number") return a - b;
  const da = Date.parse(a);
  const db = Date.parse(b);
  if (!Number.isNaN(da) && !Number.isNaN(db) && /\d{4}-\d{2}/.test(a))
    return da - db;
  return String(a).localeCompare(String(b), "en-GB", {
    numeric: true,
    sensitivity: "base",
  });
};

/**
 * Data table: sortable columns, optional row links, sticky header, and a card
 * layout on small screens.
 *
 * columns: [{ key, header, render?(row), sortValue?(row), align?, width?,
 *             sortable?=true, hideOnMobile?, primary? }]
 * rowHref?(row) makes every row a link (keyboard accessible).
 */
export function DataTable({
  columns,
  rows,
  getRowKey = (row) => row._id || row.id,
  rowHref,
  onRowClick,
  initialSort,
  empty,
  dense,
  footer,
}) {
  const router = useRouter();
  const [sort, setSort] = useState(initialSort || null); // { key, dir }

  const sorted = useMemo(() => {
    if (!sort) return rows;
    const column = columns.find((c) => (c.key || c.header) === sort.key);
    if (!column) return rows;
    const copy = [...rows];
    copy.sort((a, b) => compare(getValue(a, column), getValue(b, column)));
    return sort.dir === "desc" ? copy.reverse() : copy;
  }, [rows, sort, columns]);

  const toggleSort = (column) => {
    const key = column.key || column.header;
    setSort((prev) =>
      prev?.key === key
        ? prev.dir === "asc"
          ? { key, dir: "desc" }
          : null
        : { key, dir: "asc" },
    );
  };

  if (!rows.length) {
    return empty || <EmptyState title="Nothing here yet" compact />;
  }

  const open = (row, event) => {
    if (onRowClick) return onRowClick(row, event);
    const href = rowHref?.(row);
    if (!href) return;
    if (event.metaKey || event.ctrlKey) window.open(href, "_blank");
    else router.push(href);
  };
  const clickable = !!(rowHref || onRowClick);
  const cell = (column, row) =>
    column.render ? column.render(row) : (getValue(row, column) ?? "—");
  const primary = columns.find((c) => c.primary) || columns[0];

  return (
    <>
      {/* Desktop / tablet */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-[#D8D2C6] bg-[#FAF8F4]">
              {columns.map((column) => {
                const key = column.key || column.header;
                const sortable =
                  column.sortable !== false && (column.key || column.sortValue);
                const active = sort?.key === key;
                return (
                  <th
                    key={key}
                    scope="col"
                    style={{ width: column.width }}
                    aria-sort={
                      active
                        ? sort.dir === "asc"
                          ? "ascending"
                          : "descending"
                        : undefined
                    }
                    className={cx(
                      "whitespace-nowrap px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-[#7A807B]",
                      column.align === "right" ? "text-right" : "text-left",
                    )}
                  >
                    {sortable ? (
                      <button
                        type="button"
                        onClick={() => toggleSort(column)}
                        className={cx(
                          "inline-flex items-center gap-1 uppercase hover:text-[#202925]",
                          active && "text-[#202925]",
                        )}
                      >
                        {column.header}
                        {active ? (
                          sort.dir === "asc" ? (
                            <ArrowUp className="h-3 w-3" />
                          ) : (
                            <ArrowDown className="h-3 w-3" />
                          )
                        ) : (
                          <ChevronsUpDown className="h-3 w-3 opacity-40" />
                        )}
                      </button>
                    ) : (
                      column.header
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {sorted.map((row) => (
              <tr
                key={getRowKey(row)}
                onClick={
                  clickable
                    ? (e) =>
                        !e.target.closest("a,button,input,select,label") &&
                        open(row, e)
                    : undefined
                }
                onKeyDown={
                  clickable
                    ? (e) =>
                        e.key === "Enter" &&
                        e.target === e.currentTarget &&
                        open(row, e)
                    : undefined
                }
                tabIndex={clickable ? 0 : undefined}
                className={cx(
                  "border-b border-[#EDE9E0] last:border-b-0",
                  clickable &&
                    "cursor-pointer outline-none hover:bg-[#FAF8F4] focus-visible:bg-[#F4F1EA]",
                )}
              >
                {columns.map((column) => (
                  <td
                    key={column.key || column.header}
                    className={cx(
                      "px-4 align-middle text-[#202925]",
                      dense ? "py-2" : "py-3",
                      column.align === "right" && "text-right tabular-nums",
                    )}
                  >
                    {cell(column, row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <ul className="divide-y divide-[#EDE9E0] md:hidden">
        {sorted.map((row) => {
          const href = rowHref?.(row);
          const content = (
            <>
              <div className="font-medium text-[#202925]">
                {cell(primary, row)}
              </div>
              <dl className="mt-1.5 grid grid-cols-2 gap-x-4 gap-y-1">
                {columns
                  .filter((c) => c !== primary && !c.hideOnMobile)
                  .map((column) => (
                    <div key={column.key || column.header} className="min-w-0">
                      <dt className="text-[10px] font-semibold uppercase tracking-wide text-[#A3A8A4]">
                        {column.header}
                      </dt>
                      <dd className="truncate text-[13px] text-[#4A524D]">
                        {cell(column, row)}
                      </dd>
                    </div>
                  ))}
              </dl>
            </>
          );
          return (
            <li key={getRowKey(row)}>
              {href ? (
                <Link
                  href={href}
                  className="block px-4 py-3 active:bg-[#F4F1EA]"
                >
                  {content}
                </Link>
              ) : (
                <div
                  className="px-4 py-3"
                  onClick={onRowClick ? (e) => onRowClick(row, e) : undefined}
                >
                  {content}
                </div>
              )}
            </li>
          );
        })}
      </ul>
      {footer}
    </>
  );
}

/** Search box + filter controls row. */
export function FilterBar({
  search,
  onSearch,
  placeholder = "Search…",
  children,
  right,
}) {
  return (
    <div className="flex flex-col gap-2 border-b border-[#EDE9E0] px-4 py-3 lg:flex-row lg:items-center">
      {onSearch && (
        <div className="relative w-full lg:max-w-xs">
          <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-[#A3A8A4]" />
          <input
            type="search"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder={placeholder}
            aria-label={placeholder}
            className="h-9 w-full rounded-md border border-[#D8D2C6] bg-white pl-8 pr-8 text-sm placeholder:text-[#A3A8A4] focus:border-[#4D5B4B] focus:outline-none focus:ring-1 focus:ring-[#4D5B4B]"
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearch("")}
              aria-label="Clear search"
              className="absolute right-2 top-2.5 text-[#A3A8A4] hover:text-[#202925]"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      )}
      {children && (
        <div className="flex flex-wrap items-center gap-2">{children}</div>
      )}
      {right && (
        <div className="flex items-center gap-2 lg:ml-auto">{right}</div>
      )}
    </div>
  );
}

export const selectClass =
  "h-9 rounded-md border border-[#D8D2C6] bg-white px-2.5 pr-8 text-sm text-[#202925] focus:border-[#4D5B4B] focus:outline-none focus:ring-1 focus:ring-[#4D5B4B]";

/** Compact select bound to a value. options: [[value, label]] */
export function FilterSelect({ value, onChange, options, label }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={label}
      className={selectClass}
    >
      {options.map(([v, l]) => (
        <option key={v} value={v}>
          {l}
        </option>
      ))}
    </select>
  );
}

/** Segmented tabs. items: [{ value, label, count? }] */
export function Tabs({ items, value, onChange, className }) {
  return (
    <div
      role="tablist"
      className={cx(
        "flex gap-1 overflow-x-auto border-b border-[#D8D2C6]",
        className,
      )}
    >
      {items.map((item) => (
        <button
          key={item.value}
          type="button"
          role="tab"
          aria-selected={value === item.value}
          onClick={() => onChange(item.value)}
          className={cx(
            "-mb-px inline-flex items-center gap-1.5 whitespace-nowrap border-b-2 px-3 py-2.5 text-sm font-medium",
            value === item.value
              ? "border-[#4D5B4B] text-[#202925]"
              : "border-transparent text-[#7A807B] hover:text-[#202925]",
          )}
        >
          {item.label}
          {item.count !== undefined && (
            <span
              className={cx(
                "rounded-full px-1.5 text-[11px] tabular-nums",
                value === item.value
                  ? "bg-[#4D5B4B] text-white"
                  : "bg-[#EDE9E0] text-[#4A524D]",
              )}
            >
              {item.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
