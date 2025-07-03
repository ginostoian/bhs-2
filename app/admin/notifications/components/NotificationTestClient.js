"use client";

import { useState } from "react";

const NotificationTestClient = ({ users }) => {
  const [formData, setFormData] = useState({
    userId: "",
    type: "document_added",
    title: "",
    message: "",
    priority: "medium",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setResult(null);

    try {
      const response = await fetch("/api/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setResult({
          success: true,
          message: "Notification created successfully!",
          data: data.notification,
        });

        // Reset form
        setFormData({
          userId: "",
          type: "document_added",
          title: "",
          message: "",
          priority: "medium",
        });
      } else {
        setResult({
          success: false,
          message: data.error || "Failed to create notification",
        });
      }
    } catch (error) {
      setResult({
        success: false,
        message: "An error occurred while creating the notification",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const createTestNotification = async (
    type,
    title,
    message,
    priority = "medium",
  ) => {
    if (!formData.userId) {
      setResult({
        success: false,
        message: "Please select a user first",
      });
      return;
    }

    setIsSubmitting(true);
    setResult(null);

    try {
      const response = await fetch("/api/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: formData.userId,
          type,
          title,
          message,
          priority,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult({
          success: true,
          message: `Test ${type} notification created successfully!`,
          data: data.notification,
        });
      } else {
        setResult({
          success: false,
          message: data.error || "Failed to create test notification",
        });
      }
    } catch (error) {
      setResult({
        success: false,
        message: "An error occurred while creating the test notification",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* User Selection */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-lg font-semibold">Select User</h2>
        <select
          name="userId"
          value={formData.userId}
          onChange={handleChange}
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

      {/* Quick Test Buttons */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-lg font-semibold">Quick Test Notifications</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <button
            onClick={() =>
              createTestNotification(
                "document_added",
                "New Quote Added",
                "A new quote has been added to your project.",
                "medium",
              )
            }
            disabled={!formData.userId || isSubmitting}
            className="rounded-lg border border-gray-200 p-3 text-left hover:bg-gray-50 disabled:opacity-50"
          >
            <div className="font-medium text-blue-600">Document Added</div>
            <div className="text-sm text-gray-600">Test quote notification</div>
          </button>

          <button
            onClick={() =>
              createTestNotification(
                "payment_due",
                "Payment Due Soon",
                "Payment 'Deposit' is due in 3 days.",
                "high",
              )
            }
            disabled={!formData.userId || isSubmitting}
            className="rounded-lg border border-gray-200 p-3 text-left hover:bg-gray-50 disabled:opacity-50"
          >
            <div className="font-medium text-orange-600">Payment Due</div>
            <div className="text-sm text-gray-600">Test payment reminder</div>
          </button>

          <button
            onClick={() =>
              createTestNotification(
                "payment_overdue",
                "Payment Overdue",
                "Payment 'Final Payment' is overdue. Please contact us.",
                "urgent",
              )
            }
            disabled={!formData.userId || isSubmitting}
            className="rounded-lg border border-gray-200 p-3 text-left hover:bg-gray-50 disabled:opacity-50"
          >
            <div className="font-medium text-red-600">Payment Overdue</div>
            <div className="text-sm text-gray-600">Test overdue payment</div>
          </button>

          <button
            onClick={() =>
              createTestNotification(
                "payment_plan_updated",
                "Payment Plan Updated",
                "Your payment plan has been modified.",
                "medium",
              )
            }
            disabled={!formData.userId || isSubmitting}
            className="rounded-lg border border-gray-200 p-3 text-left hover:bg-gray-50 disabled:opacity-50"
          >
            <div className="font-medium text-green-600">Plan Updated</div>
            <div className="text-sm text-gray-600">Test plan change</div>
          </button>

          <button
            onClick={() =>
              createTestNotification(
                "project_status_changed",
                "Project Status Updated",
                "Your project status has changed from 'Planning' to 'In Progress'.",
                "medium",
              )
            }
            disabled={!formData.userId || isSubmitting}
            className="rounded-lg border border-gray-200 p-3 text-left hover:bg-gray-50 disabled:opacity-50"
          >
            <div className="font-medium text-purple-600">Status Changed</div>
            <div className="text-sm text-gray-600">Test status update</div>
          </button>

          <button
            onClick={() =>
              createTestNotification(
                "announcement",
                "System Maintenance",
                "Scheduled maintenance on Sunday 2-4 AM. Service may be temporarily unavailable.",
                "low",
              )
            }
            disabled={!formData.userId || isSubmitting}
            className="rounded-lg border border-gray-200 p-3 text-left hover:bg-gray-50 disabled:opacity-50"
          >
            <div className="font-medium text-gray-600">Announcement</div>
            <div className="text-sm text-gray-600">
              Test system announcement
            </div>
          </button>
        </div>
      </div>

      {/* Custom Notification Form */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-lg font-semibold">Custom Notification</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Notification Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            >
              <option value="document_added">Document Added</option>
              <option value="payment_due">Payment Due</option>
              <option value="payment_overdue">Payment Overdue</option>
              <option value="payment_plan_updated">Payment Plan Updated</option>
              <option value="project_status_changed">
                Project Status Changed
              </option>
              <option value="announcement">Announcement</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              placeholder="Notification title"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Message
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              placeholder="Notification message"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Priority
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={
              !formData.userId ||
              !formData.title ||
              !formData.message ||
              isSubmitting
            }
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Creating..." : "Create Custom Notification"}
          </button>
        </form>
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
    </div>
  );
};

export default NotificationTestClient;
