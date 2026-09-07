"use client";

import { useEffect, useState } from "react";
import { LoaderCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import { ClientPageHeader } from "@/components/client-portal/ClientPage";

const EMAIL_TYPES = [
  {
    key: "welcome",
    label: "Welcome emails",
    description: "Receive a welcome email when your account is created.",
  },
  {
    key: "documents",
    label: "Document notifications",
    description:
      "Get notified when quotes, invoices or documents are added to your project.",
  },
  {
    key: "payments",
    label: "Payment reminders",
    description: "Receive reminders for upcoming and overdue payments.",
  },
  {
    key: "projectStatus",
    label: "Project status updates",
    description: "Be alerted when the status of your project changes.",
  },
  {
    key: "announcements",
    label: "System announcements",
    description: "Get important announcements about the client portal.",
  },
  {
    key: "marketing",
    label: "Marketing emails",
    description: "Receive occasional marketing and promotional emails.",
  },
];

function Toggle({ checked, disabled = false, onChange, label }) {
  return (
    <label className="relative inline-flex min-h-11 cursor-pointer items-center">
      <span className="sr-only">{label}</span>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        className="peer sr-only"
      />
      <span className="h-6 w-11 rounded-full bg-[#d8d4ca] after:absolute after:left-[2px] after:top-[11px] after:h-5 after:w-5 after:rounded-full after:border after:border-[#c8c4ba] after:bg-white after:transition-transform after:content-[''] peer-checked:bg-[#4D5B4B] peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus-visible:ring-2 peer-focus-visible:ring-[#4D5B4B] peer-focus-visible:ring-offset-2 peer-disabled:cursor-not-allowed peer-disabled:opacity-45" />
    </label>
  );
}

export default function EmailPreferencesPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [preferences, setPreferences] = useState({});
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const response = await fetch("/api/email-preferences");
        if (!response.ok) throw new Error("Failed to fetch preferences");
        const data = await response.json();
        setPreferences(data.preferences || {});
        setEnabled(data.enabled !== false);
      } catch (error) {
        console.error("Could not load email preferences:", error);
        toast.error("Could not load email preferences");
      } finally {
        setLoading(false);
      }
    };
    fetchPreferences();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/email-preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled, preferences }),
      });
      if (!response.ok) throw new Error("Failed to save preferences");
      toast.success("Preferences saved");
    } catch (error) {
      console.error("Could not save email preferences:", error);
      toast.error("Could not save preferences");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <ClientPageHeader
        title="Email preferences"
        description="Choose which project and account updates arrive in your inbox."
        meta={{ label: "Notification types", value: EMAIL_TYPES.length }}
      />

      <form
        onSubmit={(event) => {
          event.preventDefault();
          handleSave();
        }}
        className="max-w-4xl"
      >
        <section className="border border-[#D8D2C6] bg-[#F4F1EA]">
          <div className="flex items-center justify-between gap-5 border-b border-[#D8D2C6] px-5 py-5 sm:px-6">
            <div>
              <h2 className="text-sm font-semibold text-[#202925]">
                All email notifications
              </h2>
              <p className="mt-1 text-xs leading-5 text-[#4D5B4B]">
                Pause or resume every portal email with one control.
              </p>
            </div>
            <Toggle
              checked={enabled}
              onChange={() => setEnabled((value) => !value)}
              label="Enable all email notifications"
            />
          </div>

          {loading ? (
            <div className="flex min-h-[260px] items-center justify-center">
              <LoaderCircle className="h-6 w-6 animate-spin text-[#4D5B4B]" />
            </div>
          ) : (
            <div className="divide-y divide-[#e5e2da]">
              {EMAIL_TYPES.map((type) => (
                <div
                  key={type.key}
                  className="flex items-center justify-between gap-5 px-5 py-4 sm:px-6"
                >
                  <div className="min-w-0">
                    <h3 className="text-sm font-medium text-[#202925]">
                      {type.label}
                    </h3>
                    <p className="mt-1 text-xs leading-5 text-[#4D5B4B]">
                      {type.description}
                    </p>
                  </div>
                  <Toggle
                    checked={Boolean(preferences[type.key]) && enabled}
                    disabled={!enabled}
                    onChange={() =>
                      setPreferences((current) => ({
                        ...current,
                        [type.key]: !current[type.key],
                      }))
                    }
                    label={type.label}
                  />
                </div>
              ))}
            </div>
          )}
        </section>

        <div className="mt-5 flex justify-end">
          <button
            type="submit"
            disabled={loading || saving}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-[#4D5B4B] px-5 text-xs font-semibold text-white transition-colors hover:bg-[#3E4A3C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4D5B4B] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
            {saving ? "Saving…" : "Save preferences"}
          </button>
        </div>
      </form>
    </div>
  );
}
