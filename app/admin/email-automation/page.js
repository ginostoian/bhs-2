"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import apiClient from "@/libs/api";

export default function EmailAutomationPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processingEmails, setProcessingEmails] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    leadsByStage: false,
    recentEmails: false,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/crm/email-automation");
      setStats(response.stats);
    } catch (error) {
      console.error("Error fetching email automation stats:", error);
      toast.error("Failed to fetch automation statistics");
    } finally {
      setLoading(false);
    }
  };

  const processDueEmails = async () => {
    try {
      setProcessingEmails(true);
      const response = await apiClient.post("/crm/email-automation", {
        action: "process_due_emails",
      });

      toast.success(response.message);
      fetchStats(); // Refresh stats after processing
    } catch (error) {
      console.error("Error processing due emails:", error);
      toast.error("Failed to process due emails");
    } finally {
      setProcessingEmails(false);
    }
  };

  const resumeAutomation = async (leadId) => {
    try {
      const response = await apiClient.post(
        `/crm/leads/${leadId}/resume-automation`,
        {
          reason: "Manual resume by admin",
        },
      );

      toast.success("Email automation resumed successfully");
      fetchStats(); // Refresh stats after resuming
    } catch (error) {
      console.error("Error resuming automation:", error);
      toast.error("Failed to resume automation");
    }
  };

  const initializeAllAutomations = async () => {
    try {
      const response = await apiClient.post("/crm/email-automation", {
        action: "initialize_all_automations",
      });

      toast.success(response.message);
      fetchStats(); // Refresh stats after initialization
    } catch (error) {
      console.error("Error initializing automations:", error);
      toast.error("Failed to initialize automations");
    }
  };

  const formatEmailType = (type) => {
    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(amount || 0);
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const getStatusBadge = (automation) => {
    if (!automation.isActive) {
      return (
        <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
          Paused
        </span>
      );
    }
    if (automation.leadReplied) {
      return (
        <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
          Replied
        </span>
      );
    }
    return (
      <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
        Active
      </span>
    );
  };

  // Countdown Timer Component
  const CountdownTimer = ({ nextEmailDue, stage }) => {
    const [timeLeft, setTimeLeft] = useState("");

    useEffect(() => {
      if (!nextEmailDue) {
        setTimeLeft("No email scheduled");
        return;
      }

      const updateTimer = () => {
        const now = new Date();
        const dueDate = new Date(nextEmailDue);
        const diff = dueDate - now;

        if (diff <= 0) {
          setTimeLeft("Due now");
        } else {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor(
            (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
          );
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

          if (days > 0) {
            setTimeLeft(`${days}d ${hours}h`);
          } else if (hours > 0) {
            setTimeLeft(`${hours}h ${minutes}m`);
          } else {
            setTimeLeft(`${minutes}m`);
          }
        }
      };

      updateTimer();
      const interval = setInterval(updateTimer, 60000); // Update every minute

      return () => clearInterval(interval);
    }, [nextEmailDue]);

    if (!nextEmailDue) {
      return <span className="text-xs text-gray-500">No email scheduled</span>;
    }

    const isOverdue = new Date(nextEmailDue) <= new Date();

    return (
      <span
        className={`text-xs font-medium ${
          isOverdue
            ? "text-red-600"
            : new Date(nextEmailDue) - new Date() < 1000 * 60 * 60 * 2 // Less than 2 hours
              ? "text-orange-600"
              : "text-green-600"
        }`}
      >
        {isOverdue ? "⚠️ " : "⏰ "}
        {timeLeft}
      </span>
    );
  };

  const getNextEmailDue = (automation) => {
    switch (automation.currentStage) {
      case "Lead":
        return automation.leadNextEmailDue;
      case "Qualified":
        return automation.qualifiedNextEmailDue;
      case "Proposal Sent":
        return automation.proposalNextEmailDue;
      case "Negotiations":
        return automation.negotiationsNextEmailDue;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          Email Automation Management
        </h1>
        <p className="text-gray-600">
          Monitor and manage automated email sequences for CRM leads
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={processDueEmails}
          disabled={processingEmails}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {processingEmails ? (
            <>
              <div className="loading loading-spinner loading-sm"></div>
              Processing...
            </>
          ) : (
            <>
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
              Process Due Emails
            </>
          )}
        </button>
        <button
          onClick={fetchStats}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Refresh Stats
        </button>
        <button
          onClick={initializeAllAutomations}
          className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Initialize All Automations
        </button>
      </div>

      {stats && (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Overview Stats */}
          <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              Overview
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Automations</span>
                <span className="text-2xl font-semibold text-gray-900">
                  {stats.totalAutomations}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Active Automations</span>
                <span className="text-2xl font-semibold text-green-600">
                  {stats.activeAutomations}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Paused Automations</span>
                <span className="text-2xl font-semibold text-orange-600">
                  {stats.pausedAutomations}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Leads Who Replied</span>
                <span className="text-2xl font-semibold text-blue-600">
                  {stats.leadsReplied || 0}
                </span>
              </div>
            </div>
          </div>

          {/* Stage Distribution */}
          <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              Automations by Stage
            </h2>
            <div className="space-y-3">
              {stats.stageStats?.map((stage) => (
                <div
                  key={stage._id}
                  className="flex items-center justify-between"
                >
                  <span className="text-gray-600">{stage._id}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">
                      {stage.count}
                    </span>
                    <span className="text-sm text-gray-500">
                      ({stage.active} active)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Email Statistics */}
          <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200 lg:col-span-2">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              Email Statistics
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Email Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Total Sent
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Successful
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Success Rate
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {stats.emailStats?.map((emailStat) => (
                    <tr key={emailStat._id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                        {formatEmailType(emailStat._id)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                        {emailStat.count}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-green-600">
                        {emailStat.success}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                        {emailStat.count > 0
                          ? `${((emailStat.success / emailStat.count) * 100).toFixed(1)}%`
                          : "0%"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Lead Lists by Stage */}
      <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
        <div
          className="flex cursor-pointer items-center justify-between"
          onClick={() => toggleSection("leadsByStage")}
        >
          <h2 className="text-xl font-semibold text-gray-900">
            Detailed Lead Lists by Stage
          </h2>
          <svg
            className={`h-5 w-5 transform transition-transform ${
              expandedSections.leadsByStage ? "rotate-180" : ""
            }`}
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
        </div>

        {expandedSections.leadsByStage && (
          <div className="mt-6 space-y-6">
            {Object.entries(stats.leadsByStage || {}).map(([stage, leads]) => (
              <div key={stage} className="rounded-lg border border-gray-200">
                <div className="bg-gray-50 px-4 py-3">
                  <h3 className="font-semibold text-gray-900">
                    {stage} Stage ({leads.length} leads)
                  </h3>
                </div>
                <div className="divide-y divide-gray-200">
                  {leads.map((lead) => (
                    <div key={lead._id} className="px-4 py-3">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <h4 className="font-medium text-gray-900">
                              {lead.leadName}
                            </h4>
                            {getStatusBadge(lead)}
                          </div>
                          <p className="text-sm text-gray-600">
                            {lead.leadEmail}
                          </p>
                          <div className="mt-1 flex items-center gap-4 text-xs text-gray-500">
                            <span>Value: {formatCurrency(lead.leadValue)}</span>
                            <span>Emails sent: {lead.emailsSent || 0}</span>
                          </div>
                          <div className="mt-1 flex items-center gap-4 text-xs">
                            <CountdownTimer
                              nextEmailDue={getNextEmailDue(lead)}
                              stage={lead.currentStage}
                            />
                            {lead.nextEmailDue && (
                              <span className="text-gray-500">
                                Due: {formatDate(lead.nextEmailDue)}
                              </span>
                            )}
                          </div>
                          {lead.pausedReason && (
                            <p className="mt-1 text-xs text-red-600">
                              Paused: {lead.pausedReason}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => resumeAutomation(lead.leadId)}
                            className="rounded bg-blue-600 px-3 py-1 text-xs text-white hover:bg-blue-700"
                          >
                            Resume
                          </button>
                          <a
                            href={`/admin/crm?lead=${lead.leadId}`}
                            className="rounded bg-gray-600 px-3 py-1 text-xs text-white hover:bg-gray-700"
                          >
                            View Lead
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Email History */}
      <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
        <div
          className="flex cursor-pointer items-center justify-between"
          onClick={() => toggleSection("recentEmails")}
        >
          <h2 className="text-xl font-semibold text-gray-900">
            Recent Email History (Last 20)
          </h2>
          <svg
            className={`h-5 w-5 transform transition-transform ${
              expandedSections.recentEmails ? "rotate-180" : ""
            }`}
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
        </div>

        {expandedSections.recentEmails && (
          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Lead
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Email Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Subject
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Sent At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {stats.recentEmails?.map((email, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {email.leadName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {email.leadEmail}
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      {formatEmailType(email.emailType)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="max-w-xs truncate">
                        {email.subject || "No subject"}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {formatDate(email.sentAt)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {email.success ? (
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                          Sent
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
                          Failed
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Information Panel */}
      <div className="rounded-xl bg-blue-50 p-6 ring-1 ring-blue-200">
        <h3 className="mb-4 text-lg font-semibold text-blue-900">
          Email Automation Rules
        </h3>
        <div className="grid grid-cols-1 gap-6 text-sm text-blue-800 md:grid-cols-2">
          <div>
            <h4 className="mb-3 font-semibold text-blue-900">Lead Stage</h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="mt-1 text-blue-600">•</span>
                <span>1 introduction email sent immediately</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 text-blue-600">•</span>
                <span>4 follow-up emails every 2 days</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 text-blue-600">•</span>
                <span>Moves to &quot;Never replied&quot; after 5 emails</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 font-semibold text-blue-900">
              Qualified Stage
            </h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="mt-1 text-blue-600">•</span>
                <span>Admin notifications every 2 days</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 text-blue-600">•</span>
                <span>Reminds admin to send quote</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 font-semibold text-blue-900">
              Proposal Sent Stage
            </h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="mt-1 text-blue-600">•</span>
                <span>First follow-up after 1 day</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 text-blue-600">•</span>
                <span>Subsequent follow-ups every 2 days</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 text-blue-600">•</span>
                <span>Different email content for each follow-up</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 font-semibold text-blue-900">
              Negotiations Stage
            </h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="mt-1 text-blue-600">•</span>
                <span>Admin notifications every 2 days</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 text-blue-600">•</span>
                <span>Reminds admin to move deal forward</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-6 rounded-lg bg-blue-100 p-4">
          <p className="text-sm text-blue-900">
            <strong>Note:</strong> All emails are BCC&apos;d to
            contact@celli.co.uk and logged as activities. Automation stops when
            leads are moved to &quot;Won&quot; or &quot;Lost&quot; stages or
            when aging is paused.
          </p>
        </div>
      </div>
    </div>
  );
}
