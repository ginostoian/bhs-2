"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HardHat } from "lucide-react";
import toast from "react-hot-toast";
import { Badge, EmptyState, buttonClass } from "@/components/admin/ui";
import {
  DataTable,
  FilterBar,
  FilterSelect,
  Tabs,
  selectClass,
} from "@/components/admin/interactive";

const AVAILABILITY = [
  ["available", "Available"],
  ["busy", "Busy"],
  ["unavailable", "Unavailable"],
];

/**
 * Employees list with workload. Deactivated employees move to the
 * "Inactive" tab (they were previously hidden until the next reload and then
 * reappeared without any marker) and can be reactivated from there.
 */
export default function EmployeesList({ employees: initial = [] }) {
  const router = useRouter();
  const [employees, setEmployees] = useState(initial);
  const [tab, setTab] = useState("active");
  const [search, setSearch] = useState("");
  const [availability, setAvailability] = useState("all");
  const [busy, setBusy] = useState(null);

  const patch = async (employee, body, message) => {
    setBusy(employee.id);
    try {
      const res = await fetch(`/api/employees/${employee.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Update failed");
      }
      setEmployees((list) =>
        list.map((e) => (e.id === employee.id ? { ...e, ...body } : e)),
      );
      if (message) toast.success(message);
      router.refresh();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setBusy(null);
    }
  };

  const counts = {
    active: employees.filter((e) => e.isActive).length,
    inactive: employees.filter((e) => !e.isActive).length,
  };

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return employees.filter((e) => {
      if (tab === "active" ? !e.isActive : e.isActive) return false;
      if (availability !== "all" && e.availability !== availability)
        return false;
      if (!q) return true;
      return [e.name, e.email, e.position, e.phone, ...(e.skills || [])]
        .filter(Boolean)
        .some((v) => v.toLowerCase().includes(q));
    });
  }, [employees, tab, search, availability]);

  return (
    <section className="rounded-lg border border-[#D8D2C6] bg-white">
      <Tabs
        className="px-3"
        value={tab}
        onChange={setTab}
        items={[
          { value: "active", label: "Active", count: counts.active },
          { value: "inactive", label: "Inactive", count: counts.inactive },
        ]}
      />
      <FilterBar
        search={search}
        onSearch={setSearch}
        placeholder="Search name, role, skill"
        right={
          <span className="text-xs text-[#7A807B]">{rows.length} people</span>
        }
      >
        <FilterSelect
          label="Availability"
          value={availability}
          onChange={setAvailability}
          options={[["all", "Any availability"], ...AVAILABILITY]}
        />
      </FilterBar>
      <DataTable
        rows={rows}
        getRowKey={(e) => e.id}
        rowHref={(e) => `/admin/employees/${e.id}`}
        initialSort={{ key: "name", dir: "asc" }}
        empty={
          <EmptyState
            icon={HardHat}
            title={
              tab === "inactive" ? "No inactive employees" : "No employees"
            }
            description={
              search || availability !== "all"
                ? "Try clearing the filters."
                : undefined
            }
          />
        }
        columns={[
          {
            header: "Name",
            key: "name",
            primary: true,
            render: (e) => (
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#EDE9E0] text-xs font-semibold text-[#4D5B4B]">
                  {(e.name || e.email || "?").charAt(0).toUpperCase()}
                </span>
                <div className="min-w-0">
                  <div className="truncate font-medium">{e.name}</div>
                  <div className="truncate text-xs text-[#7A807B]">
                    {e.position || "No role set"}
                  </div>
                </div>
              </div>
            ),
          },
          {
            header: "Contact",
            sortValue: (e) => e.email,
            hideOnMobile: true,
            render: (e) => (
              <div className="min-w-0 text-xs">
                <a
                  href={`mailto:${e.email}`}
                  className="block truncate hover:underline"
                >
                  {e.email}
                </a>
                {e.phone && (
                  <a
                    href={`tel:${e.phone}`}
                    className="block whitespace-nowrap text-[#7A807B] hover:underline"
                  >
                    {e.phone}
                  </a>
                )}
              </div>
            ),
          },
          {
            header: "Availability",
            key: "availability",
            render: (e) =>
              e.isActive ? (
                <select
                  value={e.availability}
                  disabled={busy === e.id}
                  aria-label={`Availability for ${e.name}`}
                  onChange={(ev) => patch(e, { availability: ev.target.value })}
                  className={`${selectClass} h-8 text-xs`}
                >
                  {AVAILABILITY.map(([v, l]) => (
                    <option key={v} value={v}>
                      {l}
                    </option>
                  ))}
                </select>
              ) : (
                <Badge tone="neutral">Inactive</Badge>
              ),
          },
          {
            header: "Open tasks",
            key: "openTasks",
            align: "right",
            render: (e) => e.openTasks || "—",
          },
          {
            header: "Tickets",
            key: "openTickets",
            align: "right",
            hideOnMobile: true,
            render: (e) => e.openTickets || "—",
          },
          {
            header: "Days (month)",
            key: "daysThisMonth",
            align: "right",
            render: (e) => e.daysThisMonth || "—",
          },
          {
            header: "Day rate",
            key: "dayRate",
            align: "right",
            hideOnMobile: true,
            render: (e) => (e.dayRate ? `£${e.dayRate}` : "—"),
          },
          {
            header: "",
            sortable: false,
            hideOnMobile: true,
            render: (e) => (
              <div className="flex justify-end gap-1">
                <Link
                  href={`/admin/employees/${e.id}?edit=true`}
                  className={buttonClass("ghost", "sm")}
                >
                  Edit
                </Link>
                {e.isActive ? (
                  <button
                    type="button"
                    disabled={busy === e.id}
                    className={buttonClass("ghost", "sm")}
                    onClick={() =>
                      window.confirm(
                        `Deactivate ${e.name}? They keep their history and can be reactivated from the Inactive tab.`,
                      ) &&
                      patch(e, { isActive: false }, `${e.name} deactivated`)
                    }
                  >
                    Deactivate
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={busy === e.id}
                    className={buttonClass("secondary", "sm")}
                    onClick={() =>
                      patch(e, { isActive: true }, `${e.name} reactivated`)
                    }
                  >
                    Reactivate
                  </button>
                )}
              </div>
            ),
          },
        ]}
      />
    </section>
  );
}
