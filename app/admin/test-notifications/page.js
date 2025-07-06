"use client";

import { useState } from "react";

export default function TestNotificationsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);

  const testNotification = async (testType) => {
    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/test-notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ testType }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult({ success: true, message: data.message });
      } else {
        setResult({ success: false, message: data.error });
      }
    } catch (error) {
      setResult({ success: false, message: "Failed to test notification" });
    } finally {
      setIsLoading(false);
    }
  };

  const testTypes = [
    {
      key: "user_registration",
      label: "User Registration",
      description: "Notify admins when a new user registers",
    },
    {
      key: "employee_creation",
      label: "Employee Creation",
      description: "Notify admins when a new employee is created",
    },
    {
      key: "task_assignment",
      label: "Task Assignment",
      description: "Notify current user about task assignment",
    },
    {
      key: "system_alert",
      label: "System Alert",
      description: "Send a high-priority system alert to all admins",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Test Notifications</h1>
        <p className="text-gray-600">
          Test the notification system for different events
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {testTypes.map((test) => (
          <div key={test.key} className="rounded-lg border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900">{test.label}</h3>
            <p className="mt-1 text-sm text-gray-600">{test.description}</p>
            <button
              onClick={() => testNotification(test.key)}
              disabled={isLoading}
              className="mt-3 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? "Testing..." : "Test Notification"}
            </button>
          </div>
        ))}
      </div>

      {result && (
        <div
          className={`rounded-lg p-4 ${
            result.success
              ? "border border-green-200 bg-green-50"
              : "border border-red-200 bg-red-50"
          }`}
        >
          <p
            className={`text-sm ${
              result.success ? "text-green-800" : "text-red-800"
            }`}
          >
            {result.message}
          </p>
        </div>
      )}

      <div className="rounded-lg border border-gray-200 p-4">
        <h3 className="font-semibold text-gray-900">Instructions</h3>
        <ul className="mt-2 space-y-1 text-sm text-gray-600">
          <li>• Click any test button to create a sample notification</li>
          <li>
            • Check the notification bell in the header to see the notification
          </li>
          <li>• Notifications are role-based (admin, employee, user)</li>
          <li>
            • Real notifications will be created automatically for actual events
          </li>
        </ul>
      </div>
    </div>
  );
}
