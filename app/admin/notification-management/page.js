import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import { redirect } from "next/navigation";
import connectMongoose from "@/libs/mongoose";
import User from "@/models/User";
import Notification from "@/models/Notification";
import EmailPreference from "@/models/EmailPreference";
import NotificationManagementClient from "./components/NotificationManagementClient";

/**
 * Admin Notification Management Page
 * Comprehensive interface for managing all notification features
 */
export default async function AdminNotificationManagementPage() {
  // Check authentication and admin access
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "admin") {
    redirect("/dashboard");
  }

  // Connect to MongoDB
  await connectMongoose();

  // Fetch all users with their email preferences
  const users = await User.find({})
    .select("name email role lastLoginAt createdAt")
    .lean()
    .then((docs) =>
      docs.map((doc) => ({
        ...doc,
        id: doc._id.toString(),
        _id: undefined,
      })),
    );

  // Fetch email preferences for all users
  const emailPreferences = await EmailPreference.find({})
    .select("user preferences enabled")
    .lean()
    .then((docs) =>
      docs.map((doc) => ({
        ...doc,
        id: doc._id.toString(),
        userId: doc.user ? doc.user.toString() : null,
        welcomeMessages: doc.preferences?.welcome ?? true,
        documentAdditions: doc.preferences?.documents ?? true,
        paymentReminders: doc.preferences?.payments ?? true,
        projectUpdates: doc.preferences?.projectStatus ?? true,
        systemAnnouncements: doc.preferences?.announcements ?? true,
        _id: undefined,
        user: undefined,
        preferences: undefined,
      })),
    );

  // Fetch recent notifications
  const recentNotifications = await Notification.find({})
    .sort({ createdAt: -1 })
    .limit(50)
    .select("userId type title message read createdAt")
    .lean()
    .then((docs) =>
      docs.map((doc) => ({
        ...doc,
        id: doc._id.toString(),
        userId: doc.userId ? doc.userId.toString() : null,
        _id: undefined,
      })),
    );

  // Get notification statistics
  const notificationStats = await Notification.aggregate([
    {
      $group: {
        _id: "$type",
        count: { $sum: 1 },
        readCount: {
          $sum: { $cond: ["$read", 1, 0] },
        },
      },
    },
  ]);

  // Get user activity statistics
  const userActivityStats = await User.aggregate([
    {
      $group: {
        _id: null,
        totalUsers: { $sum: 1 },
        activeUsers: {
          $sum: {
            $cond: [
              {
                $gte: [
                  "$lastLoginAt",
                  new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
                ],
              },
              1,
              0,
            ],
          },
        },
        inactiveUsers: {
          $sum: {
            $cond: [
              {
                $lt: [
                  "$lastLoginAt",
                  new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
                ],
              },
              1,
              0,
            ],
          },
        },
      },
    },
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Notification Management
        </h1>
        <p className="text-gray-600">
          Comprehensive management of all notification features, email
          preferences, and system announcements
        </p>
      </div>

      <NotificationManagementClient
        users={users}
        emailPreferences={emailPreferences}
        recentNotifications={recentNotifications}
        notificationStats={notificationStats}
        userActivityStats={
          userActivityStats[0] || {
            totalUsers: 0,
            activeUsers: 0,
            inactiveUsers: 0,
          }
        }
      />
    </div>
  );
}
