"use client";

import { useEffect, useMemo, useState } from "react";

export default function WorkersAdminPage() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("");
  const [active, setActive] = useState("true");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    const params = new URLSearchParams();
    if (query) params.set("query", query);
    if (type) params.set("type", type);
    if (active) params.set("active", active);
    const res = await fetch(`/api/workers?${params.toString()}`);
    const data = await res.json();
    setRows(data.workers || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2 text-3xl font-bold text-gray-900">Workers</h1>
        <p className="text-gray-600">
          Search, add, and manage workers used in attendance.
        </p>
      </div>
      <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-200">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, email, phone, trade"
            className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">All types</option>
            <option value="employee">Employee</option>
            <option value="contractor">Contractor</option>
            <option value="custom">Custom</option>
          </select>
          <select
            value={active}
            onChange={(e) => setActive(e.target.value)}
            className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">All</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
          <div>
            <button
              onClick={load}
              className="w-full rounded bg-blue-600 px-3 py-2 text-white hover:bg-blue-700"
            >
              Search
            </button>
          </div>
        </div>
      </div>
      <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-200">
        {loading ? (
          <div className="p-4 text-gray-500">Loading…</div>
        ) : rows.length ? (
          <table className="min-w-full">
            <thead>
              <tr className="text-left text-sm text-gray-600">
                <th className="p-2">Name</th>
                <th className="p-2">Type</th>
                <th className="p-2">Email</th>
                <th className="p-2">Phone</th>
                <th className="p-2">Active</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((w) => (
                <tr key={w._id} className="border-t text-sm">
                  <td className="p-2">{w.name}</td>
                  <td className="p-2">{w.type}</td>
                  <td className="p-2">{w.email || "—"}</td>
                  <td className="p-2">{w.phone || "—"}</td>
                  <td className="p-2">{w.isActive ? "Yes" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-4 text-gray-500">No workers found</div>
        )}
      </div>
    </div>
  );
}

