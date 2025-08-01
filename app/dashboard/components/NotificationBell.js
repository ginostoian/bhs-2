"use client";

import { useState, useEffect, useRef } from "react";
import {
  Bell,
  Check,
  X,
  Clock,
  FileText,
  CreditCard,
  AlertCircle,
  RefreshCw,
  CheckCircle,
} from "lucide-react";

/**
 * NotificationBell Component
 *
 * Features:
 * - Real-time notification display with optimized polling
 * - Polls every 5 minutes when tab is visible (only for active users)
 * - Stops polling when tab is hidden to save resources
 * - Fetches immediately when tab becomes visible
 * - Shows last updated time for transparency
 * - Only polls for users with "Lead" or "On Going" project status
 */
const NotificationBell = ({ userProjectStatus }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const dropdownRef = useRef(null);

  // Check if user should receive real-time notifications
  const shouldPollForNotifications = () => {
    const activeStatuses = ["Lead", "On Going"];
    return userProjectStatus && activeStatuses.includes(userProjectStatus);
  };

  // Fetch notifications
  const fetchNotifications = async () => {
    // Don't fetch if component is unmounting
    if (!document.hidden) {
      try {
        const response = await fetch("/api/notifications?limit=10");
        if (response.ok) {
          const data = await response.json();
          setNotifications(data.notifications);
          setUnreadCount(data.unreadCount);
          setLastUpdated(new Date());
        }
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      const response = await fetch("/api/notifications/mark-read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationIds: [notificationId] }),
      });

      if (response.ok) {
        const data = await response.json();
        setUnreadCount(data.unreadCount);
        setNotifications((prev) =>
          prev.map((notif) =>
            notif.id === notificationId ? { ...notif, isRead: true } : notif,
          ),
        );
      }
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/notifications/mark-read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAll: true }),
      });

      if (response.ok) {
        const data = await response.json();
        setUnreadCount(data.unreadCount);
        setNotifications((prev) =>
          prev.map((notif) => ({ ...notif, isRead: true })),
        );
      }
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Get icon for notification type
  const getNotificationIcon = (type) => {
    switch (type) {
      case "document_added":
        return <FileText className="h-4 w-4 text-blue-500" />;
      case "payment_due":
      case "payment_overdue":
        return <CreditCard className="h-4 w-4 text-orange-500" />;
      case "payment_plan_updated":
        return <CreditCard className="h-4 w-4 text-green-500" />;
      case "project_status_changed":
        return <AlertCircle className="h-4 w-4 text-purple-500" />;
      case "project_change_added":
        return <RefreshCw className="h-4 w-4 text-blue-500" />;
      case "project_change_status_changed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "announcement":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "urgent":
        return "border-l-red-500";
      case "high":
        return "border-l-orange-500";
      case "medium":
        return "border-l-blue-500";
      case "low":
        return "border-l-gray-500";
      default:
        return "border-l-blue-500";
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 48) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString();
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch notifications when dropdown opens
  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  // Fetch notifications on initial mount (only for active users)
  useEffect(() => {
    if (shouldPollForNotifications()) {
      fetchNotifications();
    }
  }, []);

  // Poll for new notifications every 5 minutes, only when tab is visible and user is active
  useEffect(() => {
    let interval;

    const startPolling = () => {
      // Only start polling if the tab is visible AND user has active project status
      if (!document.hidden && shouldPollForNotifications()) {
        interval = setInterval(() => {
          fetchNotifications();
        }, 300000); // 5 minutes (300,000 ms)
      }
    };

    const stopPolling = () => {
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopPolling();
      } else {
        // When tab becomes visible, fetch immediately and start polling (if user is active)
        if (shouldPollForNotifications()) {
          fetchNotifications();
          startPolling();
        }
      }
    };

    // Initial setup
    startPolling();

    // Listen for visibility changes
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Cleanup
    return () => {
      stopPolling();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative rounded-full p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 max-h-96 w-80 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 p-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                Notifications
              </h3>
              {!shouldPollForNotifications() && (
                <p className="mt-1 text-xs text-gray-500">
                  Real-time updates disabled (inactive project)
                </p>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                disabled={isLoading}
                className="text-xs text-blue-600 hover:text-blue-800 disabled:opacity-50"
              >
                {isLoading ? "Marking..." : "Mark all read"}
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <Bell className="mx-auto mb-2 h-8 w-8 opacity-50" />
                <p className="text-sm">No notifications</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`border-l-4 p-4 transition-colors hover:bg-gray-50 ${
                      notification.isRead ? "opacity-75" : ""
                    } ${getPriorityColor(notification.priority)}`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="mt-0.5 flex-shrink-0">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between">
                          <p
                            className={`text-sm font-medium ${
                              notification.isRead
                                ? "text-gray-600"
                                : "text-gray-900"
                            }`}
                          >
                            {notification.title}
                          </p>
                          {!notification.isRead && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="ml-2 flex-shrink-0 rounded p-1 text-gray-400 hover:text-gray-600"
                            >
                              <Check className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                        <p className="mt-1 text-sm text-gray-600">
                          {notification.message}
                        </p>
                        <div className="mt-2 flex items-center text-xs text-gray-400">
                          <Clock className="mr-1 h-3 w-3" />
                          {formatDate(notification.createdAt)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 bg-gray-50 p-3">
            {notifications.length > 0 && (
              <button
                onClick={() => {
                  // Navigate to full notifications page (to be implemented)
                  setIsOpen(false);
                }}
                className="mb-2 w-full text-center text-xs text-blue-600 hover:text-blue-800"
              >
                View all notifications
              </button>
            )}
            {lastUpdated && (
              <div className="text-center text-xs text-gray-500">
                Last updated: {lastUpdated.toLocaleTimeString()}
                {shouldPollForNotifications() && (
                  <span className="ml-2 text-green-600">• Live</span>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
