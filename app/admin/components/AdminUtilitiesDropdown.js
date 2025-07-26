"use client";

import { useState, useRef, useEffect } from "react";
import { toast } from "react-hot-toast";
import apiClient from "@/libs/api";

export default function AdminUtilitiesDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLinkingLeads, setIsLinkingLeads] = useState(false);
  const [isSendingBrief, setIsSendingBrief] = useState(false);
  const [isSendingAgingAlert, setIsSendingAgingAlert] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLinkLeadsToUsers = async () => {
    setIsLinkingLeads(true);
    try {
      const response = await fetch("/api/admin/link-leads-to-users", {
        method: "POST",
      });
      const data = await response.json();

      if (data.success) {
        toast.success(`Successfully linked ${data.linkedCount} leads to users`);
      } else {
        toast.error(data.error || "Failed to link leads to users");
      }
    } catch (error) {
      console.error("Error linking leads to users:", error);
      toast.error("Failed to link leads to users");
    } finally {
      setIsLinkingLeads(false);
      setIsOpen(false);
    }
  };

  const handleSendMorningBrief = async () => {
    setIsSendingBrief(true);
    try {
      const response = await apiClient.post("/crm/morning-brief");
      const details = response.details;
      if (details && details.failedSends > 0) {
        toast.success(
          `Morning brief sent to ${details.successfulSends} out of ${details.totalAdmins} admins`,
        );
      } else {
        toast.success(
          `Morning brief sent to all ${details?.totalAdmins || "admins"}`,
        );
      }
    } catch (error) {
      console.error("Error sending morning brief:", error);
      toast.error("Failed to send morning brief");
    } finally {
      setIsSendingBrief(false);
      setIsOpen(false);
    }
  };

  const handleSendAgingAlert = async () => {
    setIsSendingAgingAlert(true);
    try {
      const response = await apiClient.post("/crm/notifications/aging-leads");
      const details = response.details;
      if (details && details.failedSends > 0) {
        toast.success(
          `Aging alert sent to ${details.successfulSends} out of ${details.totalAdmins} admins`,
        );
      } else {
        toast.success(
          `Aging alert sent to all ${details?.totalAdmins || "admins"}`,
        );
      }
    } catch (error) {
      console.error("Error sending aging alert:", error);
      toast.error("Failed to send aging alert");
    } finally {
      setIsSendingAgingAlert(false);
      setIsOpen(false);
    }
  };

  const utilities = [
    {
      name: "Link Leads to Users",
      description: "Automatically link leads to user accounts by email",
      icon: "🔗",
      action: handleLinkLeadsToUsers,
      loading: isLinkingLeads,
    },

    {
      name: "Send Morning Brief",
      description: "Send morning brief email to all admins",
      icon: "📧",
      action: handleSendMorningBrief,
      loading: isSendingBrief,
    },
    {
      name: "Send Aging Alert",
      description: "Send aging leads alert to all admins",
      icon: "⚠️",
      action: handleSendAgingAlert,
      loading: isSendingAgingAlert,
    },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        Utilities
        <svg
          className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-80 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
          <div className="py-1">
            <div className="px-4 py-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
              Admin Actions
            </div>
            {utilities.map((utility) => (
              <button
                key={utility.name}
                onClick={utility.action}
                disabled={utility.loading}
                className="flex w-full items-start gap-3 px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gray-100 text-lg">
                  {utility.loading ? (
                    <div className="loading loading-spinner loading-sm"></div>
                  ) : (
                    utility.icon
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">
                    {utility.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {utility.description}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
