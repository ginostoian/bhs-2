"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Trash2, Users } from "lucide-react";
import {
  Badge,
  EmptyState,
  buttonClass,
  formatShortDate,
} from "@/components/admin/ui";
import {
  DataTable,
  FilterBar,
  FilterSelect,
  Tabs,
} from "@/components/admin/interactive";

const PAGE_SIZE = 25;
const STATUSES = ["Lead", "On Going", "Finished"];

// What we show as a client's status: live projects win over the manual field
const displayStatus = (user) => {
  if (user.role && user.role !== "user") return null;
  if (user.projects?.ongoing) return { label: "On site", tone: "olive" };
  if (user.projectStatus === "Finished" || user.projects?.finished)
    return { label: "Past client", tone: "good" };
  if (user.projectStatus === "On Going")
    return { label: "On Going", tone: "olive" };
  return { label: "Lead", tone: "info" };
};

/**
 * Users & clients list: server-side search, filters and pagination.
 */
export default function UsersList({
  users: initialUsers = [],
  totalUsers = 0,
}) {
  const [users, setUsers] = useState(initialUsers);
  const [total, setTotal] = useState(totalUsers);
  const [group, setGroup] = useState("all");
  const [status, setStatus] = useState("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const firstLoad = useRef(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: PAGE_SIZE });
      if (search.trim()) params.set("search", search.trim());
      if (status !== "All") params.set("status", status);
      if (group !== "all") params.set("group", group);
      const res = await fetch(`/api/users?${params}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setUsers(data.users || []);
      setTotal(data.totalCount || 0);
    } catch {
      toast.error("Couldn't load users");
    } finally {
      setLoading(false);
    }
  }, [page, search, status, group]);

  // Always fetch once on mount so rows include live project counts
  useEffect(() => {
    const delay = firstLoad.current ? 0 : 250;
    firstLoad.current = false;
    const timer = setTimeout(load, delay);
    return () => clearTimeout(timer);
  }, [load]);

  const changeStatus = async (user, next) => {
    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectStatus: next }),
      });
      if (!res.ok) throw new Error();
      setUsers((list) =>
        list.map((u) => (u.id === user.id ? { ...u, projectStatus: next } : u)),
      );
      toast.success(`${user.name || user.email} marked as ${next}`);
    } catch {
      toast.error("Couldn't update the status");
    }
  };

  const remove = async (user) => {
    if (
      !window.confirm(
        `Delete ${user.name || user.email}? This can't be undone.`,
      )
    )
      return;
    const res = await fetch(`/api/users/${user.id}`, { method: "DELETE" });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      toast.error(data.error || "Couldn't delete the user", { duration: 6000 });
      return;
    }
    toast.success("User deleted");
    load();
  };

  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <section className="rounded-lg border border-[#D8D2C6] bg-white">
      <Tabs
        className="px-4"
        value={group}
        onChange={(value) => {
          setGroup(value);
          setPage(1);
        }}
        items={[
          { value: "all", label: "Everyone" },
          { value: "clients", label: "Clients" },
          { value: "staff", label: "Staff & partners" },
        ]}
      />
      <FilterBar
        search={search}
        onSearch={(value) => {
          setSearch(value);
          setPage(1);
        }}
        placeholder="Search name, email, phone or address"
        right={
          <span className="text-xs text-[#7A807B]">
            {loading
              ? "Loading…"
              : `${total} ${total === 1 ? "user" : "users"}`}
          </span>
        }
      >
        {group !== "staff" && (
          <FilterSelect
            label="Client status"
            value={status}
            onChange={(value) => {
              setStatus(value);
              setPage(1);
            }}
            options={[["All", "Any status"], ...STATUSES.map((s) => [s, s])]}
          />
        )}
      </FilterBar>

      <DataTable
        rows={users}
        getRowKey={(u) => u.id}
        rowHref={(u) => `/admin/users/${u.id}`}
        empty={
          <EmptyState
            icon={Users}
            title={search ? `No users match “${search}”` : "No users here yet"}
            description="Try a different filter, or add a user above."
          />
        }
        columns={[
          {
            header: "Name",
            key: "name",
            primary: true,
            render: (u) => (
              <div className="min-w-0">
                <div className="truncate font-medium">{u.name || "—"}</div>
                <div className="truncate text-xs text-[#7A807B]">{u.email}</div>
              </div>
            ),
          },
          {
            header: "Role",
            key: "role",
            render: (u) => (
              <Badge
                tone={
                  u.role === "admin"
                    ? "clay"
                    : u.role && u.role !== "user"
                      ? "olive"
                      : "neutral"
                }
                className="capitalize"
              >
                {u.role === "user" || !u.role ? "Client" : u.role}
              </Badge>
            ),
          },
          {
            header: "Status",
            sortValue: (u) => displayStatus(u)?.label || "",
            render: (u) => {
              const s = displayStatus(u);
              if (!s) return <span className="text-[#A3A8A4]">—</span>;
              // With projects the status is derived; otherwise it's set by hand
              if (u.projects?.ongoing || u.projects?.finished)
                return <Badge tone={s.tone}>{s.label}</Badge>;
              return (
                <select
                  aria-label={`Status for ${u.name || u.email}`}
                  title="No projects yet — set the status by hand"
                  value={u.projectStatus || "Lead"}
                  onChange={(e) => changeStatus(u, e.target.value)}
                  className="h-7 rounded-md border border-[#D8D2C6] bg-white px-2 text-xs"
                >
                  {STATUSES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              );
            },
          },
          {
            header: "Projects",
            sortValue: (u) =>
              (u.projects?.ongoing || 0) * 100 + (u.projects?.finished || 0),
            render: (u) =>
              u.projects?.ongoing || u.projects?.finished ? (
                <span className="text-sm">
                  {u.projects.ongoing ? `${u.projects.ongoing} on site` : ""}
                  {u.projects.ongoing && u.projects.finished ? " · " : ""}
                  {u.projects.finished ? `${u.projects.finished} finished` : ""}
                </span>
              ) : (
                <span className="text-[#A3A8A4]">—</span>
              ),
          },
          {
            header: "Phone",
            key: "phone",
            hideOnMobile: true,
            render: (u) => u.phone || <span className="text-[#A3A8A4]">—</span>,
          },
          {
            header: "Joined",
            key: "createdAt",
            render: (u) => formatShortDate(u.createdAt),
          },
          {
            header: "",
            sortable: false,
            hideOnMobile: true,
            render: (u) => (
              <div className="flex items-center justify-end gap-1">
                <button
                  type="button"
                  onClick={() => remove(u)}
                  aria-label={`Delete ${u.name || u.email}`}
                  title="Delete user"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md text-[#A3A8A4] hover:bg-[#FDF0EE] hover:text-[#B42318]"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ),
          },
        ]}
      />

      {pages > 1 && (
        <div className="flex items-center justify-between border-t border-[#EDE9E0] px-4 py-3 text-sm">
          <span className="text-[#7A807B]">
            Page {page} of {pages}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              className={buttonClass("secondary", "sm")}
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </button>
            <button
              type="button"
              className={buttonClass("secondary", "sm")}
              disabled={page >= pages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
