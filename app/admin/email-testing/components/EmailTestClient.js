"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/Modal";

const EmailTestClient = ({ users }) => {
  const [selectedUser, setSelectedUser] = useState("");
  const [emailType, setEmailType] = useState("welcome");
  const [customData, setCustomData] = useState({
    documentType: "quote",
    documentName: "Sample Quote",
    documentContent: "This is a sample quote for testing purposes.",
    paymentName: "Sample Payment",
    paymentAmount: "1000",
    paymentDueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    oldStatus: "Lead",
    newStatus: "On Going",
    announcementTitle: "System Maintenance",
    announcementMessage:
      "Scheduled maintenance on Sunday 2-4 AM. Service may be temporarily unavailable.",
    announcementPriority: "medium",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailStats, setEmailStats] = useState(null);
  const [result, setResult] = useState(null);
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "alert",
    confirmText: "OK",
  });

  // Fetch email statistics on component mount
  useEffect(() => {
    fetchEmailStats();
  }, []);

  const fetchEmailStats = async () => {
    try {
      const response = await fetch("/api/admin/email-stats");
      if (response.ok) {
        const stats = await response.json();
        setEmailStats(stats);
      }
    } catch (error) {
      console.error("Failed to fetch email stats:", error);
    }
  };

  const handleSendTestEmail = async (type, data = {}) => {
    if (!selectedUser) {
      setModalState({
        isOpen: true,
        title: "Error",
        message: "Please select a user first",
        type: "alert",
        confirmText: "OK",
      });
      return;
    }

    setIsSubmitting(true);
    setResult(null);

    try {
      const response = await fetch("/api/admin/send-test-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: selectedUser,
          emailType: type,
          ...data,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setResult({
          success: true,
          message: "Email sent successfully!",
          data: result,
        });
        // Refresh email stats
        fetchEmailStats();
      } else {
        setResult({
          success: false,
          message: result.error || "Failed to send email",
          data: result,
        });
      }
    } catch (error) {
      setResult({
        success: false,
        message: "Network error: " + error.message,
        data: null,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getEmailTypeConfig = (type) => {
    const configs = {
      welcome: {
        label: "Welcome Email",
        description: "Welcome email for new users",
        icon: "🏠",
        color: "blue",
      },
      document: {
        label: "Document Added",
        description: "Notification when document is added",
        icon: "📄",
        color: "green",
      },
      payment: {
        label: "Payment Due",
        description: "Payment reminder email",
        icon: "💰",
        color: "orange",
      },
      overdue: {
        label: "Payment Overdue",
        description: "Overdue payment notification",
        icon: "🚨",
        color: "red",
      },
      status: {
        label: "Project Status Update",
        description: "Project status change notification",
        icon: "📊",
        color: "purple",
      },
      announcement: {
        label: "System Announcement",
        description: "System-wide announcement",
        icon: "📢",
        color: "gray",
      },
    };
    return configs[type] || configs.welcome;
  };

  const renderCustomFields = () => {
    switch (emailType) {
      case "document":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Document Type
              </label>
              <select
                value={customData.documentType}
                onChange={(e) =>
                  setCustomData({ ...customData, documentType: e.target.value })
                }
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              >
                <option value="quote">Quote</option>
                <option value="invoice">Invoice</option>
                <option value="photo">Photo</option>
                <option value="comment">Comment</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Document Name
              </label>
              <input
                type="text"
                value={customData.documentName}
                onChange={(e) =>
                  setCustomData({ ...customData, documentName: e.target.value })
                }
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Document Content
              </label>
              <textarea
                value={customData.documentContent}
                onChange={(e) =>
                  setCustomData({
                    ...customData,
                    documentContent: e.target.value,
                  })
                }
                rows={3}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
            </div>
          </div>
        );

      case "payment":
      case "overdue":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Payment Name
              </label>
              <input
                type="text"
                value={customData.paymentName}
                onChange={(e) =>
                  setCustomData({ ...customData, paymentName: e.target.value })
                }
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Amount (£)
              </label>
              <input
                type="number"
                step="0.01"
                value={customData.paymentAmount}
                onChange={(e) =>
                  setCustomData({
                    ...customData,
                    paymentAmount: e.target.value,
                  })
                }
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Due Date
              </label>
              <input
                type="date"
                value={customData.paymentDueDate}
                onChange={(e) =>
                  setCustomData({
                    ...customData,
                    paymentDueDate: e.target.value,
                  })
                }
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
            </div>
          </div>
        );

      case "status":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Old Status
              </label>
              <select
                value={customData.oldStatus}
                onChange={(e) =>
                  setCustomData({ ...customData, oldStatus: e.target.value })
                }
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              >
                <option value="Lead">Lead</option>
                <option value="On Going">On Going</option>
                <option value="Finished">Finished</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                New Status
              </label>
              <select
                value={customData.newStatus}
                onChange={(e) =>
                  setCustomData({ ...customData, newStatus: e.target.value })
                }
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              >
                <option value="Lead">Lead</option>
                <option value="On Going">On Going</option>
                <option value="Finished">Finished</option>
              </select>
            </div>
          </div>
        );

      case "announcement":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Announcement Title
              </label>
              <input
                type="text"
                value={customData.announcementTitle}
                onChange={(e) =>
                  setCustomData({
                    ...customData,
                    announcementTitle: e.target.value,
                  })
                }
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Announcement Message
              </label>
              <textarea
                value={customData.announcementMessage}
                onChange={(e) =>
                  setCustomData({
                    ...customData,
                    announcementMessage: e.target.value,
                  })
                }
                rows={3}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Priority
              </label>
              <select
                value={customData.announcementPriority}
                onChange={(e) =>
                  setCustomData({
                    ...customData,
                    announcementPriority: e.target.value,
                  })
                }
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Email Statistics */}
      {emailStats && (
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-semibold">Email Statistics</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="rounded-lg bg-green-50 p-4">
              <div className="text-2xl font-bold text-green-600">
                {emailStats.sent}
              </div>
              <div className="text-sm text-green-700">Emails Sent</div>
            </div>
            <div className="rounded-lg bg-red-50 p-4">
              <div className="text-2xl font-bold text-red-600">
                {emailStats.failed}
              </div>
              <div className="text-sm text-red-700">Emails Failed</div>
            </div>
            <div className="rounded-lg bg-blue-50 p-4">
              <div className="text-2xl font-bold text-blue-600">
                {emailStats.successRate}
              </div>
              <div className="text-sm text-blue-700">Success Rate</div>
            </div>
            <div className="rounded-lg bg-yellow-50 p-4">
              <div className="text-2xl font-bold text-yellow-600">
                {emailStats.totalErrors}
              </div>
              <div className="text-sm text-yellow-700">Total Errors</div>
            </div>
          </div>
        </div>
      )}

      {/* User Selection */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-lg font-semibold">Select User</h2>
        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
        >
          <option value="">Choose a user...</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name || user.email} ({user.role || "user"})
            </option>
          ))}
        </select>
      </div>

      {/* Email Type Selection */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-lg font-semibold">Email Type</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            "welcome",
            "document",
            "payment",
            "overdue",
            "status",
            "announcement",
          ].map((type) => {
            const config = getEmailTypeConfig(type);
            return (
              <button
                key={type}
                onClick={() => setEmailType(type)}
                className={`rounded-lg border p-4 text-left transition-colors ${
                  emailType === type
                    ? `border-${config.color}-500 bg-${config.color}-50`
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <div
                  className={`text-lg ${emailType === type ? `text-${config.color}-600` : "text-gray-600"}`}
                >
                  {config.icon} {config.label}
                </div>
                <div className="text-sm text-gray-500">
                  {config.description}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Fields */}
      {emailType !== "welcome" && (
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-semibold">Email Details</h2>
          {renderCustomFields()}
        </div>
      )}

      {/* Send Button */}
      <div className="rounded-lg bg-white p-6 shadow">
        <button
          onClick={() => {
            const config = getEmailTypeConfig(emailType);
            let data = {};

            switch (emailType) {
              case "document":
                data = {
                  documentType: customData.documentType,
                  documentName: customData.documentName,
                  documentContent: customData.documentContent,
                };
                break;
              case "payment":
              case "overdue":
                data = {
                  paymentName: customData.paymentName,
                  paymentAmount: parseFloat(customData.paymentAmount),
                  paymentDueDate: customData.paymentDueDate,
                  isOverdue: emailType === "overdue",
                };
                break;
              case "status":
                data = {
                  oldStatus: customData.oldStatus,
                  newStatus: customData.newStatus,
                };
                break;
              case "announcement":
                data = {
                  title: customData.announcementTitle,
                  message: customData.announcementMessage,
                  priority: customData.announcementPriority,
                };
                break;
            }

            handleSendTestEmail(emailType, data);
          }}
          disabled={!selectedUser || isSubmitting}
          className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting
            ? "Sending..."
            : `Send ${getEmailTypeConfig(emailType).label}`}
        </button>
      </div>

      {/* Result Display */}
      {result && (
        <div
          className={`rounded-lg p-4 ${
            result.success
              ? "border border-green-200 bg-green-50"
              : "border border-red-200 bg-red-50"
          }`}
        >
          <div
            className={`font-medium ${
              result.success ? "text-green-800" : "text-red-800"
            }`}
          >
            {result.success ? "Success!" : "Error"}
          </div>
          <div
            className={`text-sm ${
              result.success ? "text-green-700" : "text-red-700"
            }`}
          >
            {result.message}
          </div>
          {result.data && (
            <div className="mt-2 text-xs text-green-600">
              <pre>{JSON.stringify(result.data, null, 2)}</pre>
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={modalState.isOpen}
        onClose={() =>
          setModalState({
            isOpen: false,
            title: "",
            message: "",
            type: "alert",
            confirmText: "OK",
          })
        }
        title={modalState.title}
        message={modalState.message}
        confirmText={modalState.confirmText}
        type={modalState.type}
      />
    </div>
  );
};

export default EmailTestClient;
