"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Archive } from "lucide-react";
import {
  Badge,
  EmptyState,
  cx,
  formatMoney,
  formatShortDate,
} from "@/components/admin/ui";
import { DataTable, FilterBar } from "@/components/admin/interactive";

export default function FinishedProjectsList({ projects = [] }) {
  const [search, setSearch] = useState("");
  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return projects;
    return projects.filter((p) =>
      [p.name, p.type, p.location, p.client?.name, p.manager]
        .filter(Boolean)
        .some((v) => v.toLowerCase().includes(q)),
    );
  }, [projects, search]);

  return (
    <section className="rounded-lg border border-[#D8D2C6] bg-white">
      <FilterBar
        search={search}
        onSearch={setSearch}
        placeholder="Search project, client, location"
        right={
          <span className="text-xs text-[#7A807B]">{rows.length} projects</span>
        }
      />
      <DataTable
        rows={rows}
        getRowKey={(p) => p.id}
        rowHref={(p) => `/admin/projects/${p.id}`}
        initialSort={{ key: "completionDate", dir: "desc" }}
        empty={
          <EmptyState
            icon={Archive}
            title={search ? "No matches" : "No finished projects yet"}
          />
        }
        columns={[
          {
            header: "Project",
            key: "name",
            primary: true,
            render: (p) => (
              <div className="min-w-0">
                <div className="truncate font-medium">{p.name}</div>
                <div className="truncate text-xs text-[#7A807B]">
                  {[p.type, p.location].filter(Boolean).join(" · ")}
                </div>
              </div>
            ),
          },
          {
            header: "Client",
            sortValue: (p) => p.client?.name || "",
            render: (p) =>
              p.client ? (
                <Link
                  href={`/admin/users/${p.client.id}`}
                  className="hover:underline"
                >
                  {p.client.name}
                </Link>
              ) : (
                <span className="text-[#B42318]">Account missing</span>
              ),
          },
          {
            header: "Completed",
            key: "completionDate",
            render: (p) => (
              <span className="whitespace-nowrap">
                {formatShortDate(p.completionDate)}
                {p.overran && (
                  <Badge tone="warn" className="ml-1.5">
                    Overran
                  </Badge>
                )}
              </span>
            ),
          },
          {
            header: "Duration",
            key: "days",
            align: "right",
            hideOnMobile: true,
            render: (p) => (p.days === null ? "—" : `${p.days}d`),
          },
          {
            header: "Value",
            key: "contract",
            align: "right",
            render: (p) => formatMoney(p.contract),
          },
          {
            header: "Collected",
            key: "collected",
            align: "right",
            render: (p) => (
              <span
                className={cx(
                  p.collected < p.contract && "font-semibold text-[#B42318]",
                )}
              >
                {formatMoney(p.collected)}
              </span>
            ),
          },
          {
            header: "Margin",
            key: "margin",
            align: "right",
            render: (p) =>
              p.margin === null ? (
                "—"
              ) : (
                <span
                  className={cx(
                    "font-semibold",
                    p.margin < 15
                      ? "text-[#B42318]"
                      : p.margin < 25
                        ? "text-[#8A5A00]"
                        : "text-[#2F6B3F]",
                  )}
                >
                  {Math.round(p.margin)}%
                </span>
              ),
          },
        ]}
      />
    </section>
  );
}
