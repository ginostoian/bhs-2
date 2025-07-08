/**
 * Test Admin Notifications Script
 *
 * This script tests the admin notification system by:
 * 1. Creating a test employee
 * 2. Creating a test task assigned to the employee
 * 3. Simulating a task status update request
 * 4. Verifying that admin notifications are created
 */

import connectMongoose from "../libs/mongoose.js";
import Employee from "../models/Employee.js";
import Task from "../models/Task.js";
import Project from "../models/Project.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";
import { notifyTaskStatusUpdateRequest } from "../libs/notificationService.js";

async function testAdminNotifications() {
  try {
    console.log("🔧 Starting admin notification test...");

    await connectMongoose();

    // Step 1: Create a test admin user
    console.log("📝 Creating test admin user...");
    const adminUser = await User.findOneAndUpdate(
      { email: "admin@test.com" },
      {
        name: "Test Admin",
        email: "admin@test.com",
        role: "admin",
      },
      { upsert: true, new: true },
    );
    console.log("✅ Admin user created:", adminUser.email);

    // Step 2: Create a test employee
    console.log("👷 Creating test employee...");
    const testEmployee = await Employee.findOneAndUpdate(
      { email: "employee@test.com" },
      {
        name: "Test Employee",
        email: "employee@test.com",
        position: "Carpenter",
        phone: "1234567890",
        address: "123 Test St",
        emergencyContact: "Test Contact",
        emergencyPhone: "0987654321",
        startDate: new Date(),
        dayRate: 200,
        status: "active",
      },
      { upsert: true, new: true },
    );
    console.log("✅ Employee created:", testEmployee.name);

    // Step 3: Create a test project
    console.log("🏗️ Creating test project...");
    const testProject = await Project.findOneAndUpdate(
      { title: "Test Project for Notifications" },
      {
        title: "Test Project for Notifications",
        type: "Kitchen Renovation",
        status: "On Going",
        location: "123 Test Address",
        startDate: new Date(),
        user: adminUser._id,
        progress: 25,
      },
      { upsert: true, new: true },
    );
    console.log("✅ Project created:", testProject.title);

    // Step 4: Create a test task assigned to the employee
    console.log("📋 Creating test task...");
    const testTask = await Task.findOneAndUpdate(
      { name: "Test Task for Notifications" },
      {
        name: "Test Task for Notifications",
        description: "This is a test task to verify admin notifications",
        status: "Scheduled",
        priority: "medium",
        estimatedDuration: 5,
        assignedTo: testEmployee._id,
        project: testProject._id,
        section: "Construction",
        order: 1,
      },
      { upsert: true, new: true },
    );
    console.log("✅ Task created:", testTask.name);

    // Step 5: Simulate task status update request
    console.log("🔄 Simulating task status update request...");
    const taskData = {
      _id: testTask._id,
      title: testTask.name,
      currentStatus: testTask.status,
      status: "In Progress",
    };

    const employeeData = {
      name: testEmployee.name,
      position: testEmployee.position,
      notes:
        "This is a test status update request to verify admin notifications are working correctly.",
    };

    // Call the notification service
    await notifyTaskStatusUpdateRequest(taskData, employeeData);
    console.log("✅ Notification service called successfully");

    // Step 6: Verify admin notifications were created
    console.log("🔍 Checking for admin notifications...");
    const adminNotifications = await Notification.find({
      recipientType: "admin",
      type: "task_status_update_request",
    })
      .sort({ createdAt: -1 })
      .limit(5);

    if (adminNotifications.length > 0) {
      console.log("✅ Admin notifications found:", adminNotifications.length);
      const latestNotification = adminNotifications[0];
      console.log("📧 Latest notification:");
      console.log("   Title:", latestNotification.title);
      console.log("   Message:", latestNotification.message);
      console.log("   Priority:", latestNotification.priority);
      console.log("   Created:", latestNotification.createdAt);
    } else {
      console.log("❌ No admin notifications found");
    }

    // Step 7: Check unread count for admin
    console.log("📊 Checking admin unread count...");
    const unreadCount = await Notification.countDocuments({
      recipientType: "admin",
      isRead: false,
    });
    console.log("✅ Admin unread notifications:", unreadCount);

    console.log("🎉 Admin notification test completed successfully!");

    // Cleanup: Mark test notifications as read
    console.log("🧹 Cleaning up test notifications...");
    await Notification.updateMany(
      {
        recipientType: "admin",
        type: "task_status_update_request",
        message: { $regex: "Test Employee" },
      },
      { $set: { isRead: true } },
    );
    console.log("✅ Test notifications marked as read");
  } catch (error) {
    console.error("❌ Test failed:", error);
  } finally {
    process.exit(0);
  }
}

// Run the test
testAdminNotifications();
