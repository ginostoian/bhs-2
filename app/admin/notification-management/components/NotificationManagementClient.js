"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

export default function NotificationManagementClient({
  users,
  emailPreferences,
  recentNotifications,
  notificationStats,
  userActivityStats,
}) {
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(false);
  const [systemAnnouncement, setSystemAnnouncement] = useState({
    title: "",
    message: "",
    priority: "normal",
  });

  // Group email preferences by user
  const userEmailPreferences = emailPreferences.reduce((acc, pref) => {
    if (pref.userId) {
      acc[pref.userId] = pref;
    }
    return acc;
  }, {});

  // Get user name by ID
  const getUserName = (userId) => {
    if (!userId) return "Unknown User";
    const user = users.find((u) => u.id === userId);
    return user ? user.name : "Unknown User";
  };

  // Send system announcement
  const sendSystemAnnouncement = async () => {
    if (!systemAnnouncement.title || !systemAnnouncement.message) {
      toast.error("Please fill in both title and message");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/admin/system-announcement", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(systemAnnouncement),
      });

      if (response.ok) {
        toast.success("System announcement sent successfully!");
        setSystemAnnouncement({ title: "", message: "", priority: "normal" });
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to send announcement");
      }
    } catch (error) {
      toast.error("Failed to send announcement");
    } finally {
      setLoading(false);
    }
  };

  // Update user email preferences
  const updateEmailPreferences = async (userId, preferences) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/users/${userId}/email-preferences`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(preferences),
      });

      if (response.ok) {
        toast.success("Email preferences updated successfully!");
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to update preferences");
      }
    } catch (error) {
      toast.error("Failed to update preferences");
    } finally {
      setLoading(false);
    }
  };

  // Send test notification
  const sendTestNotification = async (userId, type) => {
    setLoading(true);
    try {
      const response = await fetch("/api/notifications/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, type }),
      });

      if (response.ok) {
        toast.success("Test notification sent successfully!");
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to send test notification");
      }
    } catch (error) {
      toast.error("Failed to send test notification");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "overview", name: "Overview", icon: "📊" },
    { id: "email-preferences", name: "Email Preferences", icon: "📧" },
    { id: "system-announcements", name: "System Announcements", icon: "📢" },
    { id: "notifications", name: "Recent Notifications", icon: "🔔" },
    { id: "user-activity", name: "User Activity", icon: "👥" },
  ];

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`border-b-2 px-1 py-2 text-sm font-medium ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg bg-white p-6 shadow">
              <div className="flex items-center">
                <div className="rounded-lg bg-blue-100 p-2">
                  <span className="text-2xl">👥</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Total Users
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {userActivityStats.totalUsers}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow">
              <div className="flex items-center">
                <div className="rounded-lg bg-green-100 p-2">
                  <span className="text-2xl">✅</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Active Users
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {userActivityStats.activeUsers}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow">
              <div className="flex items-center">
                <div className="rounded-lg bg-yellow-100 p-2">
                  <span className="text-2xl">⚠️</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Inactive Users
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {userActivityStats.inactiveUsers}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow">
              <div className="flex items-center">
                <div className="rounded-lg bg-purple-100 p-2">
                  <span className="text-2xl">📧</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Email Prefs
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {emailPreferences.length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Notification Statistics */}
          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="mb-4 text-lg font-medium text-gray-900">
              Notification Statistics
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {notificationStats.map((stat) => (
                <div key={stat._id} className="rounded-lg border p-4">
                  <p className="text-sm font-medium capitalize text-gray-600">
                    {stat._id.replace(/([A-Z])/g, " $1").trim()}
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stat.count}
                  </p>
                  <p className="text-sm text-gray-500">
                    {stat.readCount} read (
                    {Math.round((stat.readCount / stat.count) * 100)}%)
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Email Preferences Tab */}
      {activeTab === "email-preferences" && (
        <div className="space-y-6">
          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="mb-4 text-lg font-medium text-gray-900">
              User Email Preferences
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Welcome
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Documents
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Payments
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Projects
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Announcements
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {users.map((user) => {
                    const preferences = userEmailPreferences[user.id] || {
                      welcomeMessages: true,
                      documentAdditions: true,
                      paymentReminders: true,
                      projectUpdates: true,
                      systemAnnouncements: true,
                    };

                    return (
                      <tr key={user.id}>
                        <td className="whitespace-nowrap px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {user.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {user.email}
                            </div>
                          </div>
                        </td>
                        {[
                          "welcomeMessages",
                          "documentAdditions",
                          "paymentReminders",
                          "projectUpdates",
                          "systemAnnouncements",
                        ].map((pref) => (
                          <td
                            key={pref}
                            className="whitespace-nowrap px-6 py-4"
                          >
                            <button
                              onClick={() =>
                                updateEmailPreferences(user.id, {
                                  [pref]: !preferences[pref],
                                })
                              }
                              className={`rounded-full px-3 py-1 text-xs font-medium ${
                                preferences[pref]
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {preferences[pref] ? "Enabled" : "Disabled"}
                            </button>
                          </td>
                        ))}
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                          <button
                            onClick={() =>
                              sendTestNotification(user.id, "welcome")
                            }
                            className="mr-2 text-blue-600 hover:text-blue-900"
                          >
                            Test
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* System Announcements Tab */}
      {activeTab === "system-announcements" && (
        <div className="space-y-6">
          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="mb-4 text-lg font-medium text-gray-900">
              Send System Announcement
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  value={systemAnnouncement.title}
                  onChange={(e) =>
                    setSystemAnnouncement({
                      ...systemAnnouncement,
                      title: e.target.value,
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Announcement title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Message
                </label>
                <textarea
                  value={systemAnnouncement.message}
                  onChange={(e) =>
                    setSystemAnnouncement({
                      ...systemAnnouncement,
                      message: e.target.value,
                    })
                  }
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Announcement message"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Priority
                </label>
                <select
                  value={systemAnnouncement.priority}
                  onChange={(e) =>
                    setSystemAnnouncement({
                      ...systemAnnouncement,
                      priority: e.target.value,
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <button
                onClick={sendSystemAnnouncement}
                disabled={loading}
                className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send Announcement"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recent Notifications Tab */}
      {activeTab === "notifications" && (
        <div className="space-y-6">
          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="mb-4 text-lg font-medium text-gray-900">
              Recent Notifications
            </h3>
            <div className="space-y-4">
              {recentNotifications
                .filter((notification) => notification.userId)
                .map((notification) => (
                  <div
                    key={notification.id}
                    className={`rounded-lg border p-4 ${
                      notification.read ? "bg-gray-50" : "bg-white"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">
                          {notification.title}
                        </h4>
                        <p className="mt-1 text-sm text-gray-600">
                          {notification.message}
                        </p>
                        <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                          <span>To: {getUserName(notification.userId)}</span>
                          <span>Type: {notification.type}</span>
                          <span>
                            {new Date(
                              notification.createdAt,
                            ).toLocaleDateString()}
                          </span>
                          {notification.read && (
                            <span className="text-green-600">✓ Read</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* User Activity Tab */}
      {activeTab === "user-activity" && (
        <div className="space-y-6">
          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="mb-4 text-lg font-medium text-gray-900">
              User Activity Overview
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Last Login
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {users.map((user) => {
                    const lastLogin = user.lastLoginAt
                      ? new Date(user.lastLoginAt)
                      : null;
                    const isActive = lastLogin
                      ? lastLogin >
                        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                      : false;
                    const isInactive =
                      !lastLogin ||
                      lastLogin <
                        new Date(Date.now() - 10 * 24 * 60 * 60 * 1000);

                    return (
                      <tr key={user.id}>
                        <td className="whitespace-nowrap px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {user.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {user.email}
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <span
                            className={`rounded-full px-2 py-1 text-xs font-medium ${
                              user.role === "admin"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                          {lastLogin ? lastLogin.toLocaleDateString() : "Never"}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <span
                            className={`rounded-full px-2 py-1 text-xs font-medium ${
                              isInactive
                                ? "bg-red-100 text-red-800"
                                : isActive
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {isInactive
                              ? "Inactive"
                              : isActive
                                ? "Active"
                                : "Recent"}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                          {isInactive && (
                            <button
                              onClick={() =>
                                sendTestNotification(user.id, "inactivity")
                              }
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Send Reminder
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
