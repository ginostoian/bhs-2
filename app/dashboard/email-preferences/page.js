"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const EMAIL_TYPES = [
  {
    key: "welcome",
    label: "Welcome Emails",
    description: "Receive a welcome email when your account is created.",
  },
  {
    key: "documents",
    label: "Document Notifications",
    description:
      "Get notified when new quotes, invoices, or documents are added to your project.",
  },
  {
    key: "payments",
    label: "Payment Reminders",
    description: "Receive reminders for upcoming and overdue payments.",
  },
  {
    key: "projectStatus",
    label: "Project Status Updates",
    description:
      "Be alerted when your project status changes (e.g., from Lead to On Going).",
  },
  {
    key: "announcements",
    label: "System Announcements",
    description: "Get important announcements about the platform.",
  },
  {
    key: "marketing",
    label: "Marketing Emails",
    description: "Receive occasional marketing and promotional emails.",
  },
];

export default function EmailPreferencesPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [preferences, setPreferences] = useState({});
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/email-preferences");
      if (!res.ok) throw new Error("Failed to fetch preferences");
      const data = await res.json();
      setPreferences(data.preferences || {});
      setEnabled(data.enabled !== false);
    } catch (e) {
      toast.error("Could not load email preferences");
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (key) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleMasterToggle = () => {
    setEnabled((prev) => !prev);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/email-preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled, preferences }),
      });
      if (!res.ok) throw new Error("Failed to save preferences");
      toast.success("Preferences saved!");
    } catch (e) {
      toast.error("Could not save preferences");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="mb-2 text-2xl font-bold">Email Preferences</h1>
      <p className="mb-6 text-gray-600">
        Control which types of emails you receive from Better Homes Studio.
      </p>
      <div className="mb-6 flex items-center gap-3">
        <label className="text-lg font-semibold">Enable All Emails</label>
        <input
          type="checkbox"
          checked={enabled}
          onChange={handleMasterToggle}
          className="toggle toggle-primary"
        />
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
          className="space-y-6"
        >
          {EMAIL_TYPES.map((type) => (
            <div
              key={type.key}
              className="flex items-center justify-between border-b pb-4"
            >
              <div>
                <div className="font-medium">{type.label}</div>
                <div className="text-sm text-gray-500">{type.description}</div>
              </div>
              <input
                type="checkbox"
                checked={!!preferences[type.key] && enabled}
                disabled={!enabled}
                onChange={() => handleToggle(type.key)}
                className="toggle toggle-primary"
              />
            </div>
          ))}
          <button
            type="submit"
            disabled={saving}
            className="btn btn-primary mt-4"
          >
            {saving ? "Saving..." : "Save Preferences"}
          </button>
        </form>
      )}
    </div>
  );
}
