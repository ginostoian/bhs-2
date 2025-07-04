"use client";

import { useEffect, useState } from "react";

export default function EmailAnalyticsPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/email-stats");
      if (!res.ok) throw new Error("Failed to fetch stats");
      setStats(await res.json());
    } catch (e) {
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = async () => {
    setClearing(true);
    try {
      await fetch("/api/admin/email-stats", { method: "DELETE" });
      await fetchStats();
    } catch (e) {}
    setClearing(false);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-2 text-2xl font-bold">Email Analytics</h1>
      <p className="mb-6 text-gray-600">
        Monitor email delivery and errors for your platform.
      </p>
      <div className="mb-6 flex gap-4">
        <button
          className="btn btn-secondary"
          onClick={fetchStats}
          disabled={loading}
        >
          Refresh
        </button>
        <button
          className="btn btn-error"
          onClick={handleClear}
          disabled={clearing}
        >
          {clearing ? "Clearing..." : "Clear Stats"}
        </button>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : stats ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="rounded-lg bg-green-50 p-4">
              <div className="text-2xl font-bold text-green-600">
                {stats.sent}
              </div>
              <div className="text-sm text-green-700">Emails Sent</div>
            </div>
            <div className="rounded-lg bg-red-50 p-4">
              <div className="text-2xl font-bold text-red-600">
                {stats.failed}
              </div>
              <div className="text-sm text-red-700">Emails Failed</div>
            </div>
            <div className="rounded-lg bg-blue-50 p-4">
              <div className="text-2xl font-bold text-blue-600">
                {stats.successRate}
              </div>
              <div className="text-sm text-blue-700">Success Rate</div>
            </div>
            <div className="rounded-lg bg-yellow-50 p-4">
              <div className="text-2xl font-bold text-yellow-600">
                {stats.totalErrors}
              </div>
              <div className="text-sm text-yellow-700">Total Errors</div>
            </div>
          </div>
          <div>
            <h2 className="mb-2 text-lg font-semibold">Recent Errors</h2>
            {stats.recentErrors && stats.recentErrors.length > 0 ? (
              <ul className="space-y-2">
                {stats.recentErrors.map((err, i) => (
                  <li key={i} className="rounded bg-red-100 p-2 text-sm">
                    <div>
                      <b>To:</b> {err.recipient}
                    </div>
                    <div>
                      <b>Subject:</b> {err.subject}
                    </div>
                    <div>
                      <b>Error:</b> {err.error}
                    </div>
                    <div>
                      <b>Time:</b> {err.timestamp}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-gray-500">No recent errors.</div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-red-600">Failed to load stats.</div>
      )}
    </div>
  );
}
